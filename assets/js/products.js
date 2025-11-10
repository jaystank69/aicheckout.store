// Infinite-ish product feed with mixed media
(async function(){
  const feed = document.getElementById('product-feed');
  if (!feed) return;

  const tpl = document.getElementById('product-card-tpl');
  const res = await fetch('/data/products.json');
  const all = await res.json();

  let page = 0, size = 9;

  function renderSlice(){
    const items = all.slice(page*size, (page+1)*size);
    items.forEach(p=>{
      const node = tpl.content.cloneNode(true);
      const card = node.querySelector('.product-card');
      const media = node.querySelector('.media-wrap');
      const title = node.querySelector('.title');
      const now = node.querySelector('.now');
      const was = node.querySelector('.was');

      title.textContent = p.title;
      now.textContent = p.price_now;
      was.textContent = p.price_was;

      if (p.media_type === 'video'){
        const v = document.createElement('video');
        v.src = p.src;
        v.muted = true; v.loop = true; v.playsInline = true; v.preload = 'none';
        v.addEventListener('mouseenter',()=>v.play());
        v.addEventListener('touchstart',()=>v.play(),{passive:true});
        media.appendChild(v);
      } else {
        const img = document.createElement('img');
        img.src = p.src; img.loading='lazy'; img.alt = p.title;
        media.appendChild(img);
      }

      feed.appendChild(node);
      // reveal animation when visible
      io.observe(feed.lastElementChild);
    });
    page++;
  }

  // IntersectionObserver for reveal (shared with app.js but isolated here)
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(en=>{
      if (en.isIntersecting){ en.target.classList.add('revealed'); io.unobserve(en.target); }
    });
  },{threshold:.2});

  // infinite-ish: sentinel
  const sentinel = document.getElementById('feed-sentinel');
  const inf = new IntersectionObserver((entries)=>{
    entries.forEach(en=>{
      if (en.isIntersecting){
        if (page*size < all.length) renderSlice();
      }
    });
  },{rootMargin:'600px'});
  inf.observe(sentinel);

  renderSlice();
})();
