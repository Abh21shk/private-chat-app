const socket = io();
const loginScreen = document.getElementById("login-screen");
const chatScreen = document.getElementById("chat-screen");
const usernameInput = document.getElementById("username");
const loginBtn = document.getElementById("login-btn");
const messageInput = document.getElementById("message-input");
const sendBtn = document.getElementById("send-btn");
const chatMessages = document.getElementById("chat-messages");
const clearBtn = document.getElementById("clear-btn");
const activeStatus = document.getElementById("active-status");
const imageInput = document.getElementById("image-input");

let username = "";

loginBtn.addEventListener("click", () => {
  username = usernameInput.value.trim();
  if (username) {
    socket.emit("new-user", username);
    loginScreen.style.display = "none";
    chatScreen.style.display = "flex";
  }
});

sendBtn.addEventListener("click", () => {
  sendMessage();
});

messageInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

function sendMessage() {
  const text = messageInput.value.trim();
  if (text !== "") {
    socket.emit("send-message", { text, type: "text" });
    messageInput.value = "";
  }
}

imageInput.addEventListener("change", () => {
  const file = imageInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      socket.emit("send-message", { text: e.target.result, type: "image" });
    };
    reader.readAsDataURL(file);
  }
});

clearBtn.addEventListener("click", () => {
  socket.emit("clear-chat");
});

socket.on("load-chat", (history) => {
  chatMessages.innerHTML = "";
  history.forEach((msg) => displayMessage(msg));
});

socket.on("chat-message", (msg) => {
  displayMessage(msg);
});

socket.on("chat-cleared", () => {
  chatMessages.innerHTML = "";
});

function displayMessage(msg) {
  const div = document.createElement("div");
  div.classList.add("message", msg.name === username ? "sent" : "received");
  if (msg.type === "text") {
    div.textContent = `${msg.name}: ${msg.text}`;
  } else if (msg.type === "image") {
    const img = document.createElement("img");
    img.src = msg.text;
    img.style.maxWidth = "200px";
    div.appendChild(document.createTextNode(`${msg.name}: `));
    div.appendChild(img);
  }
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}
