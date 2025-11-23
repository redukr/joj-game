const STORAGE_KEYS = {
  authToken: "joj-auth-token",
  user: "joj-user",
  apiBase: "joj-api-base",
  roomCode: "joj-room-code",
};

const LANGUAGE_STORAGE_KEY = "joj-language";

const TRANSLATIONS = {
  en: {
    title: "JOJ Game Web Client",
    subtitle: "Interact with the FastAPI server from your browser.",
    layout: {
      game: {
        heading: "Game Lobby",
        subheading:
          "Create or browse rooms and interact with the gameplay workspace.",
      },
      admin: {
        heading: "Administrative tools",
        subheading:
          "Manage cards and decks with an admin token supplied by the server.",
      },
      management: {
        heading: "Management hub",
        subheading:
          "Choose which module to manage: system, players, cards, or decks.",
      },
    },
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
      status: {
        idle: "Enter the admin token to unlock tools.",
        checking: "Checking admin token...",
        valid: "Admin token validated.",
        invalid: "Admin token invalid.",
      },
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
        status: "Status",
        joinable: "Joinable",
        created: "Created",
      },
      status: { active: "Active", archived: "Archived" },
      join: {
        cta: "Join room",
        joined: "Joined",
        current: "Current room",
        joinable: "Yes",
        closed: "Closed",
        full: "Full",
      },
    },
    game: {
      heading: "Gameplay workspace",
      draw: "Draw card",
      reset: "Reset table",
      hint:
        "Available after you join a room. Cards are pulled from the server deck so you can try drawing and arranging them locally.",
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
        time: "Time",
        timePlaceholder: "+1 or -1",
        reputation: "Reputation",
        reputationPlaceholder: "+1 or -1",
        discipline: "Discipline",
        disciplinePlaceholder: "+1 or -1",
        documents: "Documents",
        documentsPlaceholder: "+1 or -1",
        technology: "Technology",
        technologyPlaceholder: "+1 or -1",
        submit: "Create card",
      },
      listEmpty: "No cards yet. Create one above.",
      noCategory: "No category",
      noEffects: "No resource effects",
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
      import: {
        label: "Import deck JSON",
        placeholder: '{"deck": {"name": "Starter", "card_ids": []}, "cards": []}',
        hint: "Paste deck export JSON to recreate decks and cards.",
        submit: "Import JSON",
      },
      delete: "Delete",
    },
    status: { heading: "Status" },
    session: {
      apiLabel: "API base",
      userLabel: "User",
      userGuest: "Guest (not signed in)",
      roomLabel: "Room",
      roomNone: "Not joined",
      adminLabel: "Admin",
      adminMissing: "Token missing",
    },
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
      joinRoomRequired: "Join a room first to use the gameplay workspace.",
      deckCountLabel: "{count} card{suffix}",
      roomsLoaded: "Loaded {count} room(s).",
      unableToLoadRooms: "Unable to load rooms: {status}",
      roomNameRequired: "Room name is required",
      maxPlayersRequired: "Enter how many players can join the room.",
      spectatorsRequired: "Enter how many spectators are allowed (0-10).",
      createRoomFailed: "Create room failed: {status} {detail}",
      roomCreated: 'Created room "{name}" (code: {code}).',
      roomJoined: 'Joined room "{name}" (code: {code}).',
      unableToJoinRoom: "Unable to join room: {status} {detail}",
      cardsLoaded: "Loaded {count} card(s).",
      decksLoaded: "Loaded {count} deck(s).",
      unableLoadCards: "Unable to load cards: {status}",
      unableLoadDecks: "Unable to load decks: {status}",
      createCardFailed: "Create card failed: {status} {detail}",
      createDeckFailed: "Create deck failed: {status} {detail}",
      invalidAdminToken: "Invalid admin token.",
      adminTokenCheckFailed: "Unable to verify admin token: {status}",
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
      deckImported: 'Imported deck "{name}" (#{id}).',
      importDeckInvalid: "Provide valid deck JSON to import.",
      importDeckFailed: "Import failed: {status} {detail}",
      ready: "Ready. Set your API base URL, register or sign in, or manage decks with the admin token.",
      loginFailed: "Login failed: {status}",
      registrationSuccess: "Registered as {name}.",
    },
  },
  uk: {
    title: "Вебклієнт JOJ Game",
    subtitle: "Працюйте з сервером FastAPI просто у браузері.",
    layout: {
      game: {
        heading: "Ігрове лобі",
        subheading:
          "Створюйте або переглядайте кімнати та працюйте з ігровим простором.",
      },
      admin: {
        heading: "Адміністративні інструменти",
        subheading:
          "Керуйте картами та колодами за допомогою адмін-токена від сервера.",
      },
      management: {
        heading: "Центр керування",
        subheading:
          "Оберіть модуль для керування: система, гравці, карти чи колоди.",
      },
    },
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
      status: {
        idle: "Введіть адмін-токен, щоб розблокувати інструменти.",
        checking: "Перевіряємо адмін-токен...",
        valid: "Адмін-токен підтверджено.",
        invalid: "Адмін-токен недійсний.",
      },
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
        status: "Статус",
        joinable: "Можна приєднатися",
        created: "Створено",
      },
      status: { active: "Активна", archived: "В архіві" },
      join: {
        cta: "Приєднатися",
        joined: "Приєднано",
        current: "Поточна кімната",
        joinable: "Так",
        closed: "Закрито",
        full: "Заповнено",
      },
    },
    game: {
      heading: "Робочий простір гри",
      draw: "Взяти карту",
      reset: "Перезавантажити стіл",
      hint:
        "Доступно після приєднання до кімнати. Карти беруться з сервера, щоб ви могли тягнути та розкладати їх локально.",
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
        time: "Час",
        timePlaceholder: "+1 або -1",
        reputation: "Репутація",
        reputationPlaceholder: "+1 або -1",
        discipline: "Дисципліна",
        disciplinePlaceholder: "+1 або -1",
        documents: "Документи",
        documentsPlaceholder: "+1 або -1",
        technology: "Технології",
        technologyPlaceholder: "+1 або -1",
        submit: "Створити карту",
      },
      listEmpty: "Карт ще немає. Створіть першу вище.",
      noCategory: "Без категорії",
      noEffects: "Без зміни ресурсів",
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
      import: {
        label: "Імпортувати колоду з JSON",
        placeholder: '{"deck": {"name": "Стартова", "card_ids": []}, "cards": []}',
        hint: "Вставте експортований JSON, щоб відновити колоди та карти.",
        submit: "Імпортувати JSON",
      },
      delete: "Видалити",
    },
    status: { heading: "Статус" },
    session: {
      apiLabel: "API база",
      userLabel: "Користувач",
      userGuest: "Гість (не авторизовано)",
      roomLabel: "Кімната",
      roomNone: "Не приєднано",
      adminLabel: "Адмін",
      adminMissing: "Немає токена",
    },
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
      joinRoomRequired: "Приєднайтеся до кімнати, щоб користуватися ігровим простором.",
      deckCountLabel: "{count} карт(и)",
      roomsLoaded: "Завантажено {count} кімнат(и).",
      unableToLoadRooms: "Не вдалося завантажити кімнати: {status}",
      roomNameRequired: "Потрібна назва кімнати",
      maxPlayersRequired: "Вкажіть, скільки гравців може приєднатися.",
      spectatorsRequired: "Вкажіть, скільки глядачів дозволено (0-10).",
      createRoomFailed: "Не вдалося створити кімнату: {status} {detail}",
      roomCreated: 'Створено кімнату "{name}" (код: {code}).',
      roomJoined: 'Приєднано до кімнати "{name}" (код: {code}).',
      unableToJoinRoom: "Не вдалося приєднатися: {status} {detail}",
      cardsLoaded: "Завантажено {count} карт(и).",
      decksLoaded: "Завантажено {count} колод(и).",
      unableLoadCards: "Не вдалося завантажити карти: {status}",
      unableLoadDecks: "Не вдалося завантажити колоди: {status}",
      createCardFailed: "Не вдалося створити карту: {status} {detail}",
      createDeckFailed: "Не вдалося створити колоду: {status} {detail}",
      invalidAdminToken: "Невірний адмін-токен.",
      adminTokenCheckFailed: "Не вдалося перевірити адмін-токен: {status}",
      deleteCardFailed: "Не вдалося видалити карту: {status} {detail}",
      deleteDeckFailed: "Не вдалося видалити колоду: {status} {detail}",
      exportDeckFailed: "Не вдалося експортувати: {status} {detail}",
      deckImported: 'Імпортовано колоду "{name}" (#{id}).',
      importDeckInvalid: "Додайте коректний JSON для імпорту.",
      importDeckFailed: "Не вдалося імпортувати: {status} {detail}",
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
const sessionApiChip = document.getElementById("sessionApiChip");
const sessionUserChip = document.getElementById("sessionUserChip");
const sessionRoomChip = document.getElementById("sessionRoomChip");
const sessionAdminChip = document.getElementById("sessionAdminChip");
const adminTokenInput = document.getElementById("adminToken");
const refreshAdminDataButton = document.getElementById("refreshAdminData");
const refreshCardsButton = document.getElementById("refreshCards");
const refreshDecksButton = document.getElementById("refreshDecks");
const adminTokenStatusLabel = document.getElementById("adminTokenStatus");
const cardForm = document.getElementById("cardForm");
const deckForm = document.getElementById("deckForm");
const deckImportPayload = document.getElementById("deckImportPayload");
const importDeckButton = document.getElementById("importDeck");
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
let currentRoomCode = localStorage.getItem(STORAGE_KEYS.roomCode);
let deckCards = [];
let handCards = [];
let workspaceCards = [];
let adminTokenStatus = { value: "", isValid: false, isChecking: false };
let adminValidationTimer = null;

