import Bool "mo:base/Bool";
import Func "mo:base/Func";
import Hash "mo:base/Hash";

import Debug "mo:base/Debug";
import Text "mo:base/Text";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import HashMap "mo:base/HashMap";
import Nat "mo:base/Nat";
import Result "mo:base/Result";
import Error "mo:base/Error";
import Option "mo:base/Option";
import Blob "mo:base/Blob";
import Buffer "mo:base/Buffer";
import Time "mo:base/Time";

actor {
    // Stable variables to persist state across upgrades
    private stable var apiKeyEntries : [(Text, Text)] = [];
    private stable var chatHistoryEntries : [(Nat, Text)] = [];

    // Initialize HashMap for API key storage
    private var apiKeys = HashMap.HashMap<Text, Text>(1, Text.equal, Text.hash);

    // Initialize Buffer for chat history
    private var chatHistory = Buffer.Buffer<Text>(0);

    // Function to securely store the API key
    public shared({ caller }) func setApiKey(key : Text) : async Result.Result<(), Text> {
        // In a real-world scenario, you'd want to implement proper authentication here
        // For simplicity, we're allowing any caller to set the key
        apiKeys.put("OPENROUTER_API_KEY", key);
        #ok()
    };

    // Function to check if API key is set
    public query func isApiKeySet() : async Bool {
        Option.isSome(apiKeys.get("OPENROUTER_API_KEY"))
    };

    // Function to add a message to chat history
    public shared({ caller }) func addToChatHistory(message : Text) : async Nat {
        let index = chatHistory.size();
        chatHistory.add(message);
        index
    };

    // Function to get chat history
    public query func getChatHistory() : async [Text] {
        Buffer.toArray(chatHistory)
    };

    // Function to clear chat history
    public shared({ caller }) func clearChatHistory() : async () {
        chatHistory.clear();
    };

    // System functions for upgrades
    system func preupgrade() {
        apiKeyEntries := Iter.toArray(apiKeys.entries());
        chatHistoryEntries := Array.tabulate<(Nat, Text)>(
            chatHistory.size(),
            func (i : Nat) : (Nat, Text) { 
                (i, Option.get(chatHistory.getOpt(i), ""))
            }
        );
    };

    system func postupgrade() {
        apiKeys := HashMap.fromIter<Text, Text>(apiKeyEntries.vals(), 1, Text.equal, Text.hash);
        chatHistory := Buffer.Buffer<Text>(chatHistoryEntries.size());
        for ((i, msg) in chatHistoryEntries.vals()) {
            chatHistory.add(msg);
        };
    };
}