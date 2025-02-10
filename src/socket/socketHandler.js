export const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("sendMessage", (message) => {
      console.log("Message received:", message);
      io.emit("receiveMessage", message); // Broadcast message to all clients
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);
    });
  });
};
