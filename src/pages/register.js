// ── Custom Registration Page ──
import { navigate } from '../router.js';
import { api } from '../api.js';

export function renderRegister(container) {
  container.innerHTML = `
    <div class="auth-page page">
      <div class="auth-card glass stagger-children">
        <div class="auth-header">
          <div class="landing-logo">Style<span>AI</span></div>
          <h2>Create your account</h2>
          <p class="body-sm">Join the future of personal fashion.</p>
        </div>

        <form id="auth-form" class="auth-form">
          <div class="input-group">
            <label class="label">Username</label>
            <input type="text" id="reg-username" class="input-field" placeholder="unique_style" required />
          </div>

          <div class="input-group">
            <label class="label">Email Address</label>
            <input type="email" id="reg-email" class="input-field" placeholder="alex@gmail.com" required />
          </div>

          <div class="input-group">
            <label class="label">Password</label>
            <input type="password" id="reg-password" class="input-field" placeholder="••••••••" required />
          </div>

          <button type="submit" class="btn-primary" id="btn-register">
            <span>Create Account</span>
            <div class="spinner" id="reg-spinner" style="display:none"></div>
          </button>
        </form>

        <div class="auth-footer">
          <p class="body-sm">Already have an account? <a href="#/login">Log in</a></p>
        </div>
      </div>
    </div>
  `;

  const form = document.getElementById('auth-form');
  const btn = document.getElementById('btn-register');
  const btnText = btn.querySelector('span');
  const spinner = document.getElementById('reg-spinner');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('reg-username').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;

    // Loading state
    btn.disabled = true;
    btnText.style.display = 'none';
    spinner.style.display = 'block';

    try {
      const res = await api.register({ username, email, password });
      
      // Store user info (temporary, will be completed in onboarding)
      localStorage.setItem('styleai_temp_user', JSON.stringify({
        email: email.toLowerCase(),
        username: username.toLowerCase()
      }));

      api.setToken(res.token);
      
      // Navigate to onboarding to finish profile (City, Gender)
      navigate('/onboarding');
    } catch (err) {
      alert(err.message || 'Registration failed');
      btn.disabled = false;
      btnText.style.display = 'block';
      spinner.style.display = 'none';
    }
  });
}
