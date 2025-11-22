const STORAGE_KEYS = {
  authToken: "joj-auth-token",
  user: "joj-user",
};

const statusArea = document.getElementById("statusArea");
const apiBaseInput = document.getElementById("apiBase");
const guestLoginForm = document.getElementById("guestLoginForm");
const roomForm = document.getElementById("roomForm");
const roomsList = document.getElementById("roomsList");
const refreshRoomsButton = document.getElementById("refreshRooms");
const userInfo = document.getElementById("userInfo");
const adminTokenInput = document.getElementById("adminToken");
const refreshAdminDataButton = document.getElementById("refreshAdminData");
const refreshCardsButton = document.getElementById("refreshCards");
const refreshDecksButton = document.getElementById("refreshDecks");
const cardForm = document.getElementById("cardForm");
const deckForm = document.getElementById("deckForm");
const cardsList = document.getElementById("cardsList");
const decksList = document.getElementById("decksList");
const adminOnlySections = document.querySelectorAll("[data-admin-only]");
const gameSection = document.getElementById("gameSection");
const deckCount = document.getElementById("deckCount");
const resourceBar = document.getElementById("resourceBar");
const handList = document.getElementById("handList");
const workspaceList = document.getElementById("workspaceList");
const drawCardButton = document.getElementById("drawCard");
const resetGameplayButton = document.getElementById("resetGameplay");

let authToken = null;
let currentUser = null;
let deckCards = [];
let handCards = [];
let workspaceCards = [];

const STARTING_RESOURCES = {
  time: 1,
  reputation: 1,
  discipline: 1,
  documents: 1,
  technology: 1,
};

let playerResources = { ...STARTING_RESOURCES };

function log(message, isError = false) {
  const prefix = new Date().toLocaleTimeString();
  const line = `[${prefix}] ${message}`;
  statusArea.textContent = `${line}\n${statusArea.textContent}`.trim();
  if (isError) {
    statusArea.classList.add("error");
  }
}

function apiUrl(path) {
  return `${apiBaseInput.value.replace(/\/$/, "")}${path}`;
}

function requireAdminToken() {
  const token = adminTokenInput.value.trim();
  if (!token) {
    throw new Error("Enter the admin token first.");
  }
  return token;
}

function setAuthSession(token, user) {
  authToken = token;
  currentUser = user;
  if (token && user) {
    localStorage.setItem(STORAGE_KEYS.authToken, token);
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.authToken);
    localStorage.removeItem(STORAGE_KEYS.user);
    resetGameplayState();
  }
}

function adminHeaders() {
  return {
    "Content-Type": "application/json",
    "X-Admin-Token": requireAdminToken(),
  };
}

function hasAdminToken() {
  return Boolean(adminTokenInput.value.trim());
}

function syncAdminUi() {
  const adminMode = hasAdminToken();
  adminOnlySections.forEach((section) => {
    section.hidden = !adminMode;
  });
  [refreshAdminDataButton, refreshCardsButton, refreshDecksButton].forEach((button) => {
    button.disabled = !adminMode;
  });
}

function setUserInfo() {
  if (!currentUser) {
    userInfo.textContent = "Not signed in yet.";
    return;
  }
  userInfo.innerHTML = `<strong>${currentUser.display_name}</strong> (ID: ${currentUser.id})`;
}

function handleAuthFailure() {
  log("Session expired. Please log in again.", true);
  setAuthSession(null, null);
  setUserInfo();
}

function resetGameplayState() {
  deckCards = [];
  handCards = [];
  workspaceCards = [];
  playerResources = { ...STARTING_RESOURCES };
  if (gameSection) {
    gameSection.hidden = true;
  }
  renderResources();
  renderDeckCount();
  renderHand();
  renderWorkspace();
}

function renderResources() {
  if (!resourceBar) return;
  resourceBar.innerHTML = "";
  Object.entries(playerResources).forEach(([key, value]) => {
    const pill = document.createElement("div");
    pill.className = "resource-pill";
    const label = key.charAt(0).toUpperCase() + key.slice(1);
    pill.textContent = `${label}: ${value}`;
    resourceBar.appendChild(pill);
  });
}

function renderDeckCount() {
  if (!deckCount) return;
  deckCount.textContent = deckCards.length
    ? `${deckCards.length} card${deckCards.length === 1 ? "" : "s"}`
    : "Deck empty";
}

