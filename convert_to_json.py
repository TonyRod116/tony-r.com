#!/usr/bin/env python3
import pyarrow.parquet as pq
import json
import os

def convert_parquet_to_json():
    """Convert Parquet files to JSON using only PyArrow"""
    
    # Define paths
    parquet_dir = "public/demos/data"
    json_dir = "public/demos/data"
    
    # Convert people.parquet to JSON
    print("Converting people.parquet to JSON...")
    people_table = pq.read_table(f"{parquet_dir}/people.parquet")
    
    # Convert to Python dictionaries
    people_data = []
    for i in range(min(10000, people_table.num_rows)):  # Limit to 10000 records
        row = people_table.slice(i, 1)
        people_data.append({
            'id': str(row.column('id')[0].as_py()),
            'name': str(row.column('name')[0].as_py()),
            'birth': str(row.column('birth')[0].as_py()) if row.column('birth')[0].as_py() is not None else None
        })
    
    with open(f"{json_dir}/people.json", 'w', encoding='utf-8') as f:
        json.dump(people_data, f, ensure_ascii=False, indent=2)
    
    print(f"People: {len(people_data)} records converted")
    
    # Convert movies.parquet to JSON
    print("Converting movies.parquet to JSON...")
    movies_table = pq.read_table(f"{parquet_dir}/movies.parquet")
    
    movies_data = []
    for i in range(min(5000, movies_table.num_rows)):  # Limit to 5000 records
        row = movies_table.slice(i, 1)
        movies_data.append({
            'id': str(row.column('id')[0].as_py()),
            'title': str(row.column('title')[0].as_py()),
            'year': str(row.column('year')[0].as_py()) if row.column('year')[0].as_py() is not None else None
        })
    
    with open(f"{json_dir}/movies.json", 'w', encoding='utf-8') as f:
        json.dump(movies_data, f, ensure_ascii=False, indent=2)
    
    print(f"Movies: {len(movies_data)} records converted")
    
    # Convert stars.parquet to JSON
    print("Converting stars.parquet to JSON...")
    stars_table = pq.read_table(f"{parquet_dir}/stars.parquet")
    
    stars_data = []
    for i in range(min(20000, stars_table.num_rows)):  # Limit to 20000 records
        row = stars_table.slice(i, 1)
        stars_data.append({
            'person_id': str(row.column('person_id')[0].as_py()),
            'movie_id': str(row.column('movie_id')[0].as_py())
        })
    
    with open(f"{json_dir}/stars.json", 'w', encoding='utf-8') as f:
        json.dump(stars_data, f, ensure_ascii=False, indent=2)
    
    print(f"Stars: {len(stars_data)} records converted")
    
    print("All files converted successfully!")
    
    # Show file sizes
    for filename in ["people.json", "movies.json", "stars.json"]:
        filepath = f"{json_dir}/{filename}"
        size_mb = os.path.getsize(filepath) / (1024 * 1024)
        print(f"{filename}: {size_mb:.2f} MB")

if __name__ == "__main__":
    convert_parquet_to_json()