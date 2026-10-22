

import { orgsData } from './data.js';
import { penalCategories } from './penal-codes.js';
import { mirandaRights, tenCodes, statusCodes, natoAlphabet } from './cheatsheet.js';
import {
  calculateCharges,
  generateDiscordReport,
  generateTicketReport,
  TRAFFIC_VIOLATIONS,
  getActiveOfficerOrg,
  setActiveOfficerOrg,
  getAllLogs,
  addLogEntry,
  deleteLogEntry,
  clearAllLogs,
  calculateDepartmentStats,
  getGrandRPEN3DateTime
} from './calculator.js';
import { initGlobalSearch, openSearchModal } from './search.js';

// v2.2 — New Modules
import { renderChangelogPage } from './pages/changelog.js';
import { renderPhotosPage } from './pages/photos.js';
import { initShortcutsListener } from './components/shortcuts-modal.js';
import { initTacticalTimer, getTimerWidgetHTML, mountTimerWidget } from './components/tactical-timer.js';
import { getFavorites, isFavorited, toggleFavorite, makeFavId } from './components/favorites.js';


const icons = {
  camera: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>`,
  building: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>`,
  scale: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/></svg>`,
  calculator: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>`,
  shield: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  users: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  search: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`,
  copy: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`,
  check: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`,
  fileText: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M8 13h8"/><path d="M8 17h8"/><path d="M10 9H8"/></svg>`,
  link: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 1 0-7l1-1a5 5 0 0 1 7 7l-1 1"/><path d="M14 11a5 5 0 0 1 0 7l-1 1a5 5 0 1 1-7-7l1-1"/></svg>`,
  globe: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15 15 0 0 1 4 10 15 15 0 0 1-4 10 15 15 0 0 1-4-10 15 15 0 0 1 4-10z"/></svg>`,
  star: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  volume2: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>`,
  volumeX: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" x2="17" y1="9" y2="15"/><line x1="17" x2="23" y1="9" y2="15"/></svg>`,
  palette: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>`,
  menu: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" x2="21" y1="6" y2="6"/><line x1="3" x2="21" y1="12" y2="12"/><line x1="3" x2="21" y1="18" y2="18"/></svg>`,
  close: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>`,
  sparkles: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/></svg>`,
  sun: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`,
  moon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`,
  gavel: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m14 13-7.5 7.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0a2.12 2.12 0 0 1 0-3L11 10"/><path d="m16 16 6-6"/><path d="m8 8 6-6"/><path d="m9 7 8 8"/><path d="m21 11-8-8"/></svg>`,
  panelLeft: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/></svg>`,
};

const orgMeta = {
  fib: { description: "Federal Investigation Bureau — Internal Affairs, Undercover, Investigations", iconName: "fib" },
  gov: { description: "Government of San Andreas — Executive Branch, USSS, DOC & Judiciary", iconName: "gov" },
  lspd: { description: "Los Santos Police Department — City Patrol, SWAT, Traffic & Air Support", iconName: "lspd" },
  sahp: { description: "San Andreas Highway Patrol — Highways, Interstates & County Enforcement", iconName: "sahp" },
  ng: { description: "National Guard — Fort Zancudo, Air Defense, Heavy Tactical Response", iconName: "ng" },
  grp: { description: "GrandRP Core — Universal Server Commands & RP Shortcuts", iconName: "grp" },
  badcop: { description: "Corrupt Officers & Underworld Syndicate Roleplay Operations", iconName: null },
  gpro: { description: "GrandPro High-Tech Tactical Camera, Drone & PDA Operations", iconName: null }
};

const categoryColors = {
  "Crimes Against Society": "#f59e0b",
  "Crimes Against the State": "#a855f7",
  "Malfeasance": "#ef4444",
  "Traffic Regulations": "#3b82f6",
};

let soundEnabled = localStorage.getItem('grp_sound') !== 'false';
let audioCtx = null;

function playTacticalSound(type = 'click') {
  if (!soundEnabled) return;
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    if (type === 'copy') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(1400, now + 0.08);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'nav') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.start(now);
      osc.stop(now + 0.04);
    } else if (type === 'mention') {
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(580, now);
      osc.frequency.setValueAtTime(880, now + 0.08);
      osc.frequency.setValueAtTime(1180, now + 0.16);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
      osc.start(now);
      osc.stop(now + 0.24);
    } else if (type === 'chat') {
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(640, now);
      osc.frequency.exponentialRampToValueAtTime(960, now + 0.06);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      osc.start(now);
      osc.stop(now + 0.06);
    } else {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(580, now);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
      osc.start(now);
      osc.stop(now + 0.03);
    }
  } catch (e) {
    
  }
}

export const themes = [
  {
    id: 'executive-sapphire',
    name: 'Executive Sapphire',
    mode: 'dark',
    category: 'Professional Dark',
    badge: 'DEFAULT',
    primary: '#3b82f6',
    primaryLight: '#60a5fa',
    primaryDark: '#1d4ed8',
    primaryRgb: '59, 130, 246',
    onPrimary: '#ffffff',
    primary10: 'rgba(59, 130, 246, 0.10)',
    primary20: 'rgba(59, 130, 246, 0.20)',
    glow: 'rgba(59, 130, 246, 0.25)',
    bg: '#090d16',
    card: 'rgba(16, 22, 36, 0.75)',
    cardHover: 'rgba(22, 31, 50, 0.92)',
    input: 'rgba(10, 15, 26, 0.85)',
    sidebar: 'rgba(11, 15, 25, 0.94)',
    borderCard: 'rgba(59, 130, 246, 0.16)',
    borderFocus: 'rgba(59, 130, 246, 0.55)',
    desc: 'Clean corporate law enforcement slate & royal sapphire blue'
  },
  {
    id: 'doj-gold-executive',
    name: 'DOJ Federal Gold',
    mode: 'dark',
    category: 'Professional Dark',
    badge: 'JUSTICE',
    primary: '#ffc53d',
    primaryLight: '#ffe49a',
    primaryDark: '#e09b12',
    primaryRgb: '255, 197, 61',
    onPrimary: '#1c1405',
    primary10: 'rgba(255, 197, 61, 0.12)',
    primary20: 'rgba(255, 197, 61, 0.28)',
    glow: 'rgba(255, 197, 61, 0.34)',
    bg: '#070605',
    card: 'rgba(26, 23, 17, 0.84)',
    cardHover: 'rgba(42, 37, 28, 0.95)',
    input: 'rgba(20, 18, 13, 0.9)',
    sidebar: 'rgba(13, 12, 9, 0.97)',
    borderCard: 'rgba(255, 197, 61, 0.24)',
    borderFocus: 'rgba(255, 197, 61, 0.62)',
    desc: 'Department of Justice polished gold over deep obsidian charcoal'
  },
  {
    id: 'military-emerald',
    name: 'Tactical Military Emerald',
    mode: 'dark',
    category: 'Tactical LEO',
    badge: 'MILITARY',
    primary: '#2bd47d',
    primaryLight: '#8df3c1',
    primaryDark: '#15a862',
    primaryRgb: '43, 212, 125',
    onPrimary: '#04241a',
    primary10: 'rgba(43, 212, 125, 0.12)',
    primary20: 'rgba(43, 212, 125, 0.28)',
    glow: 'rgba(43, 212, 125, 0.34)',
    bg: '#030806',
    card: 'rgba(9, 28, 21, 0.85)',
    cardHover: 'rgba(14, 42, 31, 0.95)',
    input: 'rgba(6, 22, 16, 0.9)',
    sidebar: 'rgba(4, 17, 12, 0.97)',
    borderCard: 'rgba(43, 212, 125, 0.24)',
    borderFocus: 'rgba(43, 212, 125, 0.62)',
    desc: 'Fort Zancudo / National Guard field green & tactical slate'
  },
  {
    id: 'cyber-neon-matrix',
    name: 'Tactical Oceanic Cyan',
    mode: 'dark',
    category: 'Tactical LEO',
    badge: 'CYAN',
    primary: '#22d3ee',
    primaryLight: '#a5f3fc',
    primaryDark: '#0891b2',
    primaryRgb: '34, 211, 238',
    onPrimary: '#032430',
    primary10: 'rgba(34, 211, 238, 0.12)',
    primary20: 'rgba(34, 211, 238, 0.28)',
    glow: 'rgba(34, 211, 238, 0.34)',
    bg: '#030912',
    card: 'rgba(8, 26, 43, 0.85)',
    cardHover: 'rgba(13, 39, 61, 0.95)',
    input: 'rgba(6, 20, 33, 0.9)',
    sidebar: 'rgba(4, 17, 28, 0.97)',
    borderCard: 'rgba(34, 211, 238, 0.24)',
    borderFocus: 'rgba(34, 211, 238, 0.62)',
    desc: 'San Andreas high-clarity oceanic cyan & abyssal navy carbon'
  },
  {
    id: 'swat-crimson-strike',
    name: 'SWAT Crimson Strike',
    mode: 'dark',
    category: 'Tactical LEO',
    badge: 'SWAT',
    primary: '#ff2d55',
    primaryLight: '#ff8ea1',
    primaryDark: '#d01540',
    primaryRgb: '255, 45, 85',
    onPrimary: '#1b0208',
    primary10: 'rgba(255, 45, 85, 0.12)',
    primary20: 'rgba(255, 45, 85, 0.28)',
    glow: 'rgba(255, 45, 85, 0.34)',
    bg: '#0a0305',
    card: 'rgba(30, 11, 16, 0.85)',
    cardHover: 'rgba(46, 17, 23, 0.95)',
    input: 'rgba(26, 8, 12, 0.9)',
    sidebar: 'rgba(19, 6, 9, 0.97)',
    borderCard: 'rgba(255, 45, 85, 0.26)',
    borderFocus: 'rgba(255, 45, 85, 0.62)',
    desc: 'High-threat tactical crimson & heavy tactical armor carbon'
  },
  {
    id: 'pure-black-oled',
    name: 'Pure OLED Stealth Black',
    mode: 'dark',
    category: 'Stealth Black',
    badge: 'OLED',
    primary: '#ffffff',
    primaryLight: '#dfe4ea',
    primaryDark: '#cfd4da',
    primaryRgb: '255, 255, 255',
    onPrimary: '#0a0a0a',
    primary10: 'rgba(255, 255, 255, 0.10)',
    primary20: 'rgba(255, 255, 255, 0.22)',
    glow: 'rgba(255, 255, 255, 0.16)',
    bg: '#000000',
    card: '#0b0b0b',
    cardHover: '#161616',
    input: 'rgba(14, 14, 14, 0.92)',
    sidebar: '#060606',
    borderCard: 'rgba(255, 255, 255, 0.14)',
    borderFocus: 'rgba(255, 255, 255, 0.58)',
    desc: 'Zero-light pitch black with platinum monochrome borders'
  },
  {
    id: 'executive-white',
    name: 'Executive Clean White',
    mode: 'light',
    category: 'Light & White',
    badge: 'LIGHT',
    primary: '#2563eb',
    primaryLight: '#3b82f6',
    primaryDark: '#1d4ed8',
    primaryRgb: '37, 99, 235',
    onPrimary: '#ffffff',
    primary10: 'rgba(37, 99, 235, 0.10)',
    primary20: 'rgba(37, 99, 235, 0.20)',
    glow: 'rgba(37, 99, 235, 0.15)',
    bg: '#f8fafc',
    card: '#ffffff',
    cardHover: '#f1f5f9',
    input: '#ffffff',
    sidebar: '#ffffff',
    borderCard: 'rgba(37, 99, 235, 0.18)',
    borderFocus: 'rgba(37, 99, 235, 0.5)',
    desc: 'Crisp minimalist white, pearl slate & executive sapphire blue'
  },
  {
    id: 'doj-ivory-white',
    name: 'DOJ Federal Ivory',
    mode: 'light',
    category: 'Light & White',
    badge: 'LIGHT',
    primary: '#d97706',
    primaryLight: '#f59e0b',
    primaryDark: '#b45309',
    primaryRgb: '217, 119, 6',
    onPrimary: '#1c1206',
    primary10: 'rgba(217, 119, 6, 0.10)',
    primary20: 'rgba(217, 119, 6, 0.20)',
    glow: 'rgba(217, 119, 6, 0.15)',
    bg: '#faf8f5',
    card: '#ffffff',
    cardHover: '#f5f1eb',
    input: '#ffffff',
    sidebar: '#fcfbfa',
    borderCard: 'rgba(217, 119, 6, 0.18)',
    borderFocus: 'rgba(217, 119, 6, 0.5)',
    desc: 'Warm luxury cream ivory & Department of Justice gold'
  }
];

export function applyTheme(themeIndex) {
  const t = themes[themeIndex] || themes[0];
  const root = document.documentElement;
  root.setAttribute('data-theme-mode', t.mode || 'dark');
  root.style.setProperty('--primary', t.primary);
  root.style.setProperty('--primary-light', t.primaryLight || t.primary);
  root.style.setProperty('--primary-dark', t.primaryDark || t.primary);
  root.style.setProperty('--primary-rgb', t.primaryRgb);
  root.style.setProperty('--on-primary', t.onPrimary || '#ffffff');
  root.style.setProperty('--primary-10', t.primary10);
  root.style.setProperty('--primary-20', t.primary20);
  root.style.setProperty('--primary-glow', t.glow);
  root.style.setProperty('--bg', t.bg);
  root.style.setProperty('--bg-tint', t.bg);
  root.style.setProperty('--bg-card', t.card);
  root.style.setProperty('--bg-card-hover', t.cardHover);
  root.style.setProperty('--bg-input', t.input);
  root.style.setProperty('--bg-sidebar', t.sidebar);
  root.style.setProperty('--border-card', t.borderCard);
  root.style.setProperty('--border-focus', t.borderFocus);
  localStorage.setItem('grp_theme_idx', themeIndex);
}

let liteModeEnabled = localStorage.getItem('grp_lite_mode') === 'true';

export function applyLiteMode(enabled) {
  liteModeEnabled = enabled;
  localStorage.setItem('grp_lite_mode', enabled ? 'true' : 'false');
  if (enabled) {
    document.documentElement.setAttribute('data-performance-mode', 'lite');
  } else {
    document.documentElement.removeAttribute('data-performance-mode');
  }
}

export function openThemeModal() {
  let modal = document.getElementById('theme-picker-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'theme-picker-modal';
    modal.className = 'spotlight-modal-overlay';
    document.body.appendChild(modal);
  }

  const currentIdx = parseInt(localStorage.getItem('grp_theme_idx') || '0', 10);

  modal.innerHTML = `
    <div class="theme-picker-dialog">
      <div class="theme-picker-header">
        <div class="theme-picker-title-group">
          ${icons.palette}
          <div>
            <h2>Interface Visual Themes</h2>
            <p>Select your preferred visual style and color palette</p>
          </div>
        </div>
        <button class="theme-modal-close-btn" id="theme-modal-close">${icons.close}</button>
      </div>

      <div class="theme-cards-grid">
        ${themes.map((t, idx) => `
          <div class="theme-select-card ${idx === currentIdx ? 'active' : ''}" data-theme-idx="${idx}">
            <div class="theme-card-top">
              <div class="theme-color-preview" style="background: ${t.bg}; border: 1px solid ${t.borderCard};">
                <span class="theme-swatch-dot" style="background: linear-gradient(135deg, ${t.primary}, ${t.primaryLight}); box-shadow: 0 0 10px ${t.glow};"></span>
              </div>
              <span class="theme-category-badge" style="color: ${t.primary}; border-color: ${t.primary20}; background: ${t.primary10};">${escapeHTML(t.badge)}</span>
            </div>
            <h3 class="theme-card-name">${escapeHTML(t.name)}</h3>
            <p class="theme-card-desc">${escapeHTML(t.desc)}</p>
            <div class="theme-card-footer">
              <span class="theme-apply-label">${idx === currentIdx ? 'ACTIVE' : 'SELECT THEME'}</span>
              ${idx === currentIdx ? `<span class="theme-check-icon">${icons.check}</span>` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  modal.classList.add('open');

  modal.onclick = (e) => {
    if (e.target === modal || e.target.closest('#theme-modal-close')) {
      modal.classList.remove('open');
    }
    const card = e.target.closest('[data-theme-idx]');
    if (card) {
      const idx = parseInt(card.dataset.themeIdx, 10);
      applyTheme(idx);
      playTacticalSound('click');
      showToast(`Applied theme: ${themes[idx].name}`, 'info');
      modal.classList.remove('open');
      render();
    }
  };
}

export function triggerLoadingScreen({ sender = '', onComplete } = {}) {
  let existing = document.getElementById('initial-loading-screen');
  if (existing && existing.parentNode) existing.parentNode.removeChild(existing);

  const screen = document.createElement('div');
  screen.id = 'initial-loading-screen';
  screen.className = 'loading-screen';
  screen.innerHTML = `
    <div class="loading-content">
      <div class="loading-emblem-wrap">
        <img src="Assets/logo.png" alt="GrandRP HUB Emblem" class="loading-emblem" />
        <div class="loading-glow-ring"></div>
      </div>
      
      <div class="loading-badge-strip">
        <span class="loading-version-pill">VERSION 2.2</span>
        <span class="loading-server-pill">EN3 LIVE</span>
      </div>

      <h1 class="loading-title">San Andreas <span class="text-neon">LEO HUB</span></h1>
      
      <div class="loading-credits-box">
        <div class="loading-credit-line">
          <span class="loading-credit-icon">👑</span>
          <span>Created by <strong class="credit-name-gold">Dave Scofield</strong></span>
        </div>
        <div class="loading-credit-line">
          <span class="loading-credit-icon">🤝</span>
          <span>Only to use by <strong class="credit-name-blue">Saad Scofield</strong></span>
        </div>
        ${sender ? `
          <div class="loading-credit-line" style="color: #38bdf8; font-size: 11px; margin-top: 4px;">
            <span>📡 Broadcast initiated by <strong>${escapeHTML(sender)}</strong></span>
          </div>
        ` : ''}
      </div>

      <div class="loading-progress-container">
        <div class="loading-progress-bar" id="loading-progress-bar"></div>
      </div>

      <p class="loading-status-text" id="loading-status-text">INITIALIZING TACTICAL SYSTEM...</p>
    </div>
  `;

  document.body.appendChild(screen);
  playTacticalSound('click');

  const progressBar = screen.querySelector('#loading-progress-bar');
  const statusText = screen.querySelector('#loading-status-text');

  const steps = [
    { p: 35, text: "CONNECTING TO SAN ANDREAS EN3 DISPATCH..." },
    { p: 70, text: "LOADING OFFICIAL PENAL & TRAFFIC CODEX..." },
    { p: 92, text: "SYNCHRONIZING DEPARTMENT COMMAND DATA..." },
    { p: 100, text: "DISPATCH SYSTEM OPERATIONAL — READY" }
  ];
  let stepIdx = 0;
  const interval = setInterval(() => {
    if (stepIdx < steps.length) {
      const step = steps[stepIdx];
      if (progressBar) progressBar.style.width = step.p + '%';
      if (statusText) statusText.textContent = step.text;
      stepIdx++;
    } else {
      clearInterval(interval);
      setTimeout(() => {
        screen.classList.add('fade-out');
        setTimeout(() => {
          if (screen.parentNode) screen.parentNode.removeChild(screen);
          if (onComplete) onComplete();
        }, 450);
      }, 150);
    }
  }, 160);
}

export function broadcastLoadingScreen() {
  const officer = getRegisteredOfficer();
  const senderName = officer.isRegistered ? `${officer.name} (${officer.dept})` : 'Dave Scofield';

  triggerLoadingScreen({ sender: senderName });
  showToast('📡 Broadcasting loading screen to all online officers...', 'info');

  fetch('/api/broadcast/loading', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sender: senderName, version: '2.2' })
  }).then(r => r.json()).then(data => {
    showToast('✅ Broadcast dispatched to all active terminals!', 'success');
  }).catch(() => {});
}

export function getRegisteredOfficer() {
  const name = localStorage.getItem('grp_officer_name') || '';
  const userId = localStorage.getItem('grp_officer_userid') || localStorage.getItem('grp_officer_username') || '';
  const badgeNo = localStorage.getItem('grp_officer_badge_no') || localStorage.getItem('grp_officer_username') || userId;
  const dept = localStorage.getItem('grp_officer_dept') || 'LSPD';
  const isRegistered = localStorage.getItem('grp_officer_registered') === 'true' && !!name && !!userId;
  return { name, userId, badgeNo, dept, isRegistered };
}

export function promptOfficerLoginModal(onSuccess) {
  let modal = document.getElementById('officer-login-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'officer-login-modal';
    modal.className = 'officer-login-modal-overlay';
    document.body.appendChild(modal);
  }

  const officer = getRegisteredOfficer();

  if (officer.isRegistered) {
    modal.innerHTML = `
      <div class="officer-login-dialog">
        <div class="officer-login-header">
          <div class="officer-login-emblem-wrap">
            <img src="Assets/logo.png" alt="GrandRP HUB Emblem" class="officer-login-emblem" />
            <div class="officer-emblem-glow"></div>
          </div>
          <div class="officer-login-title-wrap">
            <h2>Officer Profile & Transfer</h2>
            <p>Update Character Name, Badge & Department (v2.2)</p>
          </div>
          <button type="button" class="officer-modal-close-btn" id="officer-modal-close">${icons.close}</button>
        </div>

        <div class="officer-login-badge-bar">
          <span class="officer-lock-tag">🔒 CHARACTER ID LOCKED · NAME, BADGE & DEPT EDITABLE</span>
        </div>

        <form id="officer-login-form" class="officer-login-form">
          <div class="officer-form-group">
            <label for="officer-input-name">In-Game Character Name:</label>
            <input type="text" id="officer-input-name" value="${escapeAttr(officer.name)}" placeholder="e.g. Dave Scofield / Saad Scofield" required />
          </div>

          <div class="officer-form-group">
            <div class="label-lock-row">
              <label>In-Game Character ID:</label>
              <span class="lock-pill">🔒 PERMANENT ID</span>
            </div>
            <input type="text" value="${escapeAttr(officer.userId)}" disabled class="input-locked" />
          </div>

          <div class="officer-form-group">
            <label for="officer-input-badge">Active Badge / Unit Callsign:</label>
            <input type="text" id="officer-input-badge" value="${escapeAttr(officer.badgeNo)}" placeholder="e.g. 12849 / Badge 104 / Unit 42" required />
          </div>

          <div class="officer-form-group">
            <label for="officer-input-dept">Active Agency / Department:</label>
            <select id="officer-input-dept" class="officer-select-dept">
              <option value="FIB" ${officer.dept === 'FIB' ? 'selected' : ''}>Federal Investigation Bureau (FIB)</option>
              <option value="LSPD" ${officer.dept === 'LSPD' ? 'selected' : ''}>Los Santos Police Dept (LSPD)</option>
              <option value="SAHP" ${officer.dept === 'SAHP' ? 'selected' : ''}>San Andreas Highway Patrol (SAHP)</option>
              <option value="GOV" ${officer.dept === 'GOV' ? 'selected' : ''}>Government of San Andreas (GOV)</option>
              <option value="NG" ${officer.dept === 'NG' ? 'selected' : ''}>San Andreas National Guard (NG)</option>
            </select>
          </div>

          <div class="officer-login-notice">
            ⚡ Name, Badge number and Department can be updated anytime you get promoted, demoted, or transferred. In-game character ID remains permanently locked.
          </div>

          <button type="submit" class="officer-login-submit-btn">
            ${icons.check} SAVE & UPDATE PROFILE
          </button>
        </form>
      </div>
    `;
  } else {
    modal.innerHTML = `
      <div class="officer-login-dialog">
        <div class="officer-login-header">
          <div class="officer-login-emblem-wrap">
            <img src="Assets/logo.png" alt="GrandRP HUB Emblem" class="officer-login-emblem" />
            <div class="officer-emblem-glow"></div>
          </div>
          <div class="officer-login-title-wrap">
            <h2>San Andreas Law Enforcement</h2>
            <p>Terminal Induction & Permanent Officer Identity (v2.2)</p>
          </div>
        </div>

        <div class="officer-login-badge-bar">
          <span class="officer-lock-tag">🔒 ONE-TIME CHARACTER ID REGISTRATION</span>
        </div>

        <form id="officer-login-form" class="officer-login-form">
          <div class="officer-form-group">
            <label for="officer-input-name">Officer Full Name (In-Game RP Name):</label>
            <input type="text" id="officer-input-name" placeholder="example : Dave Scofield" required autocomplete="name" />
          </div>

          <div class="officer-form-group">
            <label for="officer-input-user">In-Game Character ID (Permanent):</label>
            <input type="text" id="officer-input-user" placeholder="example : 58717" required />
          </div>

          <div class="officer-form-group">
            <label for="officer-input-badge">Badge Number / Callsign (Editable later):</label>
            <input type="text" id="officer-input-badge" placeholder="example : Badge 102" required />
          </div>

          <div class="officer-form-group">
            <label for="officer-input-dept">Assigned Agency / Department:</label>
            <select id="officer-input-dept" class="officer-select-dept">
              <option value="FIB">Federal Investigation Bureau (FIB)</option>
              <option value="LSPD" selected>Los Santos Police Dept (LSPD)</option>
              <option value="SAHP">San Andreas Highway Patrol (SAHP)</option>
              <option value="GOV">Government of San Andreas (GOV)</option>
              <option value="NG">San Andreas National Guard (NG)</option>
            </select>
          </div>

          <div class="officer-login-notice">
            ℹ️ Your in-game character ID will be permanently locked to this terminal. You can change your name, badge number and department later.
          </div>

          <button type="submit" class="officer-login-submit-btn">
            ${icons.shield} CONFIRM IDENTITY & UNLOCK TERMINAL
          </button>
        </form>
      </div>
    `;
  }

  modal.classList.add('open');

  const closeBtn = document.getElementById('officer-modal-close');
  closeBtn?.addEventListener('click', () => {
    modal.classList.remove('open');
  });

  const form = document.getElementById('officer-login-form');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!officer.isRegistered) {
      const name = document.getElementById('officer-input-name')?.value.trim();
      const userId = document.getElementById('officer-input-user')?.value.trim();
      const badgeNo = document.getElementById('officer-input-badge')?.value.trim() || userId;
      const dept = document.getElementById('officer-input-dept')?.value.trim() || 'LSPD';

      if (!name || !userId) {
        showToast('Please fill in both your Name and Character ID', 'error');
        return;
      }

      localStorage.setItem('grp_officer_name', name);
      localStorage.setItem('grp_officer_userid', userId);
      localStorage.setItem('grp_officer_username', userId);
      localStorage.setItem('grp_officer_badge_no', badgeNo);
      localStorage.setItem('grp_officer_dept', dept);
      localStorage.setItem('grp_active_officer_org', dept.toLowerCase());
      localStorage.setItem('grp_officer_registered', 'true');

      modal.classList.remove('open');
      setTimeout(() => {
        if (modal.parentNode) modal.parentNode.removeChild(modal);
      }, 300);

      playTacticalSound('success');
      showToast(`Welcome Officer ${name}! Character ID ${userId} locked permanently.`, 'success');
    } else {
      const name = document.getElementById('officer-input-name')?.value.trim() || officer.name;
      const badgeNo = document.getElementById('officer-input-badge')?.value.trim() || officer.userId;
      const dept = document.getElementById('officer-input-dept')?.value.trim() || 'LSPD';

      localStorage.setItem('grp_officer_name', name);
      localStorage.setItem('grp_officer_badge_no', badgeNo);
      localStorage.setItem('grp_officer_dept', dept);
      localStorage.setItem('grp_active_officer_org', dept.toLowerCase());

      modal.classList.remove('open');
      setTimeout(() => {
        if (modal.parentNode) modal.parentNode.removeChild(modal);
      }, 300);

      playTacticalSound('success');
      showToast(`Profile updated: ${name} · ${dept} (#${badgeNo})`, 'success');
    }
    
    sendOfficerHeartbeat();
    if (onSuccess) onSuccess();
    render();
  });
}

