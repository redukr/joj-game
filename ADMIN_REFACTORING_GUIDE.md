# Admin Interface Refactoring Guide - Ready-to-Use Code

This guide provides drop-in replacement code for all critical issues. Each section is self-contained and can be implemented independently.

---

## 1. Fix Admin Token Idle Timer (Critical)

**Problem:** Token resets on every user input, never actually expires  
**Fix:** Implement true inactivity detection  
**Files:** admin-web/main.js  
**Time:** 30 minutes

### Replace Lines 736-745

**OLD CODE:**
```javascript
function resetAdminTokenIdleTimer() {
  clearAdminTokenTimer();
  const token = getAdminToken();
  if (!token) return;
  adminTokenIdleTimer = setTimeout(() => {
    clearAdminToken("messages.adminTokenExpired");
  }, ADMIN_TOKEN_IDLE_MS);
}
```

**NEW CODE:**
```javascript
let lastAdminActivity = null;
let adminTokenExpiryChecker = null;

function resetAdminTokenIdleTimer() {
  // Only update last activity timestamp
  // Don't reset interval timer
  lastAdminActivity = Date.now();
}

function startAdminTokenExpiryCheck() {
  clearAdminTokenTimer();
  const token = getAdminToken();
  if (!token) return;
  
  // Reset activity timestamp when token set
  lastAdminActivity = Date.now();
  
  // Check expiry every minute instead of resetting timer constantly
  adminTokenExpiryChecker = setInterval(() => {
    const token = getAdminToken();
    if (!token) {
      clearInterval(adminTokenExpiryChecker);
      return;
    }
    
    const idleTime = Date.now() - (lastAdminActivity || Date.now());
    if (idleTime >= ADMIN_TOKEN_IDLE_MS) {
      clearAdminToken("messages.adminTokenExpired");
      clearInterval(adminTokenExpiryChecker);
    }
  }, 60000); // Check every minute
}

function clearAdminTokenTimer() {
  if (adminTokenIdleTimer) {
    clearTimeout(adminTokenIdleTimer);
    adminTokenIdleTimer = null;
  }
  if (adminTokenExpiryChecker) {
    clearInterval(adminTokenExpiryChecker);
    adminTokenExpiryChecker = null;
  }
}
```

### Update setAdminToken() - Line 803

**OLD CODE:**
```javascript
function setAdminToken(value, messageKey = null) {
  if (!adminTokenInput) return;
  const trimmed = value?.trim() || "";
  adminTokenInput.value = trimmed;
  if (trimmed) {
    sessionStorage.setItem(STORAGE_KEYS.adminToken, trimmed);
    setFieldError(adminTokenError, "");
    resetAdminTokenIdleTimer();
  } else {
    sessionStorage.removeItem(STORAGE_KEYS.adminToken);
    clearAdminTokenTimer();
  }
  syncAdminUi();
  syncNavLinks();
  if (messageKey) {
    log(t(messageKey));
  }
}
```

**NEW CODE:**
```javascript
function setAdminToken(value, messageKey = null) {
  if (!adminTokenInput) return;
  const trimmed = value?.trim() || "";
  adminTokenInput.value = trimmed;
  if (trimmed) {
    sessionStorage.setItem(STORAGE_KEYS.adminToken, trimmed);
    setFieldError(adminTokenError, "");
    startAdminTokenExpiryCheck(); // ← Changed from resetAdminTokenIdleTimer
  } else {
    sessionStorage.removeItem(STORAGE_KEYS.adminToken);
    clearAdminTokenTimer();
  }
  syncAdminUi();
  syncNavLinks();
  if (messageKey) {
    log(t(messageKey));
  }
}
```

### Event Listeners - Line 2160

**OLD CODE:**
```javascript
["pointerdown", "keydown", "mousemove"].forEach((eventName) => {
  document.addEventListener(eventName, resetAdminTokenIdleTimer, { passive: true });
});
```

**NEW CODE:**
```javascript
// Still track activity, but don't reset the expiry timer
["pointerdown", "keydown", "mousemove", "click"].forEach((eventName) => {
  document.addEventListener(eventName, () => {
    if (getAdminToken()) {
      resetAdminTokenIdleTimer(); // Just update lastAdminActivity timestamp
    }
  }, { passive: true });
});
```

