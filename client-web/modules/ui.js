// modules/ui.js — DOM-only rendering and event wiring

import { t } from "./i18n.js";

const dom = {};

function cacheDom() {
  dom.pageName = document.body.dataset.page || "all";
  dom.statusArea = document.getElementById("statusArea");
  dom.toast = document.getElementById("toast");
  dom.apiBaseInput = document.getElementById("apiBase");
  dom.guestLoginForm = document.getElementById("guestLoginForm");
  dom.registerGuestButton = document.getElementById("registerGuest");
  dom.loginFormError = document.getElementById("loginFormError");
  dom.roomForm = document.getElementById("roomForm");
  dom.roomsTableBody = document.getElementById("roomsTableBody");
  dom.roomsTable = document.getElementById("roomsTable");
  dom.refreshRoomsButton = document.getElementById("refreshRooms");
  dom.roomFormError = document.getElementById("roomFormError");
  dom.userInfo = document.getElementById("userInfo");
  dom.sessionApiChip = document.getElementById("sessionApiChip");
  dom.sessionUserChip = document.getElementById("sessionUserChip");
  dom.sessionRoomChip = document.getElementById("sessionRoomChip");
  dom.sessionAdminChip = document.getElementById("sessionAdminChip");
  dom.navLoginLink = document.querySelector('[data-nav="login"]');
  dom.navGameLink = document.querySelector('[data-nav="game"]');
  dom.navManagementLink = document.querySelector('[data-nav="management"]');
  dom.navAdminLink = document.querySelector('[data-nav="admin"]');
  dom.navLogoutButton = document.getElementById("logoutButton");
  dom.adminTokenInput = document.getElementById("adminToken");
  dom.refreshAdminDataButton = document.getElementById("refreshAdminData");
  dom.refreshCardsButton = document.getElementById("refreshCards");
  dom.refreshDecksButton = document.getElementById("refreshDecks");
  dom.adminTokenStatusLabel = document.getElementById("adminTokenStatus");
  dom.cardForm = document.getElementById("cardForm");
  dom.deckForm = document.getElementById("deckForm");
  dom.deckImportPayload = document.getElementById("deckImportPayload");
  dom.importDeckButton = document.getElementById("importDeck");
  dom.cardsList = document.getElementById("cardsList");
  dom.decksList = document.getElementById("decksList");
  dom.adminOnlySections = document.querySelectorAll("[data-admin-only]");
  dom.gameSection = document.getElementById("gameSection");
  dom.deckCount = document.getElementById("deckCount");
  dom.resourceBar = document.getElementById("resourceBar");
  dom.handList = document.getElementById("handList");
  dom.workspaceList = document.getElementById("workspaceList");
  dom.drawCardButton = document.getElementById("drawCard");
  dom.resetGameplayButton = document.getElementById("resetGameplay");
  dom.languageSelector = document.getElementById("languageSelector");
  dom.loginPasswordInput = document.getElementById("loginPassword");
  dom.roomNameInput = document.getElementById("roomName");
  dom.maxPlayersInput = document.getElementById("maxPlayers");
  dom.maxSpectatorsInput = document.getElementById("maxSpectators");
  dom.cardNameInput = document.getElementById("cardName");
  dom.cardDescriptionInput = document.getElementById("cardDescription");
  dom.cardCategoryInput = document.getElementById("cardCategory");
  dom.cardResourceInputs = {
    time: document.getElementById("cardTime"),
    reputation: document.getElementById("cardReputation"),
    discipline: document.getElementById("cardDiscipline"),
    documents: document.getElementById("cardDocuments"),
    technology: document.getElementById("cardTechnology"),
  };
  dom.deckNameInput = document.getElementById("deckName");
  dom.deckDescriptionInput = document.getElementById("deckDescription");
  dom.deckCardIdsInput = document.getElementById("deckCardIds");
  dom.displayNameInput = document.getElementById("displayName");
}

