// ── Top Bar Component ──
import { icons } from './icons.js';
import avatarUrl from '../assets/user_avatar.png';
import { api } from '../api.js';

export function createTopbar(greeting) {
  const user = JSON.parse(localStorage.getItem('styleai_user') || '{}');
  const cityRaw = user.city || 'Milan';
  const unit = user.weatherUnit || '°C';
  
  // Extract display name from coordinate-encoded city strings
  const cityDisplay = cityRaw.includes('|') ? cityRaw.split('|')[1] : cityRaw;
  // Use full raw string for API (includes coordinates)
  const cityForApi = cityRaw;

  const topbar = document.createElement('header');
  topbar.className = 'topbar';
  topbar.innerHTML = `
    <h2 class="topbar-greeting">${greeting}</h2>
    <div class="topbar-right">
      <div class="weather-widget" id="dynamic-weather-widget">
        <span class="spinner" style="width:16px;height:16px;border:2px solid var(--border);border-top-color:var(--text-primary);border-radius:50%;animation:spin 1s linear infinite;"></span>
        <span>Loading...</span>
      </div>
      <img class="avatar" src="${user.avatarUrl || avatarUrl}" alt="User avatar" />
    </div>
  `;

  if (cityForApi) {
    api.getWeather(cityForApi, unit).then(weather => {
      const widget = topbar.querySelector('#dynamic-weather-widget');
      if (widget) {
        widget.innerHTML = `
          <img src="https://openweathermap.org/img/wn/${weather.icon}.png" width="24" height="24" style="flex-shrink:0" />
          <span>${weather.city} · ${weather.temp}${unit} · <span style="text-transform:capitalize">${weather.description}</span></span>
        `;
      }
    }).catch(err => {
      console.warn('Weather fetch failed:', err);
      const widget = topbar.querySelector('#dynamic-weather-widget');
      if (widget) widget.innerHTML = `${icons.cloud} <span>${cityDisplay} · --${unit}</span>`;
    });
  }

  // Listen for profile updates to refresh weather
  window.addEventListener('profileUpdated', () => {
    const updatedUser = JSON.parse(localStorage.getItem('styleai_user') || '{}');
    const newCity = updatedUser.city || '';
    if (newCity) {
      api.getWeather(newCity, updatedUser.weatherUnit || '°C').then(weather => {
        const widget = topbar.querySelector('#dynamic-weather-widget');
        if (widget) {
          widget.innerHTML = `
            <img src="https://openweathermap.org/img/wn/${weather.icon}.png" width="24" height="24" style="flex-shrink:0" />
            <span>${weather.city} · ${weather.temp}${updatedUser.weatherUnit || '°C'} · <span style="text-transform:capitalize">${weather.description}</span></span>
          `;
        }
      }).catch(() => {});
    }
  });

  return topbar;
}
