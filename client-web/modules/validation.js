// modules/validation.js

// --- BASIC CHECKS ---

export function isEmpty(value) {
    return !value || value.trim().length === 0;
}

export function minLength(value, len) {
    return value && value.trim().length >= len;
}

export function maxLength(value, len) {
    return value && value.trim().length <= len;
}

export function isNumber(value) {
    return !isNaN(value);
}

export function inRange(value, min, max) {
    const n = Number(value);
    return n >= min && n <= max;
}

// --- FIELD VALIDATION WRAPPERS ---

export function validateRequired(field, name = "field") {
    if (isEmpty(field)) {
        throw new Error(`${name.toUpperCase()}_REQUIRED`);
    }
}

export function validateMin(field, min, name = "field") {
    if (!minLength(field, min)) {
        throw new Error(`${name.toUpperCase()}_TOO_SHORT`);
    }
}

export function validateMax(field, max, name = "field") {
    if (!maxLength(field, max)) {
        throw new Error(`${name.toUpperCase()}_TOO_LONG`);
    }
}

export function validateNumberRange(field, min, max, name = "field") {
    if (!isNumber(field)) {
        throw new Error(`${name.toUpperCase()}_NOT_NUMBER`);
    }
    if (!inRange(field, min, max)) {
        throw new Error(`${name.toUpperCase()}_OUT_OF_RANGE`);
    }
}

// --- HIGH-LEVEL VALIDATORS ---

export function validateUsername(name) {
    validateRequired(name, "username");
    validateMin(name, 2, "username");
    validateMax(name, 20, "username");
}

export function validateRoomName(name) {
    validateRequired(name, "room");
    validateMin(name, 2, "room");
    validateMax(name, 32, "room");
}

export function validatePlayerLimits(players, spectators) {
    validateNumberRange(players, 1, 10, "players");
    validateNumberRange(spectators, 0, 10, "spectators");
}

// --- APP-SPECIFIC VALIDATION HELPERS ---

export class ValidationError extends Error {
    constructor(code, message) {
        super(message || code);
        this.code = code;
    }
}

export const ERROR_CODES = {
    DISPLAY_NAME_REQUIRED: "displayNameRequired",
    PASSWORD_REQUIRED: "passwordRequired",
    AUTH_REQUIRED: "loginRequiredRoom",
    ROOM_NAME_REQUIRED: "roomNameRequired",
    MAX_PLAYERS_REQUIRED: "maxPlayersRequired",
    SPECTATORS_REQUIRED: "spectatorsRequired",
    CARD_FIELDS_REQUIRED: "cardFieldsRequired",
    DECK_NAME_REQUIRED: "deckNameRequired",
    ADMIN_TOKEN_REQUIRED: "adminTokenRequired",
    ADMIN_TOKEN_INVALID: "invalidAdminToken",
    IMPORT_DECK_INVALID: "importDeckInvalid",
};

export function ensureAuthToken(token) {
    if (!token) {
        throw new ValidationError(ERROR_CODES.AUTH_REQUIRED);
    }
    return token;
}

export function ensureAdminToken({ token, isValid }) {
    const normalized = (token || "").trim();
    if (!normalized) {
        throw new ValidationError(ERROR_CODES.ADMIN_TOKEN_REQUIRED);
    }
    if (!isValid) {
        throw new ValidationError(ERROR_CODES.ADMIN_TOKEN_INVALID);
    }
    return normalized;
}

export function validateGuestCredentials({ displayName, password }) {
    const normalizedName = (displayName || "").trim();
    const normalizedPassword = (password || "").trim();
    if (!normalizedName) {
        throw new ValidationError(ERROR_CODES.DISPLAY_NAME_REQUIRED);
    }
    if (!normalizedPassword) {
        throw new ValidationError(ERROR_CODES.PASSWORD_REQUIRED);
    }
    return { displayName: normalizedName, password: normalizedPassword };
}

export function validateRoomCreation({ token, name, maxPlayers, maxSpectators }) {
    ensureAuthToken(token);
    const normalizedName = (name || "").trim();
    if (!normalizedName) {
        throw new ValidationError(ERROR_CODES.ROOM_NAME_REQUIRED);
    }
    if (!Number.isInteger(maxPlayers) || maxPlayers < 2 || maxPlayers > 6) {
        throw new ValidationError(ERROR_CODES.MAX_PLAYERS_REQUIRED);
    }
    if (!Number.isInteger(maxSpectators) || maxSpectators < 0 || maxSpectators > 10) {
        throw new ValidationError(ERROR_CODES.SPECTATORS_REQUIRED);
    }
    return {
        name: normalizedName,
        maxPlayers,
        maxSpectators,
    };
}

export function validateCardPayload({ name, description, category = null }) {
    const normalizedName = (name || "").trim();
    const normalizedDescription = (description || "").trim();
    const normalizedCategory = (category || "").trim();
    if (!normalizedName || !normalizedDescription) {
        throw new ValidationError(ERROR_CODES.CARD_FIELDS_REQUIRED);
    }
    return {
        name: normalizedName,
        description: normalizedDescription,
        category: normalizedCategory || null,
    };
}

export function validateDeckPayload({ name, description = null, card_ids = [] }) {
    const normalizedName = (name || "").trim();
    const normalizedDescription = (description || "").trim();
    if (!normalizedName) {
        throw new ValidationError(ERROR_CODES.DECK_NAME_REQUIRED);
    }
    return {
        name: normalizedName,
        description: normalizedDescription || null,
        card_ids,
    };
}

export function validateDeckImportPayload(raw) {
    if (!raw || !raw.trim()) {
        throw new ValidationError(ERROR_CODES.IMPORT_DECK_INVALID);
    }
    try {
        return JSON.parse(raw);
    } catch (error) {
        throw new ValidationError(ERROR_CODES.IMPORT_DECK_INVALID);
    }
}