export function initUI(handlers, { initialApiBase, currentLanguage } = {}) {
  cacheDom();

  if (dom.apiBaseInput && initialApiBase) {
    dom.apiBaseInput.value = initialApiBase;
  }

  if (dom.apiBaseInput) {
    dom.apiBaseInput.addEventListener("input", () => {
      handlers.onApiBaseChange?.(dom.apiBaseInput.value.trim());
    });
  }

  if (dom.guestLoginForm) {
    dom.guestLoginForm.addEventListener("submit", (event) => {
      event.preventDefault();
      handlers.onGuestLogin?.(getGuestCredentials(), event.submitter);
    });
  }

  if (dom.registerGuestButton) {
    dom.registerGuestButton.addEventListener("click", (event) => {
      handlers.onGuestRegister?.(getGuestCredentials(), event.currentTarget);
    });
  }

  if (dom.roomForm) {
    dom.roomForm.addEventListener("submit", (event) => {
      event.preventDefault();
      handlers.onCreateRoom?.(getRoomFormValues(), event.submitter);
    });
  }

  if (dom.refreshRoomsButton) {
    dom.refreshRoomsButton.addEventListener("click", () => handlers.onRefreshRooms?.());
  }

  if (dom.adminTokenInput) {
    dom.adminTokenInput.addEventListener("input", () =>
      handlers.onAdminTokenInput?.(dom.adminTokenInput.value.trim())
    );
    dom.adminTokenInput.addEventListener("blur", () =>
      handlers.onAdminTokenBlur?.(dom.adminTokenInput.value.trim())
    );
  }

  if (dom.refreshAdminDataButton) {
    dom.refreshAdminDataButton.addEventListener("click", (event) =>
      handlers.onLoadAdminData?.(event.currentTarget)
    );
  }

  if (dom.refreshCardsButton) {
    dom.refreshCardsButton.addEventListener("click", () => handlers.onRefreshCards?.());
  }

  if (dom.refreshDecksButton) {
    dom.refreshDecksButton.addEventListener("click", () => handlers.onRefreshDecks?.());
  }

  if (dom.cardForm) {
    dom.cardForm.addEventListener("submit", (event) => {
      event.preventDefault();
      handlers.onCreateCard?.(getCardFormValues(), event.submitter);
    });
  }

  if (dom.deckForm) {
    dom.deckForm.addEventListener("submit", (event) => {
      event.preventDefault();
      handlers.onCreateDeck?.(getDeckFormValues(), event.submitter);
    });
  }

  if (dom.importDeckButton) {
    dom.importDeckButton.addEventListener("click", (event) => {
      handlers.onImportDeck?.(dom.deckImportPayload?.value || "", event.currentTarget);
    });
  }

  if (dom.drawCardButton) {
    dom.drawCardButton.addEventListener("click", () => handlers.onDrawCard?.());
  }

  if (dom.resetGameplayButton) {
    dom.resetGameplayButton.addEventListener("click", () => handlers.onResetGameplay?.());
  }

  if (dom.languageSelector) {
    dom.languageSelector.value = currentLanguage || dom.languageSelector.value;
    dom.languageSelector.addEventListener("change", (event) =>
      handlers.onLanguageChange?.(event.target.value)
    );
  }

  if (dom.navLogoutButton) {
    dom.navLogoutButton.addEventListener("click", () => handlers.onLogout?.());
  }
}

export function setLanguageSelector(language) {
  if (dom.languageSelector) {
    dom.languageSelector.value = language;
  }
  document.documentElement.lang = language;
  applyTranslations();
}

export function applyTranslations() {
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const key = node.getAttribute("data-i18n");
    node.textContent = t(key);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
    const key = node.getAttribute("data-i18n-placeholder");
    node.placeholder = t(key);
  });
  document.body.dispatchEvent(new Event("translationsReady"));
}

export const applyNewTranslations = applyTranslations;
export const updateAllLabels = applyTranslations;

export function showToast(message, isError = false) {
  if (!dom.toast) return;
  dom.toast.textContent = message;
  dom.toast.classList.toggle("error", Boolean(isError));
  dom.toast.classList.toggle("info", !isError);
  dom.toast.style.opacity = "1";
  setTimeout(() => {
    dom.toast.style.opacity = "0";
  }, 2000);
}

