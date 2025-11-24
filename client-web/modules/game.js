// modules/game.js

import * as Cards from "./cards.js";
import * as Rooms from "./rooms.js";
import { state } from "./state.js";

export const ERROR_CODES = {
  AUTH_REQUIRED: "AUTH_REQUIRED",
  ROOM_REQUIRED: "ROOM_REQUIRED",
  DECK_EMPTY: "DECK_EMPTY",
};

export const RESOURCE_KEYS = Cards.RESOURCE_KEYS;
export const STARTING_RESOURCES = Cards.STARTING_RESOURCES;

export class GameError extends Error {
  constructor(code, message) {
    super(message || code);
    this.code = code;
  }
}

function getAuthToken() {
  return state.token;
}

function getCurrentRoomCode() {
  return Rooms.getCurrentRoomCode() || state.currentRoom;
}

function ensureAuth() {
  if (!getAuthToken()) {
    throw new GameError(ERROR_CODES.AUTH_REQUIRED);
  }
}

function ensureRoom() {
  if (!getCurrentRoomCode()) {
    throw new GameError(ERROR_CODES.ROOM_REQUIRED);
  }
}

function updateSnapshotState(snapshot) {
  state.setDeck(snapshot.deck);
  state.setHand(snapshot.hand);
  state.setWorkspace(snapshot.workspace);
  state.selectCard(null);
  return snapshot;
}

export function getSnapshot() {
  return updateSnapshotState({
    deck: Cards.getDeckCards(),
    hand: Cards.getHandCards(),
    workspace: Cards.getWorkspaceCards(),
    resources: Cards.getResources(),
    deckCount: Cards.getDeckCount(),
  });
}

export function reset() {
  return updateSnapshotState(Cards.reset());
}

export async function prepare(deckId) {
  ensureAuth();
  ensureRoom();
  const snapshot = await Cards.loadDeck(deckId);
  return updateSnapshotState(snapshot);
}

export function drawCard() {
  ensureAuth();
  ensureRoom();
  if (!Cards.getDeckCount()) {
    throw new GameError(ERROR_CODES.DECK_EMPTY);
  }
  return updateSnapshotState(Cards.drawCard());
}

export function moveHandToWorkspace(cardId) {
  ensureAuth();
  ensureRoom();
  return updateSnapshotState(Cards.moveHandToWorkspace(cardId));
}

export function moveWorkspaceToHand(cardId) {
  ensureAuth();
  ensureRoom();
  return updateSnapshotState(Cards.moveWorkspaceToHand(cardId));
}