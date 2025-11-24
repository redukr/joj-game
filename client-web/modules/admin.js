import { t, initI18n, setLanguage, getLanguage, translations } from "./i18n.js";
import * as UI from "./ui.js";
import * as API from "./api.js";
import * as Auth from "./auth.js";
import * as Rooms from "./rooms.js";
import { state } from "./state.js";
import * as Validation from "./validation.js";

const STORAGE_KEYS = {
  apiBase: "joj-api-base",
  adminToken: "joj-admin-token",
  language: "joj-language",
};

const adminRoomsList = document.getElementById("adminRoomsList");
const refreshAdminRoomsButton = document.getElementById("refreshAdminRooms");
const usersList = document.getElementById("usersList");
const refreshUsersButton = document.getElementById("refreshUsers");
const deckImportTarget = document.getElementById("deckImportTarget");
const deckImportError = document.getElementById("deckImportError");

let adminStatus = {
  value: localStorage.getItem(STORAGE_KEYS.adminToken) || "",
  isValid: false,
  isChecking: false,
};

function ensureTranslations() {
  // Extend the simple i18n dictionary with admin-specific strings so UI helpers have labels.
  translations.en = {
    ...translations.en,
    "session.adminLabel": "Admin",
    "session.adminMissing": "Token missing",
    "admin.status.valid": "Admin token validated",
    "admin.status.invalid": "Admin token invalid",
    "admin.status.checking": "Checking admin token...",
    "admin.status.idle": "Admin token required",
    "rooms.adminHeading": "Rooms",
    "rooms.adminHint": "Inspect active rooms and remove stale ones.",
    "rooms.refresh": "Refresh",
    "rooms.list.empty": "No rooms available",
    "rooms.meta.host": "Host",
    "rooms.delete": "Delete room",
    "users.heading": "Users",
    "users.refresh": "Refresh",
    "users.hint": "Review users, assign roles, or remove accounts.",
    "users.role": "Role",
    "users.delete": "Delete",
    "users.listEmpty": "No users found",
    "messages.ready": "Admin tools ready.",
    "messages.adminTokenSaved": "Admin token updated.",
    "messages.adminVerified": "Admin token accepted.",
    "messages.adminRequired": "Admin access required.",
    "messages.cardsLoaded": "Cards loaded ({count}).",
    "messages.decksLoaded": "Decks loaded ({count}).",
    "messages.usersLoaded": "Users loaded ({count}).",
    "messages.roomsLoaded": "Rooms loaded ({count}).",
    "messages.cardCreated": "Card created (#{{id}}).",
    "messages.cardDeleted": "Card deleted (#{{id}}).",
    "messages.deckCreated": "Deck created (#{{id}}).",
    "messages.deckDeleted": "Deck deleted (#{{id}}).",
    "messages.roleUpdated": "Updated user {{name}} role to {{role}}.",
    "messages.userDeleted": "Removed user {{name}}.",
    "messages.roomDeleted": "Room {{code}} removed.",
    "messages.deckExported": "Exported deck #{{id}}.",
    "messages.deckImported": "Deck import completed.",
    "messages.importDeckInvalid": "Provide valid deck JSON to import.",
    "messages.adminDataLoaded": "Admin data loaded.",
    "messages.operationFailed": "Operation failed: {{reason}}",
    "decks.import.targetNew": "Create new deck",
    "messages.adminTokenRequired": "Admin token required.",
    "messages.invalidAdminToken": "Admin token invalid.",
    "messages.displayNameRequired": "Display name is required.",
    "messages.passwordRequired": "Password is required.",
  };

  translations.uk = {
    ...translations.uk,
    "session.adminLabel": "Адмін",
    "session.adminMissing": "Немає токена",
    "admin.status.valid": "Токен адміністратора підтверджено",
    "admin.status.invalid": "Токен адміністратора недійсний",
    "admin.status.checking": "Перевірка токена адміністратора...",
    "admin.status.idle": "Потрібен токен адміністратора",
    "rooms.adminHeading": "Кімнати",
    "rooms.adminHint": "Переглядайте активні кімнати та очищайте застарілі.",
    "rooms.refresh": "Оновити",
    "rooms.list.empty": "Немає доступних кімнат",
    "rooms.meta.host": "Хост",
    "rooms.delete": "Видалити кімнату",
    "users.heading": "Користувачі",
    "users.refresh": "Оновити",
    "users.hint": "Перегляд користувачів, ролей та видалення обліковок.",
    "users.role": "Роль",
    "users.delete": "Видалити",
    "users.listEmpty": "Користувачів не знайдено",
    "messages.ready": "Адмін інструменти готові.",
    "messages.adminTokenSaved": "Токен адміністратора оновлено.",
    "messages.adminVerified": "Токен адміністратора прийнято.",
    "messages.adminRequired": "Потрібен доступ адміністратора.",
    "messages.cardsLoaded": "Картки завантажено ({{count}}).",
    "messages.decksLoaded": "Колоди завантажено ({{count}}).",
    "messages.usersLoaded": "Користувачів завантажено ({{count}}).",
    "messages.roomsLoaded": "Кімнати завантажено ({{count}}).",
    "messages.cardCreated": "Картку створено (#{{id}}).",
    "messages.cardDeleted": "Картку видалено (#{{id}}).",
    "messages.deckCreated": "Колоду створено (#{{id}}).",
    "messages.deckDeleted": "Колоду видалено (#{{id}}).",
    "messages.roleUpdated": "Роль користувача {{name}} змінено на {{role}}.",
    "messages.userDeleted": "Користувача {{name}} видалено.",
    "messages.roomDeleted": "Кімнату {{code}} видалено.",
    "messages.deckExported": "Колоду #{{id}} експортовано.",
    "messages.deckImported": "Імпорт колоди завершено.",
    "messages.importDeckInvalid": "Надайте коректний JSON для імпорту.",
    "messages.adminDataLoaded": "Адмін дані завантажено.",
    "messages.operationFailed": "Помилка: {{reason}}",
    "decks.import.targetNew": "Створити нову колоду",
    "messages.adminTokenRequired": "Потрібен токен адміністратора.",
    "messages.invalidAdminToken": "Токен адміністратора недійсний.",
    "messages.displayNameRequired": "Потрібне ім'я користувача.",
    "messages.passwordRequired": "Потрібен пароль.",
  };
}

