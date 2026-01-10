import { useEffect, useRef } from "react";

const Receiver = () => {
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");

    socket.onopen = () => {
      console.log("🟢 Receiver WebSocket OPEN");
      socket.send(JSON.stringify({ type: "receiver" }));
    };

    socket.onmessage = async (event) => {
      const msg = JSON.parse(event.data);
      console.log("📩 Receiver received:", msg.type);

      if (msg.type === "createOffer") {
        console.log("📥 Offer received");

        const pc = new RTCPeerConnection({
          iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        });

        pcRef.current = pc;

        pc.onicecandidate = (event) => {
          if (event.candidate) {
            console.log("🧊 Receiver ICE");
            socket.send(JSON.stringify({
              type: "iceCandidate",
              candidate: event.candidate,
            }));
          }
        };

        pc.ontrack = (event) => {
          console.log("🎬 Track received");
          if (videoRef.current) {
            videoRef.current.srcObject = event.streams[0];
          }
        };

        await pc.setRemoteDescription(msg.sdp);
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        socket.send(JSON.stringify({
          type: "createAnswer",
          sdp: pc.localDescription,
        }));

        console.log("📤 Answer sent");
      }

      if (msg.type === "iceCandidate") {
        await pcRef.current?.addIceCandidate(msg.candidate);
        console.log("➕ Receiver added ICE");
      }
    };
  }, []);

  return (
    <div>
      <h3>Receiver</h3>
      <video ref={videoRef} autoPlay playsInline />
    </div>
  );
};

export default Receiver;
