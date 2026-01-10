import { WebSocket, WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

let senderSocket: WebSocket | null = null;
let receiverSocket: WebSocket | null = null;

console.log("WebSocket server running on ws://localhost:8080");

wss.on("connection", (ws) => {
  console.log("New client connected");

  ws.on("message", (data) => {
    const message = JSON.parse(data.toString());
    console.log("📩 Received:", message.type);

    if (message.type === "sender") {
      senderSocket = ws;
      console.log("✅ Sender registered");
    }

    else if (message.type === "receiver") {
      receiverSocket = ws;
      console.log("✅ Receiver registered");
    }

    else if (message.type === "createOffer") {
      console.log("➡️ Forwarding offer to receiver");
      receiverSocket?.send(JSON.stringify({
        type: "createOffer",
        sdp: message.sdp,
      }));
    }

    else if (message.type === "createAnswer") {
      console.log("⬅️ Forwarding answer to sender");
      senderSocket?.send(JSON.stringify({
        type: "createAnswer",
        sdp: message.sdp,
      }));
    }

    else if (message.type === "iceCandidate") {
      console.log("🧊 ICE candidate forwarded");

      if (ws === senderSocket) {
        receiverSocket?.send(JSON.stringify({
          type: "iceCandidate",
          candidate: message.candidate,
        }));
      } else if (ws === receiverSocket) {
        senderSocket?.send(JSON.stringify({
          type: "iceCandidate",
          candidate: message.candidate,
        }));
      }
    }
  });

  ws.on("close", () => {
    console.log("❌ Client disconnected");
  });
});
