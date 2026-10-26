/* Flycoded Account UI — plain JavaScript, no real authentication backend. */
(() => {
  'use strict';
  const views = {
    signin: document.getElementById('view-signin'),
    signup: document.getElementById('view-signup'),
    recovery: document.getElementById('view-recovery')
  };
  const quickCopy = document.getElementById('quick-switch-copy');
  const quickButton = document.getElementById('quick-switch-btn');
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');
  const signinEmail = document.getElementById('signin-email');
  const signupPassword = document.getElementById('signup-password');
  const rememberEmail = document.getElementById('remember-email');
  const KEY = 'flycoded_auth_remembered_email';
  let toastTimer;

  function showToast(message) {
    toastMessage.textContent = message;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toast.hidden = true; }, 6500);
  }

  document.getElementById('toast-close').addEventListener('click', () => {
    toast.hidden = true;
    clearTimeout(toastTimer);
  });

  function setView(name) {
    if (!views[name]) return;
    Object.entries(views).forEach(([key, section]) => {
      const active = key === name;
      section.hidden = !active;
      section.classList.toggle('is-active', active);
    });
    if (name === 'signin') {
      quickCopy.textContent = 'New here?';
      quickButton.textContent = 'Create account ↗';
      quickButton.dataset.go = 'signup';
    } else {
      quickCopy.textContent = 'Have an account?';
      quickButton.textContent = 'Sign in ↗';
      quickButton.dataset.go = 'signin';
    }
    const headline = views[name].querySelector('h2');
    if (headline) document.title = `${headline.textContent.trim().replace(/\s+/g, ' ')} | Flycoded`;
    // Mobile visitors can move from a long sign-up form back to the heading.
    if (window.innerWidth <= 700) window.scrollTo({ top: 0, behavior: 'instant' });
  }

  document.querySelectorAll('[data-go]').forEach(button => {
    button.addEventListener('click', () => setView(button.dataset.go));
  });

  document.querySelectorAll('[data-toggle-password]').forEach(button => {
    button.addEventListener('click', () => {
      const input = document.getElementById(button.dataset.togglePassword);
      if (!input) return;
      const show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      button.setAttribute('aria-pressed', String(show));
      button.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
      button.querySelector('use').setAttribute('href', show ? '#ic-eye-off' : '#ic-eye');
      input.focus();
    });
  });

  function messageFor(input) {
    const val = input.value.trim();
    if (input.required && !val) return 'This field is required.';
    if (input.type === 'email' && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return 'Enter a valid email address.';
    if (input.id === 'signup-name' && val.length < 2) return 'Enter at least 2 characters.';
    if (input.id === 'signup-password') {
      if (input.value.length < 8) return 'Use at least 8 characters.';
      if (!/[0-9]/.test(input.value) || !/[^A-Za-z0-9]/.test(input.value)) return 'Include a number and a symbol.';
    }
    if (input.id === 'signup-confirm' && input.value !== signupPassword.value) return 'Passwords do not match.';
    return '';
  }

  function setError(input, message) {
    const error = document.getElementById(`${input.id}-error`);
    if (error) error.textContent = message;
    input.closest('.input-wrap')?.classList.toggle('field-invalid', Boolean(message));
    input.setAttribute('aria-invalid', String(Boolean(message)));
  }

  document.querySelectorAll('.auth-form input:not([type="checkbox"])').forEach(input => {
    input.addEventListener('input', () => {
      if (input.getAttribute('aria-invalid') === 'true') setError(input, messageFor(input));
      if (input.id === 'signup-password') {
        updateStrength(input.value);
        const confirm = document.getElementById('signup-confirm');
        if (confirm.value && confirm.getAttribute('aria-invalid') === 'true') setError(confirm, messageFor(confirm));
      }
    });
    input.addEventListener('blur', () => {
      if (input.value) setError(input, messageFor(input));
    });
  });

  function updateStrength(value) {
    const fill = document.getElementById('strength-fill');
    const label = document.getElementById('strength-label');
    let points = 0;
    if (value.length >= 8) points++;
    if (value.length >= 12) points++;
    if (/[0-9]/.test(value)) points++;
    if (/[^A-Za-z0-9]/.test(value)) points++;
    if (/[A-Z]/.test(value) && /[a-z]/.test(value)) points++;
    const levels = [0, 22, 42, 62, 82, 100];
    const colors = ['#e3e6ed', '#ec6974', '#ec9561', '#f3b449', '#55a77f', '#219667'];
    fill.style.width = `${value ? levels[points] : 0}%`;
    fill.style.backgroundColor = colors[points];
    label.textContent = !value ? 'Password strength' : points <= 2 ? 'Needs work' : points <= 3 ? 'Good' : 'Strong';
    label.style.color = value ? colors[points] : '#97a0ae';
  }

  function validateForm(form) {
    let valid = true;
    let firstInvalid = null;
    form.querySelectorAll('input:not([type="checkbox"])').forEach(input => {
      const msg = messageFor(input);
      setError(input, msg);
      if (msg) { valid = false; firstInvalid ??= input; }
    });
    if (form.id === 'signup-form') {
      const agreement = document.getElementById('demo-agreement');
      const agreeError = document.getElementById('demo-agreement-error');
      agreeError.textContent = agreement.checked ? '' : 'Please acknowledge the demo notice.';
      if (!agreement.checked) { valid = false; firstInvalid ??= agreement; }
    }
    firstInvalid?.focus();
    return valid;
  }

  document.getElementById('signin-form').addEventListener('submit', event => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!validateForm(form)) return;
    try {
      if (rememberEmail.checked) localStorage.setItem(KEY, signinEmail.value.trim());
      else localStorage.removeItem(KEY);
    } catch (_) { /* Private browsing may block localStorage. */ }
    showToast('Sign-in form validated. This is a UI demo, so no login request was sent.');
  });

  document.getElementById('signup-form').addEventListener('submit', event => {
    event.preventDefault();
    if (!validateForm(event.currentTarget)) return;
    showToast('Registration form validated. No account was created; connect a secure backend to enable registration.');
  });

  document.getElementById('recovery-form').addEventListener('submit', event => {
    event.preventDefault();
    if (!validateForm(event.currentTarget)) return;
    showToast('Recovery form validated. No reset email was sent because this is a UI-only demo.');
  });

  try {
    const saved = localStorage.getItem(KEY);
    if (saved) { signinEmail.value = saved; rememberEmail.checked = true; }
  } catch (_) { /* Local storage is optional. */ }
  document.getElementById('copyright-year').textContent = new Date().getFullYear();
})();