### Testing

```javascript
// Test script to verify:
console.log("1. Set admin token: should start 15-min timer");
setAdminToken("test-token");

console.log("2. Generate activity (click): should NOT reset timer");
// Simulate clicks - idleTime should increase, not reset to 0

console.log("3. Wait 15 minutes with no activity: should auto-expire");
// Mock or skip this in testing - verify interval runs

console.log("4. Clear token: should stop all timers");
clearAdminToken();
```

---

## 2. Add Card Resource Validation (Critical)

**Problem:** Card resources accept invalid values (floats, out-of-range, etc.)  
**Fix:** Validate -10 to +10 integer range before submission  
**Files:** admin-web/main.js  
**Time:** 45 minutes

### Create New validation.js

Create **admin-web/validation.js:**

```javascript
/**
 * Form validation utilities for admin interface
 */

const CardValidation = {
  RESOURCE_RANGE: { min: -10, max: 10 },
  NAME_LIMITS: { min: 1, max: 255 },
  DESC_LIMITS: { min: 1, max: 1000 },
  CATEGORY_LIMITS: { min: 0, max: 100 },
  
  validateName(value) {
    const trimmed = value?.trim() || "";
    if (!trimmed) return { valid: false, error: "Name is required" };
    if (trimmed.length > this.NAME_LIMITS.max) {
      return { 
        valid: false, 
        error: `Name must be ${this.NAME_LIMITS.max} characters or less` 
      };
    }
    return { valid: true, value: trimmed };
  },
  
  validateDescription(value) {
    const trimmed = value?.trim() || "";
    if (!trimmed) return { valid: false, error: "Description is required" };
    if (trimmed.length > this.DESC_LIMITS.max) {
      return { 
        valid: false, 
        error: `Description must be ${this.DESC_LIMITS.max} characters or less` 
      };
    }
    return { valid: true, value: trimmed };
  },
  
  validateCategory(value) {
    const trimmed = value?.trim() || "";
    if (trimmed && trimmed.length > this.CATEGORY_LIMITS.max) {
      return { 
        valid: false, 
        error: `Category must be ${this.CATEGORY_LIMITS.max} characters or less` 
      };
    }
    return { valid: true, value: trimmed || null };
  },
  
  validateResource(fieldName, value) {
    const num = Number.parseInt(value?.trim() || "0", 10);
    
    if (Number.isNaN(num)) {
      return { 
        valid: false, 
        error: `${fieldName} must be a whole number` 
      };
    }
    
    if (num < this.RESOURCE_RANGE.min || num > this.RESOURCE_RANGE.max) {
      return { 
        valid: false, 
        error: `${fieldName} must be between ${this.RESOURCE_RANGE.min} and ${this.RESOURCE_RANGE.max}` 
      };
    }
    
    return { valid: true, value: num };
  },
  
  validateCard(cardData) {
    const errors = [];
    
    // Validate name
    const nameResult = this.validateName(cardData.name);
    if (!nameResult.valid) errors.push(nameResult.error);
    
    // Validate description
    const descResult = this.validateDescription(cardData.description);
    if (!descResult.valid) errors.push(descResult.error);
    
    // Validate category (optional)
    const catResult = this.validateCategory(cardData.category);
    if (!catResult.valid) errors.push(catResult.error);
    
    // Validate resources
    const resourceKeys = ["time", "reputation", "discipline", "documents", "technology"];
    resourceKeys.forEach((key) => {
      const result = this.validateResource(key, cardData[key]);
      if (!result.valid) errors.push(result.error);
    });
    
    return {
      valid: errors.length === 0,
      errors,
      data: {
        name: nameResult.value,
        description: descResult.value,
        category: catResult.value,
        time: cardData.time ? Number.parseInt(cardData.time, 10) : 0,
        reputation: cardData.reputation ? Number.parseInt(cardData.reputation, 10) : 0,
        discipline: cardData.discipline ? Number.parseInt(cardData.discipline, 10) : 0,
        documents: cardData.documents ? Number.parseInt(cardData.documents, 10) : 0,
        technology: cardData.technology ? Number.parseInt(cardData.technology, 10) : 0,
      }
    };
  }
};

const DeckValidation = {
  NAME_LIMITS: { min: 1, max: 255 },
  DESC_LIMITS: { min: 0, max: 500 },
  
  validateName(value) {
    const trimmed = value?.trim() || "";
    if (!trimmed) return { valid: false, error: "Deck name is required" };
    if (trimmed.length > this.NAME_LIMITS.max) {
      return { 
        valid: false, 
        error: `Name must be ${this.NAME_LIMITS.max} characters or less` 
      };
    }
    return { valid: true, value: trimmed };
  },
  
  validateDescription(value) {
    const trimmed = value?.trim() || "";
    if (trimmed.length > this.DESC_LIMITS.max) {
      return { 
        valid: false, 
        error: `Description must be ${this.DESC_LIMITS.max} characters or less` 
      };
    }
    return { valid: true, value: trimmed || null };
  },
  
  parseCardIds(input) {
    const trimmed = input?.trim() || "";
    if (!trimmed) return { valid: true, value: [] };
    
    const ids = trimmed
      .split(",")
      .map(s => s.trim())
      .filter(s => s.length > 0);
    
    const errors = [];
    const validIds = [];
    
    ids.forEach((id, idx) => {
      const num = Number.parseInt(id, 10);
      if (Number.isNaN(num)) {
        errors.push(`Card ID at position ${idx + 1} ("${id}") is not a valid number`);
      } else if (num <= 0) {
        errors.push(`Card ID at position ${idx + 1} must be positive (got ${num})`);
      } else {
        validIds.push(num);
      }
    });
    
    return { 
      valid: errors.length === 0, 
      value: validIds,
      errors
    };
  },
  
  validateDeck(deckData) {
    const errors = [];
    
    // Validate name
    const nameResult = this.validateName(deckData.name);
    if (!nameResult.valid) errors.push(nameResult.error);
    
    // Validate description (optional)
    const descResult = this.validateDescription(deckData.description);
    if (!descResult.valid) errors.push(descResult.error);
    
    // Validate card IDs
    const idResult = this.parseCardIds(deckData.cardIds);
    if (!idResult.valid) errors.push(...idResult.errors);
    
    return {
      valid: errors.length === 0,
      errors,
      data: {
        name: nameResult.value,
        description: descResult.value,
        card_ids: idResult.value || []
      }
    };
  }
};

const DeckImportValidation = {
  validatePayload(payload) {
    const errors = [];
    
    // Check structure
    if (!payload || typeof payload !== 'object') {
      return { valid: false, errors: ["Invalid JSON: expected an object"] };
    }
    
    if (!payload.deck || typeof payload.deck !== 'object') {
      errors.push("Missing 'deck' object in JSON");
    } else {
      // Validate deck object
      const deckValidation = DeckValidation.validateName(payload.deck.name);
      if (!deckValidation.valid) errors.push(deckValidation.error);
      
      if (!Array.isArray(payload.deck.card_ids)) {
        errors.push("'deck.card_ids' must be an array of card IDs");
      } else {
        const invalidIds = payload.deck.card_ids.filter(id => !Number.isInteger(id) || id <= 0);
        if (invalidIds.length > 0) {
          errors.push(`Found ${invalidIds.length} invalid card IDs in deck.card_ids`);
        }
      }
    }
    
    if (!Array.isArray(payload.cards)) {
      errors.push("'cards' must be an array");
    } else {
      payload.cards.forEach((card, idx) => {
        if (!card.name) errors.push(`Card[${idx}] missing required 'name'`);
        if (!card.description) errors.push(`Card[${idx}] missing required 'description'`);
        if (typeof card.name !== 'string') errors.push(`Card[${idx}] 'name' must be a string`);
        if (typeof card.description !== 'string') errors.push(`Card[${idx}] 'description' must be a string`);
      });
    }
    
    return { valid: errors.length === 0, errors };
  }
};
```

