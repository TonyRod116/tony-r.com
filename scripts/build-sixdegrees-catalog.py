"""Pack the existing public CS50 dataset for a browser worker. Requires PyArrow.

Source Parquet files are read only. No network, accounts or trading code.
The versioned little-endian format uses shared typed-array sections and UTF-8.
"""
from array import array
from collections import defaultdict
from pathlib import Path
import gzip
import hashlib
import json
import re
import struct
import sys
import unicodedata
import pyarrow.parquet as pq

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'public/demos-data/data'
OUTPUT = ROOT / 'public/demos-data/degrees'


def norm(text):
    return ''.join(c for c in unicodedata.normalize('NFKD', text).lower() if not unicodedata.category(c).startswith('M'))


def strings(values):
    offsets = array('I', [0])
    blob = bytearray()
    for value in values:
        blob.extend(value.encode('utf-8'))
        offsets.append(len(blob))
    return offsets, bytes(blob)


def year(value):
    return int(value) if value and str(value).isdigit() and int(value) < 65536 else 0


def csr(pairs, rows):
    pairs = list(pairs)
    offsets = array('I', [0]) * (rows + 1)
    for row, _ in pairs:
        offsets[row + 1] += 1
    for i in range(rows):
        offsets[i + 1] += offsets[i]
    values = array('I', (value for _, value in sorted(pairs)))
    return offsets, values


def raw(value):
    if isinstance(value, array):
        if sys.byteorder != 'little':
            value.byteswap()
        return value.tobytes()
    return value


def delta(values, starts=None):
    ranges = zip(starts, starts[1:]) if starts is not None else [(0, len(values))]
    for start, end in ranges:
        previous = 0
        for i in range(start, end):
            value = values[i]
            values[i] = (value - previous) & 0xffffffff
            previous = value
    return values


def main():
    people = pq.read_table(SOURCE / 'people.parquet').to_pydict()
    movies = pq.read_table(SOURCE / 'movies.parquet').to_pydict()
    stars = pq.read_table(SOURCE / 'stars.parquet').to_pydict()
    pmap = {key: i for i, key in enumerate(people['id'])}
    mmap = {key: i for i, key in enumerate(movies['id'])}
    assert len(pmap) == len(people['id']) and len(mmap) == len(movies['id'])
    assert all(isinstance(name, str) and name.strip() for name in people['name'])
    historical = json.loads((ROOT / 'src/assets/large/sample-data.json').read_text())
    assert set(historical['people']).issubset(pmap), 'Historical names must all remain available'

    pairs = set()
    missing_person = missing_movie = duplicates = future_credits = 0
    for person, movie in zip(stars['person_id'], stars['movie_id']):
        if person not in pmap:
            missing_person += 1
            continue
        if movie not in mmap:
            missing_movie += 1
            continue
        if year(movies['year'][mmap[movie]]) > 2026:
            future_credits += 1
            continue
        pair = pmap[person], mmap[movie]
        if pair in pairs:
            duplicates += 1
        pairs.add(pair)
    original_credits = len(stars['person_id'])
    del stars
    poff, pmovies = csr(pairs, len(pmap))
    moff, mpeople = csr(((movie, person) for person, movie in pairs), len(mmap))
    assert len(pmovies) == len(mpeople) == len(pairs)

    token_people = defaultdict(lambda: array('I'))
    for i, name in enumerate(people['name']):
        for word in set(re.findall(r'[^\W_]+', norm(name), re.UNICODE)):
            token_people[word].append(i)
    words = sorted(token_people)
    woffs, wblob = strings(words)
    wpeopleoffs = array('I', [0])
    wpeople = array('I')
    wmasks = array('I')
    wlens = array('H')
    for word in words:
        mask = 0
        for character in word:
            mask |= 1 << (ord(character) & 31)
        wmasks.append(mask)
        wlens.append(len(word))
        wpeople.extend(token_people[word])
        wpeopleoffs.append(len(wpeople))
    del token_people
    noff, nblob = strings(people['name'])
    toff, tblob = strings(movies['title'])
    delta(pmovies, poff); delta(mpeople, moff); delta(wpeople, wpeopleoffs)
    sections = list(map(raw, [delta(array('I', map(int, people['id']))), array('H', map(year, people['birth'])), delta(noff), nblob,
                             delta(array('I', map(int, movies['id']))), array('H', map(year, movies['year'])), delta(toff), tblob,
                             delta(poff), pmovies, delta(moff), mpeople, delta(woffs), wblob, wmasks, wlens, delta(wpeopleoffs), wpeople]))
    header = bytearray(b'MPDEG001' + struct.pack('<6I', len(pmap), len(mmap), len(pairs), len(words), len(wpeople), len(sections)))
    start = len(header) + len(sections) * 8
    payload = bytearray()
    for section in sections:
        padding = (-(start + len(payload))) % 4
        payload.extend(b'\0' * padding)
        header.extend(struct.pack('<2I', start + len(payload), len(section)))
        payload.extend(section)
    binary = bytes(header + payload)
    packed = gzip.compress(binary, compresslevel=9, mtime=0)
    sha = lambda data: hashlib.sha256(data).hexdigest()
    filename = f'catalog-{sha(binary)[:12]}.bin.gz'
    OUTPUT.mkdir(parents=True, exist_ok=True)
    (OUTPUT / filename).write_bytes(packed)
    manifest = {
        'format': 'MPDEG001', 'asset': f'/demos-data/degrees/{filename}',
        'people': len(pmap), 'movies': len(mmap), 'credits': len(pairs), 'vocabulary': len(words),
        'compressed_bytes': len(packed), 'binary_bytes': len(binary),
        'compressed_sha256': sha(packed), 'binary_sha256': sha(binary),
        'source': 'Existing original CS50 AI / IMDb dataset; historical snapshot, not current filmography',
        'source_url': 'https://cs50.harvard.edu/ai/projects/0/degrees/',
        'source_files': {name: sha((SOURCE / name).read_bytes()) for name in ['people.parquet', 'movies.parquet', 'stars.parquet']},
        'original_credit_rows': original_credits, 'dropped_missing_people': missing_person,
        'dropped_missing_movies': missing_movie, 'duplicate_credits': duplicates,
        'excluded_future_credit_rows': future_credits, 'credit_year_cutoff': 2026,
        'historical_names_preserved': len(historical['people']),
    }
    (OUTPUT / 'manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps(manifest, ensure_ascii=False, indent=2), flush=True)


if __name__ == '__main__':
    main()
