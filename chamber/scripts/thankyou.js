// read GET params and populate fields
const params = new URLSearchParams(window.location.search);
document.getElementById('out-firstname').textContent = params.get('firstname') || '';
document.getElementById('out-lastname').textContent = params.get('lastname') || '';
document.getElementById('out-email').textContent = params.get('email') || '';
document.getElementById('out-phone').textContent = params.get('phone') || '';
document.getElementById('out-organization').textContent = params.get('organization') || '';
const ts = params.get('timestamp');
document.getElementById('out-timestamp').textContent = ts ? new Date(ts).toLocaleString() : '';