### Update createCard() - Line 1902

**OLD CODE:**
```javascript
async function createCard(event) {
  event.preventDefault();
  setFieldError(cardFormError, "");
  const name = document.getElementById("cardName").value.trim();
  const description = document.getElementById("cardDescription").value.trim();
  const category = document.getElementById("cardCategory").value.trim();
  const resourcePayload = {};
  RESOURCE_KEYS.forEach((key) => {
    const input = document.getElementById(
      `card${key.charAt(0).toUpperCase()}${key.slice(1)}`
    );
    const value = Number.parseInt(input?.value, 10);
    resourcePayload[key] = Number.isNaN(value) ? 0 : value;
  });
  if (!name || !description) {
    const message = t("messages.cardFieldsRequired");
    setFieldError(cardFormError, message);
    log(message, true);
    return;
  }
  // ... rest of function
}
```

**NEW CODE:**
```javascript
async function createCard(event) {
  event.preventDefault();
  setFieldError(cardFormError, "");
  
  // Gather form data
  const cardData = {
    name: document.getElementById("cardName").value,
    description: document.getElementById("cardDescription").value,
    category: document.getElementById("cardCategory").value,
    time: document.getElementById("cardTime").value,
    reputation: document.getElementById("cardReputation").value,
    discipline: document.getElementById("cardDiscipline").value,
    documents: document.getElementById("cardDocuments").value,
    technology: document.getElementById("cardTechnology").value,
  };
  
  // Validate using CardValidation module
  const validation = CardValidation.validateCard(cardData);
  if (!validation.valid) {
    const message = validation.errors.join("; ");
    setFieldError(cardFormError, message);
    log(message, true);
    return;
  }
  
  // Validation passed, use validated data
  const resourcePayload = validation.data;
  
  try {
    const response = await fetch(apiUrl("/admin/cards"), {
      method: "POST",
      headers: adminHeaders(),
      body: JSON.stringify({
        name: resourcePayload.name,
        description: resourcePayload.description,
        category: resourcePayload.category,
        ...Object.fromEntries(
          RESOURCE_KEYS.map(key => [key, resourcePayload[key]])
        ),
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(
        t("messages.createCardFailed", { status: response.status, detail: errText })
      );
    }

    const card = await response.json();
    setFieldError(cardFormError, ""); // Explicitly clear on success
    log(t("messages.cardCreated", { name: card.name, id: card.id }));
    cardForm.reset();
    await loadCards();
  } catch (error) {
    setFieldError(cardFormError, error.message);
    log(error.message, true);
  }
}
```

