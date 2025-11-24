// modules/i18n.js

import { state } from "./state.js";

const LANGUAGE_STORAGE_KEY = "joj-language";

// --- TRANSLATION DICTIONARY ---
// Centralized translations used by the web client.
export const translations = {
  en: {
    common: {
      skipToStatus: "Skip to status updates",
    },
    nav: {
      login: "Login",
      game: "Game",
      management: "Management",
      admin: "Admin",
      logout: "Logout",
    },
    title: "JOJ Game Web Client",
    subtitle: "Interact with the FastAPI server from your browser.",
    layout: {
      game: {
        heading: "Game Lobby",
        subheading: "Create or browse rooms and interact with the gameplay workspace.",
      },
      admin: {
        heading: "Administrative tools",
        subheading: "Manage cards and decks with an admin token supplied by the server.",
      },
      management: {
        heading: "Management hub",
        subheading: "Choose which module to manage: system, players, cards, or decks.",
      },
    },
    language: { label: "Language" },
    modules: {
      heading: "Modules",
      game: {
        title: "Game and rooms",
        description:
          "Continue to the main lobby to create game rooms or see what other players have opened.",
        cta: "Go to main.html",
      },
      management: {
        title: "Management",
        description: "Browse high-level system, player, card, and deck options.",
        cta: "Go to management.html",
      },
      admin: {
        title: "Admin",
        description: "Supply your admin token to seed, inspect, and maintain core assets.",
        cta: "Go to admin.html",
      },
    },
    server: {
      heading: "Server connection",
      apiBase: "API base URL",
      hint: "Update this if your server runs on a different host or port.",
    },
    admin: {
      heading: "Admin access",
      roleHint: "Use the admin token or log in with an account that has admin privileges.",
      tokenLabel: "Admin token",
      tokenPlaceholder: "Paste the server ADMIN_TOKEN value",
      tokenHint: "Admin token is required for admin API calls.",
      tokenWarning: "Never share this token in public.",
      clearToken: "Clear token",
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
      intro: "First step: register or log in to continue.",
      skipManagement: "Skip to management",
      adminModule: "Admin module",
      redirectHint:
        "After successful authentication you will be redirected to the game page to create or join rooms.",
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
        hint: "Signed-in players can create and refresh game rooms.",
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
      adminHeading: "Rooms",
      adminHint: "Admin view of all rooms.",
    },
    game: {
      heading: "Gameplay workspace",
      draw: "Draw card",
      reset: "Reset table",
      intro: "Draw and arrange cards locally after authenticating as a player.",
      hint: "Available after you join a room. Cards are pulled from the server deck so you can try drawing and arranging them locally.",
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
        reset: "Reset form",
      },
      listEmpty: "No decks yet. Create one above.",
      noDescription: "No description",
      noCards: "No cards assigned",
      export: "Export JSON",
      import: {
        label: "Import deck JSON",
        placeholder: '{"deck": {"name": "Starter", "card_ids": []}, "cards": []}',
        hint: "Paste deck export JSON to recreate decks and cards.",
        targetLabel: "Target deck (optional)",
        targetNew: "Create new deck",
        targetHint: "Choose an existing deck to replace its contents.",
        submit: "Import JSON",
      },
      delete: "Delete",
    },
    status: { heading: "Status" },
    session: {
      apiLabel: "API base",
      userLabel: "User",
      roomLabel: "Room",
      roleLabel: "Role",
      adminLabel: "Admin",
      userGuest: "Guest (not signed in)",
      roomNone: "Not joined",
      adminMissing: "Token missing",
      roleGuest: "Guest",
      roleAdmin: "Admin",
    },
    users: {
      heading: "Users",
      refresh: "Refresh",
      hint: "User list (admin only).",
      empty: "No users to display.",
      columns: {
        id: "ID",
        username: "Username",
        rooms: "Rooms",
        isAdmin: "Is admin",
      },
    },
    messages: {
      loginRequired: "Please log in to continue.",
      loginRequiredRoom: "Log in to join rooms.",
      accessWarning: "Admin endpoints require a valid token.",
      bannerLoginCta: "Login",
      bannerDismiss: "Dismiss",
      loginSuccess: "Logged in as {name}.",
      loggedOut: "Logged out.",
      sessionRestored: "Restored previous session.",
      sessionExpired: "Session expired. Please log in again.",
      ready: "Ready. Set API base, register or log in, or manage decks with an admin token.",
      roomCreated: 'Room "{name}" created (code: {code}).',
      createRoomFailed: "Unable to create room: {status} {detail}",
      roomsLoaded: "Loaded {count} rooms.",
      unableToLoadRooms: "Unable to load rooms: {status}",
      unableToCreateRoom: "Unable to create room: {status} {detail}",
      roomJoined: 'Joined room "{name}" (code: {code}).',
      unableToJoinRoom: "Unable to join room: {status} {detail}",
      joinRoomRequired: "Join a room to start playing.",
      deckEmpty: "Deck empty",
      unableToLoadDeck: "Unable to load deck: {status}",
      gameplayReady: "Gameplay ready. Deck contains {count} cards.",
      loginFirstDraw: "Log in before drawing.",
      deckCountLabel: "{count} card{suffix}",
      cardsLoaded: "Loaded {count} cards.",
      decksLoaded: "Loaded {count} decks.",
      unableLoadCards: "Unable to load cards: {status}",
      unableLoadDecks: "Unable to load decks: {status}",
      createCardFailed: "Failed to create card: {status} {detail}",
      createDeckFailed: "Failed to create deck: {status} {detail}",
      invalidAdminToken: "Invalid admin token.",
      adminTokenCheckFailed: "Could not verify admin token: {status}",
      deleteCardFailed: "Failed to delete card: {status} {detail}",
      deleteDeckFailed: "Failed to delete deck: {status} {detail}",
      exportDeckFailed: "Failed to export: {status} {detail}",
      deckImported: 'Imported deck "{name}" (#{id}).',
      importDeckInvalid: "Provide valid JSON to import.",
      importDeckFailed: "Failed to import: {status} {detail}",
      cardFieldsRequired: "Card name and description are required.",
      cardCreated: 'Card "{name}" (#{id}) created.',
      deckNameRequired: "Deck name is required.",
      deckCreated: 'Deck "{name}" (#{id}) created.',
      deleteCardConfirm: "Delete card #{id}?",
      deleteDeckConfirm: "Delete deck #{id}?",
      deletedCard: "Deleted card #{id}.",
      deletedDeck: "Deleted deck #{id}.",
      exportedDeck: "Export deck #{id}:\n{payload}",
      loginFailed: "Login failed: {status}",
      registrationSuccess: "Registered as {name}.",
      confirmTitle: "Confirm action",
      cancelAction: "Cancel",
      confirmAction: "Confirm",
    },
  },
  uk: {
    common: {
      skipToStatus: "Перейти до повідомлень про стан",
    },
    nav: {
      login: "Вхід",
      game: "Гра",
      management: "Керування",
      admin: "Адмін",
      logout: "Вийти",
    },
    title: "Вебклієнт JOJ Game",
    subtitle: "Взаємодіяйте з сервером FastAPI через браузер.",
    layout: {
      game: {
        heading: "Ігровий хол",
        subheading: "Створюйте чи переглядайте кімнати та взаємодійте з робочою зоною гри.",
      },
      admin: {
        heading: "Адміністративні інструменти",
        subheading: "Керуйте картами та колодами за допомогою адмін-токена, виданого сервером.",
      },
      management: {
        heading: "Центр керування",
        subheading: "Оберіть, чим керувати: системою, гравцями, картами чи колодами.",
      },
    },
    language: { label: "Мова" },
    modules: {
      heading: "Модулі",
      game: {
        title: "Гра та кімнати",
        description:
          "Перейдіть у головний хол, щоб створювати кімнати або бачити відкриті іншими гравцями.",
        cta: "Перейти до main.html",
      },
      management: {
        title: "Керування",
        description: "Перегляд системних, гравцівських, карткових та колодних налаштувань.",
        cta: "Перейти до management.html",
      },
      admin: {
        title: "Адмін",
        description: "Вкажіть адмін-токен, щоб наповнювати, перевіряти й супроводжувати ключові дані.",
        cta: "Перейти до admin.html",
      },
    },
    server: {
      heading: "Підключення до сервера",
      apiBase: "Базова адреса API",
      hint: "Оновіть, якщо сервер працює на іншому хості чи порту.",
    },
    admin: {
      heading: "Доступ адміністратора",
      roleHint: "Використовуйте адмін-токен або увійдіть під адмін-акаунтом.",
      tokenLabel: "Адмін-токен",
      tokenPlaceholder: "Вставте значення ADMIN_TOKEN",
      tokenHint: "Адмін-токен потрібен для адмінських запитів до API.",
      tokenWarning: "Ніколи не діліться цим токеном публічно.",
      clearToken: "Очистити токен",
      loadData: "Завантажити карти та колоди",
      status: {
        idle: "Введіть адмін-токен, щоб розблокувати інструменти.",
        checking: "Перевірка адмін-токена...",
        valid: "Адмін-токен дійсний.",
        invalid: "Адмін-токен недійсний.",
      },
    },
    login: {
      heading: "Гостьовий вхід",
      displayName: "Ім'я відображення",
      displayNamePlaceholder: "Battle Planner",
      password: "Пароль",
      passwordPlaceholder: "Введіть пароль",
      register: "Зареєструватися",
      submit: "Увійти",
      notSignedIn: "Ще не увійшли.",
      intro: "Перший крок: зареєструйтесь або увійдіть, щоб продовжити.",
      skipManagement: "Перейти до керування",
      adminModule: "Адмін-модуль",
      redirectHint:
        "Після успішної автентифікації ви будете перенаправлені до сторінки гри для створення чи приєднання до кімнати.",
    },
    rooms: {
      create: {
        heading: "Створити кімнату",
        name: "Назва кімнати",
        namePlaceholder: "Briefing Room",
        maxPlayers: "Максимум гравців (2-6)",
        maxSpectators: "Максимум глядачів (0-10)",
        submit: "Створити кімнату",
        hint: "Потрібен авторизований користувач; ваш токен використовуватиметься автоматично.",
      },
      list: {
        heading: "Кімнати",
        refresh: "Оновити",
        empty: "Кімнат ще немає. Створіть одну!",
        hint: "Авторизовані гравці можуть створювати та оновлювати кімнати.",
      },
      meta: {
        host: "Хост",
        name: "Назва",
        code: "Код",
        players: "Гравці",
        spectators: "Спостерігачі",
        visibility: "Видимість",
        status: "Статус",
        joinable: "Можна приєднатися",
        created: "Створено",
      },
      status: { active: "Активна", archived: "Архівована" },
      join: {
        cta: "Приєднатися",
        joined: "Приєднано",
        current: "Поточна кімната",
        joinable: "Так",
        closed: "Закрита",
        full: "Заповнена",
      },
      adminHeading: "Кімнати",
      adminHint: "Адмінський перегляд усіх кімнат.",
    },
    game: {
      heading: "Робоча зона гри",
      draw: "Витягнути карту",
      reset: "Очистити стіл",
      intro: "Тягніть і розкладайте карти локально після входу як гравець.",
      hint: "Доступно після приєднання до кімнати. Карти тягнуться з серверної колоди, щоб ви могли тренуватися локально.",
      deck: {
        heading: "Колода",
        hint: "Натисніть Витягнути, щоб отримати наступну карту до руки.",
        empty: "Колода порожня",
      },
      hand: {
        heading: "Рука",
        empty: "Витягніть карти, щоб побачити їх тут.",
        moveToWorkspace: "Перемістити у робочу зону",
      },
      workspace: {
        heading: "Робоча зона",
        empty: "Переміщайте карти сюди, щоб планувати хід.",
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
        namePlaceholder: "Surprise Event",
        description: "Опис",
        descriptionPlaceholder: "Щось неочікуване трапляється",
        category: "Категорія (необов'язково)",
        categoryPlaceholder: "chaos",
        time: "Час",
        timePlaceholder: "+1 чи -1",
        reputation: "Репутація",
        reputationPlaceholder: "+1 чи -1",
        discipline: "Дисципліна",
        disciplinePlaceholder: "+1 чи -1",
        documents: "Документи",
        documentsPlaceholder: "+1 чи -1",
        technology: "Технології",
        technologyPlaceholder: "+1 чи -1",
        submit: "Створити карту",
      },
      listEmpty: "Карт поки немає. Створіть одну вище.",
      noCategory: "Без категорії",
      noEffects: "Без змін ресурсів",
      delete: "Видалити",
    },
    decks: {
      heading: "Колоді",
      refresh: "Оновити",
      form: {
        name: "Назва",
        namePlaceholder: "Starter Deck",
        description: "Опис (необов'язково)",
        descriptionPlaceholder: "Базові карти",
        cardIds: "ID карт (через кому)",
        cardIdsPlaceholder: "1,2,3",
        submit: "Створити колоду",
        reset: "Скинути форму",
      },
      listEmpty: "Колод поки немає. Створіть одну вище.",
      noDescription: "Без опису",
      noCards: "Немає призначених карт",
      export: "Експорт JSON",
      import: {
        label: "Імпорт JSON колоди",
        placeholder: '{"deck": {"name": "Starter", "card_ids": []}, "cards": []}',
        hint: "Вставте експортований JSON, щоб відновити колоди та карти.",
        targetLabel: "Цільова колода (необов'язково)",
        targetNew: "Створити нову колоду",
        targetHint: "Оберіть існуючу колоду, щоб замінити її вміст.",
        submit: "Імпортувати JSON",
      },
      delete: "Видалити",
    },
    status: { heading: "Статус" },
    session: {
      apiLabel: "База API",
      userLabel: "Користувач",
      roomLabel: "Кімната",
      roleLabel: "Роль",
      adminLabel: "Адмін",
      userGuest: "Гість (не увійшов)",
      roomNone: "Не приєднано",
      adminMissing: "Немає токена",
      roleGuest: "Гість",
      roleAdmin: "Адмін",
    },
    users: {
      heading: "Користувачі",
      refresh: "Оновити",
      hint: "Список користувачів (лише для адміна).",
      empty: "Немає користувачів для показу.",
      columns: {
        id: "ID",
        username: "Ім'я користувача",
        rooms: "Кімнати",
        isAdmin: "Чи адміністратор",
      },
    },
    messages: {
      loginRequired: "Будь ласка, увійдіть, щоб продовжити.",
      loginRequiredRoom: "Увійдіть, щоб приєднуватися до кімнат.",
      accessWarning: "Адмін-ендпоінти потребують дійсного токена.",
      bannerLoginCta: "Увійти",
      bannerDismiss: "Закрити",
      loginSuccess: "Увійшли як {name}.",
      loggedOut: "Вийшли з акаунта.",
      sessionRestored: "Попередню сесію відновлено.",
      sessionExpired: "Сесію завершено. Будь ласка, увійдіть знову.",
      ready:
        "Готово. Задайте базову адресу API, зареєструйтеся або увійдіть, чи керуйте колодами з адмін-токеном.",
      roomCreated: 'Створено кімнату "{name}" (код: {code}).',
      createRoomFailed: "Не вдалося створити кімнату: {status} {detail}",
      roomsLoaded: "Завантажено {count} кімнат(и).",
      unableToLoadRooms: "Не вдалося завантажити кімнати: {status}",
      unableToCreateRoom: "Не вдалося створити кімнату: {status} {detail}",
      roomJoined: 'Приєднано до кімнати "{name}" (код: {code}).',
      unableToJoinRoom: "Не вдалося приєднатися: {status} {detail}",
      joinRoomRequired: "Приєднайтеся до кімнати, щоб почати гру.",
      deckEmpty: "Колода порожня",
      unableToLoadDeck: "Не вдалося завантажити колоду: {status}",
      gameplayReady: "Розкладка готова. У колоді {count} карт(и).",
      loginFirstDraw: "Увійдіть перед тим, як тягнути карти.",
      deckCountLabel: "{count} карт{suffix}",
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
      loginFailed: "Помилка входу: {status}",
      registrationSuccess: "Зареєстровано як {name}.",
      confirmTitle: "Підтвердження дії",
      cancelAction: "Скасувати",
      confirmAction: "Підтвердити",
    },
  },
};

let currentLang = localStorage.getItem(LANGUAGE_STORAGE_KEY) || "en";

function resolveTranslation(key, language = currentLang) {
  const parts = key.split(".");
  let value = translations[language];
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
  return null;
}

function formatTranslation(template, vars = {}) {
  return template.replace(/\{(\w+)\}/g, (match, name) => {
    if (name in vars) {
      return vars[name];
    }
    return match;
  });
}

export function t(key, vars = {}) {
  const template = resolveTranslation(key) || key;
  return formatTranslation(template, vars);
}

export function setLanguage(lang) {
  if (!translations[lang]) return;
  currentLang = lang;
  localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  document.documentElement.lang = lang;
  state.emit("languageChanged", lang);
  if (typeof document !== "undefined") {
    document.body?.dispatchEvent(new CustomEvent("languageChanged", { detail: lang }));
  }
}

export function getLanguage() {
  return currentLang;
}

export function initI18n() {
  const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (saved && translations[saved]) {
    currentLang = saved;
  }
  document.documentElement.lang = currentLang;
  return currentLang;
}