export function logStatus(message, isError = false) {
  const prefix = new Date().toLocaleTimeString();
  const line = `[${prefix}] ${message}`;
  if (dom.statusArea) {
    dom.statusArea.textContent = `${line}\n${dom.statusArea.textContent}`.trim();
    dom.statusArea.classList.toggle("error", isError);
    dom.statusArea.setAttribute("aria-label", line);
    if (isError) {
      dom.statusArea.scrollTop = 0;
    }
  } else {
    console[isError ? "error" : "log"](line);
  }
  if (isError) {
    showToast(message, true);
  }
}

export function setFieldError(target, message = "") {
  if (!target) return;
  target.textContent = message;
}

export function clearFieldErrors(...targets) {
  targets.filter(Boolean).forEach((target) => setFieldError(target));
}

export function setRoomFormError(message) {
  setFieldError(dom.roomFormError, message);
}

export function setLoginFormError(message) {
  setFieldError(dom.loginFormError, message);
}

export function setApiBase(value) {
  if (dom.apiBaseInput) {
    dom.apiBaseInput.value = value;
  }
}

export function renderUserInfo(user, currentRoomCode) {
  if (!dom.userInfo) return;
  if (!user) {
    dom.userInfo.textContent = t("login.notSignedIn");
    return;
  }
  const roomNote = currentRoomCode
    ? ` | ${t("rooms.meta.code")}: <strong>${currentRoomCode}</strong>`
    : "";
  dom.userInfo.innerHTML = `<strong>${user.display_name}</strong> (ID: ${user.id})${roomNote}`;
}

export function syncSessionBar({ apiBase, user, roomCode, adminMode, adminToken }) {
  if (dom.sessionApiChip) {
    dom.sessionApiChip.textContent = `${t("session.apiLabel")}: ${apiBase || "-"}`;
  }
  if (dom.sessionUserChip) {
    dom.sessionUserChip.textContent = user
      ? `${t("session.userLabel")}: ${user.display_name}`
      : `${t("session.userLabel")}: ${t("session.userGuest")}`;
  }
  if (dom.sessionRoomChip) {
    dom.sessionRoomChip.textContent = roomCode
      ? `${t("session.roomLabel")}: ${roomCode}`
      : `${t("session.roomLabel")}: ${t("session.roomNone")}`;
  }
  if (dom.sessionAdminChip) {
    dom.sessionAdminChip.textContent = adminToken
      ? `${t("session.adminLabel")}: ${adminMode ? t("admin.status.valid") : t("session.adminMissing")}`
      : `${t("session.adminLabel")}: ${t("session.adminMissing")}`;
  }
}

export function syncAdminUi(adminTokenStatus) {
  const adminMode = adminTokenStatus?.isValid;
  const adminBusy = adminTokenStatus?.isChecking;
  dom.adminOnlySections?.forEach((section) => {
    section.hidden = !adminMode;
  });
  [dom.refreshAdminDataButton, dom.refreshCardsButton, dom.refreshDecksButton].forEach((button) => {
    if (button) {
      button.disabled = !adminMode || adminBusy;
    }
  });
  if (dom.adminTokenStatusLabel) {
    let statusKey = "admin.status.idle";
    if (adminBusy) {
      statusKey = "admin.status.checking";
    } else if (adminMode) {
      statusKey = "admin.status.valid";
    } else if (adminTokenStatus?.value) {
      statusKey = "admin.status.invalid";
    }
    dom.adminTokenStatusLabel.textContent = t(statusKey);
    dom.adminTokenStatusLabel.hidden = !adminTokenStatus?.value;
    dom.adminTokenStatusLabel.classList.toggle("success", adminMode);
    dom.adminTokenStatusLabel.classList.toggle("warning", adminBusy);
  }
}

export function renderGameplay(snapshot, handlers) {
  renderResources(snapshot.resources);
  renderDeckCount(snapshot.deckCount);
  renderHand(snapshot.hand, handlers?.onMoveHandToWorkspace);
  renderWorkspace(snapshot.workspace, handlers?.onMoveWorkspaceToHand);
  if (dom.gameSection) {
    dom.gameSection.hidden = false;
  }
}

