// GrandRP HUB — Tactical Timer Widget
import { playTacticalSound } from '../utils/sounds.js';
import { icons } from '../utils/icons.js';

const PRESETS = [
  { id: 'miranda', label: 'Miranda Reading', seconds: 30, color: '#3b82f6' },
  { id: 'detention', label: 'Detention Limit', seconds: 900, color: '#f59e0b' },
  { id: 'arrest', label: 'Arrest Clock', seconds: 1500, color: '#ef4444' },
  { id: 'custom', label: 'Custom Timer', seconds: 300, color: '#10b981' },
];

let timerState = {
  active: false,
  preset: null,
  remaining: 0,
  total: 0,
  intervalId: null,
  paused: false,
};

function formatTime(secs) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function updateTimerDisplay() {
  const el = document.getElementById('tactical-timer-display');
  const bar = document.getElementById('tactical-timer-bar');
  const headerBadge = document.getElementById('header-timer-badge');
  
  if (el) {
    el.textContent = formatTime(timerState.remaining);
    el.classList.toggle('timer-urgent', timerState.remaining <= 30 && timerState.remaining > 0);
  }
  if (bar && timerState.total > 0) {
    const pct = ((timerState.total - timerState.remaining) / timerState.total) * 100;
    bar.style.width = `${pct}%`;
  }
  if (headerBadge) {
    if (timerState.active && !timerState.paused) {
      headerBadge.textContent = formatTime(timerState.remaining);
      headerBadge.style.display = 'inline-flex';
    } else {
      headerBadge.style.display = 'none';
    }
  }
}

function tick() {
  if (timerState.remaining <= 0) {
    stopTimer();
    playTacticalSound('mention');
    const el = document.getElementById('tactical-timer-display');
    if (el) el.textContent = '00:00';
    return;
  }
  timerState.remaining--;
  updateTimerDisplay();
}

export function startTimer(presetId, customSeconds) {
  stopTimer();
  const preset = PRESETS.find(p => p.id === presetId) || PRESETS[0];
  const secs = presetId === 'custom' ? (customSeconds || 300) : preset.seconds;
  
  timerState = {
    active: true,
    preset: preset,
    remaining: secs,
    total: secs,
    intervalId: setInterval(tick, 1000),
    paused: false,
  };
  
  playTacticalSound('nav');
  updateTimerDisplay();
  renderTimerWidget();
}

export function pauseTimer() {
  if (!timerState.active) return;
  if (timerState.paused) {
    timerState.intervalId = setInterval(tick, 1000);
    timerState.paused = false;
  } else {
    clearInterval(timerState.intervalId);
    timerState.paused = true;
  }
  renderTimerWidget();
}

export function stopTimer() {
  clearInterval(timerState.intervalId);
  timerState = { active: false, preset: null, remaining: 0, total: 0, intervalId: null, paused: false };
  updateTimerDisplay();
}

function renderTimerWidget() {
  let widget = document.getElementById('tactical-timer-widget');
  if (!widget) return;
  
  if (!timerState.active) {
    widget.innerHTML = `
      <div class="timer-presets">
        <span class="timer-widget-label">⏱ Quick Timer</span>
        <div class="timer-preset-btns">
          ${PRESETS.map(p => `
            <button class="timer-preset-btn" data-preset="${p.id}" style="--preset-color: ${p.color}">
              ${p.label} (${formatTime(p.seconds)})
            </button>
          `).join('')}
        </div>
      </div>
    `;
  } else {
    const preset = timerState.preset;
    widget.innerHTML = `
      <div class="timer-active" style="--preset-color: ${preset?.color || '#3b82f6'}">
        <div class="timer-active-header">
          <span class="timer-active-label">${preset?.label || 'Timer'}</span>
          <span class="timer-active-time ${timerState.remaining <= 30 ? 'timer-urgent' : ''}" id="tactical-timer-display">${formatTime(timerState.remaining)}</span>
        </div>
        <div class="timer-progress-track">
          <div class="timer-progress-bar" id="tactical-timer-bar" style="width: ${((timerState.total - timerState.remaining) / timerState.total) * 100}%; background: ${preset?.color || '#3b82f6'}"></div>
        </div>
        <div class="timer-controls">
          <button class="timer-ctrl-btn" id="timer-pause-btn">${timerState.paused ? '▶ Resume' : '⏸ Pause'}</button>
          <button class="timer-ctrl-btn timer-stop-btn" id="timer-stop-btn">■ Stop</button>
        </div>
      </div>
    `;
  }
  
  // Attach event listeners
  widget.querySelectorAll('[data-preset]').forEach(btn => {
    btn.addEventListener('click', () => startTimer(btn.dataset.preset));
  });
  widget.querySelector('#timer-pause-btn')?.addEventListener('click', pauseTimer);
  widget.querySelector('#timer-stop-btn')?.addEventListener('click', () => {
    stopTimer();
    renderTimerWidget();
  });
}

export function initTacticalTimer() {
  // Create the timer widget container in the DOM
  const headerRight = document.querySelector('.header-right');
  if (headerRight && !document.getElementById('header-timer-badge')) {
    const badge = document.createElement('span');
    badge.id = 'header-timer-badge';
    badge.className = 'header-timer-badge';
    badge.style.display = 'none';
    headerRight.prepend(badge);
  }
}

export function getTimerWidgetHTML() {
  return '<div id="tactical-timer-widget" class="tactical-timer-widget"></div>';
}

export function mountTimerWidget() {
  renderTimerWidget();
}
