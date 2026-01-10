import { useEffect, useState } from "react";

const Sender = () => {
  const [socket , setSocket] = useState<WebSocket | null>(null);
  useEffect(() =>{
    const socket = new WebSocket('ws://localhost:8080');
    socket.onopen = () =>{
      socket.send(JSON.stringify({type: 'sender'}));
    }
    setSocket(socket)
  }, []);

   async function startSendingVideo( ){
    if(!socket) return;
     const pc = new RTCPeerConnection();
     pc.onnegotiationneeded = async() =>{
      console.log("onnegotionneedd")
      const offer = await pc.createOffer();
     await pc.setLocalDescription(offer);
      socket.send(
      JSON.stringify({
        type: "createOffer",
        sdp: pc.localDescription,
      })
    );

     }
     




     pc.onicecandidate = (event)=>{
      console.log(event);
      if(event.candidate){
        socket?.send(JSON.stringify({ type: 'iceCandidate', candiate: event.candidate}))
      }

     }
    
     socket.onmessage =(event) =>{
      const data = JSON.parse(event.data);
      if(data.type === "createAnswer"){
        pc.setRemoteDescription(data.sdp);
      } else if(data.type === "iceCandidate"){
        pc.addIceCandidate(data.candiate);
      }

     }

     const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false});
    
  }

  return <div>
    Sender
    <button onClick={startSendingVideo}>Send video</button>
  </div>
};

export default Sender;
