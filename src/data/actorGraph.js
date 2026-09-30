// Small curated graph. Film/cast sources were checked on 2026-09-30.
// A deliberately partial catalog: absence of a path is not a filmography claim.
export const films = [
  { id:'apollo13',title:'Apollo 13',year:'1995',cast:['Tom Hanks','Kevin Bacon','Bill Paxton','Gary Sinise'],source:'https://www.festival-cannes.com/f/apollo-13/' },
  { id:'forrestgump',title:'Forrest Gump',year:'1994',cast:['Tom Hanks','Robin Wright','Gary Sinise','Sally Field'],source:'https://www.paramountpictures.com/movies/forrest-gump' },
  { id:'afewgoodmen',title:'A Few Good Men',year:'1992',cast:['Tom Cruise','Jack Nicholson','Demi Moore','Kevin Bacon'],source:'https://www.sonypictures.com/movies/afewgoodmen' },
  { id:'castaway',title:'Cast Away',year:'2000',cast:['Tom Hanks','Helen Hunt'],source:'https://amblin.com/movie/cast-away/' },
]
export function buildActorGraph() {
  const people={},movies={},names={}
  for (const film of films) {
    movies[film.id]={title:film.title,year:film.year,source:film.source,stars:new Set(film.cast)}
    for (const name of film.cast) {
      if (!people[name]) people[name]={name,movies:new Set()}
      people[name].movies.add(film.id)
      names[name.toLowerCase()]=new Set([name])
    }
  }
  return {people,movies,names}
}