### Include validation.js in admin.html

Add to **admin.html** before main.js:

```html
<!-- Add before </head> or before main.js -->
<script src="validation.js"></script>
```

---

## 3. Add Deck JSON Import Validation (Critical)

**Problem:** Deck import accepts any JSON, even invalid schemas  
**Fix:** Validate JSON structure before submission  
**Files:** admin-web/main.js (uses validation.js from above)  
**Time:** 20 minutes

### Update importDeck() - Line 2060

**OLD CODE:**
```javascript
async function importDeck() {
  if (!deckImportPayload) return;
  setFieldError(deckImportError, "");
  const raw = deckImportPayload.value.trim();
  if (!raw) {
    const message = t("messages.importDeckInvalid");
    setFieldError(deckImportError, message);
    log(message, true);
    return;
  }

  let payload;
  try {
    payload = JSON.parse(raw);
  } catch (error) {
    log(t("messages.importDeckInvalid"), true);
    return;
  }

  try {
    const targetId = deckImportTarget?.value || "";
    const endpoint = targetId
      ? `/admin/decks/${targetId}/import`
      : "/admin/decks/import";
    const response = await fetch(apiUrl(endpoint), {
      method: "POST",
      headers: adminHeaders(),
      body: JSON.stringify(payload),
    });
    // ... rest
  }
}
```

**NEW CODE:**
```javascript
async function importDeck() {
  if (!deckImportPayload) return;
  setFieldError(deckImportError, "");
  const raw = deckImportPayload.value.trim();
  
  if (!raw) {
    const message = t("messages.importDeckInvalid");
    setFieldError(deckImportError, message);
    log(message, true);
    return;
  }

  // Parse JSON
  let payload;
  try {
    payload = JSON.parse(raw);
  } catch (error) {
    const message = `Invalid JSON: ${error.message}`;
    setFieldError(deckImportError, message);
    log(message, true);
    return;
  }

  // Validate schema
  const validation = DeckImportValidation.validatePayload(payload);
  if (!validation.valid) {
    const message = validation.errors.join("; ");
    setFieldError(deckImportError, message);
    log(message, true);
    return;
  }

  try {
    const targetId = deckImportTarget?.value || "";
    const endpoint = targetId
      ? `/admin/decks/${targetId}/import`
      : "/admin/decks/import";
    const response = await fetch(apiUrl(endpoint), {
      method: "POST",
      headers: adminHeaders(),
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      const errText = await response.text();
      throw new Error(
        t("messages.importDeckFailed", { status: response.status, detail: errText })
      );
    }

    const deck = await response.json();
    setFieldError(deckImportError, ""); // Explicitly clear on success
    log(
      t(targetId ? "messages.deckImportUpdated" : "messages.deckImported", {
        name: deck.name,
        id: deck.id,
      })
    );
    deckImportPayload.value = "";
    if (deckImportTarget) deckImportTarget.value = "";
    await loadDecks();
  } catch (error) {
    setFieldError(deckImportError, error.message);
    log(error.message, true);
  }
}
```

