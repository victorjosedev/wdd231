// Copyright year 
const currentYearSpan = document.getElementById('currentyear');
if (currentYearSpan) {
    const currentYear = new Date().getFullYear();
    currentYearSpan.textContent = currentYear;
}

// Last modified date
const lastModifiedParagraph = document.getElementById('lastModified');
if (lastModifiedParagraph) {
    const lastModified = document.lastModified;
    lastModifiedParagraph.textContent = `Last Modified: ${lastModified}`;
}