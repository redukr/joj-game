# Frontend Refactoring Guide: Concrete Examples

This document provides ready-to-use code examples for implementing the recommended frontend improvements.

---

## 1. CSS Improvements

### 1.1 Design Tokens System

**File: `client-web/styles.css`** (add to top)

```css
:root {
  /* Color palette */
  --color-primary: #4f46e5;
  --color-primary-hover: #6366f1;
  --color-secondary: #0ea5e9;
  --color-success: #16a34a;
  --color-success-bg: #dcfce7;
  --color-success-text: #166534;
  --color-warning: #f97316;
  --color-warning-bg: #fef9c3;
  --color-warning-text: #854d0e;
  --color-error: #ef4444;
  --color-error-bg: #fef2f2;
  --color-error-text: #991b1b;
  --color-info: #0ea5e9;
  --color-info-bg: #e0f2fe;
  --color-info-text: #0c4a6e;
  
  --color-neutral-900: #0f172a;
  --color-neutral-800: #1a2332;
  --color-neutral-700: #334155;
  --color-neutral-600: #475569;
  --color-neutral-500: #64748b;
  --color-neutral-400: #cbd5e1;
  --color-neutral-300: #e2e8f0;
  --color-neutral-200: #f1f5f9;
  --color-neutral-100: #f8fafc;
  --color-neutral-50: #f5f7fb;
  
  --color-text-primary: #0f172a;
  --color-text-secondary: #475569;
  --color-text-muted: #64748b;
  --color-text-inverse: #f8fafc;
  
  --color-bg-primary: #f5f7fb;
  --color-bg-secondary: #fff;
  
  --color-border: #e2e8f0;
  --color-border-light: #f1f5f9;
  
  /* Spacing scale (8px base) */
  --space-2xs: 0.25rem;   /* 4px */
  --space-xs: 0.5rem;     /* 8px */
  --space-sm: 0.75rem;    /* 12px */
  --space-md: 1rem;       /* 16px */
  --space-lg: 1.25rem;    /* 20px */
  --space-xl: 1.5rem;     /* 24px */
  --space-2xl: 2rem;      /* 32px */
  --space-3xl: 2.5rem;    /* 40px */
  
  /* Border radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 999px;
  
  /* Shadow system */
  --shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 6px 18px rgba(15, 23, 42, 0.05);
  --shadow-lg: 0 20px 25px rgba(0, 0, 0, 0.15);
  --shadow-xl: 0 25px 50px rgba(0, 0, 0, 0.25);
  
  /* Typography scale */
  --font-family-base: "Inter", "Segoe UI", system-ui, -apple-system, sans-serif;
  --font-family-mono: "Menlo", "Monaco", "Courier New", monospace;
  --font-size-xs: 0.75rem;    /* 12px */
  --font-size-sm: 0.875rem;   /* 14px */
  --font-size-base: 1rem;     /* 16px */
  --font-size-lg: 1.125rem;   /* 18px */
  --font-size-xl: 1.25rem;    /* 20px */
  --font-size-2xl: 1.5rem;    /* 24px */
  --font-size-3xl: 1.875rem;  /* 30px */
  --font-size-4xl: 2.25rem;   /* 36px */
  
  --line-height-tight: 1.2;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;
  
  /* Z-index layers */
  --z-dropdown: 100;
  --z-modal: 1000;
  --z-toast: 9999;
  
  /* Transitions */
  --transition-fast: 0.1s ease;
  --transition-normal: 0.2s ease;
  --transition-slow: 0.3s ease;
}

/* Dark mode (future enhancement) */
@media (prefers-color-scheme: dark) {
  :root {
    --color-text-primary: #f8fafc;
    --color-text-secondary: #cbd5e1;
    --color-text-muted: #94a3b8;
    
    --color-bg-primary: #0f172a;
    --color-bg-secondary: #1a2332;
    
    --color-border: #334155;
    --color-border-light: #1a2332;
  }
}
```

### 1.2 Focus Visible Fix

**Add to `client-web/styles.css`:**

