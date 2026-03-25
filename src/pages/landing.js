// ── Landing Page ──
import editorialImg from '../assets/editorial_wardrobe.png';
import { navigate } from '../router.js';

export function renderLanding(container) {
  container.innerHTML = `
    <div class="landing-page page">
      <div class="landing-left">
        <img src="${editorialImg}" alt="Curated minimal wardrobe" />
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
  `;

  document.getElementById('btn-get-started').addEventListener('click', () => navigate('/onboarding'));
}
