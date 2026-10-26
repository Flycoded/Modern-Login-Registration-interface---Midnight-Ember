# Flycoded Account — Midnight & Ember UI

A premium, mobile-responsive login, registration, and password recovery **frontend demo** inspired by Flycoded brand colors. This is a new design, not source code from any third party.

## Files
- `index.html` — Page structure, local SVG icons and forms
- `style.css` — Responsive navy + orange design
- `script.js` — View switching, input validation, password visibility and strength feedback
- `preview.html` — Complete self-contained version, including all HTML/CSS/JS

## Preview on Android (Acode)
1. Download and unzip the project, or download `preview.html` alone.
2. In Acode, open `preview.html`.
3. Use Acode's Preview command (or open the file in a mobile browser).
4. Switch between Sign in, Create account, and Forgot password. Test passwords and inline validation.

## Preview on desktop
Open `preview.html` in Chrome/Firefox, or open `index.html` with a local web server. No compilation or dependencies required.

## What works
- Sign in ↔ Sign up ↔ Password recovery navigation
- Required-field and email validation
- Password min. 8 chars with number + symbol, plus confirmation
- Password strength indicator
- Reveal/hide password buttons
- Save **email only** when 'Remember my email' is checked (localStorage); password is never stored
- Form feedback toast and responsive layouts

## Important security limitation
This is **frontend only**. It does not register users, authenticate passwords, store records, or send password reset emails. Submitting a valid form displays an explicit demo-only message. Integrate with a secure backend (e.g., PHP 8.2 + MySQL) for actual accounts; validate server-side, hash passwords securely, use HTTPS, and protect against CSRF and brute force.

© 2026 Flycoded Network Enterprise. Built as a custom design demo.
