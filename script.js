let submitBtn = document.querySelector('#submit-btn');
let searchInput = document.querySelector('#city-input');
let recentList = document.querySelector('#recents-list');
let currentWeatherContainer = document.querySelector('#current-weather');
let fiveDayContainer = document.querySelector('#five-day-forecast');

let apiKey = 'd59cd025423d7f65edf905bd558a977d';
let apiUrl = 'https://api.openweathermap.org/data/2.5/';

let recentSearches = localStorage.getItem('recents');
if (!recentSearches) {
  recentSearches = [];
} else {
  recentSearches = JSON.parse(recentSearches);
  getCurrentWeather(recentSearches[recentSearches.length - 1]);
}

renderRecentSearches();

function renderRecentSearches() {
  recentList.innerHTML = '';
  recentSearches.forEach(city => {
    let cityLi = document.createElement('li');
    cityLi.textContent = city;
    recentList.append(cityLi);
  });
}

function getCurrentWeather(location) {
  fetch(apiUrl + 'weather?q=' + location + '&units=imperial&appid=' + apiKey)
    .then(response => response.json())
    .then(data => {
      showCurrentWeather(data);
      getForecast(data.coord.lat, data.coord.lon);
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

function showUvIndex(uvi) {
  let uviEl = document.createElement('p');
  uviEl.textContent = 'UV Index: ';
  let uviSpan = document.createElement('span');
  uviSpan.textContent = uvi;
  if (uvi < 3) {
    uviSpan.setAttribute('class', 'uv uv-low');
  } else if (uvi < 6) {
    uviSpan.setAttribute('class', 'uv uv-moderate');
  } else if (uvi < 8) {
    uviSpan.setAttribute('class', 'uv uv-high');
  } else if (uvi < 11) {
    uviSpan.setAttribute('class', 'uv uv-very-high');
  } else {
    uviSpan.setAttribute('class', 'uv uv-extreme');
  }
  uviEl.append(uviSpan);
  currentWeatherContainer.append(uviEl);
}

function getForecast(lat, lon) {
  fetch(apiUrl + 'onecall?lat='+ lat + '&lon='+ lon + '&exclude=minutely,hourly,alerts&units=imperial&appid=' + apiKey)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      let nextFiveDays = data.daily.slice(1, 6);
      showUvIndex(data.current.uvi);
      showForecast(nextFiveDays);
    });
}

function showForecast(nextFive) {
  fiveDayContainer.innerHTML = '';

  nextFive.forEach(day => {
    let dayEl = document.createElement('div');
    let dateEl = document.createElement('h2');
    let iconEl = document.createElement('img');
    let tempEl = document.createElement('p');
    let humidityEl = document.createElement('p');

    dayEl.setAttribute('class', 'forecast-day');
    dateEl.textContent = new Date(day.dt * 1000).toLocaleDateString();
    iconEl.setAttribute('src', 'http://openweathermap.org/img/wn/' + day.weather[0].icon + '@2x.png');
    tempEl.textContent = 'Temp: ' + day.temp.day + '°F';
    humidityEl.textContent = 'Humidity: ' + day.humidity + '%';

    dayEl.append(dateEl, iconEl, tempEl, humidityEl);
    fiveDayContainer.append(dayEl);
  });
}

submitBtn.addEventListener('click', e => {
  e.preventDefault();
  let location = searchInput.value.trim();
  recentSearches.push(location);
  localStorage.setItem('recents', JSON.stringify(recentSearches));
  renderRecentSearches();
  getCurrentWeather(location);
  searchInput.value = '';
});

recentList.addEventListener('click', e => {
  let target = e.target;
  if (target.matches('li')) {
    let location = target.innerText;
    getCurrentWeather(location);
  }
})