---

## 4. Replace Delete Confirmations with Dialog (Critical)

**Problem:** Native confirm() is ugly and inaccessible  
**Fix:** Use semantic HTML dialog element  
**Files:** admin-web/main.js, admin.html, styles.css  
**Time:** 1 hour

### Create components.js

Create **admin-web/components.js:**

```javascript
/**
 * Reusable UI components for admin interface
 */

const ConfirmDialog = {
  /**
   * Show confirmation dialog
   * @param {string} message - Confirmation message
   * @param {function} onConfirm - Callback if confirmed
   * @param {function} onCancel - Callback if cancelled
   * @param {object} options - { confirmText, cancelText, isDangerous }
   */
  show(message, onConfirm, onCancel, options = {}) {
    const {
      confirmText = "Delete",
      cancelText = "Cancel",
      isDangerous = true,
    } = options;
    
    // Create dialog element
    const dialog = document.createElement("dialog");
    dialog.className = "confirm-dialog";
    dialog.setAttribute("aria-modal", "true");
    dialog.setAttribute("role", "alertdialog");
    dialog.setAttribute("aria-labelledby", "dialog-title");
    
    const content = document.createElement("div");
    content.className = "dialog-content";
    
    const title = document.createElement("h2");
    title.id = "dialog-title";
    title.textContent = isDangerous ? "Confirm Deletion" : "Confirm Action";
    
    const messageEl = document.createElement("p");
    messageEl.textContent = message;
    
    const actions = document.createElement("div");
    actions.className = "dialog-actions";
    
    const cancelBtn = document.createElement("button");
    cancelBtn.type = "button";
    cancelBtn.className = "ghost";
    cancelBtn.textContent = cancelText;
    cancelBtn.addEventListener("click", () => {
      dialog.close();
      onCancel?.();
    });
    
    const confirmBtn = document.createElement("button");
    confirmBtn.type = "button";
    confirmBtn.className = isDangerous ? "danger" : "primary";
    confirmBtn.textContent = confirmText;
    confirmBtn.addEventListener("click", () => {
      dialog.close();
      onConfirm?.();
    });
    
    // Handle escape key
    dialog.addEventListener("cancel", () => {
      onCancel?.();
    });
    
    actions.appendChild(cancelBtn);
    actions.appendChild(confirmBtn);
    
    content.appendChild(title);
    content.appendChild(messageEl);
    content.appendChild(actions);
    dialog.appendChild(content);
    
    document.body.appendChild(dialog);
    
    // Focus confirmation button by default (safer UX)
    dialog.showModal();
    confirmBtn.focus();
    
    return dialog;
  }
};
```

### Add Dialog CSS to styles.css

Add to **styles.css:**

```css
/* Dialog / Modal Styles */
dialog.confirm-dialog {
  border: none;
  border-radius: 0.5rem;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  max-width: 28rem;
  padding: 0;
  background-color: white;
}

dialog.confirm-dialog::backdrop {
  background-color: rgba(0, 0, 0, 0.5);
}

.dialog-content {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.dialog-content h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #0f172a;
}

.dialog-content p {
  margin: 0;
  color: #475569;
  line-height: 1.5;
}

.dialog-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.dialog-actions button {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border-radius: 0.375rem;
  cursor: pointer;
  border: none;
  font-weight: 500;
  transition: all 150ms;
}

.dialog-actions button.primary {
  background-color: #0ea5e9;
  color: white;
}

.dialog-actions button.primary:hover {
  background-color: #0284c7;
}

.dialog-actions button.danger {
  background-color: #dc2626;
  color: white;
}

.dialog-actions button.danger:hover {
  background-color: #b91c1c;
}

.dialog-actions button.ghost {
  background-color: transparent;
  color: #475569;
  border: 1px solid #cbd5e1;
}

.dialog-actions button.ghost:hover {
  background-color: #f1f5f9;
}

/* Mobile responsive */
@media (max-width: 640px) {
  dialog.confirm-dialog {
    max-width: 90vw;
  }
  
  .dialog-content {
    padding: 1.5rem;
  }
  
  .dialog-actions {
    flex-direction: column-reverse;
  }
  
  .dialog-actions button {
    width: 100%;
  }
}
```

