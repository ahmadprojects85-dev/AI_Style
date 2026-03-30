// ── Home — Daily Stylist (Redesigned with Option A/B) ──
import { createSidebar } from '../components/sidebar.js';
import { createTopbar } from '../components/topbar.js';
import { icons } from '../components/icons.js';
import { api } from '../api.js';
import { navigate } from '../router.js';

export async function renderDashboard(container) {
  const user = JSON.parse(localStorage.getItem('styleai_user') || '{}');
  const name = user.name || 'Friend';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  container.innerHTML = `<div class="app-layout page"></div>`;
  const layout = container.querySelector('.app-layout');
  layout.appendChild(createSidebar('/dashboard'));

  const main = document.createElement('div');
  main.className = 'main-content';
  main.style.cssText = 'background:#F6F3EE; min-height:100vh; font-family:"DM Sans", sans-serif;';

  const pageContent = document.createElement('div');
  pageContent.className = 'page-content';
  pageContent.style.cssText = 'padding: 40px auto 100px auto; max-width:900px; margin:0 auto; padding-top:40px; padding-bottom:100px;';

  let activeOccasion = null;
  const occasions = ['Work', 'Casual', 'Date', 'Gym'];
  
  let activeStyle = null;
  const styleOptions = ['Old Money', 'Streetwear', 'Minimal', 'Cozy'];

  let isLoadingOutfit = false; 
  let outfitError = null;
  let suggestions = []; 
  let liveWeather = null;
  let forecastData = []; 
  let wardrobeItemsList = [];

  function getWeatherEmoji(condition) {
    const map = { Clear:'☀️', Clouds:'☁️', Rain:'🌧️', Drizzle:'🌦️', Thunderstorm:'⛈️', Snow:'❄️', Mist:'🌫️', Haze:'🌫️', Fog:'🌫️' };
    return map[condition] || '⛅';
  }

  async function fetchWeather() {
    try {
      const city = user.city || 'Slemani, IQ';
      const [wData, fData] = await Promise.allSettled([
        api.getWeather(city, '°C'),
        api.getForecast(city, '°C')
      ]);

      if (wData.status === 'fulfilled' && wData.value) {
        const d = wData.value;
        liveWeather = { 
          temp: `${d.temp}°C`, 
          condition: d.condition, 
          city: d.city || 'SULAYMANIYAH'
        };
      }

      if (fData.status === 'fulfilled' && fData.value?.forecasts) {
        forecastData = fData.value.forecasts;
      }
      
      render();
    } catch(err) { console.error('Weather download failed:', err); }
  }

  async function fetchWardrobe() {
    try {
      const data = await api.getWardrobe();
      wardrobeItemsList = data.items || [];
      render();
    } catch(err) { console.error(err); }
  }

  function render() {
    const wc = liveWeather || (suggestions[0]?.weatherContext);
    const isReady = activeOccasion && activeStyle;

    pageContent.innerHTML = `
      <div style="margin-bottom: 40px;">
        <div style="font-size: 11px; font-weight: 800; color: rgba(0,0,0,0.3); text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 4px;">Ready to curate?</div>
        <h1 style="font-family: 'Cormorant Garamond', serif; font-size: 56px; font-weight: 500; color: #1A1A1A; line-height: 1.1; margin:0;">${greeting}, ${name}</h1>
      </div>

      <!-- Weather Bar -->
      <div id="weather-card" style="
        background: #1A1A1A; border-radius: 32px; padding: 28px 32px; margin-bottom: 40px; 
        color: #FFF; display: flex; align-items: center; justify-content: space-between;
        box-shadow: 0 20px 40px rgba(0,0,0,0.12);
      ">
        <div style="display: flex; align-items: center; gap: 24px;">
          <div style="font-size: 52px;">${wc ? getWeatherEmoji(wc.condition) : '⏳'}</div>
          <div>
            <div style="font-size: 48px; font-weight: 500; font-family: 'DM Sans', sans-serif; line-height:1;">${wc ? wc.temp : '--°C'}</div>
            <div style="font-size: 10px; font-weight: 800; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 1.5px; margin-top:6px;">
              ${wc ? wc.condition : 'DETECTING...'} · ${wc ? wc.city : 'SULAYMANIYAH'}
            </div>
          </div>
        </div>
        
        <div style="display: flex; gap: 32px; align-items: center;">
          <div style="display: flex; gap: 24px; border-right: 1px solid rgba(255,255,255,0.1); padding-right: 32px;">
            ${forecastData.map(f => `
              <div style="text-align: center;">
                <div style="font-size: 9px; font-weight: 900; color: rgba(255,255,255,0.4); margin-bottom: 6px;">${f.dayName}</div>
                <div style="font-size: 18px; margin-bottom:4px;">${getWeatherEmoji(f.condition)}</div>
                <div style="font-size: 13px; font-weight: 700;">${f.temp}°</div>
              </div>
            `).join('') || `
              <div style="font-size: 11px; font-weight: 600; color: rgba(255,255,255,0.2); letter-spacing: 0.5px;">Forecast loading...</div>
            `}
          </div>
          <div style="background: #FFF; color: #1A1A1A; font-size: 11px; font-weight: 900; padding: 8px 20px; border-radius: 100px; letter-spacing: 1.5px;">LIVE</div>
        </div>
      </div>

      <!-- Main Editorial Layout -->
      <div style="max-width: 800px; margin: 0 auto;">
        <!-- Curation Workspace -->
        <div style="background: #FFF; border-radius: 32px; padding: 40px; border: 1px solid rgba(0,0,0,0.02); box-shadow: 0 4px 20px rgba(0,0,0,0.01);">
          
          <div style="display:flex; align-items:center; gap:10px; margin-bottom:32px;">
            <div style="width:2px; height:18px; background:#C17A56; border-radius:2px;"></div>
            <h4 style="font-size:11px; font-weight:800; text-transform:uppercase; letter-spacing:1.5px; color:rgba(0,0,0,0.4);">Curate Your Look</h4>
          </div>

          <!-- Occasion Selector -->
          <div style="margin-bottom: 32px;">
            <div style="font-size: 13px; font-weight: 700; color: #1A1A1A; margin-bottom: 12px;">Where are you going?</div>
            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
              ${['Work', 'Casual', 'Date', 'Gym', 'Other'].map(occ => `
                <button class="occasion-pull" data-occ="${occ}" style="
                  padding: 10px 20px; border-radius: 100px; font-size: 13px; font-weight: 600; cursor: pointer;
                  border: 1.5px solid ${activeOccasion === occ ? '#1A1A1A' : 'rgba(0,0,0,0.05)'};
                  background: ${activeOccasion === occ ? '#1A1A1A' : '#FFF'};
                  color: ${activeOccasion === occ ? '#FFF' : '#1A1A1A'};
                  font-family: 'DM Sans', sans-serif;
                  transition: all 0.2s ease;
                ">${occ}</button>
              `).join('')}
            </div>
          </div>

          <!-- Style Selector -->
          <div style="margin-bottom: 32px;">
            <div style="font-size: 13px; font-weight: 700; color: #1A1A1A; margin-bottom: 12px;">What's the vibe?</div>
            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
              ${['Old Money', 'Streetwear', 'Minimal', 'Elegant', 'Sporty'].map(style => `
                <button class="style-pull" data-style="${style}" style="
                  padding: 10px 20px; border-radius: 100px; font-size: 13px; font-weight: 600; cursor: pointer;
                  border: 1.5px solid ${activeStyle === style ? '#1A1A1A' : 'rgba(0,0,0,0.05)'};
                  background: ${activeStyle === style ? '#1A1A1A' : '#FFF'};
                  color: ${activeStyle === style ? '#FFF' : '#1A1A1A'};
                  font-family: 'DM Sans', sans-serif;
                  transition: all 0.2s ease;
                ">${style}</button>
              `).join('')}
            </div>
          </div>

          <!-- Prompt Preview Area (Now Result Area) -->
          <div id="prompt-preview" style="
            background: #F9F7F5; border-radius: 24px; padding: 24px; border: 1.5px dashed rgba(0,0,0,0.06);
            text-align: center; margin-bottom: 0; min-height: 380px; display: flex; flex-direction: column; align-items: center; justify-content: center;
            overflow: hidden;
          ">
            ${isLoadingOutfit ? `
              <div style="display:flex;flex-direction:column;align-items:center;gap:16px;">
                <div style="width:40px;height:40px;border:3px solid rgba(0,0,0,0.08);border-top-color:#1A1A1A;border-radius:50%;animation:spin 0.8s linear infinite;"></div>
                <div style="font-size:14px; font-weight:600; color:rgba(0,0,0,0.4);">Stylist is thinking...</div>
              </div>
              <style>@keyframes spin{to{transform:rotate(360deg)}}</style>
            ` : suggestions.length > 0 ? renderOutfitInPlace(suggestions[0]) : outfitError ? `
              <div style="font-size:28px;margin-bottom:16px;">⚠️</div>
              <div style="font-size:14px;font-weight:600;color:rgba(0,0,0,0.5);line-height:1.6;max-width:250px;margin-bottom:20px;">${outfitError}</div>
              <div style="display:flex; gap:12px; justify-content:center;">
                <button class="btn-retry" style="padding:12px 24px;border-radius:100px;background:#F9F7F5;color:#1A1A1A;font-weight:700;font-size:13px;border:1.5px solid rgba(0,0,0,0.1);cursor:pointer;text-transform:uppercase;letter-spacing:1px;transition:all 0.2s;">Try Again</button>
                <button class="btn-add-clothes" style="padding:12px 24px;border-radius:100px;background:#1A1A1A;color:#FFF;font-weight:700;font-size:13px;border:none;cursor:pointer;text-transform:uppercase;letter-spacing:1px;transition:all 0.2s;">Add Clothes</button>
              </div>
            ` : `
              <div style="font-size: 28px; margin-bottom: 24px; color: #1A1A1A;">✦</div>
              <div style="font-size: 13px; font-weight: 600; color: rgba(0,0,0,0.3); line-height: 1.6; max-width: 180px;">
                Choose an occasion and a vibe to start your AI styling session.
              </div>
            `}
          </div>
        </div>
      </div>

      <!-- Horizontal Stats Bar -->
      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-top: 40px;">
        <div style="background:#FFF; padding:32px 24px; border-radius:24px; text-align:center; border:1px solid rgba(0,0,0,0.01);">
          <div style="font-family:'Cormorant Garamond',serif; font-size:48px; font-weight:500; color:#1A1A1A; line-height:1;">${wardrobeItemsList.length}</div>
          <div style="font-size:10px; font-weight:800; color:rgba(0,0,0,0.3); text-transform:uppercase; letter-spacing:1.5px; margin-top:8px;">Items</div>
        </div>
        <div style="background:#FFF; padding:32px 24px; border-radius:24px; text-align:center; border:1px solid rgba(0,0,0,0.01);">
          <div style="font-family:'Cormorant Garamond',serif; font-size:48px; font-weight:500; color:#1A1A1A; line-height:1;">1:1</div>
          <div style="font-size:10px; font-weight:800; color:rgba(0,0,0,0.3); text-transform:uppercase; letter-spacing:1.5px; margin-top:8px;">Styling</div>
        </div>
        <div style="background:#FFF; padding:32px 24px; border-radius:24px; text-align:center; border:1px solid rgba(0,0,0,0.01); display:flex; flex-direction:column; align-items:center; justify-content:center;">
          <div style="width:28px; height:28px; border:2px solid #1A1A1A; transform:rotate(45deg); display:flex; align-items:center; justify-content:center; margin-bottom:12px;">
            <div style="width:14px; height:14px; background:#1A1A1A;"></div>
          </div>
          <div style="font-size:10px; font-weight:800; color:rgba(0,0,0,0.3); text-transform:uppercase; letter-spacing:1.5px;">Curated</div>
        </div>
      </div>
    `;

    // Bind event listeners
    const el = pageContent;
    el.querySelectorAll('.occasion-pull').forEach(btn => btn.addEventListener('click', (e) => { 
      activeOccasion = e.currentTarget.dataset.occ; 
      if (activeOccasion && activeStyle) {
        startFetchingBoth();
      } else {
        render();
      }
    }));
    el.querySelectorAll('.style-pull').forEach(btn => btn.addEventListener('click', (e) => { 
      activeStyle = e.currentTarget.dataset.style; 
      if (activeOccasion && activeStyle) {
        startFetchingBoth();
      } else {
        render();
      }
    }));
    
    el.querySelector('.btn-retry')?.addEventListener('click', () => startFetchingBoth());
    el.querySelector('.btn-add-clothes')?.addEventListener('click', () => navigate('/add-item'));
    
    if (el.querySelector('#prompt-preview')) {
      bindCardEvents(el.querySelector('#prompt-preview'));
    }
  }

  function renderOutfitInPlace(suggestion) {
    const { title, reasoning, items } = suggestion;
    return `
      <div class="animate-fade-in-up" style="width:100%; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center;">
        <div style="display:flex; justify-content:center; align-items:center; gap:12px; margin-bottom:20px; width:100%; overflow-x:auto;" class="hide-scrollbar">
          ${items.map(item => `<img src="http://${window.location.hostname}:3001${item.imageUrl}" style="width:100px; height:100px; object-fit:contain; filter:drop-shadow(0 8px 16px rgba(0,0,0,0.08));" />`).join('')}
        </div>
        <div style="text-align:center;">
          <div style="font-family:'Cormorant Garamond',serif; font-size:28px; font-weight:600; color:#1A1A1A; margin-bottom:8px; line-height:1.2;">${title}</div>
          <p style="font-size:13px; color:rgba(0,0,0,0.5); line-height:1.6; margin-bottom:24px; max-width:400px; margin-left:auto; margin-right:auto;">${reasoning}</p>
          <div style="display:flex; align-items:center; justify-content:center; gap:12px;">
            <button class="btn-try-again" data-idx="0" style="padding:14px 40px; border-radius:100px; background:#1A1A1A; color:#FFF; font-weight:700; font-size:13px; border:none; cursor:pointer; text-transform:uppercase; letter-spacing:1px;">Try Again</button>
            <button class="btn-chat-stylist" data-idx="0" title="Chat about this look" style="
              height:48px; padding: 0 24px; border-radius:100px; background:#FFF; border:1.5px solid rgba(0,0,0,0.08);
              cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px;
              transition:all 0.3s ease; box-shadow:0 2px 8px rgba(0,0,0,0.04);
              font-size: 13px; font-weight: 700; color: #1A1A1A; font-family: 'DM Sans', sans-serif;
            ">
              ${icons.messageCircle}
              <span>Ask AI Stylist</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  async function startFetchingBoth() {
    isLoadingOutfit = true; 
    outfitError = null;
    suggestions = []; 
    render();
    try {
      const resp = await api.getDailySuggestion(activeOccasion, activeStyle);
      if (resp?.suggestion) {
        suggestions.push(resp.suggestion);
      } else {
        outfitError = resp?.message || 'No outfit could be generated. Make sure your wardrobe has items.';
      }
    } catch(err) { 
      console.error('Outfit generation failed:', err);
      outfitError = err.message || 'Something went wrong. Please try again.';
    }
    isLoadingOutfit = false; 
    render();
  }

  // ── Chat State ──
  let chatHistory = []; // { role: 'user'|'assistant', content: string }

  function openStylistChat(suggestion) {
    chatHistory = []; // reset for new look

    const chatContext = {
      title: suggestion.title,
      reasoning: suggestion.reasoning,
      items: suggestion.items,
      weather: liveWeather ? `${liveWeather.temp}, ${liveWeather.condition}` : 'N/A',
      occasion: activeOccasion,
      style: activeStyle,
    };

    const modal = document.createElement('div');
    modal.id = 'stylist-chat-modal';
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);backdrop-filter:blur(12px);z-index:9999;display:flex;align-items:flex-end;justify-content:center;animation:fadeIn 0.2s ease;';

    modal.innerHTML = `
      <div style="background:#FFF;width:100%;max-width:520px;border-radius:32px 32px 0 0;display:flex;flex-direction:column;max-height:85vh;animation:slideUp 0.3s cubic-bezier(0.22,1,0.36,1);">
        <!-- Header -->
        <div style="padding:24px 28px 16px;border-bottom:1px solid rgba(0,0,0,0.04);display:flex;align-items:center;justify-content:space-between;flex-shrink:0;">
          <div>
            <div style="font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:600;color:#1A1A1A;">Ask Your Stylist</div>
            <div style="font-size:11px;font-weight:700;color:rgba(0,0,0,0.3);text-transform:uppercase;letter-spacing:1px;margin-top:2px;">About: ${suggestion.title}</div>
          </div>
          <button id="close-chat" style="background:#F2EFEA;border:none;border-radius:50%;width:36px;height:36px;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;transition:background 0.2s;">✕</button>
        </div>

        <!-- Messages -->
        <div id="chat-messages" style="flex:1;overflow-y:auto;padding:20px 28px;display:flex;flex-direction:column;gap:16px;min-height:300px;">
          <div style="align-self:flex-start;max-width:85%;background:#F6F3EE;border-radius:20px 20px 20px(4px);padding:16px 20px;">
            <div style="font-size:14px;color:#1A1A1A;line-height:1.6;">Welcome to your AI Style Session! ✦<br/><br/>I've curated this <strong>${suggestion.title}</strong> look specifically for your ${activeOccasion} today. Ask me any styling questions — like what accessories to add, how to swap the shoes, or why this works for today's weather. I'm here to help you nail the perfect ${activeStyle} vibe! 💬</div>
          </div>
        </div>

        <!-- Input -->
        <div style="padding:16px 28px 28px;border-top:1px solid rgba(0,0,0,0.04);display:flex;gap:10px;align-items:center;flex-shrink:0;">
          <input id="chat-input" type="text" placeholder="Ask about your look..." style="
            flex:1;padding:14px 20px;border-radius:100px;border:1.5px solid rgba(0,0,0,0.06);
            font-size:14px;font-family:'DM Sans',sans-serif;background:#F9F7F5;outline:none;
            transition:border-color 0.2s;
          " />
          <button id="chat-send" style="
            width:48px;height:48px;border-radius:50%;background:#1A1A1A;color:#FFF;border:none;
            cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;
            transition:opacity 0.2s;
          ">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button>
        </div>
      </div>
    `;

    // Add animations
    const styleTag = document.createElement('style');
    styleTag.textContent = `
      @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
    `;
    modal.appendChild(styleTag);

    document.body.appendChild(modal);

    const messagesEl = modal.querySelector('#chat-messages');
    const inputEl = modal.querySelector('#chat-input');
    const sendBtn = modal.querySelector('#chat-send');

    // Close
    modal.querySelector('#close-chat').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });

    // Focus input
    inputEl.focus();
    inputEl.addEventListener('focus', () => { inputEl.style.borderColor = '#1A1A1A'; });
    inputEl.addEventListener('blur', () => { inputEl.style.borderColor = 'rgba(0,0,0,0.06)'; });

    async function sendMessage() {
      const msg = inputEl.value.trim();
      if (!msg) return;
      inputEl.value = '';

      // Add user message
      const userBubble = document.createElement('div');
      userBubble.style.cssText = 'align-self:flex-end;max-width:85%;background:#1A1A1A;color:#FFF;border-radius:20px 20px 4px 20px;padding:14px 18px;font-size:14px;line-height:1.5;';
      userBubble.textContent = msg;
      messagesEl.appendChild(userBubble);

      // Add thinking indicator
      const thinkingEl = document.createElement('div');
      thinkingEl.style.cssText = 'align-self:flex-start;max-width:85%;background:#F6F3EE;border-radius:20px 20px 20px 4px;padding:14px 18px;';
      thinkingEl.innerHTML = '<div class="animate-tension" style="font-size:13px;color:rgba(0,0,0,0.4);">Thinking...</div>';
      messagesEl.appendChild(thinkingEl);
      messagesEl.scrollTop = messagesEl.scrollHeight;

      // Disable send
      sendBtn.style.opacity = '0.4';
      sendBtn.style.pointerEvents = 'none';

      try {
        const resp = await api.sendChatMessage(msg, chatHistory, chatContext);
        chatHistory.push({ role: 'user', content: msg });
        chatHistory.push({ role: 'assistant', content: resp.reply });

        // Replace thinking with response
        thinkingEl.innerHTML = `<div style="font-size:14px;color:#1A1A1A;line-height:1.6;white-space:pre-wrap;">${resp.reply}</div>`;
      } catch (err) {
        thinkingEl.innerHTML = `<div style="font-size:13px;color:#E53935;">Sorry, I couldn't respond right now. Try again.</div>`;
        console.error('Chat error:', err);
      }

      sendBtn.style.opacity = '1';
      sendBtn.style.pointerEvents = 'auto';
      messagesEl.scrollTop = messagesEl.scrollHeight;
      inputEl.focus();
    }

    sendBtn.addEventListener('click', sendMessage);
    inputEl.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendMessage(); });
  }

  function bindCardEvents(area) {
    area.querySelectorAll('.btn-try-again').forEach(btn => {
      btn.addEventListener('click', () => {
        activeOccasion = null;
        activeStyle = null;
        suggestions = [];
        outfitError = null;
        render();
      });
    });
    area.querySelectorAll('.btn-chat-stylist').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const suggestion = suggestions[e.currentTarget.dataset.idx];
        if (suggestion) openStylistChat(suggestion);
      });
    });
  }

  main.appendChild(pageContent);
  layout.appendChild(main);
  render();
  fetchWeather();
  fetchWardrobe();
}
