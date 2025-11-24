// modules/ui.js

import { state } from "./state.js";
import { t as T } from "./i18n.js";

// Cached DOM references
let dom = {};

export function applyNewTranslations() {
    // translate text content
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        el.textContent = T(key);
    });

    // translate placeholders
    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
        const key = el.getAttribute("data-i18n-placeholder");
        el.placeholder = T(key);
    });
}


export function updateAllLabels() {
    // текстові елементи
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        el.textContent = T(key);
    });

    // плейсхолдери
    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
        const key = el.getAttribute("data-i18n-placeholder");
        el.placeholder = T(key);
    });
}


// --- INITIALIZATION ---

export function initUI() {
    dom = {
        toast: document.getElementById("toast"),
        roomsTable: document.getElementById("rooms-table"),
        roomDetails: document.getElementById("room-details"),
        userPanel: document.getElementById("user-panel"),
        cardsContainer: document.getElementById("cards-container"),
    };

    // Attach state listeners
    state.on("userChanged", renderUserPanel);
    state.on("roomsChanged", renderRoomsTable);
    state.on("roomSelected", renderRoomDetails);
    state.on("cardsChanged", renderCardsList);
	state.on("languageChanged", applyNewTranslations);

}

// --- TOAST NOTIFICATION ---

export function showToast(msg, type = "info") {
    if (!dom.toast) return;

    dom.toast.textContent = msg;
    dom.toast.className = "toast " + type;
    dom.toast.style.opacity = "1";

    setTimeout(() => {
        dom.toast.style.opacity = "0";
    }, 2000);
}

// --- RENDER USER PANEL ---

export function renderUserPanel() {
    if (!dom.userPanel) return;

    const user = state.currentUser;

    if (!user) {
        dom.userPanel.innerHTML = `
            <div class="user-info">
                <span>Not logged in</span>
            </div>
        `;
        return;
    }

    dom.userPanel.innerHTML = `
        <div class="user-info">
            <strong>${user.username}</strong>
            <span class="user-provider">${user.provider}</span>
        </div>
    `;
}

// --- RENDER ROOMS TABLE ---

export function renderRoomsTable() {
    if (!dom.roomsTable) return;

    const rooms = state.rooms;

    if (!rooms.length) {
        dom.roomsTable.innerHTML = `
            <tr><td colspan="4">No rooms available</td></tr>
        `;
        return;
    }

    dom.roomsTable.innerHTML = rooms
        .map(r => `
            <tr class="room-row" data-room-id="${r.id}">
                <td>${r.id}</td>
                <td>${r.name}</td>
                <td>${r.members.length}/${r.max_players}</td>
                <td>
                    <button class="join-room" data-id="${r.id}">
                        Join
                    </button>
                </td>
            </tr>
        `)
        .join("");

    // Attach join buttons listeners
    document.querySelectorAll(".join-room").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.dataset.id;
            state.emit("joinRoomClicked", id);
        });
    });
}

// --- RENDER ROOM DETAILS ---

export function renderRoomDetails(room) {
    if (!dom.roomDetails) return;

    if (!room) {
        dom.roomDetails.innerHTML = `
            <div class="room-empty">
                <em>Select a room...</em>
            </div>
        `;
        return;
    }

    dom.roomDetails.innerHTML = `
        <h3>Room: ${room.name}</h3>
        <p>ID: ${room.id}</p>
        <p>Players: ${room.members.length}/${room.max_players}</p>
        <h4>Members:</h4>
        <ul>
            ${room.members.map(m => `<li>${m.username}</li>`).join("")}
        </ul>
    `;
}

// --- RENDER CARDS LIST ---

export function renderCardsList() {
    if (!dom.cardsContainer) return;

    const cards = state.cards;

    if (!cards.length) {
        dom.cardsContainer.innerHTML = `<p>No cards loaded</p>`;
        return;
    }

    dom.cardsContainer.innerHTML = cards
        .map(c => `
            <div class="card">
                <h4>${c.name}</h4>
                <p>${c.description}</p>
            </div>
        `)
        .join("");
}

applyNewTranslations();
