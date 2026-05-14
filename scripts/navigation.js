// navigation.js - Control del menú hamburguesa

const menuToggle = document.getElementById('menu-toggle');
const primaryNav = document.getElementById('primary-nav');

menuToggle.addEventListener('click', () => {
    primaryNav.classList.toggle('show');
    
    // Cambiar el ícono del botón (opcional)
    if (primaryNav.classList.contains('show')) {
        menuToggle.textContent = '✕'; // Cambia a "X" cuando está abierto
        menuToggle.setAttribute('aria-label', 'Close menu');
    } else {
        menuToggle.textContent = '☰'; // Vuelve a hamburguesa
        menuToggle.setAttribute('aria-label', 'Menu');
    }
});

// Cerrar el menú automáticamente cuando se hace click en un enlace (para mobile)
const navLinks = document.querySelectorAll('#primary-nav a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth < 768) {
            primaryNav.classList.remove('show');
            menuToggle.textContent = '☰';
            menuToggle.setAttribute('aria-label', 'Menu');
        }
    });
});

// Asegurar que el menú se muestre correctamente al redimensionar la ventana
window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) {
        primaryNav.classList.remove('show');
        menuToggle.textContent = '☰';
    }
});