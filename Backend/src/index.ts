import { WebSocket, WebSocketServer } from "ws";
const wss = new WebSocketServer({ port: 8080});

let senderSocket: null | WebSocket = null;
let receiverSocket: null | WebSocket = null;

 
 wss.on('connection', function connection(ws){
ws.on('message', function message(date: any){
        const message = JSON.parse(date);
       if(message.type === "indentify-as-sender"){
        senderSocket = ws;
       }else if(message.type === "indentify-as-recevier"){
        receiverSocket = ws;
       }else if (message.type === "create-offer"){
        receiverSocket?.send(JSON.stringify({ type: "offer", offer: message.offer}));
       }else if (message.type === "create-answer"){
        senderSocket?.send(JSON.stringify({ type: "offer",offer: message.offer}));
       }

    });

   
 });