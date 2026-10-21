// GrandRP HUB — Community Photos & Real-Time Discussion Feed
import { icons } from '../utils/icons.js';
import { playTacticalSound } from '../utils/sounds.js';
import { escapeHTML, escapeAttr } from '../utils/clipboard.js';

let photosCache = [];
let activeFilter = 'all';
let isUploading = false;
let activeLightboxPhotoId = null;

const CATEGORIES = [
  'Patrol Action',
  'Highway Patrol',
  'Special Ops',
  'Fleet & Vehicles',
  'Arrests & Pursuit',
  'Station Life',
  'Ceremonies & Awards',
  'RP Memories'
];

const DEPT_COLORS = {
  FIB: '#f59e0b',
  LSPD: '#06b6d4',
  SAHP: '#eab308',
  GOV: '#a855f7',
  NG: '#10b981',
  LEO: '#3b82f6',
  CIV: '#94a3b8'
};

function formatTimeAgo(timestamp) {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function renderPhotosPage(getRegisteredOfficerFn, promptLoginFn, showToastFn) {
  const officer = getRegisteredOfficerFn ? getRegisteredOfficerFn() : { isRegistered: false };

  const content = `
    <div class="photos-page-container">
      <div class="photos-hero-bar">
        <div class="photos-hero-content">
          <div class="hero-badge">OFFICIAL COMMUNITY ARCHIVE</div>
          <h1 class="neon-heading">📸 Patrol Photos & Live Feed</h1>
          <p class="penal-subtitle">Share real-time tactical captures, bodycam stills, fleet photos, and discuss operations with all active officers.</p>
        </div>
        <div class="photos-hero-actions">
          <button type="button" class="btn-primary-glow btn-open-upload-photo" id="btn-open-upload-photo">
            <span>📷 Post New Photo</span>
          </button>
        </div>
      </div>

      <!-- Category & Agency Filter Pills -->
      <div class="photos-filter-bar" id="photos-filter-bar">
        <button class="photo-filter-btn ${activeFilter === 'all' ? 'active' : ''}" data-filter="all">🌐 All Photos</button>
        <button class="photo-filter-btn ${activeFilter === 'FIB' ? 'active' : ''}" data-filter="FIB">🔶 FIB</button>
        <button class="photo-filter-btn ${activeFilter === 'LSPD' ? 'active' : ''}" data-filter="LSPD">🔷 LSPD</button>
        <button class="photo-filter-btn ${activeFilter === 'SAHP' ? 'active' : ''}" data-filter="SAHP">🟡 SAHP</button>
        <button class="photo-filter-btn ${activeFilter === 'GOV' ? 'active' : ''}" data-filter="GOV">🟣 GOV</button>
        <button class="photo-filter-btn ${activeFilter === 'NG' ? 'active' : ''}" data-filter="NG">🟢 NG</button>
        ${officer.isRegistered ? `<button class="photo-filter-btn ${activeFilter === 'my' ? 'active' : ''}" data-filter="my">👤 My Uploads</button>` : ''}
      </div>

      <!-- Feed / Grid View -->
      <div class="photos-feed-grid" id="photos-feed-grid">
        <div class="photos-loading-state">
          <div class="tactical-spinner"></div>
          <p>Loading real-time photos feed...</p>
        </div>
      </div>
    </div>

    <!-- Upload Photo Modal Container -->
    <div id="photo-upload-modal" class="spotlight-modal-overlay"></div>

    <!-- Lightbox Modal Container -->
    <div id="photo-lightbox-modal" class="spotlight-modal-overlay"></div>
  `;

  setTimeout(() => {
    initPhotosPage(getRegisteredOfficerFn, promptLoginFn, showToastFn);
  }, 0);

  return content;
}

function initPhotosPage(getRegisteredOfficerFn, promptLoginFn, showToastFn) {
  fetchPhotos(getRegisteredOfficerFn, showToastFn);

  // Upload button
  document.getElementById('btn-open-upload-photo')?.addEventListener('click', () => {
    const officer = getRegisteredOfficerFn ? getRegisteredOfficerFn() : { isRegistered: false };
    if (!officer.isRegistered) {
      showToastFn?.('Please login with your officer credentials first to post photos', 'info');
      promptLoginFn?.();
      return;
    }
    openUploadModal(officer, showToastFn, () => fetchPhotos(getRegisteredOfficerFn, showToastFn));
  });

  // Filter bar
  document.getElementById('photos-filter-bar')?.addEventListener('click', (e) => {
    const btn = e.target.closest('.photo-filter-btn');
    if (!btn) return;
    playTacticalSound('click');
    activeFilter = btn.dataset.filter;
    document.querySelectorAll('.photo-filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderGrid(getRegisteredOfficerFn, showToastFn);
  });

  // Real-time Event Listeners (SSE pushes)
  window.removeEventListener('photos:new', handleRealtimeNewPhoto);
  window.addEventListener('photos:new', handleRealtimeNewPhoto);

  window.removeEventListener('photos:comment', handleRealtimeNewComment);
  window.addEventListener('photos:comment', handleRealtimeNewComment);

  window.removeEventListener('photos:like', handleRealtimeLike);
  window.addEventListener('photos:like', handleRealtimeLike);

  window.removeEventListener('photos:delete', handleRealtimeDelete);
  window.addEventListener('photos:delete', handleRealtimeDelete);
}

function handleRealtimeNewPhoto(e) {
  const photo = e.detail;
  if (!photo || !photo.id) return;
  if (!photosCache.some(p => p.id === photo.id)) {
    photosCache.unshift(photo);
    playTacticalSound('mention');
    renderGrid();
  }
}

function addCommentToPhoto(photo, comment) {
  if (!photo || !comment) return false;
  if (!photo.comments) photo.comments = [];
  if (comment.id && photo.comments.some(c => c.id === comment.id)) {
    return false;
  }
  const isDuplicate = photo.comments.some(c =>
    c.userId === comment.userId &&
    c.text === comment.text &&
    Math.abs((c.timestamp || 0) - (comment.timestamp || 0)) < 5000
  );
  if (isDuplicate) return false;
  photo.comments.push(comment);
  return true;
}

function handleRealtimeNewComment(e) {
  const { photoId, comment } = e.detail || {};
  if (!photoId || !comment) return;
  const photo = photosCache.find(p => p.id === photoId);
  if (photo) {
    if (addCommentToPhoto(photo, comment)) {
      playTacticalSound('chat');
      updatePhotoCommentsDOM(photoId);
      if (activeLightboxPhotoId === photoId) {
        updateLightboxCommentsDOM(photoId);
      }
    }
  }
}

function handleRealtimeLike(e) {
  const { photoId, likes, likedBy } = e.detail || {};
  const photo = photosCache.find(p => p.id === photoId);
  if (photo) {
    photo.likes = likes;
    photo.likedBy = likedBy;
    updatePhotoLikesDOM(photoId);
  }
}

function handleRealtimeDelete(e) {
  const { photoId } = e.detail || {};
  if (!photoId) return;
  photosCache = photosCache.filter(p => p.id !== photoId);
  renderGrid();
}

async function fetchPhotos(getRegisteredOfficerFn, showToastFn) {
  const grid = document.getElementById('photos-feed-grid');
  try {
    const res = await fetch('/api/photos');
    const data = await res.json();
    photosCache = data.photos || [];
    renderGrid(getRegisteredOfficerFn, showToastFn);
  } catch (err) {
    if (grid) {
      grid.innerHTML = `
        <div class="photos-error-box">
          <p>⚠️ Unable to synchronize photo archives</p>
          <button class="btn-refresh-feed" onclick="location.reload()">Retry Connection</button>
        </div>
      `;
    }
  }
}

function renderGrid(getRegisteredOfficerFn, showToastFn) {
  const grid = document.getElementById('photos-feed-grid');
  if (!grid) return;

  const officer = getRegisteredOfficerFn ? getRegisteredOfficerFn() : { isRegistered: false };

  let filtered = [...photosCache];
  if (activeFilter === 'my') {
    filtered = filtered.filter(p => p.userId === officer.userId);
  } else if (activeFilter !== 'all') {
    filtered = filtered.filter(p => (p.dept || '').toUpperCase() === activeFilter);
  }

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="photos-empty-state">
        <span class="empty-icon">📷</span>
        <h3>No photos found in this category</h3>
        <p>Be the first officer to post a patrol capture or action photo!</p>
        <button class="btn-primary-glow btn-open-upload-photo-empty">Upload Photo</button>
      </div>
    `;
    grid.querySelector('.btn-open-upload-photo-empty')?.addEventListener('click', () => {
      document.getElementById('btn-open-upload-photo')?.click();
    });
    return;
  }

  grid.innerHTML = filtered.map(p => {
    const isLiked = p.likedBy && p.likedBy.includes(officer.userId);
    const deptColor = DEPT_COLORS[p.dept] || '#3b82f6';
    const isAuthor = officer.isRegistered && (officer.userId === p.userId);

    return `
      <div class="photo-card" id="photo-card-${p.id}">
        <!-- Author Header -->
        <div class="photo-card-header">
          <div class="photo-author-left">
            <div class="photo-author-avatar" style="border-color: ${deptColor}80; background: ${deptColor}20;">
              <span>${escapeHTML(p.dept || 'LEO')}</span>
            </div>
            <div class="photo-author-meta">
              <div class="author-name-row">
                <span class="photo-author-name">${escapeHTML(p.author)}</span>
                <span class="photo-dept-tag" style="background: ${deptColor}25; color: ${deptColor}; border-color: ${deptColor}60;">
                  #${escapeHTML(p.badgeNo || '000')} ${escapeHTML(p.dept || 'LEO')}
                </span>
              </div>
              <span class="photo-time">${formatTimeAgo(p.timestamp)}</span>
            </div>
          </div>
          <div class="photo-header-right">
            <span class="photo-category-pill">${escapeHTML(p.category || 'Patrol')}</span>
            ${isAuthor ? `
              <button class="btn-delete-photo" data-del-photo="${p.id}" title="Delete this photo">
                ${icons.close}
              </button>
            ` : ''}
          </div>
        </div>

        <!-- Photo Image & Lightbox Trigger -->
        <div class="photo-image-wrap" data-open-lightbox="${p.id}">
          <img src="${escapeAttr(p.imageUrl)}" alt="${escapeAttr(p.title || 'Patrol Photo')}" loading="lazy" />
          <div class="photo-zoom-overlay">
            <span>🔍 View Full & Chat (${(p.comments || []).length})</span>
          </div>
        </div>

        <!-- Title & Caption -->
        <div class="photo-card-body">
          ${p.title ? `<h3 class="photo-card-title">${escapeHTML(p.title)}</h3>` : ''}
          ${p.caption ? `<p class="photo-card-caption">${escapeHTML(p.caption)}</p>` : ''}
        </div>

        <!-- Actions Bar -->
        <div class="photo-card-actions">
          <button class="btn-photo-like ${isLiked ? 'liked' : ''}" data-like-photo="${p.id}">
            <span class="like-icon">${isLiked ? '❤️' : '🤍'}</span>
            <span class="like-count" id="like-count-${p.id}">${p.likes || 0}</span>
          </button>
          <button class="btn-photo-comment-toggle" data-open-lightbox="${p.id}">
            <span>💬 Discussion (${(p.comments || []).length})</span>
          </button>
        </div>

        <!-- Inline Recent Comments -->
        <div class="photo-inline-comments" id="inline-comments-${p.id}">
          ${renderInlineComments(p)}
        </div>

        <!-- Inline Add Comment Input -->
        <form class="photo-comment-input-form" data-comment-form="${p.id}">
          <input 
            type="text" 
            class="photo-comment-input" 
            placeholder="${officer.isRegistered ? 'Talk with officers / add comment...' : 'Login to join discussion...'}" 
            ${!officer.isRegistered ? 'disabled' : ''}
            required 
          />
          <button type="submit" class="btn-submit-comment" ${!officer.isRegistered ? 'disabled' : ''}>
            <span>Send</span>
          </button>
        </form>
      </div>
    `;
  }).join('');

  attachGridListeners(getRegisteredOfficerFn, showToastFn);
}

function renderInlineComments(photo) {
  const comments = photo.comments || [];
  if (comments.length === 0) {
    return `<span class="no-comments-yet">No messages yet. Be the first to start the conversation!</span>`;
  }
  const recent = comments.slice(-3); // show last 3 comments
  return `
    <div class="inline-comments-list">
      ${recent.map(c => {
        const cDeptColor = DEPT_COLORS[c.dept] || '#3b82f6';
        return `
          <div class="inline-comment-row">
            <span class="comment-author-tag" style="color: ${cDeptColor};">
              [${escapeHTML(c.dept || 'LEO')}] ${escapeHTML(c.author)}:
            </span>
            <span class="comment-text-body">${escapeHTML(c.text)}</span>
            <span class="comment-timestamp">${formatTimeAgo(c.timestamp)}</span>
          </div>
        `;
      }).join('')}
      ${comments.length > 3 ? `
        <button class="btn-view-all-comments" data-open-lightbox="${photo.id}">
          View all ${comments.length} comments & live chat →
        </button>
      ` : ''}
    </div>
  `;
}

function attachGridListeners(getRegisteredOfficerFn, showToastFn) {
  const grid = document.getElementById('photos-feed-grid');
  if (!grid) return;

  const officer = getRegisteredOfficerFn ? getRegisteredOfficerFn() : { isRegistered: false };

  // Lightbox view
  grid.querySelectorAll('[data-open-lightbox]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      const photoId = el.dataset.openLightbox;
      openLightboxModal(photoId, getRegisteredOfficerFn, showToastFn);
    });
  });

  // Like button
  grid.querySelectorAll('[data-like-photo]').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      if (!officer.isRegistered) {
        showToastFn?.('Login with your officer credentials to like photos', 'info');
        return;
      }
      const photoId = btn.dataset.likePhoto;
      playTacticalSound('click');
      try {
        const res = await fetch(`/api/photos/${photoId}/like`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: officer.userId })
        });
        const data = await res.json();
        if (data.success) {
          const photo = photosCache.find(p => p.id === photoId);
          if (photo) {
            photo.likes = data.likes;
            photo.likedBy = data.likedBy;
            updatePhotoLikesDOM(photoId);
          }
        }
      } catch {}
    });
  });

  // Delete photo button
  grid.querySelectorAll('[data-del-photo]').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const photoId = btn.dataset.delPhoto;
      if (!confirm('Are you sure you want to permanently delete this photo?')) return;
      playTacticalSound('click');
      try {
        const res = await fetch(`/api/photos/${photoId}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: officer.userId })
        });
        const data = await res.json();
        if (data.success) {
          showToastFn?.('Photo removed from community archive', 'info');
          photosCache = photosCache.filter(p => p.id !== photoId);
          renderGrid(getRegisteredOfficerFn, showToastFn);
        }
      } catch {}
    });
  });

  // Inline comment form submit
  grid.querySelectorAll('[data-comment-form]').forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!officer.isRegistered) return;
      const photoId = form.dataset.commentForm;
      const input = form.querySelector('.photo-comment-input');
      const text = input.value.trim();
      if (!text) return;

      input.disabled = true;
      try {
        const res = await fetch(`/api/photos/${photoId}/comments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            author: officer.name,
            userId: officer.userId,
            badgeNo: officer.badgeNo,
            dept: officer.dept,
            text
          })
        });
        const data = await res.json();
        if (data.success && data.comment) {
          input.value = '';
          const photo = photosCache.find(p => p.id === photoId);
          if (photo && addCommentToPhoto(photo, data.comment)) {
            playTacticalSound('chat');
            updatePhotoCommentsDOM(photoId);
          }
        }
      } catch {
        showToastFn?.('Failed to submit comment', 'error');
      } finally {
        input.disabled = false;
        input.focus();
      }
    });
  });
}

function updatePhotoLikesDOM(photoId) {
  const photo = photosCache.find(p => p.id === photoId);
  if (!photo) return;
  const countEl = document.getElementById(`like-count-${photoId}`);
  if (countEl) countEl.textContent = photo.likes || 0;
  const btn = document.querySelector(`[data-like-photo="${photoId}"]`);
  if (btn) {
    const isLiked = photo.likedBy && photo.likedBy.includes(localStorage.getItem('grp_officer_userid'));
    btn.classList.toggle('liked', !!isLiked);
    const iconSpan = btn.querySelector('.like-icon');
    if (iconSpan) iconSpan.textContent = isLiked ? '❤️' : '🤍';
  }
}

function updatePhotoCommentsDOM(photoId) {
  const photo = photosCache.find(p => p.id === photoId);
  if (!photo) return;
  const container = document.getElementById(`inline-comments-${photoId}`);
  if (container) {
    container.innerHTML = renderInlineComments(photo);
  }
  const toggleBtn = document.querySelector(`.photo-card#photo-card-${photoId} .btn-photo-comment-toggle span`);
  if (toggleBtn) {
    toggleBtn.textContent = `💬 Discussion (${(photo.comments || []).length})`;
  }
}

// ─── LIGHTBOX MODAL & REAL-TIME CHAT ───────────────────────────
function openLightboxModal(photoId, getRegisteredOfficerFn, showToastFn) {
  activeLightboxPhotoId = photoId;
  const photo = photosCache.find(p => p.id === photoId);
  if (!photo) return;

  const modal = document.getElementById('photo-lightbox-modal');
  if (!modal) return;

  const officer = getRegisteredOfficerFn ? getRegisteredOfficerFn() : { isRegistered: false };
  const deptColor = DEPT_COLORS[photo.dept] || '#3b82f6';

  modal.innerHTML = `
    <div class="photo-lightbox-card">
      <button class="lightbox-close-btn" id="btn-close-lightbox">${icons.close}</button>
      
      <div class="lightbox-split-layout">
        <!-- Left: Full Image -->
        <div class="lightbox-media-panel">
          <img src="${escapeAttr(photo.imageUrl)}" alt="${escapeAttr(photo.title || 'Patrol Photo')}" class="lightbox-full-img" />
        </div>

        <!-- Right: Live Chat & Discussion Thread -->
        <div class="lightbox-chat-panel">
          <!-- Photo Author Header -->
          <div class="lightbox-header-bar">
            <div class="author-name-row">
              <span class="photo-author-name">${escapeHTML(photo.author)}</span>
              <span class="photo-dept-tag" style="background: ${deptColor}25; color: ${deptColor}; border-color: ${deptColor}60;">
                #${escapeHTML(photo.badgeNo || '000')} ${escapeHTML(photo.dept || 'LEO')}
              </span>
            </div>
            <span class="photo-time">${formatTimeAgo(photo.timestamp)}</span>
          </div>

          <div class="lightbox-info-box">
            ${photo.title ? `<h3 class="lightbox-title">${escapeHTML(photo.title)}</h3>` : ''}
            ${photo.caption ? `<p class="lightbox-caption">${escapeHTML(photo.caption)}</p>` : ''}
          </div>

          <!-- Live Chat Messages Viewport -->
          <div class="lightbox-messages-viewport" id="lightbox-messages-viewport">
            ${renderLightboxMessages(photo)}
          </div>

          <!-- Live Chat Input Bar -->
          <form class="lightbox-chat-input-bar" id="lightbox-chat-form">
            <input 
              type="text" 
              id="lightbox-comment-input" 
              placeholder="${officer.isRegistered ? 'Talk in real-time with officers...' : 'Login to join real-time chat...'}" 
              ${!officer.isRegistered ? 'disabled' : ''}
              required 
              autocomplete="off"
            />
            <button type="submit" class="btn-lightbox-send" ${!officer.isRegistered ? 'disabled' : ''}>
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  `;

  modal.classList.add('open');

  const close = () => {
    activeLightboxPhotoId = null;
    modal.classList.remove('open');
  };

  document.getElementById('btn-close-lightbox')?.addEventListener('click', close);
  modal.onclick = (e) => {
    if (e.target === modal) close();
  };

  // Scroll messages to bottom
  const vp = document.getElementById('lightbox-messages-viewport');
  if (vp) vp.scrollTop = vp.scrollHeight;

  // Handle comment submit in modal
  document.getElementById('lightbox-chat-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!officer.isRegistered) return;
    const input = document.getElementById('lightbox-comment-input');
    const text = input.value.trim();
    if (!text) return;

    input.disabled = true;
    try {
      const res = await fetch(`/api/photos/${photo.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: officer.name,
          userId: officer.userId,
          badgeNo: officer.badgeNo,
          dept: officer.dept,
          text
        })
      });
      const data = await res.json();
      if (data.success && data.comment) {
        input.value = '';
        if (addCommentToPhoto(photo, data.comment)) {
          playTacticalSound('chat');
          updateLightboxCommentsDOM(photo.id);
          updatePhotoCommentsDOM(photo.id);
        }
      }
    } catch {
      showToastFn?.('Failed to send comment', 'error');
    } finally {
      input.disabled = false;
      input.focus();
    }
  });
}

function renderLightboxMessages(photo) {
  const comments = photo.comments || [];
  if (comments.length === 0) {
    return `<div class="lightbox-empty-chat">💬 No comments yet. Start the real-time discussion below!</div>`;
  }

  return comments.map(c => {
    const cColor = DEPT_COLORS[c.dept] || '#3b82f6';
    return `
      <div class="lightbox-msg-row">
        <div class="lightbox-msg-meta">
          <span class="msg-author" style="color: ${cColor};">${escapeHTML(c.author)}</span>
          <span class="msg-dept" style="color: ${cColor};">[${escapeHTML(c.dept || 'LEO')} #${escapeHTML(c.badgeNo || '')}]</span>
          <span class="msg-time">${formatTimeAgo(c.timestamp)}</span>
        </div>
        <div class="lightbox-msg-body">${escapeHTML(c.text)}</div>
      </div>
    `;
  }).join('');
}

function updateLightboxCommentsDOM(photoId) {
  const photo = photosCache.find(p => p.id === photoId);
  if (!photo) return;
  const vp = document.getElementById('lightbox-messages-viewport');
  if (vp) {
    vp.innerHTML = renderLightboxMessages(photo);
    vp.scrollTop = vp.scrollHeight;
  }
}

// ─── UPLOAD PHOTO MODAL ────────────────────────────────────────
function openUploadModal(officer, showToastFn, onUploaded) {
  const modal = document.getElementById('photo-upload-modal');
  if (!modal) return;

  let selectedImageDataUrl = '';

  modal.innerHTML = `
    <div class="photo-upload-dialog">
      <div class="photo-upload-header">
        <h2>📷 Post New Patrol Photo</h2>
        <button class="upload-modal-close" id="btn-close-upload-modal">${icons.close}</button>
      </div>

      <form id="photo-upload-form" class="photo-upload-form">
        <!-- Mode Tabs: File Upload or Image URL -->
        <div class="upload-mode-toggle">
          <button type="button" class="upload-tab-btn active" id="tab-mode-file">📁 Upload Image File</button>
          <button type="button" class="upload-tab-btn" id="tab-mode-url">🔗 Image Web URL</button>
        </div>

        <!-- File Picker / Drag & Drop -->
        <div class="upload-file-area" id="upload-file-area">
          <div class="drop-zone" id="photo-drop-zone">
            <span class="drop-icon">📸</span>
            <p>Drag & Drop tactical screenshot here or <label for="photo-file-input" class="file-browse-label">Browse File</label></p>
            <span class="drop-hint">Supports PNG, JPG, WEBP (Max 15MB)</span>
            <input type="file" id="photo-file-input" accept="image/*" style="display:none;" />
          </div>
        </div>

        <!-- URL Input Area -->
        <div class="upload-url-area" id="upload-url-area" style="display:none;">
          <label for="photo-input-url">Direct Image URL:</label>
          <input type="url" id="photo-input-url" class="tactical-input" placeholder="https://i.imgur.com/... or Discord CDN image URL" />
        </div>

        <!-- Live Preview Thumbnail -->
        <div class="photo-preview-box" id="photo-preview-box" style="display:none;">
          <img id="photo-preview-img" src="" alt="Preview" />
          <button type="button" class="btn-clear-preview" id="btn-clear-preview">✕ Remove Image</button>
        </div>

        <div class="photo-form-field">
          <label for="photo-input-title">Photo Title / Operation Name:</label>
          <input type="text" id="photo-input-title" class="tactical-input" placeholder="e.g. Joint FIB & SAHP High-Speed Pursuit" required />
        </div>

        <div class="photo-form-field">
          <label for="photo-select-category">Category:</label>
          <select id="photo-select-category" class="tactical-select">
            ${CATEGORIES.map(c => `<option value="${escapeAttr(c)}">${escapeHTML(c)}</option>`).join('')}
          </select>
        </div>

        <div class="photo-form-field">
          <label for="photo-input-caption">Tactical Briefing / Caption:</label>
          <textarea id="photo-input-caption" class="tactical-textarea" rows="3" placeholder="Describe the scene, participating officers, or key tactical events..."></textarea>
        </div>

        <div class="photo-upload-footer">
          <span class="upload-as-tag">Posting as: <strong>${escapeHTML(officer.name)}</strong> (#${escapeHTML(officer.badgeNo)}) [${escapeHTML(officer.dept)}]</span>
          <button type="submit" class="btn-submit-photo" id="btn-submit-photo">
            <span>🚀 Publish Photo</span>
          </button>
        </div>
      </form>
    </div>
  `;

  modal.classList.add('open');

  const close = () => modal.classList.remove('open');
  document.getElementById('btn-close-upload-modal')?.addEventListener('click', close);
  modal.onclick = (e) => { if (e.target === modal) close(); };

  // Mode tabs
  const tabFile = document.getElementById('tab-mode-file');
  const tabUrl = document.getElementById('tab-mode-url');
  const fileArea = document.getElementById('upload-file-area');
  const urlArea = document.getElementById('upload-url-area');
  const previewBox = document.getElementById('photo-preview-box');
  const previewImg = document.getElementById('photo-preview-img');
  const clearBtn = document.getElementById('btn-clear-preview');

  tabFile?.addEventListener('click', () => {
    tabFile.classList.add('active');
    tabUrl.classList.remove('active');
    fileArea.style.display = 'block';
    urlArea.style.display = 'none';
  });

  tabUrl?.addEventListener('click', () => {
    tabUrl.classList.add('active');
    tabFile.classList.remove('active');
    fileArea.style.display = 'none';
    urlArea.style.display = 'block';
  });

  // File input change
  const fileInput = document.getElementById('photo-file-input');
  fileInput?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) handleFile(file);
  });

  // Drag & drop
  const dropZone = document.getElementById('photo-drop-zone');
  if (dropZone) {
    ['dragenter', 'dragover'].forEach(name => {
      dropZone.addEventListener(name, (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
      });
    });
    ['dragleave', 'drop'].forEach(name => {
      dropZone.addEventListener(name, (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
      });
    });
    dropZone.addEventListener('drop', (e) => {
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    });
  }

  function handleFile(file) {
    if (!file.type.startsWith('image/')) {
      showToastFn?.('Only image files (PNG, JPG, WEBP) are supported', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      selectedImageDataUrl = event.target.result;
      previewImg.src = selectedImageDataUrl;
      previewBox.style.display = 'block';
      fileArea.style.display = 'none';
    };
    reader.readAsDataURL(file);
  }

  // URL input change
  const urlInput = document.getElementById('photo-input-url');
  urlInput?.addEventListener('input', () => {
    const url = urlInput.value.trim();
    if (url.startsWith('http')) {
      selectedImageDataUrl = url;
      previewImg.src = url;
      previewBox.style.display = 'block';
    }
  });

  clearBtn?.addEventListener('click', () => {
    selectedImageDataUrl = '';
    previewBox.style.display = 'none';
    if (tabFile.classList.contains('active')) {
      fileArea.style.display = 'block';
    } else {
      urlArea.style.display = 'block';
    }
    if (fileInput) fileInput.value = '';
    if (urlInput) urlInput.value = '';
  });

  // Form submit
  document.getElementById('photo-upload-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!selectedImageDataUrl) {
      showToastFn?.('Please upload an image file or enter an image URL', 'error');
      return;
    }
    const title = document.getElementById('photo-input-title')?.value.trim();
    const category = document.getElementById('photo-select-category')?.value;
    const caption = document.getElementById('photo-input-caption')?.value.trim();

    const submitBtn = document.getElementById('btn-submit-photo');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>⏳ Uploading...</span>';
    }

    try {
      const res = await fetch('/api/photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category,
          caption,
          imageUrl: selectedImageDataUrl,
          author: officer.name,
          userId: officer.userId,
          badgeNo: officer.badgeNo,
          dept: officer.dept
        })
      });
      const data = await res.json();
      if (data.success) {
        playTacticalSound('success');
        showToastFn?.('📸 Photo published to community feed!', 'success');
        close();
        if (onUploaded) onUploaded();
      } else {
        showToastFn?.(data.error || 'Failed to upload photo', 'error');
      }
    } catch {
      showToastFn?.('Network error while uploading photo', 'error');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>🚀 Publish Photo</span>';
      }
    }
  });
}
