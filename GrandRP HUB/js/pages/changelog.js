// GrandRP HUB — Changelog Page
import { icons } from '../utils/icons.js';

const changelog = [
  {
    version: '2.2',
    date: 'September 2026',
    badge: 'MAJOR',
    badgeColor: '#ef4444',
    changes: [
      { type: 'security', text: 'Added admin token authentication for destructive API endpoints' },
      { type: 'security', text: 'Server-side input sanitization on all user inputs' },
      { type: 'security', text: 'Officer registry now persisted to disk (survives server restarts)' },
      { type: 'new', text: 'Tactical Timer widget — Miranda reading, detention limit, arrest clock, and custom countdown presets' },
      { type: 'new', text: 'Favorites / Bookmarks system — star commands and penal codes for quick access' },
      { type: 'new', text: 'Keyboard shortcuts help panel — press ? to view all shortcuts' },
      { type: 'new', text: 'PWA support — install GRP HUB as a standalone app' },
      { type: 'new', text: 'Live tactical chat with IC Radio, OOC Lounge, and audit logs fully wired to backend' },
      { type: 'fix', text: 'Fixed chat endpoints missing from server (messages were never saved)' },
      { type: 'fix', text: 'Fixed undefined "users" icon rendering in roster modal' },
      { type: 'fix', text: 'Fixed CSS variables --font-body and --fg-primary being undefined' },
      { type: 'fix', text: 'Fixed light mode not applying to tactical chat and audit log modals' },
      { type: 'fix', text: 'Fixed penal code typos: dmismissal, Untill, Stoping, Breaking→Braking, Interfiring' },
      { type: 'fix', text: 'Removed duplicate Mirror Park parking zone entry (T.C. 7.1.13)' },
      { type: 'improve', text: 'Added prefers-reduced-motion accessibility support' },
      { type: 'improve', text: 'Added Firefox scrollbar styling support' },
      { type: 'improve', text: 'Modular codebase — extracted utils, components, and pages from monolithic app.js' },
      { type: 'improve', text: 'Environment variables support via dotenv (.env file)' },
      { type: 'improve', text: 'Dead CSS code cleanup (floating suggest container)' },
      { type: 'improve', text: 'Removed duplicate Google Fonts @import request' },
    ]
  },
  {
    version: '1.6.5',
    date: 'August 2026',
    badge: 'STABLE',
    badgeColor: '#10b981',
    changes: [
      { type: 'new', text: '8 premium themes including light modes (Executive White, DOJ Ivory)' },
      { type: 'new', text: 'Bench Trial verdict docket with live Discord format preview' },
      { type: 'new', text: 'Arrest SOP guide with interactive countdown timers' },
      { type: 'new', text: 'Community suggestion box dispatched to leadership' },
      { type: 'new', text: 'Global Spotlight search (Ctrl+K) across all commands, codes, and pages' },
      { type: 'new', text: 'Real-time officer roster with SSE live updates' },
      { type: 'new', text: 'Tactical loading screen broadcast system' },
      { type: 'new', text: 'Lite/Performance mode for low-end systems' },
      { type: 'improve', text: 'Sound effects system with Web Audio API synthesis' },
      { type: 'improve', text: 'Client error telemetry reporting' },
    ]
  },
  {
    version: '1.0.0',
    date: 'Early 2026',
    badge: 'INITIAL',
    badgeColor: '#3b82f6',
    changes: [
      { type: 'new', text: 'Initial release — Command Center with department directories' },
      { type: 'new', text: 'Penal Codes & Traffic Regulations reference' },
      { type: 'new', text: 'Arrest & Citation calculator with Discord report generation' },
      { type: 'new', text: '10-Codes, Miranda Rights, NATO Alphabet cheatsheet' },
      { type: 'new', text: 'Legislation PDF viewer' },
      { type: 'new', text: 'Fast links to department Discord servers' },
    ]
  }
];

const typeConfig = {
  'new':      { label: 'NEW',      color: '#10b981', icon: '✨' },
  'fix':      { label: 'FIX',      color: '#ef4444', icon: '🔧' },
  'improve':  { label: 'IMPROVED', color: '#3b82f6', icon: '⚡' },
  'security': { label: 'SECURITY', color: '#f59e0b', icon: '🔒' },
};

export function renderChangelogPage() {
  return `
    <div class="changelog-page">
      <div class="changelog-header">
        <div class="hero-badge">VERSION HISTORY</div>
        <h1 class="neon-heading">Changelog & Updates</h1>
        <p class="penal-subtitle">Track every improvement, fix, and new feature added to GrandRP HUB.</p>
      </div>

      <div class="changelog-timeline">
        ${changelog.map(release => `
          <div class="changelog-release">
            <div class="changelog-release-header">
              <div class="changelog-version-wrap">
                <span class="changelog-version">v${release.version}</span>
                <span class="changelog-badge" style="background: ${release.badgeColor}">${release.badge}</span>
              </div>
              <span class="changelog-date">${release.date}</span>
            </div>
            <div class="changelog-items">
              ${release.changes.map(change => {
                const cfg = typeConfig[change.type] || typeConfig['improve'];
                return `
                  <div class="changelog-item">
                    <span class="changelog-type-pill" style="--pill-color: ${cfg.color}">
                      ${cfg.icon} ${cfg.label}
                    </span>
                    <span class="changelog-item-text">${change.text}</span>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}
