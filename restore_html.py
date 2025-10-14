#!/usr/bin/env python3
"""
Script to restore the Six Degrees HTML file to the working JSON version
"""

def restore_html_file():
    html_file = "public/demos/six-degrees.html"
    
    # Read the current HTML file
    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find and replace the loadData function with the working JSON version
    old_loadData_pattern = '''        async function loadData() {'''
    
    # The working JSON version
    new_loadData = '''        async function loadData() {
            // Show loading indicator
            document.getElementById('loading').style.display = 'block';
            document.getElementById('findBtn').disabled = true;
            
            try {
                console.log('Loading people data...');
                const peopleResponse = await fetch('/demos/data/people.json');
                const peopleData = await peopleResponse.json();
                
                console.log(`Loaded ${peopleData.length} people`);
                
                // Process people data
                for (const person of peopleData) {
                    const id = person.id;
                    const name = person.name;
                    const birth = person.birth || '';
                    
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
                const moviesResponse = await fetch('/demos/data/movies.json');
                const moviesData = await moviesResponse.json();
                
                console.log(`Loaded ${moviesData.length} movies`);
                
                // Process movies data
                for (const movie of moviesData) {
                    const id = movie.id;
                    const title = movie.title;
                    const year = movie.year || '';
                    
                    movies[id] = {
                        title: title,
                        year: year,
                        stars: new Set()
                    };
                }
                
                console.log('Loading stars data...');
                const starsResponse = await fetch('/demos/data/stars.json');
                const starsData = await starsResponse.json();
                
                console.log(`Loaded ${starsData.length} star connections`);
                
                // Process stars data
                for (const star of starsData) {
                    const personId = star.person_id;
                    const movieId = star.movie_id;
                    
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
    
    # Find the start of the loadData function and replace everything until the closing brace
    import re
    
    # Pattern to match the entire loadData function
    pattern = r'        async function loadData\(\) \{[^}]*\}'
    
    # Find the function and replace it
    if re.search(pattern, content, re.DOTALL):
        updated_content = re.sub(pattern, new_loadData, content, flags=re.DOTALL)
        
        # Write the updated content back
        with open(html_file, 'w', encoding='utf-8') as f:
            f.write(updated_content)
        
        print("HTML file restored successfully to working JSON version!")
    else:
        print("Could not find the loadData function to replace. The file might already be in the correct state.")
        
        # Let's try a different approach - find the function manually
        lines = content.split('\n')
        new_lines = []
        skip_lines = False
        
        for i, line in enumerate(lines):
            if 'async function loadData()' in line:
                skip_lines = True
                # Add the new function
                new_lines.extend(new_loadData.split('\n'))
                continue
            
            if skip_lines and line.strip() == '}' and i > 0:
                # Check if this is the end of the loadData function
                # Look for the next function or end of script
                next_lines = lines[i+1:i+5]
                if any('function ' in next_line for next_line in next_lines) or any('// ' in next_line for next_line in next_lines):
                    skip_lines = False
                    continue
            
            if not skip_lines:
                new_lines.append(line)
        
        # Write the updated content back
        with open(html_file, 'w', encoding='utf-8') as f:
            f.write('\n'.join(new_lines))
        
        print("HTML file restored successfully to working JSON version!")

if __name__ == "__main__":
    restore_html_file()
