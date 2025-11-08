// ========= Helpers =========
const $  = (s, c=document) => c.querySelector(s);
const $$ = (s, c=document) => Array.from(c.querySelectorAll(s));
const yearEl = $("#year"); if (yearEl) yearEl.textContent = new Date().getFullYear();

// Always remove intro veil even if libs fail
(function ensureVeilGoesAway() {
  const veil = document.querySelector('.intro-veil');
  if (!veil) return;
  window.addEventListener('load', () => {
    veil.style.transition = 'opacity .6s ease';
    veil.style.opacity = '0';
    setTimeout(() => veil.remove(), 700);
  });
})();

// ========= Lenis Smooth Scroll =========
try {
  const lenis = new Lenis({ duration: 1.1, smoothWheel: true, smoothTouch: false });
  requestAnimationFrame(function raf(t){ lenis.raf(t); requestAnimationFrame(raf); });
} catch { /* ignore offline */ }

// ========= Cursor Glow =========
(function cursorGlow(){
  const glow = $("#cursor-glow");
  if (!glow) return;
  let rafId = null, tx = innerWidth/2, ty = innerHeight/2, x = tx, y = ty;
  const animate = () => {
    x += (tx - x) * 0.12; y += (ty - y) * 0.12;
    glow.style.transform = `translate(${x}px, ${y}px)`; rafId = requestAnimationFrame(animate);
  };
  addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; if (!rafId) animate(); }, { passive:true });
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
  const els = $$('.reveal'); if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => { if (en.isIntersecting){ en.target.classList.add('show'); io.unobserve(en.target); } });
  }, { threshold: 0.12 });
  els.forEach(el => io.observe(el));
}

// ========= three.js: subtle starfield =========
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
  const material = new THREE.PointsMaterial({ size:1.2, transparent:true, opacity:.55, color:0x10a37f });
  const stars = new THREE.Points(geometry, material);
  scene.add(stars);

  let t=0;
  (function animate(){
    requestAnimationFrame(animate);
    t+=0.0014;
    stars.rotation.y += 0.0007;
    stars.position.y = Math.sin(t)*1.8;
    renderer.render(scene, camera);
  })();

  addEventListener('resize', ()=>{ camera.aspect = innerWidth/innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight); });
})();

// ========= GSAP cinematic intro + parallax =========
(function initGsap(){
  if (typeof gsap === 'undefined') return;
  if (gsap.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  const tl = gsap.timeline();
  tl.to('.intro-veil', { opacity: 0, duration: 0.8, ease: 'power2.out', delay: 0.15 })
    .set('.intro-veil', { display: 'none' })
    .from('.site-header', { y: -18, opacity: 0, duration: 0.55, ease: 'power2.out' }, '-=0.25')
    .from('.hero h1', { y: 18, opacity: 0, duration: 0.65, ease: 'power2.out' }, '-=0.2')
    .from('.hero p',  { y: 12, opacity: 0, duration: 0.55, ease: 'power2.out' }, '-=0.35')
    .from('.cta .btn', { y: 10, opacity: 0, duration: 0.45, ease: 'power2.out', stagger: 0.05 }, '-=0.4');

  if (gsap.ScrollTrigger){
    gsap.to('.nebula', { yPercent: -10, ease:'none',
      scrollTrigger:{ trigger:'body', start:'top top', end:'bottom bottom', scrub:1 }});
    gsap.utils.toArray('.pentagon').forEach((el,i)=>{
      gsap.to(el, { y:(i%2?-36:36), x:(i%2?16:-16), rotation:i%2?10:-8, ease:'none',
        scrollTrigger:{ trigger:'body', start:'top top', end:'bottom bottom', scrub:1.15 }});
    });
  }
})();
