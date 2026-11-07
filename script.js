'use strict';
(() => {
  const ids = ['home', 'demo', 'core', 'start'];
  const labels = ['魔道書とは', '試してみる', '画面と使い方', '入手する'];
  const pages = document.getElementById('pages');
  const screens = [...document.querySelectorAll('[data-screen]')];
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let current = 0, navigationTimer;
  const guidance = [
    ['まずは、4件の架空の会話で探し方を試してみませんか。','探索デモへ →','demo'],
    ['記録の下にある関連リンクも試せます。次は、アプリの実画面へ。','Coreの画面へ →','core'],
    ['実際のCoreの画面です。次は、取り込みの手順をご案内します。','使いはじめる →','start'],
    ['公開準備中です。待つあいだ、架空の書庫でもう一度遊べます。','トップへ戻る →','home']
  ];
  function update(index, changeHistory) {
    current = index;
    pages.dataset.active = ids[index];
    screens.forEach((screen, n) => { screen.classList.toggle('active', n === index); screen.inert = n !== index; });
    document.querySelectorAll('.top-nav [data-page]').forEach(button => {
      if (button.dataset.page === ids[index]) button.setAttribute('aria-current', 'page');
      else button.removeAttribute('aria-current');
    });
    document.getElementById('page-count').textContent = String(index + 1).padStart(2, '0') + ' / 04';
    document.getElementById('page-label').textContent = labels[index];
    document.getElementById('previous').disabled = index === 0;
    document.getElementById('next').disabled = index === 3;
    const [message, caption, target] = guidance[index];
    document.getElementById('nie-next').textContent = ['探索デモへ →','画面と使い方 →','入手情報へ →','トップへ →'][index];
    document.getElementById('nie-next').dataset.page = target;
    document.getElementById('page-announcement').textContent = `${index + 1} / 4、${labels[index]}`;
    if (changeHistory && location.hash !== '#' + ids[index]) history.pushState(null, '', '#' + ids[index]);
  }
  function go(id, history = true, instant = false) {
    const index = ids.indexOf(id);
    if (index < 0) return;
    clearTimeout(navigationTimer);
    update(index, history);
    pages.scrollTo({left: index * pages.clientWidth, behavior: instant || reduced.matches ? 'instant' : 'smooth'});
  }
  document.addEventListener('click', event => {
    const button = event.target.closest('[data-page]');
    if (button) go(button.dataset.page);
  });
  document.getElementById('previous').addEventListener('click', () => go(ids[Math.max(0, current - 1)]));
  document.getElementById('next').addEventListener('click', () => go(ids[Math.min(3, current + 1)]));
  document.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.target.closest('input,textarea,select,[contenteditable="true"]') || document.querySelector('dialog[open]')) return;
    if (event.key === 'Escape') { setSpeech(false); return; }
    if (event.target.closest('#nie-speech')) return;
    let target;
    if (event.key === 'ArrowRight') target = Math.min(3, current + 1);
    if (event.key === 'ArrowLeft') target = Math.max(0, current - 1);
    if (event.key === 'Home') target = 0;
    if (event.key === 'End') target = 3;
    if (target !== undefined) { event.preventDefault(); go(ids[target]); }
  });
  // Native horizontal scrolling gives direct touch tracking, while vertical wheels remain vertical.
  pages.addEventListener('scroll', () => {
    clearTimeout(navigationTimer);
    navigationTimer = setTimeout(() => {
      const index = Math.round(pages.scrollLeft / pages.clientWidth);
      if (index >= 0 && index < ids.length && Math.abs(pages.scrollLeft - index * pages.clientWidth) < 3) update(index, true);
    }, 160);
  }, {passive: true});
  window.addEventListener('popstate', () => go(ids.includes(location.hash.slice(1)) ? location.hash.slice(1) : 'home', false));
  window.addEventListener('hashchange', () => go(ids.includes(location.hash.slice(1)) ? location.hash.slice(1) : 'home', false));
  window.addEventListener('resize', () => go(ids[current], false, true));
  const speech = document.getElementById('nie-speech');
  const trigger = document.getElementById('nie-trigger');
  function setSpeech(open, moveFocus = true) {
    document.body.classList.toggle('guide-open', open);
    speech.classList.toggle('closed', !open);
    speech.inert = !open;
    speech.setAttribute('aria-hidden', String(!open));
    trigger.setAttribute('aria-expanded', String(open));
    trigger.setAttribute('aria-label', open ? 'にえの書庫だよりを閉じる' : 'にえの書庫だよりを開く');
    // The content rectangle changes; keep the selected horizontal page aligned.
    go(ids[current], false, true);
    if (moveFocus) (open ? document.getElementById('nie-close') : trigger).focus({preventScroll:true});
  }
  trigger.addEventListener('click', () => setSpeech(trigger.getAttribute('aria-expanded') !== 'true'));
  document.getElementById('nie-close').addEventListener('click', () => setSpeech(false));
  document.getElementById('nie-next').addEventListener('click', () => setSpeech(false));
  const tips = Array.isArray(window.MADOU_TIPS) ? window.MADOU_TIPS : [];
  const tipPositions = {chatgpt:0, magiclogger:0};
  let tipCategory = 'chatgpt';
  function renderTip() {
    const group = tips.filter(tip => tip.category === tipCategory);
    const tip = group[tipPositions[tipCategory] % group.length];
    if (!tip) return;
    document.getElementById('tip-title').textContent = tip.title;
    document.getElementById('tip-body').textContent = tip.body;
    document.getElementById('tip-count').textContent = `${tipPositions[tipCategory] % group.length + 1} / ${group.length} のお話`;
    document.querySelectorAll('[data-tip-category]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.tipCategory === tipCategory)));
    document.querySelector('.tip-content').scrollTop = 0;
  }
  document.querySelectorAll('[data-tip-category]').forEach(button => button.addEventListener('click', () => { tipCategory = button.dataset.tipCategory; renderTip(); }));
  document.getElementById('tip-next').addEventListener('click', () => { tipPositions[tipCategory]++; renderTip(); });
  renderTip();
  const dialog = document.getElementById('screen-dialog');
  document.getElementById('screen-zoom').addEventListener('click', () => dialog.showModal());
  document.getElementById('zoom-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog && event.offsetY < 0) dialog.close(); });

  const records = [
    {id:'rain',date:'2026.10.18',title:'雨の日の、街の撮り方',tags:['写真','雨の日','街歩き'],user:'雨の日でも、近所で写真を撮るならどこを見ればいい？',reply:'窓の水滴、傘の縁、濡れた道に映る灯りを探してみよう。水たまりは低い位置から写すと、いつもの街が違って見える。',related:['walk','cafe']},
    {id:'walk',date:'2026.10.22',title:'街歩きの小さな撮影メモ',tags:['写真','街歩き','メモ'],user:'散歩の途中、撮りたいと思った場所を忘れないようにしたい。',reply:'地名だけでなく、「夕方の光」「雨のあと」など、気になった条件を一緒に書こう。次に歩く日に、そのメモから一か所選べる。',related:['rain','cafe']},
    {id:'cafe',date:'2026.10.25',title:'雨宿りの喫茶店で書く短編',tags:['喫茶店','雨の日','創作'],user:'雨宿りに入った喫茶店を舞台に、短い話を書きたい。',reply:'窓際の席に、持ち主のいない傘が一本。主人公が持ち帰ろうとすると、傘の柄に明日の日時が書かれていた。そこから始めてみよう。',related:['rain','story']},
    {id:'story',date:'2026.10.28',title:'短編の書き出しを整える',tags:['創作','短編','メモ'],user:'喫茶店の短編、説明が長くなってしまう。',reply:'まず「誰が、何に気づいたか」を一文に。背景の説明は、人物の動作や会話の間へ少しずつ移してみよう。',related:['cafe','walk']}
  ];
  const search = document.getElementById('demo-search');
  const list = document.getElementById('record-list');
  const content = document.getElementById('reader-content');
  const empty = document.getElementById('reader-empty');
  const reader = document.getElementById('record-reader');
  let opened = null, trail = [];
  function renderList() {
    const terms = search.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
    const filtered = records.filter(record => terms.every(term => `${record.title} ${record.tags.join(' ')} ${record.user} ${record.reply}`.toLowerCase().includes(term)));
    document.getElementById('result-count').textContent = `${filtered.length}件 / 架空の記録 全4件`;
    list.replaceChildren();
    if (!filtered.length) { const p = document.createElement('p'); p.className = 'no-results'; p.textContent = '見つかりませんでした。「雨」「写真」「喫茶店」で試してみてください。'; list.append(p); }
    filtered.forEach(record => {
      const button = document.createElement('button'); button.className = 'record-button'; button.dataset.record = record.id; button.setAttribute('aria-pressed', String(opened === record.id));
      button.innerHTML = `<span>${record.date}</span><strong>${record.title}</strong><em>${record.tags.join(' ・ ')}</em>`;
      list.append(button);
    });
  }
  function openRecord(id, fromRelated = false) {
    const record = records.find(item => item.id === id); if (!record) return;
    if (fromRelated && opened) trail.push(opened); else trail = [];
    opened = id;
    empty.hidden = true; content.hidden = false;
    content.innerHTML = `<div class="reader-toolbar"><button id="demo-back">← ${trail.length ? '前の記録へ' : '一覧へ戻る'}</button><span>${record.date} · 架空の会話</span></div><h2>${record.title}</h2><div class="record-tags">${record.tags.map(tag => `<span>${tag}</span>`).join('')}</div><div class="dialogue"><div><b>あなた</b><p>${record.user}</p></div><div><b>AI</b><p>${record.reply}</p></div></div><div class="related-records"><h3>関連する記録 · デモ用に用意したリンク</h3>${record.related.map(related => `<button data-related="${related}">${records.find(item => item.id === related).title} →</button>`).join(' ')}</div>`;
    renderList(); reader.scrollIntoView({block:'nearest',behavior:reduced.matches?'instant':'smooth'}); reader.focus({preventScroll:true});
  }
  search.addEventListener('input', renderList);
  document.getElementById('search-form').addEventListener('submit', event => {event.preventDefault(); renderList();});
  document.querySelectorAll('[data-query]').forEach(button => button.addEventListener('click', () => {search.value=button.dataset.query;renderList();}));
  list.addEventListener('click', event => { const button=event.target.closest('[data-record]');if(button)openRecord(button.dataset.record); });
  content.addEventListener('click', event => {
    const related=event.target.closest('[data-related]'); if(related){openRecord(related.dataset.related,true);return;}
    if(event.target.closest('#demo-back')){
      if(trail.length){const previous=trail.pop();const saved=[...trail];openRecord(previous);trail=saved;const back=document.getElementById('demo-back');back.textContent=trail.length?'← 前の記録へ':'← 一覧へ戻る';}
      else{opened=null;empty.hidden=false;content.hidden=true;renderList();search.focus({preventScroll:true});document.querySelector('.demo-index').scrollIntoView({block:'nearest',behavior:reduced.matches?'instant':'smooth'});}
    }
  });
  renderList();
  setSpeech(false, false);
  go(ids.includes(location.hash.slice(1)) ? location.hash.slice(1) : 'home', false, true);
})();