```css
/* Focus visible for all interactive elements */
button:focus-visible,
a:focus-visible,
input:focus-visible,
select:focus-visible,
textarea:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* Remove default browser outline, use our custom one */
button:focus,
a:focus,
input:focus,
select:focus,
textarea:focus {
  outline: none;
}

/* Enhanced button states */
button {
  position: relative;
  transition: transform var(--transition-fast), 
              box-shadow var(--transition-normal),
              background-color var(--transition-normal);
}

button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: var(--shadow-lg);
}

button:active:not(:disabled) {
  transform: translateY(0);
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

button:focus-visible {
  box-shadow: 0 0 0 4px var(--color-info-bg), var(--shadow-lg);
}
```

### 1.3 Toast Notification Styles

**Add to `client-web/styles.css`:**

```css
.toast-container {
  position: fixed;
  top: var(--space-lg);
  right: var(--space-lg);
  z-index: var(--z-toast);
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  max-width: 400px;
  pointer-events: none;
}

.toast-container.top-left {
  top: var(--space-lg);
  right: auto;
  left: var(--space-lg);
}

.toast {
  display: flex;
  align-items: flex-start;
  gap: var(--space-md);
  padding: var(--space-md) var(--space-lg);
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  animation: slideInRight 0.3s ease;
  pointer-events: auto;
}

.toast-icon {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
}

.toast-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-2xs);
}

.toast-title {
  font-weight: 600;
  color: var(--color-text-primary);
}

.toast-message {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.toast-close {
  flex-shrink: 0;
  background: transparent;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  padding: var(--space-xs);
  border-radius: var(--radius-md);
  transition: background-color var(--transition-fast);
}

.toast-close:hover {
  background: var(--color-neutral-100);
}

/* Toast variants */
.toast.toast-success {
  border-color: var(--color-success);
  background: linear-gradient(to right, var(--color-success-bg), var(--color-bg-secondary));
}

.toast.toast-success .toast-icon {
  background: var(--color-success-bg);
  color: var(--color-success);
}

.toast.toast-warning {
  border-color: var(--color-warning);
  background: linear-gradient(to right, var(--color-warning-bg), var(--color-bg-secondary));
}

.toast.toast-warning .toast-icon {
  background: var(--color-warning-bg);
  color: var(--color-warning);
}

.toast.toast-error {
  border-color: var(--color-error);
  background: linear-gradient(to right, var(--color-error-bg), var(--color-bg-secondary));
}

.toast.toast-error .toast-icon {
  background: var(--color-error-bg);
  color: var(--color-error);
}

.toast.toast-info {
  border-color: var(--color-info);
  background: linear-gradient(to right, var(--color-info-bg), var(--color-bg-secondary));
}

.toast.toast-info .toast-icon {
  background: var(--color-info-bg);
  color: var(--color-info);
}

@keyframes slideInRight {
  from {
    transform: translateX(120%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOutRight {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(120%);
    opacity: 0;
  }
}

.toast.toast-exit {
  animation: slideOutRight 0.3s ease;
}

/* Mobile adjustments */
@media (max-width: 640px) {
  .toast-container {
    max-width: calc(100vw - 2rem);
    left: var(--space-md);
    right: var(--space-md);
  }

  .toast {
    flex-direction: column;
  }
}
```

---

## 2. HTML Improvements

### 2.1 Semantic Form Example

**Replace in `client-web/index.html`:**