const STARTING_RESOURCES = {
  time: 1,
  reputation: 1,
  discipline: 1,
  documents: 1,
  technology: 1,
};

const RESOURCE_KEYS = ["time", "reputation", "discipline", "documents", "technology"];

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
  syncSessionBar();
}

function setChipText(chip, { label, value, tone = null, hidden = false }) {
  if (!chip) return;
  const labelNode = chip.querySelector(".chip-label");
  const valueNode = chip.querySelector(".chip-value");
  if (labelNode) labelNode.textContent = label;
  if (valueNode) valueNode.textContent = value;
  chip.hidden = hidden;
  ["success", "warning"].forEach((cls) => chip.classList.remove(cls));
  if (tone) {
    chip.classList.add(tone);
  }
}

function syncSessionBar() {
  if (sessionApiChip && apiBaseInput) {
    const apiValue = apiBaseInput.value.trim() || t("session.userGuest");
    setChipText(sessionApiChip, {
      label: t("session.apiLabel"),
      value: apiValue,
      tone: apiValue ? null : "warning",
    });
  }

  if (sessionUserChip) {
    const isLoggedIn = Boolean(currentUser && authToken);
    setChipText(sessionUserChip, {
      label: t("session.userLabel"),
      value: isLoggedIn
        ? `${currentUser.display_name} (#${currentUser.id})`
        : t("session.userGuest"),
      tone: isLoggedIn ? "success" : "warning",
    });
  }

  if (sessionRoomChip) {
    setChipText(sessionRoomChip, {
      label: t("session.roomLabel"),
      value: currentRoomCode || t("session.roomNone"),
      hidden: !currentUser && !currentRoomCode,
      tone: currentRoomCode ? "success" : "warning",
    });
  }

  if (sessionAdminChip && adminTokenInput) {
    const tone = adminTokenStatus.isValid
      ? "success"
      : adminTokenStatus.value
      ? "warning"
      : null;
    const label = t("session.adminLabel");
    let value = t("session.adminMissing");
    if (adminTokenStatus.isChecking) {
      value = t("admin.status.checking");
    } else if (adminTokenStatus.isValid) {
      value = t("admin.status.valid");
    } else if (adminTokenStatus.value) {
      value = t("admin.status.invalid");
    }
    setChipText(sessionAdminChip, {
      label,
      value,
      hidden: !adminTokenInput,
      tone,
    });
  }
}

