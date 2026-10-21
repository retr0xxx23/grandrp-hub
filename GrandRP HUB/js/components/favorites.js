// GrandRP HUB — Favorites / Bookmarks System

const STORAGE_KEY = 'grp_favorites_v1';

function loadFavorites() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch { return []; }
}

function saveFavorites(favs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favs));
}

export function getFavorites() {
  return loadFavorites();
}

export function isFavorited(id) {
  return loadFavorites().some(f => f.id === id);
}

export function toggleFavorite(item) {
  // item = { id, type ('command'|'penal-code'|'link'), label, text, orgId?, section? }
  const favs = loadFavorites();
  const idx = favs.findIndex(f => f.id === item.id);
  if (idx >= 0) {
    favs.splice(idx, 1);
  } else {
    favs.unshift({ ...item, addedAt: Date.now() });
    if (favs.length > 100) favs.length = 100;
  }
  saveFavorites(favs);
  return idx < 0; // returns true if added, false if removed
}

export function removeFavorite(id) {
  const favs = loadFavorites().filter(f => f.id !== id);
  saveFavorites(favs);
}

export function clearAllFavorites() {
  localStorage.removeItem(STORAGE_KEY);
}

// Generate a unique ID for a favorite item
export function makeFavId(type, ...parts) {
  return `fav_${type}_${parts.join('_').replace(/[^a-zA-Z0-9]/g, '_').slice(0, 60)}`;
}
