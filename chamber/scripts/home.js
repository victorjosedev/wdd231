// home.js — Handles Weather API and Member Spotlights for Chamber Home Page

const API_KEY = 'daa00f65773418d81b83dad44c7ca19e';
const LAT = '10.083247418001832';
const LON = '-69.30922126281318';

// Weather API Endpoints
const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&appid=${API_KEY}&units=metric`;
const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${LAT}&lon=${LON}&appid=${API_KEY}&units=metric`;

// Elements
const currentTemp = document.getElementById('current-temp');
const weatherDesc = document.getElementById('weather-desc');
const weatherIcon = document.getElementById('weather-icon');
const forecastContainer = document.getElementById('forecast-container');

async function fetchWeather() {
  try {
    // 1. Fetch Current Weather
    const currentRes = await fetch(currentUrl);
    if (!currentRes.ok) throw new Error('Failed to fetch current weather');
    const currentData = await currentRes.json();

    // Display Current Weather
    const temp = Math.round(currentData.main.temp);
    const desc = currentData.weather[0].description.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    const iconCode = currentData.weather[0].icon;

    currentTemp.textContent = `${temp}°C`;
    weatherDesc.textContent = desc;
    weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    weatherIcon.alt = desc;
    weatherIcon.style.display = 'inline-block';

    // 2. Fetch 3-Day Forecast
    const forecastRes = await fetch(forecastUrl);
    if (!forecastRes.ok) throw new Error('Failed to fetch forecast');
    const forecastData = await forecastRes.json();

    // Get today's local date string to filter out today's remaining slots
    const todayStr = new Date().toISOString().split('T')[0];

    // Group forecast items by date
    const daysGrouped = {};
    forecastData.list.forEach(item => {
      const dateStr = item.dt_txt.split(' ')[0];
      if (dateStr !== todayStr) {
        if (!daysGrouped[dateStr]) {
          daysGrouped[dateStr] = [];
        }
        daysGrouped[dateStr].push(item);
      }
    });

    // Extract next 3 days
    const nextThreeDays = Object.keys(daysGrouped).slice(0, 3);
    
    forecastContainer.innerHTML = '';

    nextThreeDays.forEach(dateStr => {
      const list = daysGrouped[dateStr];
      // Try to find a slot around noon (12:00:00) or take the middle one
      const dayData = list.find(item => item.dt_txt.includes('12:00:00')) || list[Math.floor(list.length / 2)];
      
      const tempVal = Math.round(dayData.main.temp);
      const icon = dayData.weather[0].icon;
      const descText = dayData.weather[0].description;
      
      // Parse local day of the week
      // Use dateStr + 'T12:00:00' to prevent timezone offset shifts
      const dayDate = new Date(`${dateStr}T12:00:00`);
      const dayName = dayDate.toLocaleDateString('en-US', { weekday: 'short' });

      // Create forecast card element
      const forecastItem = document.createElement('div');
      forecastItem.className = 'forecast-item';
      forecastItem.innerHTML = `
        <span class="forecast-day">${dayName}</span>
        <img src="https://openweathermap.org/img/wn/${icon}.png" alt="${descText}" class="forecast-icon">
        <span class="forecast-temp">${tempVal}°C</span>
      `;
      forecastContainer.appendChild(forecastItem);
    });

  } catch (err) {
    console.error('Weather loading error:', err);
    weatherDesc.textContent = 'Weather data unavailable.';
  }
}

async function loadSpotlights() {
  try {
    const res = await fetch('./data/members.json');
    if (!res.ok) throw new Error('Failed to load member data');
    const members = await res.json();

    // Filter for Gold (3) and Silver (2) levels
    const eligible = members.filter(m => m.membershipLevel === 2 || m.membershipLevel === 3);

    // Shuffle the array randomly
    const shuffled = eligible.sort(() => 0.5 - Math.random());

    // Select 2 or 3 members
    const count = shuffled.length >= 3 ? 3 : shuffled.length;
    const selected = shuffled.slice(0, count);

    const container = document.getElementById('spotlights-container');
    container.innerHTML = '';

    selected.forEach(m => {
      const card = document.createElement('article');
      card.className = 'spotlight-card';

      const levelLabel = m.membershipLevel === 3 ? 'Gold' : 'Silver';
      const badgeClass = m.membershipLevel === 3 ? 'level-3' : 'level-2';

      card.innerHTML = `
        <div class="spotlight-header">
          <h3 class="spotlight-name">${m.name}</h3>
          <span class="badge ${badgeClass}">${levelLabel}</span>
        </div>
        <hr class="spotlight-divider">
        <div class="spotlight-body">
          <img src="${m.image}" alt="${m.name} logo" class="spotlight-logo" loading="lazy" width="100" height="65">
          <div class="spotlight-info">
            <p class="spotlight-desc">"${m.description}"</p>
            <p class="spotlight-detail"><strong>Phone:</strong> ${m.phone}</p>
            <p class="spotlight-detail"><strong>Address:</strong> ${m.address}</p>
            <a href="${m.website}" target="_blank" class="spotlight-link" rel="noopener">Visit Website</a>
          </div>
        </div>
      `;
      container.appendChild(card);
    });

  } catch (err) {
    console.error('Spotlights loading error:', err);
    document.getElementById('spotlights-container').innerHTML = '<p>Unable to load spotlights at this time.</p>';
  }
}

// Initial calls
fetchWeather();
loadSpotlights();

// Footer date dynamic load (Home page fallback if navigation.js is deferred/run before or after)
document.getElementById('copyright-year').textContent = new Date().getFullYear();
document.getElementById('last-modified').textContent = document.lastModified;
