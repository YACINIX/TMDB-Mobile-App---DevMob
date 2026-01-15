const TMDB_BASE_URL = "https://api.themoviedb.org/3";


const TMDB_API_KEY = "480995ff2c723770b45ebbe97ccd6297";

async function tmdbFetch(path) {
  const url =
    `${TMDB_BASE_URL}${path}` +
    `${path.includes("?") ? "&" : "?"}` +
    `api_key=${TMDB_API_KEY}&language=en-US`;

  const res = await fetch(url);
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`TMDB error ${res.status}: ${txt}`);
  }
  return res.json();
}

// Movies
export const getMoviesNowPlaying = () => tmdbFetch("/movie/now_playing?page=1");
export const getMoviesPopular = () => tmdbFetch("/movie/popular?page=1");
export const getMoviesTopRated = () => tmdbFetch("/movie/top_rated?page=1");
export const getMoviesUpcoming = () => tmdbFetch("/movie/upcoming?page=1");

// TV
export const getTvAiringToday = () => tmdbFetch("/tv/airing_today?page=1");
export const getTvOnTheAir = () => tmdbFetch("/tv/on_the_air?page=1");
export const getTvPopular = () => tmdbFetch("/tv/popular?page=1");
export const getTvTopRated = () => tmdbFetch("/tv/top_rated?page=1");

// Details
export const getMovieDetails = (id) => tmdbFetch(`/movie/${id}`);
export const getTvDetails = (id) => tmdbFetch(`/tv/${id}`);

//Search
export const searchMovies = (q) =>
  tmdbFetch(`/search/movie?query=${encodeURIComponent(q)}&page=1`);

export const searchTv = (q) =>
  tmdbFetch(`/search/tv?query=${encodeURIComponent(q)}&page=1`);
