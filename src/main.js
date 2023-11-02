import './style.css'
import movieData from './movie-data.json'
import Chart from "chart.js/auto";

let moviesDiv = document.getElementById("view-movies")

const displayMovies = (movieData) => {
  for (let idx = 0; idx < movieData.length; idx++) {
    let div = document.createElement("div");
    div.classList.add("movie");
    let name = document.createElement("h3");
    let criticScore = document.createElement("p");
    let audienceScore = document.createElement("p");
    let domesticGross = document.createElement("p");
    let genre = document.createElement("p");
    name.textContent = movieData[idx].title;
    criticScore.textContent = `Critic Score: ${movieData[idx].criticScore}%`;
    audienceScore.textContent = `Audience Score: ${movieData[idx].audienceScore}%`;
    domesticGross.textContent = `Domestic Total: $${movieData[idx].domestic}`;
    genre.textContent = `Genre: ${movieData[idx].genre}`;
    div.append(name, criticScore, audienceScore, domesticGross, genre);
    moviesDiv.append(div);
  }
  
}
displayMovies(movieData);

const displayDomesticChart = () => {
  new Chart(document.getElementById("box-office"), {
    type: "bar",
    data: {
      labels: movieData.map((movie) => movie.title),
      datasets: [
        {
          label: "Domestic Gross",
          data: movieData.map((movie) => movie.domestic),
        },
      ],
    },
  });
}
displayDomesticChart();