(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=`http://localhost:3001/api`,t={getToken(){return localStorage.getItem(`styleai_token`)},setToken(e){e?localStorage.setItem(`styleai_token`,e):localStorage.removeItem(`styleai_token`)},async request(t,n={}){let r=this.getToken(),i={...n.headers};r&&(i.Authorization=`Bearer ${r}`),n.body instanceof FormData||(i[`Content-Type`]=`application/json`,n.body&&typeof n.body!=`string`&&(n.body=JSON.stringify(n.body)));try{let r=await fetch(`${e}${t}`,{...n,headers:i}),a=await r.json().catch(()=>null);if(!r.ok)throw Error(a?.message||a?.error||`An error occurred`);return a}catch(e){throw console.error(`[API Error] ${t}:`,e.message),e}},register(e){return this.request(`/auth/register`,{method:`POST`,body:e})},login(e){return this.request(`/auth/login`,{method:`POST`,body:e})},googleAuth(e){return this.request(`/auth/google`,{method:`POST`,body:{idToken:e}})},getMe(){return this.request(`/auth/me`)},getProfile(){return this.request(`/profile`)},updateProfile(e){return this.request(`/profile`,{method:`PUT`,body:e})},uploadAvatar(e){return this.request(`/profile/avatar`,{method:`POST`,body:e})},getWardrobe(e=``){return this.request(`/wardrobe${e?`?`+e:``}`)},addWardrobeItem(e){return this.request(`/wardrobe`,{method:`POST`,body:e})},getWardrobeStats(){return this.request(`/wardrobe/stats/summary`)},submitFitCheck(e){return this.request(`/fit-check`,{method:`POST`,body:e})},getFitCheckHistory(){return this.request(`/fit-check/history`)},getDailySuggestion(e=`casual`,t=``){return this.request(`/outfits/suggestion?occasion=${encodeURIComponent(e)}${t?`&style=${encodeURIComponent(t)}`:``}`)},saveOutfit(e){return this.request(`/outfits`,{method:`POST`,body:e})},getOutfitHistory(){return this.request(`/outfits/history`)},getWeather(e,t){return this.request(`/weather?city=${encodeURIComponent(e)}&unit=${encodeURIComponent(t)}`)},getForecast(e,t){return this.request(`/weather/forecast?city=${encodeURIComponent(e)}&unit=${encodeURIComponent(t)}`)},searchCity(e){return this.request(`/weather/search?q=${encodeURIComponent(e)}`)},sendChatMessage(e,t,n){return this.request(`/chat`,{method:`POST`,body:{message:e,history:t,context:n}})}},n={},r=null,i=[`/dashboard`,`/wardrobe`,`/add-item`,`/fit-check`,`/profile`];function a(e,t){n[e]=t}function o(e){window.location.hash=e}function s(){let e=async()=>{let e=window.location.hash.slice(1)||`/`,a=document.getElementById(`app`);if(i.includes(e)&&!t.getToken()){o(`/onboarding`);return}r&&typeof r==`function`&&(r(),r=null),a.style.opacity=`0`,await new Promise(e=>setTimeout(e,150));let s=n[e]||n[`/`];if(s){let e=await s(a);e&&(r=e)}requestAnimationFrame(()=>{a.style.transition=`opacity 300ms cubic-bezier(0.22, 1, 0.36, 1)`,a.style.opacity=`1`})};window.addEventListener(`hashchange`,e),e()}var c=`/assets/editorial_wardrobe-BavVUYu5.png`;function l(e){e.innerHTML=`
    <div class="landing-page page">
      <div class="landing-left">
        <img src="${c}" alt="Curated minimal wardrobe" />
      </div>
      <div class="landing-right">
        <div class="landing-content stagger-children">
          <div class="landing-logo">Style<span>AI</span></div>
          <h1 class="landing-headline">Elevate your<br>personal style.</h1>
          <p class="landing-sub">Build your digital closet and get AI-powered outfit recommendations.</p>
          <div class="landing-actions">
            <button class="btn-primary" id="btn-get-started">Get Started</button>
          </div>
        </div>
      </div>
    </div>
  `,document.getElementById(`btn-get-started`).addEventListener(`click`,()=>o(`/onboarding`))}var u={home:`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>`,shirt:`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/></svg>`,camera:`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>`,user:`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,plus:`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,upload:`<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>`,sun:`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`,cloud:`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>`,sparkles:`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>`,trendingUp:`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>`,palette:`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>`,heart:`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`,shield:`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>`,bell:`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>`,thermometer:`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"/></svg>`,link2:`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 17H7A5 5 0 0 1 7 7h2"/><path d="M15 7h2a5 5 0 1 1 0 10h-2"/><line x1="8" y1="12" x2="16" y2="12"/></svg>`,chevronRight:`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`,check:`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,zap:`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg>`,qrCode:`<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/><path d="M3 12h.01"/><path d="M12 3h.01"/><path d="M12 16v.01"/><path d="M16 12h1"/><path d="M21 12v.01"/><path d="M12 21v-1"/></svg>`,messageCircle:`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>`},d=`113815005105-2kg6d5c343se85kbm4bel96vsgt7o7e7.apps.googleusercontent.com`,f=[`Milan`,`Paris`,`London`,`New York`,`Tokyo`,`Dubai`,`Los Angeles`,`Berlin`,`Seoul`,`Barcelona`,`Sydney`,`Istanbul`];function p(e){let n=1,r=``,i=``,a=``,s=``,c=``;function l(){e.innerHTML=`
      <div class="onboarding-page page">
        <div class="onboarding-container">
          <div class="step-indicator">
            ${[1,2,3,4].map(e=>`<div class="step-dot${e===n?` active`:``}"></div>`).join(``)}
          </div>
          <div class="onboarding-step" id="step-content"></div>
        </div>
      </div>
    `;let t=document.getElementById(`step-content`);n===1?u(t):n===2?p(t):n===3?h(t):g(t)}function u(e){e.innerHTML=`
      <div style="text-align:center;margin-bottom:var(--sp-4);">
        <div class="landing-logo" style="justify-content:center;">Style<span>AI</span></div>
        <h2 style="margin-top:var(--sp-2);">Create your account</h2>
        <p class="body-sm">Sign in to start building your personal AI wardrobe.</p>
      </div>
      
      <div id="google-btn-wrapper" style="display:flex; justify-content:center; margin-bottom: 24px; min-height: 44px;"></div>
      
      <p style="text-align:center;font-size:12px;color:var(--text-secondary);margin-top:var(--sp-3)">
        By continuing, you agree to our Terms of Service and Privacy Policy.
      </p>
    `,window.handleCredentialResponse=async e=>{try{let s=JSON.parse(atob(e.credential.split(`.`)[1]));r=s.email,s.name&&(a=s.name),s.picture&&(i=s.picture),document.getElementById(`google-btn-wrapper`).style.opacity=`0.5`,document.getElementById(`google-btn-wrapper`).style.pointerEvents=`none`;let c=await t.googleAuth(e.credential);c.isNewUser?(r=c.email,a=c.name||``,i=c.avatarUrl||``,n=2,l()):(t.setToken(c.token),localStorage.setItem(`styleai_user`,JSON.stringify({name:c.user.name,email:c.user.email,city:c.user.city,gender:c.user.gender,avatarUrl:c.user.avatarUrl})),o(`/dashboard`))}catch(e){console.error(`Error during Google authentication:`,e),alert(`Authentication failed: `+e.message),document.getElementById(`google-btn-wrapper`).style.opacity=`1`,document.getElementById(`google-btn-wrapper`).style.pointerEvents=`auto`}},window.google&&(window.google.accounts.id.initialize({client_id:d,callback:window.handleCredentialResponse}),window.google.accounts.id.renderButton(document.getElementById(`google-btn-wrapper`),{theme:`outline`,size:`large`,width:340}))}function p(e){e.innerHTML=`
      <h2>What's your name?</h2>
      <div class="input-group">
        <input class="input-field" type="text" id="name-input" placeholder="Enter your name" value="${a}" autofocus />
      </div>
      <div class="greeting-confirm" id="greeting-text">${a?`Nice to meet you, ${a} ✦`:``}</div>
      <div style="margin-top: var(--sp-4)">
        <button class="btn-primary" id="btn-continue" ${a?``:`style="opacity:0.5;pointer-events:none"`}>Continue</button>
      </div>
    `;let t=document.getElementById(`name-input`),r=document.getElementById(`greeting-text`),i=document.getElementById(`btn-continue`);t.addEventListener(`input`,e=>{a=e.target.value.trim(),a?(r.textContent=`Nice to meet you, ${a} ✦`,r.style.opacity=`1`,i.style.opacity=`1`,i.style.pointerEvents=`auto`):(r.textContent=``,i.style.opacity=`0.5`,i.style.pointerEvents=`none`)}),i.addEventListener(`click`,()=>{a&&(n=3,l())}),setTimeout(()=>t.focus(),100)}function h(e){e.innerHTML=`
      <h2>Where are you based? ☀️</h2>
      <p class="body-sm" style="margin-bottom: var(--sp-3)">OpenWeather supports any city globally. Enter your city and country code.</p>
      
      <div class="input-group" style="margin-bottom: var(--sp-3); position: relative">
        <input class="input-field" type="text" id="city-input" placeholder="e.g. Tehran, IR or London, UK" value="${s}" autocomplete="off" />
        <div id="city-autocomplete-results" style="position:absolute; top:100%; left:0; right:0; background:var(--surface-white); border:1px solid var(--border); border-radius:4px; margin-top:4px; z-index:10; display:none; max-height:200px; overflow-y:auto; box-shadow:0 4px 12px rgba(0,0,0,0.1)"></div>
      </div>

      <div class="city-grid" id="city-grid">
        ${f.map(e=>`
          <div class="gender-card${s===e?` selected`:``}" data-city="${e}" style="padding: var(--sp-2) var(--sp-2); font-size: 14px;">
            ${m(e)} ${e}
          </div>
        `).join(``)}
      </div>

      <div style="display: flex; align-items: center; gap: var(--sp-2); margin-top: var(--sp-4); margin-bottom: var(--sp-3)">
        <span class="label" style="color: var(--text-secondary)">Units:</span>
        <div class="chip active" data-unit="°C">°C</div>
        <div class="chip" data-unit="°F">°F</div>
      </div>

      <button class="btn-primary" id="btn-continue-weather" ${s?``:`style="opacity:0.5;pointer-events:none"`}>Continue</button>
    `;let r=document.getElementById(`city-input`),i=document.getElementById(`city-grid`),a=document.getElementById(`btn-continue-weather`);e.querySelectorAll(`[data-city]`).forEach(t=>{t.addEventListener(`click`,()=>{s=t.dataset.city,r.value=s,e.querySelectorAll(`[data-city]`).forEach(e=>e.classList.remove(`selected`)),t.classList.add(`selected`),a.style.opacity=`1`,a.style.pointerEvents=`auto`})});let o,c=document.getElementById(`city-autocomplete-results`);r.addEventListener(`input`,n=>{if(s=n.target.value,s.trim().length>0?(i.style.opacity=`0.3`,i.style.pointerEvents=`none`):(i.style.opacity=`1`,i.style.pointerEvents=`auto`),e.querySelectorAll(`[data-city]`).forEach(e=>e.classList.toggle(`selected`,e.dataset.city===s)),a.style.opacity=s.trim()?`1`:`0.5`,a.style.pointerEvents=s.trim()?`auto`:`none`,clearTimeout(o),s.trim().length<2){c.style.display=`none`;return}o=setTimeout(async()=>{try{let e=await t.searchCity(s);e&&e.length>0?(c.innerHTML=e.map(e=>`
              <div class="city-result-item" data-val="${e.label}" style="padding:12px 16px; cursor:pointer; border-bottom:1px solid var(--border)">
                <div class="coords-hidden" style="display:none">${e.id}</div>
                <strong style="color:var(--text-primary)">${e.name}</strong> <span style="color:var(--text-secondary); font-size:12px">${e.state?e.state+`, `:``}${e.country}</span>
              </div>
            `).join(``),c.style.display=`block`,c.querySelectorAll(`.city-result-item`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.dataset.val,n=e.querySelector(`.coords-hidden`)?.textContent||``;s=n?`${n}|${t}`:t,r.value=t,c.style.display=`none`,a.style.opacity=`1`,a.style.pointerEvents=`auto`})})):c.style.display=`none`}catch(e){console.error(`Autocomplete failed`,e)}},400)}),a.addEventListener(`click`,()=>{s&&(n=4,l())})}function g(e){e.innerHTML=`
      <h2>How do you identify?</h2>
      <div class="gender-cards">
        ${[{label:`Woman`,dbVal:`women`,icon:`👗`},{label:`Man`,dbVal:`men`,icon:`👔`},{label:`Prefer not to say`,dbVal:`prefer-not-to-say`,icon:`🤍`}].map(e=>`
          <div class="gender-card${c===e.dbVal?` selected`:``}" data-gender="${e.dbVal}">
            <span class="icon">${e.icon}</span> ${e.label}
          </div>
        `).join(``)}
      </div>
      <div style="margin-top:var(--sp-4)">
        <button class="btn-primary" id="btn-finish" ${c?``:`style="opacity:0.5;pointer-events:none"`}>Enter StyleAI</button>
      </div>
    `,e.querySelectorAll(`.gender-card`).forEach(t=>{t.addEventListener(`click`,()=>{c=t.dataset.gender,e.querySelectorAll(`.gender-card`).forEach(e=>e.classList.remove(`selected`)),t.classList.add(`selected`);let n=document.getElementById(`btn-finish`);n.style.opacity=`1`,n.style.pointerEvents=`auto`})}),document.getElementById(`btn-finish`).addEventListener(`click`,async()=>{if(c){let e=document.getElementById(`btn-finish`);e.textContent=`Finalizing Profile...`,e.style.opacity=`0.7`,e.style.pointerEvents=`none`;let n={email:r,password:`GoogleUserPassword123!`,name:a,gender:c,city:s,weatherUnit:`°C`,stylePreferences:[],avatarUrl:i};try{let e=await t.register(n);t.setToken(e.token),localStorage.setItem(`styleai_user`,JSON.stringify({name:a,email:r,city:s,gender:c,avatarUrl:i})),o(`/dashboard`)}catch(t){alert(`Failed to complete setup: `+t.message),e.textContent=`Enter StyleAI`,e.style.opacity=`1`,e.style.pointerEvents=`auto`}}})}l()}function m(e){return{Milan:`🇮🇹`,Paris:`🇫🇷`,London:`🇬🇧`,"New York":`🇺🇸`,Tokyo:`🇯🇵`,Dubai:`🇦🇪`,"Los Angeles":`🇺🇸`,Berlin:`🇩🇪`,Seoul:`🇰🇷`,Barcelona:`🇪🇸`,Sydney:`🇦🇺`,Istanbul:`🇹🇷`}[e]||`📍`}function h(e){let t=[{label:`Home`,icon:u.home,route:`/dashboard`},{label:`Wardrobe`,icon:u.shirt,route:`/wardrobe`},{label:`Fit Check`,icon:u.camera,route:`/fit-check`},{label:`Profile`,icon:u.user,route:`/profile`}],n=document.createElement(`aside`);return n.className=`sidebar`,n.innerHTML=`
    <div class="sidebar-logo" style="padding: 40px 32px;">
      <h1 style="font-family: 'Cormorant Garamond', serif; font-size: 32px; font-weight: 600; color: #1A1A1A; letter-spacing: -1px;">StyleAI</h1>
    </div>
    
    <nav class="sidebar-nav">
      ${t.map(t=>`
        <a class="sidebar-link${e===t.route?` active`:``}" data-route="${t.route}">
          ${t.icon}
          <span>${t.label}</span>
        </a>
      `).join(``)}
    </nav>
  `,n.querySelectorAll(`.sidebar-link`).forEach(e=>{e.addEventListener(`click`,t=>{t.preventDefault(),o(e.dataset.route)})}),n}function g(e){let n=JSON.parse(localStorage.getItem(`styleai_user`)||`{}`),r=n.city||`Milan`,i=n.weatherUnit||`°C`,a=r.includes(`|`)?r.split(`|`)[1]:r,o=r,s=document.createElement(`header`);return s.className=`topbar`,s.innerHTML=`
    <h2 class="topbar-greeting">${e}</h2>
    <div class="topbar-right">
      <div class="weather-widget" id="dynamic-weather-widget">
        <span class="spinner" style="width:16px;height:16px;border:2px solid var(--border);border-top-color:var(--text-primary);border-radius:50%;animation:spin 1s linear infinite;"></span>
        <span>Loading...</span>
      </div>
      <img class="avatar" src="${n.avatarUrl||`/assets/user_avatar-BJOTohTI.png`}" alt="User avatar" />
    </div>
  `,o&&t.getWeather(o,i).then(e=>{let t=s.querySelector(`#dynamic-weather-widget`);t&&(t.innerHTML=`
          <img src="https://openweathermap.org/img/wn/${e.icon}.png" width="24" height="24" style="flex-shrink:0" />
          <span>${e.city} · ${e.temp}${i} · <span style="text-transform:capitalize">${e.description}</span></span>
        `)}).catch(e=>{console.warn(`Weather fetch failed:`,e);let t=s.querySelector(`#dynamic-weather-widget`);t&&(t.innerHTML=`${u.cloud} <span>${a} · --${i}</span>`)}),window.addEventListener(`profileUpdated`,()=>{let e=JSON.parse(localStorage.getItem(`styleai_user`)||`{}`),n=e.city||``;n&&t.getWeather(n,e.weatherUnit||`°C`).then(t=>{let n=s.querySelector(`#dynamic-weather-widget`);n&&(n.innerHTML=`
            <img src="https://openweathermap.org/img/wn/${t.icon}.png" width="24" height="24" style="flex-shrink:0" />
            <span>${t.city} · ${t.temp}${e.weatherUnit||`°C`} · <span style="text-transform:capitalize">${t.description}</span></span>
          `)}).catch(()=>{})}),s}async function _(e){let n=JSON.parse(localStorage.getItem(`styleai_user`)||`{}`),r=n.name||`Friend`,i=new Date().getHours(),a=i<12?`Good morning`:i<18?`Good afternoon`:`Good evening`;e.innerHTML=`<div class="app-layout page"></div>`;let o=e.querySelector(`.app-layout`);o.appendChild(h(`/dashboard`));let s=document.createElement(`div`);s.className=`main-content`,s.style.cssText=`background:#F6F3EE; min-height:100vh; font-family:"DM Sans", sans-serif;`;let c=document.createElement(`div`);c.className=`page-content`,c.style.cssText=`padding: 40px auto 100px auto; max-width:900px; margin:0 auto; padding-top:40px; padding-bottom:100px;`;let l=null,d=null,f=!1,p=null,m=[],g=null,_=[],v=[];function y(e){return{Clear:`☀️`,Clouds:`☁️`,Rain:`🌧️`,Drizzle:`🌦️`,Thunderstorm:`⛈️`,Snow:`❄️`,Mist:`🌫️`,Haze:`🌫️`,Fog:`🌫️`}[e]||`⛅`}async function b(){try{let e=n.city||`Slemani, IQ`,[r,i]=await Promise.allSettled([t.getWeather(e,`°C`),t.getForecast(e,`°C`)]);if(r.status===`fulfilled`&&r.value){let e=r.value;g={temp:`${e.temp}°C`,condition:e.condition,city:e.city||`SULAYMANIYAH`}}i.status===`fulfilled`&&i.value?.forecasts&&(_=i.value.forecasts),S()}catch(e){console.error(`Weather download failed:`,e)}}async function x(){try{v=(await t.getWardrobe()).items||[],S()}catch(e){console.error(e)}}function S(){let e=g||m[0]?.weatherContext;c.innerHTML=`
      <div style="margin-bottom: 40px;">
        <div style="font-size: 11px; font-weight: 800; color: rgba(0,0,0,0.3); text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 4px;">Ready to curate?</div>
        <h1 style="font-family: 'Cormorant Garamond', serif; font-size: 56px; font-weight: 500; color: #1A1A1A; line-height: 1.1; margin:0;">${a}, ${r}</h1>
      </div>

      <!-- Weather Bar -->
      <div id="weather-card" style="
        background: #1A1A1A; border-radius: 32px; padding: 28px 32px; margin-bottom: 40px; 
        color: #FFF; display: flex; align-items: center; justify-content: space-between;
        box-shadow: 0 20px 40px rgba(0,0,0,0.12);
      ">
        <div style="display: flex; align-items: center; gap: 24px;">
          <div style="font-size: 52px;">${e?y(e.condition):`⏳`}</div>
          <div>
            <div style="font-size: 48px; font-weight: 500; font-family: 'DM Sans', sans-serif; line-height:1;">${e?e.temp:`--°C`}</div>
            <div style="font-size: 10px; font-weight: 800; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 1.5px; margin-top:6px;">
              ${e?e.condition:`DETECTING...`} · ${e?e.city:`SULAYMANIYAH`}
            </div>
          </div>
        </div>
        
        <div style="display: flex; gap: 32px; align-items: center;">
          <div style="display: flex; gap: 24px; border-right: 1px solid rgba(255,255,255,0.1); padding-right: 32px;">
            ${_.map(e=>`
              <div style="text-align: center;">
                <div style="font-size: 9px; font-weight: 900; color: rgba(255,255,255,0.4); margin-bottom: 6px;">${e.dayName}</div>
                <div style="font-size: 18px; margin-bottom:4px;">${y(e.condition)}</div>
                <div style="font-size: 13px; font-weight: 700;">${e.temp}°</div>
              </div>
            `).join(``)||`
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
              ${[`Work`,`Casual`,`Date`,`Gym`,`Other`].map(e=>`
                <button class="occasion-pull" data-occ="${e}" style="
                  padding: 10px 20px; border-radius: 100px; font-size: 13px; font-weight: 600; cursor: pointer;
                  border: 1.5px solid ${l===e?`#1A1A1A`:`rgba(0,0,0,0.05)`};
                  background: ${l===e?`#1A1A1A`:`#FFF`};
                  color: ${l===e?`#FFF`:`#1A1A1A`};
                  font-family: 'DM Sans', sans-serif;
                  transition: all 0.2s ease;
                ">${e}</button>
              `).join(``)}
            </div>
          </div>

          <!-- Style Selector -->
          <div style="margin-bottom: 32px;">
            <div style="font-size: 13px; font-weight: 700; color: #1A1A1A; margin-bottom: 12px;">What's the vibe?</div>
            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
              ${[`Old Money`,`Streetwear`,`Minimal`,`Elegant`,`Sporty`].map(e=>`
                <button class="style-pull" data-style="${e}" style="
                  padding: 10px 20px; border-radius: 100px; font-size: 13px; font-weight: 600; cursor: pointer;
                  border: 1.5px solid ${d===e?`#1A1A1A`:`rgba(0,0,0,0.05)`};
                  background: ${d===e?`#1A1A1A`:`#FFF`};
                  color: ${d===e?`#FFF`:`#1A1A1A`};
                  font-family: 'DM Sans', sans-serif;
                  transition: all 0.2s ease;
                ">${e}</button>
              `).join(``)}
            </div>
          </div>

          <!-- Prompt Preview Area (Now Result Area) -->
          <div id="prompt-preview" style="
            background: #F9F7F5; border-radius: 24px; padding: 24px; border: 1.5px dashed rgba(0,0,0,0.06);
            text-align: center; margin-bottom: 0; min-height: 380px; display: flex; flex-direction: column; align-items: center; justify-content: center;
            overflow: hidden;
          ">
            ${f?`
              <div style="display:flex;flex-direction:column;align-items:center;gap:16px;">
                <div style="width:40px;height:40px;border:3px solid rgba(0,0,0,0.08);border-top-color:#1A1A1A;border-radius:50%;animation:spin 0.8s linear infinite;"></div>
                <div style="font-size:14px; font-weight:600; color:rgba(0,0,0,0.4);">Stylist is thinking...</div>
              </div>
              <style>@keyframes spin{to{transform:rotate(360deg)}}</style>
            `:m.length>0?C(m[0]):p?`
              <div style="font-size:28px;margin-bottom:16px;">⚠️</div>
              <div style="font-size:14px;font-weight:600;color:rgba(0,0,0,0.5);line-height:1.6;max-width:250px;margin-bottom:20px;">${p}</div>
              <button class="btn-retry" style="padding:12px 32px;border-radius:100px;background:#1A1A1A;color:#FFF;font-weight:700;font-size:13px;border:none;cursor:pointer;text-transform:uppercase;letter-spacing:1px;">Try Again</button>
            `:`
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
          <div style="font-family:'Cormorant Garamond',serif; font-size:48px; font-weight:500; color:#1A1A1A; line-height:1;">${v.length}</div>
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
    `;let t=c;t.querySelectorAll(`.occasion-pull`).forEach(e=>e.addEventListener(`click`,e=>{l=e.currentTarget.dataset.occ,l&&d?w():S()})),t.querySelectorAll(`.style-pull`).forEach(e=>e.addEventListener(`click`,e=>{d=e.currentTarget.dataset.style,l&&d?w():S()})),t.querySelector(`.btn-retry`)?.addEventListener(`click`,()=>w()),t.querySelector(`#prompt-preview`)&&D(t.querySelector(`#prompt-preview`))}function C(e){let{title:t,reasoning:n,items:r}=e;return`
      <div class="animate-fade-in-up" style="width:100%; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center;">
        <div style="display:flex; justify-content:center; align-items:center; gap:12px; margin-bottom:20px; width:100%; overflow-x:auto;" class="hide-scrollbar">
          ${r.map(e=>`<img src="http://${window.location.hostname}:3001${e.imageUrl}" style="width:100px; height:100px; object-fit:contain; filter:drop-shadow(0 8px 16px rgba(0,0,0,0.08));" />`).join(``)}
        </div>
        <div style="text-align:center;">
          <div style="font-family:'Cormorant Garamond',serif; font-size:28px; font-weight:600; color:#1A1A1A; margin-bottom:8px; line-height:1.2;">${t}</div>
          <p style="font-size:13px; color:rgba(0,0,0,0.5); line-height:1.6; margin-bottom:24px; max-width:400px; margin-left:auto; margin-right:auto;">${n}</p>
          <div style="display:flex; align-items:center; justify-content:center; gap:12px;">
            <button class="btn-try-again" data-idx="0" style="padding:14px 40px; border-radius:100px; background:#1A1A1A; color:#FFF; font-weight:700; font-size:13px; border:none; cursor:pointer; text-transform:uppercase; letter-spacing:1px;">Try Again</button>
            <button class="btn-chat-stylist" data-idx="0" title="Chat about this look" style="
              height:48px; padding: 0 24px; border-radius:100px; background:#FFF; border:1.5px solid rgba(0,0,0,0.08);
              cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px;
              transition:all 0.3s ease; box-shadow:0 2px 8px rgba(0,0,0,0.04);
              font-size: 13px; font-weight: 700; color: #1A1A1A; font-family: 'DM Sans', sans-serif;
            ">
              ${u.messageCircle}
              <span>Ask AI Stylist</span>
            </button>
          </div>
        </div>
      </div>
    `}async function w(){f=!0,p=null,m=[],S();try{let e=await t.getDailySuggestion(l,d);e?.suggestion?m.push(e.suggestion):p=`No outfit could be generated. Make sure your wardrobe has items.`}catch(e){console.error(`Outfit generation failed:`,e),p=e.message||`Something went wrong. Please try again.`}f=!1,S()}let T=[];function E(e){T=[];let n={title:e.title,reasoning:e.reasoning,items:e.items,weather:g?`${g.temp}, ${g.condition}`:`N/A`,occasion:l,style:d},r=document.createElement(`div`);r.id=`stylist-chat-modal`,r.style.cssText=`position:fixed;inset:0;background:rgba(0,0,0,0.5);backdrop-filter:blur(12px);z-index:9999;display:flex;align-items:flex-end;justify-content:center;animation:fadeIn 0.2s ease;`,r.innerHTML=`
      <div style="background:#FFF;width:100%;max-width:520px;border-radius:32px 32px 0 0;display:flex;flex-direction:column;max-height:85vh;animation:slideUp 0.3s cubic-bezier(0.22,1,0.36,1);">
        <!-- Header -->
        <div style="padding:24px 28px 16px;border-bottom:1px solid rgba(0,0,0,0.04);display:flex;align-items:center;justify-content:space-between;flex-shrink:0;">
          <div>
            <div style="font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:600;color:#1A1A1A;">Ask Your Stylist</div>
            <div style="font-size:11px;font-weight:700;color:rgba(0,0,0,0.3);text-transform:uppercase;letter-spacing:1px;margin-top:2px;">About: ${e.title}</div>
          </div>
          <button id="close-chat" style="background:#F2EFEA;border:none;border-radius:50%;width:36px;height:36px;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;transition:background 0.2s;">✕</button>
        </div>

        <!-- Messages -->
        <div id="chat-messages" style="flex:1;overflow-y:auto;padding:20px 28px;display:flex;flex-direction:column;gap:16px;min-height:300px;">
          <div style="align-self:flex-start;max-width:85%;background:#F6F3EE;border-radius:20px 20px 20px(4px);padding:16px 20px;">
            <div style="font-size:14px;color:#1A1A1A;line-height:1.6;">Welcome to your AI Style Session! ✦<br/><br/>I've curated this <strong>${e.title}</strong> look specifically for your ${l} today. Ask me any styling questions — like what accessories to add, how to swap the shoes, or why this works for today's weather. I'm here to help you nail the perfect ${d} vibe! 💬</div>
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
    `;let i=document.createElement(`style`);i.textContent=`
      @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
    `,r.appendChild(i),document.body.appendChild(r);let a=r.querySelector(`#chat-messages`),o=r.querySelector(`#chat-input`),s=r.querySelector(`#chat-send`);r.querySelector(`#close-chat`).addEventListener(`click`,()=>r.remove()),r.addEventListener(`click`,e=>{e.target===r&&r.remove()}),o.focus(),o.addEventListener(`focus`,()=>{o.style.borderColor=`#1A1A1A`}),o.addEventListener(`blur`,()=>{o.style.borderColor=`rgba(0,0,0,0.06)`});async function c(){let e=o.value.trim();if(!e)return;o.value=``;let r=document.createElement(`div`);r.style.cssText=`align-self:flex-end;max-width:85%;background:#1A1A1A;color:#FFF;border-radius:20px 20px 4px 20px;padding:14px 18px;font-size:14px;line-height:1.5;`,r.textContent=e,a.appendChild(r);let i=document.createElement(`div`);i.style.cssText=`align-self:flex-start;max-width:85%;background:#F6F3EE;border-radius:20px 20px 20px 4px;padding:14px 18px;`,i.innerHTML=`<div class="animate-tension" style="font-size:13px;color:rgba(0,0,0,0.4);">Thinking...</div>`,a.appendChild(i),a.scrollTop=a.scrollHeight,s.style.opacity=`0.4`,s.style.pointerEvents=`none`;try{let r=await t.sendChatMessage(e,T,n);T.push({role:`user`,content:e}),T.push({role:`assistant`,content:r.reply}),i.innerHTML=`<div style="font-size:14px;color:#1A1A1A;line-height:1.6;white-space:pre-wrap;">${r.reply}</div>`}catch(e){i.innerHTML=`<div style="font-size:13px;color:#E53935;">Sorry, I couldn't respond right now. Try again.</div>`,console.error(`Chat error:`,e)}s.style.opacity=`1`,s.style.pointerEvents=`auto`,a.scrollTop=a.scrollHeight,o.focus()}s.addEventListener(`click`,c),o.addEventListener(`keydown`,e=>{e.key===`Enter`&&c()})}function D(e){e.querySelectorAll(`.btn-try-again`).forEach(e=>{e.addEventListener(`click`,()=>{l=null,d=null,m=[],p=null,S()})}),e.querySelectorAll(`.btn-chat-stylist`).forEach(e=>{e.addEventListener(`click`,e=>{let t=m[e.currentTarget.dataset.idx];t&&E(t)})})}s.appendChild(c),o.appendChild(s),S(),b(),x()}var v=[`All`,`Tops`,`Outerwear`,`Bottoms`,`Shoes`,`Accessories`];function y(e){let n=`All`,r=[],i=!0;async function a(){try{i=!0,s(),r=(await t.getWardrobe(n===`All`?``:`category=${n.toLowerCase()}`)).items||[]}catch(e){console.error(`Failed to load wardrobe`,e)}finally{i=!1,s()}}function s(){e.innerHTML=`<div class="app-layout page"></div>`;let t=e.querySelector(`.app-layout`);t.appendChild(h(`/wardrobe`));let s=document.createElement(`div`);s.className=`main-content`,s.style.background=`#F6F3EE`;let l=document.createElement(`div`);l.className=`page-content`,l.style.cssText=`padding-top:16px; padding-bottom:100px; max-width:600px; margin:0 auto;`,l.innerHTML=`
      <!-- Header -->
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:32px; padding:0 4px;">
        <div>
          <h2 style="font-family:'Cormorant Garamond',serif; font-size:32px; font-weight:600; color:#1A1A1A; letter-spacing:-0.5px;">Your Wardrobe</h2>
          <p style="font-size:11px; font-weight:800; color:rgba(0,0,0,0.3); text-transform:uppercase; letter-spacing:1.5px; margin-top:4px;">${i?`Updating ARCHIVE...`:`${r.length} curated items`}</p>
        </div>
        <button id="btn-add-item" style="
          padding:12px 24px; border-radius:100px; font-size:13px; font-weight:750; cursor:pointer;
          background:#1A1A1A; color:#FFF; border:none; font-family:'DM Sans',sans-serif;
          text-transform:uppercase; letter-spacing:1px;
        ">+ Add Item</button>
      </div>

      <!-- Filter Pills -->
      <div style="display:flex; gap:10px; margin-bottom:32px; overflow-x:auto; scrollbar-width:none; padding-bottom:8px;" class="hide-scrollbar">
        ${v.map(e=>`
          <button class="filter-pill" data-cat="${e}" style="
            padding:10px 22px; border-radius:100px; font-size:12px; font-weight:700; white-space:nowrap; cursor:pointer;
            transition:all 0.3s cubic-bezier(0.22, 1, 0.36, 1); border:1.5px solid ${n===e?`#1A1A1A`:`rgba(0,0,0,0.05)`};
            background:${n===e?`#1A1A1A`:`#FFF`};
            color:${n===e?`#FFF`:`#1A1A1A`};
            font-family:'DM Sans',sans-serif;
            text-transform:uppercase; letter-spacing:0.5px;
          ">${e}</button>
        `).join(``)}
      </div>

      <!-- Grid -->
      <div id="wardrobe-grid"></div>

      <!-- AI Insights -->
      <div id="ai-insights" style="margin-top:32px;"></div>
    `;let d=l.querySelector(`#wardrobe-grid`),f=l.querySelector(`#ai-insights`);if(i)d.innerHTML=`
        <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:16px;">
          ${[,,,,,,].fill(`<div class="shimmer" style="aspect-ratio:3/4; border-radius:24px; background:#FFF;"></div>`).join(``)}
        </div>
      `;else if(r.length===0)d.innerHTML=`
        <div style="background:#FFF; border-radius:32px; padding:64px 24px; text-align:center; box-shadow:0 10px 40px rgba(0,0,0,0.04); border: 1px solid rgba(0,0,0,0.01);">
          <div style="font-size:56px; margin-bottom:20px; opacity:0.2;">🧥</div>
          <h3 style="font-family:'Cormorant Garamond',serif; font-size:24px; font-weight:600; color:#1A1A1A; margin-bottom:8px;">Archive Empty</h3>
          <p style="font-size:14px; color:rgba(0,0,0,0.4); margin-bottom:32px; font-weight:500;">Begin curating your digital wardrobe collection.</p>
          <button class="btn-add-empty" style="padding:16px 40px; border-radius:100px; font-size:14px; font-weight:750; cursor:pointer; background:#1A1A1A; color:#FFF; border:none; text-transform:uppercase; letter-spacing:1px;">Add First Piece</button>
        </div>
      `,l.querySelector(`.btn-add-empty`)?.addEventListener(`click`,()=>o(`/add-item`));else{d.innerHTML=`
        <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:16px;">
          ${r.map((e,t)=>`
            <div class="wardrobe-card" data-index="${t}" style="
              border-radius:24px; overflow:hidden; cursor:pointer; position:relative;
              background:#FFF; box-shadow:0 4px 20px rgba(0,0,0,0.04); border: 1px solid rgba(0,0,0,0.01);
              transition:all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
            ">
              <div style="aspect-ratio:3/4; background:#F2EFEA; overflow:hidden;">
                ${e.imageUrl?`<img src="http://${window.location.hostname}:3001${e.imageUrl}" style="width:100%;height:100%;object-fit:cover;transition:transform 0.5s ease;" />`:`<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:32px;opacity:0.3;">👕</div>`}
              </div>
              <div style="padding:12px 14px;">
                <div style="font-size:13px; font-weight:700; color:#1A1A1A; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${e.name}</div>
                <div style="font-size:9px; color:rgba(0,0,0,0.3); font-weight:900; text-transform:uppercase; letter-spacing:1px; margin-top:2px;">${e.category||`Piece`}</div>
              </div>
            </div>
          `).join(``)}
        </div>
      `;let e=[],t={},n={};r.forEach(e=>{(e.colors||[]).forEach(e=>{let n=e.toLowerCase();t[n]=(t[n]||0)+1}),e.category&&(n[e.category]=(n[e.category]||0)+1)});let i=Object.entries(t).sort((e,t)=>t[1]-e[1])[0];i&&e.push(`Your palette is dominated by <strong>${i[0]}</strong>, appearing in ${i[1]} pieces.`);let a=[{key:`tops`,label:`Tops`,emoji:`👕`},{key:`bottoms`,label:`Pants`,emoji:`👖`},{key:`shoes`,label:`Footwear`,emoji:`👟`},{key:`outerwear`,label:`Outerwear`,emoji:`🧥`}].filter(e=>!n[e.key]);if(a.length>0&&r.length>=2){let t=a.map(e=>`<strong>${e.label}</strong>`).join(`, `);e.push(`We recommend adding ${t} to complete your core collection.`)}e.length>0&&(f.innerHTML=`
          <div style="background:#FDFBFA; border-radius:24px; padding:28px; border:1px solid rgba(193,122,86,0.1);">
            <div style="font-size:10px; font-weight:900; color:#C17A56; text-transform:uppercase; letter-spacing:1.5px; margin-bottom:12px;">Editorial Insights</div>
            ${e.map(e=>`
              <div style="font-family:'Cormorant Garamond', serif; font-size:17px; color:#1A1A1A; line-height:1.5; margin-bottom:10px; font-style:italic;">"${e}"</div>
            `).join(``)}
          </div>
        `)}s.appendChild(l),t.appendChild(s),l.querySelector(`#btn-add-item`)?.addEventListener(`click`,()=>o(`/add-item`)),l.querySelectorAll(`.filter-pill`).forEach(e=>{e.addEventListener(`click`,()=>{n!==e.dataset.cat&&(n=e.dataset.cat,a())})}),l.querySelectorAll(`.wardrobe-card`).forEach(e=>{e.addEventListener(`mouseenter`,()=>{e.style.transform=`translateY(-4px)`,e.style.boxShadow=`0 8px 24px rgba(0,0,0,0.08)`;let t=e.querySelector(`img`);t&&(t.style.transform=`scale(1.05)`)}),e.addEventListener(`mouseleave`,()=>{e.style.transform=``,e.style.boxShadow=`0 2px 8px rgba(0,0,0,0.04)`;let t=e.querySelector(`img`);t&&(t.style.transform=``)}),e.addEventListener(`click`,()=>{let t=r[e.dataset.index];c(t)})});let p=document.createElement(`button`);p.className=`fab`,p.innerHTML=u.plus,p.addEventListener(`click`,()=>o(`/add-item`)),t.appendChild(p)}function c(e){let n=document.createElement(`div`);n.style.cssText=`position:fixed;inset:0;background:rgba(0,0,0,0.4);backdrop-filter:blur(8px);z-index:9999;display:flex;align-items:flex-end;justify-content:center;`,n.innerHTML=`
      <div class="animate-fade-in-up" style="background:#FFF;width:100%;max-width:480px;border-radius:24px 24px 0 0;padding:24px;max-height:85vh;overflow-y:auto;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
          <h3 style="font-family:'Playfair Display',serif;font-size:20px;font-weight:700;">Item Details</h3>
          <button id="close-item" style="background:#F2EFEA;border:none;border-radius:50%;width:32px;height:32px;cursor:pointer;font-size:14px;">✕</button>
        </div>

        <div style="aspect-ratio:3/4;border-radius:20px;overflow:hidden;background:#F2EFEA;margin-bottom:16px;">
          ${e.imageUrl?`<img src="http://${window.location.hostname}:3001${e.imageUrl}" style="width:100%;height:100%;object-fit:cover;" />`:`<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:48px;opacity:0.3;">👕</div>`}
        </div>

        <!-- Edit Form -->
        <div style="margin-bottom:12px;">
          <label style="font-size:11px;font-weight:700;color:rgba(0,0,0,0.4);text-transform:uppercase;letter-spacing:0.5px;display:block;margin-bottom:6px;">Name</label>
          <input id="edit-name" class="input-field" type="text" value="${e.name}" style="border-radius:12px;" />
        </div>

        <div style="margin-bottom:16px;">
          <label style="font-size:11px;font-weight:700;color:rgba(0,0,0,0.4);text-transform:uppercase;letter-spacing:0.5px;display:block;margin-bottom:6px;">Category</label>
          <select id="edit-category" class="select-field" style="border-radius:12px;">
            <option value="tops" ${e.category===`tops`?`selected`:``}>Tops</option>
            <option value="outerwear" ${e.category===`outerwear`?`selected`:``}>Outerwear</option>
            <option value="bottoms" ${e.category===`bottoms`?`selected`:``}>Bottoms</option>
            <option value="shoes" ${e.category===`shoes`?`selected`:``}>Shoes</option>
            <option value="accessories" ${e.category===`accessories`?`selected`:``}>Accessories</option>
          </select>
        </div>

        ${e.colors&&e.colors.length>0?`
          <div style="margin-bottom:16px;">
            <label style="font-size:11px;font-weight:700;color:rgba(0,0,0,0.4);text-transform:uppercase;letter-spacing:0.5px;display:block;margin-bottom:6px;">Colors</label>
            <div style="display:flex;gap:8px;">
              ${e.colors.map(e=>`<div style="width:28px;height:28px;border-radius:50%;background:${e};border:2px solid rgba(0,0,0,0.08);"></div>`).join(``)}
            </div>
          </div>
        `:``}

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
    `,document.body.appendChild(n),n.addEventListener(`click`,e=>{e.target===n&&n.remove()}),n.querySelector(`#close-item`)?.addEventListener(`click`,()=>n.remove()),n.querySelector(`#btn-save`)?.addEventListener(`click`,async()=>{let r=n.querySelector(`#btn-save`);r.textContent=`Saving...`,r.style.opacity=`0.6`;try{let r=new FormData;r.append(`name`,n.querySelector(`#edit-name`).value),r.append(`category`,n.querySelector(`#edit-category`).value),await t.request(`/wardrobe/${e.id}`,{method:`PUT`,body:r}),n.remove(),a()}catch(e){r.textContent=`Save Changes`,r.style.opacity=`1`,alert(`Failed: `+e.message)}}),n.querySelector(`#btn-delete`)?.addEventListener(`click`,async()=>{if(confirm(`Delete this item permanently?`))try{await t.request(`/wardrobe/${e.id}`,{method:`DELETE`}),n.remove(),a()}catch(e){alert(`Failed: `+e.message)}})}a()}var b=[{name:`Black`,hex:`#1C1C1E`},{name:`White`,hex:`#FFFFFF`},{name:`Cream`,hex:`#F0E8D8`},{name:`Beige`,hex:`#C8B89A`},{name:`Camel`,hex:`#C4956A`},{name:`Sage Green`,hex:`#9CAF88`},{name:`Navy`,hex:`#2C3E50`},{name:`Burgundy`,hex:`#722F37`},{name:`Olive`,hex:`#6B7B5E`},{name:`Brown`,hex:`#8B6914`},{name:`Gray`,hex:`#9B9B9B`},{name:`Blush`,hex:`#E8B5CE`}],x=[`Spring`,`Summer`,`Fall`,`Winter`];function S(e){let n=[],r=[],i=[],a={name:``,category:``,brand:``};e.innerHTML=`<div class="app-layout page"></div>`;let s=e.querySelector(`.app-layout`);s.appendChild(h(`/wardrobe`));let c=document.createElement(`div`);c.className=`main-content`,c.appendChild(g(`Add New Item ✦`));let l=document.createElement(`div`);l.className=`page-content`;function d(){let e=l.querySelector(`#item-name`),t=l.querySelector(`#item-category`),n=l.querySelector(`#item-brand`);e&&(a.name=e.value),t&&(a.category=t.value),n&&(a.brand=n.value)}function f(){let e=n.length>0;l.innerHTML=`
      <div class="add-item-layout animate-fade-in-up">
        <!-- Left: Upload Zone & Previews -->
        <div>
          <div class="drop-zone" id="drop-zone" style="min-height:220px; border-style: ${e?`dashed`:`solid`}; background: ${e?`rgba(0,0,0,0.02)`:`var(--surface-variant)`}">
            <div style="width:48px;height:48px;border-radius:50%;background:var(--accent-light);display:flex;align-items:center;justify-content:center;margin-bottom:var(--sp-2);color:var(--accent)">
              ${u.upload}
            </div>
            <p style="font-weight:600; font-size:14px;">${e?`Add another angle`:`Drop your primary photo here`}</p>
            <p class="body-sm" style="margin-top:4px;">${e?`${n.length}/5 photos added`:`AI will analyze your item automatically`}</p>
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
          ${e?`
            <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:10px; margin-top:20px;">
              ${n.map((e,t)=>`
                <div style="position:relative; aspect-ratio:1/1; border-radius:12px; overflow:hidden; border:2px solid ${t===0?`var(--accent)`:`transparent`}">
                  <img src="${e.preview}" style="width:100%; height:100%; object-fit:cover;" />
                  ${t===0?`<div style="position:absolute; bottom:0; left:0; right:0; background:var(--accent); color:#fff; font-size:9px; font-weight:800; text-align:center; padding:2px; text-transform:uppercase;">Primary</div>`:``}
                  <button class="btn-remove-angle" data-idx="${t}" style="position:absolute; top:4px; right:4px; width:20px; height:20px; border-radius:50%; background:rgba(0,0,0,0.5); color:#fff; border:none; cursor:pointer; font-size:10px; display:flex; align-items:center; justify-content:center;">✕</button>
                </div>
              `).join(``)}
              ${n.length<5?`
                <div id="btn-add-more" style="aspect-ratio:1/1; border-radius:12px; border:1.5px dashed rgba(0,0,0,0.1); display:flex; flex-direction:column; align-items:center; justify-content:center; gap:4px; cursor:pointer; background:#fff;">
                  <span style="font-size:20px; color:rgba(0,0,0,0.3);">+</span>
                  <span style="font-size:9px; font-weight:600; color:rgba(0,0,0,0.4); text-transform:uppercase;">Add Angle</span>
                </div>
              `:``}
            </div>
          `:``}
        </div>

        <!-- Right: Metadata Form -->
        <div>
          ${e?`
            <div class="ai-banner" style="margin-bottom: var(--sp-3); padding: 12px; background: var(--accent-light); border-radius: var(--radius-sm); border-left: 3px solid var(--accent);">
              <span class="ai-icon" style="color: var(--accent); font-weight: bold; margin-right: 8px;">✦</span>
              <span class="body-sm" style="color: var(--text-primary)">AI will study all angles to extract the best metadata & colors.</span>
            </div>
          `:``}

          <div class="form-group">
            <label>Item Name</label>
            <input class="input-field" type="text" placeholder="e.g., Cashmere Turtleneck" id="item-name" value="${a.name}" />
          </div>

          <div class="form-group">
            <label>Category</label>
            <select class="select-field" id="item-category">
              <option value="" ${a.category===``?`selected`:``}>Select category</option>
              <option value="tops" ${a.category===`tops`?`selected`:``}>Tops</option>
              <option value="outerwear" ${a.category===`outerwear`?`selected`:``}>Outerwear</option>
              <option value="bottoms" ${a.category===`bottoms`?`selected`:``}>Bottoms</option>
              <option value="shoes" ${a.category===`shoes`?`selected`:``}>Shoes</option>
              <option value="accessories" ${a.category===`accessories`?`selected`:``}>Accessories</option>
            </select>
          </div>

          <div class="form-group">
            <label>Color Palette</label>
            <div class="color-chips">
              ${b.map(e=>`
                <div class="color-swatch${r.includes(e.name)?` active`:``}" 
                     style="background:${e.hex}" 
                     data-color="${e.name}"
                     title="${e.name}"></div>
              `).join(``)}
            </div>
          </div>

          <div class="form-group">
            <label>Season(s)</label>
            <div class="season-toggles">
              ${x.map(e=>`
                <div class="chip${i.includes(e)?` active`:``}" data-season="${e}">${e}</div>
              `).join(``)}
            </div>
          </div>

          <div class="form-group">
            <label>Brand (optional)</label>
            <input class="input-field" type="text" placeholder="e.g., Acne Studios" id="item-brand" value="${a.brand}" />
          </div>

          <button class="btn-primary" style="width:100%;margin-top:var(--sp-2)" id="btn-save">Save to Wardrobe</button>
        </div>
      </div>
    `,p()}function p(){let e=l.querySelector(`#drop-zone`),s=l.querySelector(`#file-input`),c=l.querySelector(`#btn-add-more`);if(e&&s){let t=()=>s.click();e.addEventListener(`click`,t),c?.addEventListener(`click`,t),e.addEventListener(`dragover`,t=>{t.preventDefault(),e.classList.add(`drag-over`)}),e.addEventListener(`dragleave`,()=>e.classList.remove(`drag-over`)),e.addEventListener(`drop`,t=>{t.preventDefault(),e.classList.remove(`drag-over`),Array.from(t.dataTransfer.files).forEach(e=>m(e))}),s.addEventListener(`change`,e=>{Array.from(e.target.files).forEach(e=>m(e)),s.value=``})}l.querySelectorAll(`.btn-remove-angle`).forEach(e=>{e.addEventListener(`click`,t=>{t.stopPropagation();let r=parseInt(e.dataset.idx);n.splice(r,1),f()})}),l.querySelectorAll(`.color-swatch`).forEach(e=>{e.addEventListener(`click`,()=>{d();let t=e.dataset.color;r.includes(t)?r=r.filter(e=>e!==t):r.push(t),f()})}),l.querySelectorAll(`.chip`).forEach(e=>{e.addEventListener(`click`,()=>{d();let t=e.dataset.season;i.includes(t)?i=i.filter(e=>e!==t):i.push(t),f()})}),l.querySelector(`#btn-save`)?.addEventListener(`click`,async e=>{e.preventDefault(),d();let s=a.name.trim(),c=a.category,u=a.brand.trim();if(n.length===0&&(!s||!c))return alert(`Please upload at least one photo (primary angle).`);let f=l.querySelector(`#btn-save`);f&&(f.innerHTML=`Analyzing ${n.length} Angles <span class="loading-dots">...</span>`,f.style.opacity=`0.7`,f.style.pointerEvents=`none`);try{let e=new FormData;s&&e.append(`name`,s),c&&e.append(`category`,c),u&&e.append(`brand`,u);let a=r.map(e=>b.find(t=>t.name===e)?.hex).filter(Boolean);e.append(`colors`,JSON.stringify(a)),e.append(`colorNames`,JSON.stringify(r)),e.append(`seasons`,JSON.stringify(i.map(e=>e.toLowerCase()))),n.forEach(t=>{e.append(`images`,t.file)}),await t.addWardrobeItem(e),o(`/wardrobe`)}catch(e){alert(`Failed to save item: `+e.message),f&&(f.textContent=`Save to Wardrobe`,f.style.opacity=`1`,f.style.pointerEvents=`auto`)}})}function m(e){if(!(n.length>=5)&&e&&e.type.startsWith(`image/`)){d();let t=new FileReader;t.onload=t=>{n.push({file:e,preview:t.target.result}),f()},t.readAsDataURL(e)}}f(),c.appendChild(l),s.appendChild(c)}function C(e){let n=null,r=null,i=null,a=!1,o=!1;e.innerHTML=`<div class="app-layout page"></div>`;let s=e.querySelector(`.app-layout`);s.appendChild(h(`/fit-check`));let c=document.createElement(`div`);c.className=`main-content`,c.style.background=`#F6F3EE`;let l=document.createElement(`div`);l.className=`page-content`,l.style.cssText=`padding-top:16px; padding-bottom:100px; max-width:540px; margin:0 auto;`;function u(){if(i&&!o){p();return}l.innerHTML=`
      <div class="animate-fade-in-up">
        ${r?f():d()}
      </div>
    `,m()}function d(){return`
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
    `}function f(){return a?`
        <div style="background:#FFF; border-radius:32px; overflow:hidden; box-shadow:0 10px 40px rgba(0,0,0,0.1); border:1px solid rgba(0,0,0,0.01);">
          <div style="position:relative;">
            <img src="${r}" style="width:100%; max-height:480px; object-fit:cover; filter:brightness(0.6);" />
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
      `:`
      <div style="background:#FFF; border-radius:32px; overflow:hidden; box-shadow:0 10px 40px rgba(0,0,0,0.06); border:1px solid rgba(0,0,0,0.01);">
        <div style="position:relative;">
          <img src="${r}" style="width:100%; max-height:480px; object-fit:cover;" />
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
    `}function p(){let e=i.score,t=i.feedback||{pros:[],cons:[]},a=i.recommendedSwaps||[],o=i.verdict||`Analysis complete.`,s=i.weatherContext,c=`🔥`;c=e>=9?`💯`:e>=7?`🔥`:e>=5?`👍`:`💡`,l.innerHTML=`
      <!-- Photo + Score Overlay -->
      <div class="animate-fade-in-up" style="position:relative; background:#FFF; border-radius:32px; overflow:hidden; box-shadow:0 10px 40px rgba(0,0,0,0.08); margin-bottom:24px;">
        <img src="${r}" style="width:100%; max-height:420px; object-fit:cover;" />
        <div style="position:absolute;bottom:0;left:0;right:0;padding:40px;background:linear-gradient(transparent, rgba(0,0,0,0.85));">
          <div style="display:flex;align-items:center;gap:20px;">
            <!-- Score Badge -->
            <div class="animate-score-reveal" style="width:84px;height:84px;border-radius:50%;background:#FFF;display:flex;align-items:center;justify-content:center;flex-direction:column;box-shadow:0 8px 32px rgba(0,0,0,0.25);">
              <span style="font-family:'Cormorant Garamond',serif;font-size:36px;font-weight:700;color:#1A1A1A;line-height:1;">${e}</span>
              <span style="font-size:10px;color:rgba(0,0,0,0.3);font-weight:900;text-transform:uppercase;letter-spacing:1px;margin-top:2px;">/10</span>
            </div>
            <div>
              <div style="font-size:24px;font-weight:600;color:#FFF;font-family:'Cormorant Garamond',serif;letter-spacing:-0.5px;">${c} ${e>=8?`Stunning.`:e>=6?`Sophisticated.`:`Refine Needed.`}</div>
              ${s?`<div style="font-size:11px;color:rgba(255,255,255,0.6);margin-top:4px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">CONTEXT: ${s.temp} · ${s.condition.toUpperCase()}</div>`:``}
            </div>
          </div>
        </div>
      </div>

      <!-- Verdict -->
      <div class="animate-slide-up" style="animation-delay:300ms; background:#FFF; border-radius:32px; padding:32px; box-shadow:0 4px 20px rgba(0,0,0,0.02); margin-bottom:16px; border:1px solid rgba(0,0,0,0.01);">
        <div style="font-family:'Cormorant Garamond',serif; font-style:italic; font-size:18px; color:rgba(0,0,0,0.8); line-height:1.6; text-align:center;">"${o}"</div>
      </div>

      <!-- Analysis Grid -->
      <div style="display:grid; grid-template-columns: 1fr; gap:16px; margin-bottom:16px;">
        <!-- Pros -->
        ${t.pros&&t.pros.length>0?`
        <div class="animate-slide-up" style="animation-delay:500ms; background:#FDFBFA; border-radius:24px; padding:28px; border:1px solid rgba(193,122,86,0.1);">
          <h4 style="font-size:11px; font-weight:900; color:#C17A56; margin-bottom:16px; text-transform:uppercase; letter-spacing:1.5px; display:flex; align-items:center; gap:8px;">
            <span style="font-size:16px;">✦</span> The Highlights
          </h4>
          <div style="display:flex;flex-direction:column;gap:12px;">
            ${t.pros.map(e=>`
              <div style="font-size:14px;color:#1A1A1A;line-height:1.6;font-weight:500;padding-left:14px;border-left:1px solid rgba(193,122,86,0.3);">
                ${e}
              </div>
            `).join(``)}
          </div>
        </div>
        `:``}

        <!-- Cons -->
        ${t.cons&&t.cons.length>0?`
        <div class="animate-slide-up" style="animation-delay:650ms; background:#FFF; border-radius:24px; padding:28px; border:1px solid rgba(0,0,0,0.04);">
          <h4 style="font-size:11px; font-weight:900; color:rgba(0,0,0,0.4); margin-bottom:16px; text-transform:uppercase; letter-spacing:1.5px; display:flex; align-items:center; gap:8px;">
            <span style="font-size:16px;">✎</span> Stylist's Notes
          </h4>
          <div style="display:flex;flex-direction:column;gap:12px;">
            ${t.cons.map(e=>`
              <div style="font-size:14px;color:rgba(0,0,0,0.6);line-height:1.6;font-weight:500;padding-left:14px;border-left:1px solid rgba(0,0,0,0.1);">
                ${e}
              </div>
            `).join(``)}
          </div>
        </div>
        `:``}
      </div>

      <!-- Swap Suggestions -->
      ${a.length>0?`
      <div class="animate-slide-up" style="animation-delay:800ms; background:#FFF; border-radius:32px; padding:32px; border:1px solid rgba(0,0,0,0.01); box-shadow:0 4px 20px rgba(0,0,0,0.02); margin-bottom:16px;">
        <h4 style="font-size:11px; font-weight:900; color:#1A1A1A; margin-bottom:20px; text-transform:uppercase; letter-spacing:1.5px; text-align:center;">Wardrobe Refinements</h4>
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
          ${a.slice(0,4).map(e=>`
            <div style="background:#F9F7F5; border-radius:20px; padding:16px; display:flex; flex-direction:column; align-items:center; text-align:center;" class="hover-lift">
              ${e.imageUrl?`<img src="http://${window.location.hostname}:3001${e.imageUrl}" style="width:64px;height:64px;border-radius:12px;object-fit:cover;margin-bottom:12px;filter:drop-shadow(0 4px 10px rgba(0,0,0,0.05));" />`:`<div style="width:64px;height:64px;background:#EAE7E0;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:24px;margin-bottom:12px;">👕</div>`}
              <div style="font-size:11px;font-weight:700;color:#1A1A1A;line-height:1.3;">${e.name}</div>
              <div style="font-size:9px;color:rgba(0,0,0,0.3);font-weight:800;text-transform:uppercase;letter-spacing:0.5px;margin-top:4px;">${e.category||`VIBE MATCH`}</div>
            </div>
          `).join(``)}
        </div>
      </div>
      `:``}

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
    `,l.querySelector(`#btn-try-another`)?.addEventListener(`click`,()=>{n=null,r=null,i=null,u()}),l.querySelector(`#btn-improve`)?.addEventListener(`click`,()=>{window.location.hash=`/dashboard`})}function m(){let e=l.querySelector(`#fitcheck-drop`),t=l.querySelector(`#fitcheck-file`);e&&t&&(e.addEventListener(`click`,()=>t.click()),e.addEventListener(`dragover`,t=>{t.preventDefault(),e.style.borderColor=`var(--accent, #C17A56)`,e.style.background=`rgba(193,122,86,0.04)`}),e.addEventListener(`dragleave`,()=>{e.style.borderColor=`rgba(0,0,0,0.12)`,e.style.background=``}),e.addEventListener(`drop`,e=>{e.preventDefault(),e.dataTransfer.files[0]&&g(e.dataTransfer.files[0])}),t.addEventListener(`change`,e=>{e.target.files[0]&&g(e.target.files[0])})),l.querySelector(`#btn-analyze-fit`)?.addEventListener(`click`,_),l.querySelector(`#btn-change-photo`)?.addEventListener(`click`,()=>{n=null,r=null,i=null,u()})}function g(e){if(e&&e.type.startsWith(`image/`)){n=e;let t=new FileReader;t.onload=e=>{r=e.target.result,u()},t.readAsDataURL(e)}}async function _(){if(!(!n||a)){a=!0,u();try{let e=new FormData;e.append(`image`,n),i=(await t.submitFitCheck(e)).fitCheck,a=!1,o=!0,l.innerHTML=`
        <div style="background:#FFF; border-radius:28px; overflow:hidden; box-shadow:0 4px 30px rgba(0,0,0,0.06);">
          <div style="position:relative;">
            <img src="${r}" style="width:100%; max-height:400px; object-fit:cover; filter:brightness(0.8);" />
            <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;">
              <div class="animate-tension" style="font-size:64px;">
                ${i.score>=8?`🔥`:i.score>=6?`👍`:`💡`}
              </div>
            </div>
          </div>
        </div>
      `,setTimeout(()=>{o=!1,u()},1500)}catch(e){a=!1,l.innerHTML=`
        <div style="background:#FFF; border-radius:28px; padding:40px 24px; text-align:center; box-shadow:0 4px 30px rgba(0,0,0,0.06);">
          <div style="font-size:48px; margin-bottom:16px;">😕</div>
          <h3 style="font-family:'Playfair Display',serif; font-size:20px; font-weight:700; color:#1A1A1A; margin-bottom:8px;">Analysis Failed</h3>
          <p style="font-size:14px; color:rgba(0,0,0,0.5); margin-bottom:24px;">${e.message}</p>
          <button id="btn-retry" style="
            padding:14px 40px; border-radius:100px; font-size:14px; font-weight:700; cursor:pointer;
            background:#1A1A1A; color:#FFF; border:none; font-family:'DM Sans',sans-serif;
          ">Try Again</button>
        </div>
      `,l.querySelector(`#btn-retry`)?.addEventListener(`click`,_)}}}u(),c.appendChild(l),s.appendChild(c)}function w(e){let n=JSON.parse(localStorage.getItem(`styleai_user`)||`{}`),r=n.name||`Friend`,i=n.styles||n.stylePreferences||[`Minimalist`];e.innerHTML=`<div class="app-layout page"></div>`;let a=e.querySelector(`.app-layout`);a.appendChild(h(`/profile`));let o=document.createElement(`div`);o.className=`main-content`,o.style.background=`#F6F3EE`;let s=document.createElement(`div`);s.className=`page-content`,s.style.cssText=`padding-top:16px; padding-bottom:100px; max-width:480px; margin:0 auto;`,s.innerHTML=`
    <div class="animate-fade-in-up">
      <!-- Identity Header -->
      <div style="background:#FFF; border-radius:24px; padding:24px; box-shadow:0 2px 12px rgba(0,0,0,0.03); margin-bottom:16px;">
        <div style="display:flex; gap:16px; align-items:center; margin-bottom:20px;">
          <div style="width:64px; height:64px; border-radius:50%; background:linear-gradient(135deg, #E8E3DB, #D4CFC5); display:flex; align-items:center; justify-content:center; font-size:28px; flex-shrink:0; overflow:hidden;">
            ${n.avatarUrl?`<img src="${n.avatarUrl}" style="width:100%;height:100%;object-fit:cover;" />`:r.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 style="font-family:'Playfair Display',serif; font-size:22px; font-weight:700; color:#1A1A1A;">${r}</h2>
            <p style="font-size:13px; color:rgba(0,0,0,0.4);">${n.email||``}</p>
          </div>
        </div>

        <!-- City & Gender row -->
        <div style="display:flex; gap:12px; margin-bottom:16px;">
          <div style="flex:1; background:#F6F3EE; border-radius:14px; padding:12px 16px;">
            <div style="font-size:10px; font-weight:700; color:rgba(0,0,0,0.35); text-transform:uppercase; letter-spacing:0.5px; margin-bottom:2px;">City</div>
            <div style="display:flex; align-items:center; gap:6px;">
              <span id="city-text" style="font-size:14px; font-weight:600; color:#1A1A1A;">${n.city?n.city.split(`|`).pop().split(`,`)[0]:`Not set`}</span>
              <button id="edit-city-btn" style="background:none;border:none;cursor:pointer;font-size:12px;color:rgba(0,0,0,0.3);">✎</button>
            </div>
            <!-- City edit inline -->
            <div id="city-edit" style="display:none; margin-top:8px;">
              <div style="display:flex;gap:6px;">
                <input id="city-input" type="text" value="${n.city||``}" placeholder="Slemani, IQ" style="flex:1;padding:8px 12px;border:1.5px solid rgba(0,0,0,0.1);border-radius:10px;font-size:13px;font-family:'DM Sans',sans-serif;outline:none;" autocomplete="off" />
                <button id="city-save" style="padding:8px 14px;border-radius:10px;font-size:12px;font-weight:700;background:#1A1A1A;color:#FFF;border:none;cursor:pointer;">Save</button>
              </div>
              <div id="city-autocomplete" style="position:relative;">
                <div id="city-results" style="position:absolute;top:4px;left:0;right:0;background:#FFF;border:1px solid rgba(0,0,0,0.08);border-radius:10px;max-height:120px;overflow-y:auto;display:none;z-index:50;box-shadow:0 4px 16px rgba(0,0,0,0.1);"></div>
              </div>
            </div>
          </div>
          <div style="flex:1; background:#F6F3EE; border-radius:14px; padding:12px 16px;">
            <div style="font-size:10px; font-weight:700; color:rgba(0,0,0,0.35); text-transform:uppercase; letter-spacing:0.5px; margin-bottom:2px;">Gender</div>
            <span style="font-size:14px; font-weight:600; color:#1A1A1A; text-transform:capitalize;">${n.gender||`Not set`}</span>
          </div>
        </div>

        <!-- Style Preferences -->
        <div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <span style="font-size:10px; font-weight:700; color:rgba(0,0,0,0.35); text-transform:uppercase; letter-spacing:0.5px;">Style Preferences</span>
            <button id="edit-styles-btn" style="background:none;border:none;cursor:pointer;font-size:12px;color:rgba(0,0,0,0.3);">✎</button>
          </div>
          <div id="styles-display" style="display:flex; flex-wrap:wrap; gap:8px;">
            ${i.map(e=>`<span style="font-size:12px;font-weight:600;padding:6px 14px;background:#F6F3EE;color:rgba(0,0,0,0.65);border-radius:100px;">${e}</span>`).join(``)}
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
  `,t.getWardrobeStats().then(e=>{let t=document.getElementById(`stat-items`);t&&(t.textContent=e.totalItems||`0`);let n=document.getElementById(`stat-color`);n&&e.topColor&&(n.textContent=e.topColor)}).catch(()=>{}),s.querySelectorAll(`.settings-row`).forEach(e=>{e.addEventListener(`mouseenter`,()=>{e.style.background=`#F6F3EE`}),e.addEventListener(`mouseleave`,()=>{e.style.background=``})}),s.querySelector(`[data-action="logout"]`)?.addEventListener(`click`,()=>{t.setToken(null),localStorage.removeItem(`styleai_user`),window.location.hash=`/`,window.location.reload()});let c=s.querySelector(`#edit-city-btn`),l=s.querySelector(`#city-edit`),u=s.querySelector(`#city-input`),d=s.querySelector(`#city-save`),f=s.querySelector(`#city-results`),p;c?.addEventListener(`click`,()=>{l.style.display=`block`,c.style.display=`none`,u.focus()}),u?.addEventListener(`input`,e=>{clearTimeout(p);let n=e.target.value.trim();if(n.length<2){f.style.display=`none`;return}p=setTimeout(async()=>{try{let e=await t.searchCity(n);e?.length>0?(f.innerHTML=e.map(e=>`
            <div class="city-option" data-val="${e.label}" data-id="${e.id}" style="padding:10px 12px;cursor:pointer;font-size:13px;border-bottom:1px solid rgba(0,0,0,0.04);">
              <strong>${e.name}</strong> <span style="color:rgba(0,0,0,0.4);font-size:11px;">${e.state?e.state+`, `:``}${e.country}</span>
            </div>
          `).join(``),f.style.display=`block`,f.querySelectorAll(`.city-option`).forEach(e=>{e.addEventListener(`click`,()=>{u.value=e.dataset.val,u.dataset.selectedId=e.dataset.id,f.style.display=`none`})})):f.style.display=`none`}catch(e){console.error(e)}},400)}),d?.addEventListener(`click`,async()=>{let e=u.value.trim();if(!e)return;let r=u.dataset.selectedId,i=r?`${r}|${e}`:e;d.textContent=`...`;try{await t.updateProfile({city:i}),n.city=i,localStorage.setItem(`styleai_user`,JSON.stringify(n)),document.getElementById(`city-text`).textContent=e.split(`,`)[0],l.style.display=`none`,c.style.display=`inline`,d.textContent=`Save`,window.dispatchEvent(new Event(`profileUpdated`))}catch(e){d.textContent=`Save`,alert(`Failed: `+e.message)}});let m=[`Old Money`,`Casual`,`Streetwear`,`Sporty`,`Elegant`,`Minimalist`,`Other`],g=[...i],_=s.querySelector(`#edit-styles-btn`),v=s.querySelector(`#styles-display`),y=s.querySelector(`#styles-edit`),b=s.querySelector(`#styles-grid`),x=s.querySelector(`#styles-save`),S=s.querySelector(`#styles-cancel`);function C(){b.innerHTML=m.map(e=>`
      <button class="style-chip" data-style="${e}" style="
        padding:6px 14px; border-radius:100px; font-size:12px; font-weight:600; cursor:pointer;
        border:1.5px solid ${g.includes(e)?`#1A1A1A`:`rgba(0,0,0,0.1)`};
        background:${g.includes(e)?`#1A1A1A`:`#FFF`};
        color:${g.includes(e)?`#FFF`:`#1A1A1A`};
        font-family:'DM Sans',sans-serif; transition:all 0.15s ease;
      ">${e}</button>
    `).join(``),b.querySelectorAll(`.style-chip`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.dataset.style;g.includes(t)?g=g.filter(e=>e!==t):g.push(t),C()})})}_?.addEventListener(`click`,()=>{g=[...i],v.style.display=`none`,_.style.display=`none`,y.style.display=`block`,C()}),S?.addEventListener(`click`,()=>{v.style.display=`flex`,_.style.display=`inline`,y.style.display=`none`}),x?.addEventListener(`click`,async()=>{if(g.length!==0){x.textContent=`...`;try{await t.updateProfile({stylePreferences:g}),n.styles=g,n.stylePreferences=g,i.length=0,i.push(...g),localStorage.setItem(`styleai_user`,JSON.stringify(n)),v.innerHTML=i.map(e=>`<span style="font-size:12px;font-weight:600;padding:6px 14px;background:#F6F3EE;color:rgba(0,0,0,0.65);border-radius:100px;">${e}</span>`).join(``),v.style.display=`flex`,_.style.display=`inline`,y.style.display=`none`,x.textContent=`Save`,window.dispatchEvent(new Event(`profileUpdated`))}catch(e){x.textContent=`Save`,alert(`Failed: `+e.message)}}}),o.appendChild(s),a.appendChild(o)}a(`/`,e=>l(e)),a(`/onboarding`,e=>p(e)),a(`/dashboard`,e=>_(e)),a(`/wardrobe`,e=>y(e)),a(`/add-item`,e=>S(e)),a(`/fit-check`,e=>C(e)),a(`/profile`,e=>w(e)),s();