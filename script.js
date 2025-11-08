// ====== Utility ======
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
const yearEl = $("#year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ====== Smooth scrolling (Lenis) ======
try {
  const lenis = new Lenis({
    duration: 1.1, // seconds to “cover” 1 screen
    smoothWheel: true,
    smoothTouch: false
  });
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
} catch (e) {
  // Lenis not loaded (offline) — ignore gracefully
}

// ====== Render products on the homepage ======
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
  } catch (e) {
    grid.innerHTML = `<p class="muted">Could not load products. Check <code>data/products.json</code>.</p>`;
  }
}
renderProducts();

// ====== IntersectionObserver: reveal cards on scroll ======
function attachReveals() {
  const els = $$('.reveal');
  if (!els.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  els.forEach(el => io.observe(el));
}

// ====== three.js: lightweight starfield / particles ======
(function initThree() {
  const canvas = document.getElementById('bg3d');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 60;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Starfield points
  const count = 800;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3 + 0] = (Math.random() - 0.5) * 300;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 200;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 300;
  }
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    size: 1.2,
    transparent: true,
    opacity: 0.6,
    color: 0x7c9cff
  });
  const stars = new THREE.Points(geometry, material);
  scene.add(stars);

  // Subtle drift
  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.0018;
    stars.rotation.y += 0.0008;
    stars.position.y = Math.sin(t) * 2;
    renderer.render(scene, camera);
  }
  animate();

  // Resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();

// ====== GSAP Parallax / micro-animations ======
(function initGsap() {
  if (typeof gsap === 'undefined') return;

  // Register ScrollTrigger if available
  if (gsap.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  // Hero entrance
  gsap.from('.hero h1', { y: 16, opacity: 0, duration: 0.8, ease: 'power2.out' });
  gsap.from('.hero p',  { y: 12, opacity: 0, duration: 0.8, delay: 0.05, ease: 'power2.out' });
  gsap.from('.cta .btn', { y: 10, opacity: 0, duration: 0.6, delay: 0.1, stagger: 0.05, ease: 'power2.out' });

  // Subtle parallax for the nebula and floaters
  if (gsap.ScrollTrigger) {
    gsap.to('.nebula', {
      yPercent: -10,
      ease: 'none',
      scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: 1 }
    });

    gsap.utils.toArray('.pentagon').forEach((el, i) => {
      gsap.to(el, {
        y: (i % 2 ? -40 : 40),
        x: (i % 2 ? 20 : -20),
        rotation: i % 2 ? 10 : -8,
        ease: 'none',
        scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: 1.2 }
      });
    });
  }
})();
