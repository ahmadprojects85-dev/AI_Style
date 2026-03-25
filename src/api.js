// ── API Client Utility ──

const API_URL = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:3001/api`;

export const api = {
  getToken() {
    return localStorage.getItem('styleai_token');
  },

  setToken(token) {
    if (token) {
      localStorage.setItem('styleai_token', token);
    } else {
      localStorage.removeItem('styleai_token');
    }
  },

  async request(endpoint, options = {}) {
    const token = this.getToken();
    const headers = { ...options.headers };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
      if (options.body && typeof options.body !== 'string') {
        options.body = JSON.stringify(options.body);
      }
    }

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message || data?.error || 'An error occurred');
      }

      return data;
    } catch (err) {
      console.error(`[API Error] ${endpoint}:`, err.message);
      throw err;
    }
  },

  // Auth
  register(data) { return this.request('/auth/register', { method: 'POST', body: data }); },
  login(data) { return this.request('/auth/login', { method: 'POST', body: data }); },
  googleAuth(idToken) { return this.request('/auth/google', { method: 'POST', body: { idToken } }); },
  getMe() { return this.request('/auth/me'); },

  // Profile
  getProfile() { return this.request('/profile'); },
  updateProfile(data) { return this.request('/profile', { method: 'PUT', body: data }); },
  uploadAvatar(formData) { return this.request('/profile/avatar', { method: 'POST', body: formData }); },

  // Wardrobe
  getWardrobe(params = '') { return this.request(`/wardrobe${params ? '?' + params : ''}`); },
  addWardrobeItem(formData) { return this.request('/wardrobe', { method: 'POST', body: formData }); },
  getWardrobeStats() { return this.request('/wardrobe/stats/summary'); },

  // Fit Check
  submitFitCheck(formData) { return this.request('/fit-check', { method: 'POST', body: formData }); },
  getFitCheckHistory() { return this.request('/fit-check/history'); },

  // Outfits
  getDailySuggestion(occasion = 'casual', style = '') { 
    return this.request(`/outfits/suggestion?occasion=${encodeURIComponent(occasion)}${style ? `&style=${encodeURIComponent(style)}` : ''}`); 
  },
  saveOutfit(data) { return this.request('/outfits', { method: 'POST', body: data }); },
  getOutfitHistory() { return this.request('/outfits/history'); },

  // Weather
  getWeather(city, unit) { return this.request(`/weather?city=${encodeURIComponent(city)}&unit=${encodeURIComponent(unit)}`); },
  getForecast(city, unit) { return this.request(`/weather/forecast?city=${encodeURIComponent(city)}&unit=${encodeURIComponent(unit)}`); },
  searchCity(query) { return this.request(`/weather/search?q=${encodeURIComponent(query)}`); },

  // Chat
  sendChatMessage(message, history, context) { 
    return this.request('/chat', { method: 'POST', body: { message, history, context } }); 
  },
};
