#!/usr/bin/env python3
"""
Script to update the Six Degrees HTML file to use Parquet instead of CSV
"""

def update_html_file():
    html_file = "public/demos/six-degrees.html"
    
    # Read the current HTML file
    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace the loadData function with Parquet version
    old_loadData = '''        function loadData() {
            // Show loading indicator
            document.getElementById('loading').style.display = 'block';
            document.getElementById('findBtn').disabled = true;
            
            // Load real data from CSV files
            fetch('/demos/data/people.csv')
                .then(response => response.text())
                .then(csvText => {
                    const lines = csvText.split('\\n');
                    for (let i = 1; i < lines.length; i++) { // Skip header
                        const line = lines[i].trim();
                        if (line) {
                            const [id, name, birth] = line.split(',');
                            if (id && name) {
                                const cleanId = id.replace(/"/g, '');
                                const cleanName = name.replace(/"/g, '');
                                const cleanBirth = birth ? birth.replace(/"/g, '') : '';
                                
                                people[cleanId] = {
                                    name: cleanName,
                                    birth: cleanBirth,
                                    movies: new Set()
                                };
                                
                                if (!names[cleanName.toLowerCase()]) {
                                    names[cleanName.toLowerCase()] = new Set();
                                }
                                names[cleanName.toLowerCase()].add(cleanId);
                            }
                        }
                    }
                    
                    console.log(`Loaded ${Object.keys(people).length} people`);
                    
                    // Load movies
                    return fetch('/demos/data/movies.csv');
                })
                .then(response => response.text())
                .then(csvText => {
                    const lines = csvText.split('\\n');
                    for (let i = 1; i < lines.length; i++) { // Skip header
                        const line = lines[i].trim();
                        if (line) {
                            const [id, title, year] = line.split(',');
                            if (id && title) {
                                const cleanId = id.replace(/"/g, '');
                                const cleanTitle = title.replace(/"/g, '');
                                const cleanYear = year ? year.replace(/"/g, '') : '';
                                
                                movies[cleanId] = {
                                    title: cleanTitle,
                                    year: cleanYear,
                                    stars: new Set()
                                };
                            }
                        }
                    }
                    
                    console.log(`Loaded ${Object.keys(movies).length} movies`);
                    
                    // Load stars
                    return fetch('/demos/data/stars.csv');
                })
                .then(response => response.text())
                .then(csvText => {
                    const lines = csvText.split('\\n');
                    for (let i = 1; i < lines.length; i++) { // Skip header
                        const line = lines[i].trim();
                        if (line) {
                            const [personId, movieId] = line.split(',');
                            if (personId && movieId) {
                                const cleanPersonId = personId.replace(/"/g, '');
                                const cleanMovieId = movieId.replace(/"/g, '');
                                
                                if (people[cleanPersonId] && movies[cleanMovieId]) {
                                    people[cleanPersonId].movies.add(cleanMovieId);
                                    movies[cleanMovieId].stars.add(cleanPersonId);
                                }
                            }
                        }
                    }
                    
                    console.log('Data loaded successfully!');
                    console.log(`Final: ${Object.keys(people).length} people and ${Object.keys(movies).length} movies`);
                    
                    // Hide loading indicator and enable button
                    document.getElementById('loading').style.display = 'none';
                    document.getElementById('findBtn').disabled = false;
                    
                    // Show success message
                    const resultElement = document.getElementById('result');
                    resultElement.innerHTML = `<div class="success">Database loaded: ${Object.keys(people).length} people, ${Object.keys(movies).length} movies</div>`;
                    resultElement.style.display = 'block';
                })
                .catch(error => {
                    console.error('Error loading data:', error);
                    document.getElementById('loading').style.display = 'none';
                    document.getElementById('findBtn').disabled = false;
                    alert('Error loading database. Please refresh the page.');
                });
        }'''
    
    new_loadData = '''        async function loadData() {
            // Show loading indicator
            document.getElementById('loading').style.display = 'block';
            document.getElementById('findBtn').disabled = true;
            
            try {
                // Import parquet-wasm
                const { readParquet } = await import('parquet-wasm');
                
                console.log('Loading people data...');
                const peopleResponse = await fetch('/demos/data/people.parquet');
                const peopleBuffer = await peopleResponse.arrayBuffer();
                const peopleTable = readParquet(peopleBuffer);
                const peopleData = peopleTable.toArray();
                
                console.log(`Loaded ${peopleData.length} people`);
                
                // Process people data
                for (const person of peopleData) {
                    const id = person.id.toString();
                    const name = person.name;
                    const birth = person.birth ? person.birth.toString() : '';
                    
                    people[id] = {
                        name: name,
                        birth: birth,
                        movies: new Set()
                    };
                    
                    if (!names[name.toLowerCase()]) {
                        names[name.toLowerCase()] = new Set();
                    }
                    names[name.toLowerCase()].add(id);
                }
                
                console.log('Loading movies data...');
                const moviesResponse = await fetch('/demos/data/movies.parquet');
                const moviesBuffer = await moviesResponse.arrayBuffer();
                const moviesTable = readParquet(moviesBuffer);
                const moviesData = moviesTable.toArray();
                
                console.log(`Loaded ${moviesData.length} movies`);
                
                // Process movies data
                for (const movie of moviesData) {
                    const id = movie.id.toString();
                    const title = movie.title;
                    const year = movie.year ? movie.year.toString() : '';
                    
                    movies[id] = {
                        title: title,
                        year: year,
                        stars: new Set()
                    };
                }
                
                console.log('Loading stars data...');
                const starsResponse = await fetch('/demos/data/stars.parquet');
                const starsBuffer = await starsResponse.arrayBuffer();
                const starsTable = readParquet(starsBuffer);
                const starsData = starsTable.toArray();
                
                console.log(`Loaded ${starsData.length} star connections`);
                
                // Process stars data
                for (const star of starsData) {
                    const personId = star.person_id.toString();
                    const movieId = star.movie_id.toString();
                    
                    if (people[personId] && movies[movieId]) {
                        people[personId].movies.add(movieId);
                        movies[movieId].stars.add(personId);
                    }
                }
                
                console.log('Data loaded successfully!');
                console.log(`Final: ${Object.keys(people).length} people and ${Object.keys(movies).length} movies`);
                
                // Hide loading indicator and enable button
                document.getElementById('loading').style.display = 'none';
                document.getElementById('findBtn').disabled = false;
                
                // Show success message
                const resultElement = document.getElementById('result');
                resultElement.innerHTML = `<div class="success">Database loaded: ${Object.keys(people).length} people, ${Object.keys(movies).length} movies</div>`;
                resultElement.style.display = 'block';
                
            } catch (error) {
                console.error('Error loading data:', error);
                document.getElementById('loading').style.display = 'none';
                document.getElementById('findBtn').disabled = false;
                alert('Error loading database. Please refresh the page.');
            }
        }'''
    
    # Replace the function
    updated_content = content.replace(old_loadData, new_loadData)
    
    # Write the updated content back
    with open(html_file, 'w', encoding='utf-8') as f:
        f.write(updated_content)
    
    print("HTML file updated successfully to use Parquet!")

if __name__ == "__main__":
    update_html_file()
