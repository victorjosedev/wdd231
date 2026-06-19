// =========================================
// MOUNTAIN E-RIDERS - MAIN.JS
// Home page JavaScript functionality
// =========================================

// ES Modules Import
import riders from './data/riders.mjs';

// =========================================
// CONSTANTS & CONFIGURATION
// =========================================
const WEATHER_API_KEY = 'c58d925ce171770c5649bf832d707fe4'; // 
const DEFAULT_CITY = 'Moab';
const STORAGE_KEYS = {
  lastVisit: 'lastVisit',
  preferredCity: 'preferredCity',
  welcomeShown: 'welcomeShown'
};

// =========================================
// DOM REFERENCES
// =========================================
const menuToggle = document.getElementById('menu-toggle');
const primaryNav = document.getElementById('primary-nav');
const copyrightYear = document.getElementById('copyright-year');
const ridersContainer = document.getElementById('riders-container');
const weatherWidget = document.getElementById('weather-widget');
const weatherLoading = document.getElementById('weather-loading');
const weatherContent = document.getElementById('weather-content');
const weatherError = document.getElementById('weather-error');

// =========================================
// 1. MOBILE NAVIGATION TOGGLE
// =========================================
function initNavigation() {
  if (!menuToggle || !primaryNav) return;

  menuToggle.addEventListener('click', () => {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', !isExpanded);
    primaryNav.classList.toggle('open');
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!menuToggle.contains(e.target) && !primaryNav.contains(e.target)) {
      menuToggle.setAttribute('aria-expanded', 'false');
      primaryNav.classList.remove('open');
    }
  });
}

// =========================================
// 2. DYNAMIC COPYRIGHT YEAR
// =========================================
function updateCopyrightYear() {
  if (copyrightYear) {
    copyrightYear.textContent = new Date().getFullYear();
  }
}

// =========================================
// 3. FEATURED RIDERS - DYNAMIC RENDERING
// Uses: Array methods, template literals, DOM manipulation
// =========================================
function renderRiders() {
  if (!ridersContainer) return;

  // Using forEach array method
  const ridersHTML = riders.map((rider) => {
    // Using template literals
    return `
      <article class="rider-card">
        <img 
          src="${rider.avatar}" 
          alt="Portrait of ${rider.name}" 
          class="rider-avatar" 
          width="120" 
          height="120"
          loading="lazy">
        <h3 class="rider-name">${rider.name}</h3>
        <p class="rider-role">${rider.role}</p>
        <p class="rider-bio">${rider.bio}</p>
        <div class="rider-stats">
          <p><strong>${rider.trailsCompleted}</strong> trails completed</p>
          <p>Favorite: <em>${rider.favoriteTrail}</em></p>
        </div>
        <button 
          class="btn btn-secondary btn-rider-details" 
          data-rider-id="${rider.id}"
          aria-label="View more details about ${rider.name}">
          View Profile
        </button>
      </article>
    `;
  }).join('');

  ridersContainer.innerHTML = ridersHTML;

  // Attach event listeners to each "View Profile" button
  const riderButtons = document.querySelectorAll('.btn-rider-details');
  riderButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const riderId = parseInt(e.target.dataset.riderId);
      // Using filter array method
      const rider = riders.filter(r => r.id === riderId)[0];
      if (rider) openRiderModal(rider);
    });
  });
}

// =========================================
// 4. MODAL DIALOG - RIDER PROFILE
// Accessible modal with keyboard trap
// =========================================
function openRiderModal(rider) {
  // Create modal structure dynamically
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-labelledby', 'modal-title');

  modal.innerHTML = `
    <div class="modal-content">
      <button class="modal-close" aria-label="Close modal">&times;</button>
      <img src="${rider.avatar}" alt="${rider.name}" class="modal-avatar" width="150" height="150">
      <h2 id="modal-title">${rider.name}</h2>
      <p class="modal-role">${rider.role}</p>
      <p class="modal-bio">${rider.bio}</p>
      <div class="modal-stats">
        <div class="stat">
          <span class="stat-value">${rider.trailsCompleted}</span>
          <span class="stat-label">Trails</span>
        </div>
        <div class="stat">
          <span class="stat-value">${rider.favoriteTrail}</span>
          <span class="stat-label">Favorite Trail</span>
        </div>
      </div>
      <button class="btn btn-primary modal-close-btn">Close</button>
    </div>
  `;

  document.body.appendChild(modal);
  document.body.style.overflow = 'hidden';

  // Close modal handlers
  const closeButtons = modal.querySelectorAll('.modal-close, .modal-close-btn');
  closeButtons.forEach(btn => {
    btn.addEventListener('click', () => closeModal(modal));
  });

  // Close on overlay click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal(modal);
  });

  // Close on ESC key
  const escHandler = (e) => {
    if (e.key === 'Escape') {
      closeModal(modal);
      document.removeEventListener('keydown', escHandler);
    }
  };
  document.addEventListener('keydown', escHandler);

  // Focus trap
  const firstFocusable = modal.querySelector('.modal-close');
  if (firstFocusable) firstFocusable.focus();
}

