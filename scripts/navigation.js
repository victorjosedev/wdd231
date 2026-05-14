const menuToggle = document.getElementById('menu-toggle');
const primaryNav = document.getElementById('primary-nav');

menuToggle.addEventListener('click', () => {
    primaryNav.classList.toggle('show');
    
    if (primaryNav.classList.contains('show')) {
        menuToggle.textContent = '✕'; 
        menuToggle.setAttribute('aria-label', 'Close menu');
    } else {
        menuToggle.textContent = '☰'; 
        menuToggle.setAttribute('aria-label', 'Menu');
    }
});

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

window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) {
        primaryNav.classList.remove('show');
        menuToggle.textContent = '☰';
    }
});