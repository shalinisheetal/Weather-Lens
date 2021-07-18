const city = document.getElementsByClassName("search-box")[0];
const cityName = document.getElementsByClassName("city-name")[0];
const submit = document.getElementsByClassName("search-btn")[0];

const temp = document.getElementsByClassName("temp")[0];
const desc = document.getElementsByClassName("desc")[0];
const humidity = document.getElementsByClassName("humidity")[0];
const wind = document.getElementsByClassName("wind")[0];
const image = document.getElementsByClassName("weather-image")[0];

const days = document.getElementsByClassName("days");
const dateTime = document.getElementsByClassName("date-time")[0];
const week_temp = document.getElementsByClassName("week-temp");

const card = document.getElementById("body");
const err = document.getElementById("error");

const getWeather = async (event) => {
  event.preventDefault();

  const cityValue = city.value;

  // When empty value is entered
  if (cityValue.trim() == "") {
    card.style.display = "none";
    err.innerHTML = "<h1>Please enter a city name before searching.</h1>";
    err.style.display = "block";
  } else {
    // Fetch data
    try {

      // Today
      const key = "5b371371f3e5e12c2b6bd1f501b53754"
      let url1 = `https://api.openweathermap.org/data/2.5/weather?q=${cityValue}&units=metric&appid=` + key;

      const response1 = await fetch(url1);
      const weatherData = await response1.json();

      cityName.innerText = `${weatherData.name}, ${weatherData.sys.country}`;
      temp.innerText = weatherData.main.temp;
      desc.innerText = weatherData.weather[0].description;
      humidity.innerText = weatherData.main.humidity;
      wind.innerText = weatherData.wind.speed;

      // Weather icon
      const iconMain = weatherData.weather[0].icon;
      const iconURL = "http://openweathermap.org/img/wn/" + iconMain + "@2x.png";
      image.setAttribute("src", iconURL);

      const lat = weatherData.coord.lat;
      const lon = weatherData.coord.lon;

      // Next 7 days
      let url2 = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&units=metric&appid=` + key;
      const response2 = await fetch(url2);
      const forecastData = await response2.json();

      var weekday = new Array(7);
      weekday[0] = "Sunday";
      weekday[1] = "Monday";
      weekday[2] = "Tuesday";
      weekday[3] = "Wednesday";
      weekday[4] = "Thursday";
      weekday[5] = "Friday";
      weekday[6] = "Saturday";

      dateTime.innerText = ' ' + weekday[day] + ', ' + date;

      for (let i = 0; i < days.length; i++) {
        days[i].innerHTML = weekday[(d.getDay() + i) % 7];
        week_temp[i].innerHTML = "<img src=" + "http://openweathermap.org/img/wn/" + forecastData.daily[i + 1].weather[0].icon + "@2x.png" + ">" + forecastData.daily[i + 1].temp.day.toFixed(1) + "°C";
      }
      card.style.display = "block";
      err.style.display = "none";

    } catch {
      // Invalid city name
      card.style.display = "none";
      err.innerHTML = "<h1>Please enter a VALID city name.</h1>";
      err.style.display = "block";
    }
  }
}

submit.addEventListener('click', getWeather);

var d = new Date();
var day = d.getDay();
var date = d.getDate() + '-' + (d.getMonth() + 1) + '-' + d.getFullYear();