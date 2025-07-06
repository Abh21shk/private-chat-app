const socket = io();

const loginContainer = document.getElementById("loginContainer");
const chatContainer = document.getElementById("chatContainer");
const usernameInput = document.getElementById("usernameInput");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");

const messages = document.getElementById("messages");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const clearBtn = document.getElementById("clearBtn");
const status = document.getElementById("status");
const typingDiv = document.getElementById("typing");

let username = "";

loginBtn.onclick = () => {
  username = usernameInput.value.trim();
  if (username) {
    socket.emit("login", username);
    loginContainer.style.display = "none";
    chatContainer.style.display = "block";
  }
};

logoutBtn.onclick = () => {
  location.reload();
};

sendBtn.onclick = () => {
  const msg = messageInput.value.trim();
  if (msg) {
    socket.emit("sendMessage", msg);
    messageInput.value = "";
    socket.emit("typing", false);
  }
};

messageInput.oninput = () => {
  socket.emit("typing", messageInput.value !== "");
};

clearBtn.onclick = () => {
  socket.emit("clearChat");
};

socket.on("loadMessages", (msgs) => {
  messages.innerHTML = "";
  msgs.forEach((msg) => appendMessage(msg));
});

socket.on("newMessage", (msg) => {
  appendMessage(msg);
});

socket.on("clearMessages", () => {
  messages.innerHTML = "";
});

socket.on("updateUsers", (users) => {
  const count = Object.keys(users).length;
  status.textContent = `Active Users: ${count}`;
});

socket.on("showTyping", ({ username: user, isTyping }) => {
  if (isTyping) {
    typingDiv.textContent = `${user} is typing...`;
  } else {
    typingDiv.textContent = "";
  }
});

function appendMessage(msg) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.textContent = `${msg.username} (${msg.time}): ${msg.text}`;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}