function persistApiBase(base) {
  localStorage.setItem(STORAGE_KEYS.apiBase, base);
  API.setApiBase(base);
}

function restoreApiBase() {
  const saved = localStorage.getItem(STORAGE_KEYS.apiBase) || "";
  if (saved) {
    API.setApiBase(saved);
  }
  return saved;
}

function persistLanguage(lang) {
  localStorage.setItem(STORAGE_KEYS.language, lang);
  setLanguage(lang);
  UI.setLanguageSelector(lang);
}

function restoreLanguage() {
  const saved = localStorage.getItem(STORAGE_KEYS.language);
  if (saved) {
    setLanguage(saved);
  }
  UI.setLanguageSelector(getLanguage());
  UI.applyTranslations();
}

function persistAdminToken(value) {
  adminStatus = { value, isValid: false, isChecking: false };
  localStorage.setItem(STORAGE_KEYS.adminToken, value);
  UI.setAdminTokenValue(value);
  UI.syncAdminUi(adminStatus);
  syncSessionBar();
}

function log(message, isError = false) {
  UI.logStatus(message, isError);
}

function syncSessionBar() {
  UI.syncSessionBar({
    apiBase: state.apiBase,
    user: state.user,
    roomCode: state.currentRoom,
    adminMode: adminStatus.isValid,
    adminToken: adminStatus.value,
  });
  UI.toggleNavVisibility({
    isAuthenticated: Boolean(state.token && state.user),
    isAdmin: adminStatus.isValid,
  });
}

