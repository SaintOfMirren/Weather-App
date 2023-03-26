const API_KEY = "2f63ebdbdca6236dd9fab1cafdec6178";
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const currentWeather = document.getElementById("current-weather");
const forecast = document.getElementById("forecast");
let cities = JSON.parse(localStorage.getItem('cities')) || [];

const searchHistoryElement = document.getElementById('search-history');
const searchHistoryItems = cities.map(city => {
  const searchHistoryItem = `<li class="list-group-item">${city}</li>`;
  return searchHistoryItem;
});
searchHistoryElement.innerHTML = `
  <h2>Search History</h2>
  <ul class="list-group bg-dark text-light">${searchHistoryItems.join('')}</ul>
`;

searchHistoryElement.addEventListener('click', event => {
  if (event.target.tagName === 'LI') {
    const city = event.target.innerText;
    getWeatherData(city);
  }
});

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  var city = searchInput.value.trim();
  if (city) {
    getWeatherData(city);
  }
});

async function getWeatherData(city) {
  var response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}`
  );
  var data = await response.json();
  var { lat, lon } = data.city.coord;
  var currentResponse = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`
  );
  var currentData = await currentResponse.json();
  console.log(currentData);
  displayWeather(currentData, data.list);
  
  if (!cities.includes(city)) {
    cities.push(city);
    localStorage.setItem('cities', JSON.stringify(cities));
    const searchHistoryItem = `<li class="list-group-item">${city}</li>`;
    searchHistoryElement.insertAdjacentHTML('beforeend', searchHistoryItem);
  }
}

function displayWeather(currentData, forecastData) {
  currentWeather.innerHTML = `
          <h2>Current Weather in ${currentData.city.name} for ${new Date(currentData.list[0].dt_txt).toLocaleDateString()}</h2>
          <p>${Math.round(currentData.list[0].main.temp - 273.15)}°C</p>
          <p>${currentData.list[0].weather[0].description}</p>
          <p>Humidity: ${currentData.list[0].main.humidity}%</p>
          <p>Wind Speed: ${currentData.list[0].wind.speed} m/s</p>
        `;


  forecast.innerHTML = `
          <h2>5-Day Weather Forecast</h2>
          <div class="forecast-cards d-flex">
            ${forecastData
      .filter((item) => item.dt_txt.includes("12:00:00"))
      .map(
        (item) => `
                  <div class="card">
                    <h3>${new Date(item.dt * 1000).toLocaleDateString()}</h3>
                    <p>${Math.round(item.main.temp - 273.15)}°C</p>
                    <img src='https://openweathermap.org/img/w/${item.weather[0].icon}.png' /img>
                    <p>${item.weather[0].description}</p>
                    <p>Humidity: ${item.main.humidity}%</p>
                    <p>Wind Speed: ${item.wind.speed} m/s</p>
                  </div>
                `
      )
      .join("")}
          </div>
        `;
}

