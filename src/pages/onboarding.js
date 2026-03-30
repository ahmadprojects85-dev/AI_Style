// ── Onboarding / Google Auth Flow ──
import { navigate } from '../router.js';
import { icons } from '../components/icons.js';
import { api } from '../api.js';

const GOOGLE_CLIENT_ID = '113815005105-2kg6d5c343se85kbm4bel96vsgt7o7e7.apps.googleusercontent.com'; // User's real OAuth Client ID

const popularCities = ['Milan', 'Paris', 'London', 'New York', 'Tokyo', 'Dubai', 'Los Angeles', 'Berlin', 'Seoul', 'Barcelona', 'Sydney', 'Istanbul'];

export function renderOnboarding(container) {
  const tempUser = JSON.parse(localStorage.getItem('styleai_temp_user') || '{}');

  let currentStep = 2; // Start at Name/Profile completion
  let userEmail = tempUser.email || '';
  let userName = ''; // No longer in tempUser from registration
  let selectedCity = '';
  let weatherUnit = '°C';
  let selectedGender = '';

  function render() {
    container.innerHTML = `
      <div class="onboarding-page page">
        <div class="onboarding-container">
          <div class="step-indicator">
            ${[1, 2, 3, 4].map(s => `<div class="step-dot${s === currentStep ? ' active' : ''}"></div>`).join('')}
          </div>
          <div class="onboarding-step" id="step-content"></div>
        </div>
      </div>
    `;

    const stepEl = document.getElementById('step-content');

    if (currentStep === 2) renderStep2(stepEl);
    else if (currentStep === 3) renderStep3(stepEl);
    else renderStep4(stepEl);
  }

  // Step 1 — Removed

  // Step 2 — Name
  function renderStep2(el) {
    el.innerHTML = `
      <h2>What's your name?</h2>
      <div class="input-group">
        <input class="input-field" type="text" id="name-input" placeholder="Enter your name" value="${userName}" autofocus />
      </div>
      <div class="greeting-confirm" id="greeting-text">${userName ? `Nice to meet you, ${userName} ✦` : ''}</div>
      <div style="margin-top: var(--sp-4)">
        <button class="btn-primary" id="btn-continue" ${!userName ? 'style="opacity:0.5;pointer-events:none"' : ''}>Continue</button>
      </div>
    `;

    const input = document.getElementById('name-input');
    const greeting = document.getElementById('greeting-text');
    const btn = document.getElementById('btn-continue');

    input.addEventListener('input', (e) => {
      userName = e.target.value.trim();
      if (userName) {
        greeting.textContent = `Nice to meet you, ${userName} ✦`;
        greeting.style.opacity = '1';
        btn.style.opacity = '1';
        btn.style.pointerEvents = 'auto';
      } else {
        greeting.textContent = '';
        btn.style.opacity = '0.5';
        btn.style.pointerEvents = 'none';
      }
    });

    btn.addEventListener('click', () => { if (userName) { currentStep = 3; render(); } });
    setTimeout(() => input.focus(), 100);
  }

  // Step 3 — City
  function renderStep3(el) {
    el.innerHTML = `
      <h2>Where are you based? ☀️</h2>
      <p class="body-sm" style="margin-bottom: var(--sp-3)">OpenWeather supports any city globally. Enter your city and country code.</p>
      
      <div class="input-group" style="margin-bottom: var(--sp-3); position: relative">
        <input class="input-field" type="text" id="city-input" placeholder="e.g. Tehran, IR or London, UK" value="${selectedCity}" autocomplete="off" />
        <div id="city-autocomplete-results" style="position:absolute; top:100%; left:0; right:0; background:var(--surface-white); border:1px solid var(--border); border-radius:4px; margin-top:4px; z-index:10; display:none; max-height:200px; overflow-y:auto; box-shadow:0 4px 12px rgba(0,0,0,0.1)"></div>
      </div>

      <div class="city-grid" id="city-grid">
        ${popularCities.map(city => `
          <div class="gender-card${selectedCity === city ? ' selected' : ''}" data-city="${city}" style="padding: var(--sp-2) var(--sp-2); font-size: 14px;">
            ${getCityEmoji(city)} ${city}
          </div>
        `).join('')}
      </div>

      <div style="display: flex; align-items: center; gap: var(--sp-2); margin-top: var(--sp-4); margin-bottom: var(--sp-3)">
        <span class="label" style="color: var(--text-secondary)">Units:</span>
        <div class="chip${weatherUnit === '°C' ? ' active' : ''}" data-unit="°C">°C</div>
        <div class="chip${weatherUnit === '°F' ? ' active' : ''}" data-unit="°F">°F</div>
      </div>

      <button class="btn-primary" id="btn-continue-weather" ${!selectedCity ? 'style="opacity:0.5;pointer-events:none"' : ''}>Continue</button>
    `;

    const cityInput = document.getElementById('city-input');
    const cityGrid = document.getElementById('city-grid');
    const btn = document.getElementById('btn-continue-weather');

    el.querySelectorAll('[data-city]').forEach(card => {
      card.addEventListener('click', () => {
        selectedCity = card.dataset.city;
        cityInput.value = selectedCity;
        el.querySelectorAll('[data-city]').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        btn.style.opacity = '1'; btn.style.pointerEvents = 'auto';
      });
    });

    let searchTimeout;
    const resultsContainer = document.getElementById('city-autocomplete-results');

    cityInput.addEventListener('input', (e) => {
      selectedCity = e.target.value;
      if (selectedCity.trim().length > 0) {
        cityGrid.style.opacity = '0.3';
        cityGrid.style.pointerEvents = 'none';
      } else {
        cityGrid.style.opacity = '1';
        cityGrid.style.pointerEvents = 'auto';
      }
      
      el.querySelectorAll('[data-city]').forEach(c => c.classList.toggle('selected', c.dataset.city === selectedCity));
      btn.style.opacity = selectedCity.trim() ? '1' : '0.5';
      btn.style.pointerEvents = selectedCity.trim() ? 'auto' : 'none';

      clearTimeout(searchTimeout);
      if (selectedCity.trim().length < 2) {
        resultsContainer.style.display = 'none';
        return;
      }

      searchTimeout = setTimeout(async () => {
        try {
          const results = await api.searchCity(selectedCity);
          if (results && results.length > 0) {
            resultsContainer.innerHTML = results.map(r => `
              <div class="city-result-item" data-val="${r.label}" style="padding:12px 16px; cursor:pointer; border-bottom:1px solid var(--border)">
                <div class="coords-hidden" style="display:none">${r.id}</div>
                <strong style="color:var(--text-primary)">${r.name}</strong> <span style="color:var(--text-secondary); font-size:12px">${r.state ? r.state + ', ' : ''}${r.country}</span>
              </div>
            `).join('');
            resultsContainer.style.display = 'block';
            
            resultsContainer.querySelectorAll('.city-result-item').forEach(itemEl => {
              itemEl.addEventListener('click', () => {
                const label = itemEl.dataset.val;
                const coords = itemEl.querySelector('.coords-hidden')?.textContent || '';
                selectedCity = coords ? `${coords}|${label}` : label;
                cityInput.value = label;
                resultsContainer.style.display = 'none';
                btn.style.opacity = '1'; btn.style.pointerEvents = 'auto';
              });
            });
          } else {
            resultsContainer.style.display = 'none';
          }
        } catch (err) {
          console.error('Autocomplete failed', err);
        }
      }, 400);
    });

    btn.addEventListener('click', () => { if (selectedCity) { currentStep = 4; render(); } });
  }

  // Step 4 — Gender & Finish
  function renderStep4(el) {
    const genders = [
      { label: 'Woman', dbVal: 'women', icon: '👗' },
      { label: 'Man', dbVal: 'men', icon: '👔' },
      { label: 'Prefer not to say', dbVal: 'prefer-not-to-say', icon: '🤍' },
    ];

    el.innerHTML = `
      <h2>How do you identify?</h2>
      <div class="gender-cards">
        ${genders.map(g => `
          <div class="gender-card${selectedGender === g.dbVal ? ' selected' : ''}" data-gender="${g.dbVal}">
            <span class="icon">${g.icon}</span> ${g.label}
          </div>
        `).join('')}
      </div>
      <div style="margin-top:var(--sp-4)">
        <button class="btn-primary" id="btn-finish" ${!selectedGender ? 'style="opacity:0.5;pointer-events:none"' : ''}>Enter StyleAI</button>
      </div>
    `;

    el.querySelectorAll('.gender-card').forEach(card => {
      card.addEventListener('click', () => {
        selectedGender = card.dataset.gender;
        el.querySelectorAll('.gender-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        const btn = document.getElementById('btn-finish');
        btn.style.opacity = '1'; btn.style.pointerEvents = 'auto';
      });
    });

    document.getElementById('btn-finish').addEventListener('click', async () => {
      if (selectedGender) {
        const btn = document.getElementById('btn-finish');
        btn.textContent = 'Finalizing Profile...';
        btn.style.opacity = '0.7';
        btn.style.pointerEvents = 'none';

        const password = 'GoogleUserPassword123!';
        const payload = {
          email: userEmail,
          name: userName,
          gender: selectedGender,
          city: selectedCity,
          weatherUnit: weatherUnit,
          onboardingCompleted: true
        };

        try {
          const res = await api.completeOnboarding(payload);
          
          localStorage.setItem('styleai_user', JSON.stringify({
            name: userName,
            email: userEmail,
            city: selectedCity,
            gender: selectedGender
          }));
          
          localStorage.removeItem('styleai_temp_user');
          
          navigate('/dashboard');
        } catch (err) {
          alert('Failed to complete setup: ' + err.message);
          btn.textContent = 'Enter StyleAI';
          btn.style.opacity = '1';
          btn.style.pointerEvents = 'auto';
        }
      }
    });
  }

  render();
}

function getCityEmoji(city) {
  const emojis = {
    'Milan': '🇮🇹', 'Paris': '🇫🇷', 'London': '🇬🇧', 'New York': '🇺🇸',
    'Tokyo': '🇯🇵', 'Dubai': '🇦🇪', 'Los Angeles': '🇺🇸', 'Berlin': '🇩🇪',
    'Seoul': '🇰🇷', 'Barcelona': '🇪🇸', 'Sydney': '🇦🇺', 'Istanbul': '🇹🇷',
  };
  return emojis[city] || '📍';
}
