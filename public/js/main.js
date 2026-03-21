// Theme toggle
const toggle = document.querySelector('.theme-toggle');
const html = document.documentElement;

const savedTheme = localStorage.getItem('charchar-theme');
if (savedTheme) {
  html.setAttribute('data-theme', savedTheme);
}

if (toggle) {
  toggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('charchar-theme', next);
  });
}

// Copy buttons
document.querySelectorAll('.copy-btn').forEach(btn => {
  btn.addEventListener('click', async () => {
    const text = btn.getAttribute('data-copy');
    try {
      await navigator.clipboard.writeText(text);
      btn.classList.add('copied');
      const original = btn.textContent;
      btn.textContent = '✓';
      setTimeout(() => {
        btn.classList.remove('copied');
        btn.textContent = original;
      }, 1500);
    } catch (e) {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
  });
});