```html
<section class="card">
  <div class="card-header">
    <div>
      <h2 data-i18n="login.heading">Guest login</h2>
      <p class="subtitle" data-i18n="login.subheading">First step: register or log in to continue.</p>
    </div>
  </div>
  
  <form id="guestLoginForm" class="form" novalidate>
    <fieldset>
      <legend data-i18n="login.heading">Guest Login</legend>
      
      <div class="field">
        <label for="displayName" data-i18n="login.displayName">Display name</label>
        <input
          id="displayName"
          name="displayName"
          type="text"
          required
          minlength="3"
          maxlength="64"
          autocomplete="nickname"
          placeholder="Battle Planner"
          data-i18n-placeholder="login.displayNamePlaceholder"
          aria-invalid="false"
          aria-describedby="displayName-hint displayName-error"
        />
        <small id="displayName-hint" class="field-hint">
          <span data-i18n="form.hint.minLength">Minimum 3 characters</span>
        </small>
        <span id="displayName-error" class="field-error" role="alert" hidden></span>
      </div>

      <div class="field">
        <label for="loginPassword" data-i18n="login.password">Password</label>
        <input
          id="loginPassword"
          name="loginPassword"
          type="password"
          required
          minlength="6"
          autocomplete="current-password"
          placeholder="Enter a password"
          data-i18n-placeholder="login.passwordPlaceholder"
          aria-invalid="false"
          aria-describedby="loginPassword-hint loginPassword-error"
        />
        <small id="loginPassword-hint" class="field-hint">
          <span data-i18n="form.hint.minLength">Minimum 6 characters</span>
        </small>
        <span id="loginPassword-error" class="field-error" role="alert" hidden></span>
      </div>

      <div class="field-actions">
        <button id="registerGuest" type="button" data-i18n="login.register">
          Register
        </button>
        <button type="submit" data-i18n="login.submit">
          Sign in
        </button>
      </div>
    </fieldset>
  </form>

  <p class="hint" data-i18n="login.hint">
    After successful authentication you will be redirected to the game page
    to create or join rooms.
  </p>
  <div id="userInfo" class="muted"></div>
</section>
```

### 2.2 Semantic Table for Room List

**Replace room list rendering with:**

```html
<section class="card">
  <div class="card-header">
    <div>
      <h2 data-i18n="rooms.list.heading">Rooms</h2>
      <p class="subtitle" data-i18n="rooms.list.description">
        Create or join game rooms to start playing.
      </p>
    </div>
    <div class="actions">
      <button id="refreshRooms" type="button" aria-label="Refresh room list" data-i18n="rooms.list.refresh">
        Refresh
      </button>
    </div>
  </div>

  <div class="table-container">
    <table id="roomsTable" class="rooms-table">
      <caption class="sr-only">List of available game rooms</caption>
      <thead>
        <tr>
          <th scope="col" data-i18n="rooms.meta.name">Name</th>
          <th scope="col" data-i18n="rooms.meta.code">Code</th>
          <th scope="col" data-i18n="rooms.meta.players">Players</th>
          <th scope="col" data-i18n="rooms.meta.status">Status</th>
          <th scope="col" data-i18n="rooms.meta.action">Action</th>
        </tr>
      </thead>
      <tbody id="roomsList">
        <!-- Rows injected by JS -->
      </tbody>
    </table>
  </div>

  <template id="roomRowTemplate">
    <tr class="room-row">
      <td class="room-name"></td>
      <td class="room-code"><code></code></td>
      <td class="room-players"></td>
      <td class="room-status"><span class="badge"></span></td>
      <td class="room-action"><button type="button" class="join-button ghost"></button></td>
    </tr>
  </template>
</section>

<style>
  .table-container {
    overflow-x: auto;
  }

  .rooms-table {
    width: 100%;
    border-collapse: collapse;
    font-size: var(--font-size-sm);
  }

  .rooms-table thead {
    background: var(--color-neutral-50);
    border-bottom: 2px solid var(--color-border);
  }

  .rooms-table th {
    padding: var(--space-md);
    text-align: left;
    font-weight: 600;
    color: var(--color-text-primary);
  }

  .rooms-table td {
    padding: var(--space-md);
    border-bottom: 1px solid var(--color-border);
  }

  .room-row:hover {
    background: var(--color-neutral-50);
  }

  .room-code code {
    background: var(--color-neutral-100);
    padding: var(--space-2xs) var(--space-xs);
    border-radius: var(--radius-md);
    font-family: var(--font-family-mono);
    font-size: 0.85em;
  }

  .badge {
    display: inline-block;
    padding: var(--space-2xs) var(--space-sm);
    border-radius: var(--radius-full);
    font-weight: 600;
    font-size: 0.75rem;
  }

  .badge.active {
    background: var(--color-success-bg);
    color: var(--color-success);
  }

  .badge.archived {
    background: var(--color-warning-bg);
    color: var(--color-warning);
  }
</style>
```

---

## 3. JavaScript Improvements