export function resetGameplay(snapshot) {
  if (dom.gameSection) {
    dom.gameSection.hidden = true;
  }
  renderGameplay(snapshot, {});
}

export function renderResources(resources) {
  if (!dom.resourceBar) return;
  dom.resourceBar.innerHTML = "";
  Object.entries(resources || {}).forEach(([key, value]) => {
    const pill = document.createElement("div");
    pill.className = "resource-pill";
    const label = t(`game.resources.${key}`);
    pill.textContent = `${label}: ${value}`;
    dom.resourceBar.appendChild(pill);
  });
}

export function renderDeckCount(count) {
  if (!dom.deckCount) return;
  dom.deckCount.textContent = count
    ? t("messages.deckCountLabel", { count, suffix: count === 1 ? "" : "s" })
    : t("game.deck.empty");
}

function renderCardList(target, cards, options) {
  if (!target) return;
  const { emptyText, actions = [] } = options;
  target.innerHTML = "";
  if (!cards.length) {
    target.innerHTML = `<li class="muted">${emptyText}</li>`;
    return;
  }

  cards.forEach((card) => {
    const item = document.createElement("li");
    const title = document.createElement("div");
    title.className = "title";
    title.textContent = `${card.name} (#${card.id})`;

    const description = document.createElement("div");
    description.className = "meta";
    description.textContent = card.description || t("decks.noDescription");

    item.appendChild(title);
    item.appendChild(description);

    if (actions.length) {
      const actionBar = document.createElement("div");
      actionBar.className = "item-actions";
      actions.forEach((action) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "ghost";
        button.textContent = action.label;
        button.addEventListener("click", () => action.handler(card.id));
        actionBar.appendChild(button);
      });
      item.appendChild(actionBar);
    }

    target.appendChild(item);
  });
}

export function renderHand(cards, onMoveHandToWorkspace) {
  renderCardList(dom.handList, cards, {
    emptyText: t("game.hand.empty"),
    actions: [
      {
        label: t("game.hand.moveToWorkspace"),
        handler: (id) => onMoveHandToWorkspace?.(id),
      },
    ],
  });
}

export function renderWorkspace(cards, onMoveWorkspaceToHand) {
  renderCardList(dom.workspaceList, cards, {
    emptyText: t("game.workspace.empty"),
    actions: [
      {
        label: t("game.workspace.returnToHand"),
        handler: (id) => onMoveWorkspaceToHand?.(id),
      },
    ],
  });
}

export function renderRooms(rooms, { currentRoomCode, authToken, onJoinRoom }) {
  if (!dom.roomsTableBody) return;
  dom.roomsTableBody.innerHTML = "";
  if (!rooms.length) {
    const emptyRow = document.createElement("tr");
    const emptyCell = document.createElement("td");
    emptyCell.colSpan = 10;
    emptyCell.className = "muted";
    emptyCell.textContent = t("rooms.list.empty");
    emptyRow.appendChild(emptyCell);
    dom.roomsTableBody.appendChild(emptyRow);
    return;
  }

  rooms.forEach((room) => {
    const row = document.createElement("tr");
    if (room.code === currentRoomCode) {
      row.classList.add("active-room");
    }
    const statusLabel = t(`rooms.status.${room.status}`);
    const joinableLabel =
      room.status !== "active"
        ? t("rooms.join.closed")
        : room.is_joinable
        ? t("rooms.join.joinable")
        : t("rooms.join.full");
    const created = new Date(room.created_at).toLocaleString();

    const cells = [
      room.code,
      room.name,
      room.host_user_id,
      `${room.player_count}/${room.max_players}`,
      `${room.spectator_count}/${room.max_spectators}`,
      room.visibility,
      statusLabel,
      joinableLabel,
      created,
    ];

    cells.forEach((value, index) => {
      const cell = document.createElement("td");
      cell.textContent = value;
      if (index === 1 && room.code === currentRoomCode) {
        const badge = document.createElement("span");
        badge.className = "pill";
        badge.textContent = t("rooms.join.current");
        badge.ariaLabel = t("rooms.join.current");
        cell.appendChild(document.createTextNode(" "));
        cell.appendChild(badge);
      }
      row.appendChild(cell);
    });

    const actionCell = document.createElement("td");
    const actions = document.createElement("div");
    actions.className = "item-actions";
    if (room.is_joined) {
      const joinedPill = document.createElement("span");
      joinedPill.className = "pill";
      joinedPill.textContent = t("rooms.join.joined");
      actions.appendChild(joinedPill);
    } else {
      const joinButton = document.createElement("button");
      joinButton.type = "button";
      joinButton.className = "ghost";
      joinButton.textContent = t("rooms.join.cta");
      joinButton.disabled = !authToken || !room.is_joinable;
      joinButton.setAttribute("aria-label", `${t("rooms.join.cta")}: ${room.name}`);
      if (!room.is_joinable) {
        joinButton.title = joinableLabel;
      }
      if (!authToken) {
        joinButton.title = t("messages.loginRequiredRoom");
      }
      joinButton.addEventListener("click", () => onJoinRoom?.(room.code));
      actions.appendChild(joinButton);
    }
    actionCell.appendChild(actions);
    row.appendChild(actionCell);
    dom.roomsTableBody.appendChild(row);
  });

  if (dom.roomsTable) {
    dom.roomsTable.classList.toggle("has-active", rooms.some((room) => room.code === currentRoomCode));
  }
}