let liveRosterState = {
  count: 1,
  onlineOfficers: [],
  totalRegistered: 2,
  registeredList: []
};

export function getLiveRosterState() {
  return liveRosterState;
}

export function sendOfficerHeartbeat() {
  const officer = getRegisteredOfficer();
  if (!officer.isRegistered) return;
  fetch('/api/officer/heartbeat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(officer)
  }).catch(() => {});
}

setInterval(sendOfficerHeartbeat, 12000);

export function openOfficersRosterModal(defaultTab = 'online') {
  let modal = document.getElementById('officers-roster-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'officers-roster-modal';
    modal.className = 'roster-modal-overlay';
    document.body.appendChild(modal);
  }

  let activeTab = defaultTab === 'suggestions' ? 'online' : defaultTab; 
  let filterDept = 'ALL';

  function renderRosterContent() {
    const listToFilter = activeTab === 'online' ? liveRosterState.onlineOfficers : liveRosterState.registeredList;
    const filtered = filterDept === 'ALL' 
      ? listToFilter 
      : listToFilter.filter(o => o.dept.toUpperCase() === filterDept);

    const depts = ['ALL', 'FIB', 'LSPD', 'SAHP', 'GOV', 'NG'];

    modal.innerHTML = `
      <div class="roster-dialog">
        <div class="roster-header">
          <div class="roster-title-flex">
            <div class="roster-icon-wrap">
              <span class="roster-radar-dot"></span>
              ${icons.users}
            </div>
            <div>
              <h2>San Andreas Active Department Roster</h2>
                  <p>Live active officer terminals & duty status (v2.2)</p>
            </div>
          </div>
          <button type="button" class="roster-modal-close" id="roster-modal-close">${icons.close}</button>
        </div>

        <div class="roster-stats-strip">
          <div class="roster-stat-card ${activeTab === 'online' ? 'active' : ''}" id="roster-tab-online">
            <span class="roster-stat-num text-emerald">${liveRosterState.onlineOfficers.length}</span>
            <span class="roster-stat-lbl">🟢 Active Online Right Now</span>
          </div>
          <div class="roster-stat-card ${activeTab === 'all' ? 'active' : ''}" id="roster-tab-all">
            <span class="roster-stat-num text-blue">${liveRosterState.totalRegistered}</span>
            <span class="roster-stat-lbl">📋 Total Registered Officers</span>
          </div>
        </div>

          <div class="roster-filter-bar">
            <span class="roster-filter-title">Agency Filter:</span>
            <div class="roster-filter-pills">
              ${depts.map(d => `
                <button class="roster-dept-filter ${filterDept === d ? 'active' : ''}" data-dept="${d}">
                  ${d}
                </button>
              `).join('')}
            </div>
          </div>

          <div class="roster-list-container">
            ${filtered.length === 0 ? `
              <div class="roster-empty-state">
                <span class="empty-icon">${icons.shield}</span>
                <p class="empty-title">No officers found in this filter</p>
                <p class="empty-sub">Officers will appear live as they connect and register their terminal.</p>
              </div>
            ` : `
              <div class="roster-grid">
                ${filtered.map(officer => {
                  const isOnline = liveRosterState.onlineOfficers.some(o => String(o.userId) === String(officer.userId));
                  const deptColor = {
                    'FIB': '#3b82f6',
                    'LSPD': '#06b6d4',
                    'SAHP': '#f59e0b',
                    'GOV': '#8b5cf6',
                    'NG': '#10b981'
                  }[officer.dept.toUpperCase()] || '#3b82f6';

                  return `
                    <div class="roster-officer-card ${isOnline ? 'is-online' : ''}">
                      <div class="roster-card-header">
                        <div class="roster-officer-avatar" style="background: ${deptColor}20; border: 1px solid ${deptColor}40; color: ${deptColor}">
                          ${escapeHTML(officer.name.charAt(0).toUpperCase())}
                        </div>
                        <div class="roster-officer-info">
                          <div class="roster-name-row">
                            <h3 class="roster-officer-name">${escapeHTML(officer.name)}</h3>
                            <span class="roster-online-tag ${isOnline ? 'online' : 'offline'}">
                              <span class="roster-pulse-dot"></span>
                              ${isOnline ? 'ONLINE' : 'OFFLINE'}
                            </span>
                          </div>
                          <p class="roster-badge-row">
                            <span class="roster-id-badge">ID: #${escapeHTML(officer.userId)}</span>
                            <span class="roster-badge-num">Badge: #${escapeHTML(officer.badgeNo || officer.userId)}</span>
                          </p>
                        </div>
                      </div>

                      <div class="roster-card-footer">
                        <span class="roster-dept-tag" style="background: ${deptColor}15; color: ${deptColor}; border: 1px solid ${deptColor}35;">
                          ${escapeHTML(officer.dept)}
                        </span>
                        ${officer.role ? `<span class="roster-role-tag">${escapeHTML(officer.role)}</span>` : ''}
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            `}
          </div>
      </div>
    `;

    modal.classList.add('open');

    
    document.getElementById('roster-modal-close')?.addEventListener('click', () => {
      modal.classList.remove('open');
    });

    document.getElementById('roster-tab-online')?.addEventListener('click', () => {
      activeTab = 'online';
      renderRosterContent();
    });

    document.getElementById('roster-tab-all')?.addEventListener('click', () => {
      activeTab = 'all';
      renderRosterContent();
    });

    modal.querySelectorAll('.roster-dept-filter').forEach(btn => {
      btn.addEventListener('click', () => {
        filterDept = btn.dataset.dept;
        renderRosterContent();
      });
    });
  }

  renderRosterContent();
}

export function showToast(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast-item toast-${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${type === 'success' ? icons.check : icons.sparkles}</span>
    <span class="toast-text">${escapeHTML(message)}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => toast.classList.add('visible'), 10);

  setTimeout(() => {
    toast.classList.remove('visible');
    setTimeout(() => toast.remove(), 300);
  }, 2200);
}

export function copyToClipboard(text, customToast) {
  if (!text) return;
  navigator.clipboard.writeText(text).then(() => {
    playTacticalSound('copy');
    showToast(customToast || 'Copied to clipboard!', 'success');
  }).catch(() => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    playTacticalSound('copy');
    showToast(customToast || 'Copied to clipboard!', 'success');
  });
}

function getRoute() {
  const hash = window.location.hash.replace(/^#\/?/, '') || '';
  if (hash) return '/' + hash;

  // Strip the deployment base path (for example /grandrp-hub/) so direct
  // visits to a GitHub Pages project URL resolve to the home route.
  let path = window.location.pathname;
  const basePath = new URL('.', document.baseURI).pathname.replace(/\/+$/, '');
  if (basePath && path.startsWith(basePath)) path = path.slice(basePath.length);

  path = path.replace(/\/+$/, '');
  if (path === '' || path === '/index.html') return '/';
  return path.startsWith('/') ? path : '/' + path;
}

export function navigate(path) {
  playTacticalSound('nav');
  window.location.hash = path.replace(/^\//, '');
  render();
}

let clockInterval = null;
let sseConn = null;

function parseFine(fineStr) {
  if (!fineStr) return 0;
  if (typeof fineStr === 'number') return fineStr;
  const str = String(fineStr);
  const dollarMatch = str.match(/\$\s*([\d,]+(?:\.\d+)?)\s*(k|m)?/i);
  if (dollarMatch) {
    let num = parseFloat(dollarMatch[1].replace(/,/g, '')) || 0;
    if (dollarMatch[2]?.toLowerCase() === 'k') num *= 1000;
    if (dollarMatch[2]?.toLowerCase() === 'm') num *= 1000000;
    return Math.round(num);
  }
  const fineMatch = str.match(/fine[:\s]+(?:\$)?\s*([\d,]+)/i);
  if (fineMatch) {
    return parseInt(fineMatch[1].replace(/,/g, ''), 10) || 0;
  }
  const matches = [...str.replace(/,/g, '').matchAll(/\$?(\d{3,})/g)];
  if (matches.length > 0) {
    const nums = matches.map(m => parseInt(m[1], 10)).filter(n => !isNaN(n) && n > 0);
    return nums.length > 0 ? Math.max(...nums) : 0;
  }
  return 0;
}

function startClock() {
  if (clockInterval) clearInterval(clockInterval);

  function tick() {
    const now = new Date();
    
    const utc1 = new Date(now.getTime() + (now.getTimezoneOffset() + 60) * 60000);
    const clockEl = document.getElementById('game-clock');
    const dateEl = document.getElementById('game-date');
    if (!clockEl || !dateEl) return;

    const h = String(utc1.getHours()).padStart(2, '0');
    const m = String(utc1.getMinutes()).padStart(2, '0');
    const s = String(utc1.getSeconds()).padStart(2, '0');
    clockEl.textContent = `${h}:${m}:${s}`;

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const d = String(utc1.getDate()).padStart(2, '0');
    const mon = months[utc1.getMonth()];
    const y = utc1.getFullYear();
    dateEl.textContent = `${d} ${mon} ${y} · GMT+1`;
  }

  tick();
  clockInterval = setInterval(tick, 1000);
}

function initOnlineCounter() {
  const countEl = document.getElementById('online-count');
  if (countEl) countEl.textContent = liveRosterState.count;

  if (sseConn && sseConn.readyState === EventSource.OPEN) return;

  try {
    const es = new EventSource('/api/online');
    sseConn = es;

    es.onopen = () => {
      
    };

    es.onerror = () => {
      
      sseConn = null;
      try { es.close(); } catch {}
      setTimeout(initOnlineCounter, 2500);
    };

    es.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.action === 'trigger-loading') {
          triggerLoadingScreen({ sender: data.sender || 'Command Admin' });
          return;
        }
        if (data.action === 'new-chat-message' && data.message) {
          handleIncomingChatMessage(data.message);
          return;
        }
        if (data.action === 'delete-chat-message' && data.messageId) {
          handleDeletedChatMessage(data.messageId, data.auditEntry);
          return;
        }
        if (data.action === 'new-photo') {
          window.dispatchEvent(new CustomEvent('photos:new', { detail: data.photo }));
          return;
        }
        if (data.action === 'new-photo-comment') {
          window.dispatchEvent(new CustomEvent('photos:comment', { detail: data }));
          return;
        }
        if (data.action === 'photo-like') {
          window.dispatchEvent(new CustomEvent('photos:like', { detail: data }));
          return;
        }
        if (data.action === 'delete-photo') {
          window.dispatchEvent(new CustomEvent('photos:delete', { detail: data }));
          return;
        }
        if (typeof data === 'object' && data !== null) {
          liveRosterState = {
            count: data.count || 1,
            onlineOfficers: data.onlineOfficers || [],
            totalRegistered: data.totalRegistered || 0,
            registeredList: data.registeredList || []
          };
        } else if (!isNaN(parseInt(data, 10))) {
          liveRosterState.count = parseInt(data, 10);
        }
      } catch {
        const n = parseInt(e.data, 10);
        if (!isNaN(n)) liveRosterState.count = n;
      }

      const el = document.getElementById('online-count');
      if (el) el.textContent = liveRosterState.count;

      const headerRosterEl = document.getElementById('header-roster-count');
      if (headerRosterEl) headerRosterEl.textContent = liveRosterState.totalRegistered;

      const regEl = document.getElementById('roster-registered-count');
      if (regEl) regEl.textContent = liveRosterState.totalRegistered;

      updateHomeLiveRosterDOM();
    };
  } catch (e) {
    if (countEl) countEl.textContent = '1';
    setTimeout(initOnlineCounter, 3000);
  }
}

export let chatState = {
  isOpen: false,
  activeChannel: 'ic', 
  messages: [],
  auditLogs: [],
  unreadCount: 0,
  unreadIC: 0,
  unreadOOC: 0,
  unreadAudit: 0,
  replyingTo: null 
};

setInterval(() => {
  if (chatState.isOpen) {
    syncLiveChat();
  }
}, 2000);

function syncLiveChat() {
  if (chatState.activeChannel === 'audit') {
    fetchAuditLogs().then(logs => {
      
      const container = document.querySelector('.audit-logs-list');
      if (container && logs && logs.length !== chatState.auditLogs.length) {
        renderAuditLogsFeed();
      }
    });
  } else {
    fetch('/api/chat/messages')
      .then(r => r.json())
      .then(data => {
        if (!data || !Array.isArray(data.messages)) return;
        const currentIds = new Set(chatState.messages.map(m => m.id));
        const newOnes = data.messages.filter(m => !currentIds.has(m.id));

        if (newOnes.length > 0) {
          for (const msg of newOnes) {
            handleIncomingChatMessage(msg);
          }
        }
      })
      .catch(() => {});
  }
}

export function fetchChatMessages() {
  return fetch('/api/chat/messages')
    .then(r => r.json())
    .then(data => {
      if (data && Array.isArray(data.messages)) {
        chatState.messages = data.messages;
      }
      return chatState.messages;
    })
    .catch(() => chatState.messages);
}

export function fetchAuditLogs() {
  return fetch('/api/chat/audit-logs')
    .then(r => r.json())
    .then(data => {
      if (data && Array.isArray(data.logs)) {
        chatState.auditLogs = data.logs;
      }
      return chatState.auditLogs;
    })
    .catch(() => chatState.auditLogs);
}

export function openChatModal(initialChannel = null) {
  playTacticalSound('click');
  if (initialChannel) chatState.activeChannel = initialChannel;
  chatState.isOpen = true;
  
  if (chatState.activeChannel === 'ic') {
    chatState.unreadCount -= chatState.unreadIC;
    chatState.unreadIC = 0;
  } else if (chatState.activeChannel === 'ooc') {
    chatState.unreadCount -= chatState.unreadOOC;
    chatState.unreadOOC = 0;
  } else if (chatState.activeChannel === 'audit') {
    chatState.unreadCount -= chatState.unreadAudit;
    chatState.unreadAudit = 0;
  }
  if (chatState.unreadCount < 0) chatState.unreadCount = 0;
  updateChatBadgeDOM();

  let modal = document.getElementById('tactical-chat-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'tactical-chat-modal';
    modal.className = 'spotlight-modal-overlay';
    document.body.appendChild(modal);
  }

  renderChatModalDOM(modal);
  modal.classList.add('open');

  Promise.all([fetchChatMessages(), fetchAuditLogs()]).then(() => {
    if (chatState.activeChannel === 'audit') {
      renderAuditLogsFeed();
    } else {
      renderChatMessagesFeed();
      scrollChatToBottom();
    }
  });
}

export function closeChatModal() {
  chatState.isOpen = false;
  chatState.replyingTo = null;
  const modal = document.getElementById('tactical-chat-modal');
  if (modal) modal.classList.remove('open');
}

function updateChatBadgeDOM() {
  const badge = document.getElementById('chat-header-unread');
  if (badge) {
    if (chatState.unreadCount > 0) {
      badge.textContent = chatState.unreadCount > 99 ? '99+' : chatState.unreadCount;
      badge.classList.remove('hidden');
    } else {
      badge.classList.add('hidden');
    }
  }

  const tabBadgeIC = document.getElementById('chat-tab-badge-ic');
  if (tabBadgeIC) {
    tabBadgeIC.textContent = chatState.unreadIC;
    tabBadgeIC.style.display = chatState.unreadIC > 0 ? 'inline-block' : 'none';
  }
  const tabBadgeOOC = document.getElementById('chat-tab-badge-ooc');
  if (tabBadgeOOC) {
    tabBadgeOOC.textContent = chatState.unreadOOC;
    tabBadgeOOC.style.display = chatState.unreadOOC > 0 ? 'inline-block' : 'none';
  }
  const tabBadgeAudit = document.getElementById('chat-tab-badge-audit');
  if (tabBadgeAudit) {
    tabBadgeAudit.textContent = chatState.auditLogs.length;
    tabBadgeAudit.style.display = chatState.auditLogs.length > 0 ? 'inline-block' : 'none';
  }
}

function handleIncomingChatMessage(msg) {
  
  if (!chatState.messages.some(m => m.id === msg.id)) {
    chatState.messages.push(msg);
    if (chatState.messages.length > 500) chatState.messages = chatState.messages.slice(-500);
  }

  const officer = getRegisteredOfficer();
  const myName = (officer.name || '').toLowerCase();
  const myBadge = (officer.badgeNo || '').toLowerCase();
  const myDept = (officer.dept || '').toLowerCase();
  const msgText = msg.text.toLowerCase();

  const isMentioned = myName && (
    msgText.includes(`@${myName}`) ||
    (myBadge && msgText.includes(`@${myBadge}`)) ||
    (myDept && msgText.includes(`@${myDept}`)) ||
    msgText.includes('@all') ||
    (msg.replyTo && msg.replyTo.author && msg.replyTo.author.toLowerCase() === myName)
  );

  if (isMentioned) {
    playTacticalSound('mention');
    showToast(`🚨 @${msg.author} [${msg.dept}] tagged you in ${msg.channel.toUpperCase()} chat: "${msg.text.slice(0, 50)}..."`, 'info');
  } else {
    playTacticalSound('chat');
  }

  if (chatState.isOpen) {
    if (msg.channel === chatState.activeChannel) {
      appendChatMessageToDOM(msg, isMentioned);
      scrollChatToBottom();
    } else {
      if (msg.channel === 'ic') chatState.unreadIC++;
      else chatState.unreadOOC++;
      chatState.unreadCount++;
      updateChatBadgeDOM();
    }
  } else {
    if (msg.channel === 'ic') chatState.unreadIC++;
    else chatState.unreadOOC++;
    chatState.unreadCount++;
    updateChatBadgeDOM();
  }
}

function handleDeletedChatMessage(messageId, auditEntry) {
  chatState.messages = chatState.messages.filter(m => m.id !== messageId);
  const el = document.getElementById(`chat-msg-${messageId}`);
  if (el) {
    el.classList.add('chat-row-deleted-anim');
    setTimeout(() => el.remove(), 250);
  }

  if (auditEntry && !chatState.auditLogs.some(log => log.id === auditEntry.id)) {
    chatState.auditLogs.unshift(auditEntry);
    if (chatState.auditLogs.length > 300) chatState.auditLogs = chatState.auditLogs.slice(0, 300);
    updateChatBadgeDOM();

    if (chatState.isOpen && chatState.activeChannel === 'audit') {
      renderAuditLogsFeed();
    }
  }
}

function renderChatModalDOM(modal) {
  const officer = getRegisteredOfficer();

  modal.innerHTML = `
    <div class="spotlight-modal-card tactical-chat-modal-card">
      <div class="chat-modal-header">
        <div class="chat-modal-title-group">
          <span class="chat-title-icon">💬</span>
          <div>
            <h3>Tactical Dispatch Radio & Community Chat</h3>
            <p>Live encrypted communications & real-time audit logging for San Andreas LEO</p>
          </div>
        </div>

        <div class="chat-channel-tabs">
          <button type="button" class="chat-channel-tab ${chatState.activeChannel === 'ic' ? 'active' : ''}" data-chat-channel="ic">
            <span>🎙️ IC Radio & Dispatch</span>
            <span class="chat-tab-unread-dot" id="chat-tab-badge-ic" style="display:${chatState.unreadIC > 0 ? 'inline-block' : 'none'};">${chatState.unreadIC}</span>
          </button>
          <button type="button" class="chat-channel-tab ${chatState.activeChannel === 'ooc' ? 'active' : ''}" data-chat-channel="ooc">
            <span>🌐 OOC Global Lounge</span>
            <span class="chat-tab-unread-dot" id="chat-tab-badge-ooc" style="display:${chatState.unreadOOC > 0 ? 'inline-block' : 'none'};">${chatState.unreadOOC}</span>
          </button>
          <button type="button" class="chat-channel-tab ${chatState.activeChannel === 'audit' ? 'active' : ''}" data-chat-channel="audit">
            <span>📜 Deleted Logs & Audit</span>
            <span class="chat-tab-unread-dot" id="chat-tab-badge-audit" style="display:${chatState.auditLogs.length > 0 ? 'inline-block' : 'none'};">${chatState.auditLogs.length}</span>
          </button>
        </div>

        <button type="button" class="chat-modal-close-btn" id="btn-close-chat-modal" title="Close Chat (Esc)">✕</button>
      </div>

      <div class="chat-messages-viewport" id="chat-messages-viewport">
        <div class="chat-messages-feed" id="chat-messages-feed">
          <div class="chat-loading-placeholder">
            <span class="chat-pulse-spinner"></span>
            <span>Connecting to tactical frequency...</span>
          </div>
        </div>
      </div>

      <div class="chat-reply-banner hidden" id="chat-reply-banner">
        <div class="reply-banner-content">
          <span class="reply-banner-icon">↩</span>
          <span class="reply-banner-text" id="chat-reply-banner-text">Replying to @Author</span>
        </div>
        <button type="button" class="reply-banner-cancel" id="btn-cancel-chat-reply" title="Cancel Reply">✕</button>
      </div>

      <div class="chat-quick-mentions-bar" id="chat-quick-mentions-bar" style="display:${chatState.activeChannel === 'audit' ? 'none' : 'flex'};">
        <span class="quick-mention-label">⚡ Tag:</span>
        <button type="button" class="mention-pill-btn" data-add-mention="@all">@all</button>
        <button type="button" class="mention-pill-btn" data-add-mention="@FIB">@FIB</button>
        <button type="button" class="mention-pill-btn" data-add-mention="@LSPD">@LSPD</button>
        <button type="button" class="mention-pill-btn" data-add-mention="@SAHP">@SAHP</button>
        <button type="button" class="mention-pill-btn" data-add-mention="@GOV">@GOV</button>
        <button type="button" class="mention-pill-btn" data-add-mention="@NG">@NG</button>
        <button type="button" class="mention-pill-btn" data-add-mention="10-8">10-8</button>
        <button type="button" class="mention-pill-btn" data-add-mention="10-99">10-99</button>
      </div>

      <div class="chat-input-container" id="chat-input-container" style="display:${chatState.activeChannel === 'audit' ? 'none' : 'block'};">
        <form id="chat-input-form" class="chat-input-form">
          <input 
            type="text" 
            id="chat-input-message" 
            class="chat-text-input" 
            placeholder="${chatState.activeChannel === 'ic' ? 'Broadcast tactical 10-code or IC dispatch message (e.g. 10-8 Los Santos City)...' : 'Type OOC message or question to the community...'}" 
            autocomplete="off" 
            maxlength="1000"
            required
          />
          <button type="submit" class="chat-send-btn" id="btn-chat-send" title="Send Message (Enter)">
            <span>🚀 Send</span>
          </button>
        </form>
      </div>
    </div>
  `;

  
  modal.onclick = (e) => {
    if (e.target === modal || e.target.closest('#btn-close-chat-modal')) {
      closeChatModal();
    }
  };

  
  modal.querySelectorAll('[data-chat-channel]').forEach(tab => {
    tab.addEventListener('click', () => {
      const ch = tab.dataset.chatChannel;
      if (chatState.activeChannel === ch) return;
      playTacticalSound('click');
      chatState.activeChannel = ch;
      modal.querySelectorAll('[data-chat-channel]').forEach(t => t.classList.toggle('active', t.dataset.chatChannel === ch));
      
      const inputEl = document.getElementById('chat-input-message');
      const inputContainer = document.getElementById('chat-input-container');
      const mentionsBar = document.getElementById('chat-quick-mentions-bar');

      if (ch === 'audit') {
        if (inputContainer) inputContainer.style.display = 'none';
        if (mentionsBar) mentionsBar.style.display = 'none';
        renderAuditLogsFeed();
      } else {
        if (inputContainer) inputContainer.style.display = 'block';
        if (mentionsBar) mentionsBar.style.display = 'flex';
        if (inputEl) {
          inputEl.placeholder = ch === 'ic' 
            ? 'Broadcast tactical 10-code or IC dispatch message (e.g. 10-8 Los Santos City)...' 
            : 'Type OOC message or question to the community...';
        }
        renderChatMessagesFeed();
        scrollChatToBottom();
        inputEl?.focus();
      }

      if (ch === 'ic') {
        chatState.unreadCount -= chatState.unreadIC;
        chatState.unreadIC = 0;
      } else if (ch === 'ooc') {
        chatState.unreadCount -= chatState.unreadOOC;
        chatState.unreadOOC = 0;
      }
      if (chatState.unreadCount < 0) chatState.unreadCount = 0;
      updateChatBadgeDOM();
    });
  });

  
  const cancelReplyBtn = document.getElementById('btn-cancel-chat-reply');
  cancelReplyBtn?.addEventListener('click', () => {
    chatState.replyingTo = null;
    document.getElementById('chat-reply-banner')?.classList.add('hidden');
  });

  
  modal.querySelectorAll('[data-add-mention]').forEach(pill => {
    pill.addEventListener('click', () => {
      const tag = pill.dataset.addMention;
      const inputEl = document.getElementById('chat-input-message');
      if (!inputEl) return;
      const val = inputEl.value;
      inputEl.value = val ? `${val} ${tag} ` : `${tag} `;
      inputEl.focus();
    });
  });

  
  const form = document.getElementById('chat-input-form');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    handleSendChatMessageAction();
  });

  
  const inputEl = document.getElementById('chat-input-message');
  inputEl?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendChatMessageAction();
    }
  });

  
  const feed = document.getElementById('chat-messages-feed');
  feed?.addEventListener('click', (e) => {
    
    const replyBtn = e.target.closest('[data-chat-reply-id]');
    if (replyBtn) {
      const msgId = replyBtn.dataset.chatReplyId;
      const msg = chatState.messages.find(m => m.id === msgId);
      if (msg) {
        chatState.replyingTo = {
          id: msg.id,
          author: msg.author,
          text: msg.text
        };
        const banner = document.getElementById('chat-reply-banner');
        const bannerText = document.getElementById('chat-reply-banner-text');
        if (banner && bannerText) {
          bannerText.textContent = `Replying to @${msg.author}: "${msg.text.slice(0, 60)}..."`;
          banner.classList.remove('hidden');
        }
        const textInput = document.getElementById('chat-input-message');
        if (textInput) {
          if (!textInput.value.includes(`@${msg.author}`)) {
            textInput.value = `@${msg.author} ${textInput.value}`.trimStart();
          }
          textInput.focus();
        }
      }
      return;
    }

    
    const delBtn = e.target.closest('[data-chat-del-id]');
    if (delBtn) {
      const msgId = delBtn.dataset.chatDelId;
      handleDeleteChatMessageAction(msgId);
    }
  });

  setTimeout(() => {
    document.getElementById('chat-input-message')?.focus();
  }, 100);
}

function handleSendChatMessageAction() {
  const inputEl = document.getElementById('chat-input-message');
  const text = inputEl?.value.trim();
  if (!text) return;

  const officer = getRegisteredOfficer();

  
  sendChatMessage(text);
  inputEl.value = '';
  chatState.replyingTo = null;
  document.getElementById('chat-reply-banner')?.classList.add('hidden');
  inputEl.focus();
}

function handleDeleteChatMessageAction(msgId) {
  const officer = getRegisteredOfficer();
  
  
  chatState.messages = chatState.messages.filter(m => m.id !== msgId);
  const el = document.getElementById(`chat-msg-${msgId}`);
  if (el) el.remove();

  playTacticalSound('click');
  showToast('🗑️ Message archived in Tactical Audit Logs', 'info');

  fetch(`/api/chat/message/${msgId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      deletedBy: {
        name: officer.name || 'Dave Scofield',
        badgeNo: officer.badgeNo || '001',
        dept: officer.dept || 'FIB'
      }
    })
  })
    .then(r => r.json())
    .then(data => {
      if (data.auditEntry && !chatState.auditLogs.some(log => log.id === data.auditEntry.id)) {
        chatState.auditLogs.unshift(data.auditEntry);
        updateChatBadgeDOM();
      }
    })
    .catch(() => {});
}

