(function(){
  'use strict';
  const user=PGAuth.requireRole('user'); if(!user)return;
  const root=document.getElementById('trainingRoot'); if(!root)return;
  const courses=PGStore.getCourses();
  const params=new URLSearchParams(location.search);
  const requested=params.get('course');
  const topic=(params.get('topic')||'').toLowerCase();
  const progress=PGStore.getTrainingProgress();
  function esc(v){return PGApp.escape(v)}
  function getProgress(courseId){const p=progress.find(x=>x.userId===user.id&&x.courseId===courseId);return p||{userId:user.id,courseId,completedLessonIds:[],completed:false};}
  function saveProgress(p){const all=PGStore.getTrainingProgress().filter(x=>!(x.userId===user.id&&x.courseId===p.courseId));all.push(p);PGStore.write('trainingProgress',all);}
  function chooseCourse(){
    if(requested){const c=courses.find(x=>x.id===requested);if(c)return c;}
    if(topic.includes('credential')||topic.includes('password'))return courses.find(x=>x.id==='course-password');
    if(topic.includes('social')||topic.includes('sms'))return courses.find(x=>x.id==='course-social');
    return courses.find(x=>x.id==='course-links')||courses[0];
  }
  function renderList(){
    root.innerHTML=`<div class="training-grid">${courses.map(c=>{const p=getProgress(c.id);const pct=Math.round((p.completedLessonIds.length/(c.lessons?.length||1))*100);return `<button class="card training-course-card" data-course="${esc(c.id)}"><div class="eyebrow">${esc(c.category)}</div><h2>${esc(c.title)}</h2><p class="muted">${esc(c.description||'Practical security awareness training.')}</p><div class="training-meta"><span>${esc(c.level||'Beginner')}</span><span>${esc(c.duration||'')}</span></div><div class="progress-track"><span style="width:${pct}%"></span></div><div class="small muted">${pct}% complete</div></button>`}).join('')}</div>`;
    root.querySelectorAll('[data-course]').forEach(b=>b.addEventListener('click',()=>location.href='training.html?course='+encodeURIComponent(b.dataset.course)));
  }
  function renderCourse(c){
    const p=getProgress(c.id);const lessons=c.lessons||[];p.progress=Math.round((p.completedLessonIds.length/Math.max(lessons.length,1))*100);let idx=Math.min(p.currentIndex||0,Math.max(lessons.length-1,0));
    function draw(){
      const lesson=lessons[idx];const done=p.completedLessonIds.includes(lesson.id);const pct=Math.round((p.completedLessonIds.length/Math.max(lessons.length,1))*100);
      root.innerHTML=`<div class="training-course-head"><div><a class="small muted" href="training.html">← All training</a><div class="eyebrow" style="margin-top:12px">${esc(c.category)}</div><h2>${esc(c.title)}</h2><p class="muted">${esc(c.description||'')}</p></div><div class="training-progress-ring"><strong>${pct}%</strong><span>complete</span></div></div>
      <div class="training-layout"><aside class="card lesson-list"><div class="eyebrow">LESSONS</div>${lessons.map((l,i)=>`<button class="lesson-item ${i===idx?'active':''} ${p.completedLessonIds.includes(l.id)?'done':''}" data-index="${i}"><span>${p.completedLessonIds.includes(l.id)?'✓':i+1}</span><div><strong>${esc(l.title)}</strong><small>${l.type==='video'?'Video':'Lesson'}</small></div></button>`).join('')}</aside>
      <section class="card lesson-content"><div class="badge badge-neutral">${lesson.type==='video'?'VIDEO RESOURCE':'LESSON'} · ${idx+1} OF ${lessons.length}</div><h2>${esc(lesson.title)}</h2>${lesson.type==='video'?`<div class="video-card"><div class="video-placeholder">▶</div><div><h3>Watch the real training video</h3><p class="muted">This resource is hosted by the original publisher. It opens in YouTube/Microsoft Learn rather than being copied into PhishGuard.</p><a class="btn btn-primary" href="${esc(lesson.videoUrl)}" target="_blank" rel="noopener noreferrer">Open video</a></div></div>`:`<div class="lesson-text">${esc(lesson.content)}</div>`}${lesson.sourceUrl?`<div class="source-box"><div><strong>Research source</strong><div class="small muted">${esc(lesson.sourceTitle||'External security resource')}</div></div><a href="${esc(lesson.sourceUrl)}" target="_blank" rel="noopener noreferrer">Open source ↗</a></div>`:''}<div class="lesson-actions"><button class="btn btn-secondary" id="prev" ${idx===0?'disabled':''}>Previous</button><button class="btn btn-primary" id="complete">${done?(idx===lessons.length-1?'Completed':'Completed ✓ — Next'):(idx===lessons.length-1?'Mark course complete':'Mark lesson complete')}</button></div></section></div>`;
      root.querySelectorAll('[data-index]').forEach(b=>b.addEventListener('click',()=>{idx=Number(b.dataset.index);p.currentIndex=idx;saveProgress(p);draw()}));
      document.getElementById('prev').onclick=()=>{if(idx>0){idx--;p.currentIndex=idx;saveProgress(p);draw()}};
      document.getElementById('complete').onclick=()=>{if(!p.completedLessonIds.includes(lesson.id))p.completedLessonIds.push(lesson.id);if(idx<lessons.length-1){idx++;p.currentIndex=idx}else p.completed=true;p.progress=Math.round((p.completedLessonIds.length/Math.max(lessons.length,1))*100);saveProgress(p);draw();};
    }
    draw();
  }
  const course=chooseCourse();if(!course){root.innerHTML='<div class="card empty">No training courses are available yet.</div>';return;}renderCourse(course);
})();
