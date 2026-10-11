/* =========================================================
   WaterTech — Halaman Selesai (Fase 1: Tampilan)
   ========================================================= */

/* ---------- SPLASH ---------- */
const splash = document.getElementById('splash');
const SPLASH_DURATION = 1800;

window.addEventListener('load', () => {
  setTimeout(() => {
    splash.classList.add('is-hiding');
    splash.addEventListener('transitionend', () => {
      splash.classList.add('is-hidden');
    }, { once: true });
  }, SPLASH_DURATION);
});

/* ---------- BACA QUERY PARAM ---------- */
const params    = new URLSearchParams(location.search);
const presetId  = params.get('preset') || 'cup';
const volume    = parseInt(params.get('volume') || '200', 10);

/* ---------- FORMAT VOLUME ---------- */
function formatVolume(v) {
  return v >= 1000 ? (v / 1000) + 'L' : v + 'ml';
}

document.getElementById('detailVolume').textContent = formatVolume(volume);

/* ---------- TOMBOL TRANSAKSI BARU ---------- */
document.getElementById('newTxBtn').addEventListener('click', () => {
  // Reset ke halaman awal — clear query param
  window.location.href = 'index.html';
});