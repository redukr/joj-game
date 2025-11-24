// modules/cards.js

import * as API from "./api.js";

const STARTING_RESOURCES = {
  time: 1,
  reputation: 1,
  discipline: 1,
  documents: 1,
  technology: 1,
};

const RESOURCE_KEYS = Object.keys(STARTING_RESOURCES);

let deckCards = [];
let handCards = [];
let workspaceCards = [];
let playerResources = { ...STARTING_RESOURCES };

const listeners = {};

function emit(event, payload) {
  const handlers = listeners[event];
  if (!handlers?.length) return;
  handlers.forEach((handler) => {
    try {
      handler(payload);
    } catch (error) {
      console.error("cards listener failed", error);
    }
  });
}

function notifySnapshot() {
  const snapshot = getSnapshot();
  emit("updated", snapshot);
  return snapshot;
}

function shuffleDeck(cards) {
  const copy = [...cards];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function getSnapshot() {
  return {
    deck: [...deckCards],
    hand: [...handCards],
    workspace: [...workspaceCards],
    resources: { ...playerResources },
    deckCount: deckCards.length,
  };
}

export function on(event, handler) {
  listeners[event] = listeners[event] || [];
  listeners[event].push(handler);
}

export function reset() {
  deckCards = [];
  handCards = [];
  workspaceCards = [];
  playerResources = { ...STARTING_RESOURCES };
  return notifySnapshot();
}

export async function loadDeck(deckId) {
  const cards = await API.getDeck(deckId);
  return initializeDeck(cards);
}

export function initializeDeck(cards) {
  deckCards = shuffleDeck(cards);
  handCards = [];
  workspaceCards = [];
  playerResources = { ...STARTING_RESOURCES };
  return notifySnapshot();
}

export function drawCard() {
  if (!deckCards.length) {
    return getSnapshot();
  }
  const card = deckCards.pop();
  handCards.push(card);
  return notifySnapshot();
}

export function moveHandToWorkspace(cardId) {
  const index = handCards.findIndex((card) => card.id === cardId);
  if (index === -1) {
    return getSnapshot();
  }
  const [card] = handCards.splice(index, 1);
  workspaceCards.push(card);
  return notifySnapshot();
}

export function moveWorkspaceToHand(cardId) {
  const index = workspaceCards.findIndex((card) => card.id === cardId);
  if (index === -1) {
    return getSnapshot();
  }
  const [card] = workspaceCards.splice(index, 1);
  handCards.push(card);
  return notifySnapshot();
}

export function getDeckCount() {
  return deckCards.length;
}

export function getDeckCards() {
  return [...deckCards];
}

export function getHandCards() {
  return [...handCards];
}

export function getWorkspaceCards() {
  return [...workspaceCards];
}

export function getResources() {
  return { ...playerResources };
}

export { STARTING_RESOURCES, RESOURCE_KEYS };
