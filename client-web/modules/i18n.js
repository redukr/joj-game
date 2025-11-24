// modules/i18n.js

import { state } from "./state.js";

// Default language
let currentLang = "en";

// --- TRANSLATION DICTIONARY ---

// Expand this gradually. Add only what already exists in current UI.
export const translations = {
    en: {
        login: "Login",
        username: "Username",
        roomName: "Room name",
        join: "Join",
        createRoom: "Create room",
        noRooms: "No rooms available",
        players: "Players",
        spectators: "Spectators",
        selectRoom: "Select a room...",
        error: "Error",
        logout: "Logout",
        loading: "Loading...",
		"rooms.list.heading": "Rooms",
		"rooms.create.submit": "Create",
		"rooms.meta.code": "Room code",
		"rooms.create.heading": "Create a new room",
		"game.heading": "Gameplay workspace",
		"rooms.active.heading": "Active room",
		"rooms.create.namePlaceholder": "Room name",
		"rooms.list.join": "Join",
		"rooms.empty": "No rooms available",

    },

    uk: {
        login: "Увійти",
        username: "Ім'я користувача",
        roomName: "Назва кімнати",
        join: "Приєднатись",
        createRoom: "Створити кімнату",
        noRooms: "Немає доступних кімнат",
        players: "Гравці",
        spectators: "Спостерігачі",
        selectRoom: "Оберіть кімнату...",
        error: "Помилка",
        logout: "Вийти",
        loading: "Завантаження...",
		"rooms.list.heading": "Кімнати",
		"rooms.create.submit": "Створити",
		"rooms.meta.code": "Код кімнати",
		"rooms.create.heading": "Створити нову кімнату",
		"game.heading": "Робоча зона гри",
		"rooms.active.heading": "Активна кімната",
		"rooms.create.namePlaceholder": "Назва кімнати",
		"rooms.list.join": "Приєднатися",
		"rooms.empty": "Немає доступних кімнат",

    }
};

// --- BASIC TEXT RETRIEVAL ---


export function t(key, vars = {}) {
    const tmpl = translations[currentLang]?.[key] || key;

    return tmpl.replace(/\{\{(\w+)\}\}/g, (_, k) => {
        return vars[k] ?? "";
    });
}


// --- LANGUAGE CONTROL ---

export function setLanguage(lang) {
    if (!translations[lang]) return;

    currentLang = lang;
    localStorage.setItem("lang", lang);

    state.emit("languageChanged", lang);
}

export function getLanguage() {
    return currentLang;
}

// --- INITIALIZATION ---

export function initI18n() {
    const saved = localStorage.getItem("lang");
    if (saved && translations[saved]) {
        currentLang = saved;
    }
}

document.addEventListener("languageChanged", () => {
    // i18n does not update DOM directly
});
