import { api } from './api.js';

const routes = {};
let currentCleanup = null;

const protectedRoutes = ['/dashboard', '/wardrobe', '/add-item', '/fit-check', '/profile'];

export function registerRoute(path, handler) {
  routes[path] = handler;
}

export function navigate(path) {
  window.location.hash = path;
}

export function initRouter() {
  const handleRoute = async () => {
    let hash = window.location.hash.slice(1) || '/';
    const app = document.getElementById('app');

    // Auth guard
    if (protectedRoutes.includes(hash) && !api.getToken()) {
      navigate('/onboarding');
      return;
    }
    
    // Cleanup previous page
    if (currentCleanup && typeof currentCleanup === 'function') {
      currentCleanup();
      currentCleanup = null;
    }

    // Fade out
    app.style.opacity = '0';
    
    await new Promise(r => setTimeout(r, 150));

    const handler = routes[hash] || routes['/'];
    if (handler) {
      const cleanup = await handler(app);
      if (cleanup) currentCleanup = cleanup;
    }

    // Fade in
    requestAnimationFrame(() => {
      app.style.transition = 'opacity 300ms cubic-bezier(0.22, 1, 0.36, 1)';
      app.style.opacity = '1';
    });
  };

  window.addEventListener('hashchange', handleRoute);
  handleRoute();
}
