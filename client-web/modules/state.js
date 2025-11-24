// modules/state.js

// Simple reactive-ish state manager
// Provides global state + event listeners

export const state = {
    // Auth
    authToken: null,
    currentUser: null,

    // Rooms
    rooms: [],
    selectedRoom: null,

    // Cards / Decks (на майбутнє)
    cards: [],
    decks: [],

    // --- EVENTS ---
    listeners: {},

    on(event, handler) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(handler);
    },

    emit(event, payload) {
        if (!this.listeners[event]) return;
        for (const h of this.listeners[event]) {
            try {
                h(payload);
            } catch (err) {
                console.error("State listener error:", err);
            }
        }
    },

    // --- MUTATIONS ---
    setToken(token) {
        this.authToken = token;
        this.emit("tokenChanged", token);
    },

    setUser(user) {
        this.currentUser = user;
        this.emit("userChanged", user);
    },

    setRooms(rooms) {
        this.rooms = rooms;
        this.emit("roomsChanged", rooms);
    },

    selectRoom(room) {
        this.selectedRoom = room;
        this.emit("roomSelected", room);
    },

    setCards(cards) {
        this.cards = cards;
        this.emit("cardsChanged", cards);
    },

    setDecks(decks) {
        this.decks = decks;
        this.emit("decksChanged", decks);
    }
};
