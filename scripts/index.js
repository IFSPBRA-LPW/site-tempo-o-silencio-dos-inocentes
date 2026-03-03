import { cityWeather } from "./data.js";

console.log(cityWeather);

function renderBannerInfo(data) {
  const banner = document.getElementById("banner");
  banner.innerHTML = "";

  const city = document.createElement("h1");
  city.textContent = `${data.city}, ${data.country}`;

  const date = document.createElement("p");
  date.textContent = data.date;

  const temp = document.createElement("h2");
  temp.textContent = `${data.icon} ${data.temperature}°C`;

  banner.append(city, date, temp);
}

function renderDayInfo(data) {
  const dayInfo = document.getElementById("day-info");
  dayInfo.innerHTML = "";

  const feels = document.createElement("p");
  feels.textContent = `Sensação: ${data.feelsLike}°C`;

  const humidity = document.createElement("p");
  humidity.textContent = `Umidade: ${data.humidity}%`;

  const wind = document.createElement("p");
  wind.textContent = `Vento: ${data.wind} km/h`;

  const precipitation = document.createElement("p");
  precipitation.textContent = `Precipitação: ${data.precipitation}%`;

  dayInfo.append(feels, humidity, wind, precipitation);
}

function renderDaily(dailyData) {
  const daily = document.getElementById("daily");
  daily.innerHTML = "";

  dailyData.forEach(day => {
    const card = document.createElement("div");

    const name = document.createElement("p");
    name.textContent = day.day;

    const icon = document.createElement("p");
    icon.textContent = day.icon;

    const temp = document.createElement("p");
    temp.textContent = `${day.max}° / ${day.min}°`;

    card.append(name, icon, temp);
    daily.appendChild(card);
  });
}

function renderHourly(hourlyData) {
  const hourly = document.getElementById("hourly");
  hourly.innerHTML = "";

  hourlyData.forEach(hour => {
    const item = document.createElement("div");

    const time = document.createElement("p");
    time.textContent = hour.time;

    const temp = document.createElement("p");
    temp.textContent = `${hour.temp}°C`;

    item.append(time, temp);
    hourly.appendChild(item);
  });
}

function initApp(data) {
  renderBannerInfo(data);
  renderDayInfo(data);
  renderDaily(data.daily);
  renderHourly(data.hourly);
}

initApp(cityWeather);


