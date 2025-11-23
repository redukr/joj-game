const STORAGE_KEYS = {
  authToken: "joj-auth-token",
  user: "joj-user",
  apiBase: "joj-api-base",
};

const LANGUAGE_STORAGE_KEY = "joj-language";

const TRANSLATIONS = {
  en: {
    title: "JOJ Game Web Client",
    subtitle: "Interact with the FastAPI server from your browser.",
    language: { label: "Language" },
    server: {
      heading: "Server connection",
      apiBase: "API base URL",
      hint: "Update this if your server runs on a different host or port.",
    },
    admin: {
      heading: "Admin access",
      token: "Admin token",
      tokenPlaceholder: "Paste the server ADMIN_TOKEN value",
      hint1: "Needed for the /admin API. Stored only in this page during your session.",
      hint2: "Admin tools appear once a token is provided.",
      loadData: "Load cards & decks",
    },
    login: {
      heading: "Guest login",
      displayName: "Display name",
      displayNamePlaceholder: "Battle Planner",
      password: "Password",
      passwordPlaceholder: "Enter a password",
      register: "Register",
      submit: "Sign in",
      notSignedIn: "Not signed in yet.",
    },
    rooms: {
      create: {
        heading: "Create room",
        name: "Room name",
        namePlaceholder: "Briefing Room",
        maxPlayers: "Max players (2-6)",
        maxSpectators: "Max spectators (0-10)",
        submit: "Create room",
        hint: "Requires a logged-in user; uses your bearer token automatically.",
      },
      list: {
        heading: "Rooms",
        refresh: "Refresh",
        empty: "No rooms yet. Create one!",
      },
      meta: {
        host: "Host",
        code: "Code",
        players: "Players",
        spectators: "Spectators",
        visibility: "Visibility",
      },
    },
    game: {
      heading: "Gameplay workspace",
      draw: "Draw card",
      reset: "Reset table",
      hint:
        "Available once you sign in. Cards are pulled from the server deck so you can try drawing and arranging them locally.",
      deck: {
        heading: "Deck",
        hint: "Use Draw to pull the next card into your hand.",
        empty: "Deck empty",
      },
      hand: {
        heading: "Hand",
        empty: "Draw cards to see them in your hand.",
        moveToWorkspace: "Move to workspace",
      },
      workspace: {
        heading: "Workspace",
        empty: "Move cards here to plan your turn.",
        returnToHand: "Return to hand",
      },
      resources: {
        time: "Time",
        reputation: "Reputation",
        discipline: "Discipline",
        documents: "Documents",
        technology: "Technology",
      },
    },
    cards: {
      heading: "Cards",
      refresh: "Refresh",
      form: {
        name: "Name",
        namePlaceholder: "Surprise Event",
        description: "Description",
        descriptionPlaceholder: "Something unexpected happens",
        category: "Category (optional)",
        categoryPlaceholder: "chaos",
        submit: "Create card",
      },
      listEmpty: "No cards yet. Create one above.",
      noCategory: "No category",
      delete: "Delete",
    },
    decks: {
      heading: "Decks",
      refresh: "Refresh",
      form: {
        name: "Name",
        namePlaceholder: "Starter Deck",
        description: "Description (optional)",
        descriptionPlaceholder: "Default cards",
        cardIds: "Card IDs (comma separated)",
        cardIdsPlaceholder: "1,2,3",
        submit: "Create deck",
      },
      listEmpty: "No decks yet. Create one above.",
      noDescription: "No description",
      noCards: "No cards assigned",
      export: "Export JSON",
      delete: "Delete",
    },
    status: { heading: "Status" },
    messages: {
      adminTokenRequired: "Enter the admin token first.",
      sessionExpired: "Session expired. Please log in again.",
      sessionRestored: "Restored previous session.",
      loginSuccess: "Logged in as {name}.",
      displayNameRequired: "Display name is required",
      passwordRequired: "Password is required",
      unableToLoadDeck: "Unable to load deck: {status}",
      gameplayReady: "Gameplay ready with {count} card(s) in the deck.",
      loginFirstDraw: "Login first to draw a card.",
      deckEmpty: "Deck is empty. Reset the table to load cards again.",
      loginRequiredRoom: "Login first to create a room.",
      deckCountLabel: "{count} card{suffix}",
      roomsLoaded: "Loaded {count} room(s).",
      unableToLoadRooms: "Unable to load rooms: {status}",
      roomNameRequired: "Room name is required",
      maxPlayersRequired: "Enter how many players can join the room.",
      spectatorsRequired: "Enter how many spectators are allowed (0-10).",
      createRoomFailed: "Create room failed: {status} {detail}",
      roomCreated: 'Created room "{name}" (code: {code}).',
      cardsLoaded: "Loaded {count} card(s).",
      decksLoaded: "Loaded {count} deck(s).",
      unableLoadCards: "Unable to load cards: {status}",
      unableLoadDecks: "Unable to load decks: {status}",
      createCardFailed: "Create card failed: {status} {detail}",
      createDeckFailed: "Create deck failed: {status} {detail}",
      deleteCardFailed: "Delete card failed: {status} {detail}",
      deleteDeckFailed: "Delete deck failed: {status} {detail}",
      exportDeckFailed: "Export failed: {status} {detail}",
      cardFieldsRequired: "Card name and description are required.",
      cardCreated: 'Created card "{name}" (#{id}).',
      deckNameRequired: "Deck name is required.",
      deckCreated: 'Created deck "{name}" (#{id}).',
      deleteCardConfirm: "Delete card #{id}?",
      deleteDeckConfirm: "Delete deck #{id}?",
      deletedCard: "Deleted card #{id}.",
      deletedDeck: "Deleted deck #{id}.",
      exportedDeck: "Exported deck #{id}:\n{payload}",
      ready: "Ready. Set your API base URL, register or sign in, or manage decks with the admin token.",
      loginFailed: "Login failed: {status}",
      registrationSuccess: "Registered as {name}.",
    },
  },
  uk: {
    title: "Вебклієнт JOJ Game",
    subtitle: "Працюйте з сервером FastAPI просто у браузері.",
    language: { label: "Мова" },
    server: {
      heading: "Підключення до сервера",
      apiBase: "Базова адреса API",
      hint: "Змініть, якщо сервер працює на іншому хості чи порту.",
    },
    admin: {
      heading: "Доступ адміністратора",
      token: "Адмін-токен",
      tokenPlaceholder: "Вставте значення ADMIN_TOKEN із сервера",
      hint1: "Потрібен для API /admin. Зберігається лише під час сеансу сторінки.",
      hint2: "Інструменти адміністратора з'являються після введення токена.",
      loadData: "Завантажити карти та колоди",
    },
    login: {
      heading: "Гостьовий вхід",
      displayName: "Ім'я гравця",
      displayNamePlaceholder: "Стратег",
      password: "Пароль",
      passwordPlaceholder: "Введіть пароль",
      register: "Зареєструватися",
      submit: "Увійти",
      notSignedIn: "Ще не увійшли.",
    },
    rooms: {
      create: {
        heading: "Створити кімнату",
        name: "Назва кімнати",
        namePlaceholder: "Брифінг",
        maxPlayers: "Максимум гравців (2-6)",
        maxSpectators: "Максимум глядачів (0-10)",
        submit: "Створити кімнату",
        hint: "Потрібен увійшовший користувач; ваш токен додається автоматично.",
      },
      list: {
        heading: "Кімнати",
        refresh: "Оновити",
        empty: "Немає кімнат. Створіть першу!",
      },
      meta: {
        host: "Хост",
        code: "Код",
        players: "Гравців",
        spectators: "Глядачів",
        visibility: "Видимість",
      },
    },
    game: {
      heading: "Робочий простір гри",
      draw: "Взяти карту",
      reset: "Перезавантажити стіл",
      hint:
        "Доступно після входу. Карти беруться з сервера, щоб ви могли тягнути та розкладати їх локально.",
      deck: {
        heading: "Колода",
        hint: "Натисніть \"Взяти карту\", щоб додати карту до руки.",
        empty: "Колода порожня",
      },
      hand: {
        heading: "Рука",
        empty: "Візьміть карти, щоб побачити їх у руці.",
        moveToWorkspace: "До робочого поля",
      },
      workspace: {
        heading: "Робоче поле",
        empty: "Перемістіть карти сюди, щоб спланувати хід.",
        returnToHand: "Повернути в руку",
      },
      resources: {
        time: "Час",
        reputation: "Репутація",
        discipline: "Дисципліна",
        documents: "Документи",
        technology: "Технології",
      },
    },
    cards: {
      heading: "Карти",
      refresh: "Оновити",
      form: {
        name: "Назва",
        namePlaceholder: "Неочікувана подія",
        description: "Опис",
        descriptionPlaceholder: "Щось несподіване стається",
        category: "Категорія (необов'язково)",
        categoryPlaceholder: "хаос",
        submit: "Створити карту",
      },
      listEmpty: "Карт ще немає. Створіть першу вище.",
      noCategory: "Без категорії",
      delete: "Видалити",
    },
    decks: {
      heading: "Колоди",
      refresh: "Оновити",
      form: {
        name: "Назва",
        namePlaceholder: "Стартова колода",
        description: "Опис (необов'язково)",
        descriptionPlaceholder: "Базові карти",
        cardIds: "ID карток (через кому)",
        cardIdsPlaceholder: "1,2,3",
        submit: "Створити колоду",
      },
      listEmpty: "Колоди відсутні. Створіть одну вище.",
      noDescription: "Без опису",
      noCards: "Карт не призначено",
      export: "Експорт JSON",
      delete: "Видалити",
    },
    status: { heading: "Статус" },
    messages: {
      adminTokenRequired: "Спочатку введіть адмін-токен.",
      sessionExpired: "Сесію завершено. Увійдіть ще раз.",
      sessionRestored: "Попередню сесію відновлено.",
      loginSuccess: "Увійшли як {name}.",
      displayNameRequired: "Потрібно вказати ім'я гравця",
      passwordRequired: "Потрібно ввести пароль",
      unableToLoadDeck: "Не вдалося завантажити колоду: {status}",
      gameplayReady: "Ігровий простір готовий: {count} карт(и) у колоді.",
      loginFirstDraw: "Спершу увійдіть, щоб тягнути карти.",
      deckEmpty: "Колода порожня. Перезавантажте стіл, щоб завантажити карти знову.",
      loginRequiredRoom: "Спершу увійдіть, щоб створити кімнату.",
      deckCountLabel: "{count} карт(и)",
      roomsLoaded: "Завантажено {count} кімнат(и).",
      unableToLoadRooms: "Не вдалося завантажити кімнати: {status}",
      roomNameRequired: "Потрібна назва кімнати",
      maxPlayersRequired: "Вкажіть, скільки гравців може приєднатися.",
      spectatorsRequired: "Вкажіть, скільки глядачів дозволено (0-10).",
      createRoomFailed: "Не вдалося створити кімнату: {status} {detail}",
      roomCreated: 'Створено кімнату "{name}" (код: {code}).',
      cardsLoaded: "Завантажено {count} карт(и).",
      decksLoaded: "Завантажено {count} колод(и).",
      unableLoadCards: "Не вдалося завантажити карти: {status}",
      unableLoadDecks: "Не вдалося завантажити колоди: {status}",
      createCardFailed: "Не вдалося створити карту: {status} {detail}",
      createDeckFailed: "Не вдалося створити колоду: {status} {detail}",
      deleteCardFailed: "Не вдалося видалити карту: {status} {detail}",
      deleteDeckFailed: "Не вдалося видалити колоду: {status} {detail}",
      exportDeckFailed: "Не вдалося експортувати: {status} {detail}",
      cardFieldsRequired: "Потрібно вказати назву та опис карти.",
      cardCreated: 'Карту "{name}" (#{id}) створено.',
      deckNameRequired: "Потрібно вказати назву колоди.",
      deckCreated: 'Колоду "{name}" (#{id}) створено.',
      deleteCardConfirm: "Видалити карту #{id}?",
      deleteDeckConfirm: "Видалити колоду #{id}?",
      deletedCard: "Карту #{id} видалено.",
      deletedDeck: "Колоду #{id} видалено.",
      exportedDeck: "Експорт колоди #{id}:\n{payload}",
      ready:
        "Готово. Задайте базову адресу API, зареєструйтеся або увійдіть, чи керуйте колодами з адмін-токеном.",
      loginFailed: "Помилка входу: {status}",
      registrationSuccess: "Зареєстровано як {name}.",
    },
  },
};

let currentLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY) || "en";

const pageName = document.body.dataset.page || "all";
const statusArea = document.getElementById("statusArea");
const apiBaseInput = document.getElementById("apiBase");
const guestLoginForm = document.getElementById("guestLoginForm");
const registerGuestButton = document.getElementById("registerGuest");
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
const languageSelector = document.getElementById("languageSelector");
const loginPasswordInput = document.getElementById("loginPassword");

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

function resolveTranslation(key, language = currentLanguage) {
  const parts = key.split(".");
  let value = TRANSLATIONS[language];
  for (const part of parts) {
    if (!value || typeof value !== "object" || !(part in value)) {
      value = null;
      break;
    }
    value = value[part];
  }
  if (typeof value === "string") {
    return value;
  }
  if (language !== "en") {
    return resolveTranslation(key, "en");
  }
  return key;
}

function formatTranslation(template, vars = {}) {
  return template.replace(/\{(\w+)\}/g, (match, name) => {
    if (name in vars) {
      return vars[name];
    }
    return match;
  });
}

function t(key, vars = {}) {
  const template = resolveTranslation(key);
  return formatTranslation(template, vars);
}

function applyTranslations() {
  document.documentElement.lang = currentLanguage;
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const value = t(node.dataset.i18n);
    node.textContent = value;
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
    const value = t(node.dataset.i18nPlaceholder);
    node.placeholder = value;
  });
}

