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
        let pc: RTCPeerConnection |null = null;
        if(message.type === 'createoffer'){
           pc = new RTCPeerConnection();
          pc.setRemoteDescription(message.sdp);

           pc.onicecandidate = (event)=>{
      console.log(event);
      if(event.candidate){
        socket?.send(JSON.stringify({ type: 'iceCandidate', candiate: event.candidate}))
      }

     }
          
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer)
          socket.send(JSON.stringify({type: 'createAnswer', sdp: pc.localDescription}));
        } else if( message.type === " iceCandodate"){
          if(pc!== null){
            //@ts-ignore
          pc.addIceCandidate(message.candiate);
          }
        }
       } 
    }, []);



  return <div>
    Receiver Component</div>;

};

export default Receiver;
