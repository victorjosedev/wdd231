// Externalized script from form-action.html
// Displays membership data stored in localStorage

document.addEventListener('DOMContentLoaded', () => {
  // Update year
  const copyrightEl = document.getElementById('copyright-year');
  if (copyrightEl) copyrightEl.textContent = new Date().getFullYear();

  // Retrieve data
  const storedData = localStorage.getItem('membershipApplication');
  const summaryContainer = document.getElementById('submission-summary');

  if (summaryContainer) {
    if (storedData) {
      const data = JSON.parse(storedData);
      summaryContainer.innerHTML = `
        <ul class="summary-list">
          <li><strong>Name:</strong> ${data.firstName} ${data.lastName}</li>
          <li><strong>Email:</strong> ${data.email}</li>
          <li><strong>Phone:</strong> ${data.phone || 'Not provided'}</li>
          <li><strong>Experience Level:</strong> ${data.experience}</li>
          <li><strong>Comments:</strong> ${data.comments || 'None'}</li>
          <li><strong>Newsletter:</strong> ${data.newsletter === 'yes' ? 'Yes' : 'No'}</li>
        </ul>
      `;
    } else {
      summaryContainer.innerHTML = '<p>No application data found. Please fill out the form on the Join page.</p>';
    }
  }
});
