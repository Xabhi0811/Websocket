import { useEffect, useRef } from "react";

const Receiver = () => {
  const pcRef = useRef<RTCPeerConnection | null>(null);

  useEffect(() =>{
      const socket = new WebSocket('ws://localhost:8080');
      socket.onopen = () =>{
        socket.send(JSON.stringify({type: 'receiver'}));
      }

       socket.onmessage = async (event) =>{
        const message = JSON.parse(event.data);
        if(message.type === 'createoffer'){
          const pc = new RTCPeerConnection();
          pc.setRemoteDescription(message.sdp);
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer)
          socket.send(JSON.stringify({type: 'createAnswer', sdp: pc.localDescription}));
        }
       } 
    }, []);



  return <div>
    Receiver Component</div>;

};

export default Receiver;
