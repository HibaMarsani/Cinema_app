import React, { useState, useEffect } from 'react';
import './App.css';
import cryptoLogo from './img/images.jpg';


const MovieApp = (props) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [genres, setGenres] = useState([]);

  const apiKey = '5f78c2ba92717a3419bbf75020ee0be8'; // Remplacez par votre clé d'API TMDb

  useEffect(() => {
    setLoading(true);

    const apiUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`;

    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        setGenres(data.genres);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if (query.trim() !== '') {
      setLoading(true);

      const apiUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`;

      fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
          setMovies(data.results);
          setLoading(false);
        })
        .catch(error => {
          console.log(error);
          setLoading(false);
        });
    } else {
      setMovies([]);
    }
  }, [query]);

  const handleSearch = () => {
    if (query.trim() !== '') {
      setQuery(query.trim());
      setShowResults(true);
    }
  };

  const getGenreNames = genreIds => {
    return genreIds
      .map(id => {
        const genre = genres.find(genre => genre.id === id);
        return genre ? genre.name : '';
      })
      .join(', ');
  };

  return (
    <div className="container">
      <figure className="shadow">
              <img src={cryptoLogo} alt="crypto" />
            </figure>
      <h1>Movie App</h1>
      <h4>Chercher votre film preferé</h4>
      <h1>{props.title}</h1>

      <div className="search-container">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Enter a movie title"
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {showResults && (
        <>
          {loading ? (
            <div>Loading...</div>
          ) : movies.length > 0 ? (
            <ul>
              {movies.map(movie => (
                <li key={movie.id}>
                  
                  <h2>{movie.title}</h2>
                  <p>Release Year: {movie.release_date}</p>
                  <p>Genre: {getGenreNames(movie.genre_ids)}</p>
                  <p>Rating: {movie.vote_average}</p>
                  <p>Synopsis: {movie.overview}</p>
                  {movie.poster_path && (
                    <img
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.title}
                    />
                  )}
                </li>
                
              ))}
            </ul>
          ) : (
            <div>No results found.</div>
          )}
        </>
      )}
    </div>
  );
};

export default MovieApp;
