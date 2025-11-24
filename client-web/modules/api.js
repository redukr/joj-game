// modules/api.js

// Centralized API client for server communication
// Automatically attaches auth tokens from global state

import { state } from "./state.js";

function normalizeBase(base) {
  return base ? base.replace(/\/$/, "") : "";
}

function buildUrl(path) {
  if (!state.apiBase) return path;
  return `${state.apiBase}${path}`;
}

function authToken() {
  return state.token ?? state.authToken ?? null;
}

async function request(path, { method = "GET", body, headers = {}, adminToken, skipAuth } = {}) {
  const finalHeaders = { ...headers };

  if (body !== undefined) {
    finalHeaders["Content-Type"] = "application/json";
  }

  if (adminToken) {
    finalHeaders["X-Admin-Token"] = adminToken;
  }

  if (!skipAuth) {
    const token = authToken();
    if (token) {
      finalHeaders.Authorization = `Bearer ${token}`;
    }
  }

  let response;
  try {
    response = await fetch(buildUrl(path), {
      method,
      headers: finalHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (error) {
    const networkError = new Error("NETWORK_ERROR");
    networkError.cause = error;
    throw networkError;
  }

  if (!response.ok) {
    let message = "";
    try {
      message = await response.text();
    } catch (error) {
      message = "";
    }
    const error = new Error(message || `Request failed with status ${response.status}`);
    error.status = response.status;
    error.body = message;
    throw error;
  }

  try {
    return await response.json();
  } catch (error) {
    return null;
  }
}

export function setApiBase(base) {
  state.setApiBase(normalizeBase(base));
}

export function loginGuest({ apiBase: base, displayName, password }) {
  if (base !== undefined) {
    setApiBase(base);
  }
  return request(
    "/auth/login",
    {
      method: "POST",
      body: { provider: "guest", display_name: displayName, password },
      skipAuth: true,
    }
  );
}

export function registerGuest({ apiBase: base, displayName, password }) {
  if (base !== undefined) {
    setApiBase(base);
  }
  return request(
    "/auth/register",
    {
      method: "POST",
      body: { provider: "guest", display_name: displayName, password },
      skipAuth: true,
    }
  );
}

export function loadRooms() {
  return request("/rooms");
}

export function createRoom({ name, maxPlayers, maxSpectators }) {
  return request("/rooms", {
    method: "POST",
    body: {
      name,
      max_players: maxPlayers,
      max_spectators: maxSpectators,
    },
  });
}

export function joinRoom(roomCode) {
  return request(`/rooms/${roomCode}/join`, {
    method: "POST",
    body: { as_spectator: false },
  });
}

export function getDeck(deckId) {
  const path = deckId ? `/cards?deck_id=${encodeURIComponent(deckId)}` : "/cards";
  return request(path);
}

export function verifyAdminToken(adminToken) {
  return request("/admin/verify", { adminToken, skipAuth: true });
}

export function loadAdminCards(adminToken) {
  return request("/admin/cards", { adminToken, skipAuth: true });
}

export function loadAdminDecks(adminToken) {
  return request("/admin/decks", { adminToken, skipAuth: true });
}

export function createCard(adminToken, payload) {
  return request("/admin/cards", { method: "POST", body: payload, adminToken, skipAuth: true });
}

export function createDeck(adminToken, payload) {
  return request("/admin/decks", { method: "POST", body: payload, adminToken, skipAuth: true });
}

export function deleteCard(adminToken, cardId) {
  return request(`/admin/cards/${cardId}`, { method: "DELETE", adminToken, skipAuth: true });
}

export function deleteDeck(adminToken, deckId) {
  return request(`/admin/decks/${deckId}`, { method: "DELETE", adminToken, skipAuth: true });
}

export function exportDeck(adminToken, deckId) {
  return request(`/admin/decks/${deckId}/export`, { adminToken, skipAuth: true });
}

export function importDeck(adminToken, payload) {
  return request("/admin/decks/import", {
    method: "POST",
    body: payload,
    adminToken,
    skipAuth: true,
  });
}
