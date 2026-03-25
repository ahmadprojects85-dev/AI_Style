// ── Add New Item Page ──
import { createSidebar } from '../components/sidebar.js';
import { createTopbar } from '../components/topbar.js';
import { icons } from '../components/icons.js';
import { api } from '../api.js';
import { navigate } from '../router.js';

const colorOptions = [
  { name: 'Black', hex: '#1C1C1E' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Cream', hex: '#F0E8D8' },
  { name: 'Beige', hex: '#C8B89A' },
  { name: 'Camel', hex: '#C4956A' },
  { name: 'Sage Green', hex: '#9CAF88' },
  { name: 'Navy', hex: '#2C3E50' },
  { name: 'Burgundy', hex: '#722F37' },
  { name: 'Olive', hex: '#6B7B5E' },
  { name: 'Brown', hex: '#8B6914' },
  { name: 'Gray', hex: '#9B9B9B' },
  { name: 'Blush', hex: '#E8B5CE' },
];

const seasons = ['Spring', 'Summer', 'Fall', 'Winter'];

export function renderAddItem(container) {
  let uploadedFiles = []; // Array of { file, preview }
  let selectedColors = [];
  let selectedSeasons = [];
  let formState = { name: '', category: '', brand: '' };
  
  container.innerHTML = `<div class="app-layout page"></div>`;
  const layout = container.querySelector('.app-layout');

  layout.appendChild(createSidebar('/wardrobe'));

  const main = document.createElement('div');
  main.className = 'main-content';
  main.appendChild(createTopbar('Add New Item ✦'));

  const pageContent = document.createElement('div');
  pageContent.className = 'page-content';

  function saveFormState() {
    const nameInput = pageContent.querySelector('#item-name');
    const catInput = pageContent.querySelector('#item-category');
    const brandInput = pageContent.querySelector('#item-brand');
    
    if (nameInput) formState.name = nameInput.value;
    if (catInput) formState.category = catInput.value;
    if (brandInput) formState.brand = brandInput.value;
  }

  function renderContent() {
    const hasImage = uploadedFiles.length > 0;

    pageContent.innerHTML = `
      <div class="add-item-layout animate-fade-in-up">
        <!-- Left: Upload Zone & Previews -->
        <div>
          <div class="drop-zone" id="drop-zone" style="min-height:220px; border-style: ${hasImage ? 'dashed' : 'solid'}; background: ${hasImage ? 'rgba(0,0,0,0.02)' : 'var(--surface-variant)'}">
            <div style="width:48px;height:48px;border-radius:50%;background:var(--accent-light);display:flex;align-items:center;justify-content:center;margin-bottom:var(--sp-2);color:var(--accent)">
              ${icons.upload}
            </div>
            <p style="font-weight:600; font-size:14px;">${hasImage ? 'Add another angle' : 'Drop your primary photo here'}</p>
            <p class="body-sm" style="margin-top:4px;">${hasImage ? `${uploadedFiles.length}/5 photos added` : 'AI will analyze your item automatically'}</p>
            <input type="file" id="file-input" accept="image/*" multiple style="display:none" />
          </div>

          <!-- Multi-Angle Guidance -->
          <div style="margin-top:16px; padding:16px; background:#FDF8F3; border-radius:16px; border:1px solid #F0E6D8;">
            <div style="display:flex; gap:12px;">
              <div style="font-size:20px;">💡</div>
              <div style="flex:1;">
                <h4 style="font-size:13px; font-weight:700; color:#855B44; margin-bottom:4px;">Pro Tip: Angles Matter!</h4>
                <p style="font-size:12px; color:#A6836F; line-height:1.4;">Adding photos of the back, tag, or fabric detail helps me suggest better outfits for you.</p>
              </div>
            </div>
          </div>

          <!-- Previews -->
          ${hasImage ? `
            <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:10px; margin-top:20px;">
              ${uploadedFiles.map((img, idx) => `
                <div style="position:relative; aspect-ratio:1/1; border-radius:12px; overflow:hidden; border:2px solid ${idx === 0 ? 'var(--accent)' : 'transparent'}">
                  <img src="${img.preview}" style="width:100%; height:100%; object-fit:cover;" />
                  ${idx === 0 ? `<div style="position:absolute; bottom:0; left:0; right:0; background:var(--accent); color:#fff; font-size:9px; font-weight:800; text-align:center; padding:2px; text-transform:uppercase;">Primary</div>` : ''}
                  <button class="btn-remove-angle" data-idx="${idx}" style="position:absolute; top:4px; right:4px; width:20px; height:20px; border-radius:50%; background:rgba(0,0,0,0.5); color:#fff; border:none; cursor:pointer; font-size:10px; display:flex; align-items:center; justify-content:center;">✕</button>
                </div>
              `).join('')}
              ${uploadedFiles.length < 5 ? `
                <div id="btn-add-more" style="aspect-ratio:1/1; border-radius:12px; border:1.5px dashed rgba(0,0,0,0.1); display:flex; flex-direction:column; align-items:center; justify-content:center; gap:4px; cursor:pointer; background:#fff;">
                  <span style="font-size:20px; color:rgba(0,0,0,0.3);">+</span>
                  <span style="font-size:9px; font-weight:600; color:rgba(0,0,0,0.4); text-transform:uppercase;">Add Angle</span>
                </div>
              ` : ''}
            </div>
          ` : ''}
        </div>

        <!-- Right: Metadata Form -->
        <div>
          ${hasImage ? `
            <div class="ai-banner" style="margin-bottom: var(--sp-3); padding: 12px; background: var(--accent-light); border-radius: var(--radius-sm); border-left: 3px solid var(--accent);">
              <span class="ai-icon" style="color: var(--accent); font-weight: bold; margin-right: 8px;">✦</span>
              <span class="body-sm" style="color: var(--text-primary)">AI will study all angles to extract the best metadata & colors.</span>
            </div>
          ` : ''}

          <div class="form-group">
            <label>Item Name</label>
            <input class="input-field" type="text" placeholder="e.g., Cashmere Turtleneck" id="item-name" value="${formState.name}" />
          </div>

          <div class="form-group">
            <label>Category</label>
            <select class="select-field" id="item-category">
              <option value="" ${formState.category === '' ? 'selected' : ''}>Select category</option>
              <option value="tops" ${formState.category === 'tops' ? 'selected' : ''}>Tops</option>
              <option value="outerwear" ${formState.category === 'outerwear' ? 'selected' : ''}>Outerwear</option>
              <option value="bottoms" ${formState.category === 'bottoms' ? 'selected' : ''}>Bottoms</option>
              <option value="shoes" ${formState.category === 'shoes' ? 'selected' : ''}>Shoes</option>
              <option value="accessories" ${formState.category === 'accessories' ? 'selected' : ''}>Accessories</option>
            </select>
          </div>

          <div class="form-group">
            <label>Color Palette</label>
            <div class="color-chips">
              ${colorOptions.map(c => `
                <div class="color-swatch${selectedColors.includes(c.name) ? ' active' : ''}" 
                     style="background:${c.hex}" 
                     data-color="${c.name}"
                     title="${c.name}"></div>
              `).join('')}
            </div>
          </div>

          <div class="form-group">
            <label>Season(s)</label>
            <div class="season-toggles">
              ${seasons.map(s => `
                <div class="chip${selectedSeasons.includes(s) ? ' active' : ''}" data-season="${s}">${s}</div>
              `).join('')}
            </div>
          </div>

          <div class="form-group">
            <label>Brand (optional)</label>
            <input class="input-field" type="text" placeholder="e.g., Acne Studios" id="item-brand" value="${formState.brand}" />
          </div>

          <button class="btn-primary" style="width:100%;margin-top:var(--sp-2)" id="btn-save">Save to Wardrobe</button>
        </div>
      </div>
    `;

    bindEvents();
  }

  function bindEvents() {
    const dropZone = pageContent.querySelector('#drop-zone');
    const fileInput = pageContent.querySelector('#file-input');
    const btnAddMore = pageContent.querySelector('#btn-add-more');

    if (dropZone && fileInput) {
      const triggerUpload = () => fileInput.click();
      dropZone.addEventListener('click', triggerUpload);
      btnAddMore?.addEventListener('click', triggerUpload);

      dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
      });
      dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
      dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        Array.from(e.dataTransfer.files).forEach(file => handleFile(file));
      });
      fileInput.addEventListener('change', (e) => {
        Array.from(e.target.files).forEach(file => handleFile(file));
        fileInput.value = ''; // Reset to allow same file again if needed
      });
    }

    pageContent.querySelectorAll('.btn-remove-angle').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = parseInt(btn.dataset.idx);
        uploadedFiles.splice(idx, 1);
        renderContent();
      });
    });

    // Color swatches (already there, just bind)
    pageContent.querySelectorAll('.color-swatch').forEach(swatch => {
      swatch.addEventListener('click', () => {
        saveFormState();
        const color = swatch.dataset.color;
        if (selectedColors.includes(color)) {
          selectedColors = selectedColors.filter(c => c !== color);
        } else {
          selectedColors.push(color);
        }
        renderContent();
      });
    });

    // Season chips
    pageContent.querySelectorAll('.chip').forEach(chip => {
      chip.addEventListener('click', () => {
        saveFormState();
        const season = chip.dataset.season;
        if (selectedSeasons.includes(season)) {
          selectedSeasons = selectedSeasons.filter(s => s !== season);
        } else {
          selectedSeasons.push(season);
        }
        renderContent();
      });
    });

    // Save button
    pageContent.querySelector('#btn-save')?.addEventListener('click', async (e) => {
      e.preventDefault();
      saveFormState();
      
      const name = formState.name.trim();
      const category = formState.category;
      const brand = formState.brand.trim();

      if (uploadedFiles.length === 0 && (!name || !category)) {
        return alert('Please upload at least one photo (primary angle).');
      }

      const btn = pageContent.querySelector('#btn-save');
      if(btn) {
        btn.innerHTML = `Analyzing ${uploadedFiles.length} Angles <span class="loading-dots">...</span>`;
        btn.style.opacity = '0.7';
        btn.style.pointerEvents = 'none';
      }

      try {
        const formData = new FormData();
        if (name) formData.append('name', name);
        if (category) formData.append('category', category);
        if (brand) formData.append('brand', brand);
        
        const colorHexes = selectedColors.map(c => colorOptions.find(opt => opt.name === c)?.hex).filter(Boolean);
        formData.append('colors', JSON.stringify(colorHexes));
        formData.append('colorNames', JSON.stringify(selectedColors));
        formData.append('seasons', JSON.stringify(selectedSeasons.map(s => s.toLowerCase())));

        uploadedFiles.forEach(item => {
          formData.append('images', item.file);
        });

        await api.addWardrobeItem(formData);
        navigate('/wardrobe');
      } catch (err) {
        alert('Failed to save item: ' + err.message);
        if(btn) {
          btn.textContent = 'Save to Wardrobe';
          btn.style.opacity = '1';
          btn.style.pointerEvents = 'auto';
        }
      }
    });
  }

  function handleFile(file) {
    if (uploadedFiles.length >= 5) return;
    if (file && file.type.startsWith('image/')) {
      saveFormState();
      const reader = new FileReader();
      reader.onload = (e) => {
        uploadedFiles.push({ file, preview: e.target.result });
        renderContent();
      };
      reader.readAsDataURL(file);
    }
  }

  renderContent();
  main.appendChild(pageContent);
  layout.appendChild(main);
}