function withBusyState(button, task) {
  const targetButton = button || null;
  const originalText = targetButton?.textContent;
  if (targetButton) {
    targetButton.disabled = true;
    targetButton.dataset.originalText = originalText || "";
    targetButton.classList.add("is-busy");
    targetButton.setAttribute("aria-busy", "true");
    if (originalText && !originalText.endsWith("…")) {
      targetButton.textContent = `${originalText}…`;
    }
  }

  const finalize = () => {
    if (!targetButton) return;
    targetButton.disabled = false;
    targetButton.classList.remove("is-busy");
    targetButton.removeAttribute("aria-busy");
    if (targetButton.dataset.originalText) {
      targetButton.textContent = targetButton.dataset.originalText;
    }
  };

  const result = task();
  if (result && typeof result.finally === "function") {
    return result.finally(finalize);
  }
  finalize();
  return result;
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
  syncAdminUi();
}

function log(message, isError = false) {
  const prefix = new Date().toLocaleTimeString();
  const line = `[${prefix}] ${message}`;
  if (statusArea) {
    statusArea.textContent = `${line}\n${statusArea.textContent}`.trim();
    statusArea.classList.toggle("error", isError);
    statusArea.setAttribute("aria-label", line);
    if (isError) {
      statusArea.scrollTop = 0;
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
    syncSessionBar();
  });
  syncSessionBar();
}

