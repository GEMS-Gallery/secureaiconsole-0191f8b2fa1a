import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "./declarations/backend/backend.did.js";

const PRODUCTION_CANISTER_ID = "6sg3w-vqaaa-aaaab-qao4q-cai"; // Replace with your actual production canister ID
const agent = new HttpAgent();
const canisterId = import.meta.env.VITE_BACKEND_CANISTER_ID || PRODUCTION_CANISTER_ID;

let backend;

async function initializeBackend() {
  if (!canisterId) {
    throw new Error("Backend canister ID is not set. Please check your environment variables or configuration.");
  }
  try {
    backend = await Actor.createActor(idlFactory, {
      agent,
      canisterId,
    });
  } catch (error) {
    console.error("Failed to initialize backend:", error);
    document.getElementById('errorMessage').textContent = "Failed to connect to the backend. Please check your network connection and try again later.";
    throw error;
  }
}

let chatHistory = [];
let isApiKeySet = false;

async function checkApiKey() {
  try {
    await initializeBackend();
    isApiKeySet = await backend.get_api_key_status();
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
      if (!backend) {
        await initializeBackend();
      }
      await backend.set_api_key(apiKey);
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
    if (!backend) {
      await initializeBackend();
    }
    chatHistory = await backend.get_chat_history();
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
      if (!backend) {
        await initializeBackend();
      }
      await backend.add_to_chat_history(message);
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
    if (!backend) {
      await initializeBackend();
    }
    await backend.clear_chat_history();
    chatHistory = [];
    displayChatHistory();
  } catch (error) {
    console.error("Error clearing chat:", error);
    document.getElementById('errorMessage').textContent = "Failed to clear chat. Please try again.";
  }
}

window.onload = () => {
  checkApiKey().catch(error => {
    console.error("Failed to initialize application:", error);
    document.getElementById('errorMessage').textContent = "Failed to initialize application. Please refresh the page and try again.";
  });
  document.getElementById('setApiKeyBtn').onclick = setApiKey;
  document.getElementById('sendBtn').onclick = sendMessage;
  document.getElementById('clearBtn').onclick = clearChat;
};