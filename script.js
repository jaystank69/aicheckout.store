document.getElementById("year").textContent = new Date().getFullYear();

// Render products on the homepage
async function renderProducts() {
  const grid = document.getElementById('grid');
  if (!grid) return;

  try {
    const res = await fetch('/data/products.json', { cache: 'no-cache' });
    const items = await res.json();

    grid.innerHTML = items.map(p => `
      <article class="card product">
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
  } catch (e) {
    grid.innerHTML = `<p class="muted">Could not load products. Check <code>data/products.json</code>.</p>`;
  }
}
renderProducts();
