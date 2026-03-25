// ── Profile — Clean & Fast (Redesigned) ──
import { createSidebar } from '../components/sidebar.js';
import { icons } from '../components/icons.js';
import { api } from '../api.js';

export function renderProfile(container) {
  const user = JSON.parse(localStorage.getItem('styleai_user') || '{}');
  const name = user.name || 'Friend';
  const styles = user.styles || user.stylePreferences || ['Minimalist'];

  container.innerHTML = `<div class="app-layout page"></div>`;
  const layout = container.querySelector('.app-layout');
  layout.appendChild(createSidebar('/profile'));

  const main = document.createElement('div');
  main.className = 'main-content';
  main.style.background = '#F6F3EE';

  const pageContent = document.createElement('div');
  pageContent.className = 'page-content';
  pageContent.style.cssText = 'padding-top:16px; padding-bottom:100px; max-width:480px; margin:0 auto;';

  pageContent.innerHTML = `
    <div class="animate-fade-in-up">
      <!-- Identity Header -->
      <div style="background:#FFF; border-radius:24px; padding:24px; box-shadow:0 2px 12px rgba(0,0,0,0.03); margin-bottom:16px;">
        <div style="display:flex; gap:16px; align-items:center; margin-bottom:20px;">
          <div style="width:64px; height:64px; border-radius:50%; background:linear-gradient(135deg, #E8E3DB, #D4CFC5); display:flex; align-items:center; justify-content:center; font-size:28px; flex-shrink:0; overflow:hidden;">
            ${user.avatarUrl ? `<img src="${user.avatarUrl}" style="width:100%;height:100%;object-fit:cover;" />` : name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 style="font-family:'Playfair Display',serif; font-size:22px; font-weight:700; color:#1A1A1A;">${name}</h2>
            <p style="font-size:13px; color:rgba(0,0,0,0.4);">${user.email || ''}</p>
          </div>
        </div>

        <!-- City & Gender row -->
        <div style="display:flex; gap:12px; margin-bottom:16px;">
          <div style="flex:1; background:#F6F3EE; border-radius:14px; padding:12px 16px;">
            <div style="font-size:10px; font-weight:700; color:rgba(0,0,0,0.35); text-transform:uppercase; letter-spacing:0.5px; margin-bottom:2px;">City</div>
            <div style="display:flex; align-items:center; gap:6px;">
              <span id="city-text" style="font-size:14px; font-weight:600; color:#1A1A1A;">${user.city ? user.city.split('|').pop().split(',')[0] : 'Not set'}</span>
              <button id="edit-city-btn" style="background:none;border:none;cursor:pointer;font-size:12px;color:rgba(0,0,0,0.3);">✎</button>
            </div>
            <!-- City edit inline -->
            <div id="city-edit" style="display:none; margin-top:8px;">
              <div style="display:flex;gap:6px;">
                <input id="city-input" type="text" value="${user.city || ''}" placeholder="Slemani, IQ" style="flex:1;padding:8px 12px;border:1.5px solid rgba(0,0,0,0.1);border-radius:10px;font-size:13px;font-family:'DM Sans',sans-serif;outline:none;" autocomplete="off" />
                <button id="city-save" style="padding:8px 14px;border-radius:10px;font-size:12px;font-weight:700;background:#1A1A1A;color:#FFF;border:none;cursor:pointer;">Save</button>
              </div>
              <div id="city-autocomplete" style="position:relative;">
                <div id="city-results" style="position:absolute;top:4px;left:0;right:0;background:#FFF;border:1px solid rgba(0,0,0,0.08);border-radius:10px;max-height:120px;overflow-y:auto;display:none;z-index:50;box-shadow:0 4px 16px rgba(0,0,0,0.1);"></div>
              </div>
            </div>
          </div>
          <div style="flex:1; background:#F6F3EE; border-radius:14px; padding:12px 16px;">
            <div style="font-size:10px; font-weight:700; color:rgba(0,0,0,0.35); text-transform:uppercase; letter-spacing:0.5px; margin-bottom:2px;">Gender</div>
            <span style="font-size:14px; font-weight:600; color:#1A1A1A; text-transform:capitalize;">${user.gender || 'Not set'}</span>
          </div>
        </div>

        <!-- Style Preferences -->
        <div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <span style="font-size:10px; font-weight:700; color:rgba(0,0,0,0.35); text-transform:uppercase; letter-spacing:0.5px;">Style Preferences</span>
            <button id="edit-styles-btn" style="background:none;border:none;cursor:pointer;font-size:12px;color:rgba(0,0,0,0.3);">✎</button>
          </div>
          <div id="styles-display" style="display:flex; flex-wrap:wrap; gap:8px;">
            ${styles.map(s => `<span style="font-size:12px;font-weight:600;padding:6px 14px;background:#F6F3EE;color:rgba(0,0,0,0.65);border-radius:100px;">${s}</span>`).join('')}
          </div>
          <div id="styles-edit" style="display:none; margin-top:8px;">
            <div id="styles-grid" style="display:flex; flex-wrap:wrap; gap:8px; margin-bottom:10px;"></div>
            <div style="display:flex;gap:8px;">
              <button id="styles-save" style="padding:8px 16px;border-radius:10px;font-size:12px;font-weight:700;background:#1A1A1A;color:#FFF;border:none;cursor:pointer;">Save</button>
              <button id="styles-cancel" style="padding:8px 16px;border-radius:10px;font-size:12px;font-weight:600;background:transparent;color:#1A1A1A;border:1px solid rgba(0,0,0,0.1);cursor:pointer;">Cancel</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Stats -->
      <div style="display:flex; gap:10px; margin-bottom:16px;">
        <div style="flex:1; background:#FFF; border-radius:16px; padding:16px; text-align:center; box-shadow:0 2px 8px rgba(0,0,0,0.03);">
          <div style="font-size:22px; font-weight:700; color:#1A1A1A;" id="stat-items">—</div>
          <div style="font-size:10px; color:rgba(0,0,0,0.4); font-weight:600; text-transform:uppercase; letter-spacing:0.5px;">Items</div>
        </div>
        <div style="flex:1; background:#FFF; border-radius:16px; padding:16px; text-align:center; box-shadow:0 2px 8px rgba(0,0,0,0.03);">
          <div style="font-size:22px; font-weight:700; color:#1A1A1A;" id="stat-color">—</div>
          <div style="font-size:10px; color:rgba(0,0,0,0.4); font-weight:600; text-transform:uppercase; letter-spacing:0.5px;">Top Color</div>
        </div>
        <div style="flex:1; background:#FFF; border-radius:16px; padding:16px; text-align:center; box-shadow:0 2px 8px rgba(0,0,0,0.03);">
          <div style="font-size:22px; font-weight:700; color:#1A1A1A;">✦</div>
          <div style="font-size:10px; color:rgba(0,0,0,0.4); font-weight:600; text-transform:uppercase; letter-spacing:0.5px;">AI Styled</div>
        </div>
      </div>

      <!-- Settings -->
      <div style="background:#FFF; border-radius:20px; overflow:hidden; box-shadow:0 2px 12px rgba(0,0,0,0.03);">
        <div class="settings-row" data-action="privacy" style="display:flex;align-items:center;gap:14px;padding:16px 20px;cursor:pointer;transition:background 0.15s ease;border-bottom:1px solid rgba(0,0,0,0.04);">
          <span style="font-size:18px;">🔒</span>
          <span style="flex:1;font-size:14px;font-weight:500;color:#1A1A1A;">Privacy & Data</span>
          <span style="font-size:14px;color:rgba(0,0,0,0.2);">›</span>
        </div>
        <div class="settings-row" data-action="notifications" style="display:flex;align-items:center;gap:14px;padding:16px 20px;cursor:pointer;transition:background 0.15s ease;border-bottom:1px solid rgba(0,0,0,0.04);">
          <span style="font-size:18px;">🔔</span>
          <span style="flex:1;font-size:14px;font-weight:500;color:#1A1A1A;">Notifications</span>
          <span style="font-size:14px;color:rgba(0,0,0,0.2);">›</span>
        </div>
        <div class="settings-row" data-action="weather" style="display:flex;align-items:center;gap:14px;padding:16px 20px;cursor:pointer;transition:background 0.15s ease;border-bottom:1px solid rgba(0,0,0,0.04);">
          <span style="font-size:18px;">🌡️</span>
          <span style="flex:1;font-size:14px;font-weight:500;color:#1A1A1A;">Weather Units</span>
          <span style="font-size:14px;color:rgba(0,0,0,0.2);">›</span>
        </div>
        <div class="settings-row" data-action="logout" style="display:flex;align-items:center;gap:14px;padding:16px 20px;cursor:pointer;transition:background 0.15s ease;">
          <span style="font-size:18px;">🚪</span>
          <span style="flex:1;font-size:14px;font-weight:500;color:#E53935;">Logout</span>
        </div>
      </div>
    </div>
  `;

  // Load stats
  api.getWardrobeStats().then(stats => {
    const itemsEl = document.getElementById('stat-items');
    if (itemsEl) itemsEl.textContent = stats.totalItems || '0';
    // Top color from stats or default
    const colorEl = document.getElementById('stat-color');
    if (colorEl && stats.topColor) colorEl.textContent = stats.topColor;
  }).catch(() => {});

  // Settings hover
  pageContent.querySelectorAll('.settings-row').forEach(row => {
    row.addEventListener('mouseenter', () => { row.style.background = '#F6F3EE'; });
    row.addEventListener('mouseleave', () => { row.style.background = ''; });
  });

  // Logout
  pageContent.querySelector('[data-action="logout"]')?.addEventListener('click', () => {
    api.setToken(null);
    localStorage.removeItem('styleai_user');
    window.location.hash = '/';
    window.location.reload();
  });

  // City edit
  const editCityBtn = pageContent.querySelector('#edit-city-btn');
  const cityEdit = pageContent.querySelector('#city-edit');
  const cityInput = pageContent.querySelector('#city-input');
  const citySave = pageContent.querySelector('#city-save');
  const cityResults = pageContent.querySelector('#city-results');
  let searchTimeout;

  editCityBtn?.addEventListener('click', () => {
    cityEdit.style.display = 'block';
    editCityBtn.style.display = 'none';
    cityInput.focus();
  });

  cityInput?.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    const val = e.target.value.trim();
    if (val.length < 2) { cityResults.style.display = 'none'; return; }
    
    searchTimeout = setTimeout(async () => {
      try {
        const results = await api.searchCity(val);
        if (results?.length > 0) {
          cityResults.innerHTML = results.map(r => `
            <div class="city-option" data-val="${r.label}" data-id="${r.id}" style="padding:10px 12px;cursor:pointer;font-size:13px;border-bottom:1px solid rgba(0,0,0,0.04);">
              <strong>${r.name}</strong> <span style="color:rgba(0,0,0,0.4);font-size:11px;">${r.state ? r.state + ', ' : ''}${r.country}</span>
            </div>
          `).join('');
          cityResults.style.display = 'block';
          cityResults.querySelectorAll('.city-option').forEach(opt => {
            opt.addEventListener('click', () => {
              cityInput.value = opt.dataset.val;
              cityInput.dataset.selectedId = opt.dataset.id;
              cityResults.style.display = 'none';
            });
          });
        } else {
          cityResults.style.display = 'none';
        }
      } catch(err) { console.error(err); }
    }, 400);
  });

  citySave?.addEventListener('click', async () => {
    const label = cityInput.value.trim();
    if (!label) return;
    const id = cityInput.dataset.selectedId;
    const finalCity = id ? `${id}|${label}` : label;

    citySave.textContent = '...';
    try {
      await api.updateProfile({ city: finalCity });
      user.city = finalCity;
      localStorage.setItem('styleai_user', JSON.stringify(user));
      document.getElementById('city-text').textContent = label.split(',')[0];
      cityEdit.style.display = 'none';
      editCityBtn.style.display = 'inline';
      citySave.textContent = 'Save';
      window.dispatchEvent(new Event('profileUpdated'));
    } catch(err) {
      citySave.textContent = 'Save';
      alert('Failed: ' + err.message);
    }
  });

  // Style preferences edit
  const allStyles = ['Old Money', 'Casual', 'Streetwear', 'Sporty', 'Elegant', 'Minimalist', 'Other'];
  let currentSelection = [...styles];

  const editStylesBtn = pageContent.querySelector('#edit-styles-btn');
  const stylesDisplay = pageContent.querySelector('#styles-display');
  const stylesEdit = pageContent.querySelector('#styles-edit');
  const stylesGrid = pageContent.querySelector('#styles-grid');
  const stylesSave = pageContent.querySelector('#styles-save');
  const stylesCancel = pageContent.querySelector('#styles-cancel');

  function renderChips() {
    stylesGrid.innerHTML = allStyles.map(s => `
      <button class="style-chip" data-style="${s}" style="
        padding:6px 14px; border-radius:100px; font-size:12px; font-weight:600; cursor:pointer;
        border:1.5px solid ${currentSelection.includes(s) ? '#1A1A1A' : 'rgba(0,0,0,0.1)'};
        background:${currentSelection.includes(s) ? '#1A1A1A' : '#FFF'};
        color:${currentSelection.includes(s) ? '#FFF' : '#1A1A1A'};
        font-family:'DM Sans',sans-serif; transition:all 0.15s ease;
      ">${s}</button>
    `).join('');
    stylesGrid.querySelectorAll('.style-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const s = chip.dataset.style;
        if (currentSelection.includes(s)) currentSelection = currentSelection.filter(x => x !== s);
        else currentSelection.push(s);
        renderChips();
      });
    });
  }

  editStylesBtn?.addEventListener('click', () => {
    currentSelection = [...styles];
    stylesDisplay.style.display = 'none';
    editStylesBtn.style.display = 'none';
    stylesEdit.style.display = 'block';
    renderChips();
  });

  stylesCancel?.addEventListener('click', () => {
    stylesDisplay.style.display = 'flex';
    editStylesBtn.style.display = 'inline';
    stylesEdit.style.display = 'none';
  });

  stylesSave?.addEventListener('click', async () => {
    if (currentSelection.length === 0) return;
    stylesSave.textContent = '...';
    try {
      await api.updateProfile({ stylePreferences: currentSelection });
      user.styles = currentSelection;
      user.stylePreferences = currentSelection;
      styles.length = 0;
      styles.push(...currentSelection);
      localStorage.setItem('styleai_user', JSON.stringify(user));

      stylesDisplay.innerHTML = styles.map(s => `<span style="font-size:12px;font-weight:600;padding:6px 14px;background:#F6F3EE;color:rgba(0,0,0,0.65);border-radius:100px;">${s}</span>`).join('');
      stylesDisplay.style.display = 'flex';
      editStylesBtn.style.display = 'inline';
      stylesEdit.style.display = 'none';
      stylesSave.textContent = 'Save';
      window.dispatchEvent(new Event('profileUpdated'));
    } catch(err) {
      stylesSave.textContent = 'Save';
      alert('Failed: ' + err.message);
    }
  });

  main.appendChild(pageContent);
  layout.appendChild(main);
}
