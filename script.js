let submitBtn = document.querySelector('#submit-btn');
let searchInput = document.querySelector('#city-input');
let recentList = document.querySelector('#recents-list');
let currentWeatherContainer = document.querySelector('#current-weather');
let fiveDayContainer = document.querySelector('#five-day-forecast');

let apiKey = 'd59cd025423d7f65edf905bd558a977d';
let apiUrl = 'https://api.openweathermap.org/data/2.5/';

function getCurrentWeather(location) {
  fetch(apiUrl + 'weather?q=' + location + '&units=imperial&appid=' + apiKey)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      showCurrentWeather(data);
    });
}

function showCurrentWeather(data) {
  currentWeatherContainer.innerHTML = '';

  let cityNameEl = document.createElement('h2');
  cityNameEl.textContent = data.name + ' (' + new Date(data.dt * 1000).toLocaleDateString() + ')';
  let temperatureEl = document.createElement('p');
  temperatureEl.textContent = 'Temperature: ' + data.main.temp + ' °F';
  let humidityEl = document.createElement('p');
  humidityEl.textContent = 'Humidity: ' + data.main.humidity + '%';
  let windSpeedEl = document.createElement('p');
  windSpeedEl.textContent = 'Wind Speed: ' + data.wind.speed + ' MPH';
  // Also need UV Index, but requires a seperate api call.

  currentWeatherContainer.append(cityNameEl, temperatureEl, humidityEl, windSpeedEl);
}

submitBtn.addEventListener('click', e => {
  e.preventDefault();
  getCurrentWeather(searchInput.value.trim());
});