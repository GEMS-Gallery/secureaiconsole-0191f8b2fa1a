import { Actor, HttpAgent } from "@dfinity/agent";

const PRODUCTION_CANISTER_ID = "6sg3w-vqaaa-aaaab-qao4q-cai";
const agent = new HttpAgent();
const canisterId = import.meta.env.VITE_BACKEND_CANISTER_ID || PRODUCTION_CANISTER_ID;

let backend;

async function initializeBackend() {
  if (!canisterId) {
    throw new Error("Backend canister ID is not set.");
  }
  try {
    backend = Actor.createActor(
      ({ IDL }) => {
        return IDL.Service({
          'get_messages': IDL.Func([], [IDL.Vec(IDL.Text)], ['query']),
          'add_message': IDL.Func([IDL.Text], [], []),
          'clear_messages': IDL.Func([], [], []),
        });
      },
      { agent, canisterId }
    );
  } catch (error) {
    console.error("Failed to initialize backend:", error);
    document.getElementById('errorMessage').textContent = "Failed to connect to the backend. Please check your network connection and try again later.";
    throw error;
  }
}

let chatHistory = [];

async function checkBackendConnection() {
  try {
    await initializeBackend();
    await backend.get_messages();
    document.getElementById('chatInterface').style.display = 'block';
    loadChatHistory();
  } catch (error) {
    console.error("Error checking backend connection:", error);
    document.getElementById('errorMessage').textContent = "Failed to connect to the backend. Please try again later.";
  }
}

async function loadChatHistory() {
  try {
    chatHistory = await backend.get_messages();
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
      await backend.add_message(message);
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
    await backend.clear_messages();
    chatHistory = [];
    displayChatHistory();
  } catch (error) {
    console.error("Error clearing chat:", error);
    document.getElementById('errorMessage').textContent = "Failed to clear chat. Please try again.";
  }
}

window.onload = () => {
  checkBackendConnection().catch(error => {
    console.error("Failed to initialize application:", error);
    document.getElementById('errorMessage').textContent = "Failed to initialize application. Please refresh the page and try again.";
  });
  document.getElementById('sendBtn').onclick = sendMessage;
  document.getElementById('clearBtn').onclick = clearChat;
};