export function renderCards(cards, { onDeleteCard }) {
  if (!dom.cardsList) return;
  dom.cardsList.innerHTML = "";
  if (!cards.length) {
    dom.cardsList.innerHTML = `<li class="muted">${t("cards.listEmpty")}</li>`;
    return;
  }

  cards.forEach((card) => {
    const item = document.createElement("li");
    const title = document.createElement("div");
    title.className = "title";
    title.textContent = `${card.name} (#${card.id})`;

    const meta = document.createElement("div");
    meta.className = "meta";
    meta.textContent = card.category
      ? `${t("cards.form.category")}: ${card.category}`
      : t("cards.noCategory");

    const effects = document.createElement("div");
    effects.className = "meta";
    effects.textContent = formatCardEffects(card);

    const description = document.createElement("div");
    description.className = "muted";
    description.textContent = card.description;

    const actions = document.createElement("div");
    actions.className = "item-actions";
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "ghost";
    deleteButton.textContent = t("cards.delete");
    deleteButton.addEventListener("click", () => onDeleteCard?.(card.id));
    actions.appendChild(deleteButton);

    item.appendChild(title);
    item.appendChild(meta);
    item.appendChild(effects);
    item.appendChild(description);
    item.appendChild(actions);
    dom.cardsList.appendChild(item);
  });
}

export function renderDecks(decks, { onExportDeck, onDeleteDeck }) {
  if (!dom.decksList) return;
  dom.decksList.innerHTML = "";
  if (!decks.length) {
    dom.decksList.innerHTML = `<li class="muted">${t("decks.listEmpty")}</li>`;
    return;
  }

  decks.forEach((deck) => {
    const item = document.createElement("li");
    const title = document.createElement("div");
    title.className = "title";
    title.textContent = `${deck.name} (#${deck.id})`;

    const description = document.createElement("div");
    description.className = "muted";
    description.textContent = deck.description || t("decks.noDescription");

    const meta = document.createElement("div");
    meta.className = "meta";
    meta.textContent = deck.card_ids.length
      ? `${t("cards.heading")}: ${deck.card_ids.join(", ")}`
      : t("decks.noCards");

    const actions = document.createElement("div");
    actions.className = "item-actions";
    const exportButton = document.createElement("button");
    exportButton.type = "button";
    exportButton.className = "ghost";
    exportButton.textContent = t("decks.export");
    exportButton.addEventListener("click", () => onExportDeck?.(deck.id));

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "ghost";
    deleteButton.textContent = t("decks.delete");
    deleteButton.addEventListener("click", () => onDeleteDeck?.(deck.id));

    actions.appendChild(exportButton);
    actions.appendChild(deleteButton);

    item.appendChild(title);
    item.appendChild(description);
    item.appendChild(meta);
    item.appendChild(actions);
    dom.decksList.appendChild(item);
  });
}

