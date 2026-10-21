// GrandRP HUB — Keyboard Shortcuts Help Modal
import { icons } from '../utils/icons.js';
import { playTacticalSound } from '../utils/sounds.js';

const shortcuts = [
  { category: 'Navigation', items: [
    { keys: ['Ctrl', 'K'], desc: 'Open global search / Spotlight' },
    { keys: ['Ctrl', 'B'], desc: 'Toggle sidebar' },
    { keys: ['['], desc: 'Toggle sidebar (alt)' },
    { keys: ['Esc'], desc: 'Close any open modal' },
    { keys: ['?'], desc: 'Show this shortcuts panel' },
  ]},
  { category: 'Actions', items: [
    { keys: ['Shift', 'L', 'L'], desc: 'Broadcast loading screen (double-tap)' },
    { keys: ['/'], desc: 'Focus search bar' },
  ]},
  { category: 'Quick Access', items: [
    { keys: ['1'], desc: 'Go to Command Center' },
    { keys: ['2'], desc: 'Go to Penal Codes' },
    { keys: ['3'], desc: 'Go to Calculator' },
    { keys: ['4'], desc: 'Go to Cheatsheet' },
  ]},
];

export function openShortcutsModal() {
  playTacticalSound('nav');
  
  let modal = document.getElementById('shortcuts-help-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'shortcuts-help-modal';
    modal.className = 'spotlight-modal-overlay';
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="shortcuts-dialog">
      <div class="shortcuts-header">
        <h2>⌨️ Keyboard Shortcuts</h2>
        <button type="button" class="shortcuts-close-btn" id="shortcuts-close">${icons.close}</button>
      </div>
      <div class="shortcuts-body">
        ${shortcuts.map(cat => `
          <div class="shortcuts-category">
            <h3 class="shortcuts-category-title">${cat.category}</h3>
            ${cat.items.map(s => `
              <div class="shortcut-row">
                <div class="shortcut-keys">
                  ${s.keys.map(k => `<kbd class="shortcut-key">${k}</kbd>`).join('<span class="shortcut-plus">+</span>')}
                </div>
                <span class="shortcut-desc">${s.desc}</span>
              </div>
            `).join('')}
          </div>
        `).join('')}
      </div>
    </div>
  `;

  modal.classList.add('open');

  const close = () => { modal.classList.remove('open'); };
  modal.querySelector('#shortcuts-close')?.addEventListener('click', close);
  modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
}

export function initShortcutsListener() {
  window.addEventListener('keydown', (e) => {
    const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName) || document.activeElement?.isContentEditable;
    if (isInput) return;
    if (e.key === '?' && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      openShortcutsModal();
    }
  });
}