### Add components.js to admin.html

Add before main.js:

```html
<script src="components.js"></script>
<script src="validation.js"></script>
```

### Update delete functions in main.js

Replace ALL uses of `confirm()` with `ConfirmDialog.show()`:

**deleteCard() - Line 1808:**
```javascript
async function deleteCard(cardId) {
  // OLD: if (!confirm(t("messages.deleteCardConfirm", { id: cardId }))) return;
  
  // NEW:
  ConfirmDialog.show(
    t("messages.deleteCardConfirm", { id: cardId }),
    async () => {
      try {
        const response = await fetch(apiUrl(`/admin/cards/${cardId}`), {
          method: "DELETE",
          headers: { Authorization: `Bearer ${authToken}` },
        });
        if (!response.ok) {
          const errText = await response.text();
          if (response.status === 401) {
            handleAuthFailure();
          }
          throw new Error(
            t("messages.deleteCardFailed", { status: response.status, detail: errText })
          );
        }
        log(t("messages.deletedCard", { id: cardId }));
        await loadCards();
      } catch (error) {
        log(error.message, true);
      }
    }
  );
}
```

**deleteDeck() - Line 1834:**
```javascript
async function deleteDeck(deckId) {
  ConfirmDialog.show(
    t("messages.deleteDeckConfirm", { id: deckId }),
    async () => {
      try {
        const response = await fetch(apiUrl(`/admin/decks/${deckId}`), {
          method: "DELETE",
          headers: { Authorization: `Bearer ${authToken}` },
        });
        if (!response.ok) {
          const errText = await response.text();
          if (response.status === 401) {
            handleAuthFailure();
          }
          throw new Error(
            t("messages.deleteDeckFailed", { status: response.status, detail: errText })
          );
        }
        log(t("messages.deletedDeck", { id: deckId }));
        if (deckEditId && Number(deckEditId) === Number(deckId)) {
          clearDeckEdit();
        }
        await loadDecks();
      } catch (error) {
        log(error.message, true);
      }
    }
  );
}
```

**deleteUserAccount() - Line 1923:**
```javascript
async function deleteUserAccount(user) {
  ConfirmDialog.show(
    t("messages.deleteUserConfirm", { name: user.display_name }),
    async () => {
      try {
        const headers = requireAdminHeaders();
        if (!headers) return;
        
        const response = await fetch(apiUrl(`/admin/users/${user.id}`), {
          method: "DELETE",
          headers,
        });
        if (!response.ok) {
          const errText = await response.text();
          if (response.status === 401) {
            handleAuthFailure();
          }
          throw new Error(
            t("messages.deleteUserFailed", { status: response.status, detail: errText })
          );
        }
        log(t("messages.deletedUser", { name: user.display_name }));
        await loadUsers();
        await loadAdminRooms();
      } catch (error) {
        log(error.message, true);
      }
    }
  );
}
```

**deleteAdminRoom() - Line 2020:**
```javascript
async function deleteAdminRoom(roomCode) {
  ConfirmDialog.show(
    t("messages.deleteRoomConfirm", { code: roomCode }),
    async () => {
      try {
        const headers = requireAdminHeaders();
        if (!headers) return;
        
        const response = await fetch(apiUrl(`/admin/rooms/${roomCode}`), {
          method: "DELETE",
          headers,
        });
        if (!response.ok) {
          const errText = await response.text();
          if (response.status === 401) {
            handleAuthFailure();
          }
          throw new Error(
            t("messages.deleteRoomFailed", { status: response.status, detail: errText })
          );
        }
        log(t("messages.deletedRoom", { code: roomCode }));
        await loadAdminRooms();
      } catch (error) {
        log(error.message, true);
      }
    }
  );
}
```

