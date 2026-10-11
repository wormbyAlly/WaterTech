/* =========================================================
   WaterTech — Halaman Mengisi (Fase 1: Tampilan)
   ========================================================= */

/* ---------- KONFIGURASI PRESET ---------- */
const PRESETS = {
  cup:       { maxMl: 200,   bodyTop: 68,  bodyBottom: 192 },
  bottle:    { maxMl: 700,   bodyTop: 74,  bodyBottom: 195 },
  bigbottle: { maxMl: 2000,  bodyTop: 72,  bodyBottom: 200 },
  gallon:    { maxMl: 15000, bodyTop: 78,  bodyBottom: 208 },
};

/* ---------- BACA QUERY PARAM ---------- */
const params      = new URLSearchParams(location.search);
const presetId    = params.get('preset') || 'cup';
const targetVol   = parseInt(params.get('volume') || '200', 10);
const preset      = PRESETS[presetId] || PRESETS.cup;

/* ---------- ELEMEN ---------- */
const splash      = document.getElementById('splash');
const allSvgs     = document.querySelectorAll('.cup-svg');
const activeSvg   = document.querySelector(`.cup-svg[data-preset="${presetId}"]`);
const water       = activeSvg.querySelector('.water');
const progressFill = document.getElementById('progressFill');
const currentVolEl = document.getElementById('currentVol');
const modal        = document.getElementById('detectModal');

/* ---------- SPLASH ---------- */
const SPLASH_DURATION = 1800;
let splashDone = false;
let modalDismissed = false;

window.addEventListener('load', () => {
  // Aktifkan SVG yang sesuai SEBELUM splash hilang
  allSvgs.forEach(svg => svg.classList.toggle('active', svg.dataset.preset === presetId));
  renderWater(0);

  setTimeout(() => {
    splash.classList.add('is-hiding');
    splash.addEventListener('transitionend', () => {
      splash.classList.add('is-hidden');
      splashDone = true;

      // Buka modal setelah splash hilang
      setTimeout(openModal, 200);
    }, { once: true });
  }, SPLASH_DURATION);
});

/* ---------- RENDER WATER LEVEL ---------- */
// ratio: 0 → wadah kosong, 1 → wadah penuh (kapasitas max)
function renderWater(currentMl) {
  const ratio = Math.min(currentMl / preset.maxMl, 1);
  const waterY = preset.bodyBottom - ratio * (preset.bodyBottom - preset.bodyTop);

  water.style.transform = `translateY(${waterY}px)`;

  // Progress bar berbasis target (bukan max) supaya user ngerti seberapa jauh dari target
  const progress = Math.min(currentMl / targetVol, 1) * 100;
  progressFill.style.width = progress + '%';
  currentVolEl.textContent = Math.round(currentMl);
}

/* ---------- MODAL ---------- */
function openModal() {
  modal.classList.add('is-open');
}

function closeModal() {
  modal.classList.add('is-closing');
  modal.classList.remove('is-open');
  setTimeout(() => {
    modal.style.display = 'none';
    modalDismissed = true;
    startFilling();
  }, 300);
}

// Klik di mana saja pada modal → hilang
modal.addEventListener('click', () => {
  if (modalDismissed) return;
  closeModal();
});

/* ---------- FILLING ANIMATION ---------- */
const FILL_DURATION = 4000; // 4 detik untuk demo

function startFilling() {
  const startTime = performance.now();

  function tick(now) {
    const elapsed = now - startTime;
    const t       = Math.min(elapsed / FILL_DURATION, 1);
    const current = t * targetVol;

    renderWater(current);

    if (t < 1) {
      requestAnimationFrame(tick);
    } else {
      onFillComplete();
    }
  }

  requestAnimationFrame(tick);
}

/* ---------- SELESAI ---------- */
function onFillComplete() {
  renderWater(targetVol);

  // Tunggu sebentar biar user lihat "penuh" dulu, baru redirect
  setTimeout(() => {
    const total = parseInt(params.get('total') || '1000', 10);
    window.location.href =
      `selesai.html?preset=${presetId}&volume=${targetVol}&total=${total}`;
  }, 900);
}