### 3.1 Toast Notification System

**Create: `client-web/modules/notifications.js`**

```javascript
export class NotificationManager {
  constructor(container = document.body) {
    this.container = container;
    this.toasts = new Map();
    this.createContainer();
  }

  createContainer() {
    this.toastContainer = document.createElement('div');
    this.toastContainer.className = 'toast-container';
    this.toastContainer.setAttribute('aria-live', 'polite');
    this.toastContainer.setAttribute('aria-atomic', 'false');
    this.container.appendChild(this.toastContainer);
  }

  show(message, options = {}) {
    const {
      type = 'info',
      title = '',
      duration = 5000,
      closeable = true,
      position = 'top-right',
      action = null
    } = options;

    // Update container position
    this.toastContainer.className = `toast-container ${position.replace('-', '-')}`;

    // Create toast element
    const id = `toast-${Date.now()}-${Math.random()}`;
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', 'status');
    toast.id = id;

    // Icon
    const icon = document.createElement('div');
    icon.className = 'toast-icon';
    icon.innerHTML = this.getIcon(type);
    toast.appendChild(icon);

    // Content
    const content = document.createElement('div');
    content.className = 'toast-content';
    if (title) {
      const titleEl = document.createElement('div');
      titleEl.className = 'toast-title';
      titleEl.textContent = title;
      content.appendChild(titleEl);
    }
    const messageEl = document.createElement('div');
    messageEl.className = 'toast-message';
    messageEl.textContent = message;
    content.appendChild(messageEl);
    toast.appendChild(content);

    // Close button
    if (closeable) {
      const closeBtn = document.createElement('button');
      closeBtn.type = 'button';
      closeBtn.className = 'toast-close';
      closeBtn.setAttribute('aria-label', 'Close notification');
      closeBtn.innerHTML = '✕';
      closeBtn.addEventListener('click', () => this.remove(id));
      toast.appendChild(closeBtn);
    }

    this.toastContainer.appendChild(toast);
    this.toasts.set(id, { element: toast, timeout: null });

    // Auto-remove after duration
    if (duration) {
      const timeout = setTimeout(() => this.remove(id), duration);
      this.toasts.get(id).timeout = timeout;
    }

    return id;
  }

  remove(id) {
    const toast = this.toasts.get(id);
    if (!toast) return;

    const { element, timeout } = toast;
    if (timeout) clearTimeout(timeout);

    element.classList.add('toast-exit');
    setTimeout(() => {
      element.remove();
      this.toasts.delete(id);
    }, 300);
  }

  success(message, options = {}) {
    return this.show(message, { ...options, type: 'success' });
  }

  error(message, options = {}) {
    return this.show(message, { ...options, type: 'error', duration: 7000 });
  }

  warning(message, options = {}) {
    return this.show(message, { ...options, type: 'warning' });
  }

  info(message, options = {}) {
    return this.show(message, { ...options, type: 'info' });
  }

  clear() {
    this.toasts.forEach((_, id) => this.remove(id));
  }

  getIcon(type) {
    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ'
    };
    return icons[type] || '○';
  }
}

// Usage:
const notify = new NotificationManager();
notify.success('Room created!', { title: 'Success', duration: 4000 });
notify.error('Login failed: Invalid credentials', { title: 'Error' });
```

### 3.2 Form Validation System

**Create: `client-web/modules/validation.js`**