function requireAdminToken() {
  if (!adminTokenInput) {
    throw new Error(t("messages.adminTokenRequired"));
  }
  const token = adminTokenInput.value.trim();
  if (!token) {
    throw new Error(t("messages.adminTokenRequired"));
  }
  if (!adminTokenStatus.isValid || adminTokenStatus.value !== token) {
    throw new Error(t("messages.invalidAdminToken"));
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
    setCurrentRoom(null);
    resetGameplayState();
  }
  syncSessionBar();
}

function setCurrentRoom(roomCode) {
  const normalized = roomCode || null;
  const previous = currentRoomCode;
  currentRoomCode = normalized;
  if (normalized) {
    localStorage.setItem(STORAGE_KEYS.roomCode, normalized);
  } else {
    localStorage.removeItem(STORAGE_KEYS.roomCode);
  }
  if (previous !== normalized) {
    resetGameplayState();
  }
  setUserInfo();
  syncSessionBar();
}

function syncRoomSelection(rooms) {
  const joinedCodes = rooms.filter((room) => room.is_joined).map((room) => room.code);
  if (joinedCodes.includes(currentRoomCode)) {
    return;
  }
  if (joinedCodes.length) {
    setCurrentRoom(joinedCodes[0]);
  } else {
    setCurrentRoom(null);
  }
}

function requireRoomMembership(showMessage = true) {
  if (!currentRoomCode) {
    if (showMessage) {
      log(t("messages.joinRoomRequired"), true);
    }
    return false;
  }
  return true;
}

function adminHeaders() {
  return {
    "Content-Type": "application/json",
    "X-Admin-Token": requireAdminToken(),
  };
}

