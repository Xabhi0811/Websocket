import { WebSocket, WebSocketServer } from "ws";
const wss = new WebSocketServer({ port: 8080});
 
 wss.on('connection', function connection(ws){
ws.on('message', function message(date: any){
        const message = JSON.parse(date);
        console.log(message);
    });

   
 });