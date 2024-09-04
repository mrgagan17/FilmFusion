const API_KEY = '7c19042f'; 

// Function to search for movies
async function searchMovies(query) {
    const response = await fetch(`http://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`);
    const data = await response.json();
    if (data.Response === "True") {
        displaySearchResults(data.Search);
    } else {
        alert('Movie not found');
    }
}

// Function to display search results
function displaySearchResults(movies) {
    const resultsContainer = document.getElementById('search-results');
    resultsContainer.innerHTML = ''; // Clear previous results

    movies.forEach(movie => {
        const movieDiv = document.createElement('div');
        movieDiv.className = 'movie';
        movieDiv.innerHTML = `
            <img src="${movie.Poster}" alt="${movie.Title}">
            <h3>${movie.Title}</h3>
            <p>${movie.Year}</p>
            <button onclick="viewDetails('${movie.imdbID}')">View Details</button>
        `;
        resultsContainer.appendChild(movieDiv);
    });
}

// Function to view movie details
async function viewDetails(imdbID) {
    const response = await fetch(`http://www.omdbapi.com/?apikey=${API_KEY}&i=${imdbID}&plot=full`);
    const movie = await response.json();
    displayMovieDetails(movie);
}

// Function to display movie details
function displayMovieDetails(movie) {
    const detailsContainer = document.getElementById('movie-details');
    detailsContainer.style.display = 'block'; // Show details section
    detailsContainer.innerHTML = `
        <h2>${movie.Title}</h2>
        <p><strong>Release Date:</strong> ${movie.Released}</p>
        <p><strong>Rating:</strong> ${movie.imdbRating}</p>
        <p><strong>Plot:</strong> ${movie.Plot}</p>
        <button onclick="addToFavorites('${movie.imdbID}', '${movie.Title}', '${movie.Poster}')">Add to Favorites</button>
    `;
}

// Function to add a movie to favorites
function addToFavorites(id, title, poster) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (!favorites.find(movie => movie.id === id)) {
        favorites.push({ id, title, poster });
        localStorage.setItem('favorites', JSON.stringify(favorites));
        displayFavorites();
    }
}

// Function to display favorites
function displayFavorites() {
    const favoritesContainer = document.getElementById('favorites-list');
    favoritesContainer.innerHTML = '';
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    favorites.forEach(movie => {
        const favoriteDiv = document.createElement('div');
        favoriteDiv.className = 'favorite';
        favoriteDiv.innerHTML = `
            <h3>${movie.title}</h3>
            <img src="${movie.poster}" alt="${movie.title}">
            <button onclick="removeFromFavorites('${movie.id}')">Remove</button>
        `;
        favoritesContainer.appendChild(favoriteDiv);
    });
}

// Function to remove a movie from favorites
function removeFromFavorites(id) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const updatedFavorites = favorites.filter(movie => movie.id !== id);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    displayFavorites();
}

// Event listeners
document.getElementById('search-button').addEventListener('click', () => {
    const query = document.getElementById('search-input').value;
    if (query) {
        searchMovies(query);
    }
});

// Display favorites on page load
document.addEventListener('DOMContentLoaded', displayFavorites);
