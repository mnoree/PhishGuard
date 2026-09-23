(function () {
  'use strict';
  const user = window.PGAuth.requireRole('user');
  if (!user) return;

  const campaigns = PGStore.getCampaigns().filter(c =>
    c.status === 'active' && c.targetUserIds.includes(user.id)
  );
  const events = PGStore.getEvents().filter(e => e.userId === user.id);
  const progress = PGStore.getTrainingProgress().filter(p => p.userId === user.id);
  const courses = PGStore.getCourses();

  const completedCampaignIds = new Set(
    events.filter(e => e.type === 'simulation_completed').map(e => e.campaignId)
  );
  const reported = events.filter(e => e.type === 'reported').length;
  const completed = events.filter(e => e.type === 'simulation_completed').length;
  const trainingPercent = progress.length
    ? Math.round(progress.reduce((sum, p) => sum + (p.progress || 0), 0) / progress.length)
    : 0;

  let score = 100;
  events.forEach(e => {
    if (e.type === 'reported') score += 5;
    if (e.type === 'email_opened') score -= 5;
    if (e.type === 'link_clicked') score -= 20;
    if (e.type === 'credential_attempt') score -= 35;
  });
  score = Math.max(0, Math.min(100, score));

  const firstName = (user.fullName || 'there').split(' ')[0];
  document.querySelector('[data-first-name]').textContent = firstName;
  document.querySelector('[data-user-initial]').textContent = firstName.charAt(0).toUpperCase();
  document.getElementById('scoreValue').textContent = score;
  document.getElementById('simCount').textContent = campaigns.length;
  document.getElementById('completedCount').textContent = completed;
  document.getElementById('reportedCount').textContent = reported;
  document.getElementById('trainingCount').textContent = trainingPercent + '%';

  const scoreLabel = document.getElementById('scoreLabel');
  if (score >= 85) scoreLabel.textContent = 'Strong awareness';
  else if (score >= 70) scoreLabel.textContent = 'Good progress';
  else if (score >= 50) scoreLabel.textContent = 'Needs attention';
  else scoreLabel.textContent = 'High risk — training recommended';

  const scoreRing = document.getElementById('scoreRing');
  scoreRing.style.setProperty('--score', score * 3.6 + 'deg');

  const list = document.getElementById('campaignList');
  list.innerHTML = campaigns.length ? campaigns.map(c => {
    const s = PGStore.getScenarios().find(x => x.id === c.scenarioId);
    const done = completedCampaignIds.has(c.id);
    return `<article class="simulation-card">
      <div class="simulation-card-top">
        <span class="badge ${done ? 'badge-neutral' : 'badge-success'}">${done ? 'Completed' : 'Assigned'}</span>
        <span class="muted small">${s.difficulty}</span>
      </div>
      <h3>${s.title}</h3>
      <p class="muted">${s.category} · ${s.sender}</p>
      <p class="simulation-description">${s.body}</p>
      <a class="btn ${done ? 'btn-secondary' : 'btn-primary'}" href="simulation.html?campaign=${encodeURIComponent(c.id)}">${done ? 'Review simulation' : 'Start simulation'}</a>
    </article>`;
  }).join('') : '<div class="card empty">You have no active simulations right now.</div>';

  const recommended = chooseCourse(events, courses, progress);
  document.getElementById('recommendationTitle').textContent = recommended.title;
  document.getElementById('recommendationMeta').textContent = `${recommended.category} · ${recommended.duration}`;
  document.getElementById('recommendationReason').textContent = recommended.reason;
  document.getElementById('recommendationLink').href = 'pages/training.html?course=' + encodeURIComponent(recommended.id);

  const activity = document.getElementById('activityList');
  const recent = [...events].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 5);
  activity.innerHTML = recent.length ? recent.map(e => {
    const labels = {
      reported: ['Reported a suspicious email', 'success'],
      link_clicked: ['Clicked a simulated link', 'warning'],
      credential_attempt: ['Attempted simulated sign-in', 'danger'],
      simulation_completed: ['Completed a phishing simulation', 'success'],
      simulation_started: ['Started a phishing simulation', 'neutral']
    };
    const [label, tone] = labels[e.type] || [e.type.replaceAll('_', ' '), 'neutral'];
    return `<li><span class="activity-dot ${tone}"></span><div><strong>${label}</strong><span class="muted small">${formatDate(e.timestamp)}</span></div></li>`;
  }).join('') : '<li class="empty">No activity yet. Your simulation activity will appear here.</li>';

  function chooseCourse(evts, allCourses, prog) {
    const attemptedCredential = evts.some(e => e.type === 'credential_attempt');
    const clicked = evts.some(e => e.type === 'link_clicked');
    const social = evts.some(e => e.type === 'social_engineering_triggered');
    const doneIds = new Set(prog.filter(p => (p.progress ?? (p.completed ? 100 : 0)) >= 100).map(p => p.courseId));
    let course = attemptedCredential ? allCourses.find(c => c.id === 'course-password')
      : clicked ? allCourses.find(c => c.id === 'course-links')
      : social ? allCourses.find(c => c.id === 'course-social')
      : allCourses[0];
    course = course || allCourses[0] || { id: '', title: 'Explore security training', category: 'Awareness', duration: '15 min' };
    if (doneIds.has(course.id)) course = allCourses.find(c => !doneIds.has(c.id)) || course;
    return {
      ...course,
      reason: attemptedCredential ? 'Recommended because a simulated sign-in attempt was detected.'
        : clicked ? 'Recommended because a suspicious link was opened in a simulation.'
        : 'Build your baseline phishing detection skills before your next simulation.'
    };
  }

  function formatDate(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }
})();
