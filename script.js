/* =========================================================
   WaterTech — UI Prototype (Fase 1: Tampilan)
   ========================================================= */

/* ---------- PRESETS ---------- */
const PRESETS = [
  {
    id: 'cup',
    caption: 'CUP (MAX 200ML)',
    minMl: 50,   maxMl: 200,   step: 50,   defaultMl: 200,
    pricePerMl: 5,          // 200ml → Rp 1.000
    bodyTop: 68,            // y air saat penuh
    bodyBottom: 192,        // y air saat kosong
  },
  {
    id: 'bottle',
    caption: 'BOTOL (MAX 700ML)',
    minMl: 100,  maxMl: 700,   step: 100,  defaultMl: 700,
    pricePerMl: 4,          // 700ml → Rp 2.800
    bodyTop: 74,
    bodyBottom: 195,
  },
  {
    id: 'bigbottle',
    caption: 'BOTOL BESAR (MAX 2L)',
    minMl: 500,  maxMl: 2000,  step: 250,  defaultMl: 2000,
    pricePerMl: 3,          // 2L → Rp 6.000
    bodyTop: 72,
    bodyBottom: 200,
  },
  {
    id: 'gallon',
    caption: 'GALON (MAX 15L)',
    minMl: 2000, maxMl: 15000, step: 1000, defaultMl: 15000,
    pricePerMl: 1.5,        // 15L → Rp 22.500
    bodyTop: 78,
    bodyBottom: 208,
  },
];

let presetIndex = 0;
let volume = PRESETS[0].defaultMl;

/* ---------- ELEMEN ---------- */
const splash     = document.getElementById('splash');
const app        = document.getElementById('app');
const cupCaption = document.getElementById('cupCaption');
const volValue   = document.getElementById('volValue');
const totalPrice = document.getElementById('totalPrice');
const btnMinus   = document.getElementById('minusVol');
const btnPlus    = document.getElementById('plusVol');
const btnPrev    = document.getElementById('prevPreset');
const btnNext    = document.getElementById('nextPreset');
const btnPay     = document.getElementById('payBtn');
const allSvgs    = document.querySelectorAll('.cup-svg');

/* ---------- SPLASH ---------- */
const SPLASH_DURATION = 1800;

window.addEventListener('load', () => {
  setTimeout(() => {
    splash.classList.add('is-hiding');
    splash.addEventListener('transitionend', () => {
      splash.classList.add('is-hidden');
      app.hidden = false;
    }, { once: true });
  }, SPLASH_DURATION);
});

/* ---------- HELPER ---------- */
function formatVolume(v) {
  return v >= 1000 ? (v / 1000) + 'L' : v + 'ml';
}

/* ---------- RENDER ---------- */
function render() {
  const p = PRESETS[presetIndex];

  // Aktifkan SVG yang sesuai
  allSvgs.forEach(svg => {
    svg.classList.toggle('active', svg.dataset.preset === p.id);
  });

  // Update air + label di SVG aktif
  const activeSvg = document.querySelector(`.cup-svg[data-preset="${p.id}"]`);
  const water = activeSvg.querySelector('.water');
  const label = activeSvg.querySelector('.water-label');

  const ratio  = (volume - p.minMl) / (p.maxMl - p.minMl || 1);
  const waterY = p.bodyBottom - ratio * (p.bodyBottom - p.bodyTop);

  water.style.transform = `translateY(${waterY}px)`;

  // Label: mengikuti permukaan air, tapi tetap di dalam container
  const rawLabelY = waterY + 20;
  const labelY    = Math.min(Math.max(rawLabelY, p.bodyTop + 22), p.bodyBottom - 12);
  label.style.transform = `translateY(${labelY}px)`;
  label.textContent = formatVolume(volume);

  // Caption, harga, angka
  cupCaption.textContent = p.caption;
  volValue.textContent   = volume;
  totalPrice.textContent = Math.round(volume * p.pricePerMl).toLocaleString('id-ID');

  // State tombol
  btnMinus.disabled = presetIndex === 0 && volume <= PRESETS[0].minMl;
  btnPlus.disabled  = presetIndex === PRESETS.length - 1 && volume >= PRESETS[PRESETS.length - 1].maxMl;
}

/* ---------- EVENT: + / - ---------- */
btnPlus.addEventListener('click', () => {
  const p = PRESETS[presetIndex];

  if (volume + p.step <= p.maxMl) {
    volume += p.step;
  } else if (presetIndex < PRESETS.length - 1) {
    // Auto-upgrade container → mulai dari min container berikutnya
    presetIndex++;
    volume = PRESETS[presetIndex].minMl;
  } else {
    return; // sudah paling max
  }
  render();
});

btnMinus.addEventListener('click', () => {
  const p = PRESETS[presetIndex];

  if (volume - p.step >= p.minMl) {
    volume -= p.step;
  } else if (presetIndex > 0) {
    // Auto-downgrade container → mulai dari max container sebelumnya
    presetIndex--;
    volume = PRESETS[presetIndex].maxMl;
  } else {
    return; // sudah paling min
  }
  render();
});

/* ---------- EVENT: < / > (pindah preset manual) ---------- */
function switchPreset(delta) {
  presetIndex = (presetIndex + delta + PRESETS.length) % PRESETS.length;
  volume = PRESETS[presetIndex].defaultMl;
  render();
}
btnPrev.addEventListener('click', () => switchPreset(-1));
btnNext.addEventListener('click', () => switchPreset(1));

/* ---------- EVENT: BAYAR ---------- */
btnPay.addEventListener('click', () => {
  const p = PRESETS[presetIndex];
  const total = Math.round(volume * p.pricePerMl);

  const url = `pembayaran.html?preset=${p.id}&volume=${volume}&total=${total}`;
  window.location.href = url;
});

/* ---------- INIT ---------- */
render();