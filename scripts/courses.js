// courses.js - Array de cursos, filtros y total de créditos

// Array de cursos (basado en el enlace que menciona el proyecto)
const courses = [
    { code: "WDD 130", name: "Web Fundamentals", credits: 2, completed: true, subject: "WDD" },
    { code: "WDD 131", name: "Dynamic Web Fundamentals", credits: 2, completed: true, subject: "WDD" },
    { code: "WDD 231", name: "Web Frontend Development I", credits: 2, completed: false, subject: "WDD" },
    { code: "WDD 331", name: "Advanced CSS", credits: 2, completed: false, subject: "WDD" },
    { code: "CSE 110", name: "Programming Building Blocks", credits: 3, completed: true, subject: "CSE" },
    { code: "CSE 111", name: "Programming with Functions", credits: 3, completed: true, subject: "CSE" },
    { code: "CSE 210", name: "Programming with Classes", credits: 3, completed: false, subject: "CSE" },
    { code: "CSE 310", name: "Data Structures & Algorithms", credits: 3, completed: false, subject: "CSE" }
];

// Variables globales
let currentFilter = "all";

// Función para mostrar los cursos según el filtro actual
function displayCourses() {
    const container = document.getElementById('courses-container');
    if (!container) return;
    
    // Filtrar cursos según el filtro actual
    let filteredCourses = courses;
    if (currentFilter === "WDD") {
        filteredCourses = courses.filter(course => course.subject === "WDD");
    } else if (currentFilter === "CSE") {
        filteredCourses = courses.filter(course => course.subject === "CSE");
    }
    
    // Limpiar el contenedor
    container.innerHTML = '';
    
    // Crear y agregar cada tarjeta de curso
    filteredCourses.forEach(course => {
        const courseCard = document.createElement('div');
        courseCard.className = 'course-card';
        if (course.completed) {
            courseCard.classList.add('completed');
        }
        
        courseCard.innerHTML = `
            <h3>${course.code}</h3>
            <p>${course.name}</p>
            <p>Credits: ${course.credits}</p>
        `;
        
        container.appendChild(courseCard);
    });
    
    // Actualizar el total de créditos
    updateTotalCredits(filteredCourses);
}

// Función para actualizar el total de créditos usando reduce()
function updateTotalCredits(coursesArray) {
    const totalCreditsSpan = document.getElementById('total-credits');
    if (totalCreditsSpan) {
        const total = coursesArray.reduce((sum, course) => sum + course.credits, 0);
        totalCreditsSpan.textContent = total;
    }
}

// Función para configurar los botones de filtro
function setupFilterButtons() {
    const allBtn = document.getElementById('show-all');
    const wddBtn = document.getElementById('show-wdd');
    const cseBtn = document.getElementById('show-cse');
    
    if (allBtn) {
        allBtn.addEventListener('click', () => {
            currentFilter = "all";
            updateActiveButton('all');
            displayCourses();
        });
    }
    
    if (wddBtn) {
        wddBtn.addEventListener('click', () => {
            currentFilter = "WDD";
            updateActiveButton('WDD');
            displayCourses();
        });
    }
    
    if (cseBtn) {
        cseBtn.addEventListener('click', () => {
            currentFilter = "CSE";
            updateActiveButton('CSE');
            displayCourses();
        });
    }
}

// Función para actualizar el estilo del botón activo
function updateActiveButton(activeFilter) {
    const allBtn = document.getElementById('show-all');
    const wddBtn = document.getElementById('show-wdd');
    const cseBtn = document.getElementById('show-cse');
    
    // Remover clase active de todos
    if (allBtn) allBtn.classList.remove('active');
    if (wddBtn) wddBtn.classList.remove('active');
    if (cseBtn) cseBtn.classList.remove('active');
    
    // Agregar clase active al botón correspondiente
    if (activeFilter === 'all' && allBtn) {
        allBtn.classList.add('active');
    } else if (activeFilter === 'WDD' && wddBtn) {
        wddBtn.classList.add('active');
    } else if (activeFilter === 'CSE' && cseBtn) {
        cseBtn.classList.add('active');
    }
}

// Inicializar cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    displayCourses();
    setupFilterButtons();
});