function renderChatMessagesFeed() {
  const feed = document.getElementById('chat-messages-feed');
  if (!feed) return;

  const currentChannelMsgs = chatState.messages.filter(m => m.channel === chatState.activeChannel);
  if (currentChannelMsgs.length === 0) {
    feed.innerHTML = `
      <div class="chat-empty-feed">
        <span class="chat-empty-icon">${chatState.activeChannel === 'ic' ? '🎙️' : '🌐'}</span>
        <p class="chat-empty-title">No messages in ${chatState.activeChannel.toUpperCase()} frequency yet</p>
        <p class="chat-empty-sub">Be the first to broadcast a message to all online units.</p>
      </div>
    `;
    return;
  }

  const officer = getRegisteredOfficer();
  const myName = (officer.name || '').toLowerCase();
  const myBadge = (officer.badgeNo || '').toLowerCase();
  const myDept = (officer.dept || '').toLowerCase();

  feed.innerHTML = currentChannelMsgs.map(msg => {
    const isTarget = myName && (
      msg.text.toLowerCase().includes(`@${myName}`) ||
      (myBadge && msg.text.toLowerCase().includes(`@${myBadge}`)) ||
      (myDept && msg.text.toLowerCase().includes(`@${myDept}`)) ||
      msg.text.toLowerCase().includes('@all') ||
      (msg.replyTo && msg.replyTo.author && msg.replyTo.author.toLowerCase() === myName)
    );
    return renderSingleMessageCardHTML(msg, isTarget, officer);
  }).join('');
}

function renderAuditLogsFeed() {
  const feed = document.getElementById('chat-messages-feed');
  if (!feed) return;

  if (chatState.auditLogs.length === 0) {
    feed.innerHTML = `
      <div class="chat-empty-feed">
        <span class="chat-empty-icon">📜</span>
        <p class="chat-empty-title">Tactical Audit Logs Clean</p>
        <p class="chat-empty-sub">No deleted messages or moderation actions have been recorded yet.</p>
      </div>
    `;
    return;
  }

  feed.innerHTML = `
    <div class="audit-logs-container">
      <div class="audit-logs-header-strip">
        <span>🛡️ PERMANENT AUDIT LOGS — DELETED MESSAGES ARCHIVE</span>
        <span>${chatState.auditLogs.length} RECORDS</span>
      </div>
      <div class="audit-logs-list">
        ${chatState.auditLogs.map(log => {
          const sentDate = new Date(log.sentAt || log.deletedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const delDate = new Date(log.deletedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
          const deptColor = {
            'FIB': '#3b82f6',
            'LSPD': '#06b6d4',
            'SAHP': '#f59e0b',
            'GOV': '#8b5cf6',
            'NG': '#10b981'
          }[log.dept?.toUpperCase()] || '#ef4444';

          return `
            <div class="audit-log-card">
              <div class="audit-log-topline">
                <span class="audit-log-badge">🗑️ DELETED MESSAGE</span>
                <span class="audit-log-channel">[${escapeHTML(log.channel?.toUpperCase() || 'IC')}]</span>
                <span class="audit-log-author" style="color: ${deptColor};">${escapeHTML(log.author)} (#${escapeHTML(log.badgeNo || 'N/A')})</span>
                <span class="audit-log-time">Sent at ${sentDate}</span>
              </div>

              <div class="audit-log-content">
                "${escapeHTML(log.text)}"
              </div>

              <div class="audit-log-meta">
                <span class="audit-deleted-by">
                  👮 Deleted by: <strong>${escapeHTML(log.deletedBy?.name || 'Officer')}</strong> (#${escapeHTML(log.deletedBy?.badgeNo || 'N/A')} · ${escapeHTML(log.deletedBy?.dept || 'LEO')})
                </span>
                <span class="audit-deleted-time">${delDate}</span>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

function appendChatMessageToDOM(msg, isTarget) {
  const feed = document.getElementById('chat-messages-feed');
  if (!feed) return;
  const placeholder = feed.querySelector('.chat-empty-feed') || feed.querySelector('.chat-loading-placeholder');
  if (placeholder) placeholder.remove();

  const officer = getRegisteredOfficer();
  const temp = document.createElement('div');
  temp.innerHTML = renderSingleMessageCardHTML(msg, isTarget, officer);
  feed.appendChild(temp.firstElementChild);
}

function renderSingleMessageCardHTML(msg, isTarget, officer) {
  const deptColor = {
    'FIB': '#3b82f6',
    'LSPD': '#06b6d4',
    'SAHP': '#f59e0b',
    'GOV': '#8b5cf6',
    'NG': '#10b981'
  }[msg.dept?.toUpperCase()] || '#3b82f6';

  const isMe = String(msg.userId) === String(officer.userId) || (msg.author && msg.author.toLowerCase() === (officer.name || '').toLowerCase());
  const dateStr = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const formattedText = escapeHTML(msg.text).replace(/@([\w\s#-]+)/g, '<span class="chat-mention-tag">@$1</span>');

  return `
    <div class="chat-message-row ${isMe ? 'is-me' : ''} ${isTarget ? 'is-mention-target' : ''}" id="chat-msg-${msg.id}">
      <div class="chat-msg-avatar" style="background: ${deptColor}20; border-color: ${deptColor}50; color: ${deptColor};">
        ${escapeHTML(msg.author.charAt(0).toUpperCase())}
      </div>

      <div class="chat-msg-body">
        <div class="chat-msg-topline">
          <span class="chat-msg-dept-badge" style="background: ${deptColor}15; color: ${deptColor}; border-color: ${deptColor}35;">
            ${escapeHTML(msg.dept)}
          </span>
          <strong class="chat-msg-author">${escapeHTML(msg.author)}</strong>
          <span class="chat-msg-badge">#${escapeHTML(msg.badgeNo || msg.userId)}</span>
          <span class="chat-msg-time">${dateStr}</span>
        </div>

        ${msg.replyTo ? `
          <div class="chat-msg-quote-box">
            <span class="quote-author">↩ Replying to @${escapeHTML(msg.replyTo.author)}:</span>
            <span class="quote-text">"${escapeHTML(msg.replyTo.text)}"</span>
          </div>
        ` : ''}

        <div class="chat-msg-text">${formattedText}</div>
      </div>

      <div class="chat-msg-actions">
        <button type="button" class="btn-chat-action-reply" data-chat-reply-id="${msg.id}" title="Reply to this message">↩ Reply</button>
        <button type="button" class="btn-chat-action-del" data-chat-del-id="${msg.id}" title="Delete and archive in Audit Logs">🗑️ Del</button>
      </div>
    </div>
  `;
}

function scrollChatToBottom() {
  const viewport = document.getElementById('chat-messages-viewport');
  if (viewport) {
    setTimeout(() => {
      viewport.scrollTop = viewport.scrollHeight;
    }, 20);
  }
}

function sendChatMessage(text) {
  const officer = getRegisteredOfficer();

  fetch('/api/chat/message', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      channel: chatState.activeChannel,
      author: officer.name || 'Dave Scofield',
      userId: officer.userId || '001',
      badgeNo: officer.badgeNo || '001',
      dept: officer.dept || 'FIB',
      text: text.trim(),
      replyTo: chatState.replyingTo
    })
  })
    .then(r => r.json())
    .catch(() => {
      showToast('Message delivery queued offline', 'info');
    });
}

function updateHomeLiveRosterDOM() {
  const container = document.getElementById('home-roster-chips-list');
  if (!container) return;
  const onlineOfficersList = liveRosterState.onlineOfficers;
  if (onlineOfficersList.length === 0) {
    container.innerHTML = `
      <div class="home-roster-placeholder">
        <span>🛡️</span>
        <span>No officers currently broadcasting live presence. Register your badge to appear active.</span>
      </div>
    `;
  } else {
    container.innerHTML = `
      <div class="home-roster-chips-grid">
        ${onlineOfficersList.map(o => {
          const deptColor = {
            'FIB': '#3b82f6',
            'LSPD': '#06b6d4',
            'SAHP': '#f59e0b',
            'GOV': '#8b5cf6',
            'NG': '#10b981'
          }[o.dept.toUpperCase()] || '#3b82f6';

          return `
            <div class="home-officer-chip" style="border-color: ${deptColor}40;">
              <span class="home-chip-ping"></span>
              <div class="home-chip-details">
                <span class="home-chip-name">${escapeHTML(o.name)}</span>
                <span class="home-chip-meta" style="color: ${deptColor};">#${escapeHTML(o.badgeNo || o.userId)} · ${escapeHTML(o.dept)}</span>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }
}

function renderLayout(pageContent) {
  const app = document.getElementById('app');
  const route = getRoute();
  const currentThemeIdx = parseInt(localStorage.getItem('grp_theme_idx') || '0', 10);
  const officer = getRegisteredOfficer();
  const deptColor = {
    'FIB': '#3b82f6',
    'LSPD': '#06b6d4',
    'SAHP': '#f59e0b',
    'GOV': '#8b5cf6',
    'NG': '#10b981'
  }[officer.dept?.toUpperCase()] || '#3b82f6';

  app.innerHTML = `
    <header class="header">
      <div class="header-left">
        <button class="sidebar-toggle-btn" id="sidebar-toggle-btn" title="Toggle Sidebar (Ctrl+B or [)" aria-label="Toggle Navigation">
          ${icons.panelLeft}
        </button>
        <a href="#/" class="header-brand" data-nav="/">
          <div class="header-logo-badge">
            <img src="Assets/logo.png" alt="GrandRP HUB Emblem" class="header-logo-emblem" />
            <span class="header-title">GrandRP<span class="header-title-sub">HUB</span></span>
          </div>
          <span class="header-server-tag">EN3 · v2.2</span>
        </a>
      </div>

      <div class="header-center">
        <button class="global-search-trigger" id="global-search-btn">
          ${icons.search}
          <span class="search-trigger-text">Search commands, penal codes, statutes... (Press /)</span>
        </button>
      </div>

      <div class="header-right">
        ${officer.isRegistered ? `
          <div class="officer-identity-chip" id="officer-identity-chip" title="Click to update Badge # or Transfer Department (In-Game Name & ID Locked)">
            <span class="officer-chip-dot"></span>
            <div class="officer-chip-details">
              <p class="officer-chip-name">${escapeHTML(officer.name)}</p>
              <p class="officer-chip-sub">#${escapeHTML(officer.badgeNo)} · ${escapeHTML(officer.dept)} ✎</p>
            </div>
          </div>
        ` : `
          <button class="officer-register-trigger-btn prominent-login-pulse" id="btn-trigger-officer-login" title="Register Officer Identity Credentials">
            ${icons.shield} <span>👮 Officer Login</span>
          </button>
        `}

        <button class="roster-trigger-pill" id="header-roster-btn" title="View Live Online Officers & Registered Members Roster">
          <span class="roster-live-ping"></span>
          <span class="roster-online-num" id="header-online-num">${liveRosterState.count} ONLINE</span>
          <span class="roster-sep">·</span>
          <span class="roster-total-num" id="header-roster-count">${liveRosterState.totalRegistered} LEO</span>
        </button>

        <button class="lite-mode-pill ${liteModeEnabled ? 'active' : ''}" id="btn-header-lite-mode" title="Toggle Low-RAM Performance Mode">
          ⚡ ${liteModeEnabled ? 'LOW RAM (ON)' : 'LOW RAM (OFF)'}
        </button>

        <a href="#/photos" class="photos-header-btn ${route === '/photos' ? 'active' : ''}" data-nav="/photos" title="Patrol Photos & Real-Time Discussion Feed">
          <span class="photos-header-icon">📷</span>
          <span class="photos-header-text">Photos</span>
        </a>

        <button class="header-btn" id="theme-toggle-btn" title="Change Theme & Color Palette">
          ${icons.palette}
        </button>

        <button class="header-btn" id="sound-toggle-btn" title="${soundEnabled ? 'Mute Sounds' : 'Unmute Sounds'}">
          ${soundEnabled ? icons.volume2 : icons.volumeX}
        </button>
      </div>
    </header>

    <div class="body-wrap">
      <div class="sidebar-overlay" id="sidebar-overlay"></div>
      
      <aside class="sidebar" id="app-sidebar">
        <nav class="sidebar-nav">
          <div class="nav-section-label">⭐ CORE TOOLS</div>
          <a href="#/" class="nav-link ${route === '/' ? 'active' : ''}" data-nav="/">
            ${icons.building}
            <span>Command Center</span>
          </a>
          <a href="#/photos" class="nav-link ${route === '/photos' ? 'active' : ''}" data-nav="/photos">
            ${icons.camera}
            <span>Patrol Photos</span>
            <span class="nav-pill nav-pill--new">LIVE</span>
          </a>
          <a href="#/penal-codes" class="nav-link ${route === '/penal-codes' ? 'active' : ''}" data-nav="/penal-codes">
            ${icons.scale}
            <span>Penal Codes</span>
            <span class="nav-pill">EN3</span>
          </a>
          <a href="#/calculator" class="nav-link ${route === '/calculator' ? 'active' : ''}" data-nav="/calculator">
            ${icons.calculator}
            <span>Arrest & Bail Calc</span>
            <span class="nav-pill nav-pill--new">PRO</span>
          </a>
          <a href="#/starred" class="nav-link ${route === '/starred' ? 'active' : ''}" data-nav="/starred">
            ${icons.star}
            <span>Starred Vault</span>
            <span class="nav-pill" style="background:rgba(251,191,36,0.2); color:#fbbf24; border:1px solid rgba(251,191,36,0.4);">⭐</span>
          </a>

          <div class="nav-section-label">⚖️ LEGAL & DISPATCH</div>
          <a href="#/cheatsheet" class="nav-link ${route === '/cheatsheet' ? 'active' : ''}" data-nav="/cheatsheet">
            ${icons.fileText}
            <span>10-Codes & Miranda</span>
          </a>
          <a href="#/arrest-procedure" class="nav-link ${route === '/arrest-procedure' ? 'active' : ''}" data-nav="/arrest-procedure">
            ${icons.shield}
            <span>Arrest SOP</span>
          </a>
          <a href="#/bench-trial" class="nav-link ${route === '/bench-trial' ? 'active' : ''}" data-nav="/bench-trial">
            ${icons.gavel}
            <span>Bench Trial & Court</span>
          </a>
          <a href="#/legislation" class="nav-link ${route === '/legislation' ? 'active' : ''}" data-nav="/legislation">
            ${icons.fileText}
            <span>Legislation & PDFs</span>
          </a>
          <a href="#/fast-links" class="nav-link ${route === '/fast-links' ? 'active' : ''}" data-nav="/fast-links">
            ${icons.link}
            <span>Fast Links & Mails</span>
          </a>

          <div class="nav-section-label">🚔 AGENCIES (5)</div>
          ${orgsData.map(org => `
            <a href="#/${org.id}" class="nav-link ${route === '/' + org.id ? 'active' : ''}" data-nav="/${org.id}">
              <span class="org-nav-dot" style="background-color: ${org.color}; box-shadow: 0 0 6px ${org.color};"></span>
              <span>${org.shortName}</span>
              <span class="nav-count">${org.sections.reduce((acc, s) => acc + s.groups.reduce((a, g) => a + g.commands.length, 0), 0)}</span>
            </a>
          `).join('')}
        </nav>

        <div class="sidebar-footer">
          <div class="sidebar-credits-badge">
            <div class="sidebar-credit-item">
              <span class="credit-icon">👑</span>
              <span class="credit-text">Created by <strong class="credit-name-gold">Dave Scofield</strong></span>
            </div>
            <div class="sidebar-credit-item">
              <span class="credit-icon">🤝</span>
              <span class="credit-text">Only to use by <strong class="credit-name-blue">Saad Scofield</strong></span>
            </div>
          </div>
        </div>
      </aside>

      <main class="main" id="main-scroll-area">
        <div class="main-inner" id="page-content">
          ${pageContent}
        </div>
        <footer class="site-footer">
          <span class="site-footer-rule"></span>
          <div class="site-footer-content-wrap">
            <span class="site-footer-text">GrandRP HUB v2.2 · Tactical Reference & Department Utilities</span>
            <div class="author-credits-badge">
              <span class="credit-creator">👑 Created by <strong class="credit-name-gold">Dave Scofield</strong></span>
              <span class="credit-dot">•</span>
              <span class="credit-supporter">🤝 Only to use by <strong class="credit-name-blue">Saad Scofield</strong></span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  `;

  attachShellListeners();
}

function attachShellListeners() {
  const toggleBtn = document.getElementById('sidebar-toggle-btn');
  const sidebar = document.getElementById('app-sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  
  const toggleSidebarAction = () => {
    playTacticalSound('click');
    if (window.innerWidth <= 768) {
      sidebar?.classList.toggle('mobile-open');
      overlay?.classList.toggle('mobile-open');
    } else {
      document.body.classList.toggle('sidebar-collapsed');
      const isCollapsed = document.body.classList.contains('sidebar-collapsed');
      localStorage.setItem('grp_sidebar_collapsed', String(isCollapsed));
      showToast(isCollapsed ? 'Sidebar closed (Full-width mode)' : 'Sidebar opened', 'info');
    }
  };

  if (toggleBtn) {
    toggleBtn.addEventListener('click', toggleSidebarAction);
  }

  if (overlay && sidebar) {
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('mobile-open');
      overlay.classList.remove('mobile-open');
    });
  }

  
  document.querySelectorAll('[data-nav]').forEach(el => {
    el.addEventListener('click', (e) => {
      const href = el.getAttribute('href');
      if (href && href.startsWith('#')) {
        
        if (sidebar?.classList.contains('mobile-open')) {
          sidebar.classList.remove('mobile-open');
          overlay?.classList.remove('mobile-open');
        }
      }
    });
  });

  
  const themeBtn = document.getElementById('theme-toggle-btn');
  if (themeBtn) {
    themeBtn.addEventListener('click', openThemeModal);
  }

  const soundBtn = document.getElementById('sound-toggle-btn');
  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      localStorage.setItem('grp_sound_enabled', String(soundEnabled));
      playTacticalSound('click');
      showToast(soundEnabled ? '🔊 Sound effects enabled' : '🔇 Sound effects muted', 'info');
      render();
    });
  }

  
  const toggleLiteModeAction = () => {
    liteModeEnabled = !liteModeEnabled;
    applyLiteMode(liteModeEnabled);
    playTacticalSound('click');
    showToast(
      liteModeEnabled 
        ? '⚡ Low-RAM Lite Mode ENABLED (0% GPU/RAM lag)' 
        : '⚡ Low-RAM Lite Mode DISABLED (Full visual effects)',
      liteModeEnabled ? 'success' : 'info'
    );
    render();
  };

  const headerLiteBtn = document.getElementById('btn-header-lite-mode');
  if (headerLiteBtn) {
    headerLiteBtn.addEventListener('click', toggleLiteModeAction);
  }

  const triggerOfficerLoginAction = () => {
    promptOfficerLoginModal();
  };

  const officerLoginBtn = document.getElementById('btn-trigger-officer-login');
  if (officerLoginBtn) {
    officerLoginBtn.addEventListener('click', triggerOfficerLoginAction);
  }

  const officerChip = document.getElementById('officer-identity-chip');
  if (officerChip) {
    officerChip.addEventListener('click', triggerOfficerLoginAction);
  }

  
  const openRosterAction = (tab = 'all') => {
    openOfficersRosterModal(tab);
  };

  const headerRosterBtn = document.getElementById('header-roster-btn');
  if (headerRosterBtn) {
    headerRosterBtn.addEventListener('click', () => openRosterAction('all'));
  }

  
  const heroSmartInput = document.getElementById('hero-smart-search-input');
  if (heroSmartInput) {
    heroSmartInput.addEventListener('click', () => {
      openSearchModal(heroSmartInput.value);
    });
    heroSmartInput.addEventListener('focus', () => {
      openSearchModal(heroSmartInput.value);
    });
    heroSmartInput.addEventListener('input', (e) => {
      openSearchModal(e.target.value);
    });
  }

  const heroSearchBox = document.getElementById('hero-smart-search-box');
  if (heroSearchBox) {
    heroSearchBox.addEventListener('click', () => {
      openSearchModal();
    });
  }

  document.querySelectorAll('[data-fast-search]').forEach(pill => {
    pill.addEventListener('click', (e) => {
      e.stopPropagation();
      openSearchModal(pill.dataset.fastSearch);
    });
  });

  const homeRosterStrip = document.getElementById('home-roster-strip-btn');
  if (homeRosterStrip) {
    homeRosterStrip.addEventListener('click', () => openOfficersRosterModal('online'));
  }
}

