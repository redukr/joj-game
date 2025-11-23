const STORAGE_KEYS = {
  authToken: "joj-auth-token",
  user: "joj-user",
  apiBase: "joj-api-base",
  roomCode: "joj-room-code",
  adminToken: "joj-admin-token",
};

const LANGUAGE_STORAGE_KEY = "joj-language";
const ADMIN_TOKEN_IDLE_MS = 15 * 60 * 1000;

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
          "Manage cards, decks, users, and rooms with admin privileges.",
      },
      management: {
        heading: "Management hub",
        subheading:
          "Admin-only shortcuts for monitoring users, rooms, cards, or decks.",
      },
    },
    language: { label: "Language" },
    session: {
      apiLabel: "API base",
      userLabel: "User",
      roomLabel: "Room",
      roleLabel: "Role",
      roleGuest: "Guest (not signed in)",
    },
    server: {
      heading: "Server connection",
      apiBase: "API base URL",
      hint: "Update this if your server runs on a different host or port.",
    },
    admin: {
      heading: "Admin access",
      roleHint: "Sign in with an admin account or provide the ADMIN_TOKEN to unlock these controls.",
      loadData: "Load admin data",
      tokenLabel: "Admin token",
      tokenPlaceholder: "Paste the server ADMIN_TOKEN value",
      tokenHint:
        "Paste the ADMIN_TOKEN from your server configuration to bootstrap admin actions without an admin account.",
      tokenWarning:
        "Admin tokens are sensitive. They are stored only for this session and will auto-clear after inactivity.",
      clearToken: "Clear token",
      status: {
        idle: "Admin access required to load data.",
        checking: "Checking admin access...",
        valid: "Admin session ready via token or role.",
        invalid: "Admin access unavailable.",
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
      adminHeading: "Rooms",
      adminHint: "Inspect active rooms and remove stale ones.",
      adminEmpty: "No rooms found.",
      delete: "Delete",
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
        update: "Save changes",
        reset: "Reset",
        cancelEdit: "Cancel edit",
      },
      listEmpty: "No decks yet. Create one above.",
      noDescription: "No description",
      noCards: "No cards assigned",
      edit: "Edit",
      export: "Export JSON",
      import: {
        label: "Import deck JSON",
        placeholder: '{"deck": {"name": "Starter", "card_ids": []}, "cards": []}',
        hint: "Paste deck export JSON to recreate decks and cards.",
        targetLabel: "Target deck (optional)",
        targetNew: "Create new deck",
        targetHint:
          "Choose a deck to overwrite with this import, or leave empty to create a new deck.",
        submit: "Import JSON",
      },
      editing: "Editing deck #{id}. Save or cancel to exit.",
      delete: "Delete",
    },
    users: {
      heading: "Users",
      refresh: "Refresh",
      hint: "Review users, assign roles, or remove accounts.",
      listEmpty: "No users found.",
      role: "Role",
      delete: "Delete",
    },
    status: { heading: "Status" },
    messages: {
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
      updateDeckFailed: "Update deck failed: {status} {detail}",
      deleteCardFailed: "Delete card failed: {status} {detail}",
      deleteDeckFailed: "Delete deck failed: {status} {detail}",
      exportDeckFailed: "Export failed: {status} {detail}",
      cardFieldsRequired: "Card name and description are required.",
      cardCreated: 'Created card "{name}" (#{id}).',
      deckNameRequired: "Deck name is required.",
      deckCreated: 'Created deck "{name}" (#{id}).',
      deckUpdated: 'Updated deck "{name}" (#{id}).',
      deleteCardConfirm: "Delete card #{id}?",
      deleteDeckConfirm: "Delete deck #{id}?",
      deletedCard: "Deleted card #{id}.",
      deletedDeck: "Deleted deck #{id}.",
      exportedDeck: "Exported deck #{id}:\n{payload}",
      deckImported: 'Imported deck "{name}" (#{id}).',
      deckImportUpdated: 'Replaced deck "{name}" (#{id}) with imported data.',
      importDeckInvalid: "Provide valid deck JSON to import.",
      importDeckFailed: "Import failed: {status} {detail}",
      ready: "Ready. Set your API base URL, register or sign in, or manage data as an admin.",
      loginFailed: "Login failed: {status}",
      registrationSuccess: "Registered as {name}.",
      loginRequired: "Please sign in to access this page.",
      adminRoleRequired:
        "Admin access required. Provide the ADMIN_TOKEN or sign in as an admin to continue.",
      unableLoadUsers: "Unable to load users: {status}",
      unableLoadAdminRooms: "Unable to load rooms for admin: {status}",
      roleUpdated: "Updated role for {name} to {role}.",
      deleteUserConfirm: "Delete user {name}? This also removes their rooms.",
      deletedUser: "Removed user {name}.",
      deleteUserFailed: "Delete user failed: {status} {detail}",
      updateRoleFailed: "Update role failed: {status} {detail}",
      deleteRoomConfirm: "Delete room {code}?",
      deletedRoom: "Deleted room {code}.",
      deleteRoomFailed: "Delete room failed: {status} {detail}",
      adminDataLoaded: "Admin data refreshed.",
      accessWarning:
        "Admin access required. Provide the ADMIN_TOKEN or sign in as an admin to continue.",
      bannerLoginCta: "Go to login",
      bannerDismiss: "Dismiss",
      adminTokenCleared: "Admin token cleared.",
      adminTokenExpired: "Admin token cleared after inactivity.",
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
          "Керуйте картами, колодами, користувачами та кімнатами як адміністратор.",
      },
      management: {
        heading: "Центр керування",
        subheading:
          "Адмінський хаб для перегляду користувачів, кімнат, карт чи колод.",
      },
    },
    language: { label: "Мова" },
    session: {
      apiLabel: "API база",
      userLabel: "Користувач",
      roomLabel: "Кімната",
      roleLabel: "Роль",
      roleGuest: "Гість (не увійшов)",
    },
    server: {
      heading: "Підключення до сервера",
      apiBase: "Базова адреса API",
      hint: "Змініть, якщо сервер працює на іншому хості чи порту.",
    },
    admin: {
      heading: "Доступ адміністратора",
      roleHint:
        "Увійдіть як адміністратор або надайте ADMIN_TOKEN, щоб увімкнути ці інструменти.",
      loadData: "Завантажити адмін-дані",
      tokenLabel: "Адмін-токен",
      tokenPlaceholder: "Вставте значення ADMIN_TOKEN із сервера",
      tokenHint:
        "Вставте ADMIN_TOKEN із конфігурації сервера, щоб увімкнути адмін-дії без адмін-акаунта.",
      tokenWarning:
        "Адмін-токени чутливі. Зберігаються лише в цій сесії та очищаються після бездіяльності.",
      clearToken: "Очистити токен",
      status: {
        idle: "Потрібен адмін-доступ для завантаження даних.",
        checking: "Перевіряємо адмін-доступ...",
        valid: "Адмін-сесія готова (токен чи роль).",
        invalid: "Адмін-доступ недоступний.",
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
      adminHeading: "Кімнати",
      adminHint: "Переглядайте активні кімнати та прибирайте зайві.",
      adminEmpty: "Немає кімнат.",
      delete: "Видалити",
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
        update: "Зберегти зміни",
        reset: "Скинути",
        cancelEdit: "Скасувати редагування",
      },
      listEmpty: "Колоди відсутні. Створіть одну вище.",
      noDescription: "Без опису",
      noCards: "Карт не призначено",
      edit: "Редагувати",
      export: "Експорт JSON",
      import: {
        label: "Імпортувати колоду з JSON",
        placeholder: '{"deck": {"name": "Стартова", "card_ids": []}, "cards": []}',
        hint: "Вставте експортований JSON, щоб відновити колоди та карти.",
        targetLabel: "Цільова колода (необов'язково)",
        targetNew: "Створити нову колоду",
        targetHint:
          "Оберіть колоду, яку потрібно перезаписати, або залиште порожнім для створення нової.",
        submit: "Імпортувати JSON",
      },
      editing: "Редагування колоди #{id}. Збережіть або скасуйте, щоб вийти.",
      delete: "Видалити",
    },
    users: {
      heading: "Користувачі",
      refresh: "Оновити",
      hint: "Переглядайте користувачів, призначайте ролі або видаляйте обліковки.",
      listEmpty: "Користувачів не знайдено.",
      role: "Роль",
      delete: "Видалити",
    },
    status: { heading: "Статус" },
    messages: {
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
        deckImported: 'Імпортовано колоду "{name}" (#{id}).',
        deckImportUpdated: 'Колоду "{name}" (#{id}) перезаписано імпортом.',
        importDeckInvalid: "Додайте коректний JSON для імпорту.",
        importDeckFailed: "Не вдалося імпортувати: {status} {detail}",
        updateDeckFailed: "Не вдалося оновити колоду: {status} {detail}",
        deckUpdated: 'Колоду "{name}" (#{id}) оновлено.',
        ready:
          "Готово. Задайте базову адресу API, зареєструйтеся або увійдіть, чи керуйте даними як адміністратор.",
      loginFailed: "Помилка входу: {status}",
      registrationSuccess: "Зареєстровано як {name}.",
      loginRequired: "Увійдіть, щоб отримати доступ до цієї сторінки.",
      adminRoleRequired:
        "Потрібен адмін-доступ. Увійдіть як адміністратор або додайте ADMIN_TOKEN.",
      unableLoadUsers: "Не вдалося завантажити користувачів: {status}",
      unableLoadAdminRooms: "Не вдалося завантажити кімнати для адміністратора: {status}",
      roleUpdated: "Оновлено роль {name} на {role}.",
      deleteUserConfirm: "Видалити користувача {name}? Це також прибере його кімнати.",
      deletedUser: "Користувача {name} видалено.",
      deleteUserFailed: "Не вдалося видалити користувача: {status} {detail}",
      updateRoleFailed: "Не вдалося оновити роль: {status} {detail}",
      deleteRoomConfirm: "Видалити кімнату {code}?",
      deletedRoom: "Кімнату {code} видалено.",
      deleteRoomFailed: "Не вдалося видалити кімнату: {status} {detail}",
      adminDataLoaded: "Адмін-дані оновлено.",
      accessWarning:
        "Потрібен адмін-доступ. Введіть ADMIN_TOKEN або увійдіть як адміністратор.",
      bannerLoginCta: "Перейти до входу",
      bannerDismiss: "Сховати",
      adminTokenCleared: "Адмін-токен очищено.",
      adminTokenExpired: "Адмін-токен очищено через бездіяльність.",
    },
  },
};

let currentLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY) || "en";

const pageName = document.body.dataset.page || "all";
const statusArea = document.getElementById("statusArea");
const apiBaseInput = document.getElementById("apiBase");
const accessBanner = document.getElementById("accessBanner");
const accessBannerMessage = document.getElementById("accessBannerMessage");
const accessBannerLogin = document.getElementById("accessBannerLogin");
const accessBannerDismiss = document.getElementById("accessBannerDismiss");
const guestLoginForm = document.getElementById("guestLoginForm");
const registerGuestButton = document.getElementById("registerGuest");
const roomForm = document.getElementById("roomForm");
const roomsList = document.getElementById("roomsList");
const refreshRoomsButton = document.getElementById("refreshRooms");
const userInfo = document.getElementById("userInfo");
const refreshAdminDataButton = document.getElementById("refreshAdminData");
const refreshCardsButton = document.getElementById("refreshCards");
const refreshDecksButton = document.getElementById("refreshDecks");
const refreshUsersButton = document.getElementById("refreshUsers");
const refreshAdminRoomsButton = document.getElementById("refreshAdminRooms");
const adminStatusLabel = document.getElementById("adminTokenStatus");
const adminTokenInput = document.getElementById("adminToken");
const adminTokenWarning = document.getElementById("adminTokenWarning");
const adminTokenError = document.getElementById("adminTokenError");
const clearAdminTokenButton = document.getElementById("clearAdminToken");
const cardForm = document.getElementById("cardForm");
const cardFormError = document.getElementById("cardFormError");
const resetCardFormButton = document.getElementById("resetCardForm");
const deckForm = document.getElementById("deckForm");
const deckFormError = document.getElementById("deckFormError");
const resetDeckFormButton = document.getElementById("resetDeckForm");
const deckImportPayload = document.getElementById("deckImportPayload");
const deckImportTarget = document.getElementById("deckImportTarget");
const deckImportError = document.getElementById("deckImportError");
const importDeckButton = document.getElementById("importDeck");
const cardsList = document.getElementById("cardsList");
const decksList = document.getElementById("decksList");
const deckEditStatus = document.getElementById("deckEditStatus");
const usersList = document.getElementById("usersList");
const adminRoomsList = document.getElementById("adminRoomsList");
const adminOnlySections = document.querySelectorAll("[data-admin-only]");
const navLoginLink = document.querySelector('[data-nav="login"]');
const navGameLink = document.querySelector('[data-nav="game"]');
const navManagementLink = document.querySelector('[data-nav="management"]');
const navAdminLink = document.querySelector('[data-nav="admin"]');
const gameSection = document.getElementById("gameSection");
const deckCount = document.getElementById("deckCount");
const resourceBar = document.getElementById("resourceBar");
const handList = document.getElementById("handList");
const workspaceList = document.getElementById("workspaceList");
const drawCardButton = document.getElementById("drawCard");
const resetGameplayButton = document.getElementById("resetGameplay");
const languageSelector = document.getElementById("languageSelector");
const loginPasswordInput = document.getElementById("loginPassword");
const roleChipValue = document.querySelector("#sessionRoleChip .chip-value");
const roleChipLabel = document.querySelector("#sessionRoleChip .chip-label");

