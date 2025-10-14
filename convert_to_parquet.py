#!/usr/bin/env python3
import pyarrow as pa
import pyarrow.parquet as pq
import csv
import os

def convert_csv_to_parquet():
    """Convert CSV files to Parquet format using PyArrow"""
    
    # Define paths
    csv_dir = "public/demos/data"
    parquet_dir = "public/demos/data"
    
    # Convert people.csv
    print("Converting people.csv to Parquet...")
    people_data = []
    with open(f"{csv_dir}/people.csv", 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            people_data.append({
                'id': row['id'],
                'name': row['name'],
                'birth': row['birth'] if row['birth'] else None
            })
    
    people_table = pa.Table.from_pydict({
        'id': [p['id'] for p in people_data],
        'name': [p['name'] for p in people_data],
        'birth': [p['birth'] for p in people_data]
    })
    pq.write_table(people_table, f"{parquet_dir}/people.parquet")
    print(f"People: {len(people_data)} records converted")
    
    # Convert movies.csv
    print("Converting movies.csv to Parquet...")
    movies_data = []
    with open(f"{csv_dir}/movies.csv", 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            movies_data.append({
                'id': row['id'],
                'title': row['title'],
                'year': row['year'] if row['year'] else None
            })
    
    movies_table = pa.Table.from_pydict({
        'id': [m['id'] for m in movies_data],
        'title': [m['title'] for m in movies_data],
        'year': [m['year'] for m in movies_data]
    })
    pq.write_table(movies_table, f"{parquet_dir}/movies.parquet")
    print(f"Movies: {len(movies_data)} records converted")
    
    # Convert stars.csv
    print("Converting stars.csv to Parquet...")
    stars_data = []
    with open(f"{csv_dir}/stars.csv", 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            stars_data.append({
                'person_id': row['person_id'],
                'movie_id': row['movie_id']
            })
    
    stars_table = pa.Table.from_pydict({
        'person_id': [s['person_id'] for s in stars_data],
        'movie_id': [s['movie_id'] for s in stars_data]
    })
    pq.write_table(stars_table, f"{parquet_dir}/stars.parquet")
    print(f"Stars: {len(stars_data)} records converted")
    
    print("All files converted successfully!")
    
    # Show file sizes
    for filename in ["people.parquet", "movies.parquet", "stars.parquet"]:
        filepath = f"{parquet_dir}/{filename}"
        size_mb = os.path.getsize(filepath) / (1024 * 1024)
        print(f"{filename}: {size_mb:.2f} MB")

if __name__ == "__main__":
    convert_csv_to_parquet()