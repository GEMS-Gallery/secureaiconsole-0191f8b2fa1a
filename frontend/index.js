import { Actor, HttpAgent } from "@dfinity/agent";

const agent = new HttpAgent();
const canisterId = process.env.BACKEND_CANISTER_ID;

let backend;

async function initializeBackend() {
  try {
    backend = await Actor.createActor(canisterId, {
      agent,
      canisterId,
    });
  } catch (error) {
    console.error("Failed to initialize backend:", error);
    document.getElementById('errorMessage').textContent = "Failed to connect to the backend. Please try again later.";
  }
}

let chatHistory = [];
let isApiKeySet = false;

async function checkApiKey() {
  try {
    await initializeBackend();
    isApiKeySet = await backend.isApiKeySet();
    if (!isApiKeySet) {
      document.getElementById('apiKeyForm').style.display = 'block';
      document.getElementById('chatInterface').style.display = 'none';
    } else {
      document.getElementById('apiKeyForm').style.display = 'none';
      document.getElementById('chatInterface').style.display = 'block';
      loadChatHistory();
    }
  } catch (error) {
    console.error("Error checking API key:", error);
    document.getElementById('errorMessage').textContent = "Failed to check API key status. Please try again later.";
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
      document.getElementById('errorMessage').textContent = "Failed to set API key. Please try again.";
    }
  }
}

async function loadChatHistory() {
  try {
    chatHistory = await backend.getChatHistory();
    displayChatHistory();
  } catch (error) {
    console.error("Error loading chat history:", error);
    document.getElementById('errorMessage').textContent = "Failed to load chat history. Please try again.";
  }
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
    try {
      await backend.addToChatHistory(message);
      messageInput.value = '';
      await loadChatHistory();
    } catch (error) {
      console.error("Error sending message:", error);
      document.getElementById('errorMessage').textContent = "Failed to send message. Please try again.";
    }
  }
}

async function clearChat() {
  try {
    await backend.clearChatHistory();
    chatHistory = [];
    displayChatHistory();
  } catch (error) {
    console.error("Error clearing chat:", error);
    document.getElementById('errorMessage').textContent = "Failed to clear chat. Please try again.";
  }
}

window.onload = () => {
  checkApiKey();
  document.getElementById('setApiKeyBtn').onclick = setApiKey;
  document.getElementById('sendBtn').onclick = sendMessage;
  document.getElementById('clearBtn').onclick = clearChat;
};