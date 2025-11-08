-const API = 'https://aicheckout-api.financebrocracked.workers.dev';
+// API is same-origin now (Worker is routed on aicheckout.store)
+const API = '';

 async function renderProducts() {
   const grid = document.getElementById('grid');
   if (!grid) return;

   try {
-    const res = await fetch(`${API}/products`, { cache: 'no-store' });
-    const items = await res.json();
+    const res = await fetch(`/products`, { cache: 'no-store' });
+    const data = await res.json();
+    const items = Array.isArray(data) ? data : (data.items ?? []);

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

+    // re-attach reveal animations if you use them
+    attachReveals?.();
   } catch (e) {
     grid.innerHTML = `<p class="muted">Could not load products from API.</p>`;
   }
 }
 renderProducts();