function scheduleAdminTokenValidation() {
  if (!adminTokenInput) return;
  clearTimeout(adminValidationTimer);
  const token = adminTokenInput.value.trim();
  adminTokenStatus = { value: token, isValid: false, isChecking: Boolean(token) };
  syncAdminUi();
  if (!token) {
    return;
  }
  adminValidationTimer = setTimeout(validateAdminToken, 300);
}

async function validateAdminToken() {
  const token = adminTokenStatus.value;
  if (!token) {
    syncAdminUi();
    return;
  }
  adminTokenStatus.isChecking = true;
  syncAdminUi();
  try {
    const response = await fetch(apiUrl("/admin/verify"), {
      headers: { "X-Admin-Token": token },
    });
    if (adminTokenStatus.value !== token) {
      return;
    }
    if (!response.ok) {
      adminTokenStatus.isValid = false;
      log(t("messages.adminTokenCheckFailed", { status: response.status }), true);
    } else {
      adminTokenStatus.isValid = true;
    }
  } catch (error) {
    adminTokenStatus.isValid = false;
    log(error.message, true);
  } finally {
    adminTokenStatus.isChecking = false;
    syncAdminUi();
  }
}

function syncAdminUi() {
  if (!adminTokenInput) return;
  const adminMode = adminTokenStatus.isValid;
  const adminBusy = adminTokenStatus.isChecking;
  adminOnlySections.forEach((section) => {
    section.hidden = !adminMode;
  });
  [refreshAdminDataButton, refreshCardsButton, refreshDecksButton].forEach((button) => {
    if (button) {
      button.disabled = !adminMode || adminBusy;
    }
  });
  if (adminTokenStatusLabel) {
    let statusKey = "admin.status.idle";
    if (adminTokenStatus.isChecking) {
      statusKey = "admin.status.checking";
    } else if (adminMode) {
      statusKey = "admin.status.valid";
    } else if (adminTokenStatus.value) {
      statusKey = "admin.status.invalid";
    }
    adminTokenStatusLabel.textContent = t(statusKey);
    adminTokenStatusLabel.hidden = !adminTokenStatus.value;
    adminTokenStatusLabel.classList.toggle("success", adminMode);
    adminTokenStatusLabel.classList.toggle("warning", adminBusy);
  }
  syncSessionBar();
}

function setUserInfo() {
  if (!userInfo) return;
  if (!currentUser) {
    userInfo.textContent = t("login.notSignedIn");
    syncSessionBar();
    return;
  }
  const roomNote = currentRoomCode
    ? ` | ${t("rooms.meta.code")}: <strong>${currentRoomCode}</strong>`
    : "";
  userInfo.innerHTML = `<strong>${currentUser.display_name}</strong> (ID: ${currentUser.id})${roomNote}`;
  syncSessionBar();
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

async function prepareGameplayArea(warnIfNotJoined = false) {
  if (!authToken || !gameSection || !currentRoomCode) {
    if (gameSection) {
      gameSection.hidden = true;
    }
    if (warnIfNotJoined && !currentRoomCode) {
      log(t("messages.joinRoomRequired"), true);
    }
    return;
  }
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

async function joinRoom(roomCode) {
  if (!authToken) {
    log(t("messages.loginRequiredRoom"), true);
    return;
  }
  try {
    const response = await fetch(apiUrl(`/rooms/${roomCode}/join`), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ as_spectator: false }),
    });
    if (!response.ok) {
      const errText = await response.text();
      if (response.status === 401) {
        handleAuthFailure();
      }
      throw new Error(
        t("messages.unableToJoinRoom", { status: response.status, detail: errText })
      );
    }
    const room = await response.json();
    setCurrentRoom(room.code);
    log(t("messages.roomJoined", { name: room.name, code: room.code }));
    await loadRooms();
    await prepareGameplayArea();
  } catch (error) {
    log(error.message, true);
  }
}