(() => {
  const cfg = window.MADOU_SITE_CONFIG || {};
  function enable(id, value, label) {
    if (typeof value !== 'string' || !value.trim()) return false;
    let url; try { url = new URL(value); } catch { return false; }
    if (url.protocol !== 'https:') return false;
    const link = document.getElementById(id);
    link.href = url.href; link.target = '_blank'; link.rel = 'noopener noreferrer';
    link.removeAttribute('aria-disabled'); link.textContent = label + ' ↗';
    return true;
  }
  const available = enable('download-link', cfg.downloadUrl, 'Download');
  enable('github-link', cfg.githubUrl, 'GitHub');
  enable('nempro-link', cfg.nemproUrl, 'ねむプロ公式サイト');
  enable('developer-x-link', cfg.developerXUrl, '開発者のX');
  const hero = document.getElementById('hero-image');
  if (hero && typeof cfg.heroImage === 'string' && /^assets\/[a-zA-Z0-9_.-]+\.webp\?v=[a-z0-9]+$/i.test(cfg.heroImage)) {
    hero.src = cfg.heroImage;
  }
  if (available) {
    document.getElementById('download-title').textContent = 'Windows版を入手する';
    document.getElementById('download-description').textContent = '配布ページで公開版と更新内容を確認できます。';
  }
})();
