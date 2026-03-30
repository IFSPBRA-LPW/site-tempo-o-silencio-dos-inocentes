import { API_KEY } from "./config.js";

async function fetchWeather(city) {
  const response = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=7&lang=pt`
  );

  if (!response.ok) {
    throw new Error("Cidade não encontrada");
  }

  return response.json();
}

function transformData(apiData) {
  const dateObj = new Date(apiData.location.localtime);
  const formattedDate = dateObj.toLocaleDateString("pt-BR", { 
    weekday: 'long', month: 'short', day: 'numeric' 
  });

  return {
    city: apiData.location.name,
    country: apiData.location.country,
    date: formattedDate,
    icon: apiData.current.condition.icon, 
    temperature: Math.round(apiData.current.temp_c),
    feelsLike: Math.round(apiData.current.feelslike_c),
    humidity: apiData.current.humidity,
    wind: Math.round(apiData.current.wind_kph),
    precipitation: apiData.current.precip_mm,

    daily: apiData.forecast.forecastday.map(day => ({
      day: new Date(day.date + "T00:00:00").toLocaleDateString("pt-BR", { weekday: "short" }),
      icon: day.day.condition.icon,
      max: Math.round(day.day.maxtemp_c),
      min: Math.round(day.day.mintemp_c),
    })),

    hourly: apiData.forecast.forecastday[0].hour.map(hour => ({
      time: hour.time.split(" ")[1],
      temp: Math.round(hour.temp_c),
      icon: hour.condition.icon
    })),
  };
}

function renderBannerInfo(data) {
  const banner = document.getElementById("banner");
  banner.innerHTML = `
    <div>
        <h2>${data.city}, ${data.country}</h2>
        <p>${data.date}</p>
    </div>
    <div class="temp-grande">${data.temperature}° <img src="${data.icon}" alt="clima"></div>
  `;
}

function renderDayInfo(data) {
  const stats = document.getElementById("day-info");
  stats.innerHTML = `
    <div><p>Feels Like</p><strong>${data.feelsLike}°</strong></div>
    <div><p>Humidity</p><strong>${data.humidity}%</strong></div>
    <div><p>Wind</p><strong>${data.wind} km/h</strong></div>
    <div><p>Precipitation</p><strong>${data.precipitation} mm</strong></div>
  `;
}

function renderDaily(dailyData) {
  const container = document.getElementById("daily");
  container.innerHTML = "";

  dailyData.forEach(day => {
    const div = document.createElement("div");
    div.innerHTML = `${day.day}<br><img src="${day.icon}" width="30"><br>${day.max}° / ${day.min}°`;
    container.appendChild(div);
  });
}

function renderHourly(hourlyData) {
  const container = document.getElementById("hourly");
  container.innerHTML = "";

  hourlyData.slice(0, 8).forEach(hour => {
    const div = document.createElement("div");
    div.innerHTML = `<span>${hour.time} <img src="${hour.icon}" width="20"></span> <span>${hour.temp}°</span>`;
    container.appendChild(div);
  });
}

async function renderApp(city) {
  if (!city) return; 
  
  try {
    const apiData = await fetchWeather(city);
    const data = transformData(apiData);

    renderBannerInfo(data);
    renderDayInfo(data);
    renderDaily(data.daily);
    renderHourly(data.hourly);

    localStorage.setItem("lastCity", city);

  } catch (error) {
    console.warn("Erro silencioso na busca inicial:", error.message);
  }
}

const button = document.getElementById("buttonSearch");
const input = document.getElementById("lugar");

button.addEventListener("click", () => {
  const city = input.value;
  if (city) {
    renderApp(city).catch(() => alert("Cidade não encontrada!"));
  }
});


const lastCity = localStorage.getItem("lastCity") || "Braganca Paulista";
renderApp(lastCity);