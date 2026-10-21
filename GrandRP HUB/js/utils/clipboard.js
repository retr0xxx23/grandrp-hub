// GrandRP HUB — Clipboard & Text Utilities
export function escapeHTML(str) {
  if (str === null || str === undefined) return '';
  const div = document.createElement('div');
  div.textContent = String(str);
  return div.innerHTML;
}

export function escapeAttr(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function copyToClipboard(text, successMessage) {
  if (!text) return;
  navigator.clipboard.writeText(text).then(() => {
    playTacticalSound('copy');
    showToast(successMessage || 'Copied to clipboard!', 'success');
  }).catch(() => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    playTacticalSound('copy');
    showToast(successMessage || 'Copied to clipboard!', 'success');
  });
}