---

## 5. Fix adminHeaders() Error Throwing (Critical)

**Problem:** Function throws error when called without admin access  
**Fix:** Return null instead of throwing  
**Files:** admin-web/main.js  
**Time:** 20 minutes

### Replace adminHeaders() - Line 942

**OLD CODE:**
```javascript
function adminHeaders() {
  if (!requireAdminAccess(false)) {
    throw new Error(t("messages.adminRoleRequired"));
  }
  const headers = {
    "Content-Type": "application/json",
  };
  const adminToken = getAdminToken();
  if (adminToken) {
    headers["X-Admin-Token"] = adminToken;
  }
  if (authToken && isAdmin()) {
    headers.Authorization = `Bearer ${authToken}`;
  }
  resetAdminTokenIdleTimer();
  return headers;
}
```

**NEW CODE:**
```javascript
function adminHeaders() {
  if (!requireAdminAccess(false)) {
    return null; // ← Return null instead of throwing
  }
  const headers = {
    "Content-Type": "application/json",
  };
  const adminToken = getAdminToken();
  if (adminToken) {
    headers["X-Admin-Token"] = adminToken;
  }
  if (authToken && isAdmin()) {
    headers.Authorization = `Bearer ${authToken}`;
  }
  resetAdminTokenIdleTimer();
  return headers;
}
```

### Update all calls to adminHeaders()

For each function that calls `adminHeaders()`, add null check:

**updateUserRole() - Line 1872:**
```javascript
async function updateUserRole(userId, role) {
  const headers = adminHeaders();
  if (!headers) { // ← Add this check
    log(t("messages.adminRoleRequired"), true);
    return;
  }
  
  try {
    const response = await fetch(apiUrl(`/admin/users/${userId}/role`), {
      method: "PATCH",
      headers,
      body: JSON.stringify({ role }),
    });
    // ... rest of function
  }
}
```

Apply same pattern to:
- deleteUserAccount() (line 1898)
- importDeck() (line 2060)
- Any other call to adminHeaders()

---

## 6. Add CSS for Role Select Dropdown (Critical)

**Problem:** Role dropdown unstyled, invisible  
**Fix:** Add form-select CSS class  
**Files:** main.js (renderUsers), styles.css  
**Time:** 30 minutes

### Update renderUsers() - Line 1811

**OLD CODE:**
```javascript
function renderUsers(users) {
  // ...
  users.forEach((user) => {
    // ...
    const roleLabel = document.createElement("label");
    roleLabel.className = "field";
    roleLabel.textContent = `${t("users.role")}: `;
    const roleSelect = document.createElement("select");
    ["user", "admin"].forEach((value) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      roleSelect.appendChild(option);
    });
    roleSelect.value = user.role;
    roleSelect.addEventListener("change", () => updateUserRole(user.id, roleSelect.value));
    roleLabel.appendChild(roleSelect);
    actions.appendChild(roleLabel);
  });
}
```

**NEW CODE:**
```javascript
function renderUsers(users) {
  // ...
  users.forEach((user) => {
    // ...
    const roleControl = document.createElement("div");
    roleControl.className = "role-control"; // New container
    
    const roleLabel = document.createElement("label");
    roleLabel.htmlFor = `roleSelect-${user.id}`; // Proper association
    roleLabel.className = "role-label";
    roleLabel.textContent = `${t("users.role")}:`;
    
    const roleSelect = document.createElement("select");
    roleSelect.id = `roleSelect-${user.id}`; // Proper ID
    roleSelect.className = "form-select"; // ← Add styling class
    roleSelect.setAttribute("aria-label", `${t("users.role")} for ${user.display_name}`);
    
    ["user", "admin"].forEach((value) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      roleSelect.appendChild(option);
    });
    
    roleSelect.value = user.role;
    roleSelect.addEventListener("change", () => updateUserRole(user.id, roleSelect.value));
    
    roleControl.appendChild(roleLabel);
    roleControl.appendChild(roleSelect);
    actions.appendChild(roleControl);
  });
}
```

### Add CSS to styles.css

Add these styles:

