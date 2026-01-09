import { WebSocket, WebSocketServer } from "ws";
const wss = new WebSocketServer({ port: 8080});
 let senderSocket: null | WebSocket = null;
 let receiverSocket: null | WebSocket= null;
 wss.on('connection', function connection(ws){
    ws.on('error', console.error);

    ws.on('message', function message(date: any){
        const message = JSON.parse(date);
    });

    ws.send('something');
 });