let authToken = null;
let currentUser = null;
let currentRoomCode = localStorage.getItem(STORAGE_KEYS.roomCode);
let deckCards = [];
let decksCache = [];
let deckEditId = null;
let handCards = [];
let workspaceCards = [];
let adminTokenIdleTimer = null;
let adminStatus = { isActive: false, isChecking: false };
let sessionCheckComplete = false;
let adminTokenBootstrapAllowed = false;

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
  syncDeckFormState();
  updateDeckImportTargets();
}

function syncNavLinks() {
  const isLoggedIn = Boolean(authToken && currentUser);
  const canAccessAdmin = hasAdminAccess();

  if (navLoginLink) {
    navLoginLink.textContent = "LOGIN";
    navLoginLink.hidden = false;
  }

  if (navGameLink) {
    navGameLink.textContent = "GAME";
    navGameLink.setAttribute("aria-disabled", String(!isLoggedIn));
    navGameLink.dataset.guardMessage = "messages.loginRequired";
  }

  if (navManagementLink) {
    navManagementLink.setAttribute("aria-disabled", String(!isLoggedIn));
    navManagementLink.dataset.guardMessage = "messages.loginRequired";
  }

  if (navAdminLink) {
    const adminLinkEnabled = canAccessAdmin || pageName === "admin";
    navAdminLink.setAttribute("aria-disabled", String(!adminLinkEnabled));
    navAdminLink.dataset.guardMessage = adminLinkEnabled
      ? ""
      : "messages.accessWarning";
  }

  enforceRestrictedPageAccess();
}