function closeModal(modal) {
  modal.remove();
  document.body.style.overflow = '';
}

// =========================================
// 5. WEATHER WIDGET - FETCH API + TRY/CATCH
// Demonstrates async/await with error handling
// =========================================
async function fetchWeatherData(city) {
  // Show loading state
  weatherLoading.style.display = 'block';
  weatherContent.style.display = 'none';
  weatherError.style.display = 'none';

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=imperial&appid=${WEATHER_API_KEY}`;

  try {
    const response = await fetch(url);

    // Check if response is OK (status 200-299)
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    displayWeather(data);
  } catch (error) {
    console.error('Error fetching weather:', error);
    weatherLoading.style.display = 'none';
    weatherError.style.display = 'block';
    weatherError.querySelector('p').textContent =
      `Unable to load weather for ${city}. Please check the city name or try again later.`;
  }
}

function displayWeather(data) {
  const { name, main, weather, wind, visibility } = data;
  const iconCode = weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  const description = weather[0].description;

  // Using template literals for HTML construction
  const weatherHTML = `
    <div class="weather-location">
      <h3>${name}</h3>
      <p>Current conditions for your ride</p>
    </div>
    <div class="weather-main">
      <img src="${iconUrl}" alt="${description}" class="weather-icon" width="80" height="80">
      <div class="weather-temp">${Math.round(main.temp)}°F</div>
      <div class="weather-desc">${description}</div>
    </div>
    <div class="weather-details">
      <div class="weather-detail">
        <div class="weather-detail-label">Feels Like</div>
        <div class="weather-detail-value">${Math.round(main.feels_like)}°F</div>
      </div>
      <div class="weather-detail">
        <div class="weather-detail-label">Humidity</div>
        <div class="weather-detail-value">${main.humidity}%</div>
      </div>
      <div class="weather-detail">
        <div class="weather-detail-label">Wind</div>
        <div class="weather-detail-value">${wind.speed} mph</div>
      </div>
      <div class="weather-detail">
        <div class="weather-detail-label">Visibility</div>
        <div class="weather-detail-value">${(visibility / 1000).toFixed(1)} km</div>
      </div>
    </div>
    <div class="weather-change">
      <label for="city-input" class="sr-only">Change city</label>
      <input 
        type="text" 
        id="city-input" 
        placeholder="Enter city name..." 
        value="${name}"
        aria-label="City name for weather">
      <button class="btn btn-primary" id="update-weather-btn">Update</button>
    </div>
  `;

  weatherLoading.style.display = 'none';
  weatherContent.style.display = 'block';
  weatherContent.innerHTML = weatherHTML;

  // Attach event listener to update button
  const updateBtn = document.getElementById('update-weather-btn');
  const cityInput = document.getElementById('city-input');

  updateBtn.addEventListener('click', () => {
    const newCity = cityInput.value.trim();
    if (newCity) {
      // Save preferred city to localStorage
      localStorage.setItem(STORAGE_KEYS.preferredCity, newCity);
      fetchWeatherData(newCity);
    }
  });

  // Allow Enter key to submit
  cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      updateBtn.click();
    }
  });
}

// =========================================
// 6. LOCAL STORAGE - PREFERRED CITY
// =========================================
function loadPreferredCity() {
  const savedCity = localStorage.getItem(STORAGE_KEYS.preferredCity);
  return savedCity || DEFAULT_CITY;
}

// =========================================
// 7. WELCOME MODAL - FIRST VISIT
// Uses localStorage to track visits
// =========================================
function checkFirstVisit() {
  const welcomeShown = localStorage.getItem(STORAGE_KEYS.welcomeShown);
  const lastVisit = localStorage.getItem(STORAGE_KEYS.lastVisit);
  const now = Date.now();

  if (!welcomeShown) {
    // First ever visit - show welcome modal
    showWelcomeModal();
    localStorage.setItem(STORAGE_KEYS.welcomeShown, 'true');
  }

  // Always update last visit timestamp
  localStorage.setItem(STORAGE_KEYS.lastVisit, now.toString());

  // Optional: Calculate days since last visit for analytics
  if (lastVisit) {
    const daysSinceLastVisit = Math.floor((now - parseInt(lastVisit)) / (1000 * 60 * 60 * 24));
    console.log(`Days since last visit: ${daysSinceLastVisit}`);
  }
}

function showWelcomeModal() {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-labelledby', 'welcome-title');

  modal.innerHTML = `
    <div class="modal-content welcome-modal">
      <button class="modal-close" aria-label="Close welcome modal">&times;</button>
      <div class="welcome-icon">🚵‍♂️</div>
      <h2 id="welcome-title">Welcome to Mountain E-Riders!</h2>
      <p>Thanks for visiting our community of electric mountain bike enthusiasts.</p>
      <p>Explore our trails, meet our riders, and join the adventure. Your next epic ride starts here.</p>
      <div class="welcome-features">
        <div class="feature">
          <span class="feature-icon">🗺️</span>
          <span>15+ Curated Trails</span>
        </div>
        <div class="feature">
          <span class="feature-icon">👥</span>
          <span>500+ Active Members</span>
        </div>
        <div class="feature">
          <span class="feature-icon">🌤️</span>
          <span>Real-time Weather</span>
        </div>
      </div>
      <button class="btn btn-primary modal-close-btn">Let's Ride!</button>
    </div>
  `;

  document.body.appendChild(modal);
  document.body.style.overflow = 'hidden';

  const closeButtons = modal.querySelectorAll('.modal-close, .modal-close-btn');
  closeButtons.forEach(btn => {
    btn.addEventListener('click', () => closeModal(modal));
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal(modal);
  });

  const escHandler = (e) => {
    if (e.key === 'Escape') {
      closeModal(modal);
      document.removeEventListener('keydown', escHandler);
    }
  };
  document.addEventListener('keydown', escHandler);
}

// =========================================
// 8. MODAL STYLES - INJECTED DYNAMICALLY
// (Could also be in CSS file)
// =========================================
function injectModalStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.85);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 1rem;
      animation: fadeIn 0.3s ease;
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    .modal-content {
      background: var(--color-black-bg);
      border: 2px solid var(--color-green-primary);
      border-radius: var(--radius-lg);
      padding: var(--space-lg);
      max-width: 500px;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
      position: relative;
      text-align: center;
      animation: slideUp 0.3s ease;
    }
    @keyframes slideUp {
      from { transform: translateY(30px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    .modal-close {
      position: absolute;
      top: 1rem;
      right: 1rem;
      font-size: 1.8rem;
      color: var(--text-secondary);
      line-height: 1;
      padding: 0.25rem 0.5rem;
      border-radius: var(--radius-sm);
      transition: all var(--transition-fast);
    }
    .modal-close:hover {
      color: var(--accent);
      background: var(--color-black-deep);
    }
    .modal-avatar {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      margin: 0 auto var(--space-sm);
      border: 3px solid var(--color-green-primary);
      object-fit: cover;
    }
    .modal-role {
      color: var(--accent);
      font-weight: 600;
      margin-bottom: var(--space-sm);
    }
    .modal-bio {
      color: var(--text-secondary);
      margin-bottom: var(--space-md);
      line-height: 1.6;
    }
    .modal-stats {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-sm);
      margin-bottom: var(--space-md);
    }
    .stat {
      background: var(--color-black-deep);
      padding: var(--space-sm);
      border-radius: var(--radius-sm);
    }
    .stat-value {
      display: block;
      font-size: 1.3rem;
      font-weight: 700;
      color: var(--color-green-primary);
      font-family: var(--font-heading);
    }
    .stat-label {
      font-size: 0.85rem;
      color: var(--text-secondary);
    }
    .welcome-icon {
      font-size: 4rem;
      margin-bottom: var(--space-sm);
    }
    .welcome-features {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--space-xs);
      margin: var(--space-md) 0;
    }
    .feature {
      background: var(--color-black-deep);
      padding: var(--space-sm);
      border-radius: var(--radius-sm);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.25rem;
    }
    .feature-icon {
      font-size: 1.8rem;
    }
    .feature span:last-child {
      font-size: 0.85rem;
      color: var(--text-secondary);
    }
    .weather-change {
      display: flex;
      gap: var(--space-xs);
      margin-top: var(--space-md);
      padding-top: var(--space-md);
      border-top: 1px solid var(--color-gray-border);
    }
    .weather-change input {
      flex: 1;
      padding: 0.5rem 0.75rem;
      background: var(--color-black-deep);
      border: 1px solid var(--color-gray-border);
      border-radius: var(--radius-sm);
      color: var(--text-primary);
      font-family: var(--font-body);
    }
    .weather-change input:focus {
      outline: 2px solid var(--color-green-primary);
      border-color: var(--color-green-primary);
    }
    .rider-stats {
      margin: var(--space-sm) 0;
      padding: var(--space-sm);
      background: var(--color-black-deep);
      border-radius: var(--radius-sm);
      font-size: 0.9rem;
    }
    .rider-stats p {
      margin-bottom: 0.25rem;
      color: var(--text-secondary);
    }
    .rider-stats strong {
      color: var(--color-green-primary);
    }
  `;
  document.head.appendChild(style);
}

// =========================================
// INITIALIZATION
// =========================================
document.addEventListener('DOMContentLoaded', () => {
  injectModalStyles();
  initNavigation();
  updateCopyrightYear();
  renderRiders();
  checkFirstVisit();

  // Load weather with preferred city
  const preferredCity = loadPreferredCity();
  fetchWeatherData(preferredCity);
});