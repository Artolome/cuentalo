#!/usr/bin/env python3
"""Generate/cache the Spanish exploration recordings; --verify-only needs no network.

External development dependencies: edge-tts, soundfile, NumPy, and Node.js.
No Python dependency is copied into the game or required during playback.
"""
from __future__ import annotations

import argparse
import asyncio
import hashlib
import json
import shutil
import subprocess
from pathlib import Path

import numpy as np
import soundfile as sf

ROOT = Path(__file__).resolve().parents[1]
DESTINATION = ROOT / 'src' / 'audio' / 'exploration'
PROVIDER = 'Microsoft Edge Neural TTS'
FIELDS = ('text', 'voice', 'rate', 'pitch')
WORLDS = ('don_quijote', 'macondo', 'borges', 'frida')


class InvalidAudio(RuntimeError):
    pass


def expected_keys():
    keys = set()
    for world in WORLDS:
        keys.update((world + '.intro', world + '.summary'))
        for i in range(6):
            keys.add(f'{world}.story.{i}')
            for level in ('easy', 'normal'):
                keys.add(f'{world}.goal.{i}.{level}')
            for j in range(2):
                keys.add(f'{world}.dialogue.{i}.{j}')
    return keys


def load_catalogue(node):
    program = """
const path = require('path'), root = process.argv[1];
const read = name => require(path.join(root, 'src', name));
const entries = read('exploration-audio-catalog.js').create(
  read('exploration-data.js'), read('exploration-stories.js'), read('exploration-dialogues.js'));
process.stdout.write(JSON.stringify(entries));
"""
    result = subprocess.run([node, '-e', program, str(ROOT)], check=True, capture_output=True, encoding='utf-8')
    entries = json.loads(result.stdout)
    if len(entries) != 128 or {e['key'] for e in entries} != expected_keys():
        raise ValueError('The catalogue must contain precisely the 128 expected keys.')
    for entry in entries:
        if set(entry) != {'key', 'text', 'voice', 'rate', 'pitch', 'file'}:
            raise ValueError('Unexpected catalogue fields: ' + entry['key'])
        if entry['file'] != entry['key'] + '.mp3' or any(c in entry['file'] for c in '/\\'):
            raise ValueError('Unsafe or unexpected filename: ' + entry['file'])
        if not all(isinstance(entry[k], str) and entry[k] for k in entry):
            raise ValueError('Empty catalogue field: ' + entry['key'])
    return entries


def fingerprint(entry):
    value = json.dumps({field: entry[field] for field in FIELDS}, ensure_ascii=False, sort_keys=True, separators=(',', ':'))
    return hashlib.sha256(value.encode('utf-8')).hexdigest()