function setLanguage(language) {
  if (!TRANSLATIONS[language]) {
    return;
  }
  currentLanguage = language;
  localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  if (languageSelector) {
    languageSelector.value = language;
  }
  applyTranslations();
  setUserInfo();
  renderResources();
  renderDeckCount();
  renderHand();
  renderWorkspace();
}

function log(message, isError = false) {
  const prefix = new Date().toLocaleTimeString();
  const line = `[${prefix}] ${message}`;
  if (statusArea) {
    statusArea.textContent = `${line}\n${statusArea.textContent}`.trim();
    if (isError) {
      statusArea.classList.add("error");
    }
  } else {
    console[isError ? "error" : "log"](line);
  }
}

function apiUrl(path) {
  if (!apiBaseInput) {
    return path;
  }
  return `${apiBaseInput.value.replace(/\/$/, "")}${path}`;
}

function persistApiBase() {
  if (!apiBaseInput) return;
  const savedApiBase = localStorage.getItem(STORAGE_KEYS.apiBase);
  if (savedApiBase) {
    apiBaseInput.value = savedApiBase;
  }
  apiBaseInput.addEventListener("input", () => {
    localStorage.setItem(STORAGE_KEYS.apiBase, apiBaseInput.value.trim());
  });
}

function requireAdminToken() {
  if (!adminTokenInput) {
    throw new Error(t("messages.adminTokenRequired"));
  }
  const token = adminTokenInput.value.trim();
  if (!token) {
    throw new Error(t("messages.adminTokenRequired"));
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
  return Boolean(adminTokenInput && adminTokenInput.value.trim());
}

function syncAdminUi() {
  if (!adminTokenInput) return;
  const adminMode = hasAdminToken();
  adminOnlySections.forEach((section) => {
    section.hidden = !adminMode;
  });
  [refreshAdminDataButton, refreshCardsButton, refreshDecksButton].forEach((button) => {
    if (button) {
      button.disabled = !adminMode;
    }
  });
}

function setUserInfo() {
  if (!userInfo) return;
  if (!currentUser) {
    userInfo.textContent = t("login.notSignedIn");
    return;
  }
  userInfo.innerHTML = `<strong>${currentUser.display_name}</strong> (ID: ${currentUser.id})`;
}

function handleAuthFailure() {
  log(t("messages.sessionExpired"), true);
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
    const label = t(`game.resources.${key}`);
    pill.textContent = `${label}: ${value}`;
    resourceBar.appendChild(pill);
  });
}

