// ── Fit Check — The Viral Feature (Redesigned) ──
import { createSidebar } from '../components/sidebar.js';
import { createTopbar } from '../components/topbar.js';
import { icons } from '../components/icons.js';
import { api } from '../api.js';

export function renderFitCheck(container) {
  let uploadedFile = null;
  let uploadedPreview = null;
  let fitCheckResult = null;
  let isAnalyzing = false;
  let showingScore = false; // tension state

  container.innerHTML = `<div class="app-layout page"></div>`;
  const layout = container.querySelector('.app-layout');
  layout.appendChild(createSidebar('/fit-check'));

  const main = document.createElement('div');
  main.className = 'main-content';
  main.style.background = '#F6F3EE';

  const pageContent = document.createElement('div');
  pageContent.className = 'page-content';
  pageContent.style.cssText = 'padding-top:16px; padding-bottom:100px; max-width:540px; margin:0 auto;';

  function renderContent() {
    if (fitCheckResult && !showingScore) {
      renderResults();
      return;
    }

    pageContent.innerHTML = `
      <div class="animate-fade-in-up">
        ${uploadedPreview ? renderPhotoState() : renderUploadState()}
      </div>
    `;

    bindEvents();
  }

  function renderUploadState() {
    return `
      <!-- Hero Upload -->
      <div style="background:#FFF; border-radius:32px; overflow:hidden; box-shadow:0 4px 30px rgba(0,0,0,0.04); border: 1px solid rgba(0,0,0,0.01);">
        <div id="fitcheck-drop" style="
          padding:64px 24px; text-align:center; cursor:pointer;
          border:1.5px dashed rgba(0,0,0,0.08); border-radius:32px; margin:16px;
          transition:all 0.4s cubic-bezier(0.22, 1, 0.36, 1); min-height:360px;
          display:flex; flex-direction:column; align-items:center; justify-content:center;
          background: #FDFBFA;
        " class="hover-lift">
          <div style="font-size:48px; margin-bottom:24px;">📸</div>
          <h3 style="font-family:'Cormorant Garamond',serif; font-size:32px; font-weight:600; color:#1A1A1A; margin-bottom:12px; letter-spacing:-0.5px;">The Fit Check</h3>
          <p style="font-size:15px; color:rgba(0,0,0,0.4); max-width:280px; line-height:1.6; font-weight:500;">Upload a photo of your outfit. Our AI stylist will score your look and provide editorial feedback.</p>
          <input type="file" id="fitcheck-file" accept="image/*" style="display:none" />
        </div>
      </div>

      <!-- Features Grid -->
      <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:12px; margin-top:20px;">
        <div style="background:#FFF; border-radius:32px; padding:24px 16px; text-align:center; border: 1px solid rgba(0,0,0,0.01);">
          <div style="font-size:32px; margin-bottom:8px;">🎯</div>
          <div style="font-size:11px; font-weight:900; color:#1A1A1A; text-transform:uppercase; letter-spacing:1px;">Tone Score</div>
          <div style="font-size:10px; color:rgba(0,0,0,0.3); font-weight:700; margin-top:4px;">OUT OF 10</div>
        </div>
        <div style="background:#FFF; border-radius:32px; padding:24px 16px; text-align:center; border: 1px solid rgba(0,0,0,0.01);">
          <div style="font-size:32px; margin-bottom:8px;">⚖️</div>
          <div style="font-size:11px; font-weight:900; color:#1A1A1A; text-transform:uppercase; letter-spacing:1px;">Logic</div>
          <div style="font-size:10px; color:rgba(0,0,0,0.3); font-weight:700; margin-top:4px;">PROS & CONS</div>
        </div>
        <div style="background:#FFF; border-radius:32px; padding:24px 16px; text-align:center; border: 1px solid rgba(0,0,0,0.01);">
          <div style="font-size:32px; margin-bottom:8px;">✨</div>
          <div style="font-size:11px; font-weight:900; color:#1A1A1A; text-transform:uppercase; letter-spacing:1px;">Swaps</div>
          <div style="font-size:10px; color:rgba(0,0,0,0.3); font-weight:700; margin-top:4px;">AI SUGGESTIONS</div>
        </div>
      </div>
    `;
  }

  function renderPhotoState() {
    if (isAnalyzing) {
      return `
        <div style="background:#FFF; border-radius:32px; overflow:hidden; box-shadow:0 10px 40px rgba(0,0,0,0.1); border:1px solid rgba(0,0,0,0.01);">
          <div style="position:relative;">
            <img src="${uploadedPreview}" style="width:100%; max-height:480px; object-fit:cover; filter:brightness(0.6);" />
            <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;">
              <div class="animate-tension" style="width:100px;height:100px;border-radius:50%;background:rgba(255,255,255,0.95);display:flex;align-items:center;justify-content:center;font-size:40px;box-shadow:0 12px 40px rgba(0,0,0,0.2);">
                ✦
              </div>
              <p style="color:#FFF;font-weight:700;font-size:18px;margin-top:24px;text-shadow:0 2px 10px rgba(0,0,0,0.3); font-family:'Cormorant Garamond', serif;">Consulting the Stylist...</p>
              <div style="width:120px; height:3px; background:rgba(255,255,255,0.2); border-radius:3px; margin-top:12px; overflow:hidden;">
                <div style="height:100%; width:40%; background:#FFF; border-radius:3px; animation: sweep 2s infinite linear;"></div>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    return `
      <div style="background:#FFF; border-radius:32px; overflow:hidden; box-shadow:0 10px 40px rgba(0,0,0,0.06); border:1px solid rgba(0,0,0,0.01);">
        <div style="position:relative;">
          <img src="${uploadedPreview}" style="width:100%; max-height:480px; object-fit:cover;" />
          <button id="btn-change-photo" style="position:absolute;top:20px;right:20px;background:rgba(0,0,0,0.6);color:#fff;padding:10px 20px;border-radius:100px;border:none;font-size:12px;font-weight:750;cursor:pointer;backdrop-filter:blur(8px);text-transform:uppercase;letter-spacing:1px;">✕ Change</button>
        </div>
        <div style="padding:40px; text-align:center;">
          <h3 style="font-family:'Cormorant Garamond',serif; font-size:28px; font-weight:600; color:#1A1A1A; margin-bottom:8px;">Style Analysis Ready</h3>
          <p style="font-size:14px; color:rgba(0,0,0,0.4); margin-bottom:32px; font-weight:500;">Click below to receive your personalized score and editorial feedback.</p>
          <button id="btn-analyze-fit" style="
            width:100%; padding:22px; border-radius:100px; font-size:16px; font-weight:700; cursor:pointer;
            background:#1A1A1A; color:#FFF; border:none; font-family:'DM Sans',sans-serif;
            box-shadow:0 10px 30px rgba(0,0,0,0.1);
          ">✦ Start Analysis</button>
        </div>
      </div>
    `;
  }

  function renderResults() {
    const score = fitCheckResult.score;
    const feedback = fitCheckResult.feedback || { pros: [], cons: [] };
    const swaps = fitCheckResult.recommendedSwaps || [];
    const verdict = fitCheckResult.verdict || 'Analysis complete.';
    const wc = fitCheckResult.weatherContext;

    let scoreEmoji = '🔥';
    if (score >= 9) scoreEmoji = '💯';
    else if (score >= 7) scoreEmoji = '🔥';
    else if (score >= 5) scoreEmoji = '👍';
    else scoreEmoji = '💡';

    pageContent.innerHTML = `
      <!-- Photo + Score Overlay -->
      <div class="animate-fade-in-up" style="position:relative; background:#FFF; border-radius:32px; overflow:hidden; box-shadow:0 10px 40px rgba(0,0,0,0.08); margin-bottom:24px;">
        <img src="${uploadedPreview}" style="width:100%; max-height:420px; object-fit:cover;" />
        <div style="position:absolute;bottom:0;left:0;right:0;padding:40px;background:linear-gradient(transparent, rgba(0,0,0,0.85));">
          <div style="display:flex;align-items:center;gap:20px;">
            <!-- Score Badge -->
            <div class="animate-score-reveal" style="width:84px;height:84px;border-radius:50%;background:#FFF;display:flex;align-items:center;justify-content:center;flex-direction:column;box-shadow:0 8px 32px rgba(0,0,0,0.25);">
              <span style="font-family:'Cormorant Garamond',serif;font-size:36px;font-weight:700;color:#1A1A1A;line-height:1;">${score}</span>
              <span style="font-size:10px;color:rgba(0,0,0,0.3);font-weight:900;text-transform:uppercase;letter-spacing:1px;margin-top:2px;">/10</span>
            </div>
            <div>
              <div style="font-size:24px;font-weight:600;color:#FFF;font-family:'Cormorant Garamond',serif;letter-spacing:-0.5px;">${scoreEmoji} ${score >= 8 ? 'Stunning.' : score >= 6 ? 'Sophisticated.' : 'Refine Needed.'}</div>
              ${wc ? `<div style="font-size:11px;color:rgba(255,255,255,0.6);margin-top:4px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">CONTEXT: ${wc.temp} · ${wc.condition.toUpperCase()}</div>` : ''}
            </div>
          </div>
        </div>
      </div>

      <!-- Verdict -->
      <div class="animate-slide-up" style="animation-delay:300ms; background:#FFF; border-radius:32px; padding:32px; box-shadow:0 4px 20px rgba(0,0,0,0.02); margin-bottom:16px; border:1px solid rgba(0,0,0,0.01);">
        <div style="font-family:'Cormorant Garamond',serif; font-style:italic; font-size:18px; color:rgba(0,0,0,0.8); line-height:1.6; text-align:center;">"${verdict}"</div>
      </div>

      <!-- Analysis Grid -->
      <div style="display:grid; grid-template-columns: 1fr; gap:16px; margin-bottom:16px;">
        <!-- Pros -->
        ${feedback.pros && feedback.pros.length > 0 ? `
        <div class="animate-slide-up" style="animation-delay:500ms; background:#FDFBFA; border-radius:24px; padding:28px; border:1px solid rgba(193,122,86,0.1);">
          <h4 style="font-size:11px; font-weight:900; color:#C17A56; margin-bottom:16px; text-transform:uppercase; letter-spacing:1.5px; display:flex; align-items:center; gap:8px;">
            <span style="font-size:16px;">✦</span> The Highlights
          </h4>
          <div style="display:flex;flex-direction:column;gap:12px;">
            ${feedback.pros.map(pro => `
              <div style="font-size:14px;color:#1A1A1A;line-height:1.6;font-weight:500;padding-left:14px;border-left:1px solid rgba(193,122,86,0.3);">
                ${pro}
              </div>
            `).join('')}
          </div>
        </div>
        ` : ''}

        <!-- Cons -->
        ${feedback.cons && feedback.cons.length > 0 ? `
        <div class="animate-slide-up" style="animation-delay:650ms; background:#FFF; border-radius:24px; padding:28px; border:1px solid rgba(0,0,0,0.04);">
          <h4 style="font-size:11px; font-weight:900; color:rgba(0,0,0,0.4); margin-bottom:16px; text-transform:uppercase; letter-spacing:1.5px; display:flex; align-items:center; gap:8px;">
            <span style="font-size:16px;">✎</span> Stylist's Notes
          </h4>
          <div style="display:flex;flex-direction:column;gap:12px;">
            ${feedback.cons.map(con => `
              <div style="font-size:14px;color:rgba(0,0,0,0.6);line-height:1.6;font-weight:500;padding-left:14px;border-left:1px solid rgba(0,0,0,0.1);">
                ${con}
              </div>
            `).join('')}
          </div>
        </div>
        ` : ''}
      </div>

      <!-- Swap Suggestions -->
      ${swaps.length > 0 ? `
      <div class="animate-slide-up" style="animation-delay:800ms; background:#FFF; border-radius:32px; padding:32px; border:1px solid rgba(0,0,0,0.01); box-shadow:0 4px 20px rgba(0,0,0,0.02); margin-bottom:16px;">
        <h4 style="font-size:11px; font-weight:900; color:#1A1A1A; margin-bottom:20px; text-transform:uppercase; letter-spacing:1.5px; text-align:center;">Wardrobe Refinements</h4>
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
          ${swaps.slice(0, 4).map(item => `
            <div style="background:#F9F7F5; border-radius:20px; padding:16px; display:flex; flex-direction:column; align-items:center; text-align:center;" class="hover-lift">
              ${item.imageUrl
                ? `<img src="http://${window.location.hostname}:3001${item.imageUrl}" style="width:64px;height:64px;border-radius:12px;object-fit:cover;margin-bottom:12px;filter:drop-shadow(0 4px 10px rgba(0,0,0,0.05));" />`
                : `<div style="width:64px;height:64px;background:#EAE7E0;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:24px;margin-bottom:12px;">👕</div>`
              }
              <div style="font-size:11px;font-weight:700;color:#1A1A1A;line-height:1.3;">${item.name}</div>
              <div style="font-size:9px;color:rgba(0,0,0,0.3);font-weight:800;text-transform:uppercase;letter-spacing:0.5px;margin-top:4px;">${item.category || 'VIBE MATCH'}</div>
            </div>
          `).join('')}
        </div>
      </div>
      ` : ''}

      <!-- Feed Action Loop -->
      <div class="animate-slide-up" style="animation-delay:950ms; display:flex; gap:12px; margin-top:12px;">
        <button id="btn-try-another" style="
          flex:1; padding:20px; border-radius:100px; font-size:14px; font-weight:750; cursor:pointer;
          background:#1A1A1A; color:#FFF; border:none; font-family:'DM Sans',sans-serif;
          text-transform:uppercase; letter-spacing:1px;
        ">Try Another</button>
        <button id="btn-improve" style="
          flex:1; padding:20px; border-radius:100px; font-size:14px; font-weight:750; cursor:pointer;
          background:transparent; color:#1A1A1A; border:1.5px solid #1A1A1A; font-family:'DM Sans',sans-serif;
          text-transform:uppercase; letter-spacing:1px;
        ">✦ Refine Now</button>
      </div>
    `;

    // Bind result actions
    pageContent.querySelector('#btn-try-another')?.addEventListener('click', () => {
      uploadedFile = null;
      uploadedPreview = null;
      fitCheckResult = null;
      renderContent();
    });

    pageContent.querySelector('#btn-improve')?.addEventListener('click', () => {
      // Navigate to Home with context to generate improved outfit
      window.location.hash = '/dashboard';
    });
  }

  function bindEvents() {
    const dropZone = pageContent.querySelector('#fitcheck-drop');
    const fileInput = pageContent.querySelector('#fitcheck-file');
    if (dropZone && fileInput) {
      dropZone.addEventListener('click', () => fileInput.click());
      dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = 'var(--accent, #C17A56)';
        dropZone.style.background = 'rgba(193,122,86,0.04)';
      });
      dropZone.addEventListener('dragleave', () => {
        dropZone.style.borderColor = 'rgba(0,0,0,0.12)';
        dropZone.style.background = '';
      });
      dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        if (e.dataTransfer.files[0]) handlePhoto(e.dataTransfer.files[0]);
      });
      fileInput.addEventListener('change', (e) => {
        if (e.target.files[0]) handlePhoto(e.target.files[0]);
      });
    }

    pageContent.querySelector('#btn-analyze-fit')?.addEventListener('click', submitForAnalysis);

    pageContent.querySelector('#btn-change-photo')?.addEventListener('click', () => {
      uploadedFile = null;
      uploadedPreview = null;
      fitCheckResult = null;
      renderContent();
    });
  }

  function handlePhoto(file) {
    if (file && file.type.startsWith('image/')) {
      uploadedFile = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        uploadedPreview = e.target.result;
        renderContent();
      };
      reader.readAsDataURL(file);
    }
  }

  async function submitForAnalysis() {
    if (!uploadedFile || isAnalyzing) return;

    isAnalyzing = true;
    renderContent();

    try {
      const formData = new FormData();
      formData.append('image', uploadedFile);

      const res = await api.submitFitCheck(formData);
      fitCheckResult = res.fitCheck;
      isAnalyzing = false;

      // === TENSION BUILD: Delay score reveal for dopamine ===
      showingScore = true;
      // Show a brief "calculating" state
      pageContent.innerHTML = `
        <div style="background:#FFF; border-radius:28px; overflow:hidden; box-shadow:0 4px 30px rgba(0,0,0,0.06);">
          <div style="position:relative;">
            <img src="${uploadedPreview}" style="width:100%; max-height:400px; object-fit:cover; filter:brightness(0.8);" />
            <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;">
              <div class="animate-tension" style="font-size:64px;">
                ${fitCheckResult.score >= 8 ? '🔥' : fitCheckResult.score >= 6 ? '👍' : '💡'}
              </div>
            </div>
          </div>
        </div>
      `;

      // 1.5s tension delay, then BOOM — reveal score
      setTimeout(() => {
        showingScore = false;
        renderContent();
      }, 1500);

    } catch (err) {
      isAnalyzing = false;
      pageContent.innerHTML = `
        <div style="background:#FFF; border-radius:28px; padding:40px 24px; text-align:center; box-shadow:0 4px 30px rgba(0,0,0,0.06);">
          <div style="font-size:48px; margin-bottom:16px;">😕</div>
          <h3 style="font-family:'Playfair Display',serif; font-size:20px; font-weight:700; color:#1A1A1A; margin-bottom:8px;">Analysis Failed</h3>
          <p style="font-size:14px; color:rgba(0,0,0,0.5); margin-bottom:24px;">${err.message}</p>
          <button id="btn-retry" style="
            padding:14px 40px; border-radius:100px; font-size:14px; font-weight:700; cursor:pointer;
            background:#1A1A1A; color:#FFF; border:none; font-family:'DM Sans',sans-serif;
          ">Try Again</button>
        </div>
      `;
      pageContent.querySelector('#btn-retry')?.addEventListener('click', submitForAnalysis);
    }
  }

  renderContent();
  main.appendChild(pageContent);
  layout.appendChild(main);
}