function handleStateChanges() {
  state.on("tokenChanged", syncSessionBar);
  state.on("userChanged", syncSessionBar);
  state.on("currentRoomChanged", syncSessionBar);
}

function normalizeError(error) {
  if (!error) return "Unknown error";
  if (error.message) return error.message;
  return String(error);
}

async function verifyAdminToken(value = adminStatus.value) {
  const token = (value || "").trim();
  adminStatus = { value: token, isValid: false, isChecking: Boolean(token) };
  UI.syncAdminUi(adminStatus);
  syncSessionBar();

  if (!token) {
    return false;
  }

  try {
    await API.verifyAdminToken(token);
    adminStatus = { value: token, isValid: true, isChecking: false };
    UI.syncAdminUi(adminStatus);
    syncSessionBar();
    log(t("messages.adminVerified"));
    return true;
  } catch (error) {
    adminStatus = { value: token, isValid: false, isChecking: false };
    UI.syncAdminUi(adminStatus);
    syncSessionBar();
    log(normalizeError(error), true);
    return false;
  }
}

function requireAdminToken() {
  try {
    return Validation.ensureAdminToken({
      token: adminStatus.value,
      isValid: adminStatus.isValid,
    });
  } catch (error) {
    const message = error.code ? t(`messages.${error.code}`) : normalizeError(error);
    log(message || t("messages.adminRequired"), true);
    return null;
  }
}

async function loadCards() {
  const token = requireAdminToken();
  if (!token) return;
  try {
    const cards = await API.loadAdminCards(token);
    state.setCards(cards);
    UI.renderCards(cards, { onDeleteCard: deleteCard });
    log(t("messages.cardsLoaded", { count: cards.length }));
  } catch (error) {
    log(normalizeError(error), true);
  }
}

async function loadDecks() {
  const token = requireAdminToken();
  if (!token) return;
  try {
    const decks = await API.loadAdminDecks(token);
    state.setDecks(decks);
    UI.renderDecks(decks, { onExportDeck: exportDeck, onDeleteDeck: deleteDeck });
    populateDeckImportTargets(decks);
    log(t("messages.decksLoaded", { count: decks.length }));
  } catch (error) {
    log(normalizeError(error), true);
  }
}

async function loadUsers() {
  const token = requireAdminToken();
  if (!token) return;
  try {
    const users = await API.loadAdminUsers(token);
    renderUsers(users);
    log(t("messages.usersLoaded", { count: users.length }));
  } catch (error) {
    log(normalizeError(error), true);
  }
}

async function loadAdminRooms() {
  const token = requireAdminToken();
  if (!token) return;
  try {
    const rooms = await API.loadAdminRooms(token);
    renderAdminRooms(rooms);
    log(t("messages.roomsLoaded", { count: rooms.length }));
  } catch (error) {
    log(normalizeError(error), true);
  }
}

async function loadAdminData() {
  if (!(await verifyAdminToken())) return;
  await Promise.all([loadCards(), loadDecks(), loadUsers(), loadAdminRooms()]);
  log(t("messages.adminDataLoaded"));
}

async function deleteCard(cardId) {
  const token = requireAdminToken();
  if (!token) return;
  try {
    await API.deleteCard(token, cardId);
    log(t("messages.cardDeleted", { id: cardId }));
    await loadCards();
  } catch (error) {
    log(normalizeError(error), true);
  }
}

async function deleteDeck(deckId) {
  const token = requireAdminToken();
  if (!token) return;
  try {
    await API.deleteDeck(token, deckId);
    log(t("messages.deckDeleted", { id: deckId }));
    await loadDecks();
  } catch (error) {
    log(normalizeError(error), true);
  }
}

async function exportDeck(deckId) {
  const token = requireAdminToken();
  if (!token) return;
  try {
    const payload = await API.exportDeck(token, deckId);
    log(t("messages.deckExported", { id: deckId }));
    console.log("Deck export", payload);
  } catch (error) {
    log(normalizeError(error), true);
  }
}

