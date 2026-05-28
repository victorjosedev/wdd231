const menuToggle = document.getElementById('menu-toggle');
const primaryNav = document.getElementById('primary-nav');

// Hamburger menu toggle
menuToggle.addEventListener('click', () => {
    primaryNav.classList.toggle('open');
    menuToggle.classList.toggle('open');
    
    if (primaryNav.classList.contains('open')) {
        menuToggle.textContent = '✕'; 
        menuToggle.setAttribute('aria-label', 'Close menu');
    } else {
        menuToggle.textContent = '☰'; 
        menuToggle.setAttribute('aria-label', 'Menu');
    }
});

const navLinks = document.querySelectorAll('#primary-nav a');

// Close menu on link click (mobile)
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth < 768) {
            primaryNav.classList.remove('open');
            menuToggle.classList.remove('open');
            menuToggle.textContent = '☰';
            menuToggle.setAttribute('aria-label', 'Menu');
        }
    });
});

// Dynamic Wayfinding
const currentUrl = window.location.href;
navLinks.forEach(link => {
    const isHome = link.href.endsWith('index.html');
    const isCurrentHome = currentUrl.endsWith('index.html') || currentUrl.endsWith('/chamber/') || currentUrl.endsWith('/chamber');
    const isDir = link.href.endsWith('directory.html');
    const isCurrentDir = currentUrl.endsWith('directory.html');

    if ((isHome && isCurrentHome) || (isDir && isCurrentDir) || link.href === currentUrl) {
        link.classList.add('active');
    } else {
        link.classList.remove('active');
    }
});

// Reset menu on resize
window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) {
        primaryNav.classList.remove('open');
        menuToggle.classList.remove('open');
        menuToggle.textContent = '☰';
        menuToggle.setAttribute('aria-label', 'Menu');
    }
});
