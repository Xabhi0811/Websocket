import { useEffect, useRef } from "react";

const Sender = () => {
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");

    ws.onopen = () => {
      console.log("🟢 Sender WebSocket OPEN");
      ws.send(JSON.stringify({ type: "sender" }));
    };

    ws.onclose = () => console.log("🔴 Sender WebSocket CLOSED");
    ws.onerror = (e) => console.error("❌ Sender WS error", e);

    socketRef.current = ws;
  }, []);

  async function startSendingVideo() {
    const socket = socketRef.current;
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.error("Socket not ready");
      return;
    }

    console.log("🎥 Starting sender stream");

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("🧊 Sender ICE");
        socket.send(JSON.stringify({
          type: "iceCandidate",
          candidate: event.candidate,
        }));
      }
    };

    socket.onmessage = async (event) => {
      const msg = JSON.parse(event.data);
      console.log("📩 Sender received:", msg.type);

      if (msg.type === "createAnswer") {
        await pc.setRemoteDescription(msg.sdp);
        console.log("✅ Sender set remote answer");
      }

      if (msg.type === "iceCandidate") {
        await pc.addIceCandidate(msg.candidate);
        console.log("➕ Sender added ICE");
      }
    };

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });

    stream.getTracks().forEach(track => pc.addTrack(track, stream));

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    socket.send(JSON.stringify({
      type: "createOffer",
      sdp: pc.localDescription,
    }));

    console.log("📤 Offer sent");
  }

  return (
    <div>
      <h3>Sender</h3>
      <button onClick={startSendingVideo}>Send Video</button>
    </div>
  );
};

export default Sender;
