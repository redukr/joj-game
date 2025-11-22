const statusArea = document.getElementById("statusArea");
const apiBaseInput = document.getElementById("apiBase");
const guestLoginForm = document.getElementById("guestLoginForm");
const roomForm = document.getElementById("roomForm");
const roomsList = document.getElementById("roomsList");
const refreshRoomsButton = document.getElementById("refreshRooms");
const userInfo = document.getElementById("userInfo");

let authToken = null;
let currentUser = null;

function log(message, isError = false) {
  const prefix = new Date().toLocaleTimeString();
  const line = `[${prefix}] ${message}`;
  statusArea.textContent = `${line}\n${statusArea.textContent}`.trim();
  if (isError) {
    statusArea.classList.add("error");
  }
}

function apiUrl(path) {
  return `${apiBaseInput.value.replace(/\/$/, "")}${path}`;
}

function setUserInfo() {
  if (!currentUser) {
    userInfo.textContent = "Not signed in yet.";
    return;
  }
  userInfo.innerHTML = `<strong>${currentUser.display_name}</strong> (ID: ${currentUser.id})`;
}

async function handleGuestLogin(event) {
  event.preventDefault();
  const displayName = document.getElementById("displayName").value.trim();
  if (!displayName) {
    log("Display name is required", true);
    return;
  }

  try {
    const response = await fetch(apiUrl("/auth/login"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ provider: "guest", display_name: displayName }),
    });

    if (!response.ok) {
      throw new Error(`Login failed: ${response.status}`);
    }

    const data = await response.json();
    authToken = data.access_token;
    currentUser = data.user;
    log(`Logged in as ${currentUser.display_name}`);
    setUserInfo();
    await loadRooms();
  } catch (error) {
    log(error.message, true);
  }
}

async function loadRooms() {
  try {
    const response = await fetch(apiUrl("/rooms"));
    if (!response.ok) {
      throw new Error(`Unable to load rooms: ${response.status}`);
    }
    const rooms = await response.json();
    renderRooms(rooms);
    log(`Loaded ${rooms.length} room(s).`);
  } catch (error) {
    log(error.message, true);
  }
}

function renderRooms(rooms) {
  roomsList.innerHTML = "";
  if (!rooms.length) {
    roomsList.innerHTML = '<li class="muted">No rooms yet. Create one!</li>';
    return;
  }

  rooms.forEach((room) => {
    const item = document.createElement("li");
    const title = document.createElement("div");
    title.className = "title";
    title.textContent = room.name;

    const meta = document.createElement("div");
    meta.className = "meta";
    meta.textContent = `Host: ${room.host_user_id} | Id: ${room.id}`;

    item.appendChild(title);
    item.appendChild(meta);
    roomsList.appendChild(item);
  });
}

async function createRoom(event) {
  event.preventDefault();
  const roomName = document.getElementById("roomName").value.trim();
  if (!authToken) {
    log("Login first to create a room.", true);
    return;
  }
  if (!roomName) {
    log("Room name is required", true);
    return;
  }

  try {
    const response = await fetch(apiUrl("/rooms"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ name: roomName }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Create room failed: ${response.status} ${errText}`);
    }

    const room = await response.json();
    log(`Created room "${room.name}" (#${room.id}).`);
    document.getElementById("roomName").value = "";
    await loadRooms();
  } catch (error) {
    log(error.message, true);
  }
}

function wireEvents() {
  guestLoginForm.addEventListener("submit", handleGuestLogin);
  roomForm.addEventListener("submit", createRoom);
  refreshRoomsButton.addEventListener("click", loadRooms);
}

wireEvents();
setUserInfo();
log("Ready. Set your API base URL and sign in as a guest.");
