import { WebSocketServer } from "ws";

export default (req, res) => {
  const { socket } = req;
  const wss = new WebSocketServer({ noServer: true });

  wss.on('connection', (ws) => {
    ws.on('message', (message) => {
      const parsedMessage = JSON.parse(message);

      // Your message handling logic here, like "join" or "chat" events
      if (parsedMessage.type === 'join') {
        console.log(`User joined room ${parsedMessage.payload.roomId}`);
      }

      if (parsedMessage.type === 'chat') {
        console.log('User wants to chat');
        ws.send(parsedMessage.payload.message);
      }
    });
  });

  res.socket.server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  });

  res.status(200).end();
};
