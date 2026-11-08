(function () {
  'use strict';
  const data=window.HEARD_CONTENT||{};
  const escape = s => String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const byId = id=>document.getElementById(id);
  const safeHref=u=>/^https:\/\//.test(String(u))||/^mailto:/.test(String(u))?u:'#';
  const strongName = s=>escape(s).replace(/Jeonghan Yu/g,'<strong>Jeonghan Yu</strong>');
  const navToggle=byId('menu-toggle'), nav=byId('site-nav');
  if(navToggle&&nav){navToggle.addEventListener('click',()=>{const open=nav.classList.toggle('is-open');navToggle.setAttribute('aria-expanded',String(open));});}
  const artNames={abstract:'HL',robotics:'RB',design:'RD'};
  function newsCard(n,featured=false){const art=n.art||'abstract'; return `<article class="news-card${featured?' news-card-feature':''}"><div class="news-art ${escape(art)}" aria-hidden="true"><span>${escape(artNames[art]||'HL')}</span></div><div class="news-body"><div class="meta">${escape(n.date)} · ${escape(n.category)}</div><h3>${escape(n.title)}</h3><p>${escape(n.description)}</p></div></article>`;}
  function pubCard(p){const href=p.doi?`<a class="paper-link" href="https://doi.org/${encodeURI(p.doi)}" target="_blank" rel="noopener noreferrer">DOI ↗</a>`:'';const venue=p.details?`${escape(p.venue)} · ${escape(p.details)}`:escape(p.venue);const loc=p.location?` · ${escape(p.location)}`:'';const badge=p.presentation?`<span class="paper-kind">${escape(p.presentation)}</span>`:'';return `<article class="pub-item"><div class="pub-year">${escape(p.year)}</div><div><h3>${escape(p.title)}</h3><p class="authors">${strongName(p.authors)}</p><p class="venue">${venue}${loc}</p><div class="pub-tags">${href}${badge}</div></div></article>`;}
  function annCard(a){return `<a class="announcement-item" href="${escape(a.href||'contact.html')}"><div class="tag">${escape(a.tag)}</div><h3>${escape(a.title)}</h3><p>${escape(a.text)}</p></a>`;}
  function memberCard(m){return `<article class="member-card"><div class="avatar" aria-hidden="true">${escape(m.initials)}</div><h3>${escape(m.name)}</h3><p>${escape(m.role)}</p></article>`;}
  const content=(id,arr,func)=>{let el=byId(id);if(el)el.innerHTML=(arr||[]).map(func).join('');};
  content('home-news',(data.news||[]).slice(0,3),(n,i)=>newsCard(n,i===0));
  content('all-news',data.news||[],(n)=>newsCard(n));
  content('home-pubs',(data.journal||[]).slice(0,3),pubCard);
  content('journal-pubs',data.journal||[],pubCard);
  content('international-pubs',data.international||[],pubCard);
  content('korea-pubs',data.korea||[],pubCard);
  content('home-announcements',data.announcements||[],annCard);
  content('all-announcements',data.announcements||[],annCard);
  content('team-members',data.members||[],memberCard);
  const minis=byId('home-members');if(minis)minis.innerHTML=(data.members||[]).slice(0,3).map(m=>`<div class="member-mini"><div class="avatar" aria-hidden="true">${escape(m.initials)}</div><strong>${escape(m.role)}</strong><span>Profile coming soon</span></div>`).join('');
  const media=byId('home-media');if(media){const arr=data.media||[];if(arr.length)media.innerHTML=arr.slice(0,3).map(m=>`<a href="${escape(safeHref(m.url))}" target="_blank" rel="noopener noreferrer" class="announcement-item"><div class="tag">${escape(m.source)}</div><h3>${escape(m.title)}</h3><p>${escape(m.date)}</p></a>`).join('');}
  const courses=byId('courses-list');if(courses)courses.innerHTML=(data.courses||[]).map(c=>`<article class="course-card"><div class="course-code">${escape(c.code)}</div><h3>${escape(c.title)}</h3><div class="course-info"><span>${escape(c.term)}</span><span>${escape(c.level)}</span></div><p>${escape(c.description)}</p></article>`).join('');
  const tabs=document.querySelectorAll('[data-tab]');
  function activateTab(name){tabs.forEach(t=>{const on=t.dataset.tab===name;t.classList.toggle('active',on);t.setAttribute('aria-selected',String(on));});document.querySelectorAll('[data-tab-content]').forEach(p=>p.classList.toggle('active',p.dataset.tabContent===name));}
  tabs.forEach(t=>t.addEventListener('click',()=>{activateTab(t.dataset.tab);history.replaceState(null,'','#'+t.dataset.tab);}));
  if(tabs.length)activateTab(['journal','international','korea'].includes(location.hash.slice(1))?location.hash.slice(1):'journal');
  document.querySelectorAll('[data-count]').forEach(el=>{el.textContent=(data[el.dataset.count]||[]).length;});
})();
