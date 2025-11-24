// ==========================
// BLOCK 1 — IMPORTS & BOOTSTRAP
// ==========================
import { t, initI18n } from "./modules/i18n.js";
import * as UI from "./modules/ui.js";
import {
  login as authLogin,
  register as authRegister,
  logout as authLogout,
  restoreSession as restoreStoredSession,
  setAuthSession as persistAuthSession,
} from "./modules/auth.js";
import * as API from "./modules/api.js";
import * as Rooms from "./modules/rooms.js";
import { state } from "./modules/state.js";
import * as Game from "./modules/game.js";
import * as Validation from "./modules/validation.js";

initI18n();
window.t = t;
UI.updateAllLabels();

// ==========================
// BLOCK 2 — CONSTANTS & STORAGE KEYS
// ==========================

const STORAGE_KEYS = {
  apiBase: "joj-api-base",
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
        name: "Name",
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
      loggedOut: "Logged out. You can sign in again when ready.",
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
        name: "Назва",
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
      loggedOut: "Ви вийшли із сеансу. Можете увійти знову, коли будете готові.",
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
// ==========================
// BLOCK 3 — DOM ELEMENTS & UI HOOKS
// ==========================

const pageName = document.body.dataset.page || "all";
const statusArea = document.getElementById("statusArea");
const toast = document.getElementById("toast");
const apiBaseInput = document.getElementById("apiBase");
const guestLoginForm = document.getElementById("guestLoginForm");
const registerGuestButton = document.getElementById("registerGuest");
const loginFormError = document.getElementById("loginFormError");
const roomForm = document.getElementById("roomForm");
const roomsTableBody = document.getElementById("roomsTableBody");
const roomsTable = document.getElementById("roomsTable");
const refreshRoomsButton = document.getElementById("refreshRooms");
const roomFormError = document.getElementById("roomFormError");
const userInfo = document.getElementById("userInfo");
const sessionApiChip = document.getElementById("sessionApiChip");
const sessionUserChip = document.getElementById("sessionUserChip");
const sessionRoomChip = document.getElementById("sessionRoomChip");
const sessionAdminChip = document.getElementById("sessionAdminChip");
const navLoginLink = document.querySelector('[data-nav="login"]');
const navGameLink = document.querySelector('[data-nav="game"]');
const navManagementLink = document.querySelector('[data-nav="management"]');
const navAdminLink = document.querySelector('[data-nav="admin"]');
const navLogoutButton = document.getElementById("logoutButton");
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

let adminTokenStatus = { value: "", isValid: false, isChecking: false };
let adminValidationTimer = null;
let toastTimer = null;

const RESOURCE_KEYS = Game.RESOURCE_KEYS;

function getAuthToken() {
  return state.token;
}

function getCurrentUser() {
  return state.user;
}

function getCurrentRoomCode() {
  return Rooms.getCurrentRoomCode() || state.currentRoom;
}

await initI18n();
document.body.dispatchEvent(new Event("translationsReady"));

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


// [LEGACY TRANSLATION]
// This function is part of the old translation system.
// New UI uses modules/i18n.js → function T(key).
// Do not extend or modify this function anymore.
//function t(key, vars = {}) {
//  const template = resolveTranslation(key);
//  return formatTranslation(template, vars);
//}

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

function syncNavLinks() {
  const isLoggedIn = Boolean(getAuthToken() && getCurrentUser());

  if (navLoginLink) {
    navLoginLink.textContent = "LOGIN";
    navLoginLink.hidden = isLoggedIn;
  }

  if (navGameLink) {
    navGameLink.textContent = "GAME";
    navGameLink.hidden = !isLoggedIn;
  }

  if (navManagementLink) {
    navManagementLink.hidden = true;
  }

  if (navAdminLink) {
    navAdminLink.hidden = true;
  }

  if (navLogoutButton) {
    navLogoutButton.hidden = !isLoggedIn;
    navLogoutButton.disabled = !isLoggedIn;
  }
}

function syncSessionBar() {
  if (sessionApiChip && apiBaseInput) {
    const apiValue = state.apiBase?.trim() || apiBaseInput.value.trim() || t("session.userGuest");
    setChipText(sessionApiChip, {
      label: t("session.apiLabel"),
      value: apiValue,
      tone: apiValue ? null : "warning",
    });
  }

  if (sessionUserChip) {
    const user = getCurrentUser();
    const isLoggedIn = Boolean(user && getAuthToken());
    setChipText(sessionUserChip, {
      label: t("session.userLabel"),
      value: isLoggedIn ? `${user.display_name} (#${user.id})` : t("session.userGuest"),
      tone: isLoggedIn ? "success" : "warning",
    });
  }

  if (sessionRoomChip) {
    const currentRoomCode = getCurrentRoomCode();
    const hasUser = Boolean(getCurrentUser());
    setChipText(sessionRoomChip, {
      label: t("session.roomLabel"),
      value: currentRoomCode || t("session.roomNone"),
      hidden: !hasUser && !currentRoomCode,
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

  syncNavLinks();
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

function setFieldError(target, message = "") {
  if (!target) return;
  target.textContent = message;
}

function clearFieldErrors(...targets) {
  targets.filter(Boolean).forEach((target) => setFieldError(target));
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
  if (isError) {
    showToast(message, true);
  }
}

function translateValidationError(error) {
  if (error instanceof Validation.ValidationError) {
    return t(`messages.${error.code}`);
  }
  return null;
}

function setRoomFormError(message) {
  if (!roomFormError) return;
  roomFormError.textContent = message || "";
}

function persistApiBase() {
  if (!apiBaseInput) return;
  const savedApiBase = localStorage.getItem(STORAGE_KEYS.apiBase);
  if (savedApiBase) {
    apiBaseInput.value = savedApiBase;
    API.setApiBase(savedApiBase);
  }
  API.setApiBase(apiBaseInput.value.trim());
  apiBaseInput.addEventListener("input", () => {
    localStorage.setItem(STORAGE_KEYS.apiBase, apiBaseInput.value.trim());
    API.setApiBase(apiBaseInput.value.trim());
    syncSessionBar();
  });
  syncSessionBar();
}

function requireAdminToken() {
  const token = adminTokenInput?.value.trim();
  return Validation.ensureAdminToken({
    token,
    isValid: adminTokenStatus.isValid && adminTokenStatus.value === token,
  });
}

function applyAuthSession(token, user) {
  persistAuthSession(token, user);
  if (!token) {
    Rooms.setCurrentRoom(null);
  }
  syncSessionBar();
}

state.on("currentRoomChanged", (roomCode) => {
  resetGameplayState();
  setUserInfo();
  syncSessionBar();
});

state.on("roomsUpdated", (rooms) => {
  renderRooms(rooms);
});

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
    await API.verifyAdminToken(token);
    if (adminTokenStatus.value !== token) {
      return;
    }
    adminTokenStatus.isValid = true;
  } catch (error) {
    adminTokenStatus.isValid = false;
    const status = error.status ?? "unknown";
    log(t("messages.adminTokenCheckFailed", { status }), true);
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
  const user = getCurrentUser();
  if (!user) {
    userInfo.textContent = t("login.notSignedIn");
    syncSessionBar();
    return;
  }
  const roomCode = getCurrentRoomCode();
  const roomNote = roomCode
    ? ` | ${t("rooms.meta.code")}: <strong>${roomCode}</strong>`
    : "";
  userInfo.innerHTML = `<strong>${user.display_name}</strong> (ID: ${user.id})${roomNote}`;
  syncSessionBar();
}
// [AUTH BLOCK]

function handleAuthFailure() {
  log(t("messages.sessionExpired"), true);
  applyAuthSession(null, null);
  setUserInfo();
}
// [AUTH BLOCK]

function logoutUser() {
  authLogout();
  applyAuthSession(null, null);
  setUserInfo();
  log(t("messages.loggedOut"));
  if (pageName !== "auth") {
    window.location.href = "index.html";
  }
}

function renderGameplaySnapshot(snapshot = Game.getSnapshot()) {
  renderResources(snapshot.resources);
  renderDeckCount(snapshot.deckCount);
  renderHand(snapshot.hand);
  renderWorkspace(snapshot.workspace);
}

function resetGameplayState() {
  const snapshot = Game.reset();
  if (gameSection) {
    gameSection.hidden = true;
  }
  renderGameplaySnapshot(snapshot);
}

function renderResources(resources = Game.getSnapshot().resources) {
  if (!resourceBar) return;
  resourceBar.innerHTML = "";
  Object.entries(resources).forEach(([key, value]) => {
    const pill = document.createElement("div");
    pill.className = "resource-pill";
    const label = t(`game.resources.${key}`);
    pill.textContent = `${label}: ${value}`;
    resourceBar.appendChild(pill);
  });
}

function renderDeckCount(count = Game.getSnapshot().deckCount) {
  if (!deckCount) return;
  deckCount.textContent = count
    ? t("messages.deckCountLabel", {
        count,
        suffix: count === 1 ? "" : "s",
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

function renderHand(cards = Game.getSnapshot().hand) {
  if (!handList) return;
  renderCardList(handList, cards, {
    emptyText: t("game.hand.empty"),
    actions: [
      {
        label: t("game.hand.moveToWorkspace"),
        handler: moveHandToWorkspace,
      },
    ],
  });
}

function renderWorkspace(cards = Game.getSnapshot().workspace) {
  if (!workspaceList) return;
  renderCardList(workspaceList, cards, {
    emptyText: t("game.workspace.empty"),
    actions: [
      {
        label: t("game.workspace.returnToHand"),
        handler: moveWorkspaceToHand,
      },
    ],
  });
}

async function prepareGameplayArea(warnIfNotJoined = false) {
  try {
    const snapshot = await Game.prepare();
    if (gameSection) {
      gameSection.hidden = false;
    }
    renderGameplaySnapshot(snapshot);
    log(t("messages.gameplayReady", { count: snapshot.deckCount }));
  } catch (error) {
    if (error.code === Game.ERROR_CODES.AUTH_REQUIRED) {
      resetGameplayState();
      if (warnIfNotJoined) {
        log(t("messages.loginFirstDraw"), true);
      }
      return;
    }
    if (error.code === Game.ERROR_CODES.ROOM_REQUIRED) {
      resetGameplayState();
      if (warnIfNotJoined) {
        log(t("messages.joinRoomRequired"), true);
      }
      return;
    }
    const status = error.status ?? "unknown";
    log(t("messages.unableToLoadDeck", { status }), true);
  }
}

async function joinRoom(roomCode) {
  try {
    Validation.ensureAuthToken(getAuthToken());
  } catch (error) {
    const message = translateValidationError(error) || error.message;
    log(message, true);
    return;
  }
  try {
    const room = await Rooms.joinRoom(roomCode);
    log(t("messages.roomJoined", { name: room.name, code: room.code }));
    await prepareGameplayArea();
  } catch (error) {
    if (error.status === 401) {
      handleAuthFailure();
    }
    const detail = error.body || error.message;
    log(t("messages.unableToJoinRoom", { status: error.status ?? "unknown", detail }), true);
  }
}

function drawFromDeck() {
  try {
    const snapshot = Game.drawCard();
    renderDeckCount(snapshot.deckCount);
    renderHand(snapshot.hand);
  } catch (error) {
    if (error.code === Game.ERROR_CODES.AUTH_REQUIRED) {
      log(t("messages.loginFirstDraw"), true);
      return;
    }
    if (error.code === Game.ERROR_CODES.ROOM_REQUIRED) {
      log(t("messages.joinRoomRequired"), true);
      return;
    }
    if (error.code === Game.ERROR_CODES.DECK_EMPTY) {
      log(t("messages.deckEmpty"), true);
      return;
    }
    throw error;
  }
}

function moveHandToWorkspace(cardId) {
  const snapshot = Game.moveHandToWorkspace(cardId);
  renderHand(snapshot.hand);
  renderWorkspace(snapshot.workspace);
}

function moveWorkspaceToHand(cardId) {
  const snapshot = Game.moveWorkspaceToHand(cardId);
  renderWorkspace(snapshot.workspace);
  renderHand(snapshot.hand);
}

async function restoreSessionFromStorage() {
  const restored = restoreStoredSession();
  if (!restored) {
    return;
  }

  applyAuthSession(restored.token, restored.user);
  setUserInfo();
  log(t("messages.sessionRestored"));
  await loadRooms();
  await prepareGameplayArea();
}

// [AUTH BLOCK]
function getGuestCredentials() {
  const displayNameInput = document.getElementById("displayName");
  if (!displayNameInput || !loginPasswordInput) {
    return null;
  }
  clearFieldErrors(loginFormError);
  try {
    return Validation.validateGuestCredentials({
      displayName: displayNameInput.value,
      password: loginPasswordInput.value,
    });
  } catch (error) {
    const message = translateValidationError(error);
    if (!message) throw error;
    setFieldError(loginFormError, message);
    log(message, true);
    return null;
  }
}
// [AUTH BLOCK]
async function authenticateGuest(successMessageKey, button, authFunction = authLogin) {
  const credentials = getGuestCredentials();
  if (!credentials) return;

  await withBusyState(button, async () => {
    try {
      if (apiBaseInput) {
        localStorage.setItem(STORAGE_KEYS.apiBase, apiBaseInput.value.trim());
      }
      API.setApiBase(apiBaseInput?.value.trim() || "");

      const { token, user } = await authFunction({
        apiBase: apiBaseInput?.value.trim() || "",
        displayName: credentials.displayName,
        password: credentials.password,
      });

      clearFieldErrors(loginFormError);
      applyAuthSession(token, user);
      const currentUser = getCurrentUser();
      log(t(successMessageKey, { name: currentUser?.display_name || user.display_name }));
      setUserInfo();
      const redirectTarget = document.body.dataset.redirectAfterAuth;
      if (redirectTarget) {
        window.location.href = redirectTarget;
        return;
      }
      await loadRooms();
      await prepareGameplayArea();
    } catch (error) {
      const status = error.status ?? "unknown";
      const message = t("messages.loginFailed", { status });
      log(message, true);
    }
  });
}
// [AUTH BLOCK]
// ==========================
// BLOCK 4 — AUTHENTICATION LOGIC
// (login, logout, session, validation)
// ==========================

async function handleGuestLogin(event) {
  event.preventDefault();
  await authenticateGuest("messages.loginSuccess", event.submitter);
}
// [AUTH BLOCK]

async function handleGuestRegistration(event) {
  event.preventDefault();
  await authenticateGuest("messages.registrationSuccess", event.submitter, authRegister);
}
// ===== END OF AUTH BLOCK =====
// ==========================
// BLOCK 5 — ROOMS LOGIC
// (list, create, join, update, table rendering)
// ==========================

async function loadRooms(event) {
  if (!roomsTableBody) return;
  const button = event?.currentTarget || refreshRoomsButton;
  await withBusyState(button, async () => {
    try {
      const rooms = await Rooms.loadRooms();
      setUserInfo();
      renderRooms(rooms);
      log(t("messages.roomsLoaded", { count: rooms.length }));
    } catch (error) {
      if (error.status === 401) {
        handleAuthFailure();
      }
      const status = error.status ?? "unknown";
      log(t("messages.unableToLoadRooms", { status }), true);
    }
  });
}

function renderRooms(rooms) {
  if (!roomsTableBody) return;
  const currentRoomCode = getCurrentRoomCode();
  roomsTableBody.innerHTML = "";
  if (!rooms.length) {
    const emptyRow = document.createElement("tr");
    const emptyCell = document.createElement("td");
    emptyCell.colSpan = 10;
    emptyCell.className = "muted";
    emptyCell.textContent = t("rooms.list.empty");
    emptyRow.appendChild(emptyCell);
    roomsTableBody.appendChild(emptyRow);
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
      const token = getAuthToken();
      joinButton.disabled = !token || !room.is_joinable;
      joinButton.setAttribute("aria-label", `${t("rooms.join.cta")}: ${room.name}`);
      if (!room.is_joinable) {
        joinButton.title = joinableLabel;
      }
      if (!token) {
        joinButton.title = t("messages.loginRequiredRoom");
      }
      joinButton.addEventListener("click", () => joinRoom(room.code));
      actions.appendChild(joinButton);
    }
    actionCell.appendChild(actions);
    row.appendChild(actionCell);
    roomsTableBody.appendChild(row);
  });

  if (roomsTable) {
    roomsTable.classList.toggle("has-active", rooms.some((room) => room.code === currentRoomCode));
  }
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
  setRoomFormError("");
  await withBusyState(button, async () => {
    let payload;
    try {
      payload = Validation.validateRoomCreation({
        token: getAuthToken(),
        name: roomName,
        maxPlayers,
        maxSpectators,
      });
    } catch (error) {
      const message = translateValidationError(error) || error.message;
      setRoomFormError(message);
      log(message, true);
      return;
    }

    try {
      const room = await Rooms.createRoom(payload);
      log(t("messages.roomCreated", { name: room.name, code: room.code }));
      document.getElementById("roomName").value = "";
      setRoomFormError("");
      await prepareGameplayArea();
    } catch (error) {
      if (error.status === 401) {
        handleAuthFailure();
      }
      const detail = error.body || error.message;
      const message = t("messages.createRoomFailed", { status: error.status ?? "unknown", detail });
      log(message, true);
      setRoomFormError(message);
    }
  });
}
// ===== END OF ROOMS BLOCK =====

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
  let adminToken;
  try {
    adminToken = requireAdminToken();
  } catch (error) {
    const message = translateValidationError(error) || error.message;
    log(message, true);
    return;
  }
  await withBusyState(button, async () => {
    try {
      const cards = await API.loadAdminCards(adminToken);
      renderCards(cards);
      log(t("messages.cardsLoaded", { count: cards.length }));
    } catch (error) {
      const status = error.status ?? "unknown";
      log(t("messages.unableLoadCards", { status }), true);
    }
  });
}
// ==========================
// BLOCK 6 — CARDS LOGIC
// (loading deck, rendering cards, selection, preview)
// ==========================

async function loadDecks(event) {
  if (!decksList || !adminTokenInput) return;
  const button = event?.currentTarget || refreshDecksButton;
  let adminToken;
  try {
    adminToken = requireAdminToken();
  } catch (error) {
    const message = translateValidationError(error) || error.message;
    log(message, true);
    return;
  }
  await withBusyState(button, async () => {
    try {
      const decks = await API.loadAdminDecks(adminToken);
      renderDecks(decks);
      log(t("messages.decksLoaded", { count: decks.length }));
    } catch (error) {
      const status = error.status ?? "unknown";
      log(t("messages.unableLoadDecks", { status }), true);
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
    let payload;
    try {
      payload = Validation.validateCardPayload({ name, description, category });
    } catch (error) {
      const message = translateValidationError(error) || error.message;
      log(message, true);
      return;
    }

    let adminToken;
    try {
      adminToken = requireAdminToken();
    } catch (error) {
      const message = translateValidationError(error) || error.message;
      log(message, true);
      return;
    }

    try {
      const card = await API.createCard(adminToken, {
        ...payload,
        ...resourcePayload,
      });
      log(t("messages.cardCreated", { name: card.name, id: card.id }));
      cardForm.reset();
      await loadCards();
    } catch (error) {
      const detail = error.body || error.message;
      log(t("messages.createCardFailed", { status: error.status ?? "unknown", detail }), true);
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
    let payload;
    try {
      payload = Validation.validateDeckPayload({ name, description, card_ids });
    } catch (error) {
      const message = translateValidationError(error) || error.message;
      log(message, true);
      return;
    }

    let adminToken;
    try {
      adminToken = requireAdminToken();
    } catch (error) {
      const message = translateValidationError(error) || error.message;
      log(message, true);
      return;
    }

    try {
      const deck = await API.createDeck(adminToken, payload);
      log(t("messages.deckCreated", { name: deck.name, id: deck.id }));
      deckForm.reset();
      await loadDecks();
    } catch (error) {
      const detail = error.body || error.message;
      log(t("messages.createDeckFailed", { status: error.status ?? "unknown", detail }), true);
    }
  });
}

async function deleteCard(cardId) {
  if (!confirm(t("messages.deleteCardConfirm", { id: cardId }))) return;
  let adminToken;
  try {
    adminToken = requireAdminToken();
  } catch (error) {
    const message = translateValidationError(error) || error.message;
    log(message, true);
    return;
  }
  try {
    await API.deleteCard(adminToken, cardId);
    log(t("messages.deletedCard", { id: cardId }));
    await loadCards();
  } catch (error) {
    const detail = error.body || error.message;
    log(t("messages.deleteCardFailed", { status: error.status ?? "unknown", detail }), true);
  }
}

async function deleteDeck(deckId) {
  if (!confirm(t("messages.deleteDeckConfirm", { id: deckId }))) return;
  let adminToken;
  try {
    adminToken = requireAdminToken();
  } catch (error) {
    const message = translateValidationError(error) || error.message;
    log(message, true);
    return;
  }
  try {
    await API.deleteDeck(adminToken, deckId);
    log(t("messages.deletedDeck", { id: deckId }));
    await loadDecks();
  } catch (error) {
    const detail = error.body || error.message;
    log(t("messages.deleteDeckFailed", { status: error.status ?? "unknown", detail }), true);
  }
}

async function exportDeck(deckId) {
  let adminToken;
  try {
    adminToken = requireAdminToken();
  } catch (error) {
    const message = translateValidationError(error) || error.message;
    log(message, true);
    return;
  }
  try {
    const payload = await API.exportDeck(adminToken, deckId);
    const pretty = JSON.stringify(payload, null, 2);
    log(t("messages.exportedDeck", { id: deckId, payload: pretty }));
  } catch (error) {
    const detail = error.body || error.message;
    log(t("messages.exportDeckFailed", { status: error.status ?? "unknown", detail }), true);
  }
}

async function importDeck(event) {
  const button = event?.currentTarget || importDeckButton;
  if (!deckImportPayload) return;
  const raw = deckImportPayload.value.trim();
  let payload;
  try {
    payload = Validation.validateDeckImportPayload(raw);
  } catch (error) {
    const message = translateValidationError(error) || error.message;
    log(message, true);
    return;
  }

  await withBusyState(button, async () => {
    let adminToken;
    try {
      adminToken = requireAdminToken();
    } catch (error) {
      const message = translateValidationError(error) || error.message;
      log(message, true);
      return;
    }
    try {
      const deck = await API.importDeck(adminToken, payload);
      log(t("messages.deckImported", { name: deck.name, id: deck.id }));
      deckImportPayload.value = "";
      await loadDecks();
    } catch (error) {
      const detail = error.body || error.message;
      log(t("messages.importDeckFailed", { status: error.status ?? "unknown", detail }), true);
    }
  });
}
// ===== END OF CARDS BLOCK =====

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
  if (navLogoutButton) navLogoutButton.addEventListener("click", logoutUser);
}

Rooms.syncCurrentRoom();

persistApiBase();
setLanguage(currentLanguage);
wireEvents();
scheduleAdminTokenValidation();
setUserInfo();
restoreSessionFromStorage();
log(t("messages.ready"));