async function createCard(values) {
  const token = requireAdminToken();
  if (!token) return;

  try {
    const payload = Validation.validateCardPayload(values);
    const resourcePayload = values?.resources || {};
    const response = await API.createCard(token, { ...payload, ...resourcePayload });
    log(t("messages.cardCreated", { id: response?.id }));
    UI.setCardForm({ clear: true });
    await loadCards();
  } catch (error) {
    log(normalizeError(error), true);
  }
}

function parseCardIds(raw) {
  if (!raw) return [];
  return raw
    .split(",")
    .map((value) => Number.parseInt(value.trim(), 10))
    .filter((value) => Number.isInteger(value));
}

async function createDeck(values) {
  const token = requireAdminToken();
  if (!token) return;

  try {
    const payload = Validation.validateDeckPayload({
      name: values.name,
      description: values.description,
      card_ids: parseCardIds(values.cardIds),
    });
    const response = await API.createDeck(token, payload);
    log(t("messages.deckCreated", { id: response?.id }));
    UI.setDeckForm({ clear: true });
    await loadDecks();
  } catch (error) {
    log(normalizeError(error), true);
  }
}

async function importDeck(rawPayload) {
  const token = requireAdminToken();
  if (!token) return;

  UI.setFieldError(deckImportError, "");
  try {
    const parsed = Validation.validateDeckImportPayload(rawPayload);
    const targetId = deckImportTarget?.value ? Number(deckImportTarget.value) : null;
    if (targetId) {
      await API.importDeck(token, { ...parsed, deck_id: targetId });
    } else {
      await API.importDeck(token, parsed);
    }
    UI.setDeckImportPayload("");
    if (deckImportTarget) deckImportTarget.value = "";
    log(t("messages.deckImported"));
    await loadDecks();
  } catch (error) {
    const message = error.code ? t(`messages.${error.code}`) : normalizeError(error);
    UI.setFieldError(deckImportError, message);
    log(message, true);
  }
}

async function updateUserRole(userId, role) {
  const token = requireAdminToken();
  if (!token) return;

  try {
    const user = await API.updateUserRole(token, userId, role);
    log(t("messages.roleUpdated", { name: user.display_name, role: user.role }));
    await loadUsers();
  } catch (error) {
    log(normalizeError(error), true);
  }
}

async function deleteUser(userId, displayName) {
  const token = requireAdminToken();
  if (!token) return;

  try {
    await API.deleteUser(token, userId);
    log(t("messages.userDeleted", { name: displayName || userId }));
    await loadUsers();
  } catch (error) {
    log(normalizeError(error), true);
  }
}

async function deleteAdminRoom(roomCode) {
  const token = requireAdminToken();
  if (!token) return;

  try {
    await API.deleteAdminRoom(token, roomCode);
    log(t("messages.roomDeleted", { code: roomCode }));
    await loadAdminRooms();
  } catch (error) {
    log(normalizeError(error), true);
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
    deleteButton.addEventListener("click", () => deleteUser(user.id, user.display_name));
    actions.appendChild(deleteButton);

    item.appendChild(title);
    item.appendChild(meta);
    item.appendChild(actions);
    usersList.appendChild(item);
  });
}

function renderAdminRooms(rooms) {
  if (!adminRoomsList) return;
  adminRoomsList.innerHTML = "";
  if (!rooms.length) {
    adminRoomsList.innerHTML = `<li class="muted">${t("rooms.list.empty")}</li>`;
    return;
  }

  rooms.forEach((room) => {
    const item = document.createElement("li");
    const title = document.createElement("div");
    title.className = "title";
    title.textContent = `${room.name} (${room.code})`;

    const meta = document.createElement("div");
    meta.className = "meta";
    meta.textContent = `${t("rooms.meta.host")}: ${room.host_user_id}`;

    const actions = document.createElement("div");
    actions.className = "item-actions";
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "ghost";
    deleteButton.textContent = t("rooms.delete", { code: room.code });
    deleteButton.addEventListener("click", () => deleteAdminRoom(room.code));
    actions.appendChild(deleteButton);

    item.appendChild(title);
    item.appendChild(meta);
    item.appendChild(actions);
    adminRoomsList.appendChild(item);
  });
}

