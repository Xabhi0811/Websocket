import { useEffect, useState } from "react";

const Sender = () => {
  const [socket , setSocket] = useState<WebSocket | null>(null);
  useEffect(() =>{
    const socket = new WebSocket('ws://;ocalhost:8080');
    socket.onopen = () =>{
      socket.send(JSON.stringify({type: 'sender'}));
    }
  }, []);

  function startSendingVideo( ){
    
  }

  return <div>
    Sender
    <button onClick={startSendingVideo}>Send video</button>
  </div>
};

export default Sender;