function renderCardList(target, cards, options) {
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
    description.textContent = card.description || "No description";

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

function renderHand() {
  if (!handList) return;
  renderCardList(handList, handCards, {
    emptyText: "Draw cards to see them in your hand.",
    actions: [
      {
        label: "Move to workspace",
        handler: moveHandToWorkspace,
      },
    ],
  });
}

function renderWorkspace() {
  if (!workspaceList) return;
  renderCardList(workspaceList, workspaceCards, {
    emptyText: "Move cards here to plan your turn.",
    actions: [
      {
        label: "Return to hand",
        handler: moveWorkspaceToHand,
      },
    ],
  });
}

function shuffleDeck(cards) {
  const copy = [...cards];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

async function prepareGameplayArea() {
  if (!authToken) return;
  try {
    const response = await fetch(apiUrl("/cards"));
    if (!response.ok) {
      throw new Error(`Unable to load deck: ${response.status}`);
    }
    const cards = await response.json();
    deckCards = shuffleDeck(cards);
    handCards = [];
    workspaceCards = [];
    playerResources = { ...STARTING_RESOURCES };
    if (gameSection) {
      gameSection.hidden = false;
    }
    renderResources();
    renderDeckCount();
    renderHand();
    renderWorkspace();
    log(`Gameplay ready with ${deckCards.length} card(s) in the deck.`);
  } catch (error) {
    log(error.message, true);
  }
}

function drawFromDeck() {
  if (!authToken) {
    log("Login first to draw a card.", true);
    return;
  }
  if (!deckCards.length) {
    log("Deck is empty. Reset the table to load cards again.", true);
    return;
  }
  const card = deckCards.pop();
  handCards.push(card);
  renderDeckCount();
  renderHand();
}

function moveHandToWorkspace(cardId) {
  const index = handCards.findIndex((card) => card.id === cardId);
  if (index === -1) return;
  const [card] = handCards.splice(index, 1);
  workspaceCards.push(card);
  renderHand();
  renderWorkspace();
}

function moveWorkspaceToHand(cardId) {
  const index = workspaceCards.findIndex((card) => card.id === cardId);
  if (index === -1) return;
  const [card] = workspaceCards.splice(index, 1);
  handCards.push(card);
  renderWorkspace();
  renderHand();
}

async function restoreSession() {
  const savedToken = localStorage.getItem(STORAGE_KEYS.authToken);
  const savedUser = localStorage.getItem(STORAGE_KEYS.user);
  if (savedToken && savedUser) {
    try {
      const parsedUser = JSON.parse(savedUser);
      setAuthSession(savedToken, parsedUser);
      setUserInfo();
      log("Restored previous session.");
      await loadRooms();
      await prepareGameplayArea();
    } catch (error) {
      handleAuthFailure();
    }
  }
}

async function handleGuestLogin(event) {
  event.preventDefault();
  const displayName = document.getElementById("displayName").value.trim();
  if (!displayName) {
    log("Display name is required", true);
    return;
  }

  try {
    const response = await fetch(apiUrl("/auth/login"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ provider: "guest", display_name: displayName }),
    });

    if (!response.ok) {
      throw new Error(`Login failed: ${response.status}`);
    }

    const data = await response.json();
    setAuthSession(data.access_token, data.user);
    log(`Logged in as ${currentUser.display_name}`);
    setUserInfo();
    await loadRooms();
    await prepareGameplayArea();
  } catch (error) {
    log(error.message, true);
  }
}

async function loadRooms() {
  try {
    const response = await fetch(apiUrl("/rooms"));
    if (!response.ok) {
      if (response.status === 401) {
        handleAuthFailure();
      }
      throw new Error(`Unable to load rooms: ${response.status}`);
    }
    const rooms = await response.json();
    renderRooms(rooms);
    log(`Loaded ${rooms.length} room(s).`);
  } catch (error) {
    log(error.message, true);
  }
}

