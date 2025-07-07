const socket = io();
const loginScreen = document.getElementById('login-screen');
const chatContainer = document.getElementById('chat-container');
const chatMessages = document.getElementById('chat-messages');
const usernameInput = document.getElementById('username');
const loginBtn = document.getElementById('login-btn');
const sendBtn = document.getElementById('send-btn');
const messageInput = document.getElementById('message-input');
const logoutBtn = document.getElementById('logout-btn');
const chatTitle = document.getElementById('chat-title');

let username = "";

loginBtn.addEventListener('click', () => {
  const name = usernameInput.value.trim();
  if (name === "Abhii" || name === "Babe❤️😘") {
    username = name;
    socket.emit('new-user', username);
    loginScreen.style.display = "none";
    chatContainer.style.display = "flex";
    chatTitle.textContent = `❤️ Chatting as ${username}`;
    // Set chat background
    if (username === "Abhii") {
      chatMessages.style.backgroundImage = "url('abhii-bg.jpg')";
    } else {
      chatMessages.style.backgroundImage = "url('babe-bg.jpg')";
    }
  } else {
    alert("Invalid name! Use 'Abhii' or 'Babe❤️😘'");
  }
});

sendBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', e => {
  if (e.key === "Enter") sendMessage();
});
logoutBtn.addEventListener('click', () => {
  window.location.reload();
});

function sendMessage() {
  const message = messageInput.value.trim();
  if (message !== "") {
    appendMessage(`You: ${message}`, "sent");
    socket.emit('send-chat-message', message);
    messageInput.value = "";
  }
}

function appendMessage(msg, type) {
  const div = document.createElement('div');
  div.textContent = msg;
  div.classList.add('message', type);
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

socket.on('chat-message', data => {
  appendMessage(`${data.name}: ${data.message}`, "received");
});
