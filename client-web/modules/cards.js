// modules/cards.js

import { API } from "./api.js";
import { state } from "./state.js";
import { renderCardsList } from "./ui.js";

// Local cache to avoid repeated requests
let cardsCache = null;

// --- LOAD CARDS ---

export async function loadCards(force = false) {
    // Use cache unless force = true
    if (cardsCache && !force) {
        state.setCards(cardsCache);
        return cardsCache;
    }

    try {
        const cards = await API.get("/cards");
        cardsCache = cards;
        state.setCards(cards);
        return cards;
    } catch (err) {
        console.error("Failed to load cards:", err);
        throw err;
    }
}

// --- GET CARD BY ID ---

export function getCardById(id) {
    return state.cards.find(c => c.id === id) || null;
}

// --- FILTER CARDS (optional future use) ---

export function filterCards(by) {
    if (!state.cards.length) return [];
    return state.cards.filter(card => {
        for (const key in by) {
            if (card[key] !== by[key]) return false;
        }
        return true;
    });
}

// --- SELECT CARD (future expansion for game UI) ---

export function selectCard(cardId) {
    const card = getCardById(cardId);
    if (!card) return;
    state.emit("cardSelected", card);
}

// --- INITIALIZATION ---

export function initCards() {
    loadCards(); // preload cards on startup
}