function renderHome() {
  const onlineOfficersList = liveRosterState.onlineOfficers;

  return `
    <div class="home-container">
      <div class="home-simple-hero">
        <div class="hero-brand-top">
          <span class="hero-hub-badge">SAN ANDREAS LAW ENFORCEMENT & PUBLIC SAFETY · EN3</span>
          <h1 class="hero-simple-title">State Command & <span class="text-gradient-accent">Legal Reference</span></h1>
          <p class="hero-simple-desc">Official penal codex, interactive arrest & bail calculator, dispatch 10-codes, and department field protocols for GrandRP EN3.</p>
        </div>

        <div class="hero-smart-search-wrap">
          <div class="hero-smart-search-box" id="hero-smart-search-box">
            <span class="hero-search-icon">${icons.search}</span>
            <input type="text" id="hero-smart-search-input" placeholder="Search statutes, penal codes, RP commands, or 10-codes (e.g. /cuff, evading, 10-99, bail)..." />
            <span class="hero-search-shortcut"><kbd>/</kbd></span>
          </div>
          <div class="hero-fast-tags">
            <span class="fast-tag-label">Quick Search:</span>
            <button type="button" class="fast-tag-pill" data-fast-search="/cuff">/cuff</button>
            <button type="button" class="fast-tag-pill" data-fast-search="evading">evading</button>
            <button type="button" class="fast-tag-pill" data-fast-search="10-99">10-99</button>
            <button type="button" class="fast-tag-pill" data-fast-search="miranda">miranda</button>
            <button type="button" class="fast-tag-pill" data-fast-search="bail">bail</button>
            <button type="button" class="fast-tag-pill" data-fast-search="towing">towing</button>
          </div>
        </div>
      </div>

      <div class="core-hub-grid">
        <a href="#/penal-codes" class="core-card core-card-penal" data-nav="/penal-codes">
          <div class="core-card-header">
            <span class="core-card-icon">⚖️</span>
            <span class="core-card-badge">EN3 CODEX</span>
          </div>
          <h2 class="core-card-title">Penal Codes & Fines</h2>
          <p class="core-card-desc">Complete San Andreas legal code with search by code or offense, fine amounts, wanted stars, and prison times.</p>
          <div class="core-card-footer">
            <span>Browse Penal Law</span>
            <span class="core-arrow">➜</span>
          </div>
        </a>

        <a href="#/calculator" class="core-card core-card-calc" data-nav="/calculator">
          <div class="core-card-header">
            <span class="core-card-icon">🧮</span>
            <span class="core-card-badge">CALCULATOR</span>
          </div>
          <h2 class="core-card-title">Arrest & Bail Calculator</h2>
          <p class="core-card-desc">Interactive charge selector that automatically computes prison sentences, total fines, and generates clean Discord arrest logs.</p>
          <div class="core-card-footer">
            <span>Open Calculator</span>
            <span class="core-arrow">➜</span>
          </div>
        </a>

        <a href="#/cheatsheet" class="core-card core-card-codes" data-nav="/cheatsheet">
          <div class="core-card-header">
            <span class="core-card-icon">📻</span>
            <span class="core-card-badge">COMMUNICATIONS</span>
          </div>
          <h2 class="core-card-title">10-Codes & Miranda Rights</h2>
          <p class="core-card-desc">Standard police 10-codes, status codes, NATO phonetic alphabet, and instant Miranda warning copy.</p>
          <div class="core-card-footer">
            <span>View Radio Codes</span>
            <span class="core-arrow">➜</span>
          </div>
        </a>

        <div class="core-card core-card-depts">
          <div class="core-card-header">
            <span class="core-card-icon">🛡️</span>
            <span class="core-card-badge">AGENCIES</span>
          </div>
          <h2 class="core-card-title">Department Protocols</h2>
          <p class="core-card-desc">Standard operating procedures, bodycam commands, and agency-specific field directives.</p>
          <div class="core-dept-pills">
            <a href="#/fib" class="core-dept-pill fib" data-nav="/fib">FIB</a>
            <a href="#/lspd" class="core-dept-pill lspd" data-nav="/lspd">LSPD</a>
            <a href="#/sahp" class="core-dept-pill sahp" data-nav="/sahp">SAHP</a>
            <a href="#/gov" class="core-dept-pill gov" data-nav="/gov">GOV</a>
            <a href="#/ng" class="core-dept-pill ng" data-nav="/ng">NG</a>
          </div>
        </div>
      </div>

      <div class="home-simple-roster-strip" id="home-roster-strip-btn">
        <div class="roster-strip-left">
          <span class="roster-strip-dot"></span>
          <span><strong>${onlineOfficersList.length} Active Officers Online</strong> broadcasting live presence</span>
        </div>
        <button type="button" class="btn-roster-strip-open">View Officer Roster & Feedback ➜</button>
      </div>
    </div>
  `;
}

function renderOrgPage(orgId) {
  const org = orgsData.find(o => o.id === orgId);
  if (!org) return renderNotFound();

  let activeSectionIndex = 0;
  let searchQuery = '';

  const content = `
    <div class="org-detail-container" style="--org-theme: ${org.color}; --org-theme-glow: ${org.glowColor};">
      <div class="org-hero-bar">
        <div class="org-hero-avatar" style="border-color: ${org.color}60; background: ${org.color}15;">
          ${orgMeta[org.id]?.iconName ? `<img src="Discord Icons/${orgMeta[org.id].iconName}.png" alt="${org.shortName}" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';" /><span style="display:none; color:${org.color}; font-size:24px; font-weight:bold;">${org.shortName}</span>` : `<span style="color:${org.color}; font-size:24px; font-weight:bold;">${org.shortName}</span>`}
        </div>
        <div class="org-hero-text">
          <div class="org-hero-topline">
            <span class="org-badge-pill" style="color:${org.color}; border-color:${org.color}50; background:${org.color}15;">DEPARTMENT DIRECTORY</span>
            <span class="org-badge-pill">${org.sections.length} Sections</span>
          </div>
          <h1 style="color: ${org.color}; text-shadow: 0 0 24px ${org.glowColor};">${escapeHTML(org.name)}</h1>
          <p class="org-hero-desc">${escapeHTML(orgMeta[org.id]?.description || '')}</p>
        </div>
      </div>

      <div class="org-controls-bar">
        <div class="org-search-box">
          ${icons.search}
          <input type="text" id="org-cmd-search" placeholder="Filter commands in ${org.shortName}..." />
        </div>
      </div>

      <div class="section-tabs-wrapper" id="section-tabs-container">
        ${org.sections.map((sec, idx) => `
          <button class="section-tab-btn ${idx === 0 ? 'active' : ''}" data-sec-idx="${idx}">
            <span>${escapeHTML(sec.title)}</span>
            <span class="tab-badge">${sec.groups.reduce((a, g) => a + g.commands.length, 0)}</span>
          </button>
        `).join('')}
      </div>

      <div class="command-content-area" id="command-content-area">
        
      </div>
    </div>
  `;

  setTimeout(() => {
    const tabsContainer = document.getElementById('section-tabs-container');
    const contentArea = document.getElementById('command-content-area');
    const searchInput = document.getElementById('org-cmd-search');

    function renderActiveSection() {
      const q = searchQuery.toLowerCase().trim();
      const currentSec = org.sections[activeSectionIndex] || org.sections[0];

      let groupsToRender = currentSec.groups;
      if (q) {
        
        groupsToRender = currentSec.groups.map(g => ({
          ...g,
          commands: g.commands.filter(c => c.text.toLowerCase().includes(q) || (c.note && c.note.toLowerCase().includes(q)))
        })).filter(g => g.commands.length > 0);
      }

      if (groupsToRender.length === 0) {
        contentArea.innerHTML = `
          <div class="empty-state-box">
            <p>No commands matched "<strong>${escapeHTML(q)}</strong>"</p>
            <span>Try clearing the search filter or switching tabs.</span>
          </div>
        `;
        return;
      }

      contentArea.innerHTML = groupsToRender.map(group => `
        <div class="cmd-group-block">
          <div class="cmd-group-header">
            <div class="group-bar" style="background-color: ${org.color};"></div>
            <h3 class="cmd-group-title" style="color: ${org.color};">${escapeHTML(group.title)}</h3>
            <span class="cmd-group-count">${group.commands.length} Commands</span>
          </div>

          <div class="cmd-grid">
            ${group.commands.map(cmd => `
              <div class="modern-cmd-card" data-copy-cmd="${escapeAttr(cmd.text)}" style="border-left-color: ${org.color}; cursor: pointer;" title="Click anywhere to copy command">
                <div class="cmd-card-main">
                  <div class="cmd-text-row">
                    <span class="cmd-prefix" style="color:${org.color};">❯</span>
                    <p class="cmd-text-content" data-raw-text="${escapeAttr(cmd.text)}">${highlightPlaceholders(cmd.text)}</p>
                  </div>
                  ${cmd.note ? `<div class="cmd-note-box">${escapeHTML(cmd.note)}</div>` : ''}
                </div>
                <div class="cmd-card-actions">
                  <button class="cmd-copy-trigger" data-copy-cmd="${escapeAttr(cmd.text)}" style="color: ${org.color}; border-color: ${org.color}40; background: ${org.color}10;">
                    <span class="copy-icon-slot">${icons.copy}</span>
                    <span class="copy-text-slot">COPY</span>
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `).join('');
    }

    if (contentArea) {
      contentArea.addEventListener('click', (e) => {
        const card = e.target.closest('[data-copy-cmd]');
        if (card) {
          const cmdText = card.dataset.copyCmd;
          copyToClipboard(cmdText, `${org.shortName}: Copied command!`);
        }
      });
    }

    if (tabsContainer) {
      tabsContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.section-tab-btn');
        if (!btn) return;
        playTacticalSound('click');
        activeSectionIndex = parseInt(btn.dataset.secIdx, 10);
        tabsContainer.querySelectorAll('.section-tab-btn').forEach((b, i) => {
          b.classList.toggle('active', i === activeSectionIndex);
        });
        renderActiveSection();
      });
    }

    if (searchInput) {
      searchInput.addEventListener('input', () => {
        searchQuery = searchInput.value;
        renderActiveSection();
      });
    }

    renderActiveSection();
  }, 0);

  return content;
}

function highlightPlaceholders(text) {
  if (!text) return '';
  
  const escaped = escapeHTML(text);
  return escaped.replace(/(\[[^\]]+\]|\bXYZ\b)/g, '<span class="cmd-param-tag">$1</span>');
}

