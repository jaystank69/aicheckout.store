// Basic helpers
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));

// Smooth scroll via data-scroll
$$('[data-scroll]').forEach(btn=>{
  btn.addEventListener('click', e=>{
    const t = e.currentTarget.getAttribute('data-scroll');
    const el = document.querySelector(t);
    if (el) el.scrollIntoView({behavior:'smooth', block:'center'});
  });
});

// Reveal on view
const io = new IntersectionObserver((entries)=>{
  entries.forEach(en=>{
    if (en.isIntersecting) {
      en.target.classList.add('revealed');
      io.unobserve(en.target);
    }
  });
},{threshold:.2});
$$('.reveal').forEach(n=>io.observe(n));

// Dummy cart/profile placeholders
$$('[data-open-cart],[data-open-profile]').forEach(btn=>{
  btn.addEventListener('click',()=>alert('Cart/Profile coming soon 🚧'));
});

// Register SW (optional app-feel)
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch(()=>{});
}