function renderDeckCount() {
  if (!deckCount) return;
  deckCount.textContent = deckCards.length
    ? t("messages.deckCountLabel", {
        count: deckCards.length,
        suffix: deckCards.length === 1 ? "" : "s",
      })
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

function renderHand() {
  if (!handList) return;
  renderCardList(handList, handCards, {
    emptyText: t("game.hand.empty"),
    actions: [
      {
        label: t("game.hand.moveToWorkspace"),
        handler: moveHandToWorkspace,
      },
    ],
  });
}

function renderWorkspace() {
  if (!workspaceList) return;
  renderCardList(workspaceList, workspaceCards, {
    emptyText: t("game.workspace.empty"),
    actions: [
      {
        label: t("game.workspace.returnToHand"),
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
  if (!authToken || !gameSection) return;
  try {
    const response = await fetch(apiUrl("/cards"));
    if (!response.ok) {
      throw new Error(t("messages.unableToLoadDeck", { status: response.status }));
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
    log(t("messages.gameplayReady", { count: deckCards.length }));
  } catch (error) {
    log(error.message, true);
  }
}

function drawFromDeck() {
  if (!authToken) {
    log(t("messages.loginFirstDraw"), true);
    return;
  }
  if (!deckCards.length) {
    log(t("messages.deckEmpty"), true);
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
      log(t("messages.sessionRestored"));
      await loadRooms();
      await prepareGameplayArea();
    } catch (error) {
      handleAuthFailure();
    }
  }
}

function getGuestCredentials() {
  const displayNameInput = document.getElementById("displayName");
  if (!displayNameInput || !loginPasswordInput) {
    return null;
  }
  const displayName = displayNameInput.value.trim();
  const password = loginPasswordInput.value.trim();
  if (!displayName) {
    log(t("messages.displayNameRequired"), true);
    return null;
  }
  if (!password) {
    log(t("messages.passwordRequired"), true);
    return null;
  }
  return { displayName, password };
}

async function authenticateGuest(successMessageKey) {
  const credentials = getGuestCredentials();
  if (!credentials) return;

  try {
    if (apiBaseInput) {
      localStorage.setItem(STORAGE_KEYS.apiBase, apiBaseInput.value.trim());
    }

    const response = await fetch(apiUrl("/auth/login"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        provider: "guest",
        display_name: credentials.displayName,
        password: credentials.password,
      }),
    });

    if (!response.ok) {
      throw new Error(t("messages.loginFailed", { status: response.status }));
    }

    const data = await response.json();
    setAuthSession(data.access_token, data.user);
    log(t(successMessageKey, { name: currentUser.display_name }));
    setUserInfo();
    const redirectTarget = document.body.dataset.redirectAfterAuth;
    if (redirectTarget) {
      window.location.href = redirectTarget;
      return;
    }
    await loadRooms();
    await prepareGameplayArea();
  } catch (error) {
    log(error.message, true);
  }
}

async function handleGuestLogin(event) {
  event.preventDefault();
  await authenticateGuest("messages.loginSuccess");
}

async function handleGuestRegistration(event) {
  event.preventDefault();
  await authenticateGuest("messages.registrationSuccess");
}

async function loadRooms() {
  if (!roomsList) return;
  try {
    const response = await fetch(apiUrl("/rooms"));
    if (!response.ok) {
      if (response.status === 401) {
        handleAuthFailure();
      }
      throw new Error(t("messages.unableToLoadRooms", { status: response.status }));
    }
    const rooms = await response.json();
    renderRooms(rooms);
    log(t("messages.roomsLoaded", { count: rooms.length }));
  } catch (error) {
    log(error.message, true);
  }
}

function renderRooms(rooms) {
  if (!roomsList) return;
  roomsList.innerHTML = "";
  if (!rooms.length) {
    roomsList.innerHTML = `<li class="muted">${t("rooms.list.empty")}</li>`;
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
      `${t("rooms.meta.host")}: ${room.host_user_id}`,
      `${t("rooms.meta.code")}: ${room.code}`,
      `${t("rooms.meta.players")}: ${room.max_players}`,
      `${t("rooms.meta.spectators")}: ${room.max_spectators}`,
      `${t("rooms.meta.visibility")}: ${room.visibility}`,
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
  const maxPlayers = parseInt(document.getElementById("maxPlayers").value, 10);
  const maxSpectators = parseInt(
    document.getElementById("maxSpectators").value,
    10
  );
  if (!authToken) {
    log(t("messages.loginRequiredRoom"), true);
    return;
  }
  if (!roomName) {
    log(t("messages.roomNameRequired"), true);
    return;
  }
  if (Number.isNaN(maxPlayers)) {
    log(t("messages.maxPlayersRequired"), true);
    return;
  }
  if (Number.isNaN(maxSpectators)) {
    log(t("messages.spectatorsRequired"), true);
    return;
  }

  try {
    const response = await fetch(apiUrl("/rooms"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        name: roomName,
        max_players: maxPlayers,
        max_spectators: maxSpectators,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      if (response.status === 401) {
        handleAuthFailure();
      }
      throw new Error(
        t("messages.createRoomFailed", { status: response.status, detail: errText })
      );
    }

    const room = await response.json();
    log(t("messages.roomCreated", { name: room.name, code: room.code }));
    document.getElementById("roomName").value = "";
    await loadRooms();
    await prepareGameplayArea();
  } catch (error) {
    log(error.message, true);
  }
}

function renderCards(cards) {
  cardsList.innerHTML = "";
  if (!cards.length) {
    cardsList.innerHTML = `<li class="muted">${t("cards.listEmpty")}</li>`;
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

    const description = document.createElement("div");
    description.className = "muted";
    description.textContent = card.description;

    const actions = document.createElement("div");
    actions.className = "item-actions";
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "ghost";
    deleteButton.textContent = t("cards.delete");
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
    decksList.innerHTML = `<li class="muted">${t("decks.listEmpty")}</li>`;
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
    exportButton.addEventListener("click", () => exportDeck(deck.id));
    actions.appendChild(exportButton);
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "ghost";
    deleteButton.textContent = t("decks.delete");
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
  if (!cardsList || !adminTokenInput) return;
  try {
    const response = await fetch(apiUrl("/admin/cards"), {
      headers: { "X-Admin-Token": requireAdminToken() },
    });
    if (!response.ok) {
      throw new Error(t("messages.unableLoadCards", { status: response.status }));
    }
    const cards = await response.json();
    renderCards(cards);
    log(t("messages.cardsLoaded", { count: cards.length }));
  } catch (error) {
    log(error.message, true);
  }
}

async function loadDecks() {
  if (!decksList || !adminTokenInput) return;
  try {
    const response = await fetch(apiUrl("/admin/decks"), {
      headers: { "X-Admin-Token": requireAdminToken() },
    });
    if (!response.ok) {
      throw new Error(t("messages.unableLoadDecks", { status: response.status }));
    }
    const decks = await response.json();
    renderDecks(decks);
    log(t("messages.decksLoaded", { count: decks.length }));
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
    log(t("messages.cardFieldsRequired"), true);
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
      throw new Error(
        t("messages.createCardFailed", { status: response.status, detail: errText })
      );
    }

    const card = await response.json();
    log(t("messages.cardCreated", { name: card.name, id: card.id }));
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
    log(t("messages.deckNameRequired"), true);
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
      throw new Error(
        t("messages.createDeckFailed", { status: response.status, detail: errText })
      );
    }

    const deck = await response.json();
    log(t("messages.deckCreated", { name: deck.name, id: deck.id }));
    deckForm.reset();
    await loadDecks();
  } catch (error) {
    log(error.message, true);
  }
}

async function deleteCard(cardId) {
  if (!confirm(t("messages.deleteCardConfirm", { id: cardId }))) return;
  try {
    const response = await fetch(apiUrl(`/admin/cards/${cardId}`), {
      method: "DELETE",
      headers: { "X-Admin-Token": requireAdminToken() },
    });
    if (!response.ok) {
      const errText = await response.text();
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

async function deleteDeck(deckId) {
  if (!confirm(t("messages.deleteDeckConfirm", { id: deckId }))) return;
  try {
    const response = await fetch(apiUrl(`/admin/decks/${deckId}`), {
      method: "DELETE",
      headers: { "X-Admin-Token": requireAdminToken() },
    });
    if (!response.ok) {
      const errText = await response.text();
      throw new Error(
        t("messages.deleteDeckFailed", { status: response.status, detail: errText })
      );
    }
    log(t("messages.deletedDeck", { id: deckId }));
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
      throw new Error(
        t("messages.exportDeckFailed", { status: response.status, detail: errText })
      );
    }
    const payload = await response.json();
    const pretty = JSON.stringify(payload, null, 2);
    log(t("messages.exportedDeck", { id: deckId, payload: pretty }));
  } catch (error) {
    log(error.message, true);
  }
}

async function loadAdminData() {
  await Promise.all([loadCards(), loadDecks()]);
}

function wireEvents() {
  if (guestLoginForm) guestLoginForm.addEventListener("submit", handleGuestLogin);
  if (registerGuestButton)
    registerGuestButton.addEventListener("click", handleGuestRegistration);
  if (roomForm) roomForm.addEventListener("submit", createRoom);
  if (refreshRoomsButton) refreshRoomsButton.addEventListener("click", loadRooms);
  if (adminTokenInput) adminTokenInput.addEventListener("input", syncAdminUi);
  if (refreshAdminDataButton)
    refreshAdminDataButton.addEventListener("click", loadAdminData);
  if (refreshCardsButton) refreshCardsButton.addEventListener("click", loadCards);
  if (refreshDecksButton) refreshDecksButton.addEventListener("click", loadDecks);
  if (cardForm) cardForm.addEventListener("submit", createCard);
  if (deckForm) deckForm.addEventListener("submit", createDeck);
  if (drawCardButton) drawCardButton.addEventListener("click", drawFromDeck);
  if (resetGameplayButton)
    resetGameplayButton.addEventListener("click", prepareGameplayArea);
  if (languageSelector)
    languageSelector.addEventListener("change", (event) => {
      setLanguage(event.target.value);
    });
}

persistApiBase();
setLanguage(currentLanguage);
wireEvents();
syncAdminUi();
setUserInfo();
restoreSession();
log(t("messages.ready"));