function drawFromDeck() {
  if (!authToken) {
    log(t("messages.loginFirstDraw"), true);
    return;
  }
  if (!requireRoomMembership(true)) {
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

async function authenticateGuest(successMessageKey, button) {
  const credentials = getGuestCredentials();
  if (!credentials) return;

  await withBusyState(button, async () => {
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
  });
}

async function handleGuestLogin(event) {
  event.preventDefault();
  await authenticateGuest("messages.loginSuccess", event.submitter);
}

async function handleGuestRegistration(event) {
  event.preventDefault();
  await authenticateGuest("messages.registrationSuccess", event.submitter);
}

async function loadRooms(event) {
  if (!roomsList) return;
  const button = event?.currentTarget || refreshRoomsButton;
  await withBusyState(button, async () => {
    try {
      const headers = {};
      if (authToken) {
        headers.Authorization = `Bearer ${authToken}`;
      }
      const response = await fetch(apiUrl("/rooms"), { headers });
      if (!response.ok) {
        if (response.status === 401) {
          handleAuthFailure();
        }
        throw new Error(t("messages.unableToLoadRooms", { status: response.status }));
      }
      const rooms = await response.json();
      if (authToken) {
        syncRoomSelection(rooms);
      }
      setUserInfo();
      renderRooms(rooms);
      log(t("messages.roomsLoaded", { count: rooms.length }));
    } catch (error) {
      log(error.message, true);
    }
  });
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
    if (room.code === currentRoomCode) {
      item.classList.add("active-room");
    }
    const title = document.createElement("div");
    title.className = "title";
    title.textContent = room.name;
    if (room.code === currentRoomCode) {
      const currentBadge = document.createElement("span");
      currentBadge.className = "pill";
      currentBadge.textContent = t("rooms.join.current");
      title.appendChild(currentBadge);
    }

    const meta = document.createElement("div");
    meta.className = "meta";
    const statusLabel = t(`rooms.status.${room.status}`);
    const joinableLabel =
      room.status !== "active"
        ? t("rooms.join.closed")
        : room.is_joinable
        ? t("rooms.join.joinable")
        : t("rooms.join.full");
    const created = new Date(room.created_at).toLocaleString();
    const metaBits = [
      `${t("rooms.meta.host")}: ${room.host_user_id}`,
      `${t("rooms.meta.code")}: ${room.code}`,
      `${t("rooms.meta.players")}: ${room.player_count}/${room.max_players}`,
      `${t("rooms.meta.spectators")}: ${room.spectator_count}/${room.max_spectators}`,
      `${t("rooms.meta.visibility")}: ${room.visibility}`,
      `${t("rooms.meta.status")}: ${statusLabel}`,
      `${t("rooms.meta.joinable")}: ${joinableLabel}`,
      `${t("rooms.meta.created")}: ${created}`,
    ];
    meta.textContent = metaBits.join(" | ");

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
      if (!room.is_joinable) {
        joinButton.title = joinableLabel;
      }
      if (!authToken) {
        joinButton.title = t("messages.loginRequiredRoom");
      }
      joinButton.addEventListener("click", () => joinRoom(room.code));
      actions.appendChild(joinButton);
    }

    item.appendChild(title);
    item.appendChild(meta);
    item.appendChild(actions);
    roomsList.appendChild(item);
  });
}

async function createRoom(event) {
  event.preventDefault();
  const button = event.submitter;
  const roomName = document.getElementById("roomName").value.trim();
  const maxPlayers = parseInt(document.getElementById("maxPlayers").value, 10);
  const maxSpectators = parseInt(
    document.getElementById("maxSpectators").value,
    10
  );
  await withBusyState(button, async () => {
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
      setCurrentRoom(room.code);
      log(t("messages.roomCreated", { name: room.name, code: room.code }));
      document.getElementById("roomName").value = "";
      await loadRooms();
      await prepareGameplayArea();
    } catch (error) {
      log(error.message, true);
    }
  });
}

