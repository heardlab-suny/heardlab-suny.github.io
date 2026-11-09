(function () {
  'use strict';
  const data=window.HEARD_CONTENT||{};
  const escape = s => String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const byId = id=>document.getElementById(id);
  const safeHref=u=>/^https:\/\//.test(String(u))||/^mailto:/.test(String(u))?u:'#';
  const strongName = s=>escape(s).replace(/Jeonghan Yu/g,'<strong>Jeonghan Yu</strong>');
  const navToggle=byId('menu-toggle'), nav=byId('site-nav');
  const teamMenu=byId('nav-team'),teamToggle=byId('team-menu-toggle'),teamSubmenu=byId('team-submenu');
  const setTeamOpen=open=>{
    if(!teamToggle||!teamSubmenu)return;
    teamToggle.setAttribute('aria-expanded',String(open));
    teamSubmenu.hidden=!open;
  };
  if(teamMenu&&teamToggle&&teamSubmenu){
    const isOpen=()=>teamToggle.getAttribute('aria-expanded')==='true';
    teamToggle.addEventListener('click',()=>setTeamOpen(!isOpen()));
    teamMenu.addEventListener('pointerenter',event=>{
      if(event.pointerType==='mouse'&&window.matchMedia('(min-width:641px)').matches)setTeamOpen(true);
    });
    teamMenu.addEventListener('pointerleave',()=>{
      if(!teamMenu.contains(document.activeElement))setTeamOpen(false);
    });
    teamMenu.addEventListener('keydown',event=>{
      if(event.key==='Escape'&&isOpen()){event.preventDefault();event.stopPropagation();setTeamOpen(false);teamToggle.focus();}
      if(event.key==='ArrowDown'&&event.target===teamToggle){event.preventDefault();setTeamOpen(true);teamSubmenu.querySelector('a').focus();}
    });
    teamMenu.addEventListener('focusout',event=>{
      if(!teamMenu.contains(event.relatedTarget))setTeamOpen(false);
    });
    document.addEventListener('pointerdown',event=>{
      if(!teamMenu.contains(event.target))setTeamOpen(false);
    });
    // On narrow screens tapping the label expands; the overview remains a
    // normal desktop link and is also reachable through the footer.
    teamMenu.querySelector('a').addEventListener('click',event=>{
      if(window.matchMedia('(max-width:640px)').matches){event.preventDefault();setTeamOpen(!isOpen());}
    });
  }
  if(navToggle&&nav){
    navToggle.addEventListener('click',()=>{
      const open=nav.classList.toggle('is-open');navToggle.setAttribute('aria-expanded',String(open));
      if(!open)setTeamOpen(false);
    });
    nav.addEventListener('keydown',event=>{
      if(event.key==='Escape'&&nav.classList.contains('is-open')){
        setTeamOpen(false);nav.classList.remove('is-open');navToggle.setAttribute('aria-expanded','false');navToggle.focus();
      }
    });
  }
  const artNames={abstract:'HL',robotics:'RB',design:'RD'};
  // Accept HTTPS or relative destinations; reject schemes, protocol-relative URLs,
  // backslashes, controls, and credentials before inserting an escaped attribute.
  function newsDestination(value){
    if(typeof value!=='string')return '';
    const href=value.trim();
    if(!href||/[\\\x00-\x20\x7f]/.test(href)||href.startsWith('//'))return '';
    try{
      const parsed=new URL(href,'https://heard.invalid/');
      if(/^https:\/\//i.test(href))return parsed.hostname&&!parsed.username&&!parsed.password?href:'';
      if(/^[a-z][a-z\d+.-]*:/i.test(href)||parsed.origin!=='https://heard.invalid')return '';
      return href;
    }catch{return '';}
  }
  function newsDate(value){
    const text=String(value||'');
    if(/^\d{4}$/.test(text))return {year:text,full:false};
    if(/^\d{4}-\d{2}-\d{2}$/.test(text)){
      const date=new Date(text+'T00:00:00Z');
      if(!Number.isNaN(date.getTime())&&date.toISOString().slice(0,10)===text)return {year:text.slice(0,4),full:true};
    }
    return {year:'',full:false};
  }
  function sortedNews(entries){
    const groups=new Map();
    (Array.isArray(entries)?entries:[]).filter(n=>n&&typeof n==='object').forEach(n=>{
      const year=newsDate(n.date).year;
      if(!groups.has(year))groups.set(year,[]);
      groups.get(year).push(n);
    });
    return [...groups.keys()].sort((a,b)=>Number(b)-Number(a)).flatMap(year=>{
      const result=[],run=[];
      const flush=()=>{result.push(...run.sort((a,b)=>String(b.date).localeCompare(String(a.date))));run.length=0;};
      // A year-only entry is an ordering boundary: never guess its month/day.
      // Sort fully dated runs without moving entries across that boundary.
      groups.get(year).forEach(n=>{if(newsDate(n.date).full)run.push(n);else{flush();result.push(n);}});
      flush();return result;
    });
  }
  const newsCategory=n=>String(n.category||'').trim();
  function newsCard(n,featured=false){
    const art=Object.prototype.hasOwnProperty.call(artNames,n.art)?n.art:'abstract';
    const image=newsDestination(n.image),url=newsDestination(n.url);
    const external=/^https:\/\//i.test(url);
    return `<article class="news-card${featured?' news-card-feature':''}${url?' news-card-linked':''}"><div class="news-art ${art}"><span aria-hidden="true">${artNames[art]}</span>${image?`<img class="news-image" src="${escape(image)}" alt="${escape(n.imageAlt||n.title||'HEARD Lab news')}" loading="lazy" width="800" height="500">`:''}</div><div class="news-body"><div class="meta">${escape(n.date)} &middot; ${escape(newsCategory(n))}</div><h3>${escape(n.title)}</h3><p>${escape(n.description)}</p>${url?`<a class="news-read-more link-more" href="${escape(url)}"${external?' target="_blank" rel="noopener noreferrer"':''}>Read more &#8599;<span class="sr-only">: ${escape(n.title)}${external?' (opens in a new tab)':''}</span></a>`:''}</div></article>`;
  }
  function bindNewsImages(container){
    container.querySelectorAll('.news-image').forEach(img=>{
      const fallback=()=>img.remove();
      img.addEventListener('error',fallback,{once:true});
      if(img.complete&&img.naturalWidth===0)fallback();
    });
  }
  function renderNews(id,entries,featured=false){
    const el=byId(id);if(!el)return;
    el.innerHTML=entries.length?entries.map((n,i)=>newsCard(n,featured&&i===0)).join(''):'<p class="news-empty">No news matches the selected filters.</p>';
    bindNewsImages(el);
  }
  function initNews(){
    const entries=sortedNews(data.news);
    renderNews('home-news',entries.slice(0,3),true);
    const categories=byId('news-categories'),years=byId('news-year'),count=byId('news-results');
    if(!categories||!years){renderNews('all-news',entries);return;}
    let category=null;
    const options=[...new Set(entries.map(newsCategory).filter(Boolean))];
    categories.innerHTML=[null,...options].map((label,i)=>`<button type="button" class="news-filter${i===0?' active':''}" data-category-index="${i}" aria-pressed="${i===0}" aria-controls="all-news">${escape(label===null?'All':label)}</button>`).join('');
    const availableYears=[...new Set(entries.map(n=>newsDate(n.date).year).filter(Boolean))].sort((a,b)=>Number(b)-Number(a));
    years.innerHTML='<option value="">All Years</option>'+availableYears.map(year=>`<option value="${escape(year)}">${escape(year)}</option>`).join('');
    years.value='';
    const update=()=>{
      const filtered=entries.filter(n=>(category===null||newsCategory(n)===category)&&(!years.value||newsDate(n.date).year===years.value));
      renderNews('all-news',filtered);
      if(count)count.textContent=`${filtered.length} ${filtered.length===1?'result':'results'}`;
    };
    categories.querySelectorAll('button').forEach((button,index)=>button.addEventListener('click',()=>{
      category=index===0?null:options[index-1];
      categories.querySelectorAll('button').forEach(other=>{const active=other===button;other.classList.toggle('active',active);other.setAttribute('aria-pressed',String(active));});
      update();
    }));
    years.addEventListener('change',update);
    update();
  }
  function pubCard(p){const href=p.doi?`<a class="paper-link" href="https://doi.org/${encodeURI(p.doi)}" target="_blank" rel="noopener noreferrer">DOI ↗</a>`:'';const venue=p.details?`${escape(p.venue)} · ${escape(p.details)}`:escape(p.venue);const loc=p.location?` · ${escape(p.location)}`:'';const badge=p.presentation?`<span class="paper-kind">${escape(p.presentation)}</span>`:'';return `<article class="pub-item"><div class="pub-year">${escape(p.year)}</div><div><h3>${escape(p.title)}</h3><p class="authors">${strongName(p.authors)}</p><p class="venue">${venue}${loc}</p><div class="pub-tags">${href}${badge}</div></div></article>`;}
  function annCard(a){return `<a class="announcement-item" href="${escape(a.href||'contact.html')}"><div class="tag">${escape(a.tag)}</div><h3>${escape(a.title)}</h3><p>${escape(a.text)}</p></a>`;}
  // Insertion order defines academic seniority for Current Members only.
  const POSITION_LABELS = Object.freeze({
    postdoc: 'Postdoctoral Researcher',
    visiting: 'Visiting Scholar',
    phd: 'Ph.D. Student',
    ms: 'M.S. Student',
    undergraduate: 'Undergraduate Researcher'
  });
  const POSITION_ORDER = Object.keys(POSITION_LABELS);
  const positionRank = value => {
    const rank = POSITION_ORDER.indexOf(value);
    return rank === -1 ? POSITION_ORDER.length : rank;
  };
  function positionTag(value){
    const label = typeof value === 'string' && Object.prototype.hasOwnProperty.call(POSITION_LABELS,value)
      ? POSITION_LABELS[value] : '';
    return label ? `<span class="position-tag">${escape(label)}</span>` : '';
  }
  const photoFallback='assets/images/profile-silhouette.svg';
  // Allow local and HTTPS images, but never executable or data URLs.
  function photoSource(value){
    const path=String(value||'').trim();
    return /^(?:https:\/\/|assets\/images\/)/i.test(path) && !/[\\\x00-\x1f]/.test(path) ? path : photoFallback;
  }
  function profilePhoto(m){
    const src=photoSource(m.photo);
    const alt=src===photoFallback ? `Portrait unavailable for ${m.name}` : `Portrait of ${m.name}`;
    return `<img class="profile-photo" src="${escape(src)}" alt="${escape(alt)}" loading="lazy" width="400" height="500">`;
  }
  function memberInterests(m){
    const interests=Array.isArray(m.researchInterests)?m.researchInterests:[];
    // Retain legacy text even when an entry also has the new array.
    return [...new Set([...interests,m.researchArea,m.bio]
      .filter(value=>typeof value==='string'&&value.trim())
      .map(value=>value.trim()))];
  }
  function researchInterestsList(m){
    const interests=memberInterests(m);
    return interests.length?`<div class="member-interests"><h4>Research Interests</h4><ul>${interests.map(interest=>`<li>${escape(interest)}</li>`).join('')}</ul></div>`:'';
  }
  function memberCard(m,collaborator=false){
    const email=String(m.email||'').trim();
    const emailLink=/^[^\s@<>?&#]+@[^\s@<>?&#]+\.[^\s@<>?&#]+$/.test(email)
      ? `<a class="member-email" href="mailto:${escape(encodeURIComponent(email))}">${escape(email)}</a>` : '';
    return `<article class="member-card">${profilePhoto(m)}<div class="member-body"><h3>${escape(m.name)}</h3>${collaborator?'':positionTag(m.position)}${collaborator&&m.affiliation?`<p class="member-affiliation">${escape(m.affiliation)}</p>`:''}${collaborator?`${m.researchArea?`<span class="research-label">${escape(m.researchArea)}</span>`:''}${m.bio?`<p class="member-bio">${escape(m.bio)}</p>`:''}`:researchInterestsList(m)}${emailLink}</div></article>`;
  }
  const profiles=arr=>Array.isArray(arr)?arr.filter(m=>m&&typeof m.name==='string'&&m.name.trim()):[];
  function renderProfiles(id,arr,render){
    const el=byId(id);if(!el)return;
    const entries=profiles(arr);
    el.innerHTML=entries.length?entries.map(render).join(''):'<p class="profiles-empty">Profiles coming soon.</p>';
  }
  const content=(id,arr,func)=>{let el=byId(id);if(el)el.innerHTML=(arr||[]).map(func).join('');};
  initNews();
  content('home-pubs',(data.journal||[]).slice(0,3),pubCard);
  content('journal-pubs',data.journal||[],pubCard);
  content('international-pubs',data.international||[],pubCard);
  content('korea-pubs',data.korea||[],pubCard);
  content('home-announcements',data.announcements||[],annCard);
  content('all-announcements',data.announcements||[],annCard);
  // Sort a filtered copy; stable sorting preserves data order within each category.
  const orderedMembers=profiles(data.members).sort((a,b)=>positionRank(a.position)-positionRank(b.position));
  renderProfiles('team-members',orderedMembers,m=>memberCard(m));
  renderProfiles('team-collaborators',data.collaborators,m=>memberCard(m,true));
  renderProfiles('home-members',orderedMembers.slice(0,3),m=>`<a class="member-mini" href="members.html">${profilePhoto(m)}<strong>${escape(m.name)}</strong>${positionTag(m.position)}${memberInterests(m).length?`<span>${escape(memberInterests(m)[0])}</span>`:''}</a>`);
  document.querySelectorAll('.profile-photo').forEach(img=>{
    img.addEventListener('error',()=>{
      img.src=photoFallback;
      img.alt='Portrait unavailable';
    },{once:true});
  });
  const media=byId('home-media');if(media){const arr=data.media||[];if(arr.length)media.innerHTML=arr.slice(0,3).map(m=>`<a href="${escape(safeHref(m.url))}" target="_blank" rel="noopener noreferrer" class="announcement-item"><div class="tag">${escape(m.source)}</div><h3>${escape(m.title)}</h3><p>${escape(m.date)}</p></a>`).join('');}
  const courses=byId('courses-list');if(courses)courses.innerHTML=(data.courses||[]).map(c=>`<article class="course-card"><div class="course-code">${escape(c.code)}</div><h3>${escape(c.title)}</h3><div class="course-info"><span>${escape(c.term)}</span><span>${escape(c.level)}</span></div><p>${escape(c.description)}</p></article>`).join('');
  const tabs=document.querySelectorAll('[data-tab]');
  function activateTab(name){tabs.forEach(t=>{const on=t.dataset.tab===name;t.classList.toggle('active',on);t.setAttribute('aria-selected',String(on));});document.querySelectorAll('[data-tab-content]').forEach(p=>p.classList.toggle('active',p.dataset.tabContent===name));}
  tabs.forEach(t=>t.addEventListener('click',()=>{activateTab(t.dataset.tab);history.replaceState(null,'','#'+t.dataset.tab);}));
  if(tabs.length)activateTab(['journal','international','korea'].includes(location.hash.slice(1))?location.hash.slice(1):'journal');
  document.querySelectorAll('[data-count]').forEach(el=>{el.textContent=(data[el.dataset.count]||[]).length;});
})();