def file_sha256(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def decode_mp3(path):
    """Decode the complete file to PCM, checking it contains finite, non-silent audio."""
    try:
        with sf.SoundFile(path) as recording:
            if recording.format != 'MP3' or recording.samplerate <= 0:
                raise InvalidAudio('Not a valid MP3: ' + str(path))
            # One sequential read avoids mpg123 reservoir warnings after block seeks.
            samples = recording.read(dtype='float32', always_2d=True)
            if not np.isfinite(samples).all():
                raise InvalidAudio('Non-finite PCM: ' + str(path))
            frames = len(samples)
            peak = float(np.abs(samples).max(initial=0.0))
            if frames <= 0 or peak < 1e-6:
                raise InvalidAudio('Empty or silent MP3: ' + str(path))
            return round(frames / recording.samplerate, 6)
    except (sf.LibsndfileError, OSError, ValueError) as error:
        raise InvalidAudio('Cannot decode ' + str(path)) from error


def record_for(entry, path, duration):
    return {**{field: entry[field] for field in ('file',) + FIELDS}, 'sha256': file_sha256(path), 'duration': duration}


def save_manifest(manifest):
    path = DESTINATION / 'manifest.json'
    temporary = DESTINATION / 'manifest.json.tmp'
    ordered = {**manifest, 'clips': dict(sorted(manifest['clips'].items()))}
    temporary.write_text(json.dumps(ordered, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    temporary.replace(path)


def verify(entries, manifest):
    if manifest.get('version') != 1 or manifest.get('provider') != PROVIDER:
        raise ValueError('Unexpected manifest version/provider.')
    clips = manifest.get('clips', {})
    if set(clips) != expected_keys():
        raise ValueError('The manifest does not contain precisely all 128 expected keys.')
    if {p.name for p in DESTINATION.glob('*.mp3')} != {e['file'] for e in entries}:
        raise ValueError('The MP3 filenames do not match the catalogue.')
    duration, size = 0.0, 0
    for entry in entries:
        clip, path = clips[entry['key']], DESTINATION / entry['file']
        if any(clip.get(field) != entry[field] for field in ('file',) + FIELDS):
            raise ValueError('Manifest/catalogue mismatch: ' + entry['key'])
        if clip.get('sha256') != file_sha256(path):
            raise ValueError('MP3 hash mismatch: ' + entry['key'])
        seconds = decode_mp3(path)
        if abs(seconds - clip.get('duration', -1)) > 0.001:
            raise ValueError('MP3 duration mismatch: ' + entry['key'])
        duration += seconds
        size += path.stat().st_size
    return {'clips': len(clips), 'bytes': size, 'duration_seconds': round(duration, 3), 'decoded': len(clips)}


async def generate(entries, jobs, retries):
    import aiohttp
    import edge_tts

    DESTINATION.mkdir(parents=True, exist_ok=True)
    path = DESTINATION / 'manifest.json'
    previous = json.loads(path.read_text(encoding='utf-8')) if path.exists() else {}
    manifest = {'version': 1, 'provider': PROVIDER, 'clips': {}}
    groups, cache = {}, {}
    for entry in entries:
        groups.setdefault(fingerprint(entry), []).append(entry)
        old, file = previous.get('clips', {}).get(entry['key']), DESTINATION / entry['file']
        if not old or any(old.get(f) != entry[f] for f in ('file',) + FIELDS) or not file.exists():
            continue
        try:
            if old.get('sha256') != file_sha256(file):
                continue
            seconds = decode_mp3(file)
        except InvalidAudio:
            continue
        manifest['clips'][entry['key']] = record_for(entry, file, seconds)
        cache[fingerprint(entry)] = (file, seconds)
    save_manifest(manifest)
    semaphore = asyncio.Semaphore(jobs)
    completed = 0

    def transient(error):
        if isinstance(error, aiohttp.ClientResponseError):
            return error.status in (408, 429) or 500 <= error.status <= 599
        return isinstance(error, (aiohttp.ClientError, asyncio.TimeoutError, ConnectionError, InvalidAudio,
                                  edge_tts.exceptions.NoAudioReceived, edge_tts.exceptions.UnexpectedResponse,
                                  edge_tts.exceptions.WebSocketError))

    async def produce(signature, group):
        nonlocal completed
        async with semaphore:
            first = group[0]
            reused = signature in cache
            if reused:
                source, seconds = cache[signature]
            else:
                source = DESTINATION / first['file']
                temporary = DESTINATION / ('.' + first['file'] + '.part')
                for attempt in range(retries + 1):
                    try:
                        communicator = edge_tts.Communicate(first['text'], first['voice'], rate=first['rate'], pitch=first['pitch'])
                        await communicator.save(str(temporary))
                        seconds = await asyncio.to_thread(decode_mp3, temporary)
                        temporary.replace(source)
                        break
                    except Exception as error:
                        temporary.unlink(missing_ok=True)
                        if attempt >= retries or not transient(error):
                            raise RuntimeError('Failed to generate ' + first['key']) from error
                        print(f"retry {attempt+1}/{retries}: {first['key']} ({type(error).__name__})", flush=True)
                        await asyncio.sleep(2 ** attempt)
            for entry in group:
                destination = DESTINATION / entry['file']
                if source != destination:
                    shutil.copyfile(source, destination)
                manifest['clips'][entry['key']] = record_for(entry, destination, seconds)
            completed += len(group)
            save_manifest(manifest)
            print(f"{completed:3}/128 {'cached' if reused else 'generated'} {first['key']} ({seconds:.2f}s)", flush=True)

    results = await asyncio.gather(*(produce(key, group) for key, group in groups.items()), return_exceptions=True)
    failures = [result for result in results if isinstance(result, BaseException)]
    if failures:
        for error in failures:
            print(str(error), flush=True)
        raise RuntimeError(f'{len(failures)} audio group(s) failed; valid clips are cached in the manifest.')
    return manifest


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--node', default=shutil.which('node') or 'node')
    parser.add_argument('--jobs', type=int, choices=(1, 2, 3), default=2)
    parser.add_argument('--retries', type=int, choices=(0, 1, 2), default=2)
    parser.add_argument('--verify-only', action='store_true', help='Decode and check the current files without network requests.')
    args = parser.parse_args()
    entries = load_catalogue(args.node)
    if args.verify_only:
        manifest = json.loads((DESTINATION/'manifest.json').read_text(encoding='utf-8'))
    else:
        manifest = asyncio.run(generate(entries, args.jobs, args.retries))
    print(json.dumps(verify(entries, manifest), ensure_ascii=False), flush=True)


if __name__ == '__main__':
    main()
