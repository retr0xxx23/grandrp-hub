
import { orgsData } from './data.js';
import { penalCategories } from './penal-codes.js';
import { tenCodes, statusCodes, mirandaRights } from './cheatsheet.js';

let searchModalEl = null;
let searchInputEl = null;
let searchResultsEl = null;
let selectedIndex = 0;
let searchItemsCache = [];
let currentResults = [];

export function initGlobalSearch(onNavigate, onCopy) {
  buildSearchIndex();
  injectSearchModal(onNavigate, onCopy);

  
  window.addEventListener('keydown', (e) => {
    if (e.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
      e.preventDefault();
      openSearchModal();
    } else if (e.key === 'Escape' && isSearchOpen()) {
      e.preventDefault();
      closeSearchModal();
    }
  });
}

function buildSearchIndex() {
  const index = [];

  
  for (const org of orgsData) {
    for (const sec of org.sections) {
      for (const group of sec.groups) {
        for (const cmd of group.commands) {
          index.push({
            type: 'command',
            category: org.shortName,
            orgId: org.id,
            section: sec.title,
            group: group.title,
            title: cmd.text,
            subtitle: `${org.name} · ${sec.title} → ${group.title}`,
            note: cmd.note || '',
            copyValue: cmd.text,
            badge: org.shortName,
            badgeColor: org.color,
            searchStr: `${org.shortName} ${org.name} ${sec.title} ${group.title} ${cmd.text} ${cmd.note || ''}`.toLowerCase()
          });
        }
      }
    }
  }

  for (const cat of penalCategories) {
    for (const code of cat.codes) {
      const searchStr = `${cat.title} ${code.code} ${code.heading || ''} ${code.description} ${code.fine || ''} ${code.sentence || ''} ${code.note || ''}`.toLowerCase();
      index.push({
        type: 'penal',
        category: 'Penal Code',
        path: '/penal-codes',
        title: `${code.code} - ${code.description}`,
        subtitle: `${cat.title} ${code.heading ? '• ' + code.heading : ''} | Fine: ${code.fine || 'N/A'} ${code.sentence ? '| ' + code.sentence : ''}`,
        note: code.note || '',
        stars: code.stars || 0,
        copyValue: `${code.code} ${code.description}`,
        badge: code.code,
        badgeColor: '#00e5ff',
        searchStr
      });
    }
  }

  for (const tc of tenCodes) {
    index.push({
      type: '10code',
      category: '10-Codes',
      path: '/cheatsheet',
      title: `${tc.code} — ${tc.meaning}`,
      subtitle: `Radio Code · ${tc.category}`,
      copyValue: tc.code,
      badge: 'RADIO',
      badgeColor: '#3b82f6',
      searchStr: `${tc.code} ${tc.meaning} ${tc.category} radio code`.toLowerCase()
    });
  }

  
  for (const sc of statusCodes) {
    index.push({
      type: 'status',
      category: 'Status Code',
      path: '/cheatsheet',
      title: `${sc.code} — ${sc.meaning}`,
      subtitle: sc.description,
      copyValue: sc.code,
      badge: 'STATUS',
      badgeColor: '#10b981',
      searchStr: `${sc.code} ${sc.meaning} ${sc.description}`.toLowerCase()
    });
  }

  
  index.push({
    type: 'page',
    category: 'Procedure SOP',
    path: '/arrest-procedure',
    title: 'Official Arrest Procedure & SOP Guide',
    subtitle: 'Step-by-step procedural compliance, keybind muscles (Z, X, C, G, J), voice lines & lawyer timers',
    copyValue: '',
    badge: 'SOP',
    badgeColor: '#3b82f6',
    searchStr: 'arrest procedure sop standard operating procedure handcuffs timer miranda lawyer doc booking jumpsuit serial xxx ammo'
  });

  index.push({
    type: 'page',
    category: 'Calculator',
    path: '/calculator',
    title: 'Department Arrest & Citation Center',
    subtitle: 'Arrest & Traffic Citation calculator, wanted stars 5 max, and department history ledger',
    copyValue: '',
    badge: 'CALC',
    badgeColor: '#f59e0b',
    searchStr: 'calculator arrest fine bail sentence wanted stars citations tickets ledger department stats'
  });

  index.push({
    type: 'page',
    category: 'Cheat Sheet',
    path: '/cheatsheet',
    title: 'Tactical Cheat Sheet & Miranda Suite',
    subtitle: 'Miranda Rights, weapons matrix, 10-codes, radio protocols, Code 0-7, and DOC booking guide',
    copyValue: '',
    badge: 'TAC',
    badgeColor: '#ec4899',
    searchStr: 'cheatsheet miranda rights tactical 10-codes status codes radio weapon confiscation doc protocols'
  });

  index.push({
    type: 'page',
    category: 'Legislation',
    path: '/legislation',
    title: 'Official Legislation & State Laws',
    subtitle: 'San Andreas Constitution, Firearms Law, Traffic Code, and Department statutes',
    copyValue: '',
    badge: 'LAWS',
    badgeColor: '#8b5cf6',
    searchStr: 'legislation laws constitution firearms act judicial procedures code criminal civil'
  });

  index.push({
    type: 'page',
    category: 'Fast Links',
    path: '/fast-links',
    title: 'Fast Links & Department Mails',
    subtitle: 'Direct Discord invite links and EN3 server forums for LSPD, SAHP, FIB, GOV, NG',
    copyValue: '',
    badge: 'LINKS',
    badgeColor: '#06b6d4',
    searchStr: 'fast links discord mails server forums lspd sahp fib gov ng official'
  });

  
  index.push({
    type: 'action',
    category: 'System Action',
    actionId: 'play-loading',
    title: '⚡ Play Tactical Loading Screen (Local)',
    subtitle: 'Play the cyber EN3 initialization & tactical splash screen animation',
    badge: 'SPLASH',
    badgeColor: '#3b82f6',
    searchStr: 'loading screen splash terminal intro animation play load trigger'
  });

  
  index.push({
    type: 'action',
    category: 'System Action',
    actionId: 'broadcast-loading',
    title: '📡 Broadcast Loading Screen to Everyone Online',
    subtitle: 'Broadcast real-time tactical loading screen to all connected web officers',
    badge: 'BROADCAST',
    badgeColor: '#10b981',
    searchStr: 'loading screen broadcast everyone online splash trigger load all live'
  });

  
  for (const org of orgsData) {
    index.push({
      type: 'page',
      category: 'Department',
      path: `/${org.id}`,
      title: `${org.name} (${org.shortName})`,
      subtitle: `View all commands, divisions, protocols, and radios for ${org.shortName}`,
      copyValue: '',
      badge: org.shortName,
      badgeColor: org.color,
      searchStr: `${org.shortName} ${org.name} department commands protocols radio frequencies divisions`.toLowerCase()
    });
  }

  searchItemsCache = index;
}

