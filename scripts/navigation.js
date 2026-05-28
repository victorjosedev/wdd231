// Enhanced navigation: accessible hamburger and breadcrumb (wayfinding)
const menuToggle = document.getElementById('menu-toggle');
const primaryNav = document.getElementById('primary-nav');
const breadcrumbNav = document.getElementById('breadcrumb');

function closeMenu() {
    if (primaryNav.classList.contains('show')) {
        primaryNav.classList.remove('show');
        menuToggle.textContent = '☰';
        menuToggle.setAttribute('aria-label', 'Menu');
        menuToggle.setAttribute('aria-expanded', 'false');
    }
}

if (menuToggle && primaryNav) {
    menuToggle.addEventListener('click', () => {
        const isOpen = primaryNav.classList.toggle('show');
        menuToggle.setAttribute('aria-expanded', String(isOpen));

        if (isOpen) {
            menuToggle.textContent = '✕';
            menuToggle.setAttribute('aria-label', 'Close menu');
            // Move focus to first link for quick keyboard navigation
            const firstLink = primaryNav.querySelector('a');
            if (firstLink) firstLink.focus();
        } else {
            menuToggle.textContent = '☰';
            menuToggle.setAttribute('aria-label', 'Menu');
            menuToggle.focus();
        }
    });

    const navLinks = document.querySelectorAll('#primary-nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 768) {
                closeMenu();
            }
        });
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768) {
            // Ensure menu is visible in desktop and button state reset
            primaryNav.classList.remove('show');
            menuToggle.textContent = '☰';
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.setAttribute('aria-label', 'Menu');
        }
    });
}

// Wayfinding / breadcrumb and active-link highlighting
window.addEventListener('DOMContentLoaded', () => {
    // Highlight active nav link based on pathname
    const path = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('#primary-nav a');
    let activeText = 'Home';

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href === path) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
            activeText = link.textContent.trim();
        } else {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
        }
    });

    // Populate breadcrumb: Home > Current
    if (breadcrumbNav) {
        const ol = breadcrumbNav.querySelector('ol');
        if (ol) {
            // Clear any existing crumbs except Home
            ol.innerHTML = '';
            const homeLi = document.createElement('li');
            const homeA = document.createElement('a');
            homeA.href = 'index.html';
            homeA.textContent = 'Home';
            homeLi.appendChild(homeA);
            ol.appendChild(homeLi);

            if (activeText && activeText.toLowerCase() !== 'home') {
                const currentLi = document.createElement('li');
                const currentA = document.createElement('a');
                currentA.href = '#';
                currentA.textContent = activeText;
                currentA.setAttribute('aria-current', 'page');
                currentLi.appendChild(currentA);
                ol.appendChild(currentLi);
            }
        }
    }
});