// modules/state.js

// Simple reactive-ish state manager
// Provides global state + event listeners

export const state = {
    // Auth / Session
    token: null,
    authToken: null,
    user: null,
    currentUser: null,
    apiBase: "",

    // Rooms
    rooms: [],
    selectedRoom: null,
    currentRoom: null,
    currentRoomCode: null,

    // Gameplay snapshots
    deck: [],
    hand: [],
    workspace: [],
    selectedCard: null,

    // Admin listings
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
        this.token = token;
        this.authToken = token;
        this.emit("tokenChanged", token);
    },

    setUser(user) {
        this.user = user;
        this.currentUser = user;
        this.emit("userChanged", user);
    },

    setApiBase(apiBase) {
        this.apiBase = apiBase || "";
        this.emit("apiBaseChanged", this.apiBase);
    },

    setRooms(rooms) {
        this.rooms = rooms;
        this.emit("roomsChanged", rooms);
        this.emit("roomsUpdated", rooms);
    },

    selectRoom(room) {
        this.selectedRoom = room;
        this.emit("roomSelected", room);
    },

    setCurrentRoom(roomCode) {
        this.currentRoom = roomCode || null;
        this.currentRoomCode = this.currentRoom;
        this.emit("currentRoomChanged", this.currentRoom);
    },

    setDeck(deck) {
        this.deck = [...(deck || [])];
        this.emit("deckChanged", this.deck);
    },

    setHand(hand) {
        this.hand = [...(hand || [])];
        this.emit("handChanged", this.hand);
    },

    setWorkspace(cards) {
        this.workspace = [...(cards || [])];
        this.emit("workspaceChanged", this.workspace);
    },

    selectCard(card) {
        this.selectedCard = card || null;
        this.emit("cardSelected", this.selectedCard);
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