function injectSearchModal(onNavigate, onCopy) {
  if (document.getElementById('global-search-modal')) return;

  const modal = document.createElement('div');
  modal.id = 'global-search-modal';
  modal.className = 'spotlight-modal-overlay';
  modal.innerHTML = `
    <div class="spotlight-dialog">
      <div class="spotlight-header">
        <svg class="spotlight-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        <input type="text" class="spotlight-input" id="spotlight-input" placeholder="Search commands, penal codes, 10-codes, statutes..." autocomplete="off" />
        <span class="spotlight-kbd-hint">ESC to close</span>
      </div>
      <div class="spotlight-results" id="spotlight-results">
        <div class="spotlight-placeholder">Type to search over 500+ commands, laws & radio codes...</div>
      </div>
      <div class="spotlight-footer">
        <div class="spotlight-shortcuts">
          <span><kbd>↑</kbd><kbd>↓</kbd> Navigate</span>
          <span><kbd>↵</kbd> Copy / Open</span>
          <span><kbd>ESC</kbd> Close</span>
        </div>
        <div class="spotlight-stats">GrandRP HUB</div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  searchModalEl = modal;
  searchInputEl = modal.querySelector('#spotlight-input');
  searchResultsEl = modal.querySelector('#spotlight-results');

  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeSearchModal();
  });

  
  searchInputEl.addEventListener('input', () => {
    performSearch(searchInputEl.value.trim());
  });

  
  modal.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (currentResults.length === 0) return;
      selectedIndex = (selectedIndex + 1) % currentResults.length;
      updateSelection();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (currentResults.length === 0) return;
      selectedIndex = (selectedIndex - 1 + currentResults.length) % currentResults.length;
      updateSelection();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (currentResults.length > 0 && currentResults[selectedIndex]) {
        handleItemAction(currentResults[selectedIndex], onNavigate, onCopy);
      }
    }
  });

  
  searchResultsEl.addEventListener('click', (e) => {
    const itemEl = e.target.closest('.spotlight-item');
    if (!itemEl) return;
    const index = parseInt(itemEl.dataset.index, 10);
    if (!isNaN(index) && currentResults[index]) {
      handleItemAction(currentResults[index], onNavigate, onCopy);
    }
  });
}

function performSearch(query) {
  selectedIndex = 0;
  if (!query) {
    currentResults = searchItemsCache.slice(0, 8);
    renderResults(currentResults, 'Recent & Popular Shortcuts');
    return;
  }

  const q = query.toLowerCase();
  const tokens = q.split(/\s+/).filter(Boolean);

  const matched = searchItemsCache.filter(item => {
    return tokens.every(token => item.searchStr.includes(token));
  });

  currentResults = matched.slice(0, 30);
  renderResults(currentResults, matched.length === 0 ? 'No results found' : `${matched.length} matches found`);
}

function renderResults(items, headerText) {
  if (items.length === 0) {
    searchResultsEl.innerHTML = `
      <div class="spotlight-empty">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <p>No matching commands or codes found.</p>
        <span>Try searching for keywords like "cuff", "bodycam", "2.6.4", "10-15", or "bail"</span>
      </div>`;
    return;
  }

  let html = `<div class="spotlight-group-label">${headerText}</div>`;

  items.forEach((item, idx) => {
    const isSelected = idx === selectedIndex;
    const badgeStyle = item.badgeColor ? `style="background-color: ${item.badgeColor}20; color: ${item.badgeColor}; border: 1px solid ${item.badgeColor}40;"` : '';
    
    html += `
      <div class="spotlight-item ${isSelected ? 'selected' : ''}" data-index="${idx}">
        <div class="spotlight-item-main">
          <div class="spotlight-item-header">
            <span class="spotlight-badge" ${badgeStyle}>${escapeHTML(item.badge || item.category)}</span>
            <span class="spotlight-title">${escapeHTML(item.title)}</span>
          </div>
          <p class="spotlight-subtitle">${escapeHTML(item.subtitle)}</p>
        </div>
        <div class="spotlight-action">
          <span class="spotlight-action-key">ENTER</span>
          <span class="spotlight-action-text">${item.type === 'command' ? 'COPY' : 'SELECT'}</span>
        </div>
      </div>
    `;
  });

  searchResultsEl.innerHTML = html;
  scrollToSelected();
}

function updateSelection() {
  const itemEls = searchResultsEl.querySelectorAll('.spotlight-item');
  itemEls.forEach((el, idx) => {
    if (idx === selectedIndex) {
      el.classList.add('selected');
      el.scrollIntoView({ block: 'nearest' });
    } else {
      el.classList.remove('selected');
    }
  });
}

function scrollToSelected() {
  const selectedEl = searchResultsEl.querySelector('.spotlight-item.selected');
  if (selectedEl) {
    selectedEl.scrollIntoView({ block: 'nearest' });
  }
}

function handleItemAction(item, onNavigate, onCopy) {
  closeSearchModal();
  if (item.type === 'action') {
    window.dispatchEvent(new CustomEvent('app:action', { detail: { actionId: item.actionId } }));
    return;
  }
  if (item.type === 'command' || item.type === 'penal' || item.type === '10code' || item.type === 'status') {
    if (onCopy) onCopy(item.copyValue, `${item.badge || item.category}: Copied to clipboard!`);
  }
  if (item.orgId && onNavigate) {
    onNavigate(`/${item.orgId}`);
  } else if (item.path && onNavigate) {
    onNavigate(item.path);
  }
}

export function openSearchModal(initialQuery = '') {
  if (!searchModalEl) return;
  searchModalEl.classList.add('open');
  searchInputEl.value = initialQuery;
  performSearch(initialQuery);
  setTimeout(() => {
    searchInputEl.focus();
    if (initialQuery) searchInputEl.select();
  }, 50);
}

export function closeSearchModal() {
  if (!searchModalEl) return;
  searchModalEl.classList.remove('open');
}

export function isSearchOpen() {
  return searchModalEl && searchModalEl.classList.contains('open');
}

function escapeHTML(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
