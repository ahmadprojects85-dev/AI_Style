// ── StyleAI — Main Entry Point ──
import './style.css';
import { registerRoute, initRouter } from './router.js';
import { renderLanding } from './pages/landing.js';
import { renderOnboarding } from './pages/onboarding.js';
import { renderDashboard } from './pages/dashboard.js';
import { renderWardrobe } from './pages/wardrobe.js';
import { renderAddItem } from './pages/addItem.js';
import { renderFitCheck } from './pages/fitCheck.js';
import { renderProfile } from './pages/profile.js';

// Register routes
registerRoute('/', (container) => renderLanding(container));
registerRoute('/onboarding', (container) => renderOnboarding(container));
registerRoute('/dashboard', (container) => renderDashboard(container));
registerRoute('/wardrobe', (container) => renderWardrobe(container));
registerRoute('/add-item', (container) => renderAddItem(container));
registerRoute('/fit-check', (container) => renderFitCheck(container));
registerRoute('/profile', (container) => renderProfile(container));

// Initialize
initRouter();