```javascript
export class FormValidator {
  constructor(form) {
    this.form = form;
    this.errors = new Map();
  }

  addRule(fieldName, rule) {
    if (!this.rules) this.rules = {};
    if (!this.rules[fieldName]) this.rules[fieldName] = [];
    this.rules[fieldName].push(rule);
  }

  validate() {
    this.errors.clear();

    if (!this.rules) return true;

    for (const [fieldName, rules] of Object.entries(this.rules)) {
      const input = this.form.elements[fieldName];
      if (!input) continue;

      for (const rule of rules) {
        const result = rule.validate(input.value);
        if (!result.valid) {
          if (!this.errors.has(fieldName)) {
            this.errors.set(fieldName, []);
          }
          this.errors.get(fieldName).push(result.message);
        }
      }
    }

    return this.errors.size === 0;
  }

  getErrors(fieldName) {
    return this.errors.get(fieldName) || [];
  }

  displayErrors() {
    // Clear all previous errors
    this.form.querySelectorAll('.field-error').forEach(el => {
      el.hidden = true;
      el.textContent = '';
    });
    this.form.querySelectorAll('[aria-invalid]').forEach(el => {
      el.setAttribute('aria-invalid', 'false');
    });

    // Display new errors
    for (const [fieldName, messages] of this.errors) {
      const input = this.form.elements[fieldName];
      if (!input) continue;

      const errorEl = this.form.querySelector(`#${fieldName}-error`);
      if (errorEl) {
        errorEl.hidden = false;
        errorEl.textContent = messages[0]; // Show first error
      }

      input.setAttribute('aria-invalid', 'true');
    }
  }
}

// Predefined rules
export const rules = {
  required: (fieldName = 'This field') => ({
    validate: (value) => ({
      valid: Boolean(value?.trim()),
      message: `${fieldName} is required`
    })
  }),

  minLength: (min, fieldName = 'This field') => ({
    validate: (value) => ({
      valid: value?.length >= min,
      message: `${fieldName} must be at least ${min} characters`
    })
  }),

  maxLength: (max, fieldName = 'This field') => ({
    validate: (value) => ({
      valid: value?.length <= max,
      message: `${fieldName} must not exceed ${max} characters`
    })
  }),

  email: () => ({
    validate: (value) => ({
      valid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      message: 'Please enter a valid email address'
    })
  }),

  range: (min, max, fieldName = 'This field') => ({
    validate: (value) => {
      const num = parseInt(value, 10);
      return {
        valid: !isNaN(num) && num >= min && num <= max,
        message: `${fieldName} must be between ${min} and ${max}`
      };
    }
  }),

  pattern: (pattern, message = 'Invalid format') => ({
    validate: (value) => ({
      valid: pattern.test(value),
      message
    })
  })
};

// Usage:
const validator = new FormValidator(form);
validator.addRule('displayName', rules.required('Display name'));
validator.addRule('displayName', rules.minLength(3, 'Display name'));
validator.addRule('loginPassword', rules.required('Password'));
validator.addRule('loginPassword', rules.minLength(6, 'Password'));

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (validator.validate()) {
    validator.displayErrors();
    return;
  }
  // Submit form
});
```

### 3.3 Module Structure Example

**Create: `client-web/modules/api.js`**

```javascript
export class ApiClient {
  constructor(baseUrl, onUnauthorized) {
    this.baseUrl = baseUrl || 'http://localhost:8000';
    this.onUnauthorized = onUnauthorized || (() => {});
    this.authToken = null;
  }

  setAuthToken(token) {
    this.authToken = token;
  }

  async fetch(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...(this.authToken && { Authorization: `Bearer ${this.authToken}` }),
      ...options.headers
    };

    const response = await fetch(url, {
      ...options,
      headers
    });

    if (response.status === 401) {
      this.onUnauthorized();
      throw new ApiError(401, 'Unauthorized');
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new ApiError(response.status, response.statusText, errorText);
    }

    if (response.status === 204) {
      return null; // No content
    }

    return response.json();
  }

  // Auth endpoints
  login(displayName, password) {
    return this.fetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        provider: 'guest',
        display_name: displayName,
        password
      })
    });
  }

  logout() {
    return this.fetch('/auth/logout', { method: 'POST' });
  }

  // Rooms endpoints
  getRooms(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.fetch(`/rooms?${params}`);
  }

  createRoom(name, maxPlayers, maxSpectators) {
    return this.fetch('/rooms', {
      method: 'POST',
      body: JSON.stringify({
        name,
        max_players: maxPlayers,
        max_spectators: maxSpectators
      })
    });
  }

  joinRoom(code, asSpectator = false) {
    return this.fetch(`/rooms/${code}/join`, {
      method: 'POST',
      body: JSON.stringify({ as_spectator: asSpectator })
    });
  }

  // Cards endpoints
  getCards(limit = 100, offset = 0) {
    return this.fetch(`/cards?limit=${limit}&offset=${offset}`);
  }

  // Admin endpoints
  verifyAdmin(token) {
    return this.fetch('/admin/verify', {
      headers: { 'X-Admin-Token': token }
    });
  }

  getAdminCards(token, limit = 100, offset = 0) {
    return this.fetch(`/admin/cards?limit=${limit}&offset=${offset}`, {
      headers: { 'X-Admin-Token': token }
    });
  }

  createCard(token, cardData) {
    return this.fetch('/admin/cards', {
      method: 'POST',
      headers: { 'X-Admin-Token': token },
      body: JSON.stringify(cardData)
    });
  }

  deleteCard(token, cardId) {
    return this.fetch(`/admin/cards/${cardId}`, {
      method: 'DELETE',
      headers: { 'X-Admin-Token': token }
    });
  }
}

