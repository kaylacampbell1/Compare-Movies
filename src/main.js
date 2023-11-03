import "./style.css";
import movieData from "./movie-data.json";
import Chart from "chart.js/auto";

let defaultMovies = movieData;
let moviesDiv = document.getElementById("view-movies");
let form = document.getElementById("add-movie");
let movieTitleInput = document.getElementById("title");
let criticInput = document.getElementById("critic-score");
let audienceInput = document.getElementById("audience-score");
let salesInput = document.getElementById("sales");
let genreInput = document.getElementById("genre");
let resetButton = document.getElementById("reset-movies");

const setLocalStorageItem = (key, value) => {
  localStorage.removeItem("movies");
  localStorage.setItem(key, JSON.stringify(value));
};
const getLocalStorageItem = (key) => {
  return JSON.parse(localStorage.getItem(key));
};
const addMovies = (input) => {
  setLocalStorageItem("movies", input);
};

const displayMovies = () => {
  let moviesStored = getLocalStorageItem("movies");
  moviesDiv.textContent = "";
  for (let idx = 0; idx < moviesStored.length; idx++) {
    let div = document.createElement("div");
    div.classList.add("movie");
    let name = document.createElement("h3");
    let criticScore = document.createElement("p");
    let audienceScore = document.createElement("p");
    let domesticGross = document.createElement("p");
    let genre = document.createElement("p");
    name.textContent = moviesStored[idx].title;
    criticScore.textContent = `Critic Score: ${moviesStored[idx].criticScore}%`;
    audienceScore.textContent = `Audience Score: ${moviesStored[idx].audienceScore}%`;
    domesticGross.textContent = `Domestic Total: $${moviesStored[idx].domestic}`;
    genre.textContent = `Genre: ${moviesStored[idx].genre}`;
    div.append(name, criticScore, audienceScore, domesticGross, genre);
    moviesDiv.append(div);
  }
};

let barChart;
let doughnutChart;
let scatterChart;

const displayDomesticChart = (movies) => {
  let bar = document.getElementById("box-office");
  barChart = new Chart(bar, {
    type: "bar",
    data: {
      labels: movies.map((movie) => movie.title),
      datasets: [
        {
          label: "Domestic Gross",
          data: movies.map((movie) => movie.domestic),
        },
      ],
    },
  });
};


const displayGenreChart = (movies) => {
  let doughnut = document.getElementById("genre-gross");
  doughnutChart = new Chart(doughnut, {
    type: "doughnut",
    data: {
      labels: ["comedy", "action", "adventure", "drama", "concert", "horror"],
      datasets: [
        {
          label: "Genre and total gross",
          data: [
            movies.filter((movie) => movie.genre === "comedy").length,
            movies.filter((movie) => movie.genre === "action").length,
            movies.filter((movie) => movie.genre === "adventure").length,
            movies.filter((movie) => movie.genre === "drama").length,
            movies.filter((movie) => movie.genre === "concert").length,
            movies.filter((movie) => movie.genre === "horror").length,
          ],
          backgroundColor: [
            "rgb(54,162,235)",
            "rgb(252,99,132)",
            "rgb(253,159,64)",
            "rgb(253,205,87)",
            "rgb(76,193,192)",
            "rgb(154,102,255)",
          ],
          radius: "50%",
        },
      ],
    },
    options: {},
  });
};


const displayScoreChart = (movies) => {
  
  let scatter = document.getElementById("critic-audience");
  scatterChart = new Chart(scatter, {
    type: "scatter",
    data: {
      datasets: [
        {
          label: "Audience Score",
          data: movies.map((movie) => {
            return { x: movie.audienceScore, y: movie.domestic };
          }),
          backgroundColor: "rgb(56,107,143)",
        },
        {
          label: "Critic Score",
          data: movies.map((movie) => {
            return { x: movie.criticScore, y: movie.domestic };
          }),
          backgroundColor: "rgb(155,76,91)",
        },
      ],
    },
    options: {
      scales: {
        x: {
          type: "linear",
          position: "bottom",
        },
      },
    },
  });
};

const refreshInfo = () => {
  displayMovies();
  barChart.destroy();
  displayDomesticChart(getLocalStorageItem("movies"));
  doughnutChart.destroy();
  displayGenreChart(getLocalStorageItem("movies"));
  scatterChart.destroy();
  displayScoreChart(getLocalStorageItem("movies"));
}

addMovies(movieData);
displayDomesticChart(getLocalStorageItem("movies"));
displayGenreChart(getLocalStorageItem("movies"));
displayScoreChart(getLocalStorageItem("movies"));
displayMovies();

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let newMovie = {
    criticScore: Number(criticInput.value),
    audienceScore: Number(audienceInput.value),
    domestic: Number(salesInput.value),
    genre: genreInput.value,
    title: movieTitleInput.value,
  };
  addMovies([newMovie, ...movieData]);
  movieData.unshift(newMovie);
  refreshInfo();
});

resetButton.addEventListener("click", () => {
  addMovies(defaultMovies);
  refreshInfo();
})