function renderRooms(rooms) {
  roomsList.innerHTML = "";
  if (!rooms.length) {
    roomsList.innerHTML = '<li class="muted">No rooms yet. Create one!</li>';
    return;
  }

  rooms.forEach((room) => {
    const item = document.createElement("li");
    const title = document.createElement("div");
    title.className = "title";
    title.textContent = room.name;

    const meta = document.createElement("div");
    meta.className = "meta";
    const metaBits = [
      `Host: ${room.host_user_id}`,
      `Code: ${room.code}`,
      `Max: ${room.max_players}`,
      `Visibility: ${room.visibility}`,
    ];
    meta.textContent = metaBits.join(" | ");

    item.appendChild(title);
    item.appendChild(meta);
    roomsList.appendChild(item);
  });
}

async function createRoom(event) {
  event.preventDefault();
  const roomName = document.getElementById("roomName").value.trim();
  if (!authToken) {
    log("Login first to create a room.", true);
    return;
  }
  if (!roomName) {
    log("Room name is required", true);
    return;
  }

  try {
    const response = await fetch(apiUrl("/rooms"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ name: roomName }),
    });

    if (!response.ok) {
      const errText = await response.text();
      if (response.status === 401) {
        handleAuthFailure();
      }
      throw new Error(`Create room failed: ${response.status} ${errText}`);
    }

    const room = await response.json();
    log(`Created room "${room.name}" (code: ${room.code}).`);
    document.getElementById("roomName").value = "";
    await loadRooms();
  } catch (error) {
    log(error.message, true);
  }
}

function renderCards(cards) {
  cardsList.innerHTML = "";
  if (!cards.length) {
    cardsList.innerHTML = '<li class="muted">No cards yet. Create one above.</li>';
    return;
  }

  cards.forEach((card) => {
    const item = document.createElement("li");
    const title = document.createElement("div");
    title.className = "title";
    title.textContent = `${card.name} (#${card.id})`;

    const meta = document.createElement("div");
    meta.className = "meta";
    meta.textContent = card.category ? `Category: ${card.category}` : "No category";

    const description = document.createElement("div");
    description.className = "muted";
    description.textContent = card.description;

    const actions = document.createElement("div");
    actions.className = "item-actions";
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "ghost";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => deleteCard(card.id));
    actions.appendChild(deleteButton);

    item.appendChild(title);
    item.appendChild(meta);
    item.appendChild(description);
    item.appendChild(actions);
    cardsList.appendChild(item);
  });
}

function renderDecks(decks) {
  decksList.innerHTML = "";
  if (!decks.length) {
    decksList.innerHTML = '<li class="muted">No decks yet. Create one above.</li>';
    return;
  }

  decks.forEach((deck) => {
    const item = document.createElement("li");
    const title = document.createElement("div");
    title.className = "title";
    title.textContent = `${deck.name} (#${deck.id})`;

    const description = document.createElement("div");
    description.className = "muted";
    description.textContent = deck.description || "No description";

    const meta = document.createElement("div");
    meta.className = "meta";
    meta.textContent = deck.card_ids.length
      ? `Cards: ${deck.card_ids.join(", ")}`
      : "No cards assigned";

    const actions = document.createElement("div");
    actions.className = "item-actions";
    const exportButton = document.createElement("button");
    exportButton.type = "button";
    exportButton.className = "ghost";
    exportButton.textContent = "Export JSON";
    exportButton.addEventListener("click", () => exportDeck(deck.id));
    actions.appendChild(exportButton);
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "ghost";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => deleteDeck(deck.id));
    actions.appendChild(deleteButton);

    item.appendChild(title);
    item.appendChild(description);
    item.appendChild(meta);
    item.appendChild(actions);
    decksList.appendChild(item);
  });
}

async function loadCards() {
  try {
    const response = await fetch(apiUrl("/admin/cards"), {
      headers: { "X-Admin-Token": requireAdminToken() },
    });
    if (!response.ok) {
      throw new Error(`Unable to load cards: ${response.status}`);
    }
    const cards = await response.json();
    renderCards(cards);
    log(`Loaded ${cards.length} card(s).`);
  } catch (error) {
    log(error.message, true);
  }
}

async function loadDecks() {
  try {
    const response = await fetch(apiUrl("/admin/decks"), {
      headers: { "X-Admin-Token": requireAdminToken() },
    });
    if (!response.ok) {
      throw new Error(`Unable to load decks: ${response.status}`);
    }
    const decks = await response.json();
    renderDecks(decks);
    log(`Loaded ${decks.length} deck(s).`);
  } catch (error) {
    log(error.message, true);
  }
}

