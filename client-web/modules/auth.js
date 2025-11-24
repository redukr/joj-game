// modules/auth.js

import { loginGuest, registerGuest } from "./api.js";
import { state } from "./state.js";

const STORAGE_KEYS = {
  authToken: "joj-auth-token",
  user: "joj-user",
};

export async function login({ apiBase = "", displayName, password }) {
  if (!displayName || !password) {
    const error = new Error("MISSING_CREDENTIALS");
    throw error;
  }

  const data = await loginGuest({ apiBase, displayName, password });
  const token = data?.access_token;
  const user = data?.user;

  if (!token || !user) {
    throw new Error("INVALID_AUTH_RESPONSE");
  }

  return { token, user };
}

export async function register({ apiBase = "", displayName, password }) {
  if (!displayName || !password) {
    const error = new Error("MISSING_CREDENTIALS");
    throw error;
  }

  const data = await registerGuest({ apiBase, displayName, password });
  const token = data?.access_token;
  const user = data?.user;

  if (!token || !user) {
    throw new Error("INVALID_AUTH_RESPONSE");
  }

  return { token, user };
}

export function setAuthSession(token, user) {
  if (token && user) {
    localStorage.setItem(STORAGE_KEYS.authToken, token);
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
    state.setToken(token);
    state.setUser(user);
    return;
  }
  localStorage.removeItem(STORAGE_KEYS.authToken);
  localStorage.removeItem(STORAGE_KEYS.user);
  state.setToken(null);
  state.setUser(null);
}

export function restoreSession() {
  const token = localStorage.getItem(STORAGE_KEYS.authToken);
  const rawUser = localStorage.getItem(STORAGE_KEYS.user);
  if (!token || !rawUser) {
    return null;
  }

  try {
    const user = JSON.parse(rawUser);
    return { token, user };
  } catch (error) {
    setAuthSession(null, null);
    return null;
  }
}

export function logout() {
  setAuthSession(null, null);
}