export class ApiError extends Error {
  constructor(status, statusText, details = '') {
    super(`${status}: ${statusText}`);
    this.name = 'ApiError';
    this.status = status;
    this.statusText = statusText;
    this.details = details;
  }

  isClientError() {
    return this.status >= 400 && this.status < 500;
  }

  isServerError() {
    return this.status >= 500;
  }

  isNetworkError() {
    return this.status === 0;
  }
}
```

### 3.4 Main Entry Point

**Refactored: `client-web/main.js`** (300 lines instead of 1776)

```javascript
import { NotificationManager } from './modules/notifications.js';
import { FormValidator, rules } from './modules/validation.js';
import { ApiClient, ApiError } from './modules/api.js';

// App state
const appState = {
  authToken: localStorage.getItem('joj-auth-token'),
  user: JSON.parse(localStorage.getItem('joj-user') || 'null'),
  currentRoom: localStorage.getItem('joj-room-code'),
  language: localStorage.getItem('joj-language') || 'en'
};

// Utilities
const notify = new NotificationManager();
const api = new ApiClient('http://localhost:8000', handleUnauthorized);

// Set auth token if exists
if (appState.authToken) {
  api.setAuthToken(appState.authToken);
}

// Event handlers
async function handleLogin(e) {
  e.preventDefault();
  const form = e.target;
  const displayName = form.elements.displayName.value;
  const password = form.elements.loginPassword.value;

  const validator = new FormValidator(form);
  validator.addRule('displayName', rules.required('Display name'));
  validator.addRule('displayName', rules.minLength(3, 'Display name'));
  validator.addRule('loginPassword', rules.required('Password'));
  validator.addRule('loginPassword', rules.minLength(6, 'Password'));

  if (!validator.validate()) {
    validator.displayErrors();
    return;
  }

  try {
    const result = await api.login(displayName, password);
    appState.authToken = result.access_token;
    appState.user = result.user;
    api.setAuthToken(appState.authToken);
    
    localStorage.setItem('joj-auth-token', appState.authToken);
    localStorage.setItem('joj-user', JSON.stringify(appState.user));
    
    notify.success(`Logged in as ${appState.user.display_name}`);
    form.reset();
    
    // Redirect or update UI
    await loadRooms();
  } catch (error) {
    notify.error(error.message);
  }
}

async function handleCreateRoom(e) {
  e.preventDefault();
  const form = e.target;
  
  if (!appState.authToken) {
    notify.error('Please log in first');
    return;
  }

  const validator = new FormValidator(form);
  validator.addRule('roomName', rules.required('Room name'));
  validator.addRule('maxPlayers', rules.range(2, 6, 'Max players'));

  if (!validator.validate()) {
    validator.displayErrors();
    return;
  }

  try {
    const room = await api.createRoom(
      form.elements.roomName.value,
      parseInt(form.elements.maxPlayers.value),
      parseInt(form.elements.maxSpectators.value)
    );
    
    appState.currentRoom = room.code;
    localStorage.setItem('joj-room-code', appState.currentRoom);
    
    notify.success(`Created room: ${room.name}`);
    form.reset();
    await loadRooms();
  } catch (error) {
    notify.error(`Failed to create room: ${error.message}`);
  }
}