async function createCard(event) {
  event.preventDefault();
  const name = document.getElementById("cardName").value.trim();
  const description = document.getElementById("cardDescription").value.trim();
  const category = document.getElementById("cardCategory").value.trim();
  if (!name || !description) {
    log("Card name and description are required.", true);
    return;
  }

  try {
    const response = await fetch(apiUrl("/admin/cards"), {
      method: "POST",
      headers: adminHeaders(),
      body: JSON.stringify({ name, description, category: category || null }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Create card failed: ${response.status} ${errText}`);
    }

    const card = await response.json();
    log(`Created card "${card.name}" (#${card.id}).`);
    cardForm.reset();
    await loadCards();
  } catch (error) {
    log(error.message, true);
  }
}

function parseCardIds(input) {
  if (!input.trim()) return [];
  return input
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean)
    .map((value) => Number.parseInt(value, 10))
    .filter((num) => !Number.isNaN(num));
}

async function createDeck(event) {
  event.preventDefault();
  const name = document.getElementById("deckName").value.trim();
  const description = document.getElementById("deckDescription").value.trim();
  const cardIdsInput = document.getElementById("deckCardIds").value;
  const card_ids = parseCardIds(cardIdsInput);
  if (!name) {
    log("Deck name is required.", true);
    return;
  }

  try {
    const response = await fetch(apiUrl("/admin/decks"), {
      method: "POST",
      headers: adminHeaders(),
      body: JSON.stringify({ name, description: description || null, card_ids }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Create deck failed: ${response.status} ${errText}`);
    }

    const deck = await response.json();
    log(`Created deck "${deck.name}" (#${deck.id}).`);
    deckForm.reset();
    await loadDecks();
  } catch (error) {
    log(error.message, true);
  }
}

async function deleteCard(cardId) {
  if (!confirm(`Delete card #${cardId}?`)) return;
  try {
    const response = await fetch(apiUrl(`/admin/cards/${cardId}`), {
      method: "DELETE",
      headers: { "X-Admin-Token": requireAdminToken() },
    });
    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Delete card failed: ${response.status} ${errText}`);
    }
    log(`Deleted card #${cardId}.`);
    await loadCards();
  } catch (error) {
    log(error.message, true);
  }
}

async function deleteDeck(deckId) {
  if (!confirm(`Delete deck #${deckId}?`)) return;
  try {
    const response = await fetch(apiUrl(`/admin/decks/${deckId}`), {
      method: "DELETE",
      headers: { "X-Admin-Token": requireAdminToken() },
    });
    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Delete deck failed: ${response.status} ${errText}`);
    }
    log(`Deleted deck #${deckId}.`);
    await loadDecks();
  } catch (error) {
    log(error.message, true);
  }
}

async function exportDeck(deckId) {
  try {
    const response = await fetch(apiUrl(`/admin/decks/${deckId}/export`), {
      headers: { "X-Admin-Token": requireAdminToken() },
    });
    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Export failed: ${response.status} ${errText}`);
    }
    const payload = await response.json();
    const pretty = JSON.stringify(payload, null, 2);
    log(`Exported deck #${deckId}:\n${pretty}`);
  } catch (error) {
    log(error.message, true);
  }
}

async function loadAdminData() {
  await Promise.all([loadCards(), loadDecks()]);
}

function wireEvents() {
  guestLoginForm.addEventListener("submit", handleGuestLogin);
  roomForm.addEventListener("submit", createRoom);
  refreshRoomsButton.addEventListener("click", loadRooms);
  adminTokenInput.addEventListener("input", syncAdminUi);
  refreshAdminDataButton.addEventListener("click", loadAdminData);
  refreshCardsButton.addEventListener("click", loadCards);
  refreshDecksButton.addEventListener("click", loadDecks);
  cardForm.addEventListener("submit", createCard);
  deckForm.addEventListener("submit", createDeck);
  drawCardButton.addEventListener("click", drawFromDeck);
  resetGameplayButton.addEventListener("click", prepareGameplayArea);
}

wireEvents();
syncAdminUi();
setUserInfo();
restoreSession();
log("Ready. Set your API base URL, sign in as a guest, or manage decks with the admin token.");
