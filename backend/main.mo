import Debug "mo:base/Debug";
import Text "mo:base/Text";
import Array "mo:base/Array";
import Buffer "mo:base/Buffer";

actor {
    private var messages = Buffer.Buffer<Text>(0);

    public shared({ caller }) func add_message(message : Text) : async () {
        messages.add(message);
    };

    public query func get_messages() : async [Text] {
        Buffer.toArray(messages)
    };

    public shared({ caller }) func clear_messages() : async () {
        messages.clear();
    };
}