function renderPenalCodes() {
  const content = `
    <div class="penal-page-container">
      <div class="penal-hero">
        <div class="penal-hero-badge">OFFICIAL DEPARTMENT OF JUSTICE REFERENCE</div>
        <h1 class="neon-heading">San Andreas Penal Codes</h1>
        <p class="penal-subtitle">Searchable codex of state offenses, statutory fines, incarceration terms, and wanted star ratings (EN3).</p>
      </div>

      <div class="penal-sticky-bar">
        <div class="penal-search-field">
          ${icons.search}
          <input type="text" id="penal-filter-input" placeholder="Search by penal code (§ 2.6.4), offense title, fine, or remark..." />
          <button class="clear-search-btn" id="clear-penal-search" style="display:none;">${icons.close}</button>
        </div>

        <div class="penal-category-pills" id="penal-cat-pills">
          <button class="cat-pill-btn active" data-cat="__all">ALL CATEGORIES</button>
          ${penalCategories.map(cat => {
            const color = categoryColors[cat.title] || '#00f0ff';
            return `<button class="cat-pill-btn" data-cat="${escapeAttr(cat.title)}" data-color="${color}">${escapeHTML(cat.title)}</button>`;
          }).join('')}
        </div>
      </div>

      <div id="penal-code-results-container">
        
      </div>
    </div>
  `;

  setTimeout(() => {
    let activeCategory = '__all';
    let activeTrafficHeading = '__all';
    const input = document.getElementById('penal-filter-input');
    const pillsContainer = document.getElementById('penal-cat-pills');
    const resultsContainer = document.getElementById('penal-code-results-container');
    const clearBtn = document.getElementById('clear-penal-search');

    function renderCodes() {
      const q = (input?.value || '').toLowerCase().trim();
      if (clearBtn) clearBtn.style.display = q ? 'block' : 'none';

      let filteredCats = penalCategories.map(cat => {
        const filteredCodes = cat.codes.filter(c => {
          if (activeCategory !== '__all' && cat.title !== activeCategory) return false;
          if (cat.title === 'Traffic Regulations' && activeTrafficHeading !== '__all' && c.heading !== activeTrafficHeading) return false;

          if (!q) return true;
          const haystack = `${c.code} ${c.heading || ''} ${c.description} ${c.fine || ''} ${c.sentence || ''} ${c.note || ''} ${c.class || ''}`.toLowerCase();
          return haystack.includes(q);
        });

        return { ...cat, codes: filteredCodes };
      }).filter(cat => cat.codes.length > 0);

      if (filteredCats.length === 0) {
        resultsContainer.innerHTML = `
          <div class="empty-state-box">
            <p>No penal codes matched "<strong>${escapeHTML(q)}</strong>"</p>
            <span>Check the search spelling or clear category filters.</span>
          </div>
        `;
        return;
      }

      resultsContainer.innerHTML = filteredCats.map(cat => {
        const color = categoryColors[cat.title] || '#00f0ff';

        return `
          <div class="penal-cat-section" style="--cat-color: ${color};">
            <div class="cat-section-header">
              <div class="cat-indicator" style="background-color: ${color}; box-shadow: 0 0 10px ${color};"></div>
              <div>
                <h2 class="cat-title" style="color: ${color};">${escapeHTML(cat.title)}</h2>
                <span class="cat-count-sub">${cat.codes.length} Statutes Recorded</span>
              </div>
            </div>

            ${cat.title === 'Traffic Regulations' ? renderTrafficHeadingFilter(cat, activeTrafficHeading, color) : ''}

            <div class="penal-table-card">
              <div class="table-header-row" style="border-bottom-color: ${color}30; background: ${color}08;">
                <div class="col-code">CODE</div>
                <div class="col-desc">OFFENSE DESCRIPTION & REMARKS</div>
                <div class="col-fine">FINE / BAIL</div>
                <div class="col-stars">WANTED</div>
                <div class="col-actions">ACTION</div>
              </div>

              <div class="table-rows-container">
                ${cat.codes.map((code, idx) => `
                  <div class="penal-table-row ${idx % 2 === 1 ? 'row-alt' : ''}" data-copy-penal="${escapeAttr(code.code + ' - ' + code.description)}" style="cursor: pointer;" title="Click anywhere to copy ${escapeAttr(code.code)}">
                    <div class="col-code">
                      <span class="code-badge" style="color: ${color}; border-color: ${color}40; background: ${color}12;">
                        ${escapeHTML(code.code)}
                      </span>
                      ${code.class ? `<span class="class-subtag">${escapeHTML(code.class)}</span>` : ''}
                    </div>

                    <div class="col-desc">
                      <p class="offense-title">${escapeHTML(code.description)}</p>
                      ${code.heading ? `<span class="offense-heading-badge">${escapeHTML(code.heading)}</span>` : ''}
                      ${code.note ? `<p class="offense-remarks">${escapeHTML(code.note)}</p>` : ''}
                    </div>

                    <div class="col-fine">
                      <span class="fine-val">${escapeHTML(code.fine || 'None')}</span>
                      ${code.sentence ? `<span class="sentence-val">${escapeHTML(code.sentence)}</span>` : ''}
                      ${code.noBail === "1" ? `<span class="nobail-badge">NO BAIL</span>` : ''}
                    </div>

                    <div class="col-stars">
                      ${code.stars > 0 ? `<span class="stars-rating" title="${code.stars} Stars">${'★'.repeat(code.stars)}</span>` : `<span class="stars-zero">—</span>`}
                    </div>

                    <div class="col-actions">
                      <button class="penal-row-copy-btn" data-copy-penal="${escapeAttr(code.code + ' - ' + code.description)}" title="Copy Offense">
                        ${icons.copy}
                      </button>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        `;
      }).join('');
    }

    function renderTrafficHeadingFilter(cat, currentHeading, color) {
      const headings = [...new Set(cat.codes.map(c => c.heading || 'General Traffic'))];
      return `
        <div class="traffic-subfilter-bar">
          <span class="subfilter-lbl">SUB-SECTION:</span>
          <button class="traffic-tab-btn ${currentHeading === '__all' ? 'active' : ''}" data-traffic-heading="__all">ALL</button>
          ${headings.map(h => `
            <button class="traffic-tab-btn ${currentHeading === h ? 'active' : ''}" data-traffic-heading="${escapeAttr(h)}">${escapeHTML(h)}</button>
          `).join('')}
        </div>
      `;
    }

    if (pillsContainer) {
      pillsContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.cat-pill-btn');
        if (!btn) return;
        playTacticalSound('click');
        activeCategory = btn.dataset.cat;
        pillsContainer.querySelectorAll('.cat-pill-btn').forEach(b => {
          b.classList.toggle('active', b.dataset.cat === activeCategory);
        });
        renderCodes();
      });
    }

    if (resultsContainer) {
      resultsContainer.addEventListener('click', (e) => {
        const subTab = e.target.closest('.traffic-tab-btn');
        if (subTab) {
          playTacticalSound('click');
          activeTrafficHeading = subTab.dataset.trafficHeading;
          renderCodes();
          return;
        }

        const row = e.target.closest('[data-copy-penal]');
        if (row) {
          const text = row.dataset.copyPenal;
          copyToClipboard(text, `Penal Code copied: ${text}`);
        }
      });
    }

    if (input) {
      input.addEventListener('input', renderCodes);
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        input.value = '';
        renderCodes();
        input.focus();
      });
    }

    renderCodes();
  }, 0);

  return content;
}

function renderCalculatorPage() {
  const allPenalCodes = [];
  penalCategories.forEach(cat => {
    cat.codes.forEach(c => {
      allPenalCodes.push({ ...c, categoryTitle: cat.title });
    });
  });

  const registeredOfficer = getRegisteredOfficer();
  const savedActiveOrg = getActiveOfficerOrg();

  const content = `
    <div class="calc-page-container">
      <div class="calc-header">
        <div class="hero-badge">OFFICIAL LAW ENFORCEMENT CITATION & ARREST SUITE</div>
        <h1 class="neon-heading">Department Arrest & Citation Center</h1>
        <p class="penal-subtitle">Official EN3 penal citation & arrest calculator. All logs and submissions are strictly bound to your active department.</p>
      </div>

      <div class="org-selector-banner ${registeredOfficer.isRegistered ? 'org-selector-locked' : ''}">
        <div class="org-selector-label">
          ${icons.shield}
          <span>${registeredOfficer.isRegistered ? `ACTIVE DEPARTMENT (LOCKED TO ${registeredOfficer.dept}):` : 'SELECT ACTIVE DEPARTMENT:'}</span>
        </div>
        <div class="org-selector-pills" id="calc-org-selector">
          ${[
            { id: 'fib', name: 'FIB', color: '#ef4444' },
            { id: 'lspd', name: 'LSPD', color: '#3b82f6' },
            { id: 'sahp', name: 'SAHP', color: '#f59e0b' },
            { id: 'gov', name: 'GOV / USSS', color: '#8b5cf6' },
            { id: 'ng', name: 'NG (ARMY)', color: '#10b981' }
          ].map(o => {
            const isActive = savedActiveOrg === o.id;
            return `
              <button class="org-choice-pill ${isActive ? 'active' : (registeredOfficer.isRegistered ? 'disabled-locked' : '')}" data-org="${o.id}" style="--org-clr: ${o.color};" ${registeredOfficer.isRegistered && !isActive ? 'title="Department bound to ' + registeredOfficer.dept + '. Transfer via Officer Profile."' : ''}>
                <span class="org-dot" style="background:${o.color};"></span>
                <span>${o.name}</span>
                ${isActive && registeredOfficer.isRegistered ? '<span class="org-bound-chip">🔒 BOUND</span>' : ''}
              </button>
            `;
          }).join('')}
        </div>
        ${registeredOfficer.isRegistered ? `
          <button type="button" class="btn-change-dept-profile" id="btn-calc-change-dept" title="Change active department or transfer agency in your Profile">
            <span>Transfer Dept in Profile ✎</span>
          </button>
        ` : ''}
      </div>

      
      <div class="dept-stats-dashboard" id="dept-stats-dashboard">
        
      </div>

      
      <div class="calc-mode-bar">
        <button class="calc-mode-btn active" id="mode-btn-arrest">
          ${icons.scale}
          <span>🚔 PENAL ARREST & SENTENCE CALCULATOR</span>
        </button>
        <button class="calc-mode-btn" id="mode-btn-ticket">
          ${icons.fileText}
          <span>🛑 VEHICLE TRAFFIC CITATION & TICKET</span>
        </button>
      </div>

      
      <div class="calc-layout-grid">
        <div class="calc-selection-panel">
          <div class="calc-panel-bar">
            <div class="calc-search-box">
              ${icons.search}
              <input type="text" id="calc-offense-search" placeholder="Search offenses to add (e.g. TC 3.2, Speeding, Red Light, Parking, DUI)..." />
            </div>
            <div class="calc-category-filter-strip" id="calc-category-filter-strip">
              
            </div>
          </div>

          <div class="offense-picker-list" id="offense-picker-list">
            
          </div>
        </div>

        <div class="calc-summary-panel">
          <div class="summary-card">
            <div class="summary-card-header">
              <h3 id="summary-card-title">ARREST SUMMARY & RECORD</h3>
              <button class="clear-all-charges-btn" id="clear-charges-btn">Reset</button>
            </div>

            <div class="summary-stats-grid" id="summary-stats-grid">
              <div class="summary-stat-box">
                <span class="stat-label">TOTAL FINES</span>
                <span class="stat-value-big text-amber" id="calc-total-fine">$0</span>
              </div>
              <div class="summary-stat-box">
                <span class="stat-label" id="stat-lbl-time">TOTAL TIME</span>
                <span class="stat-value-big text-cyan" id="calc-total-months">0 Mo</span>
              </div>
              <div class="summary-stat-box">
                <span class="stat-label" id="stat-lbl-extra">WANTED LEVEL</span>
                <span class="stat-value-big text-red" id="calc-total-stars">—</span>
              </div>
              <div class="summary-stat-box">
                <span class="stat-label">BAIL STATUS</span>
                <span class="stat-value-status text-green" id="calc-bail-status">ELIGIBLE</span>
              </div>
            </div>

            
            <div class="star-override-strip" id="star-override-strip">
              <span class="star-strip-lbl">WANTED STARS:</span>
              <button class="star-pick-btn active" data-stars="auto">AUTO</button>
              <button class="star-pick-btn" data-stars="1">★ 1</button>
              <button class="star-pick-btn" data-stars="2">★ 2</button>
              <button class="star-pick-btn" data-stars="3">★ 3</button>
              <button class="star-pick-btn" data-stars="4">★ 4</button>
              <button class="star-pick-btn star-pick-btn--max" data-stars="5">★ 5 MAX</button>
            </div>

            <div class="selected-charges-list" id="selected-charges-list">
              <div class="no-charges-placeholder">No items selected. Click offenses on the left to add charges.</div>
            </div>

            <div class="officer-meta-inputs">
              <div class="input-row">
                <div class="input-row-header-flex">
                  <label>Incident Date & Time (EN3 Time):</label>
                  <button type="button" class="btn-sync-time-small" id="btn-sync-calc-time" title="Sync live GrandRP EN3 server time">⚡ Sync EN3</button>
                </div>
                <input type="text" id="incident-datetime-input" placeholder="e.g. 25 Aug 2026 · 12:20 GMT+1" />
              </div>
              <div class="input-row">
                <label>Arresting Unit / Badge:</label>
                <input type="text" id="officer-badge-input" placeholder="e.g. FIB Agent 42 / LSPD Unit 104" />
              </div>
              <div class="input-row">
                <label id="suspect-label">Suspect ID / Name:</label>
                <input type="text" id="suspect-id-input" placeholder="e.g. ID #12849 / John Doe" />
              </div>
              <div class="input-row" id="plate-input-row" style="display:none;">
                <label>Vehicle Plate / Model:</label>
                <input type="text" id="vehicle-plate-input" placeholder="e.g. 88ABC123 / Pegassi Toros" />
              </div>
            </div>

            
            <div class="calc-preview-card">
              <div class="calc-preview-header">
                <div class="calc-preview-title">
                  ${icons.fileText}
                  <span id="calc-preview-label">LIVE DISCORD FORMAT PREVIEW</span>
                </div>
                <button type="button" class="btn-fast-copy-calc" id="btn-fast-copy-calc" title="Copy raw Discord report format">
                  ${icons.copy} Fast Copy Format
                </button>
              </div>
              <pre class="calc-markdown-preview" id="calc-markdown-preview">Select offenses on the left to generate live Discord arrest report...</pre>
            </div>

            <div class="report-actions">
              <button class="generate-report-btn" id="submit-and-copy-btn">
                ${icons.copy} SUBMIT & COPY DISCORD ARREST REPORT
              </button>
            </div>
          </div>
        </div>
      </div>

      
      <div class="dept-ledger-section">
        <div class="dept-ledger-header">
          <div class="dept-ledger-title">
            ${icons.fileText}
            <div>
              <h2>Department Record Ledger</h2>
              <p>Chronological record of submitted arrests and issued citations</p>
            </div>
          </div>
          <div class="dept-ledger-filters">
            <div class="ledger-filter-group" id="ledger-org-filter">
              <button class="ledger-filter-btn active" data-filter-org="__all">ALL ORGS</button>
              <button class="ledger-filter-btn" data-filter-org="lspd">LSPD</button>
              <button class="ledger-filter-btn" data-filter-org="sahp">SAHP</button>
              <button class="ledger-filter-btn" data-filter-org="fib">FIB</button>
              <button class="ledger-filter-btn" data-filter-org="gov">GOV</button>
              <button class="ledger-filter-btn" data-filter-org="ng">NG</button>
            </div>
            <button class="clear-ledger-btn" id="clear-ledger-btn">Clear Logs</button>
          </div>
        </div>

        <div class="dept-ledger-content" id="dept-ledger-content">
          
        </div>
      </div>
    </div>
  `;

  setTimeout(() => {
    let currentMode = 'arrest'; 
    let currentActiveOrg = getActiveOfficerOrg();
    let selectedSet = new Set();
    let ledgerFilterOrg = '__all';
    let customWantedStars = null; 

    const orgPills = document.querySelectorAll('.org-choice-pill');
    const modeBtnArrest = document.getElementById('mode-btn-arrest');
    const modeBtnTicket = document.getElementById('mode-btn-ticket');
    const searchInput = document.getElementById('calc-offense-search');
    const pickerList = document.getElementById('offense-picker-list');
    const chargesList = document.getElementById('selected-charges-list');
    const clearBtn = document.getElementById('clear-charges-btn');
    const submitBtn = document.getElementById('submit-and-copy-btn');
    const officerInput = document.getElementById('officer-badge-input');
    const suspectInput = document.getElementById('suspect-id-input');
    const plateInput = document.getElementById('vehicle-plate-input');
    const plateRow = document.getElementById('plate-input-row');
    const suspectLbl = document.getElementById('suspect-label');
    const summaryTitle = document.getElementById('summary-card-title');
    const statLblTime = document.getElementById('stat-lbl-time');
    const statLblExtra = document.getElementById('stat-lbl-extra');
    const statsContainer = document.getElementById('dept-stats-dashboard');
    const ledgerContainer = document.getElementById('dept-ledger-content');
    const ledgerFilterBar = document.getElementById('ledger-org-filter');
    const clearLedgerBtn = document.getElementById('clear-ledger-btn');
    const starStrip = document.getElementById('star-override-strip');

    function renderDepartmentStats() {
      const stats = calculateDepartmentStats();
      const orgColors = { lspd: '#3b82f6', sahp: '#f59e0b', fib: '#ef4444', gov: '#8b5cf6', ng: '#10b981' };

      statsContainer.innerHTML = `
        <div class="dept-stat-card dept-stat-card--global">
          <div class="stat-badge-top">TOTAL LOGGED</div>
          <div class="stat-numbers-row">
            <div>
              <span class="stat-num-value text-blue">${stats.global.totalArrests}</span>
              <span class="stat-num-sub">ARRESTS</span>
            </div>
            <div class="stat-divider-v"></div>
            <div>
              <span class="stat-num-value text-amber">${stats.global.totalTickets}</span>
              <span class="stat-num-sub">CITATIONS</span>
            </div>
            <div class="stat-divider-v"></div>
            <div>
              <span class="stat-num-value text-green">$${(stats.global.totalFines / 1000).toFixed(0)}k</span>
              <span class="stat-num-sub">TOTAL FINES</span>
            </div>
          </div>
        </div>

        ${['lspd', 'sahp', 'fib', 'gov', 'ng'].map(o => {
          const oStat = stats.byOrg[o] || { arrests: 0, tickets: 0, fines: 0 };
          const isSelected = currentActiveOrg === o;
          return `
            <div class="dept-stat-card ${isSelected ? 'active-org-card' : ''}" style="--dept-color: ${orgColors[o]};">
              <div class="stat-card-dept-name" style="color: ${orgColors[o]};">
                <span class="dept-badge-dot" style="background: ${orgColors[o]};"></span>
                <span>${o.toUpperCase()}</span>
                ${isSelected ? '<span class="active-badge-tag">ACTIVE</span>' : ''}
              </div>
              <div class="stat-card-row">
                <span class="stat-card-label">Arrests:</span>
                <span class="stat-card-val font-bold">${oStat.arrests}</span>
              </div>
              <div class="stat-card-row">
                <span class="stat-card-label">Tickets:</span>
                <span class="stat-card-val font-bold">${oStat.tickets}</span>
              </div>
              <div class="stat-card-row">
                <span class="stat-card-label">Fines:</span>
                <span class="stat-card-val text-amber font-mono">$${oStat.fines.toLocaleString()}</span>
              </div>
            </div>
          `;
        }).join('')}
      `;
    }

    function renderLedger() {
      const logs = getAllLogs();
      const filtered = logs.filter(l => {
        if (ledgerFilterOrg !== '__all' && l.org !== ledgerFilterOrg) return false;
        return true;
      });

      if (filtered.length === 0) {
        ledgerContainer.innerHTML = `
          <div class="empty-ledger-state">
            ${icons.fileText}
            <p>No records logged yet${ledgerFilterOrg !== '__all' ? ' for ' + ledgerFilterOrg.toUpperCase() : ''}. Submitting an arrest or ticket will record it here automatically.</p>
          </div>
        `;
        return;
      }

      ledgerContainer.innerHTML = `
        <div class="ledger-table-wrap">
          <table class="ledger-table">
            <thead>
              <tr>
                <th>TIME</th>
                <th>DEPT</th>
                <th>TYPE</th>
                <th>OFFICER / BADGE</th>
                <th>SUSPECT / DRIVER</th>
                <th>CHARGES / VIOLATIONS</th>
                <th>TOTAL FINE</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              ${filtered.map(l => `
                <tr>
                  <td class="cell-time">${escapeHTML(l.dateStr)}</td>
                  <td><span class="dept-tag dept-tag--${escapeAttr(l.org)}">${escapeHTML(l.org.toUpperCase())}</span></td>
                  <td><span class="type-pill type-pill--${escapeAttr(l.type)}">${escapeHTML(l.type.toUpperCase())}</span></td>
                  <td class="font-medium">${escapeHTML(l.officer)}</td>
                  <td>${escapeHTML(l.suspect)}${l.plate ? ' (' + escapeHTML(l.plate) + ')' : ''}</td>
                  <td class="cell-charges">${escapeHTML(l.chargesSummary ? l.chargesSummary.join(', ') : (l.chargesCount + ' items'))}</td>
                  <td class="font-mono text-amber font-bold">$${l.totalFine.toLocaleString()}</td>
                  <td class="cell-actions">
                    <button class="ledger-copy-btn" data-recopy-id="${escapeAttr(l.id)}" title="Copy Discord Report">
                      ${icons.copy} Copy
                    </button>
                    <button class="ledger-delete-btn" data-delete-id="${escapeAttr(l.id)}" title="Delete Entry">
                      ${icons.close}
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    }

    function updateCalculations() {
      if (currentMode === 'arrest') {
        const selectedItems = allPenalCodes.filter(c => selectedSet.has(c.code));
        const res = calculateCharges(selectedItems, customWantedStars);

        document.getElementById('calc-total-fine').textContent = `$${res.totalFine.toLocaleString()}`;
        document.getElementById('calc-total-months').textContent = `${res.totalMonths} Mo`;
        
        const starsEl = document.getElementById('calc-total-stars');
        if (res.maxStars >= 5) {
          starsEl.textContent = '★★★★★ (MAX)';
          starsEl.className = 'stat-value-big text-red';
        } else if (res.maxStars > 0) {
          starsEl.textContent = `${'★'.repeat(res.maxStars)} (${res.maxStars})`;
          starsEl.className = 'stat-value-big text-amber';
        } else {
          starsEl.textContent = '—';
          starsEl.className = 'stat-value-big text-red';
        }

        const bailEl = document.getElementById('calc-bail-status');
        if (res.hasNoBail) {
          bailEl.textContent = 'NO BAIL';
          bailEl.className = 'stat-value-status text-red';
        } else {
          bailEl.textContent = 'ELIGIBLE';
          bailEl.className = 'stat-value-status text-green';
        }

        if (selectedItems.length === 0) {
          chargesList.innerHTML = `<div class="no-charges-placeholder">No offenses selected. Click offenses on the left to add charges.</div>`;
        } else {
          chargesList.innerHTML = selectedItems.map(item => `
            <div class="selected-charge-pill">
              <div>
                <span class="charge-code">${escapeHTML(item.code)}</span>
                <span class="charge-name">${escapeHTML(item.description)}</span>
                <span class="charge-sub">(${escapeHTML(item.fine)}${item.sentence ? ' · ' + escapeHTML(item.sentence) : ''})</span>
              </div>
              <button class="remove-charge-btn" data-remove-code="${escapeAttr(item.code)}">${icons.close}</button>
            </div>
          `).join('');
        }
      } else {
        
        const selectedItems = TRAFFIC_VIOLATIONS.filter(v => selectedSet.has(v.code));
        let totalFine = 0;
        let totalPoints = 0;

        selectedItems.forEach(v => {
          totalFine += parseFine(v.fine);
          totalPoints += (v.points || 1);
        });

        document.getElementById('calc-total-fine').textContent = `$${totalFine.toLocaleString()}`;
        document.getElementById('calc-total-months').textContent = `${totalPoints} Pts`;
        document.getElementById('calc-total-stars').textContent = 'Traffic';
        document.getElementById('calc-bail-status').textContent = 'DMV CITED';
        document.getElementById('calc-bail-status').className = 'stat-value-status text-amber';

        if (selectedItems.length === 0) {
          chargesList.innerHTML = `<div class="no-charges-placeholder">No traffic violations selected. Click violations on the left.</div>`;
        } else {
          chargesList.innerHTML = selectedItems.map(item => `
            <div class="selected-charge-pill">
              <div>
                <span class="charge-code">${escapeHTML(item.code)}</span>
                <span class="charge-name">${escapeHTML(item.title || item.description)}</span>
                <span class="charge-sub">(${escapeHTML(item.fine)} · +${item.points || 1} Pt)</span>
              </div>
              <button class="remove-charge-btn" data-remove-code="${escapeAttr(item.code)}">${icons.close}</button>
            </div>
          `).join('');
        }
      }

      
      const previewEl = document.getElementById('calc-markdown-preview');
      const officerBadge = officerInput?.value.trim() || `${currentActiveOrg.toUpperCase()} Officer`;
      const suspectName = suspectInput?.value.trim() || (currentMode === 'arrest' ? 'Suspect Name / ID' : 'Driver Name / ID');
      const plateNumber = plateInput?.value.trim() || '88ABC123';
      const customIncidentTime = incidentDateTimeInput?.value.trim() || null;

      if (currentMode === 'arrest') {
        const selectedItems = allPenalCodes.filter(c => selectedSet.has(c.code));
        if (selectedItems.length > 0) {
          const data = calculateCharges(selectedItems, customWantedStars);
          if (previewEl) {
            previewEl.textContent = generateDiscordReport(data, {
              org: currentActiveOrg,
              badge: officerBadge,
              suspect: suspectName,
              customDate: customIncidentTime
            });
          }
        } else {
          if (previewEl) previewEl.textContent = 'Select offenses on the left to generate live Discord arrest report...';
        }
      } else {
        const selectedItems = TRAFFIC_VIOLATIONS.filter(v => selectedSet.has(v.code));
        if (selectedItems.length > 0) {
          let totalFine = 0;
          let totalPoints = 0;
          selectedItems.forEach(v => {
            totalFine += parseFine(v.fine);
            totalPoints += (v.points || 1);
          });
          if (previewEl) {
            previewEl.textContent = generateTicketReport({
              violations: selectedItems,
              totalFine,
              totalPoints
            }, {
              org: currentActiveOrg,
              badge: officerBadge,
              suspect: suspectName,
              plate: plateNumber,
              customDate: customIncidentTime
            });
          }
        } else {
          if (previewEl) previewEl.textContent = 'Select traffic violations on the left to generate live Discord citation report...';
        }
      }

      renderPicker();
    }

    let currentCategoryFilter = '__all';

    const categoryStrip = document.getElementById('calc-category-filter-strip');

    function renderCategoryFilters() {
      if (!categoryStrip) return;
      let cats = [];
      if (currentMode === 'arrest') {
        cats = ['__all', 'Crimes Against Society', 'Crimes Against the State', 'Malfeasance', 'Traffic Regulations'];
      } else {
        cats = ['__all', 'Driving Conduct', 'Parking Violations', 'Speeding', 'Special Zones', 'Vehicle Compliance', 'Road Conduct'];
      }

      categoryStrip.innerHTML = cats.map(c => `
        <button class="calc-cat-chip ${currentCategoryFilter === c ? 'active' : ''}" data-calc-cat="${escapeAttr(c)}">
          ${c === '__all' ? 'ALL' : escapeHTML(c)}
        </button>
      `).join('');
    }

    categoryStrip?.addEventListener('click', (e) => {
      const chip = e.target.closest('[data-calc-cat]');
      if (!chip) return;
      playTacticalSound('click');
      currentCategoryFilter = chip.dataset.calcCat;
      renderCategoryFilters();
      renderPicker();
    });

    function renderPicker() {
      const q = (searchInput?.value || '').toLowerCase().trim();
      const qClean = q.replace(/[\.\s\-]/g, '');

      if (currentMode === 'arrest') {
        let filtered = allPenalCodes;
        if (currentCategoryFilter !== '__all') {
          filtered = filtered.filter(c => c.categoryTitle === currentCategoryFilter);
        }
        if (q) {
          filtered = filtered.filter(c => {
            const codeClean = c.code.toLowerCase().replace(/[\.\s\-]/g, '');
            return `${c.code} ${c.description} ${c.categoryTitle} ${c.fine} ${c.note || ''}`.toLowerCase().includes(q) ||
                   codeClean.includes(qClean);
          });
        }

        if (filtered.length === 0) {
          pickerList.innerHTML = `<div class="empty-picker-state"><p>No offenses found matching "<strong>${escapeHTML(q)}</strong>"</p><span>Try searching for "TC", "speed", "robbery", "murder", or "weapon"</span></div>`;
          return;
        }

        pickerList.innerHTML = filtered.map(c => {
          const isChecked = selectedSet.has(c.code);
          return `
            <div class="offense-picker-item ${isChecked ? 'selected' : ''}" data-toggle-code="${escapeAttr(c.code)}">
              <div class="picker-checkbox">${isChecked ? icons.check : ''}</div>
              <div class="picker-details">
                <div class="picker-top">
                  <span class="picker-code">${escapeHTML(c.code)}</span>
                  <span class="picker-fine">${escapeHTML(c.fine)}</span>
                </div>
                <div class="picker-desc">${escapeHTML(c.description)}</div>
                <div class="picker-sub">${escapeHTML(c.categoryTitle)}${c.sentence ? ' · ' + escapeHTML(c.sentence) : ''}</div>
              </div>
            </div>
          `;
        }).join('');
      } else {
        
        let filtered = TRAFFIC_VIOLATIONS;
        if (currentCategoryFilter !== '__all') {
          filtered = filtered.filter(v => v.category === currentCategoryFilter);
        }
        if (q) {
          filtered = filtered.filter(v => {
            const codeClean = v.code.toLowerCase().replace(/[\.\s\-]/g, '');
            return `${v.code} ${v.title} ${v.category} ${v.fine}`.toLowerCase().includes(q) ||
                   codeClean.includes(qClean);
          });
        }

        if (filtered.length === 0) {
          pickerList.innerHTML = `<div class="empty-picker-state"><p>No traffic violations found matching "<strong>${escapeHTML(q)}</strong>"</p><span>Try searching for "TC", "TC 3.2", "speed", "parking", "red light", or "DUI"</span></div>`;
          return;
        }

        pickerList.innerHTML = filtered.map(v => {
          const isChecked = selectedSet.has(v.code);
          return `
            <div class="offense-picker-item ${isChecked ? 'selected' : ''}" data-toggle-code="${escapeAttr(v.code)}">
              <div class="picker-checkbox">${isChecked ? icons.check : ''}</div>
              <div class="picker-details">
                <div class="picker-top">
                  <span class="picker-code">${escapeHTML(v.code)}</span>
                  <span class="picker-fine">${escapeHTML(v.fine)}</span>
                </div>
                <div class="picker-desc">${escapeHTML(v.title)}</div>
                <div class="picker-sub">${escapeHTML(v.category)} · +${v.points || 1} Penalty Points</div>
              </div>
            </div>
          `;
        }).join('');
      }
    }

    
    starStrip?.addEventListener('click', (e) => {
      const btn = e.target.closest('.star-pick-btn');
      if (!btn) return;
      playTacticalSound('click');
      const val = btn.dataset.stars;
      if (val === 'auto') {
        customWantedStars = null;
      } else {
        customWantedStars = parseInt(val, 10);
      }
      starStrip.querySelectorAll('.star-pick-btn').forEach(b => b.classList.toggle('active', b === btn));
      updateCalculations();
    });

    
    const changeDeptBtn = document.getElementById('btn-calc-change-dept');
    changeDeptBtn?.addEventListener('click', () => {
      playTacticalSound('click');
      promptOfficerLoginModal(() => {
        render();
      });
    });

    orgPills.forEach(pill => {
      pill.addEventListener('click', () => {
        if (registeredOfficer.isRegistered) {
          const targetOrg = pill.dataset.org;
          if (targetOrg !== currentActiveOrg) {
            showToast(`Department is bound to ${registeredOfficer.dept}. Transfer agency in Officer Profile.`, 'info');
            promptOfficerLoginModal(() => {
              render();
            });
            return;
          }
        }
        playTacticalSound('click');
        currentActiveOrg = pill.dataset.org;
        setActiveOfficerOrg(currentActiveOrg);
        orgPills.forEach(p => p.classList.toggle('active', p.dataset.org === currentActiveOrg));
        renderDepartmentStats();
        showToast(`Active Department: ${currentActiveOrg.toUpperCase()}`, 'info');
      });
    });

    
    modeBtnArrest.addEventListener('click', () => {
      if (currentMode === 'arrest') return;
      playTacticalSound('click');
      currentMode = 'arrest';
      currentCategoryFilter = '__all';
      modeBtnArrest.classList.add('active');
      modeBtnTicket.classList.remove('active');
      summaryTitle.textContent = 'ARREST SUMMARY & RECORD';
      statLblTime.textContent = 'TOTAL TIME';
      statLblExtra.textContent = 'WANTED LEVEL';
      suspectLbl.textContent = 'Suspect ID / Name:';
      plateRow.style.display = 'none';
      if (starStrip) starStrip.style.display = 'flex';
      submitBtn.innerHTML = `${icons.copy} SUBMIT & COPY DISCORD ARREST REPORT`;
      selectedSet.clear();
      renderCategoryFilters();
      updateCalculations();
    });

    modeBtnTicket.addEventListener('click', () => {
      if (currentMode === 'ticket') return;
      playTacticalSound('click');
      currentMode = 'ticket';
      currentCategoryFilter = '__all';
      modeBtnTicket.classList.add('active');
      modeBtnArrest.classList.remove('active');
      summaryTitle.textContent = 'TRAFFIC CITATION & TICKET';
      statLblTime.textContent = 'PENALTY POINTS';
      statLblExtra.textContent = 'VIOLATION CLASS';
      suspectLbl.textContent = 'Driver ID / Name:';
      plateRow.style.display = 'block';
      if (starStrip) starStrip.style.display = 'none';
      submitBtn.innerHTML = `${icons.copy} ISSUE TICKET & COPY CITATION REPORT`;
      selectedSet.clear();
      renderCategoryFilters();
      updateCalculations();
    });

    pickerList.addEventListener('click', (e) => {
      const item = e.target.closest('[data-toggle-code]');
      if (!item) return;
      playTacticalSound('click');
      const code = item.dataset.toggleCode;
      if (selectedSet.has(code)) {
        selectedSet.delete(code);
      } else {
        selectedSet.add(code);
      }
      updateCalculations();
    });

    chargesList.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-remove-code]');
      if (!btn) return;
      playTacticalSound('click');
      selectedSet.delete(btn.dataset.removeCode);
      updateCalculations();
    });

    clearBtn?.addEventListener('click', () => {
      playTacticalSound('click');
      selectedSet.clear();
      updateCalculations();
    });

    searchInput?.addEventListener('input', renderPicker);

    const incidentDateTimeInput = document.getElementById('incident-datetime-input');
    const syncCalcTimeBtn = document.getElementById('btn-sync-calc-time');

    const registeredOfficer = getRegisteredOfficer();
    if (officerInput && registeredOfficer.isRegistered && !officerInput.value) {
      officerInput.value = `${registeredOfficer.dept} · ${registeredOfficer.name} (#${registeredOfficer.badgeNo})`;
    }

    if (incidentDateTimeInput) {
      incidentDateTimeInput.value = getGrandRPEN3DateTime().dateTimeFull;
    }

    syncCalcTimeBtn?.addEventListener('click', () => {
      playTacticalSound('click');
      const en3 = getGrandRPEN3DateTime();
      if (incidentDateTimeInput) incidentDateTimeInput.value = en3.dateTimeFull;
      updateCalculations();
      showToast(`Synced to EN3 Time: ${en3.dateTimeFull}`, 'success');
    });

    
    officerInput?.addEventListener('input', updateCalculations);
    suspectInput?.addEventListener('input', updateCalculations);
    plateInput?.addEventListener('input', updateCalculations);
    incidentDateTimeInput?.addEventListener('input', updateCalculations);

    
    const fastCopyBtn = document.getElementById('btn-fast-copy-calc');
    fastCopyBtn?.addEventListener('click', () => {
      const previewEl = document.getElementById('calc-markdown-preview');
      const text = previewEl?.textContent || '';
      if (!text || text.startsWith('Select')) {
        showToast(currentMode === 'arrest' ? 'Please select at least one offense first' : 'Please select at least one traffic violation first', 'info');
        return;
      }
      copyToClipboard(text, `${currentMode === 'arrest' ? 'Arrest' : 'Citation'} Discord format copied to clipboard!`);
    });

    
    submitBtn?.addEventListener('click', () => {
      if (selectedSet.size === 0) {
        showToast(currentMode === 'arrest' ? 'Please select at least one offense first' : 'Please select at least one traffic violation first', 'info');
        return;
      }

      const officerBadge = officerInput?.value.trim() || `${currentActiveOrg.toUpperCase()} Officer`;
      const suspectName = suspectInput?.value.trim() || 'Unknown Subject';
      const plateNumber = plateInput?.value.trim() || 'Unregistered';
      const customIncidentTime = incidentDateTimeInput?.value.trim() || null;

      if (currentMode === 'arrest') {
        const selectedItems = allPenalCodes.filter(c => selectedSet.has(c.code));
        const data = calculateCharges(selectedItems, customWantedStars);
        const report = generateDiscordReport(data, {
          org: currentActiveOrg,
          badge: officerBadge,
          suspect: suspectName,
          customDate: customIncidentTime
        });

        
        addLogEntry({
          org: currentActiveOrg,
          type: 'arrest',
          officer: officerBadge,
          suspect: suspectName,
          chargesCount: selectedItems.length,
          chargesSummary: selectedItems.map(c => c.code),
          totalFine: data.totalFine,
          totalMonths: data.totalMonths,
          noBail: data.hasNoBail,
          rawReport: report
        });

        copyToClipboard(report, `Arrest logged for ${currentActiveOrg.toUpperCase()} & Report copied!`);
      } else {
        const selectedItems = TRAFFIC_VIOLATIONS.filter(v => selectedSet.has(v.code));
        let totalFine = 0;
        let totalPoints = 0;
        selectedItems.forEach(v => {
          totalFine += parseFine(v.fine);
          totalPoints += (v.points || 1);
        });

        const report = generateTicketReport({
          violations: selectedItems,
          totalFine,
          totalPoints
        }, {
          org: currentActiveOrg,
          badge: officerBadge,
          suspect: suspectName,
          plate: plateNumber,
          customDate: customIncidentTime
        });

        
        addLogEntry({
          org: currentActiveOrg,
          type: 'ticket',
          officer: officerBadge,
          suspect: suspectName,
          plate: plateNumber,
          chargesCount: selectedItems.length,
          chargesSummary: selectedItems.map(v => v.code),
          totalFine,
          totalPoints,
          rawReport: report
        });

        copyToClipboard(report, `Citation logged for ${currentActiveOrg.toUpperCase()} & Report copied!`);
      }

      renderDepartmentStats();
      renderLedger();
    });

    
    ledgerFilterBar?.addEventListener('click', (e) => {
      const btn = e.target.closest('.ledger-filter-btn');
      if (!btn) return;
      playTacticalSound('click');
      ledgerFilterOrg = btn.dataset.filterOrg;
      ledgerFilterBar.querySelectorAll('.ledger-filter-btn').forEach(b => b.classList.toggle('active', b === btn));
      renderLedger();
    });

    ledgerContainer?.addEventListener('click', (e) => {
      const recopyBtn = e.target.closest('[data-recopy-id]');
      if (recopyBtn) {
        const id = recopyBtn.dataset.recopyId;
        const item = getAllLogs().find(l => l.id === id);
        if (item && item.rawReport) {
          copyToClipboard(item.rawReport, 'Report format re-copied to clipboard!');
        }
        return;
      }

      const delBtn = e.target.closest('[data-delete-id]');
      if (delBtn) {
        const id = delBtn.dataset.deleteId;
        deleteLogEntry(id);
        playTacticalSound('click');
        showToast('Record removed from ledger', 'info');
        renderDepartmentStats();
        renderLedger();
      }
    });

    clearLedgerBtn?.addEventListener('click', () => {
      if (confirm('Clear all recorded department logs and arrest history?')) {
        clearAllLogs();
        playTacticalSound('click');
        showToast('Ledger cleared', 'info');
        renderDepartmentStats();
        renderLedger();
      }
    });

    renderDepartmentStats();
    renderCategoryFilters();
    renderPicker();
    renderLedger();
  }, 0);

  return content;
}

function renderCheatsheetPage() {
  const content = `
    <div class="cheatsheet-page-container">
      <div class="cheatsheet-header">
        <div class="hero-badge">STANDARD OPERATING PROTOCOLS</div>
        <h1 class="neon-heading">10-Codes & Miranda Rights</h1>
        <p class="penal-subtitle">Instant 1-click copy for official Miranda warnings, standard 10-Codes, emergency response codes, and NATO phonetic alphabet.</p>
      </div>

      
      <div class="cheatsheet-section-title-wrap">
        <div class="section-title-icon">⚖️</div>
        <div>
          <h2 class="section-title-main">Miranda Warnings</h2>
          <p class="section-title-sub">Click anywhere on the card to copy verbatim Miranda Rights speech</p>
        </div>
      </div>

      <div class="miranda-cards-grid">
        <div class="protocol-card protocol-card--highlight" data-copy-miranda="standard" style="cursor: pointer;" title="Click anywhere to copy Standard Miranda">
          <div class="protocol-card-header">
            <h3>STANDARD MIRANDA WARNING</h3>
            <button class="copy-action-btn" data-copy-miranda="standard">${icons.copy} COPY</button>
          </div>
          <blockquote class="miranda-quote">
            "${escapeHTML(mirandaRights.standard)}"
          </blockquote>
        </div>

        <div class="protocol-card" data-copy-miranda="concise" style="cursor: pointer;" title="Click anywhere to copy Concise Miranda">
          <div class="protocol-card-header">
            <h3>CONCISE MIRANDA WARNING</h3>
            <button class="copy-action-btn" data-copy-miranda="concise">${icons.copy} COPY</button>
          </div>
          <blockquote class="miranda-quote">
            "${escapeHTML(mirandaRights.concise)}"
          </blockquote>
        </div>
      </div>

      <div class="cheatsheet-split-grid" style="margin-top: 32px;">
        <div class="protocol-card">
          <div class="protocol-card-header">
            <h3>OFFICIAL 10-CODES</h3>
            <div class="card-search-inline">
              <input type="text" id="tencodes-search" placeholder="Filter 10-codes..." />
            </div>
          </div>
          <div class="tencodes-list" id="tencodes-list-body">
            ${tenCodes.map(tc => `
              <div class="tencode-row" data-search-tc="${escapeAttr(tc.code + ' ' + tc.meaning + ' ' + tc.category)}" data-copy-tencode="${escapeAttr(tc.code + ' - ' + tc.meaning)}" style="cursor: pointer;" title="Click anywhere to copy ${escapeAttr(tc.code)}">
                <span class="tencode-badge">${escapeHTML(tc.code)}</span>
                <span class="tencode-meaning">${escapeHTML(tc.meaning)}</span>
                <span class="tencode-cat">${escapeHTML(tc.category)}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="protocol-card-stack">
          <div class="protocol-card">
            <div class="protocol-card-header">
              <h3>INCIDENT RESPONSE CODES</h3>
            </div>
            <div class="statuscodes-list">
              ${statusCodes.map(sc => `
                <div class="statuscode-item" data-copy-status="${escapeAttr(sc.code + ' - ' + sc.meaning)}" style="cursor: pointer;" title="Click anywhere to copy ${escapeAttr(sc.code)}">
                  <div class="statuscode-header">
                    <span class="statuscode-badge">${escapeHTML(sc.code)}</span>
                    <span class="statuscode-title">${escapeHTML(sc.meaning)}</span>
                  </div>
                  <p class="statuscode-desc">${escapeHTML(sc.description)}</p>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="protocol-card">
            <div class="protocol-card-header">
              <h3>NATO PHONETIC ALPHABET</h3>
            </div>
            <div class="nato-grid">
              ${natoAlphabet.map(n => `
                <div class="nato-item" data-copy-nato="${escapeAttr(n.letter + ' - ' + n.word + ' (' + n.phonetic + ')')}" style="cursor: pointer;" title="Click anywhere to copy ${escapeAttr(n.letter)}">
                  <span class="nato-letter">${n.letter}</span>
                  <div>
                    <p class="nato-word">${n.word}</p>
                    <span class="nato-phonetic">${n.phonetic}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  setTimeout(() => {
    
    const mirandaEls = document.querySelectorAll('[data-copy-miranda]');
    mirandaEls.forEach(el => {
      el.addEventListener('click', (e) => {
        const key = el.dataset.copyMiranda;
        copyToClipboard(mirandaRights[key], 'Miranda Warning copied to clipboard!');
      });
    });

    
    const tencodeRows = document.querySelectorAll('[data-copy-tencode]');
    tencodeRows.forEach(row => {
      row.addEventListener('click', () => {
        const text = row.dataset.copyTencode;
        copyToClipboard(text, `Copied: ${text}`);
      });
    });

    
    const statusItems = document.querySelectorAll('[data-copy-status]');
    statusItems.forEach(item => {
      item.addEventListener('click', () => {
        const text = item.dataset.copyStatus;
        copyToClipboard(text, `Copied: ${text}`);
      });
    });

    
    const natoItems = document.querySelectorAll('[data-copy-nato]');
    natoItems.forEach(item => {
      item.addEventListener('click', () => {
        const text = item.dataset.copyNato;
        copyToClipboard(text, `Copied: ${text}`);
      });
    });

    const searchTc = document.getElementById('tencodes-search');
    const rows = document.querySelectorAll('.tencode-row');
    if (searchTc) {
      searchTc.addEventListener('input', () => {
        const q = searchTc.value.toLowerCase().trim();
        rows.forEach(r => {
          const str = (r.dataset.searchTc || '').toLowerCase();
          r.style.display = !q || str.includes(q) ? 'grid' : 'none';
        });
      });
    }
  }, 0);

  return content;
}

function renderArrestProcedurePage() {
  const content = `
    <div class="procedure-page-container">
      <div class="procedure-header">
        <div class="hero-badge">STANDARD OPERATING PROCEDURE · LEO EN3</div>
        <h1 class="neon-heading">Official Arrest Procedure SOP</h1>
        <p class="penal-subtitle">Step-by-step procedural compliance guide, keybind muscles, verbatim voice dialogues, lawyer protocols, DOC booking, and contraband seizure regulations.</p>
      </div>

      
      <div class="sop-timers-banner">
        
        <div class="sop-timer-card sop-timer-card--primary">
          <div class="sop-timer-top">
            <div class="sop-timer-title">
              <span class="timer-pulse-dot" id="arrest-timer-dot"></span>
              <span>25-MINUTE ARREST CLOCK</span>
            </div>
            <span class="sop-timer-tag" id="arrest-timer-state">STANDBY</span>
          </div>
          <div class="sop-timer-digits" id="arrest-timer-display">25:00</div>
          <div class="sop-timer-controls">
            <button class="timer-btn timer-btn--start" id="arrest-timer-start-btn">START CLOCK</button>
            <button class="timer-btn timer-btn--pause" id="arrest-timer-pause-btn" style="display:none;">PAUSE (LAWYER)</button>
            <button class="timer-btn timer-btn--reset" id="arrest-timer-reset-btn">RESET</button>
          </div>
          <p class="timer-helper-note">*Pause timer immediately if suspect requests a private or state lawyer.</p>
        </div>

        
        <div class="sop-timer-card">
          <div class="sop-timer-top">
            <div class="sop-timer-title">
              <span class="timer-pulse-dot timer-pulse-dot--amber" id="lawyer-timer-dot"></span>
              <span>15-MINUTE LAWYER CLOCK</span>
            </div>
            <span class="sop-timer-tag" id="lawyer-timer-state">STANDBY</span>
          </div>
          <div class="sop-timer-digits text-amber" id="lawyer-timer-display">15:00</div>
          <div class="sop-timer-controls">
            <button class="timer-btn timer-btn--start" id="lawyer-timer-start-btn">START LAWYER TIME</button>
            <button class="timer-btn timer-btn--reset" id="lawyer-timer-reset-btn">RESET</button>
          </div>
          <p class="timer-helper-note">Max 15 min wait time for private lawyer / attorney arrival at DOC.</p>
        </div>

        
        <div class="sop-timer-card">
          <div class="sop-timer-top">
            <div class="sop-timer-title">
              <span class="timer-pulse-dot timer-pulse-dot--purple" id="dispatch-timer-dot"></span>
              <span>2-MIN DISPATCH CALL WAIT</span>
            </div>
            <span class="sop-timer-tag" id="dispatch-timer-state">STANDBY</span>
          </div>
          <div class="sop-timer-digits text-cyan" id="dispatch-timer-display">02:00</div>
          <div class="sop-timer-controls">
            <button class="timer-btn timer-btn--start" id="dispatch-timer-start-btn">START 2-MIN WAIT</button>
            <button class="timer-btn timer-btn--reset" id="dispatch-timer-reset-btn">RESET</button>
          </div>
          <p class="timer-helper-note">Wait 2 minutes after state lawyer dispatch radio call before repeating.</p>
        </div>
      </div>

      
      <div class="sop-critical-alert">
        <span class="alert-icon">⚠️</span>
        <div class="alert-text">
          <strong>CRITICAL MANDATORY DIRECTIVE:</strong>
          <span>ALWAYS HOLSTER YOUR WEAPON BEFORE PERFORMING ANY ACTIONS ON A SUSPECT!</span>
        </div>
      </div>

      
      <div class="sop-filter-bar" id="sop-filter-bar">
        <button class="sop-filter-btn active" data-step-filter="__all">ALL STEPS</button>
        <button class="sop-filter-btn" data-step-filter="scene">1. SCENE & CUFFS</button>
        <button class="sop-filter-btn" data-step-filter="transport">2. TRANSPORT & 10-17</button>
        <button class="sop-filter-btn" data-step-filter="miranda">3. MIRANDA RIGHTS</button>
        <button class="sop-filter-btn" data-step-filter="lawyer">4. LAWYER PROTOCOL</button>
        <button class="sop-filter-btn" data-step-filter="doc">5. DOC & JUMPSUIT</button>
        <button class="sop-filter-btn" data-step-filter="search">6. SEARCH & WEAPONS</button>
        <button class="sop-filter-btn" data-step-filter="booking">7. PDA & JAIL</button>
        <button class="sop-filter-btn" data-step-filter="clearance">8. 10-99 & 10-19</button>
      </div>

      
      <div class="sop-steps-grid" id="sop-steps-grid">

        
        <div class="sop-card" data-category="scene">
          <div class="sop-card-header">
            <div class="sop-step-number">STEP 01</div>
            <div class="sop-card-title-group">
              <h3>On-Scene Apprehension & Handcuffing</h3>
              <p>Weapon holster, compliance warnings, and physical control</p>
            </div>
            <div class="sop-badge-pill sop-badge--scene">ON-SCENE</div>
          </div>
          <div class="sop-card-body">
            <ul class="sop-checklist">
              <li>
                <strong>1. Holster Weapon:</strong> Ensure no weapon is equipped in hand before attempting any physical interaction.
              </li>
              <li>
                <strong>2. Begin 25-Minute Timer:</strong> Start your 25-minute arrest countdown timer immediately upon initiating apprehension.
              </li>
              <li>
                <strong>3. Voice Warning to Stand Still:</strong>
                <div class="dialogue-box">
                  <span class="dialogue-voice-lbl">VOICE LINE:</span>
                  <p class="dialogue-text">"Sir/Mam I am putting you in handcuffs, please stand still."</p>
                  <button class="copy-dialogue-btn" data-copy-dialogue="Sir/Mam I am putting you in handcuffs, please stand still.">
                    ${icons.copy} Copy
                  </button>
                </div>
              </li>
              <li>
                <strong>4. Muscle Keybind to Handcuff:</strong>
                <div class="keybind-row">
                  <span class="keybind-tag">FLEX "Z" MUSCLE</span>
                  <span>Attempt to handcuff the suspect. (Suspect must be standing still).</span>
                </div>
                <div class="sop-sub-note">⚠️ If the suspect does not stand still, give a verbal warning. If they continue running around, taze the suspect.</div>
              </li>
              <li>
                <strong>5. Grab by Arm & Move:</strong>
                <div class="dialogue-box">
                  <span class="dialogue-voice-lbl">VOICE LINE:</span>
                  <p class="dialogue-text">"Sir/Mam I will grab you by the arm."</p>
                  <button class="copy-dialogue-btn" data-copy-dialogue="Sir/Mam I will grab you by the arm.">
                    ${icons.copy} Copy
                  </button>
                </div>
                <div class="keybind-row">
                  <span class="keybind-tag">FLEX "X" MUSCLE</span>
                  <span>Grab suspect by arm and escort them to the patrol vehicle.</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        
        <div class="sop-card" data-category="transport">
          <div class="sop-card-header">
            <div class="sop-step-number">STEP 02</div>
            <div class="sop-card-title-group">
              <h3>Vehicle Seating & Transport Protocol</h3>
              <p>Head safety warning, vehicle muscle, driving guidelines, and 10-17 dispatch radio call</p>
            </div>
            <div class="sop-badge-pill sop-badge--transport">TRANSPORT</div>
          </div>
          <div class="sop-card-body">
            <ul class="sop-checklist">
              <li>
                <strong>1. Vehicle Placement & Head Safety:</strong>
                <div class="sop-sub-note">ALWAYS TELL A SUSPECT TO "WATCH THEIR HEAD" AS YOU PLACE OR REMOVE THEM FROM A VEHICLE.</div>
                <div class="dialogue-box">
                  <span class="dialogue-voice-lbl">VOICE LINE:</span>
                  <p class="dialogue-text">"Sir/Mam I am placing you in the vehicle, please watch your head."</p>
                  <button class="copy-dialogue-btn" data-copy-dialogue="Sir/Mam I am placing you in the vehicle, please watch your head.">
                    ${icons.copy} Copy
                  </button>
                </div>
                <div class="keybind-row">
                  <span class="keybind-tag">FLEX "C" MUSCLE</span>
                  <span>Look at suspect at vehicle and flex C muscle to place inside.</span>
                </div>
              </li>
              <li>
                <strong>2. State Preliminary Charges:</strong> Inform suspect of all their current charges and the factual reason for them.
              </li>
              <li>
                <strong>3. Driving Regulations:</strong> Drive carefully to DOC, avoid highways, and do not break speed limits unless in an emergency or actively being chased/ambushed.
              </li>
              <li>
                <strong>4. Transport Radio Transmission:</strong>
                <div class="radio-callout-box">
                  <span class="radio-lbl">DISPATCH RADIO (10-17):</span>
                  <p class="radio-text">"(BADGE NUMBER) To Dispatch, I am 10-17 to DOC with (NUMBER) of 10-15 and (ADDITIONALS/CONVOY)"</p>
                  <button class="copy-dialogue-btn" data-copy-dialogue="(BADGE NUMBER) To Dispatch, I am 10-17 to DOC with (NUMBER) of 10-15 and (ADDITIONALS/CONVOY)">
                    ${icons.copy} Copy
                  </button>
                </div>
              </li>
            </ul>
          </div>
        </div>

        
        <div class="sop-card" data-category="miranda">
          <div class="sop-card-header">
            <div class="sop-step-number">STEP 03</div>
            <div class="sop-card-title-group">
              <h3>Miranda Rights Protocol & 3-Attempt Rule</h3>
              <p>Verbatim legal rights, 5-second interval rule, and comprehension acknowledgment</p>
            </div>
            <div class="sop-badge-pill sop-badge--miranda">MIRANDA</div>
          </div>
          <div class="sop-card-body">
            <div class="miranda-reading-card">
              <div class="miranda-reading-title">⚖️ VERBATIM MIRANDA WARNING</div>
              <blockquote class="miranda-reading-quote">
                "You are under arrest.<br/>
                You have the right to remain silent.<br/>
                Anything you say can and will be used against you in the court of law.<br/>
                You have the right to an attorney.<br/>
                If you cannot afford an attorney, one will be appointed to you by the state if available.<br/>
                Do you understand the rights I just read to you?"
              </blockquote>
              <div class="miranda-card-actions">
                <button class="copy-dialogue-btn" data-copy-dialogue="You are under arrest. You have the right to remain silent. Anything you say can and will be used against you in the court of law. You have the right to an attorney. If you cannot afford an attorney, one will be appointed to you by the state if available. Do you understand the rights I just read to you?">
                  ${icons.copy} Copy Full Miranda Warning
                </button>
              </div>
            </div>

            <div class="sop-rule-callout">
              <strong>📋 THREE-ATTEMPT COMPLIANCE RULE:</strong>
              <ul>
                <li>If the suspect ignores you or states they don't understand, you <strong>MUST wait 5 seconds</strong> and repeat the rights again (up to 3 times total).</li>
                <li>After the 3rd attempt, if the suspect is still ignoring you, inform them: <em>"I have read you your rights 3 times and will now proceed with processing."</em></li>
                <li>Inform the suspect of their charges at the earliest convenience.</li>
              </ul>
            </div>
          </div>
        </div>

        
        <div class="sop-card" data-category="lawyer">
          <div class="sop-card-header">
            <div class="sop-step-number">STEP 04</div>
            <div class="sop-card-title-group">
              <h3>Legal Representation & Lawyer Protocol</h3>
              <p>Arrest timer pause, private vs state lawyer rules, bodycam deadline, and mask inspection</p>
            </div>
            <div class="sop-badge-pill sop-badge--lawyer">LAWYER SOP</div>
          </div>
          <div class="sop-card-body">
            <ul class="sop-checklist">
              <li>
                <div class="timer-pause-badge">⏳ MANDATORY: PAUSE 25-MINUTE ARREST TIMER IMMEDIATELY</div>
                <p>If the suspect requests a private or state lawyer at any point, pause the 25-minute arrest clock.</p>
              </li>
              <li>
                <strong>Private Lawyer Option:</strong>
                <p>Detainee must provide the cell number for their private lawyer without delay. Wait up to <strong>15 minutes</strong> or after 3 valid attempts to reach them. If private lawyer fails to arrive, offer the right to request a state lawyer. <strong>ALWAYS request to see the private lawyer's Bar License.</strong></p>
              </li>
              <li>
                <strong>State Lawyer Option:</strong>
                <p>Radio in to dispatch to request state counsel:</p>
                <div class="radio-callout-box">
                  <span class="radio-lbl">DISPATCH CALL:</span>
                  <p class="radio-text">"(BADGE NUMBER) To Dispatch, my 10-15 is requesting a state lawyer at DOC"</p>
                  <button class="copy-dialogue-btn" data-copy-dialogue="(BADGE NUMBER) To Dispatch, my 10-15 is requesting a state lawyer at DOC">
                    ${icons.copy} Copy
                  </button>
                </div>
                <div class="sop-sub-note">
                  Wait <strong>2 minutes</strong> after dispatch call. If a valid response is received stating "attorney enroute", wait up to <strong>15 minutes</strong> for their arrival. If no response within 2 minutes, make another call, wait 2 minutes again, then proceed with processing if still unanswered. <strong>ALWAYS inspect the state lawyer's State ID.</strong>
                </div>
              </li>
              <li>
                <strong>Bodycam Evidence & High Command (HC):</strong>
                <p>Cooperate with all inquiries from defense lawyers and request a High Command (HC) without delay. You have <strong>10 minutes upon request</strong> to show proof of crime (bodycam footage).</p>
              </li>
              <li>
                <strong>Mask & Search Rule During Lawyer Call:</strong>
                <p>Ensure the suspect has no mask on (give 10 seconds to remove, if they refuse, forcefully remove it). Search for identification and illegal items, but <strong>DO NOT confiscate items until the lawyer approves</strong> or leaves.</p>
              </li>
              <li>
                <strong>Resume Timer:</strong> Resume the 25-minute arrest timer once legal counsel concludes or time limits expire.
              </li>
            </ul>
          </div>
        </div>

        
        <div class="sop-card" data-category="doc">
          <div class="sop-card-header">
            <div class="sop-step-number">STEP 05</div>
            <div class="sop-card-title-group">
              <h3>DOC Arrival, Medical & Jumpsuit Booking</h3>
              <p>Vehicle unseating, DOC medical care, front counter jumpsuit sizing, and cell escort</p>
            </div>
            <div class="sop-badge-pill sop-badge--doc">DOC BOOKING</div>
          </div>
          <div class="sop-card-body">
            <ul class="sop-checklist">
              <li>
                <strong>1. Vehicle Extraction & Head Safety:</strong> Tell suspect <span class="text-amber font-bold">"WATCH YOUR HEAD"</span>.
                <div class="keybind-row">
                  <span class="keybind-tag">FLEX "G" MUSCLE ON CAR</span>
                  <span>Select Passengers > Click the passenger to be dropped off.</span>
                </div>
              </li>
              <li>
                <strong>2. Medical Attention:</strong> Make sure to provide the suspect medical attention if injured upon arrival at DOC.
              </li>
              <li>
                <strong>3. Front Counter Jumpsuit Sizing:</strong>
                <div class="dialogue-box">
                  <span class="dialogue-voice-lbl">VOICE LINE:</span>
                  <p class="dialogue-text">"Sir/Mam What size of jumpsuit should i get you?"</p>
                  <button class="copy-dialogue-btn" data-copy-dialogue="Sir/Mam What size of jumpsuit should i get you?">
                    ${icons.copy} Copy
                  </button>
                </div>
                <div class="sop-sub-note">If suspect does not state a size, pick what size you think they need.</div>
                <div class="dialogue-box" style="margin-top:6px;">
                  <span class="dialogue-voice-lbl">ROLEPLAY EMOTE (/ME):</span>
                  <p class="dialogue-text">/me grabs a *SIZE* jumpsuit from behind the counter</p>
                  <button class="copy-dialogue-btn" data-copy-dialogue="/me grabs a *SIZE* jumpsuit from behind the counter">
                    ${icons.copy} Copy
                  </button>
                </div>
              </li>
              <li>
                <strong>4. Cell Escort:</strong> Escort suspect into cell. <strong>ENSURE YOU LOCK DOORS BEHIND YOU AT ALL TIMES!</strong>
              </li>
            </ul>
          </div>
        </div>

        
        <div class="sop-card" data-category="search">
          <div class="sop-card-header">
            <div class="sop-step-number">STEP 06</div>
            <div class="sop-card-title-group">
              <h3>Passport, Illegal Contraband & Seizure Rules</h3>
              <p>Personal info check, illegal weapon serial "XXX" seizure vs legal "AMMO" with license</p>
            </div>
            <div class="sop-badge-pill sop-badge--search">SEARCH & SEIZE</div>
          </div>
          <div class="sop-card-body">
            <ul class="sop-checklist">
              <li>
                <strong>1. Passport & Identification:</strong>
                <p>Inform suspect you are going to reach into their pockets to find their passport.</p>
                <div class="keybind-row">
                  <span class="keybind-tag">FLEX "G" MUSCLE</span>
                  <span>Organisation (2) ➔ Find out personal information (7)</span>
                </div>
              </li>
              <li>
                <strong>2. Search for Illegal Items:</strong>
                <p>Inform suspect you are going to search them for illegal contraband.</p>
                <div class="keybind-row">
                  <span class="keybind-tag">FLEX "G" MUSCLE</span>
                  <span>Organisation (2) ➔ Search (2)</span>
                </div>
              </li>
              <li>
                <div class="sop-weapons-guide">
                  <div class="weapons-guide-title">🛡️ WEAPON & CONTRABAND SEIZURE RULES</div>
                  <div class="weapons-rules-grid">
                    <div class="weapon-rule-box weapon-rule--illegal">
                      <span class="rule-tag text-red">❌ MUST CONFISCATE:</span>
                      <p>Any illegal weapons with serial number <strong>"XXX"</strong> or any Government Agency Weapons (LSPD/SAHP/FIB/GOV/NG issued).</p>
                    </div>
                    <div class="weapon-rule-box weapon-rule--legal">
                      <span class="rule-tag text-green">✅ SUSPECT CAN KEEP:</span>
                      <p>Weapons tagged as <strong>"AMMO"</strong> ONLY IF the suspect holds a valid, active Gun License in their passport.</p>
                    </div>
                  </div>
                  <div class="sop-sub-note" style="margin-top:8px;">
                    📸 <strong>CONFISCATION LOG:</strong> If you confiscate ANYTHING from the suspect, you must take a screenshot and log it in the <code>#confiscation-logs</code> channel on Discord!
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        
        <div class="sop-card" data-category="booking">
          <div class="sop-card-header">
            <div class="sop-step-number">STEP 07</div>
            <div class="sop-card-title-group">
              <h3>Mask Removal, PDA Wanted Levels & Final Cell Jailing</h3>
              <p>Mask destruction on resistance, separate crime inputs, jumpsuit placement, and isolation</p>
            </div>
            <div class="sop-badge-pill sop-badge--booking">JAIL & PDA</div>
          </div>
          <div class="sop-card-body">
            <ul class="sop-checklist">
              <li>
                <strong>1. Mask Compliance:</strong>
                <p>If suspect is wearing a mask, you MUST give them a chance to remove it now. If they attempt to assault or escape, taze, handcuff, and destroy the mask.</p>
              </li>
              <li>
                <strong>2. Final Sentence & Fine Notification:</strong>
                <p>Inform suspect of all finalized charges, total prison sentence (months), total fine amount, and legal rationale.</p>
              </li>
              <li>
                <strong>3. Issue Wanted Level via PDA:</strong>
                <div class="keybind-row">
                  <span class="keybind-tag">FLEX "J" MUSCLE</span>
                  <span>Pull out PDA and issue Wanted Level (Max 5 Stars).</span>
                </div>
                <div class="sop-sub-note">
                  Every crime charged must be input separately! Use exact penal/traffic code prefixes (e.g. <code>P.C. 3.10 Attempted murder of a public servant</code>).
                </div>
              </li>
              <li>
                <strong>4. Final Inquiries:</strong> Ask the suspect if they have any final questions.
              </li>
              <li>
                <strong>5. Jumpsuit Application:</strong>
                <div class="dialogue-box">
                  <span class="dialogue-voice-lbl">VOICE LINE:</span>
                  <p class="dialogue-text">"Sir/Mam I am putting you in your jumpsuit."</p>
                  <button class="copy-dialogue-btn" data-copy-dialogue="Sir/Mam I am putting you in your jumpsuit.">
                    ${icons.copy} Copy
                  </button>
                </div>
              </li>
              <li>
                <strong>6. Final Incarceration Booking:</strong>
                <div class="keybind-row">
                  <span class="keybind-tag">FLEX "G" MUSCLE</span>
                  <span>Select Organisation ➔ Select Arrest</span>
                </div>
                <div class="keybind-row" style="margin-top:4px;">
                  <span class="keybind-tag">IF ISOLATION CELL:</span>
                  <span>Flex G Muscle ➔ Organisation (2) ➔ Select Arrest (6)</span>
                </div>
              </li>
              <li>
                <strong>7. Lock Cell:</strong> Exit cell ensuring you <span class="text-red font-bold">LOCK</span> it behind you.
              </li>
            </ul>
          </div>
        </div>

        
        <div class="sop-card" data-category="clearance">
          <div class="sop-card-header">
            <div class="sop-step-number">STEP 08</div>
            <div class="sop-card-title-group">
              <h3>Final Dispatch Clearance (10-99 & 10-19)</h3>
              <p>Radio transmission confirming completed processing and return to headquarters</p>
            </div>
            <div class="sop-badge-pill sop-badge--clearance">CLEARANCE</div>
          </div>
          <div class="sop-card-body">
            <div class="radio-callout-box radio-callout--final">
              <span class="radio-lbl">FINAL DISPATCH RADIO TRANSMISSION:</span>
              <p class="radio-text">"(BADGE NUMBER) to dispatch, show my last 10-15 as 10-99 and I am 10-19"</p>
              <button class="copy-dialogue-btn" data-copy-dialogue="(BADGE NUMBER) to dispatch, show my last 10-15 as 10-99 and I am 10-19">
                ${icons.copy} Copy Final Radio Call
              </button>
            </div>
            <div class="sop-sub-note" style="margin-top:10px;">
              ✅ <strong>STATUS DECODED:</strong> <code>10-15</code> = Suspect in Custody · <code>10-99</code> = Mission/Processing Complete · <code>10-19</code> = Returning to Station / Headquarters.
            </div>
          </div>
        </div>

      </div>
    </div>
  `;

  setTimeout(() => {
    
    let arrestRemaining = 25 * 60;
    let arrestInterval = null;
    let isArrestRunning = false;

    const arrestDisplay = document.getElementById('arrest-timer-display');
    const arrestStartBtn = document.getElementById('arrest-timer-start-btn');
    const arrestPauseBtn = document.getElementById('arrest-timer-pause-btn');
    const arrestResetBtn = document.getElementById('arrest-timer-reset-btn');
    const arrestStateTag = document.getElementById('arrest-timer-state');
    const arrestDot = document.getElementById('arrest-timer-dot');

    function updateArrestTimerDisplay() {
      const mins = Math.floor(arrestRemaining / 60);
      const secs = arrestRemaining % 60;
      arrestDisplay.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
      if (arrestRemaining <= 300 && arrestRemaining > 0) {
        arrestDisplay.className = 'sop-timer-digits text-red urgent-pulse';
      } else if (arrestRemaining === 0) {
        arrestDisplay.textContent = 'EXPIRED (00:00)';
        arrestDisplay.className = 'sop-timer-digits text-red';
        arrestStateTag.textContent = 'EXPIRED';
      }
    }

    arrestStartBtn?.addEventListener('click', () => {
      playTacticalSound('click');
      if (!isArrestRunning) {
        isArrestRunning = true;
        arrestStartBtn.style.display = 'none';
        arrestPauseBtn.style.display = 'inline-flex';
        arrestStateTag.textContent = 'ACTIVE';
        arrestStateTag.className = 'sop-timer-tag sop-timer-tag--active';
        arrestDot?.classList.add('active');

        arrestInterval = setInterval(() => {
          if (arrestRemaining > 0) {
            arrestRemaining--;
            updateArrestTimerDisplay();
          } else {
            clearInterval(arrestInterval);
            isArrestRunning = false;
            playTacticalSound('alert');
            showToast('⚠️ 25-Minute Arrest Timer has expired!', 'error');
          }
        }, 1000);
      }
    });

    arrestPauseBtn?.addEventListener('click', () => {
      playTacticalSound('click');
      if (isArrestRunning) {
        clearInterval(arrestInterval);
        isArrestRunning = false;
        arrestStartBtn.style.display = 'inline-flex';
        arrestStartBtn.textContent = 'RESUME CLOCK';
        arrestPauseBtn.style.display = 'none';
        arrestStateTag.textContent = 'PAUSED (LAWYER)';
        arrestStateTag.className = 'sop-timer-tag sop-timer-tag--paused';
        arrestDot?.classList.remove('active');
        showToast('Arrest Clock paused for lawyer request', 'info');
      }
    });

    arrestResetBtn?.addEventListener('click', () => {
      playTacticalSound('click');
      clearInterval(arrestInterval);
      isArrestRunning = false;
      arrestRemaining = 25 * 60;
      updateArrestTimerDisplay();
      arrestDisplay.className = 'sop-timer-digits';
      arrestStartBtn.style.display = 'inline-flex';
      arrestStartBtn.textContent = 'START CLOCK';
      arrestPauseBtn.style.display = 'none';
      arrestStateTag.textContent = 'STANDBY';
      arrestStateTag.className = 'sop-timer-tag';
      arrestDot?.classList.remove('active');
    });

    
    let lawyerRemaining = 15 * 60;
    let lawyerInterval = null;
    let isLawyerRunning = false;

    const lawyerDisplay = document.getElementById('lawyer-timer-display');
    const lawyerStartBtn = document.getElementById('lawyer-timer-start-btn');
    const lawyerResetBtn = document.getElementById('lawyer-timer-reset-btn');
    const lawyerStateTag = document.getElementById('lawyer-timer-state');
    const lawyerDot = document.getElementById('lawyer-timer-dot');

    lawyerStartBtn?.addEventListener('click', () => {
      playTacticalSound('click');
      if (!isLawyerRunning) {
        isLawyerRunning = true;
        lawyerStateTag.textContent = 'COUNTING';
        lawyerStateTag.className = 'sop-timer-tag sop-timer-tag--active';
        lawyerDot?.classList.add('active');

        lawyerInterval = setInterval(() => {
          if (lawyerRemaining > 0) {
            lawyerRemaining--;
            const mins = Math.floor(lawyerRemaining / 60);
            const secs = lawyerRemaining % 60;
            lawyerDisplay.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
          } else {
            clearInterval(lawyerInterval);
            isLawyerRunning = false;
            lawyerDisplay.textContent = '00:00 EXPIRED';
            lawyerStateTag.textContent = 'EXPIRED';
            playTacticalSound('alert');
            showToast('15-Minute Lawyer waiting window has elapsed!', 'info');
          }
        }, 1000);
      }
    });

    lawyerResetBtn?.addEventListener('click', () => {
      playTacticalSound('click');
      clearInterval(lawyerInterval);
      isLawyerRunning = false;
      lawyerRemaining = 15 * 60;
      lawyerDisplay.textContent = '15:00';
      lawyerStateTag.textContent = 'STANDBY';
      lawyerStateTag.className = 'sop-timer-tag';
      lawyerDot?.classList.remove('active');
    });

    
    let dispatchRemaining = 2 * 60;
    let dispatchInterval = null;
    let isDispatchRunning = false;

    const dispatchDisplay = document.getElementById('dispatch-timer-display');
    const dispatchStartBtn = document.getElementById('dispatch-timer-start-btn');
    const dispatchResetBtn = document.getElementById('dispatch-timer-reset-btn');
    const dispatchStateTag = document.getElementById('dispatch-timer-state');
    const dispatchDot = document.getElementById('dispatch-timer-dot');

    dispatchStartBtn?.addEventListener('click', () => {
      playTacticalSound('click');
      if (!isDispatchRunning) {
        isDispatchRunning = true;
        dispatchStateTag.textContent = 'WAITING';
        dispatchStateTag.className = 'sop-timer-tag sop-timer-tag--active';
        dispatchDot?.classList.add('active');

        dispatchInterval = setInterval(() => {
          if (dispatchRemaining > 0) {
            dispatchRemaining--;
            const mins = Math.floor(dispatchRemaining / 60);
            const secs = dispatchRemaining % 60;
            dispatchDisplay.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
          } else {
            clearInterval(dispatchInterval);
            isDispatchRunning = false;
            dispatchDisplay.textContent = '00:00 (REPEAT)';
            dispatchStateTag.textContent = 'REPEAT CALL';
            playTacticalSound('alert');
            showToast('2-Minute dispatch wait elapsed. Repeat call or proceed.', 'info');
          }
        }, 1000);
      }
    });

    dispatchResetBtn?.addEventListener('click', () => {
      playTacticalSound('click');
      clearInterval(dispatchInterval);
      isDispatchRunning = false;
      dispatchRemaining = 2 * 60;
      dispatchDisplay.textContent = '02:00';
      dispatchStateTag.textContent = 'STANDBY';
      dispatchStateTag.className = 'sop-timer-tag';
      dispatchDot?.classList.remove('active');
    });

    
    const filterBar = document.getElementById('sop-filter-bar');
    const cards = document.querySelectorAll('.sop-card');

    filterBar?.addEventListener('click', (e) => {
      const btn = e.target.closest('.sop-filter-btn');
      if (!btn) return;
      playTacticalSound('click');
      const filter = btn.dataset.stepFilter;

      filterBar.querySelectorAll('.sop-filter-btn').forEach(b => b.classList.toggle('active', b === btn));

      cards.forEach(c => {
        if (filter === '__all' || c.dataset.category === filter) {
          c.style.display = 'block';
        } else {
          c.style.display = 'none';
        }
      });
    });

    
    document.getElementById('sop-steps-grid')?.addEventListener('click', (e) => {
      const copyBtn = e.target.closest('[data-copy-dialogue]');
      if (copyBtn) {
        const text = copyBtn.dataset.copyDialogue;
        copyToClipboard(text, 'Copied dialogue to clipboard!');
      }
    });

  }, 0);

  return content;
}

function renderBenchTrialPage() {
  const allPenalCodes = [];
  penalCategories.forEach(cat => {
    cat.codes.forEach(c => {
      allPenalCodes.push({ ...c, categoryTitle: cat.title });
    });
  });

  const en3Time = getGrandRPEN3DateTime();
  const defaultDate = en3Time.dateShort; 
  const defaultCaseNum = '21-102026-FIB-01';

  const defaultVerdictText = `by order from the Presiding Judge, the defendant is found GUILTY on all charges filed. Suspect shall serve full DOC incarceration and pay all statutory fines as calculated.`;

  const content = `
    <div class="bench-trial-container">
      <div class="procedure-header">
        <div class="hero-badge">SAN ANDREAS DEPARTMENT OF JUSTICE · BENCH TRIAL DOCKET</div>
        <h1 class="neon-heading">Bench Trial Verdict & Court Record Suite</h1>
        <p class="penal-subtitle">Format official GrandRP bench trial verdicts, manage judicial rulings, handle officer misconduct sanctions, and generate ready-to-post Discord court logs.</p>
      </div>

      <div class="bench-trial-grid">
        
        <div class="bench-form-panel">
          <div class="bench-card">
            <div class="bench-card-header">
              <div class="bench-header-title">
                ${icons.gavel}
                <span>COURT & CASE DETAILS</span>
              </div>
              <div style="display: flex; gap: 6px;">
                <button class="auto-case-btn" id="btn-sync-en3-court-date" title="Detect and fill live GrandRP EN3 server date">⚡ Live EN3 Date (${en3Time.dateShort})</button>
                <button class="auto-case-btn" id="btn-autogen-case">⚡ New Case #</button>
                <button type="button" class="reset-form-btn" id="btn-reset-bench-trial" title="Reset all fields to default">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                  Reset
                </button>
              </div>
            </div>

            <div class="bench-inputs-grid">
              <div class="input-field-group">
                <label>Court Jurisdiction:</label>
                <select id="court-name-select" class="bench-select">
                  <option value="District Court Of  San Andreas" selected>District Court Of  San Andreas</option>
                  <option value="Supreme Court Of  San Andreas">Supreme Court Of  San Andreas</option>
                  <option value="Court of Appeals Of  San Andreas">Court of Appeals Of  San Andreas</option>
                  <option value="Municipal Court of Los Santos">Municipal Court of Los Santos</option>
                </select>
              </div>

              <div class="input-field-group">
                <label>Case Number:</label>
                <input type="text" id="case-number-input" value="" placeholder="ex : 21-102026-FIB-01" />
              </div>

              <div class="input-field-group">
                <label>Hearing Date (DD.MM.YY):</label>
                <input type="text" id="case-date-input" value="" placeholder="ex : 21.10.26" />
              </div>

              <div class="input-field-group">
                <label>Presiding Judge / Justice:</label>
                <input type="text" id="presiding-judge-input" value="" placeholder="e.g. SCJ / District Judge" />
              </div>
            </div>

            
            <div class="bench-section-divider">
              <span>TRIAL COUNSEL & DEFENDANT</span>
            </div>

            <div class="bench-inputs-grid">
              <div class="input-field-group">
                <label>Prosecution (Officer / DA Discord Tag):</label>
                <input type="text" id="prosecution-input" value="" placeholder="ex : <@267298537497296896> / Officer John" />
              </div>

              <div class="input-field-group">
                <label>Defendant (Suspect Name / ID):</label>
                <input type="text" id="defendant-input" value="" placeholder="ex : Dave Scofield / ID #58717" />
              </div>

              <div class="input-field-group" style="grid-column: span 2;">
                <label>Defense Lawyer (Attorney Discord Tag / Name):</label>
                <input type="text" id="defense-lawyer-input" value="" placeholder="ex : <@267298537497296896> / Public Defender" />
              </div>
            </div>

            
            <div class="bench-section-divider">
              <span>CHARGES FILED & DISPOSITION</span>
            </div>

            <div class="bench-charges-selector">
              <div class="bench-search-row">
                <div class="calc-search-box">
                  ${icons.search}
                  <input type="text" id="bench-charge-search" placeholder="Search charge to add (e.g. Reckless, Murder, Contempt, Weapons)..." />
                </div>
              </div>

              <div class="bench-charge-picker" id="bench-charge-picker">
                
              </div>

              <div class="bench-selected-charges" id="bench-selected-charges">
                
              </div>
            </div>

            
            <div class="bench-section-divider">
              <span>JUDICIAL VERDICT & ORDERS</span>
            </div>

            <div class="verdict-presets-bar" id="verdict-presets-bar">
              <button class="preset-btn active" data-preset="guilty">Guilty on All Counts</button>
              <button class="preset-btn" data-preset="dismissed">All Charges Dismissed</button>
              <button class="preset-btn" data-preset="plea">Plea Deal Accepted</button>
              <button class="preset-btn" data-preset="demoted">Contempt & Officer Demoted</button>
            </div>

            <div class="verdict-textarea-wrap">
              <label>Verdict Reasoning & Orders:</label>
              <textarea id="verdict-text-input" rows="4" placeholder="Enter judicial verdict statement...">${escapeHTML(defaultVerdictText)}</textarea>
            </div>

            <div class="bench-form-actions">
              <button class="generate-report-btn" id="btn-submit-bench-trial">
                ${icons.copy} SUBMIT & COPY DISCORD BENCH TRIAL FORMAT
              </button>
            </div>
          </div>
        </div>

        
        <div class="bench-preview-panel">
          <div class="bench-preview-card">
            <div class="preview-header-bar">
              <div class="preview-dot"></div>
              <span class="preview-header-title">Discord Verdict — Live Preview</span>
              <button class="copy-preview-btn" id="btn-copy-preview-fast">${icons.copy} Copy</button>
            </div>
            <pre class="bench-markdown-preview" id="bench-markdown-preview">
              
            </pre>
          </div>

          
          <div class="bench-guidelines-card">
            <div class="guidelines-header">
              ${icons.shield}
              <span>BENCH TRIAL PROCEDURAL RULES</span>
            </div>
            <ul class="guidelines-list">
              <li><strong>Strikethrough Format (~~):</strong> Dismissed or dropped charges MUST be enclosed with <code>~~</code> to reflect acquittal.</li>
              <li><strong>Officer Sanctions:</strong> If the arresting officer made an unlawful arrest or failed bodycam mandates, the Judge can order retraining or demotion.</li>
              <li><strong>Contempt of Court:</strong> Penal Code 5.4 Contempt of court fine may be assessed even if primary charges are dismissed.</li>
            </ul>
          </div>
        </div>
      </div>

      
      <div class="dept-ledger-section" style="margin-top:20px;">
        <div class="dept-ledger-header">
          <div class="dept-ledger-title">
            ${icons.gavel}
            <div>
              <h2>Judicial Record & Bench Trial Ledger</h2>
              <p>Historical archive of court verdicts, presiding judges, and case dispositions</p>
            </div>
          </div>
          <div class="dept-ledger-filters">
            <button class="clear-ledger-btn" id="clear-bench-ledger-btn">Clear Court Logs</button>
          </div>
        </div>

        <div class="dept-ledger-content" id="bench-ledger-content">
          
        </div>
      </div>
    </div>
  `;

  setTimeout(() => {
    const STORAGE_KEY_BENCH = 'grp_bench_trials_v2';

    function getBenchTrials() {
      try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY_BENCH) || '[]');
      } catch {
        return [];
      }
    }

    function saveBenchTrial(trial) {
      const list = getBenchTrials();
      list.unshift(trial);
      localStorage.setItem(STORAGE_KEY_BENCH, JSON.stringify(list));
    }

    function deleteBenchTrial(id) {
      let list = getBenchTrials();
      list = list.filter(t => t.id !== id);
      localStorage.setItem(STORAGE_KEY_BENCH, JSON.stringify(list));
    }

    function clearBenchTrials() {
      localStorage.setItem(STORAGE_KEY_BENCH, JSON.stringify([]));
    }

    
    let selectedCharges = [
      { code: 'P.C. 6.5', description: 'Reckless driving', dismissed: true }
    ];

    const courtSelect = document.getElementById('court-name-select');
    const caseNumInput = document.getElementById('case-number-input');
    const caseDateInput = document.getElementById('case-date-input');
    const presidingJudgeInput = document.getElementById('presiding-judge-input');
    const prosecutionInput = document.getElementById('prosecution-input');
    const defendantInput = document.getElementById('defendant-input');
    const defenseLawyerInput = document.getElementById('defense-lawyer-input');
    const verdictTextInput = document.getElementById('verdict-text-input');
    const chargeSearchInput = document.getElementById('bench-charge-search');
    const chargePicker = document.getElementById('bench-charge-picker');
    const selectedChargesList = document.getElementById('bench-selected-charges');
    const previewArea = document.getElementById('bench-markdown-preview');
    const submitBtn = document.getElementById('btn-submit-bench-trial');
    const copyFastBtn = document.getElementById('btn-copy-preview-fast');
    const resetBtn = document.getElementById('btn-reset-bench-trial');
    const autogenBtn = document.getElementById('btn-autogen-case');
    const presetsBar = document.getElementById('verdict-presets-bar');
    const ledgerContent = document.getElementById('bench-ledger-content');
    const clearLedgerBtn = document.getElementById('clear-bench-ledger-btn');

    function buildDiscordReport() {
      const court = courtSelect?.value || 'District Court Of  San Andreas';
      const caseNum = caseNumInput?.value.trim() || '25-082026-SAHP-02';
      const dateVal = caseDateInput?.value.trim() || defaultDate;
      const verdict = verdictTextInput?.value.trim() || defaultVerdictText;
      const prosecution = prosecutionInput?.value.trim() || '[Prosecution]';
      const defendant = defendantInput?.value.trim() || '[Defendant]';
      const defense = defenseLawyerInput?.value.trim() || '[Defense Lawyer]';

      let chargesBlock = '';
      if (selectedCharges.length === 0) {
        chargesBlock = 'None / Dismissed';
      } else {
        chargesBlock = selectedCharges.map(c => {
          const str = `${c.code}    ${c.description}`;
          if (c.dismissed) {
            return `~~\n${str}\n~~`;
          } else {
            return str;
          }
        }).join('\n');
      }

      return `Court:  ${court}
Case Number: ${caseNum}
Date: ${dateVal}

======================================================

 Verdict :-

${verdict}

The charges against were :-
${chargesBlock}
======================================================

Prosecution: ${prosecution} 
Defendant: ${defendant}
Defense Lawyer: ${defense}`;
    }

    function updatePreview() {
      const text = buildDiscordReport();
      if (previewArea) {
        previewArea.textContent = text;
      }
    }

    function renderSelectedCharges() {
      if (selectedCharges.length === 0) {
        selectedChargesList.innerHTML = `<div class="no-charges-placeholder">No charges added to the case. Search below to add charges.</div>`;
        updatePreview();
        return;
      }

      selectedChargesList.innerHTML = selectedCharges.map((c, idx) => `
        <div class="bench-charge-pill ${c.dismissed ? 'bench-charge--dismissed' : 'bench-charge--sustained'}">
          <div class="charge-pill-info">
            <span class="charge-pill-code">${escapeHTML(c.code)}</span>
            <span class="charge-pill-desc ${c.dismissed ? 'line-through' : ''}">${escapeHTML(c.description)}</span>
          </div>
          <div class="charge-pill-actions">
            <button class="charge-toggle-btn ${c.dismissed ? 'is-dismissed' : 'is-sustained'}" data-toggle-charge-idx="${idx}" title="Toggle Dismissed vs Sustained">
              ${c.dismissed ? '~~ DISMISSED ~~' : '✓ SUSTAINED'}
            </button>
            <button class="charge-del-btn" data-remove-charge-idx="${idx}" title="Remove charge">
              ${icons.close}
            </button>
          </div>
        </div>
      `).join('');

      updatePreview();
    }

    function renderChargePicker() {
      const q = (chargeSearchInput?.value || '').toLowerCase().trim();
      if (!q) {
        chargePicker.style.display = 'none';
        return;
      }

      const qClean = q.replace(/[\.\s\-]/g, '');
      const matches = allPenalCodes.filter(c => {
        const codeClean = c.code.toLowerCase().replace(/[\.\s\-]/g, '');
        return `${c.code} ${c.description} ${c.categoryTitle}`.toLowerCase().includes(q) ||
               codeClean.includes(qClean);
      }).slice(0, 10);

      if (matches.length === 0) {
        chargePicker.innerHTML = `<div class="picker-no-match">No matching penal or traffic codes found</div>`;
      } else {
        chargePicker.innerHTML = matches.map(c => `
          <div class="bench-picker-item" data-add-code="${escapeAttr(c.code)}" data-add-desc="${escapeAttr(c.description)}">
            <span class="font-bold text-amber">${escapeHTML(c.code)}</span>
            <span>${escapeHTML(c.description)}</span>
            <span class="picker-add-tag">+ ADD</span>
          </div>
        `).join('');
      }

      chargePicker.style.display = 'block';
    }

    function renderBenchLedger() {
      const trials = getBenchTrials();
      if (trials.length === 0) {
        ledgerContent.innerHTML = `
          <div class="empty-ledger-state">
            ${icons.gavel}
            <p>No court verdicts or bench trials recorded yet. Submitting a verdict will archive it here automatically.</p>
          </div>
        `;
        return;
      }

      ledgerContent.innerHTML = `
        <div class="ledger-table-wrap">
          <table class="ledger-table">
            <thead>
              <tr>
                <th>CASE #</th>
                <th>DATE</th>
                <th>COURT</th>
                <th>DEFENDANT</th>
                <th>PROSECUTION</th>
                <th>DEFENSE LAWYER</th>
                <th>VERDICT SUMMARY</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              ${trials.map(t => `
                <tr>
                  <td class="font-mono font-bold text-cyan">${escapeHTML(t.caseNumber)}</td>
                  <td class="cell-time">${escapeHTML(t.date)}</td>
                  <td class="font-medium">${escapeHTML(t.court)}</td>
                  <td class="font-bold">${escapeHTML(t.defendant)}</td>
                  <td class="font-mono">${escapeHTML(t.prosecution)}</td>
                  <td class="font-mono text-amber">${escapeHTML(t.defense)}</td>
                  <td class="cell-charges">${escapeHTML(t.verdictSnippet)}</td>
                  <td class="cell-actions">
                    <button class="ledger-copy-btn" data-recopy-trial-id="${escapeAttr(t.id)}" title="Copy Discord Verdict">
                      ${icons.copy} Copy
                    </button>
                    <button class="ledger-delete-btn" data-delete-trial-id="${escapeAttr(t.id)}" title="Delete Record">
                      ${icons.close}
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    }

    
    [courtSelect, caseNumInput, caseDateInput, presidingJudgeInput, prosecutionInput, defendantInput, defenseLawyerInput, verdictTextInput].forEach(el => {
      el?.addEventListener('input', updatePreview);
    });

    chargeSearchInput?.addEventListener('input', renderChargePicker);

    chargePicker?.addEventListener('click', (e) => {
      const item = e.target.closest('[data-add-code]');
      if (!item) return;
      playTacticalSound('click');
      const code = item.dataset.addCode;
      const description = item.dataset.addDesc;

      selectedCharges.push({
        code,
        description,
        dismissed: true 
      });

      chargeSearchInput.value = '';
      chargePicker.style.display = 'none';
      renderSelectedCharges();
    });

    selectedChargesList?.addEventListener('click', (e) => {
      const toggleBtn = e.target.closest('[data-toggle-charge-idx]');
      if (toggleBtn) {
        playTacticalSound('click');
        const idx = parseInt(toggleBtn.dataset.toggleChargeIdx, 10);
        if (selectedCharges[idx]) {
          selectedCharges[idx].dismissed = !selectedCharges[idx].dismissed;
          renderSelectedCharges();
        }
        return;
      }

      const delBtn = e.target.closest('[data-remove-charge-idx]');
      if (delBtn) {
        playTacticalSound('click');
        const idx = parseInt(delBtn.dataset.removeChargeIdx, 10);
        selectedCharges.splice(idx, 1);
        renderSelectedCharges();
      }
    });

    const syncCourtDateBtn = document.getElementById('btn-sync-en3-court-date');
    syncCourtDateBtn?.addEventListener('click', () => {
      playTacticalSound('click');
      const en3 = getGrandRPEN3DateTime();
      caseDateInput.value = en3.dateShort;
      updatePreview();
      showToast(`Synced to EN3 Date: ${en3.dateShort} (${en3.timeShort} GMT+1)`, 'success');
    });

    
    autogenBtn?.addEventListener('click', () => {
      playTacticalSound('click');
      const en3 = getGrandRPEN3DateTime();
      const orgs = ['SAHP', 'LSPD', 'FIB', 'GOV', 'NG'];
      const randOrg = orgs[Math.floor(Math.random() * orgs.length)];
      const randNum = String(Math.floor(Math.random() * 90) + 10);
      caseNumInput.value = `${en3.day}-${en3.month}${en3.yearFull}-${randOrg}-${randNum}`;
      caseDateInput.value = en3.dateShort;
      updatePreview();
      showToast(`Generated Case #${caseNumInput.value} synced with EN3 Date`, 'info');
    });

    
    const presets = {
      demoted: `by order from the SCJ the suspect got the fines for P.C. 5.4    Contempt of court and released , how ever the arresting officer he dont know how to arrest so he will be demoted for trainee and take training again .`,
      dismissed: `by order from the District Court, all charges against the defendant are DISMISSED with prejudice due to failure by the arresting officer to provide bodycam proof within the 10-minute statutory window. Suspect is ordered released immediately.`,
      guilty: defaultVerdictText,
      plea: `by mutual agreement between Prosecution and Defense counsel, a plea deal was accepted. Defendant pled guilty to reduced charges. Total fines reduced by 50% with community service.`
    };

    presetsBar?.addEventListener('click', (e) => {
      const btn = e.target.closest('.preset-btn');
      if (!btn) return;
      playTacticalSound('click');
      presetsBar.querySelectorAll('.preset-btn').forEach(b => b.classList.toggle('active', b === btn));
      const key = btn.dataset.preset;
      if (presets[key]) {
        verdictTextInput.value = presets[key];
        updatePreview();
      }
    });

    
    submitBtn?.addEventListener('click', () => {
      const report = buildDiscordReport();
      const trialRecord = {
        id: 'trial_' + Date.now(),
        caseNumber: caseNumInput?.value.trim() || defaultCaseNum,
        court: courtSelect?.value || 'District Court Of  San Andreas',
        date: caseDateInput?.value.trim() || defaultDate,
        defendant: defendantInput?.value.trim() || 'Unknown Defendant',
        prosecution: prosecutionInput?.value.trim() || 'Unknown Prosecution',
        defense: defenseLawyerInput?.value.trim() || 'Unknown Defense',
        verdictSnippet: (verdictTextInput?.value.trim() || '').slice(0, 80) + '...',
        rawReport: report,
        timestamp: Date.now()
      };

      saveBenchTrial(trialRecord);
      copyToClipboard(report, 'Court Bench Trial Verdict copied to clipboard & logged!');
      renderBenchLedger();
    });

    copyFastBtn?.addEventListener('click', () => {
      const report = buildDiscordReport();
      copyToClipboard(report, 'Bench Trial format copied to clipboard!');
    });

    resetBtn?.addEventListener('click', () => {
      playTacticalSound('click');
      caseNumInput.value = defaultCaseNum;
      caseDateInput.value = defaultDate;
      verdictTextInput.value = defaultVerdictText;
      presetsBar?.querySelectorAll('.preset-btn').forEach(b => b.classList.toggle('active', b.dataset.preset === 'guilty'));
      selectedCharges = [{ code: 'P.C. 6.5', description: 'Reckless driving', dismissed: true }];
      renderSelectedCharges();
      updatePreview();
      showToast('Form reset to default', 'info');
    });

    
    ledgerContent?.addEventListener('click', (e) => {
      const recopyBtn = e.target.closest('[data-recopy-trial-id]');
      if (recopyBtn) {
        const id = recopyBtn.dataset.recopyTrialId;
        const item = getBenchTrials().find(t => t.id === id);
        if (item && item.rawReport) {
          copyToClipboard(item.rawReport, 'Court verdict re-copied to clipboard!');
        }
        return;
      }

      const delBtn = e.target.closest('[data-delete-trial-id]');
      if (delBtn) {
        const id = delBtn.dataset.deleteTrialId;
        deleteBenchTrial(id);
        playTacticalSound('click');
        showToast('Record deleted from court ledger', 'info');
        renderBenchLedger();
      }
    });

    clearLedgerBtn?.addEventListener('click', () => {
      if (confirm('Clear all archived bench trial verdicts?')) {
        clearBenchTrials();
        playTacticalSound('click');
        showToast('Court ledger cleared', 'info');
        renderBenchLedger();
      }
    });

    renderSelectedCharges();
    renderBenchLedger();
  }, 0);

  return content;
}

function renderLegislationPage() {
  const fallbackFiles = [
    { name: "Firearm Law of the State of San Andreas", filename: "Firearm Law of the State of San Andreas.pdf", path: "Firearm Law.pdf", url: "https://grp.trixterpro.in/Legislation/Firearm%20Law%20of%20the%20State%20of%20San%20Andreas.pdf", size: 3314014 },
    { name: "Government Agencies Transfer Act", filename: "Government Agencies Transfer Act.pdf", path: "Agencies Transfer Act.pdf", url: "https://grp.trixterpro.in/Legislation/Government%20Agencies%20Transfer%20Act.pdf", size: 21561721 },
    { name: "Penal Codes of the State of San Andreas", filename: "Penal Codes of the State of San Andreas.pdf", path: "Penal Codes.pdf", url: "https://grp.trixterpro.in/Legislation/Penal%20Codes%20of%20the%20State%20of%20San%20Andreas.pdf", size: 40232921 },
    { name: "Procedures Of Detention And Arrest Code 3rd Rendition", filename: "Procedures Of Detention And Arrest Code.pdf", path: "Detention & Arrest.pdf", url: "https://grp.trixterpro.in/Legislation/Procedures%20Of%20Detention%20And%20Arrest%20Code%203rd%20Rendition.pdf", size: 20415666 },
    { name: "Public Servants Governance Act 8th Rendition", filename: "Public Servants Governance Act.pdf", path: "Governance Act.pdf", url: "https://grp.trixterpro.in/Legislation/Public%20Servants%20Governance%20Act%208th%20Rendition.pdf", size: 127883331 },
    { name: "Traffic Code of the State of San Andreas 1st Rendition", filename: "Traffic Code of the State of San Andreas.pdf", path: "Traffic Code.pdf", url: "https://grp.trixterpro.in/Legislation/Traffic%20Code%20of%20the%20State%20of%20San%20Andreas%201st%20Rendition.pdf", size: 15368056 }
  ];

  const content = `
    <div class="legislation-page">
      <div class="legislation-header">
        <div class="hero-badge">SAN ANDREAS DEPARTMENT OF JUSTICE</div>
        <h1 class="neon-heading">Statutes & Legislation</h1>
        <p class="penal-subtitle">Official legislative documents, acts, codes, and procedural handbooks.</p>
      </div>

      <div class="legislation-layout">
        <aside class="legislation-list-panel">
          <div class="legislation-list-header">
            <span>OFFICIAL DOCUMENTS</span>
            <span id="legislation-list-meta">${fallbackFiles.length} files</span>
          </div>
          <div class="legislation-list" id="legislation-list">
            ${fallbackFiles.map((file, idx) => `
              <button class="legislation-item ${idx === 0 ? 'active' : ''}" data-url="${escapeAttr(file.url)}" data-filename="${escapeAttr(file.filename)}">
                <span class="legislation-item-icon">${icons.fileText}</span>
                <div class="legislation-item-text">
                  <span class="legislation-item-name">${escapeHTML(file.filename)}</span>
                  <span class="legislation-item-meta">${formatBytes(file.size)}</span>
                </div>
              </button>
            `).join('')}
          </div>
        </aside>

        <section class="legislation-preview-panel">
          <div class="legislation-preview-header">
            <div>
              <h2 id="legislation-preview-title">${escapeHTML(fallbackFiles[0].filename)}</h2>
              <p id="legislation-preview-meta">Official State Statute</p>
            </div>
            <a class="legislation-open-link" id="legislation-open-link" href="${escapeAttr(fallbackFiles[0].url)}" target="_blank" rel="noreferrer noopener">
              ${icons.link} OPEN IN FULLSCREEN
            </a>
          </div>
          <div class="legislation-preview-frame-wrap">
            <iframe class="legislation-preview-frame" id="legislation-preview-frame" src="${escapeAttr(fallbackFiles[0].url)}" title="Legislation Preview"></iframe>
          </div>
        </section>
      </div>
    </div>
  `;

  setTimeout(() => {
    const listEl = document.getElementById('legislation-list');
    const previewTitle = document.getElementById('legislation-preview-title');
    const previewFrame = document.getElementById('legislation-preview-frame');
    const openLink = document.getElementById('legislation-open-link');

    if (listEl) {
      listEl.addEventListener('click', (e) => {
        const btn = e.target.closest('.legislation-item');
        if (!btn) return;
        playTacticalSound('click');
        const url = btn.dataset.url;
        const filename = btn.dataset.filename;

        listEl.querySelectorAll('.legislation-item').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        previewTitle.textContent = filename;
        previewFrame.src = url;
        openLink.href = url;
      });
    }
  }, 0);

  return content;
}

function formatBytes(bytes) {
  if (!Number.isFinite(bytes)) return '';
  if (bytes < 1024) return `${bytes} B`;
  const units = ['KB', 'MB', 'GB'];
  let val = bytes / 1024;
  let unit = 0;
  while (val >= 1024 && unit < units.length - 1) {
    val /= 1024;
    unit += 1;
  }
  return `${val.toFixed(1)} ${units[unit]}`;
}

function renderFastLinksPage() {
  const links = [
    {
      type: 'forum',
      title: 'GrandRP EN3 Forums',
      subtitle: 'Official GrandRP Forum Access',
      description: 'Official forum boards for state legislation, complaints, leader applications, and general announcements.',
      href: 'https://gta5grand.com/forum/en_3/',
      badge: 'OFFICIAL FORUM',
    },
    {
      type: 'discord',
      title: 'Government Mails',
      subtitle: 'Official Discord Server',
      description: 'Government executive communications, state announcements, and governor office dispatches.',
      href: 'https://discord.com/invite/yHdqCRRqu',
      img: 'Assets/gov.png',
    },
    {
      type: 'discord',
      title: 'FIB Mails',
      subtitle: 'Federal Investigation Bureau',
      description: 'Internal communications, CID division, special operations, and federal dispatch.',
      href: 'https://discord.gg/tBZKZRf8m2',
      img: 'Assets/fib.png',
    },
    {
      type: 'discord',
      title: 'LSPD Mails',
      subtitle: 'Los Santos Police Department',
      description: 'City patrol communication channels, training logs, SWAT mobilization, and arrest records.',
      href: 'https://discord.com/invite/XtP4NhwpR',
      img: 'Assets/lspd.png',
    },
    {
      type: 'discord',
      title: 'National Guard Mails',
      subtitle: 'San Andreas National Guard',
      description: 'Fort Zancudo military command, ammo run logistics, and state defense coordination.',
      href: 'https://discord.gg/e3TUsXt4nE',
      img: 'Assets/ng.png',
    },
    {
      type: 'discord',
      title: 'SAHP Mails',
      subtitle: 'San Andreas Highway Patrol',
      description: 'Highway operations, radar division, county enforcement, and vehicle impound division.',
      href: 'https://discord.com/invite/xDpy3WuHm',
      img: 'Assets/sahp.png',
    },
    {
      type: 'discord',
      title: 'GrandRP Official Server',
      subtitle: 'GrandRP Official Discord',
      description: 'Global player community, updates, server status, rules, and event notifications.',
      href: 'https://discord.com/invite/hUG65kFRx',
      img: 'Assets/grp.png',
    },
  ];

  return `
    <div class="fast-links-page">
      <div class="fast-links-header">
        <div class="hero-badge">TACTICAL DISPATCH DIRECTORY</div>
        <h1 class="neon-heading">Fast Links & Department Mails</h1>
        <p class="penal-subtitle">Direct one-click access to official GrandRP department Discord servers and server forum boards.</p>
      </div>

      <div class="fast-links-grid">
        ${links.map(link => `
          <div class="fast-link-card ${link.type === 'forum' ? 'fast-link-card--forum' : 'fast-link-card--discord'}">
            <div class="fast-link-top">
              <div class="fast-link-avatar">
                ${link.img ? `<img src="${escapeAttr(link.img)}" alt="${escapeAttr(link.title)}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" /><span class="fast-link-avatar-fallback" style="display:none;">${escapeHTML((link.title || '?').split(' ')[0].slice(0, 4).toUpperCase())}</span>` : link.icon || icons.globe}
              </div>
              <span class="fast-link-badge">${escapeHTML(link.badge || 'DISCORD')}</span>
            </div>
            <div class="fast-link-content">
              <h2 class="fast-link-title">${escapeHTML(link.title)}</h2>
              <p class="fast-link-subtitle">${escapeHTML(link.subtitle)}</p>
              <p class="fast-link-description">${escapeHTML(link.description)}</p>
            </div>
            <div class="fast-link-footer">
              <a href="${escapeAttr(link.href)}" target="_blank" rel="noreferrer noopener" class="fast-link-btn">
                ${icons.link} OPEN SERVER
              </a>
              <button class="fast-link-copy-btn" data-copy-url="${escapeAttr(link.href)}" title="Copy Link">
                ${icons.copy}
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function getQueryParams() {
  try {
    const hash = window.location.hash || '';
    const qIndex = hash.indexOf('?');
    if (qIndex === -1) return {};
    const params = new URLSearchParams(hash.slice(qIndex + 1));
    return Object.fromEntries(params.entries());
  } catch {
    return {};
  }
}

function getPinnedCommands() {
  return getFavorites();
}

function categorizeStarredItem(item) {
  if (item.orgId && ['fib', 'lspd', 'sahp', 'gov', 'ng'].includes(String(item.orgId).toLowerCase())) {
    return String(item.orgId).toLowerCase();
  }
  if (item.type === 'penal' || item.code) return 'penal';
  if (item.type === 'radio' || (item.text && item.text.includes('10-'))) return 'radio';
  if (item.text && (item.text.includes('bodycam') || item.text.includes('recording'))) return 'bodycam';
  return 'star';
}

function renderStarredList(items, cat, filterQ) {
  let list = items || [];
  if (cat && cat !== '__all') {
    list = list.filter(i => categorizeStarredItem(i) === cat);
  }
  if (filterQ) {
    list = list.filter(i => {
      const s = `${i.text || ''} ${i.label || ''} ${i.note || ''} ${i.orgId || ''}`.toLowerCase();
      return s.includes(filterQ);
    });
  }

  if (list.length === 0) {
    return `
      <div class="empty-state-box">
        <p>No starred items found ${filterQ ? `matching "${escapeHTML(filterQ)}"` : 'in this category'}.</p>
        <span>Click the star icon ⭐ on any command or penal code to bookmark it here for instant access!</span>
      </div>
    `;
  }

  return `
    <div class="starred-cards-grid" style="display:flex; flex-direction:column; gap:10px; margin-top:16px;">
      ${list.map((item, idx) => `
        <div class="modern-cmd-card starred-card" data-copy-cmd="${escapeAttr(item.text || item.label || '')}" style="cursor: pointer;">
          <div class="cmd-card-main">
            <div class="cmd-text-row">
              <span class="cmd-prefix" style="color: #fbbf24;">★</span>
              <p class="cmd-text-content">${escapeHTML(item.text || item.label || '')}</p>
            </div>
            ${item.note ? `<div class="cmd-note-box">${escapeHTML(item.note)}</div>` : ''}
          </div>
          <div class="cmd-card-actions">
            <button class="cmd-copy-trigger" data-copy-cmd="${escapeAttr(item.text || item.label || '')}">
              ${icons.copy}
              <span>COPY</span>
            </button>
            <button class="btn-remove-star" data-unstar-id="${escapeAttr(item.id || String(idx))}" title="Remove from starred" style="background:none; border:none; color:#ef4444; cursor:pointer; padding:6px; font-size:14px;">
              ✕
            </button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function renderStarredPage() {
  const pinned = getPinnedCommands();
  const qParams = getQueryParams();
  const initialCat = qParams.cat || '__all';

  const orgConfig = {
    bodycam: { name: 'Bodycam Commands', color: '#10b981', icon: '📷' },
    penal: { name: 'Penal Codes & Statutes', color: '#38bdf8', icon: '⚖️' },
    radio: { name: '10-Codes & Radio', color: '#3b82f6', icon: '📻' },
    fib: { name: 'FIB (Federal Bureau)', color: '#ef4444', icon: '🛡️' },
    lspd: { name: 'LSPD (Police)', color: '#06b6d4', icon: '🚓' },
    sahp: { name: 'SAHP (Highway Patrol)', color: '#f59e0b', icon: '🚔' },
    gov: { name: 'GOV / Judiciary', color: '#8b5cf6', icon: '🏛️' },
    ng: { name: 'National Guard', color: '#10b981', icon: '🪖' },
    star: { name: 'General RP Commands', color: '#fbbf24', icon: '⭐' }
  };

  const categories = {};
  pinned.forEach(item => {
    const key = categorizeStarredItem(item);
    if (!categories[key]) categories[key] = [];
    categories[key].push(item);
  });

  const content = `
    <div class="starred-page-container">
      <div class="procedure-header">
        <div class="hero-badge">PERSONAL BOOKMARKS & FAVORITES</div>
        <h1 class="neon-heading" style="color: #fbbf24;">⭐ Starred Codex & Quick-Access Vault</h1>
        <p class="penal-subtitle">Browse, search, and 1-click execute all your bookmarked Bodycam RP commands, radio 10-codes, and penal statutes organized cleanly by category.</p>
      </div>

      <div class="starred-toolbar-card">
        <div class="starred-search-bar">
          ${icons.search}
          <input type="text" id="starred-filter-input" placeholder="Search within starred items (e.g. bodycam, cuff, arrest, 10-99, fine)..." />
        </div>
        <div class="starred-actions-group">
          ${pinned.length > 0 ? `
            <button type="button" class="action-btn" id="btn-copy-all-starred" title="Copy all starred commands to clipboard">
              ${icons.copy} COPY ALL STARRED
            </button>
            <button type="button" class="action-btn" id="btn-clear-all-starred" style="color: #ef4444;" title="Clear all starred items">
              ${icons.close} CLEAR ALL
            </button>
          ` : ''}
        </div>
      </div>

      <div class="starred-cat-filter-pills" id="starred-cat-pills">
        <button type="button" class="cat-pill-btn ${initialCat === '__all' ? 'active' : ''}" data-cat="__all">
          <span>ALL CATEGORIES</span>
          <span class="cat-pill-count">${pinned.length}</span>
        </button>
        ${Object.keys(orgConfig).map(k => {
          const count = categories[k] ? categories[k].length : 0;
          if (count === 0 && initialCat !== k) return '';
          const cfg = orgConfig[k];
          return `
            <button type="button" class="cat-pill-btn ${initialCat === k ? 'active' : ''}" data-cat="${escapeAttr(k)}">
              <span>${cfg.icon} ${cfg.name}</span>
              <span class="cat-pill-count" style="color: ${cfg.color};">${count}</span>
            </button>
          `;
        }).join('')}
      </div>

      <div id="starred-content-results">
        ${renderStarredList(pinned, initialCat, '')}
      </div>
    </div>
  `;

  setTimeout(() => {
    const input = document.getElementById('starred-filter-input');
    const pills = document.getElementById('starred-cat-pills');
    const resultsContainer = document.getElementById('starred-content-results');
    const copyAllBtn = document.getElementById('btn-copy-all-starred');
    const clearAllBtn = document.getElementById('btn-clear-all-starred');

    let activeCat = initialCat;
    let filterQ = '';

    function updateView() {
      const currentPinned = getPinnedCommands();
      if (resultsContainer) {
        resultsContainer.innerHTML = renderStarredList(currentPinned, activeCat, filterQ);
      }
    }

    if (input) {
      input.addEventListener('input', (e) => {
        filterQ = e.target.value.toLowerCase().trim();
        updateView();
      });
    }

    if (pills) {
      pills.addEventListener('click', (e) => {
        const btn = e.target.closest('.cat-pill-btn');
        if (!btn) return;
        playTacticalSound('click');
        activeCat = btn.dataset.cat;
        pills.querySelectorAll('.cat-pill-btn').forEach(b => {
          b.classList.toggle('active', b.dataset.cat === activeCat);
        });
        updateView();
      });
    }

    if (copyAllBtn) {
      copyAllBtn.addEventListener('click', () => {
        const currentPinned = getPinnedCommands();
        if (currentPinned.length === 0) return;
        const text = currentPinned.map((p, i) => `${i + 1}. [${(p.orgId || 'STAR').toUpperCase()}] ${p.text}${p.note ? ' (' + p.note + ')' : ''}`).join('\n');
        copyToClipboard(text, `Copied ${currentPinned.length} starred commands!`);
      });
    }

    if (clearAllBtn) {
      clearAllBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to remove all starred items?')) {
          localStorage.setItem('grp_pinned_commands', JSON.stringify([]));
          playTacticalSound('click');
          showToast('All starred items cleared', 'info');
          render();
        }
      });
    }
  }, 0);

  return content;
}

function renderNotFound() {
  return `
    <div class="not-found-container">
      <div class="not-found-card">
        <div class="not-found-code">404</div>
        <h1 class="not-found-title">FREQUENCY DISCONNECTED</h1>
        <p class="not-found-desc">The requested department frequency or tactical route does not exist.</p>
        <a href="#/" class="hero-btn hero-btn--primary" data-nav="/">
          ${icons.building} RETURN TO COMMAND CENTER
        </a>
      </div>
    </div>
  `;
}

export function render() {
  const route = getRoute();
  let content = '';

  if (route === '/' || route === '') {
    content = renderHome();
  } else if (route === '/photos') {
    content = renderPhotosPage(getRegisteredOfficer, promptOfficerLoginModal, showToast);
  } else if (route === '/changelog') {
    content = renderChangelogPage();
  } else if (route === '/starred') {
    content = renderStarredPage();
  } else if (route === '/penal-codes') {
    content = renderPenalCodes();
  } else if (route === '/calculator') {
    content = renderCalculatorPage();
  } else if (route === '/arrest-procedure') {
    content = renderArrestProcedurePage();
  } else if (route === '/bench-trial') {
    content = renderBenchTrialPage();
  } else if (route === '/cheatsheet') {
    content = renderCheatsheetPage();
  } else if (route === '/legislation') {
    content = renderLegislationPage();
  } else if (route === '/fast-links') {
    content = renderFastLinksPage();
  } else {
    const orgId = route.replace(/^\//, '');
    const org = orgsData.find(o => o.id === orgId);
    if (org) {
      content = renderOrgPage(orgId);
    } else {
      content = renderNotFound();
    }
  }

  renderLayout(content);

  setTimeout(() => {
    attachGlobalClickListeners();
  }, 10);
}

function attachGlobalClickListeners() {
  const app = document.getElementById('app');
  if (!app) return;
  if (app.dataset.hasGlobalListeners) return;
  app.dataset.hasGlobalListeners = 'true';

  app.addEventListener('click', (e) => {
    const navLink = e.target.closest('a[data-nav]');
    if (navLink) {
      const href = navLink.getAttribute('href');
      if (href && href.startsWith('#')) {
        playTacticalSound('nav');
      }
    }

    if (e.target.closest('#hero-search-btn')) {
      openSearchModal();
    }

    const copyCmdBtn = e.target.closest('[data-copy-cmd]');
    if (copyCmdBtn) {
      const text = copyCmdBtn.dataset.copyCmd;
      copyToClipboard(text, 'Command copied to clipboard!');
    }

    const penalCopyBtn = e.target.closest('[data-copy-penal]');
    if (penalCopyBtn) {
      const text = penalCopyBtn.dataset.copyPenal;
      copyToClipboard(text, 'Penal offense copied!');
    }

    const linkCopyBtn = e.target.closest('[data-copy-url]');
    if (linkCopyBtn) {
      const url = linkCopyBtn.dataset.copyUrl;
      copyToClipboard(url, 'Invite link copied to clipboard!');
    }
  });
}

function escapeHTML(str) {
  if (str === null || str === undefined) return '';
  const div = document.createElement('div');
  div.textContent = String(str);
  return div.innerHTML;
}

function escapeAttr(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function initApp() {
  const savedThemeIdx = parseInt(localStorage.getItem('grp_theme_idx') || '0', 10);
  applyTheme(savedThemeIdx);
  applyLiteMode(liteModeEnabled);

  window.addEventListener('hashchange', render);
  window.addEventListener('popstate', render);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const themeModal = document.getElementById('theme-picker-modal');
      if (themeModal && themeModal.classList.contains('open')) {
        themeModal.classList.remove('open');
      }
      const rosterModal = document.getElementById('officers-roster-modal');
      if (rosterModal && rosterModal.classList.contains('open')) {
        rosterModal.classList.remove('open');
      }
      const officerModal = document.getElementById('officer-login-modal');
      const officer = getRegisteredOfficer();
      if (officerModal && officerModal.classList.contains('open') && officer.isRegistered) {
        officerModal.classList.remove('open');
      }
      const chatModal = document.getElementById('tactical-chat-modal');
      if (chatModal && chatModal.classList.contains('open')) {
        closeChatModal();
      }
      const suggestModal = document.getElementById('suggestion-box-modal');
      if (suggestModal && suggestModal.classList.contains('open')) {
        suggestModal.classList.remove('open');
      }
      const sidebar = document.getElementById('app-sidebar');
      const overlay = document.getElementById('sidebar-overlay');
      if (sidebar && sidebar.classList.contains('mobile-open')) {
        sidebar.classList.remove('mobile-open');
        overlay?.classList.remove('mobile-open');
      }
    }
  });

  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('roster-modal-overlay')) {
      e.target.classList.remove('open');
    }
    if (e.target.classList.contains('officer-login-modal-overlay')) {
      const officer = getRegisteredOfficer();
      if (officer.isRegistered) {
        e.target.classList.remove('open');
      }
    }
  });

  initGlobalSearch(
    (path) => navigate(path),
    (text, msg) => copyToClipboard(text, msg)
  );

  fetchChatMessages().catch(() => {});

  window.addEventListener('app:action', (e) => {
    if (e.detail?.actionId === 'play-loading') {
      triggerLoadingScreen();
    } else if (e.detail?.actionId === 'broadcast-loading') {
      broadcastLoadingScreen();
    }
  });

  let lastShiftLTime = 0;
  window.addEventListener('keydown', (e) => {
    const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName) || document.activeElement?.isContentEditable;
    if (isInput) return;

    if (e.key.toLowerCase() === 'l' && e.shiftKey && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const now = Date.now();
      if (now - lastShiftLTime < 600) {
        e.preventDefault();
        lastShiftLTime = 0;
        broadcastLoadingScreen();
      } else {
        lastShiftLTime = now;
      }
    }

    if (e.key === '[' || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b')) {
      e.preventDefault();
      const toggleBtn = document.getElementById('sidebar-toggle-btn');
      if (toggleBtn) toggleBtn.click();
    }
  });

  const savedSidebarCollapsed = localStorage.getItem('grp_sidebar_collapsed') === 'true';
  if (savedSidebarCollapsed && window.innerWidth > 768) {
    document.body.classList.add('sidebar-collapsed');
  }

  window.addEventListener('error', (e) => {
    const officer = getRegisteredOfficer();
    fetch('/api/telemetry/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'BROWSER_JS_ERROR',
        message: e.message,
        source: e.filename,
        lineno: e.lineno,
        colno: e.colno,
        stack: e.error ? e.error.stack : null,
        officer: { name: officer.name, dept: officer.dept, userId: officer.userId, badgeNo: officer.badgeNo }
      })
    }).catch(() => {});
  });

  window.addEventListener('unhandledrejection', (e) => {
    const officer = getRegisteredOfficer();
    fetch('/api/telemetry/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'UNHANDLED_PROMISE_REJECTION',
        message: e.reason ? (e.reason.message || String(e.reason)) : 'Promise rejected without error object',
        stack: e.reason ? e.reason.stack : null,
        officer: { name: officer.name, dept: officer.dept, userId: officer.userId, badgeNo: officer.badgeNo }
      })
    }).catch(() => {});
  });

  render();
  initOnlineCounter();
  startClock();

  const officer = getRegisteredOfficer();
  if (!officer.isRegistered) {
    promptOfficerLoginModal();
  } else {
    sendOfficerHeartbeat();
  }
}

document.addEventListener('DOMContentLoaded', initApp);
