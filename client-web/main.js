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

let authToken = null;
let currentUser = null;

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

function adminHeaders() {
  return {
    "Content-Type": "application/json",
    "X-Admin-Token": requireAdminToken(),
  };
}

function setUserInfo() {
  if (!currentUser) {
    userInfo.textContent = "Not signed in yet.";
    return;
  }
  userInfo.innerHTML = `<strong>${currentUser.display_name}</strong> (ID: ${currentUser.id})`;
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
    authToken = data.access_token;
    currentUser = data.user;
    log(`Logged in as ${currentUser.display_name}`);
    setUserInfo();
    await loadRooms();
  } catch (error) {
    log(error.message, true);
  }
}

async function loadRooms() {
  try {
    const response = await fetch(apiUrl("/rooms"));
    if (!response.ok) {
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

async function loadAdminData() {
  await Promise.all([loadCards(), loadDecks()]);
}

function wireEvents() {
  guestLoginForm.addEventListener("submit", handleGuestLogin);
  roomForm.addEventListener("submit", createRoom);
  refreshRoomsButton.addEventListener("click", loadRooms);
  refreshAdminDataButton.addEventListener("click", loadAdminData);
  refreshCardsButton.addEventListener("click", loadCards);
  refreshDecksButton.addEventListener("click", loadDecks);
  cardForm.addEventListener("submit", createCard);
  deckForm.addEventListener("submit", createDeck);
}

wireEvents();
setUserInfo();
log("Ready. Set your API base URL, sign in as a guest, or manage decks with the admin token.");
