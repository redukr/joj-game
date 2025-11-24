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
