(function(){
  'use strict';
  const user = PGAuth.requireRole('user');
  if (!user) return;

  const list = document.getElementById('inboxList');
  const view = document.getElementById('emailView');
  const count = document.getElementById('messageCount');

  const campaigns = PGStore.getCampaigns().filter(c => c.targetUserIds.includes(user.id) && c.status === 'active');
  const scenarios = PGStore.getScenarios();

  function esc(v){ return PGApp.escape(v); }
  function scenarioFor(c){ return scenarios.find(s => s.id === c.scenarioId); }
  function getEventTypes(campaignId){ return PGStore.getEvents().filter(e => e.userId===user.id && e.campaignId===campaignId).map(e=>e.type); }

  count.textContent = campaigns.length ? `${campaigns.length} message${campaigns.length===1?'':'s'}` : '';

  if(!campaigns.length){
    list.innerHTML = '<div class="empty">No simulations are assigned to you right now.</div>';
    return;
  }

  list.innerHTML = campaigns.map(c => {
    const s=scenarioFor(c);
    const events=getEventTypes(c.id);
    const channel=c.channel||'email'; const opened=events.includes(channel==='sms'?'sms_opened':'email_opened');
    return `<button class="inbox-row ${opened?'is-read':''}" data-campaign="${esc(c.id)}">
      <span class="mail-unread" aria-hidden="true"></span>
      <span class="mail-sender"><strong>${esc(s?.sender || 'Unknown sender')}</strong></span>
      <span class="mail-content"><strong>${esc(s?.subject || 'Simulation')}</strong><span> — ${esc((s?.body||'').slice(0,100))}</span></span>
      <span class="mail-tag">${channel==='sms'?'SMS':'Email'}</span>
      <span class="mail-arrow">›</span>
    </button>`;
  }).join('');

  list.querySelectorAll('[data-campaign]').forEach(row => row.addEventListener('click', () => openEmail(row.dataset.campaign)));

  function openEmail(campaignId){ const c=campaigns.find(x=>x.id===campaignId); if(c) window.location.href='simulation.html?campaign='+encodeURIComponent(c.id); }

  function complete(c,reported){
    PGStore.addEvent({userId:user.id,campaignId:c.id,type:'reported'});
    PGStore.addEvent({userId:user.id,campaignId:c.id,type:'simulation_completed',metadata:{reported,attempt:false}});
    view.innerHTML=`<div class="completion-state"><div class="completion-icon">✓</div><p class="eyebrow">SIMULATION COMPLETE</p><h2>Good catch.</h2><p class="muted">You reported the suspicious message before interacting with it.</p><div class="completion-actions"><a class="btn btn-primary" href="results.html">View result</a><a class="btn btn-secondary" href="user-dashboard.html">Dashboard</a></div></div>`;
    view.hidden=false;
    view.scrollIntoView({behavior:'smooth',block:'start'});
  }
})();
