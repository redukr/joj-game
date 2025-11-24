// modules/auth.js

import { API } from "./api.js";
import { state } from "./state.js";

// LocalStorage keys
const TOKEN_KEY = "joj_token";
const USER_KEY = "joj_user";

// --- SESSION LOADING ---

export function loadSession() {
    const token = localStorage.getItem(TOKEN_KEY);
    const userRaw = localStorage.getItem(USER_KEY);

    if (!token) return false;

    try {
        const user = JSON.parse(userRaw);
        API.setToken(token);
        state.setToken(token);
        state.setUser(user);
        return true;
    } catch {
        return false;
    }
}

// --- LOGIN ---

export async function login(username) {
    if (!username || username.trim().length < 1) {
        throw new Error("INVALID_USERNAME");
    }

    // Guest login for now
    const payload = { provider: "guest", username };

    const result = await API.post("/auth/login", payload);

    if (!result?.token || !result?.user) {
        throw new Error("INVALID_SERVER_RESPONSE");
    }

    // Save locally
    localStorage.setItem(TOKEN_KEY, result.token);
    localStorage.setItem(USER_KEY, JSON.stringify(result.user));

    // Update state + API
    API.setToken(result.token);
    state.setToken(result.token);
    state.setUser(result.user);

    return result.user;
}

// --- LOGOUT ---

export function logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    API.setToken(null);
    state.setToken(null);
    state.setUser(null);
}

// --- INIT AUTH FLOW ---

// Safe initialization that does not break legacy code
export function initAuth() {
    loadSession();
}