async function loadRooms() {
  try {
    const rooms = await api.getRooms();
    renderRooms(rooms);
    notify.info(`Loaded ${rooms.length} rooms`);
  } catch (error) {
    notify.error(`Failed to load rooms: ${error.message}`);
  }
}

function renderRooms(rooms) {
  const tbody = document.querySelector('#roomsList');
  if (!tbody) return;

  tbody.innerHTML = '';
  rooms.forEach(room => {
    const row = document.createElement('tr');
    row.className = 'room-row';
    if (room.code === appState.currentRoom) {
      row.classList.add('active');
    }

    row.innerHTML = `
      <td class="room-name">${room.name}</td>
      <td class="room-code"><code>${room.code}</code></td>
      <td class="room-players">${room.player_count}/${room.max_players}</td>
      <td class="room-status"><span class="badge ${room.status}">${room.status}</span></td>
      <td class="room-action">
        <button type="button" class="join-button ghost" data-code="${room.code}">
          ${room.is_joined ? 'Joined' : 'Join'}
        </button>
      </td>
    `;

    if (!room.is_joined && room.is_joinable) {
      const btn = row.querySelector('.join-button');
      btn.addEventListener('click', () => joinRoom(room.code));
    } else {
      row.querySelector('.join-button').disabled = true;
    }

    tbody.appendChild(row);
  });
}

async function joinRoom(code) {
  try {
    await api.joinRoom(code);
    appState.currentRoom = code;
    localStorage.setItem('joj-room-code', code);
    notify.success(`Joined room: ${code}`);
    await loadRooms();
  } catch (error) {
    notify.error(`Failed to join room: ${error.message}`);
  }
}

function handleUnauthorized() {
  appState.authToken = null;
  appState.user = null;
  localStorage.removeItem('joj-auth-token');
  localStorage.removeItem('joj-user');
  notify.error('Session expired. Please log in again.');
  window.location.href = '/index.html';
}

// Initialize
document.getElementById('guestLoginForm')?.addEventListener('submit', handleLogin);
document.getElementById('roomForm')?.addEventListener('submit', handleCreateRoom);
document.getElementById('refreshRooms')?.addEventListener('click', loadRooms);

// Load initial data
if (appState.authToken) {
  loadRooms();
}
```

---

## 4. CSS for Forms & Fields

**Add to `client-web/styles.css`:**

```css
.form {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

fieldset {
  border: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

legend {
  padding: 0;
  margin: 0 0 var(--space-md) 0;
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-text-primary);
}

.field {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.field label {
  font-weight: 600;
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
}

.field input,
.field select,
.field textarea {
  padding: var(--space-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  font-family: inherit;
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
  transition: border-color var(--transition-normal), 
              box-shadow var(--transition-normal);
}

.field input:focus,
.field select:focus,
.field textarea:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-info-bg);
}

.field input[aria-invalid="true"],
.field select[aria-invalid="true"],
.field textarea[aria-invalid="true"] {
  border-color: var(--color-error);
}

.field input[aria-invalid="true"]:focus {
  box-shadow: 0 0 0 3px var(--color-error-bg);
}

.field-hint {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.field-error {
  font-size: var(--font-size-sm);
  color: var(--color-error);
  display: block;
}

.field-actions {
  display: flex;
  gap: var(--space-md);
  margin-top: var(--space-md);
}

.field-actions button {
  flex: 1;
}
```

---

## Implementation Checklist

- [ ] Add design tokens to CSS
- [ ] Add toast notification system
- [ ] Add form validation module
- [ ] Add API client module
- [ ] Update HTML to use semantic `<table>` for lists
- [ ] Update HTML forms with proper fieldsets & legends
- [ ] Add focus-visible CSS
- [ ] Update main.js to import modules
- [ ] Test forms with validation
- [ ] Test toast notifications
- [ ] Test API error handling
- [ ] Keyboard navigation testing
- [ ] Screen reader testing

---

## Next Steps

1. **Pick one file** (e.g., index.html) and implement all improvements
2. **Test thoroughly** (manual testing + automated tests)
3. **Refactor other pages** (main.html, admin.html, management.html)
4. **Merge and deploy**

For questions or issues, refer to the main `FRONTEND_ANALYSIS.md` document.
