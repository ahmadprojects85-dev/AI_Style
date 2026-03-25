// ── Sidebar Component ──
import { icons } from './icons.js';
import { navigate } from '../router.js';

export function createSidebar(activeRoute) {
  const links = [
    { label: 'Home', icon: icons.home, route: '/dashboard' },
    { label: 'Wardrobe', icon: icons.shirt, route: '/wardrobe' },
    { label: 'Fit Check', icon: icons.camera, route: '/fit-check' },
    { label: 'Profile', icon: icons.user, route: '/profile' },
  ];

  const sidebar = document.createElement('aside');
  sidebar.className = 'sidebar';
  sidebar.innerHTML = `
    <div class="sidebar-logo" style="padding: 40px 32px;">
      <h1 style="font-family: 'Cormorant Garamond', serif; font-size: 32px; font-weight: 600; color: #1A1A1A; letter-spacing: -1px;">StyleAI</h1>
    </div>
    
    <nav class="sidebar-nav">
      ${links.map(l => `
        <a class="sidebar-link${activeRoute === l.route ? ' active' : ''}" data-route="${l.route}">
          ${l.icon}
          <span>${l.label}</span>
        </a>
      `).join('')}
    </nav>
  `;

  sidebar.querySelectorAll('.sidebar-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      navigate(link.dataset.route);
    });
  });

  return sidebar;
}
