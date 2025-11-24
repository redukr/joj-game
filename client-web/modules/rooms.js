// modules/rooms.js

import { API } from "./api.js";
import { state } from "./state.js";
import { renderRoomsTable, renderRoomDetails } from "./ui.js";

// --- LOAD ROOMS ---

export async function loadRooms() {
    try {
        const rooms = await API.get("/rooms");
        state.setRooms(rooms);
    } catch (err) {
        console.error("Failed to load rooms:", err);
    }
}

// --- REFRESH ROOMS PERIODICALLY (optional) ---

let roomsInterval = null;

export function startRoomPolling(intervalMs = 4000) {
    if (roomsInterval) clearInterval(roomsInterval);
    roomsInterval = setInterval(loadRooms, intervalMs);
}

export function stopRoomPolling() {
    if (roomsInterval) clearInterval(roomsInterval);
    roomsInterval = null;
}

// --- CREATE ROOM ---

export async function createRoom(roomName, maxPlayers = 4, maxSpectators = 2) {
    if (!roomName || roomName.trim().length < 1) {
        throw new Error("INVALID_ROOM_NAME");
    }

    const payload = {
        name: roomName,
        max_players: maxPlayers,
        max_spectators: maxSpectators
    };

    const room = await API.post("/rooms", payload);

    // Update state
    await loadRooms();
    return room;
}

// --- JOIN ROOM ---

export async function joinRoom(roomId) {
    if (!roomId) {
        throw new Error("INVALID_ROOM_ID");
    }

    const room = await API.post(`/rooms/${roomId}/join`);

    state.selectRoom(room); // set active room
    renderRoomDetails(room); // update UI

    return room;
}

// --- SELECT ROOM (via UI click) ---

export function selectRoom(roomId) {
    const room = state.rooms.find(r => r.id === roomId);
    if (!room) return;
    state.selectRoom(room);
    renderRoomDetails(room);
}

// --- INITIALIZATION ---

export function initRooms() {
    loadRooms();
    startRoomPolling();
}
