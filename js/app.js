(function () {
  'use strict';
  window.PGApp = {
    init() {
      document.querySelectorAll('[data-logout]').forEach(btn => btn.addEventListener('click', () => window.PGAuth.logout()));
      document.querySelectorAll('[data-user-name]').forEach(el => { const u = window.PGAuth.current(); el.textContent = u ? u.fullName : ''; });
      document.querySelectorAll('[data-user-email]').forEach(el => { const u = window.PGAuth.current(); el.textContent = u ? u.email : ''; });
    },
    escape(value) { const div = document.createElement('div'); div.textContent = value ?? ''; return div.innerHTML; }
  };
  document.addEventListener('DOMContentLoaded', () => PGApp.init());
})();
