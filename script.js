// ========= Helpers =========
const $  = (s, c=document) => c.querySelector(s);
const $$ = (s, c=document) => Array.from(c.querySelectorAll(s));
const yearEl = $("#year"); if (yearEl) yearEl.textContent = new Date().getFullYear();

// Kill intro veil even if GSAP fails to load
(function ensureVeilGoesAway() {
  const veil = document.querySelector('.intro-veil');
  if (!veil) return;

  // If GSAP isn't present, fade it out and remove
  if (typeof gsap === 'undefined') {
    window.addEventListener('load', () => {
      veil.style.transition = 'opacity .6s ease';
      veil.style.opacity = '0';
      setTimeout(() => veil.remove(), 700);
    });
  }
})();


// ========= Lenis Smooth Scroll =========
try {
  const lenis = new Lenis({ duration: 1.1, smoothWheel: true, smoothTouch: false });
  requestAnimationFrame(function raf(t){ lenis.raf(t); requestAnimationFrame(raf); });
} catch { /* ignore if offline */ }

// ========= Cursor Glow =========
(function cursorGlow(){
  const glow = $("#cursor-glow");
  if (!glow) return;
  let rafId = null, targetX = 0, targetY = 0, x = window.innerWidth/2, y = window.innerHeight/2;

  const animate = () => {
    x += (targetX - x) * 0.12;
    y += (targetY - y) * 0.12;
    glow.style.transform = `translate(${x}px, ${y}px)`;
    rafId = requestAnimationFrame(animate);
  };
  window.addEventListener('mousemove', e => { targetX = e.clientX; targetY = e.clientY; if (!rafId) animate(); }, { passive:true });
})();

// ========= Products (home) =========
async function renderProducts() {
  const grid = $('#grid');
  if (!grid) return;
  try {
    const res = await fetch('/data/products.json', { cache: 'no-cache' });
    const items = await res.json();

    grid.innerHTML = items.map(p => `
      <article class="card product reveal">
        <div class="media">
          <img src="${p.image}" alt="${p.name}" loading="lazy">
          ${p.badge ? `<span class="badge">${p.badge}</span>` : ''}
        </div>
        <div class="content">
          <h3>${p.name}</h3>
          <p class="muted">${p.desc}</p>
          <div class="row">
            <span class="price">$${p.price}</span>
            <a class="btn primary" href="/product.html?id=${encodeURIComponent(p.id)}">View</a>
          </div>
        </div>
      </article>
    `).join('');

    attachReveals();
  } catch {
    grid.innerHTML = `<p class="muted">Could not load products. Check <code>data/products.json</code>.</p>`;
  }
}
renderProducts();

// ========= IntersectionObserver reveals =========
function attachReveals(){
  const els = $$('.reveal');
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en, i) => {
      if (en.isIntersecting){
        en.target.classList.add('show');
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(el => io.observe(el));
}

// ========= three.js starfield (already in your page) =========
(function initThree(){
  const canvas = document.getElementById('bg3d');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, innerWidth/innerHeight, 0.1, 1000);
  camera.position.z = 60;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias:true, alpha:true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(innerWidth, innerHeight);

  const count = 900;
  const geometry = new THREE.BufferGeometry();
  const pos = new Float32Array(count * 3);
  for (let i=0;i<count;i++){
    pos[i*3+0] = (Math.random()-0.5)*320;
    pos[i*3+1] = (Math.random()-0.5)*220;
    pos[i*3+2] = (Math.random()-0.5)*320;
  }
  geometry.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const material = new THREE.PointsMaterial({ size:1.2, transparent:true, opacity:.6, color:0x7c9cff });
  const stars = new THREE.Points(geometry, material);
  scene.add(stars);

  let t=0;
  (function animate(){
    requestAnimationFrame(animate);
    t+=0.0015;
    stars.rotation.y += 0.0008;
    stars.position.y = Math.sin(t)*2;
    renderer.render(scene, camera);
  })();

  addEventListener('resize', ()=>{ camera.aspect = innerWidth/innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight); });
})();

// ========= GSAP cinematic intro + parallax =========
(function initGsap(){
  if (typeof gsap === 'undefined') return;
  if (gsap.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  // Cinematic intro: fade veil, then bring hero in
  const tl = gsap.timeline();
  tl.to('.intro-veil', { opacity: 0, duration: 0.9, ease: 'power2.out', delay: 0.2 })
    .set('.intro-veil', { display: 'none' })
    .from('.site-header', { y: -18, opacity: 0, duration: 0.6, ease: 'power2.out' }, '-=0.3')
    .from('.hero h1', { y: 18, opacity: 0, duration: 0.7, ease: 'power2.out' }, '-=0.2')
    .from('.hero p',  { y: 12, opacity: 0, duration: 0.6, ease: 'power2.out' }, '-=0.4')
    .from('.cta .btn', { y: 10, opacity: 0, duration: 0.5, ease: 'power2.out', stagger: 0.06 }, '-=0.45');

  // Parallax for background layers
  if (gsap.ScrollTrigger){
    gsap.to('.nebula', { yPercent: -10, ease:'none',
      scrollTrigger:{ trigger:'body', start:'top top', end:'bottom bottom', scrub:1 }});
    gsap.utils.toArray('.pentagon').forEach((el,i)=>{
      gsap.to(el, { y:(i%2?-40:40), x:(i%2?20:-20), rotation:i%2?10:-8, ease:'none',
        scrollTrigger:{ trigger:'body', start:'top top', end:'bottom bottom', scrub:1.2 }});
    });
  }
})();
