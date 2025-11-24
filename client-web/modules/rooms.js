// modules/rooms.js

import * as API from "./api.js";
import { state } from "./state.js";

const ROOM_STORAGE_KEY = "joj-room-code";

let currentRoomCode = localStorage.getItem(ROOM_STORAGE_KEY) || null;
state.setCurrentRoom(currentRoomCode);

function persistRoomCode(code) {
  if (code) {
    localStorage.setItem(ROOM_STORAGE_KEY, code);
  } else {
    localStorage.removeItem(ROOM_STORAGE_KEY);
  }
}

function findSelectedRoom(rooms, roomCode = currentRoomCode) {
  if (!rooms?.length) return null;
  const joinedRoom = rooms.find(
    (room) => room.is_joined && (!roomCode || room.code === roomCode)
  );
  if (joinedRoom) return joinedRoom;
  if (roomCode) {
    const matching = rooms.find((room) => room.code === roomCode);
    if (matching) return matching;
  }
  return rooms.find((room) => room.is_joined) || null;
}

function applyRoomSelection(roomCode, rooms = state.rooms) {
  const normalized = roomCode || null;
  currentRoomCode = normalized;
  persistRoomCode(normalized);
  state.setCurrentRoom(normalized);
  const selected = findSelectedRoom(rooms, normalized);
  state.selectRoom(selected || null);
  return normalized;
}

export function getCurrentRoomCode() {
  return state.currentRoom || currentRoomCode;
}

export function setCurrentRoom(roomCode, rooms = state.rooms) {
  return applyRoomSelection(roomCode, rooms);
}

export function syncCurrentRoom(rooms = state.rooms) {
  if (!rooms?.length) {
    return applyRoomSelection(null, rooms);
  }
  const selected = findSelectedRoom(rooms);
  return applyRoomSelection(selected?.code || null, rooms);
}

export async function loadRooms() {
  const rooms = await API.loadRooms();
  state.setRooms(rooms);
  syncCurrentRoom(rooms);
  return rooms;
}

export async function createRoom({ name, maxPlayers, maxSpectators }) {
  const room = await API.createRoom({ name, maxPlayers, maxSpectators });
  applyRoomSelection(room.code);
  await loadRooms();
  return room;
}

export async function joinRoom(roomCode) {
  const room = await API.joinRoom(roomCode);
  applyRoomSelection(room.code);
  await loadRooms();
  return room;
}

