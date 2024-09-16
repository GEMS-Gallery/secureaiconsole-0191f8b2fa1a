import { backend } from "declarations/backend";

let chatHistory = [];
let isApiKeySet = false;

async function checkApiKey() {
  isApiKeySet = await backend.isApiKeySet();
  if (!isApiKeySet) {
    document.getElementById('apiKeyForm').style.display = 'block';
    document.getElementById('chatInterface').style.display = 'none';
  } else {
    document.getElementById('apiKeyForm').style.display = 'none';
    document.getElementById('chatInterface').style.display = 'block';
    loadChatHistory();
  }
}

async function setApiKey() {
  const apiKey = document.getElementById('apiKeyInput').value;
  if (apiKey) {
    try {
      await backend.setApiKey(apiKey);
      isApiKeySet = true;
      document.getElementById('apiKeyForm').style.display = 'none';
      document.getElementById('chatInterface').style.display = 'block';
    } catch (error) {
      console.error("Error setting API key:", error);
    }
  }
}

async function loadChatHistory() {
  chatHistory = await backend.getChatHistory();
  displayChatHistory();
}

function displayChatHistory() {
  const chatBox = document.getElementById('chatBox');
  chatBox.innerHTML = '';
  chatHistory.forEach(message => {
    const messageElement = document.createElement('p');
    messageElement.textContent = message;
    chatBox.appendChild(messageElement);
  });
}

async function sendMessage() {
  const messageInput = document.getElementById('messageInput');
  const message = messageInput.value.trim();
  if (message) {
    await backend.addToChatHistory(message);
    messageInput.value = '';
    await loadChatHistory();
  }
}

async function clearChat() {
  await backend.clearChatHistory();
  chatHistory = [];
  displayChatHistory();
}

window.onload = () => {
  checkApiKey();
  document.getElementById('setApiKeyBtn').onclick = setApiKey;
  document.getElementById('sendBtn').onclick = sendMessage;
  document.getElementById('clearBtn').onclick = clearChat;
};