// Importar los datos desde el archivo JSON (mjs)
import places from '../data/places.mjs';

// Referencias a los elementos del DOM
const placesContainer = document.getElementById('places-container');
const visitorBanner = document.getElementById('visitor-message');

// ==========================================
// 1. GENERAR TARJETAS DINÁMICAMENTE
// ==========================================
function renderPlaces() {
    places.forEach((place, index) => {
        // Crear el elemento article
        const card = document.createElement('article');
        // Asignar clases para el CSS (place-card base y card-1 a card-8 para grid areas)
        card.className = `place-card card-${index + 1}`;

        // Construir el HTML interno de la tarjeta
        card.innerHTML = `
      <h2>${place.name}</h2>
      <figure>
        <img src="${place.image}" alt="Fotografía de ${place.name}" loading="lazy" width="300" height="200">
      </figure>
      <address>${place.address}</address>
      <p>${place.description}</p>
      <button class="learn-more-btn" aria-label="Aprender más sobre ${place.name}">Learn More</button>
    `;

        // Insertar la tarjeta en el contenedor
        placesContainer.appendChild(card);
    });
}

// ==========================================
// 2. LÓGICA DE LOCALSTORAGE (MENSAJE DE VISITA)
// ==========================================
function handleVisitorMessage() {
    const now = Date.now(); // Fecha actual en milisegundos
    const lastVisit = localStorage.getItem('lastVisit');
    let message = '';

    if (!lastVisit) {
        // Primera visita
        message = "Welcome! Let us know if you have any questions.";
    } else {
        // Calcular la diferencia en días
        const diff = now - parseInt(lastVisit);
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days < 1) {
            // Menos de un día
            message = "Back so soon! Awesome!";
        } else {
            // 1 día o más
            const dayWord = days === 1 ? "day" : "days";
            message = `You last visited ${days} ${dayWord} ago.`;
        }
    }

    // Actualizar la fecha de la última visita en localStorage
    localStorage.setItem('lastVisit', now);

    // Inyectar el mensaje y el botón de cerrar en el banner
    visitorBanner.innerHTML = `
    <span>${message}</span>
    <button id="close-banner" aria-label="Cerrar mensaje de bienvenida">&times;</button>
  `;

    // Funcionalidad para cerrar el banner
    document.getElementById('close-banner').addEventListener('click', () => {
        visitorBanner.style.display = 'none';
    });
}

// ==========================================
// 3. INICIALIZAR LA PÁGINA
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    renderPlaces();
    handleVisitorMessage();
});