```css
/* Form Select Styling */
.form-select {
  padding: 0.5rem 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.375rem;
  background-color: white;
  font-size: 1rem;
  font-family: inherit;
  cursor: pointer;
  color: #0f172a;
  transition: all 150ms;
  min-width: 120px;
}

.form-select:hover {
  border-color: #0ea5e9;
  box-shadow: 0 0 0 2px rgba(14, 165, 233, 0.1);
}

.form-select:focus {
  outline: none;
  border-color: #0ea5e9;
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.2);
}

.form-select:focus-visible {
  outline: 2px solid #0ea5e9;
  outline-offset: 2px;
}

.form-select:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background-color: #f1f5f9;
}

/* Role Control Container */
.role-control {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  flex-wrap: wrap;
}

.role-label {
  font-weight: 500;
  color: #0f172a;
  white-space: nowrap;
}

/* Mobile */
@media (max-width: 768px) {
  .role-control {
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
  }
  
  .form-select {
    width: 100%;
  }
}
```

---

## Testing All Critical Fixes

Create **admin-test-checklist.md:**

```markdown
# Admin Interface Critical Fixes - Test Checklist

## Fix 1: Admin Token Idle Timer
- [ ] Set admin token
- [ ] Wait 1 minute (verify lastAdminActivity updates)
- [ ] Click somewhere on page (verify timer doesn't reset to 0)
- [ ] Let 15 minutes pass without activity (verify token clears)
- [ ] Log message appears: "Admin token cleared after inactivity"

## Fix 2: Card Resource Validation
- [ ] Try to create card with name "   " (blank) → rejects
- [ ] Try to create card with resource value "12" → rejects with "must be between -10 and 10"
- [ ] Try to create card with resource value "1.5" → rejects "must be a whole number"
- [ ] Try to create card with resource value "-15" → rejects "must be between -10 and 10"
- [ ] Create card with all valid values → succeeds

## Fix 3: Deck JSON Import Validation
- [ ] Paste invalid JSON `{broken` → rejects with "Invalid JSON"
- [ ] Paste `{}` → rejects "Missing 'deck' object"
- [ ] Paste `{"deck": {}}` → rejects "deck.name is required"
- [ ] Paste valid JSON from export → succeeds

## Fix 4: Delete Confirmations
- [ ] Click delete card → dialog appears (not native alert)
- [ ] Click Cancel button → dialog closes, card still exists
- [ ] Click Delete button → dialog closes, card deleted
- [ ] Test with deck, user, room deletes too

## Fix 5: Admin Headers
- [ ] Clear admin token
- [ ] Try to delete card (no error thrown, just rejected)
- [ ] Try to update user role (no error thrown, just rejected)
- [ ] Error message: "Admin access required"

## Fix 6: Role Dropdown
- [ ] Open admin page
- [ ] Scroll to "Users" section
- [ ] Verify role dropdown is visible and styled
- [ ] Change user role user → admin (succeeds)
- [ ] Change user role admin → user (succeeds)
```

---

## Summary of Changes

| Issue | File | Lines Added | Time | Complexity |
|-------|------|-------------|------|-----------|
| Token Idle | main.js | 50 | 30 min | Low |
| Card Validation | validation.js | 100 | 45 min | Medium |
| Deck Import | main.js | 20 | 20 min | Low |
| Confirmations | components.js + main.js | 150 | 60 min | Medium |
| Admin Headers | main.js | 5 | 20 min | Low |
| Role Select | main.js + styles.css | 25 | 30 min | Low |
| **TOTAL** | | ~350 | **3 hours** | Medium |

---

## Implementation Order

1. **Create validation.js** - Foundation for other fixes
2. **Create components.js** - Dialog component for confirmations
3. **Update admin.html** - Include new scripts
4. **Fix token timer** - Security issue first
5. **Fix admin headers** - Error handling
6. **Add validations** - Card, deck, import
7. **Add confirmations** - Replace all confirm() calls
8. **Style select** - UI polish
9. **Test all fixes** - Use checklist above

---

## Next Steps

1. Copy code sections above into files
2. Test each fix independently
3. Run full test checklist
4. Deploy to staging
5. Proceed to Phase 2 (request debouncing, state persistence, etc.)

---

**Document Version:** 1.0  
**Ready to Use:** Yes  
**Testing Included:** Yes
