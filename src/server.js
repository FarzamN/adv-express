import WebSocket, { WebSocketServer } from "ws";

const wss = new WebSocketServer({
  port: 8080,
  perMessageDeflate: {
    zlibDeflateOptions: {
      // See zlib defaults.
      chunkSize: 1024,
      memLevel: 7,
      level: 3,
    },
    zlibInflateOptions: {
      chunkSize: 10 * 1024,
    },
    // Other options settable:
    clientNoContextTakeover: true, // Defaults to negotiated value.
    serverNoContextTakeover: true, // Defaults to negotiated value.
    serverMaxWindowBits: 10, // Defaults to negotiated value.
    // Below options specified as default values.
    concurrencyLimit: 10, // Limits zlib concurrency for perf.
    threshold: 1024, // Size (in bytes) below which messages
    // should not be compressed if context takeover is disabled.
  },
});
// Event listener for when a client connects
wss.on("connection", (ws) => {
  console.log("A new client connected!");

  // Event listener for when a message is received from the client
  ws.on("message", (message) => {
    console.log(`Received message: ${message}`);
  });

  // Send a welcome message to the client
  ws.send("this is done");
});

console.log("WebSocket server is running on ws://localhost:8080");
