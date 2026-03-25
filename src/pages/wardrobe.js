// ── Wardrobe Tool (Redesigned) ──
import { createSidebar } from '../components/sidebar.js';
import { icons } from '../components/icons.js';
import { navigate } from '../router.js';
import { api } from '../api.js';

const categories = ['All', 'Tops', 'Outerwear', 'Bottoms', 'Shoes', 'Accessories'];

export function renderWardrobe(container) {
  let activeCategory = 'All';
  let wardrobeItems = [];
  let isLoading = true;

  async function loadItems() {
    try {
      isLoading = true;
      render();
      const res = await api.getWardrobe(activeCategory !== 'All' ? `category=${activeCategory.toLowerCase()}` : '');
      wardrobeItems = res.items || [];
    } catch (err) {
      console.error('Failed to load wardrobe', err);
    } finally {
      isLoading = false;
      render();
    }
  }

  function render() {
    container.innerHTML = `<div class="app-layout page"></div>`;
    const layout = container.querySelector('.app-layout');
    layout.appendChild(createSidebar('/wardrobe'));

    const main = document.createElement('div');
    main.className = 'main-content';
    main.style.background = '#F6F3EE';

    const pageContent = document.createElement('div');
    pageContent.className = 'page-content';
    pageContent.style.cssText = 'padding-top:16px; padding-bottom:100px; max-width:600px; margin:0 auto;';

    pageContent.innerHTML = `
      <!-- Header -->
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:32px; padding:0 4px;">
        <div>
          <h2 style="font-family:'Cormorant Garamond',serif; font-size:32px; font-weight:600; color:#1A1A1A; letter-spacing:-0.5px;">Your Wardrobe</h2>
          <p style="font-size:11px; font-weight:800; color:rgba(0,0,0,0.3); text-transform:uppercase; letter-spacing:1.5px; margin-top:4px;">${isLoading ? 'Updating ARCHIVE...' : `${wardrobeItems.length} curated items`}</p>
        </div>
        <button id="btn-add-item" style="
          padding:12px 24px; border-radius:100px; font-size:13px; font-weight:750; cursor:pointer;
          background:#1A1A1A; color:#FFF; border:none; font-family:'DM Sans',sans-serif;
          text-transform:uppercase; letter-spacing:1px;
        ">+ Add Item</button>
      </div>

      <!-- Filter Pills -->
      <div style="display:flex; gap:10px; margin-bottom:32px; overflow-x:auto; scrollbar-width:none; padding-bottom:8px;" class="hide-scrollbar">
        ${categories.map(c => `
          <button class="filter-pill" data-cat="${c}" style="
            padding:10px 22px; border-radius:100px; font-size:12px; font-weight:700; white-space:nowrap; cursor:pointer;
            transition:all 0.3s cubic-bezier(0.22, 1, 0.36, 1); border:1.5px solid ${activeCategory === c ? '#1A1A1A' : 'rgba(0,0,0,0.05)'};
            background:${activeCategory === c ? '#1A1A1A' : '#FFF'};
            color:${activeCategory === c ? '#FFF' : '#1A1A1A'};
            font-family:'DM Sans',sans-serif;
            text-transform:uppercase; letter-spacing:0.5px;
          ">${c}</button>
        `).join('')}
      </div>

      <!-- Grid -->
      <div id="wardrobe-grid"></div>

      <!-- AI Insights -->
      <div id="ai-insights" style="margin-top:32px;"></div>
    `;

    const gridEl = pageContent.querySelector('#wardrobe-grid');
    const insightsEl = pageContent.querySelector('#ai-insights');

    if (isLoading) {
      gridEl.innerHTML = `
        <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:16px;">
          ${Array(6).fill(`<div class="shimmer" style="aspect-ratio:3/4; border-radius:24px; background:#FFF;"></div>`).join('')}
        </div>
      `;
    } else if (wardrobeItems.length === 0) {
      gridEl.innerHTML = `
        <div style="background:#FFF; border-radius:32px; padding:64px 24px; text-align:center; box-shadow:0 10px 40px rgba(0,0,0,0.04); border: 1px solid rgba(0,0,0,0.01);">
          <div style="font-size:56px; margin-bottom:20px; opacity:0.2;">🧥</div>
          <h3 style="font-family:'Cormorant Garamond',serif; font-size:24px; font-weight:600; color:#1A1A1A; margin-bottom:8px;">Archive Empty</h3>
          <p style="font-size:14px; color:rgba(0,0,0,0.4); margin-bottom:32px; font-weight:500;">Begin curating your digital wardrobe collection.</p>
          <button class="btn-add-empty" style="padding:16px 40px; border-radius:100px; font-size:14px; font-weight:750; cursor:pointer; background:#1A1A1A; color:#FFF; border:none; text-transform:uppercase; letter-spacing:1px;">Add First Piece</button>
        </div>
      `;
      pageContent.querySelector('.btn-add-empty')?.addEventListener('click', () => navigate('/add-item'));
    } else {
      // Tight 3-column grid
      gridEl.innerHTML = `
        <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:16px;">
          ${wardrobeItems.map((item, i) => `
            <div class="wardrobe-card" data-index="${i}" style="
              border-radius:24px; overflow:hidden; cursor:pointer; position:relative;
              background:#FFF; box-shadow:0 4px 20px rgba(0,0,0,0.04); border: 1px solid rgba(0,0,0,0.01);
              transition:all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
            ">
              <div style="aspect-ratio:3/4; background:#F2EFEA; overflow:hidden;">
                ${item.imageUrl
                  ? `<img src="http://${window.location.hostname}:3001${item.imageUrl}" style="width:100%;height:100%;object-fit:cover;transition:transform 0.5s ease;" />`
                  : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:32px;opacity:0.3;">👕</div>`
                }
              </div>
              <div style="padding:12px 14px;">
                <div style="font-size:13px; font-weight:700; color:#1A1A1A; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${item.name}</div>
                <div style="font-size:9px; color:rgba(0,0,0,0.3); font-weight:900; text-transform:uppercase; letter-spacing:1px; margin-top:2px;">${item.category || 'Piece'}</div>
              </div>
            </div>
          `).join('')}
        </div>
      `;

      // AI Insights (1-2 max)
      const insights = [];
      
      // Analyze wardrobe for insights
      const colorCounts = {};
      const categoryCounts = {};
      wardrobeItems.forEach(item => {
        (item.colors || []).forEach(c => {
          const name = c.toLowerCase();
          colorCounts[name] = (colorCounts[name] || 0) + 1;
        });
        if (item.category) {
          categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
        }
      });

      const topColor = Object.entries(colorCounts).sort((a,b) => b[1]-a[1])[0];
      if (topColor) {
        insights.push(`Your palette is dominated by <strong>${topColor[0]}</strong>, appearing in ${topColor[1]} pieces.`);
      }

      // Check all essential categories
      const essentials = [
        { key: 'tops', label: 'Tops', emoji: '👕' },
        { key: 'bottoms', label: 'Pants', emoji: '👖' },
        { key: 'shoes', label: 'Footwear', emoji: '👟' },
        { key: 'outerwear', label: 'Outerwear', emoji: '🧥' },
      ];
      const missing = essentials.filter(e => !categoryCounts[e.key]);
      if (missing.length > 0 && wardrobeItems.length >= 2) {
        const names = missing.map(m => `<strong>${m.label}</strong>`).join(', ');
        insights.push(`We recommend adding ${names} to complete your core collection.`);
      }

      if (insights.length > 0) {
        insightsEl.innerHTML = `
          <div style="background:#FDFBFA; border-radius:24px; padding:28px; border:1px solid rgba(193,122,86,0.1);">
            <div style="font-size:10px; font-weight:900; color:#C17A56; text-transform:uppercase; letter-spacing:1.5px; margin-bottom:12px;">Editorial Insights</div>
            ${insights.map(text => `
              <div style="font-family:'Cormorant Garamond', serif; font-size:17px; color:#1A1A1A; line-height:1.5; margin-bottom:10px; font-style:italic;">"${text}"</div>
            `).join('')}
          </div>
        `;
      }
    }

    main.appendChild(pageContent);
    layout.appendChild(main);

    // === BIND EVENTS ===

    // Add item button
    pageContent.querySelector('#btn-add-item')?.addEventListener('click', () => navigate('/add-item'));

    // Filter pills
    pageContent.querySelectorAll('.filter-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        if (activeCategory !== btn.dataset.cat) {
          activeCategory = btn.dataset.cat;
          loadItems();
        }
      });
    });

    // Card tap → bottom sheet modal  
    pageContent.querySelectorAll('.wardrobe-card').forEach(card => {
      // Hover effects
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-4px)';
        card.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)';
        const img = card.querySelector('img');
        if (img) img.style.transform = 'scale(1.05)';
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
        const img = card.querySelector('img');
        if (img) img.style.transform = '';
      });

      card.addEventListener('click', () => {
        const item = wardrobeItems[card.dataset.index];
        showItemSheet(item);
      });
    });

    // FAB
    const fab = document.createElement('button');
    fab.className = 'fab';
    fab.innerHTML = icons.plus;
    fab.addEventListener('click', () => navigate('/add-item'));
    layout.appendChild(fab);
  }

  function showItemSheet(item) {
    const modal = document.createElement('div');
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.4);backdrop-filter:blur(8px);z-index:9999;display:flex;align-items:flex-end;justify-content:center;';
    modal.innerHTML = `
      <div class="animate-fade-in-up" style="background:#FFF;width:100%;max-width:480px;border-radius:24px 24px 0 0;padding:24px;max-height:85vh;overflow-y:auto;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
          <h3 style="font-family:'Playfair Display',serif;font-size:20px;font-weight:700;">Item Details</h3>
          <button id="close-item" style="background:#F2EFEA;border:none;border-radius:50%;width:32px;height:32px;cursor:pointer;font-size:14px;">✕</button>
        </div>

        <div style="aspect-ratio:3/4;border-radius:20px;overflow:hidden;background:#F2EFEA;margin-bottom:16px;">
          ${item.imageUrl
            ? `<img src="http://${window.location.hostname}:3001${item.imageUrl}" style="width:100%;height:100%;object-fit:cover;" />`
            : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:48px;opacity:0.3;">👕</div>`
          }
        </div>

        <!-- Edit Form -->
        <div style="margin-bottom:12px;">
          <label style="font-size:11px;font-weight:700;color:rgba(0,0,0,0.4);text-transform:uppercase;letter-spacing:0.5px;display:block;margin-bottom:6px;">Name</label>
          <input id="edit-name" class="input-field" type="text" value="${item.name}" style="border-radius:12px;" />
        </div>

        <div style="margin-bottom:16px;">
          <label style="font-size:11px;font-weight:700;color:rgba(0,0,0,0.4);text-transform:uppercase;letter-spacing:0.5px;display:block;margin-bottom:6px;">Category</label>
          <select id="edit-category" class="select-field" style="border-radius:12px;">
            <option value="tops" ${item.category==='tops'?'selected':''}>Tops</option>
            <option value="outerwear" ${item.category==='outerwear'?'selected':''}>Outerwear</option>
            <option value="bottoms" ${item.category==='bottoms'?'selected':''}>Bottoms</option>
            <option value="shoes" ${item.category==='shoes'?'selected':''}>Shoes</option>
            <option value="accessories" ${item.category==='accessories'?'selected':''}>Accessories</option>
          </select>
        </div>

        ${(item.colors && item.colors.length > 0) ? `
          <div style="margin-bottom:16px;">
            <label style="font-size:11px;font-weight:700;color:rgba(0,0,0,0.4);text-transform:uppercase;letter-spacing:0.5px;display:block;margin-bottom:6px;">Colors</label>
            <div style="display:flex;gap:8px;">
              ${item.colors.map(c => `<div style="width:28px;height:28px;border-radius:50%;background:${c};border:2px solid rgba(0,0,0,0.08);"></div>`).join('')}
            </div>
          </div>
        ` : ''}

        <div style="display:flex;gap:10px;">
          <button id="btn-save" style="
            flex:1; padding:14px; border-radius:100px; font-size:14px; font-weight:700; cursor:pointer;
            background:#1A1A1A; color:#FFF; border:none; font-family:'DM Sans',sans-serif;
          ">Save Changes</button>
          <button id="btn-delete" style="
            padding:14px 20px; border-radius:100px; font-size:14px; font-weight:600; cursor:pointer;
            background:#FFF; color:#E53935; border:1.5px solid #FFCDD2; font-family:'DM Sans',sans-serif;
          ">Delete</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
    modal.querySelector('#close-item')?.addEventListener('click', () => modal.remove());

    modal.querySelector('#btn-save')?.addEventListener('click', async () => {
      const btn = modal.querySelector('#btn-save');
      btn.textContent = 'Saving...';
      btn.style.opacity = '0.6';
      try {
        const fd = new FormData();
        fd.append('name', modal.querySelector('#edit-name').value);
        fd.append('category', modal.querySelector('#edit-category').value);
        await api.request(`/wardrobe/${item.id}`, { method: 'PUT', body: fd });
        modal.remove();
        loadItems();
      } catch(err) {
        btn.textContent = 'Save Changes';
        btn.style.opacity = '1';
        alert('Failed: ' + err.message);
      }
    });

    modal.querySelector('#btn-delete')?.addEventListener('click', async () => {
      if (confirm('Delete this item permanently?')) {
        try {
          await api.request(`/wardrobe/${item.id}`, { method: 'DELETE' });
          modal.remove();
          loadItems();
        } catch(err) {
          alert('Failed: ' + err.message);
        }
      }
    });
  }

  // Boot
  loadItems();
}