function log(message, isError = false) {
  const prefix = new Date().toLocaleTimeString();
  const line = `[${prefix}] ${message}`;
  if (statusArea) {
    if (!statusArea.hasAttribute("tabindex")) {
      statusArea.setAttribute("tabindex", "-1");
    }
    statusArea.textContent = `${line}\n${statusArea.textContent}`.trim();
    statusArea.classList.toggle("error", isError);
    statusArea.setAttribute("aria-label", line);
    if (isError) {
      statusArea.scrollTop = 0;
      statusArea.focus({ preventScroll: false });
    }
  } else {
    console[isError ? "error" : "log"](line);
  }
}

function setFieldError(target, message = "") {
  if (!target) return;
  target.textContent = message;
}

function showAccessBanner(messageKey) {
  if (!accessBanner || !accessBannerMessage) return;
  accessBannerMessage.textContent = t(messageKey);
  accessBanner.hidden = false;
}

function hideAccessBanner() {
  if (!accessBanner) return;
  accessBanner.hidden = true;
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

function getAdminToken() {
  return adminTokenInput?.value.trim() || "";
}

function persistAdminToken() {
  if (!adminTokenInput) return;
  const savedToken =
    sessionStorage.getItem(STORAGE_KEYS.adminToken) ||
    localStorage.getItem(STORAGE_KEYS.adminToken);
  if (savedToken) {
    sessionStorage.setItem(STORAGE_KEYS.adminToken, savedToken);
    adminTokenInput.value = savedToken;
    resetAdminTokenIdleTimer();
    localStorage.removeItem(STORAGE_KEYS.adminToken);
  }
  adminTokenInput.addEventListener("input", () => {
    setAdminToken(adminTokenInput.value);
  });
}

function isAdmin() {
  return currentUser?.role === "admin";
}

function hasAdminAccess() {
  return Boolean(getAdminToken() || (authToken && isAdmin()));
}

function clearAdminTokenTimer() {
  if (adminTokenIdleTimer) {
    clearTimeout(adminTokenIdleTimer);
    adminTokenIdleTimer = null;
  }
}

function resetAdminTokenIdleTimer() {
  clearAdminTokenTimer();
  const token = getAdminToken();
  if (!token) return;
  adminTokenIdleTimer = setTimeout(() => {
    clearAdminToken("messages.adminTokenExpired");
  }, ADMIN_TOKEN_IDLE_MS);
}

function clearAdminToken(messageKey = null) {
  const hadToken = Boolean(getAdminToken());
  setAdminToken("");
  if (hadToken && messageKey) {
    log(t(messageKey));
  }
}

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

function requireAdminAccess(showMessage = true) {
  const allowed = hasAdminAccess();
  if (!allowed && showMessage) {
    log(t("messages.adminRoleRequired"), true);
    setFieldError(adminTokenError, t("messages.adminRoleRequired"));
  }
  return allowed;
}

function redirectToLogin() {
  window.location.href = "../client-web/index.html";
}

function enforceRestrictedPageAccess(options = {}) {
  const { allowAdminTokenEntry = false } = options;
  const adminTokenEntryAllowed = allowAdminTokenEntry || adminTokenBootstrapAllowed;
  if (!sessionCheckComplete) {
    return true;
  }
  const isLoggedIn = Boolean(authToken && currentUser);
  if (pageName === "management" && !isLoggedIn) {
    log(t("messages.loginRequired"), true);
    showAccessBanner("messages.loginRequired");
    return false;
  }
  const hasAccess = hasAdminAccess();
  if (pageName === "admin" && !hasAccess) {
    if (!adminTokenEntryAllowed) {
      log(t("messages.adminRoleRequired"), true);
      showAccessBanner("messages.accessWarning");
    }
    return adminTokenEntryAllowed;
  }
  adminTokenBootstrapAllowed = false;
  hideAccessBanner();
  return true;
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

function syncAdminUi() {
  const adminMode = isAdmin() || Boolean(getAdminToken());
  const adminBusy = adminStatus.isChecking;
  adminOnlySections.forEach((section) => {
    section.hidden = !adminMode;
  });
  [refreshAdminDataButton, refreshCardsButton, refreshDecksButton, refreshUsersButton, refreshAdminRoomsButton].forEach((button) => {
    if (button) {
      button.disabled = !adminMode || adminBusy;
    }
  });
  if (adminStatusLabel) {
    let statusKey = "admin.status.idle";
    if (adminBusy) {
      statusKey = "admin.status.checking";
    } else if (adminMode) {
      statusKey = "admin.status.valid";
    } else {
      statusKey = "admin.status.invalid";
    }
    adminStatusLabel.textContent = t(statusKey);
    adminStatusLabel.hidden = false;
    adminStatusLabel.classList.toggle("success", adminMode && !adminBusy);
    adminStatusLabel.classList.toggle("warning", adminBusy);
  }
}

function setUserInfo() {
  if (roleChipValue) {
    roleChipValue.textContent = currentUser?.role || t("session.roleGuest");
  }
  if (!userInfo) return;
  if (!currentUser) {
    userInfo.textContent = t("login.notSignedIn");
    syncAdminUi();
    syncNavLinks();
    return;
  }
  const roomNote = currentRoomCode
    ? ` | ${t("rooms.meta.code")}: <strong>${currentRoomCode}</strong>`
    : "";
  userInfo.innerHTML = `<strong>${currentUser.display_name}</strong> (ID: ${currentUser.id})${roomNote}`;
  syncAdminUi();
  syncNavLinks();
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
  sessionCheckComplete = true;
  adminTokenBootstrapAllowed = pageName === "admin" && !hasAdminAccess();
  enforceRestrictedPageAccess({ allowAdminTokenEntry: true });
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
    setCurrentRoom(room.code);
    log(t("messages.roomCreated", { name: room.name, code: room.code }));
    document.getElementById("roomName").value = "";
    await loadRooms();
    await prepareGameplayArea();
  } catch (error) {
    log(error.message, true);
  }
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
  decksCache = decks;
  updateDeckImportTargets();

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

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.className = "ghost";
    editButton.textContent = t("decks.edit");
    editButton.addEventListener("click", () => startDeckEdit(deck));
    actions.appendChild(editButton);

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

function updateDeckImportTargets() {
  if (!deckImportTarget) return;
  const previousValue = deckImportTarget.value;
  deckImportTarget.innerHTML = "";

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = t("decks.import.targetNew");
  deckImportTarget.appendChild(defaultOption);

  decksCache.forEach((deck) => {
    const option = document.createElement("option");
    option.value = String(deck.id);
    option.textContent = `${deck.name} (#${deck.id})`;
    deckImportTarget.appendChild(option);
  });

  if (previousValue && decksCache.some((deck) => String(deck.id) === previousValue)) {
    deckImportTarget.value = previousValue;
  }
}

function syncDeckFormState() {
  if (!deckForm) return;
  const submitButton = deckForm.querySelector('button[type="submit"]');
  if (submitButton) {
    submitButton.textContent = deckEditId
      ? t("decks.form.update")
      : t("decks.form.submit");
  }

  if (resetDeckFormButton) {
    resetDeckFormButton.textContent = deckEditId
      ? t("decks.form.cancelEdit")
      : t("decks.form.reset");
  }

  if (deckEditStatus) {
    if (deckEditId) {
      deckEditStatus.hidden = false;
      deckEditStatus.textContent = t("decks.editing", { id: deckEditId });
    } else {
      deckEditStatus.hidden = true;
      deckEditStatus.textContent = "";
    }
  }

  if (deckForm) {
    deckForm.classList.toggle("editing", Boolean(deckEditId));
  }
}

function startDeckEdit(deck) {
  if (!deckForm) return;
  deckEditId = deck.id;
  deckForm.dataset.editing = String(deck.id);
  document.getElementById("deckName").value = deck.name || "";
  document.getElementById("deckDescription").value = deck.description || "";
  document.getElementById("deckCardIds").value = (deck.card_ids || []).join(",");
  syncDeckFormState();
  setFieldError(deckFormError, "");
  deckForm.scrollIntoView({ behavior: "smooth", block: "start" });
}

function clearDeckEdit() {
  deckEditId = null;
  if (deckForm) {
    delete deckForm.dataset.editing;
    deckForm.reset();
  }
  setFieldError(deckFormError, "");
  syncDeckFormState();
}

async function loadCards() {
  if (!cardsList) return;
  if (!requireAdminAccess()) return;
  try {
    const response = await fetch(apiUrl("/admin/cards"), {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    if (!response.ok) {
      if (response.status === 401) {
        handleAuthFailure();
      }
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
  if (!decksList) return;
  if (!requireAdminAccess()) return;
  try {
    const response = await fetch(apiUrl("/admin/decks"), {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    if (!response.ok) {
      if (response.status === 401) {
        handleAuthFailure();
      }
      throw new Error(t("messages.unableLoadDecks", { status: response.status }));
    }
    const decks = await response.json();
    renderDecks(decks);
    log(t("messages.decksLoaded", { count: decks.length }));
  } catch (error) {
    log(error.message, true);
  }
}

function renderUsers(users) {
  if (!usersList) return;
  usersList.innerHTML = "";
  if (!users.length) {
    usersList.innerHTML = `<li class="muted">${t("users.listEmpty")}</li>`;
    return;
  }

  users.forEach((user) => {
    const item = document.createElement("li");
    const title = document.createElement("div");
    title.className = "title";
    title.textContent = `${user.display_name} (${user.provider})`;

    const meta = document.createElement("div");
    meta.className = "meta";
    meta.textContent = `ID: ${user.id}`;

    const actions = document.createElement("div");
    actions.className = "item-actions";

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

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "ghost";
    deleteButton.textContent = t("users.delete");
    deleteButton.addEventListener("click", () => deleteUserAccount(user));
    actions.appendChild(deleteButton);

    item.appendChild(title);
    item.appendChild(meta);
    item.appendChild(actions);
    usersList.appendChild(item);
  });
}

async function loadUsers() {
  if (!usersList) return;
  if (!requireAdminAccess()) return;
  try {
    const response = await fetch(apiUrl("/admin/users"), {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    if (!response.ok) {
      if (response.status === 401) {
        handleAuthFailure();
      }
      throw new Error(t("messages.unableLoadUsers", { status: response.status }));
    }
    const users = await response.json();
    renderUsers(users);
  } catch (error) {
    log(error.message, true);
  }
}

async function updateUserRole(userId, role) {
  try {
    const response = await fetch(apiUrl(`/admin/users/${userId}/role`), {
      method: "PATCH",
      headers: adminHeaders(),
      body: JSON.stringify({ role }),
    });
    if (!response.ok) {
      const errText = await response.text();
      if (response.status === 401) {
        handleAuthFailure();
      }
      throw new Error(
        t("messages.updateRoleFailed", { status: response.status, detail: errText })
      );
    }
    const user = await response.json();
    log(t("messages.roleUpdated", { name: user.display_name, role: user.role }));
    await loadUsers();
  } catch (error) {
    log(error.message, true);
  }
}

async function deleteUserAccount(user) {
  if (!confirm(t("messages.deleteUserConfirm", { name: user.display_name }))) return;
  try {
    const response = await fetch(apiUrl(`/admin/users/${user.id}`), {
      method: "DELETE",
      headers: adminHeaders(),
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

function renderAdminRooms(rooms) {
  if (!adminRoomsList) return;
  adminRoomsList.innerHTML = "";
  if (!rooms.length) {
    adminRoomsList.innerHTML = `<li class="muted">${t("rooms.adminEmpty")}</li>`;
    return;
  }

  rooms.forEach((room) => {
    const item = document.createElement("li");
    const title = document.createElement("div");
    title.className = "title";
    title.textContent = `${room.name} (${room.code})`;

    const meta = document.createElement("div");
    meta.className = "meta";
    meta.textContent = `${t("rooms.meta.host")}: ${room.host_user_id} | ${t("rooms.meta.players")}: ${room.player_count}/${room.max_players}`;

    const actions = document.createElement("div");
    actions.className = "item-actions";
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "ghost";
    deleteButton.textContent = t("rooms.delete");
    deleteButton.addEventListener("click", () => deleteAdminRoom(room.code));
    actions.appendChild(deleteButton);

    item.appendChild(title);
    item.appendChild(meta);
    item.appendChild(actions);
    adminRoomsList.appendChild(item);
  });
}

async function loadAdminRooms() {
  if (!adminRoomsList) return;
  if (!requireAdminAccess()) return;
  try {
    const response = await fetch(apiUrl("/admin/rooms"), {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    if (!response.ok) {
      if (response.status === 401) {
        handleAuthFailure();
      }
      throw new Error(
        t("messages.unableLoadAdminRooms", { status: response.status })
      );
    }
    const rooms = await response.json();
    renderAdminRooms(rooms);
  } catch (error) {
    log(error.message, true);
  }
}

async function deleteAdminRoom(roomCode) {
  if (!confirm(t("messages.deleteRoomConfirm", { code: roomCode }))) return;
  try {
    const response = await fetch(apiUrl(`/admin/rooms/${roomCode}`), {
      method: "DELETE",
      headers: adminHeaders(),
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
    setFieldError(cardFormError, "");
    await loadCards();
  } catch (error) {
    setFieldError(cardFormError, error.message);
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

async function submitDeck(event) {
  event.preventDefault();
  setFieldError(deckFormError, "");
  const name = document.getElementById("deckName").value.trim();
  const description = document.getElementById("deckDescription").value.trim();
  const cardIdsInput = document.getElementById("deckCardIds").value;
  const card_ids = parseCardIds(cardIdsInput);
  if (!name) {
    const message = t("messages.deckNameRequired");
    setFieldError(deckFormError, message);
    log(message, true);
    return;
  }

  const isEdit = Boolean(deckEditId);
  const endpoint = isEdit ? `/admin/decks/${deckEditId}` : "/admin/decks";
  const method = isEdit ? "PUT" : "POST";

  try {
    const response = await fetch(apiUrl(endpoint), {
      method,
      headers: adminHeaders(),
      body: JSON.stringify({ name, description: description || null, card_ids }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(
        t(isEdit ? "messages.updateDeckFailed" : "messages.createDeckFailed", {
          status: response.status,
          detail: errText,
        })
      );
    }

    const deck = await response.json();
    log(
      t(isEdit ? "messages.deckUpdated" : "messages.deckCreated", {
        name: deck.name,
        id: deck.id,
      })
    );
    if (!isEdit && deckForm) {
      deckForm.reset();
    }
    setFieldError(deckFormError, "");
    if (isEdit) {
      clearDeckEdit();
    }
    await loadDecks();
  } catch (error) {
    setFieldError(deckFormError, error.message);
    log(error.message, true);
  }
}

async function deleteCard(cardId) {
  if (!confirm(t("messages.deleteCardConfirm", { id: cardId }))) return;
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

async function deleteDeck(deckId) {
  if (!confirm(t("messages.deleteDeckConfirm", { id: deckId }))) return;
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

async function exportDeck(deckId) {
  try {
    const response = await fetch(apiUrl(`/admin/decks/${deckId}/export`), {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    if (!response.ok) {
      const errText = await response.text();
      if (response.status === 401) {
        handleAuthFailure();
      }
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
    if (!response.ok) {
      const errText = await response.text();
      throw new Error(
        t("messages.importDeckFailed", { status: response.status, detail: errText })
      );
    }

    const deck = await response.json();
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

async function loadAdminData() {
  if (!requireAdminAccess()) return;
  adminStatus.isChecking = true;
  syncAdminUi();
  try {
    await Promise.all([loadCards(), loadDecks(), loadUsers(), loadAdminRooms()]);
    log(t("messages.adminDataLoaded"));
  } finally {
    adminStatus.isChecking = false;
    syncAdminUi();
  }
}

function wireEvents() {
  if (guestLoginForm) guestLoginForm.addEventListener("submit", handleGuestLogin);
  if (registerGuestButton)
    registerGuestButton.addEventListener("click", handleGuestRegistration);
  if (roomForm) roomForm.addEventListener("submit", createRoom);
  if (refreshRoomsButton) refreshRoomsButton.addEventListener("click", loadRooms);
  if (refreshAdminDataButton)
    refreshAdminDataButton.addEventListener("click", loadAdminData);
  if (refreshCardsButton) refreshCardsButton.addEventListener("click", loadCards);
  if (refreshDecksButton) refreshDecksButton.addEventListener("click", loadDecks);
  if (refreshUsersButton) refreshUsersButton.addEventListener("click", loadUsers);
  if (refreshAdminRoomsButton)
    refreshAdminRoomsButton.addEventListener("click", loadAdminRooms);
  if (cardForm) cardForm.addEventListener("submit", createCard);
  if (deckForm) deckForm.addEventListener("submit", submitDeck);
  if (resetCardFormButton)
    resetCardFormButton.addEventListener("click", () => {
      cardForm?.reset();
      setFieldError(cardFormError, "");
    });
  if (resetDeckFormButton)
    resetDeckFormButton.addEventListener("click", () => {
      clearDeckEdit();
    });
  if (importDeckButton) importDeckButton.addEventListener("click", importDeck);
  if (drawCardButton) drawCardButton.addEventListener("click", drawFromDeck);
  if (resetGameplayButton)
    resetGameplayButton.addEventListener("click", () => prepareGameplayArea(true));
  if (languageSelector)
    languageSelector.addEventListener("change", (event) => {
      setLanguage(event.target.value);
    });
  document.querySelectorAll(".nav [data-nav]").forEach((link) => {
    link.addEventListener("click", (event) => {
      if (link.getAttribute("aria-disabled") === "true") {
        event.preventDefault();
        const messageKey = link.dataset.guardMessage;
        if (messageKey) {
          showAccessBanner(messageKey);
          log(t(messageKey), true);
        }
      }
    });
  });

  if (accessBannerLogin)
    accessBannerLogin.addEventListener("click", () => redirectToLogin());
  if (accessBannerDismiss)
    accessBannerDismiss.addEventListener("click", hideAccessBanner);
  if (clearAdminTokenButton)
    clearAdminTokenButton.addEventListener("click", () =>
      clearAdminToken("messages.adminTokenCleared")
    );
  ["pointerdown", "keydown", "mousemove"].forEach((eventName) => {
    document.addEventListener(eventName, resetAdminTokenIdleTimer, { passive: true });
  });
}

persistApiBase();
persistAdminToken();
setLanguage(currentLanguage);
wireEvents();
setUserInfo();
restoreSession();
log(t("messages.ready"));
