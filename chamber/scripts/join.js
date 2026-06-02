// set timestamp when page loads
const tsField = document.getElementById('timestamp');
if (tsField) tsField.value = new Date().toISOString();

// modal open/close
document.querySelectorAll('.learn-more').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const id = btn.dataset.target;
    const dlg = document.getElementById(id);
    if (dlg && typeof dlg.showModal === 'function') {
      dlg.showModal();
    } else if (dlg) {
      dlg.setAttribute('open', '');
    }
  });
});

document.querySelectorAll('dialog .modal-close').forEach(b => {
  b.addEventListener('click', e => {
    const dlg = e.target.closest('dialog');
    if (dlg && typeof dlg.close === 'function') dlg.close();
    else if (dlg) dlg.removeAttribute('open');
  });
});

// accessibility: close dialog with Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') document.querySelectorAll('dialog').forEach(d => { if (d.open) d.close(); });
});
