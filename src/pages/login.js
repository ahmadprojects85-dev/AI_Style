// ── Custom Login Page ──
import { navigate } from '../router.js';
import { api } from '../api.js';

export function renderLogin(container) {
  container.innerHTML = `
    <div class="auth-page page">
      <div class="auth-card glass stagger-children">
        <div class="auth-header">
          <div class="landing-logo">Style<span>AI</span></div>
          <h2>Welcome back</h2>
          <p class="body-sm">Sign in to your digital wardrobe.</p>
        </div>

        <form id="auth-form" class="auth-form">
          <div class="input-group">
            <label class="label">Username or Email</label>
            <input type="text" id="login-identifier" class="input-field" placeholder="Enter your username or email" required />
          </div>

          <div class="input-group">
            <label class="label">Password</label>
            <input type="password" id="login-password" class="input-field" placeholder="••••••••" required />
          </div>

          <button type="submit" class="btn-primary" id="btn-login">
            <span>Login to StyleAI</span>
            <div class="spinner" id="login-spinner" style="display:none"></div>
          </button>
        </form>

        <div class="auth-footer">
          <p class="body-sm">Don't have an account? <a href="#/register">Sign up</a></p>
        </div>
      </div>
    </div>
  `;

  const form = document.getElementById('auth-form');
  const btn = document.getElementById('btn-login');
  const btnText = btn.querySelector('span');
  const spinner = document.getElementById('login-spinner');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const identifier = document.getElementById('login-identifier').value;
    const password = document.getElementById('login-password').value;

    // Loading state
    btn.disabled = true;
    btnText.style.display = 'none';
    spinner.style.display = 'block';

    try {
      const res = await api.login({ identifier, password });
      api.setToken(res.token);
      
      // Store user info
      localStorage.setItem('styleai_user', JSON.stringify({
        name: res.user.name,
        email: res.user.email,
        username: res.user.username,
        city: res.user.city,
        gender: res.user.gender,
        avatarUrl: res.user.avatarUrl
      }));

      // If onboarding isn't complete (e.g. city/gender missing), go to onboarding
      if (!res.user.onboardingCompleted) {
        navigate('/onboarding');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      alert(err.message || 'Login failed');
      btn.disabled = false;
      btnText.style.display = 'block';
      spinner.style.display = 'none';
    }
  });
}