export function toggleNavVisibility({ isAuthenticated, isAdmin }) {
  if (dom.navLoginLink) dom.navLoginLink.classList.toggle("hidden", isAuthenticated);
  if (dom.navGameLink) dom.navGameLink.classList.toggle("hidden", !isAuthenticated);
  if (dom.navManagementLink) dom.navManagementLink.classList.toggle("hidden", !isAuthenticated);
  if (dom.navAdminLink) dom.navAdminLink.classList.toggle("hidden", !isAdmin);
  if (dom.navLogoutButton) dom.navLogoutButton.classList.toggle("hidden", !isAuthenticated);
}

function getGuestCredentials() {
  if (!dom.displayNameInput || !dom.loginPasswordInput) {
    return null;
  }
  return {
    displayName: dom.displayNameInput.value.trim(),
    password: dom.loginPasswordInput.value.trim(),
  };
}

function getRoomFormValues() {
  return {
    name: dom.roomNameInput?.value.trim() || "",
    maxPlayers: Number.parseInt(dom.maxPlayersInput?.value ?? "", 10),
    maxSpectators: Number.parseInt(dom.maxSpectatorsInput?.value ?? "", 10),
  };
}

function getCardFormValues() {
  const resourcePayload = Object.fromEntries(
    Object.entries(dom.cardResourceInputs).map(([key, input]) => [key, input ? Number.parseInt(input.value || 0, 10) : 0])
  );
  return {
    name: dom.cardNameInput?.value.trim() || "",
    description: dom.cardDescriptionInput?.value.trim() || "",
    category: dom.cardCategoryInput?.value.trim() || "",
    resources: resourcePayload,
  };
}

function getDeckFormValues() {
  return {
    name: dom.deckNameInput?.value.trim() || "",
    description: dom.deckDescriptionInput?.value.trim() || "",
    cardIds: dom.deckCardIdsInput?.value || "",
  };
}

function formatCardEffects(card) {
  const RESOURCE_KEYS = ["time", "reputation", "discipline", "documents", "technology"];
  const effects = RESOURCE_KEYS.map((key) => ({
    label: t(`game.resources.${key}`),
    value: Number.parseInt(card[key] ?? 0, 10),
  })).filter(({ value }) => value !== 0);
  if (!effects.length) {
    return t("cards.noEffects");
  }
  return effects
    .map(({ label, value }) => `${label}: ${value > 0 ? "+" : ""}${value}`)
    .join(", ");
}

export function getAdminToken() {
  return dom.adminTokenInput?.value.trim() || "";
}

export function getApiBase() {
  return dom.apiBaseInput?.value.trim() || "";
}

export function setRoomName(value) {
  if (dom.roomNameInput) {
    dom.roomNameInput.value = value;
  }
}

export function setDeckImportPayload(value) {
  if (dom.deckImportPayload) {
    dom.deckImportPayload.value = value;
  }
}

export function setCardForm(values) {
  if (dom.cardForm) {
    dom.cardForm.reset();
  }
  if (values?.clear !== false && dom.cardForm) {
    dom.cardForm.reset();
  }
}

export function setDeckForm(values) {
  if (dom.deckForm) {
    dom.deckForm.reset();
  }
  if (values?.clear !== false && dom.deckForm) {
    dom.deckForm.reset();
  }
}

export function hideGameSection() {
  if (dom.gameSection) {
    dom.gameSection.hidden = true;
  }
}

export function showGameSection() {
  if (dom.gameSection) {
    dom.gameSection.hidden = false;
  }
}

export function setAdminTokenValue(value) {
  if (dom.adminTokenInput) {
    dom.adminTokenInput.value = value;
  }
}

export function applyPageGuard({ isAuthPage, isGamePage, isManagementPage, isAdminPage, hasUser, hasAdmin }) {
  if (dom.pageName === "auth" && hasUser) {
    window.location.href = "main.html";
  }
  if (dom.pageName === "game" && !hasUser) {
    window.location.href = "index.html";
  }
  if (dom.pageName === "management" && !hasUser) {
    window.location.href = "index.html";
  }
  if (dom.pageName === "admin" && !hasAdmin) {
    window.location.href = "index.html";
  }
}

