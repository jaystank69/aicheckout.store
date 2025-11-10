// Stories renderer + modal viewer
(async function(){
  const track = document.getElementById('stories-track');
  if (!track) return;

  const res = await fetch('/data/stories.json');
  const stories = await res.json();

  // Build avatars
  stories.forEach((s, i)=>{
    const item = document.createElement('div');
    item.className = 'story';
    item.innerHTML = `
      <button aria-label="Open story ${i+1}">
        <img src="${s.avatar}" alt="${s.user} avatar" loading="lazy"/>
      </button>
      <span>${s.user}</span>
    `;
    item.querySelector('button').addEventListener('click', ()=>openStory(s));
    track.appendChild(item);
  });

  // Modal logic
  const modal = document.getElementById('story-modal');
  const stage = document.getElementById('story-stage');
  const bar = modal?.querySelector('.story-bar');
  const closeBtn = modal?.querySelector('.close-modal');

  function openStory(s){
    if (!modal) return;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden','false');
    stage.innerHTML = '';
    let node;
    if (s.type === 'video') {
      node = document.createElement('video');
      node.src = s.src;
      node.controls = false; node.autoplay = true; node.loop = false; node.muted = false; node.playsInline = true;
    } else {
      node = document.createElement('img');
      node.src = s.src; node.alt = s.user + ' story';
    }
    stage.appendChild(node);
    animateBar(s.duration || 6000);
  }
  function animateBar(ms){
    if (!bar) return;
    bar.style.width = '0%';
    const t0 = performance.now();
    function step(t){
      const p = Math.min(1, (t - t0)/ms);
      bar.style.width = (p*100)+'%';
      if (p < 1 && modal.classList.contains('open')) requestAnimationFrame(step);
      else if (p >= 1) close();
    }
    requestAnimationFrame(step);
  }
  function close(){
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden','true');
    const v = modal.querySelector('video'); if (v) v.pause();
  }
  closeBtn?.addEventListener('click', close);
  modal?.querySelector('.modal-backdrop')?.addEventListener('click', close);
})();
