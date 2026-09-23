(function () {
  'use strict';
  const S = window.PGStore;

  function basePath() {
    const path = location.pathname.replace(/\\/g, '/');
    if (path.includes('/pages/') || path.includes('/admin/')) return '../';
    return '';
  }

  function routes() {
    const base = basePath();
    return {
      login: base + 'pages/login.html',
      user: base + 'pages/user-dashboard.html',
      admin: base + 'admin/dashboard.html'
    };
  }

  window.PGRoutes = routes;

  window.PGAuth = {
    login(email, password) {
      const user = S.getUserByEmail(email);
      if (!user || user.password !== password) {
        return { ok: false, message: 'Invalid email or password.' };
      }
      const session = {
        id: user.id,
        role: user.role,
        fullName: user.fullName,
        email: user.email
      };
      S.setCurrentUser(session);
      S.addEvent({ userId: user.id, type: 'login' });
      return { ok: true, user: session };
    },

    demoLogin(email) {
      const user = S.getUserByEmail(email);
      if (!user) return { ok: false, message: 'Demo account not found.' };
      const session = {
        id: user.id,
        role: user.role,
        fullName: user.fullName,
        email: user.email
      };
      S.setCurrentUser(session);
      S.addEvent({ userId: user.id, type: 'login', mode: 'demo' });
      return { ok: true, user: session };
    },

    logout() {
      const current = S.getCurrentUser();
      if (current) S.addEvent({ userId: current.id, type: 'logout' });
      S.setCurrentUser(null);
      location.href = routes().login;
    },

    current() {
      return S.getCurrentUser();
    },

    requireAuth() {
      const user = this.current();
      if (!user) {
        location.href = routes().login;
        return null;
      }
      return user;
    },

    requireRole(role) {
      const user = this.requireAuth();
      if (!user) return null;
      if (user.role !== role) {
        location.href = user.role === 'admin' ? routes().admin : routes().user;
        return null;
      }
      return user;
    },

    redirectByRole(user) {
      location.href = user.role === 'admin' ? routes().admin : routes().user;
    }
  };
})();
