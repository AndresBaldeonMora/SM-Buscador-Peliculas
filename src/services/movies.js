const API_KEY = "3ea3be08e6e50745995c7015830799d7";
const BASE_URL = "https://api.themoviedb.org/3";

export async function searchMovies({ search = "", page = 1, genreId = null }) {
  let url = "";
  const hasSearch = search.trim() !== "";

  if (hasSearch) {
    url = `${BASE_URL}/search/movie?api_key=${API_KEY}&language=es-ES&query=${encodeURIComponent(
      search
    )}&page=${page}`;
  } else if (genreId) {
    url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=es-ES&page=${page}&with_genres=${genreId}`;
  } else {
    return [];
  }

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!data.results) return [];

    return data.results.map((movie) => ({
      id: movie.id.toString(),
      title: movie.title,
      year: (movie.release_date || "").split("-")[0] || "No disponible",
      poster: movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : "https://via.placeholder.com/100x150?text=No+Image",
    }));
  } catch (error) {
    console.error("Error en searchMovies:", error);
    return [];
  }
}

export async function getMovieById(id) {
  const url = `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=es-ES`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const trailerResponse = await fetch(
      `${BASE_URL}/movie/${id}/videos?api_key=${API_KEY}&language=es-ES`
    );
    const trailerData = await trailerResponse.json();
    const trailerKey =
      trailerData.results && trailerData.results[0]
        ? trailerData.results[0].key
        : null;

    const creditsResponse = await fetch(
      `${BASE_URL}/movie/${id}/credits?api_key=${API_KEY}&language=es-ES`
    );
    const creditsData = await creditsResponse.json();

    return {
      id: data.id,
      title: data.title,
      year: data.release_date
        ? data.release_date.split("-")[0]
        : "No disponible",
      poster: data.poster_path
        ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
        : "https://via.placeholder.com/300x450?text=No+Image",
      genre: data.genres
        ? data.genres.map((genre) => genre.name).join(", ")
        : "No disponible",
      director:
        creditsData.crew?.find((member) => member.job === "Director")?.name ||
        "No disponible",
      cast:
        creditsData.cast?.slice(0, 5).map((actor) => ({
          name: actor.name,
          character: actor.character,
          profile_path: actor.profile_path,
        })) || [],
      runtime: data.runtime || "No disponible",
      plot: data.overview || "No disponible",
      trailerKey,
      vote_average: data.vote_average ?? null,
    };
  } catch (error) {
    console.error("Error al obtener detalle de película:", error);
    throw error;
  }
}
