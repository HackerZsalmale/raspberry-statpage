// ---- config ----
const POLL_MS = 1000;    
const HISTORY_LEN = 40;  
const SEGMENTS = 20;      

const METRICS = ['cpu', 'ram', 'disk'];
const history = { cpu: [], ram: [], disk: [] };


function buildMeter(el) {
  el.innerHTML = '';
  for (let i = 0; i < SEGMENTS; i++) {
    const seg = document.createElement('div');
    seg.className = 'seg';
    el.appendChild(seg);
  }
}

function segmentColor(index) {
  const pct = ((index + 1) / SEGMENTS) * 100;
  if (pct <= 60) return 'var(--ok)';
  if (pct <= 85) return 'var(--warn)';
  return 'var(--crit)';
}

function updateMeter(el, value) {
  const litCount = Math.round((value / 100) * SEGMENTS);
  [...el.children].forEach((seg, i) => {
    seg.style.background = i < litCount ? segmentColor(i) : 'var(--off)';
  });
}

function updateSpark(svg, values) {
  const [line, fill] = svg.querySelectorAll('polyline');
  if (values.length < 2) return;

  const stepX = 100 / (HISTORY_LEN - 1);
  const startX = 100 - (values.length - 1) * stepX;

  const points = values.map((v, i) => {
    const x = startX + i * stepX;
    const y = 32 - (Math.max(0, Math.min(100, v)) / 100) * 30;
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  });

  line.setAttribute('points', points.join(' '));
  fill.setAttribute(
    'points',
    `${points[0].split(',')[0]},32 ${points.join(' ')} ${points[points.length - 1].split(',')[0]},32`
  );
}

function setStatus(connected) {
  const status = document.getElementById('status');
  const text = document.getElementById('statusText');
  status.classList.toggle('offline', !connected);
  text.textContent = connected ? 'Live' : 'Offline';
}

function recordAndRender(metric, value) {
  const series = history[metric];
  series.push(value);
  if (series.length > HISTORY_LEN) series.shift();

  document.getElementById(`${metric}Value`).textContent = value;
  updateMeter(document.getElementById(`${metric}Meter`), value);
  updateSpark(document.getElementById(`${metric}Spark`), series);
}

async function loadStats() {
  try {
    const res = await fetch('/api/stats');
    if (!res.ok) throw new Error('bad response');
    const data = await res.json();

    recordAndRender('cpu', data.cpu_usage_percent);
    recordAndRender('ram', data.ram_usage_percent);
    recordAndRender('disk', data.disk_usage_percent);
    document.getElementById('name').textContent = data.host;

    document.getElementById('time').textContent = data.last_updated;
    setStatus(true);
  } catch (err) {
    setStatus(false);
  }
}

METRICS.forEach(m => buildMeter(document.getElementById(`${m}Meter`)));

setInterval(loadStats, POLL_MS);
loadStats();
