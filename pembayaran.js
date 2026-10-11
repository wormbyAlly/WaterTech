/* =========================================================
   WaterTech — Halaman Pembayaran (Fase 1: Tampilan)
   QRIS dummy generator + countdown timer
   ========================================================= */

/* ---------- SPLASH ---------- */
const splash = document.getElementById('splash');
const app    = document.getElementById('app');
const SPLASH_DURATION = 1800;

window.addEventListener('load', () => {
  setTimeout(() => {
    splash.classList.add('is-hiding');
    splash.addEventListener('transitionend', () => {
      splash.classList.add('is-hidden');
      app.hidden = false;
      startTimer();
      generateDummyQR();
    }, { once: true });
  }, SPLASH_DURATION);
});

/* ---------- BACA QUERY PARAM ---------- */
const params     = new URLSearchParams(location.search);
const totalParam = parseInt(params.get('total') || '1000', 10);
const volumeParam = params.get('volume') || '200';
const presetParam = params.get('preset') || 'cup';

document.getElementById('priceValue').textContent =
  totalParam.toLocaleString('id-ID');

/* ---------- DUMMY QR GENERATOR ---------- */
function generateDummyQR() {
  const box = document.getElementById('qrBox');

  const canvas = document.createElement('canvas');
  const SIZE   = 25;       // 25 x 25 modul (QR versi 2-an, cukup realistis)
  const CELL   = 8;        // px per modul (nanti di-scale CSS)
  canvas.width  = SIZE * CELL;
  canvas.height = SIZE * CELL;

  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Seed pseudo-random deterministik biar pola selalu sama
  let seed = 0;
  for (let i = 0; i < presetParam.length; i++) seed += presetParam.charCodeAt(i);
  seed += totalParam;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  // Helper: gambarkan position detection pattern (kotak 7x7 di 3 sudut)
  const drawFinder = (gx, gy) => {
    ctx.fillStyle = '#000';
    ctx.fillRect(gx * CELL, gy * CELL, 7 * CELL, 7 * CELL);
    ctx.fillStyle = '#fff';
    ctx.fillRect((gx + 1) * CELL, (gy + 1) * CELL, 5 * CELL, 5 * CELL);
    ctx.fillStyle = '#000';
    ctx.fillRect((gx + 2) * CELL, (gy + 2) * CELL, 3 * CELL, 3 * CELL);
  };

  // Gambar data random dulu
  ctx.fillStyle = '#000';
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      if (rand() > 0.55) {
        ctx.fillRect(x * CELL, y * CELL, CELL, CELL);
      }
    }
  }

  // Timpa area finder + separator jadi putih dulu
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 8 * CELL, 8 * CELL);
  ctx.fillRect((SIZE - 8) * CELL, 0, 8 * CELL, 8 * CELL);
  ctx.fillRect(0, (SIZE - 8) * CELL, 8 * CELL, 8 * CELL);

  // Gambar 3 finder pattern
  drawFinder(0, 0);                     // kiri atas
  drawFinder(SIZE - 7, 0);              // kanan atas
  drawFinder(0, SIZE - 7);              // kiri bawah

  // Timing pattern (garis putus-putus horizontal & vertikal)
  ctx.fillStyle = '#000';
  for (let i = 8; i < SIZE - 8; i += 2) {
    ctx.fillRect(i * CELL, 6 * CELL, CELL, CELL);
    ctx.fillRect(6 * CELL, i * CELL, CELL, CELL);
  }

  box.innerHTML = '';
  box.appendChild(canvas);
}

/* ---------- COUNTDOWN TIMER ---------- */
const TIMER_SECONDS = 5 * 60; // 05:00
let remaining       = TIMER_SECONDS;
let timerInterval   = null;
const timerEl       = document.getElementById('timer');

function formatTime(s) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

function startTimer() {
  timerEl.textContent = formatTime(remaining);

  timerInterval = setInterval(() => {
    remaining--;
    timerEl.textContent = formatTime(Math.max(remaining, 0));

    if (remaining <= 0) {
      clearInterval(timerInterval);
      // TODO: nanti tampilkan state expired / kembali ke index
      console.log('[TODO] QR expired');
    }
  }, 1000);
}

/* ---------- TOMBOL DEMO ---------- */
document.getElementById('demoBtn').addEventListener('click', () => {
  const nextUrl = `mengisi.html?preset=${presetParam}&volume=${volumeParam}&total=${totalParam}`;
  window.location.href = nextUrl;
});