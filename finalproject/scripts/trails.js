// =========================================
// MOUNTAIN E-RIDERS - TRAILS.JS
// Trails directory functionality
// =========================================

// ES Modules Import
import trails from './data/trails.mjs';

// =========================================
// DOM REFERENCES
// =========================================
const trailsContainer = document.getElementById('trails-container');
const filterButtons = document.querySelectorAll('.filter-btn');
const trailCountDisplay = document.getElementById('trail-count');
const copyrightYear = document.getElementById('copyright-year');
const menuToggle = document.getElementById('menu-toggle');
const primaryNav = document.getElementById('primary-nav');

// Modal References
const modal = document.getElementById('trail-modal');
const modalBody = document.getElementById('modal-body');
const modalCloseBtn = document.querySelector('.modal-close');

// =========================================
// 1. NAVIGATION & FOOTER (Reused logic)
// =========================================
function initNavigation() {
  if (!menuToggle || !primaryNav) return;
  menuToggle.addEventListener('click', () => {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', !isExpanded);
    primaryNav.classList.toggle('open');
  });
}

function updateCopyrightYear() {
  if (copyrightYear) copyrightYear.textContent = new Date().getFullYear();
}

// =========================================
// 2. DYNAMIC TRAIL RENDERING
// Uses: Array map(), Template Literals, DOM Manipulation
// =========================================
function renderTrails(trailsToRender) {
  if (!trailsContainer) return;

  // Using map() array method to generate HTML
  const trailsHTML = trailsToRender.map((trail) => `
    <article class="trail-card">
      <div class="trail-image-container">
        <img 
          src="${trail.image}" 
          alt="Scenic view of ${trail.name} trail" 
          class="trail-image" 
          loading="lazy" 
          width="400" 
          height="225">
        <span class="trail-difficulty-badge">${trail.difficulty}</span>
      </div>
      <div class="trail-content">
        <h3>${trail.name}</h3>
        <p class="trail-location">📍 ${trail.location}</p>
        <p class="trail-description">${trail.description}</p>
        <div class="trail-stats">
          <div class="trail-stat">
            <span class="trail-stat-value">${trail.distance}</span>
            <span class="trail-stat-label">Distance</span>
          </div>
          <div class="trail-stat">
            <span class="trail-stat-value">${trail.elevation}</span>
            <span class="trail-stat-label">Elevation</span>
          </div>
          <div class="trail-stat">
            <span class="trail-stat-value">⭐ ${trail.rating}</span>
            <span class="trail-stat-label">Rating</span>
          </div>
        </div>
        <button 
          class="btn btn-primary btn-view-details" 
          data-trail-id="${trail.id}"
          aria-label="View details for ${trail.name}">
          View Details
        </button>
      </div>
    </article>
  `).join('');

  trailsContainer.innerHTML = trailsHTML;
  trailCountDisplay.textContent = `Showing ${trailsToRender.length} trail${trailsToRender.length !== 1 ? 's' : ''}`;

  // Attach event listeners to new buttons
  attachModalListeners();
}

// =========================================
// 3. FILTERING FUNCTIONALITY
// Uses: Array filter(), Event Listeners
// =========================================
function initFilters() {
  filterButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      // Update active button styling
      filterButtons.forEach(btn => btn.classList.remove('active'));
      e.target.classList.add('active');

      // Get filter value
      const filterValue = e.target.dataset.filter;

      // Using filter() array method
      let filteredTrails;
      if (filterValue === 'all') {
        filteredTrails = trails;
      } else {
        filteredTrails = trails.filter(trail => trail.difficulty === filterValue);
      }

      renderTrails(filteredTrails);
    });
  });
}

// =========================================
// 4. MODAL DIALOG - TRAIL DETAILS
// Accessible modal with dynamic content
// =========================================
function attachModalListeners() {
  const viewButtons = document.querySelectorAll('.btn-view-details');

  viewButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const trailId = parseInt(e.target.dataset.trailId);
      // Using find() array method
      const trail = trails.find(t => t.id === trailId);
      if (trail) openTrailModal(trail);
    });
  });
}

function openTrailModal(trail) {
  // Using template literals for complex modal content
  modalBody.innerHTML = `
    <img src="${trail.image}" alt="${trail.name}" class="modal-image" width="600" height="338">
    <h2 id="modal-trail-title">${trail.name}</h2>
    <p class="trail-location" style="font-size: 1.1rem; margin-bottom: 1rem;">📍 ${trail.location}</p>
    <p style="margin-bottom: 1rem; line-height: 1.6;">${trail.description}</p>
    
    <div class="trail-stats" style="margin-bottom: 1rem;">
      <div class="trail-stat">
        <span class="trail-stat-value">${trail.distance}</span>
        <span class="trail-stat-label">Distance</span>
      </div>
      <div class="trail-stat">
        <span class="trail-stat-value">${trail.elevation}</span>
        <span class="trail-stat-label">Elevation</span>
      </div>
      <div class="trail-stat">
        <span class="trail-stat-value">${trail.difficulty}</span>
        <span class="trail-stat-label">Difficulty</span>
      </div>
      <div class="trail-stat">
        <span class="trail-stat-value">⭐ ${trail.rating}</span>
        <span class="trail-stat-label">Rating</span>
      </div>
    </div>

    <div class="modal-tags">
      ${trail.tags.map(tag => `<span class="modal-tag">#${tag}</span>`).join('')}
    </div>
  `;

  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  modalCloseBtn.focus();
}

function closeModal() {
  modal.style.display = 'none';
  document.body.style.overflow = '';
}

// =========================================
// 5. MODAL EVENT LISTENERS
// =========================================
modalCloseBtn.addEventListener('click', closeModal);

modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.style.display === 'flex') {
    closeModal();
  }
});

// =========================================
// INITIALIZATION
// =========================================
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  updateCopyrightYear();
  renderTrails(trails); // Render all trails initially
  initFilters();
});