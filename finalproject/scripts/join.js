// =========================================
// MOUNTAIN E-RIDERS - JOIN.JS
// Events rendering and Form handling
// =========================================

// DOM References
const eventsContainer = document.getElementById('events-container');
const membershipForm = document.getElementById('membership-form');
const copyrightYear = document.getElementById('copyright-year');
const menuToggle = document.getElementById('menu-toggle');
const primaryNav = document.getElementById('primary-nav');

// =========================================
// 1. NAVIGATION & FOOTER
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
// 2. DYNAMIC EVENTS RENDERING
// Uses: Array forEach(), Template Literals
// =========================================
const upcomingEvents = [
    {
        title: "Sunrise Summit Ride",
        date: "July 15, 2026",
        time: "6:00 AM",
        location: "Alpine Summit Route Trailhead",
        description: "An early morning climb to catch the sunrise from the top. Intermediate level required."
    },
    {
        title: "Family Forest Cruise",
        date: "July 22, 2026",
        time: "10:00 AM",
        location: "Lakeshore Greenway",
        description: "A relaxed, flat ride perfect for families and beginners. Helmets required for all ages."
    },
    {
        title: "Technical Skills Clinic",
        date: "July 29, 2026",
        time: "2:00 PM",
        location: "Pine Valley Descent",
        description: "Learn how to navigate rocky sections, tight switchbacks, and steep descents safely."
    }
];

function renderEvents() {
    if (!eventsContainer) return;

    let eventsHTML = '';

    // Using forEach array method
    upcomingEvents.forEach(event => {
        eventsHTML += `
      <article class="event-card">
        <div class="event-date-badge">
          <span class="event-month">${event.date.split(' ')[0]}</span>
          <span class="event-day">${event.date.split(' ')[1].replace(',', '')}</span>
        </div>
        <div class="event-details">
          <h3>${event.title}</h3>
          <p class="event-meta">🕒 ${event.time} | 📍 ${event.location}</p>
          <p class="event-desc">${event.description}</p>
        </div>
      </article>
    `;
    });

    eventsContainer.innerHTML = eventsHTML;
}

// =========================================
// 3. FORM HANDLING & LOCALSTORAGE
// =========================================
function initForm() {
    if (!membershipForm) return;

    membershipForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent default page reload

        // Gather form data using FormData API
        const formData = new FormData(membershipForm);
        const data = Object.fromEntries(formData.entries());

        // Save to LocalStorage (Requirement)
        localStorage.setItem('membershipApplication', JSON.stringify(data));

        // Redirect to the form action page
        window.location.href = 'form-action.html';
    });
}

// =========================================
// INITIALIZATION
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    updateCopyrightYear();
    renderEvents();
    initForm();
});