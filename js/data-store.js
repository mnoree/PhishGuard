/* PhishGuard V3 — Demo Data Store
   Frontend-only academic demo. Not production authentication or persistence. */
(function () {
  'use strict';
  const PREFIX = 'phishguard_v3_';
  const KEYS = {
    users: 'users', currentUser: 'current_user', campaigns: 'campaigns',
    scenarios: 'scenarios', events: 'events', courses: 'courses',
    trainingProgress: 'training_progress', resetTokens: 'reset_tokens',
    initialized: 'initialized'
  };

  function key(name) { return PREFIX + KEYS[name]; }
  function read(name, fallback) {
    try { const raw = localStorage.getItem(key(name)); return raw ? JSON.parse(raw) : fallback; }
    catch (_) { return fallback; }
  }
  function write(name, value) { localStorage.setItem(key(name), JSON.stringify(value)); return value; }
  function id(prefix) { return prefix + '-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8); }

  window.PGStore = {
    key,
    read,
    write,
    id,
    getUsers: () => read('users', []),
    setUsers: (v) => write('users', v),
    getCurrentUser: () => read('currentUser', null),
    setCurrentUser: (v) => v ? write('currentUser', v) : localStorage.removeItem(key('currentUser')),
    getCampaigns: () => read('campaigns', []),
    setCampaigns: (v) => write('campaigns', v),
    addCampaign(campaign) { const campaigns = this.getCampaigns(); campaigns.push(campaign); this.setCampaigns(campaigns); return campaign; },
    updateCampaign(campaignId, patch) { const campaigns = this.getCampaigns().map(c => c.id === campaignId ? { ...c, ...patch } : c); this.setCampaigns(campaigns); return campaigns.find(c => c.id === campaignId); },
    getScenarios: () => read('scenarios', []),
    setScenarios: (v) => write('scenarios', v),
    addScenario(scenario) { const scenarios = this.getScenarios(); scenarios.push(scenario); this.setScenarios(scenarios); return scenario; },
    updateScenario(scenarioId, patch) { const scenarios = this.getScenarios().map(s => s.id === scenarioId ? { ...s, ...patch, updatedAt: new Date().toISOString() } : s); this.setScenarios(scenarios); return scenarios.find(s => s.id === scenarioId); },
    getEvents: () => read('events', []),
    getCourses: () => read('courses', []),
    getTrainingProgress: () => read('trainingProgress', []),
    addEvent(event) { const events = this.getEvents(); events.push({ id: id('evt'), timestamp: new Date().toISOString(), ...event }); write('events', events); return events.at(-1); },
    updateUser(userId, patch) { const users = this.getUsers().map(u => u.id === userId ? { ...u, ...patch } : u); this.setUsers(users); const current = this.getCurrentUser(); if (current && current.id === userId) this.setCurrentUser({ ...current, ...patch }); return users.find(u => u.id === userId); },
    getUserByEmail(email) { return this.getUsers().find(u => u.email.toLowerCase() === email.trim().toLowerCase()); },
    getUserById(userId) { return this.getUsers().find(u => u.id === userId); },
    reset() { Object.values(KEYS).forEach(k => localStorage.removeItem(PREFIX + k)); }
  };
})();
