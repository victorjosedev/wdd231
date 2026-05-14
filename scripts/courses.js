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

let currentFilter = "all";

function displayCourses() {
    const container = document.getElementById('courses-container');
    if (!container) return;
    
    let filteredCourses = courses;
    if (currentFilter === "WDD") {
        filteredCourses = courses.filter(course => course.subject === "WDD");
    } else if (currentFilter === "CSE") {
        filteredCourses = courses.filter(course => course.subject === "CSE");
    }
    
    container.innerHTML = '';
    
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
    
    updateTotalCredits(filteredCourses);
}

function updateTotalCredits(coursesArray) {
    const totalCreditsSpan = document.getElementById('total-credits');
    if (totalCreditsSpan) {
        const total = coursesArray.reduce((sum, course) => sum + course.credits, 0);
        totalCreditsSpan.textContent = total;
    }
}

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

function updateActiveButton(activeFilter) {
    const allBtn = document.getElementById('show-all');
    const wddBtn = document.getElementById('show-wdd');
    const cseBtn = document.getElementById('show-cse');
    
    if (allBtn) allBtn.classList.remove('active');
    if (wddBtn) wddBtn.classList.remove('active');
    if (cseBtn) cseBtn.classList.remove('active');
    
    if (activeFilter === 'all' && allBtn) {
        allBtn.classList.add('active');
    } else if (activeFilter === 'WDD' && wddBtn) {
        wddBtn.classList.add('active');
    } else if (activeFilter === 'CSE' && cseBtn) {
        cseBtn.classList.add('active');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    displayCourses();
    setupFilterButtons();
});