function formatCardEffects(card) {
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
    deleteButton.addEventListener("click", () => deleteCard(card.id));
    actions.appendChild(deleteButton);

    item.appendChild(title);
    item.appendChild(meta);
    item.appendChild(effects);
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

async function loadCards(event) {
  if (!cardsList || !adminTokenInput) return;
  const button = event?.currentTarget || refreshCardsButton;
  await withBusyState(button, async () => {
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
  });
}

async function loadDecks(event) {
  if (!decksList || !adminTokenInput) return;
  const button = event?.currentTarget || refreshDecksButton;
  await withBusyState(button, async () => {
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
  });
}

async function createCard(event) {
  event.preventDefault();
  const button = event.submitter;
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
  await withBusyState(button, async () => {
    if (!name || !description) {
      log(t("messages.cardFieldsRequired"), true);
      return;
    }

    try {
      const response = await fetch(apiUrl("/admin/cards"), {
        method: "POST",
        headers: adminHeaders(),
        body: JSON.stringify({
          name,
          description,
          category: category || null,
          ...resourcePayload,
        }),
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
  });
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
  const button = event.submitter;
  const name = document.getElementById("deckName").value.trim();
  const description = document.getElementById("deckDescription").value.trim();
  const cardIdsInput = document.getElementById("deckCardIds").value;
  const card_ids = parseCardIds(cardIdsInput);
  await withBusyState(button, async () => {
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
  });
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

async function importDeck(event) {
  const button = event?.currentTarget || importDeckButton;
  if (!deckImportPayload) return;
  const raw = deckImportPayload.value.trim();
  if (!raw) {
    log(t("messages.importDeckInvalid"), true);
    return;
  }

  let payload;
  try {
    payload = JSON.parse(raw);
  } catch (error) {
    log(t("messages.importDeckInvalid"), true);
    return;
  }

  await withBusyState(button, async () => {
    try {
      const response = await fetch(apiUrl("/admin/decks/import"), {
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
      log(t("messages.deckImported", { name: deck.name, id: deck.id }));
      deckImportPayload.value = "";
      await loadDecks();
    } catch (error) {
      log(error.message, true);
    }
  });
}

async function loadAdminData(event) {
  const button = event?.currentTarget || refreshAdminDataButton;
  await withBusyState(button, () => Promise.all([loadCards(), loadDecks()]));
}

function wireEvents() {
  if (guestLoginForm) guestLoginForm.addEventListener("submit", handleGuestLogin);
  if (registerGuestButton)
    registerGuestButton.addEventListener("click", handleGuestRegistration);
  if (roomForm) roomForm.addEventListener("submit", createRoom);
  if (refreshRoomsButton) refreshRoomsButton.addEventListener("click", loadRooms);
  if (adminTokenInput) {
    adminTokenInput.addEventListener("input", scheduleAdminTokenValidation);
    adminTokenInput.addEventListener("blur", scheduleAdminTokenValidation);
  }
  if (refreshAdminDataButton)
    refreshAdminDataButton.addEventListener("click", loadAdminData);
  if (refreshCardsButton) refreshCardsButton.addEventListener("click", loadCards);
  if (refreshDecksButton) refreshDecksButton.addEventListener("click", loadDecks);
  if (cardForm) cardForm.addEventListener("submit", createCard);
  if (deckForm) deckForm.addEventListener("submit", createDeck);
  if (importDeckButton) importDeckButton.addEventListener("click", importDeck);
  if (drawCardButton) drawCardButton.addEventListener("click", drawFromDeck);
  if (resetGameplayButton)
    resetGameplayButton.addEventListener("click", () => prepareGameplayArea(true));
  if (languageSelector)
    languageSelector.addEventListener("change", (event) => {
      setLanguage(event.target.value);
    });
}

persistApiBase();
setLanguage(currentLanguage);
wireEvents();
scheduleAdminTokenValidation();
setUserInfo();
restoreSession();
log(t("messages.ready"));