function populateDeckImportTargets(decks) {
  if (!deckImportTarget) return;
  deckImportTarget.innerHTML = "";
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = t("decks.import.targetNew");
  deckImportTarget.appendChild(defaultOption);
  decks.forEach((deck) => {
    const option = document.createElement("option");
    option.value = deck.id;
    option.textContent = `${deck.name} (#${deck.id})`;
    deckImportTarget.appendChild(option);
  });
}

function restoreAuthSession() {
  const session = Auth.restoreSession();
  if (session) {
    Auth.setAuthSession(session.token, session.user);
  }
  syncSessionBar();
}

async function handleGuestLogin(credentials) {
  try {
    const valid = Validation.validateGuestCredentials(credentials);
    const { token, user } = await Auth.login({ ...valid, apiBase: state.apiBase });
    Auth.setAuthSession(token, user);
    log(`Signed in as ${user.display_name}`);
    await Rooms.loadRooms();
    syncSessionBar();
  } catch (error) {
    log(normalizeError(error), true);
  }
}

async function handleGuestRegistration(credentials) {
  try {
    const valid = Validation.validateGuestCredentials(credentials);
    const { token, user } = await Auth.register({ ...valid, apiBase: state.apiBase });
    Auth.setAuthSession(token, user);
    log(`Registered ${user.display_name}`);
    await Rooms.loadRooms();
    syncSessionBar();
  } catch (error) {
    log(normalizeError(error), true);
  }
}

async function handleCreateRoom(values) {
  try {
    const payload = Validation.validateRoomCreation({
      token: state.token,
      name: values.name,
      maxPlayers: values.maxPlayers,
      maxSpectators: values.maxSpectators,
    });
    await Rooms.createRoom(payload);
    await Rooms.loadRooms();
  } catch (error) {
    log(normalizeError(error), true);
  }
}

async function handleJoinRoom(roomCode) {
  try {
    await Rooms.joinRoom(roomCode);
    await Rooms.loadRooms();
  } catch (error) {
    log(normalizeError(error), true);
  }
}

function wireAdminExtras() {
  if (refreshUsersButton) {
    refreshUsersButton.addEventListener("click", loadUsers);
  }
  if (refreshAdminRoomsButton) {
    refreshAdminRoomsButton.addEventListener("click", loadAdminRooms);
  }
}

async function initAdminClient() {
  ensureTranslations();
  initI18n();
  const apiBase = restoreApiBase();
  restoreLanguage();
  restoreAuthSession();

  UI.initUI(
    {
      onApiBaseChange: persistApiBase,
      onGuestLogin: handleGuestLogin,
      onGuestRegister: handleGuestRegistration,
      onCreateRoom: handleCreateRoom,
      onRefreshRooms: Rooms.loadRooms,
      onAdminTokenInput: (value) => persistAdminToken(value),
      onAdminTokenBlur: verifyAdminToken,
      onLoadAdminData: loadAdminData,
      onRefreshCards: loadCards,
      onRefreshDecks: loadDecks,
      onCreateCard: createCard,
      onCreateDeck: createDeck,
      onImportDeck: importDeck,
      onLanguageChange: persistLanguage,
      onLogout: Auth.logout,
      onJoinRoom: handleJoinRoom,
    },
    { initialApiBase: apiBase, currentLanguage: getLanguage() }
  );

  handleStateChanges();
  wireAdminExtras();
  syncSessionBar();
  UI.syncAdminUi(adminStatus);
  log(t("messages.ready"));

  if (adminStatus.value) {
    await verifyAdminToken(adminStatus.value);
  }
}

initAdminClient();
export default initAdminClient;
