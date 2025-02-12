import asyncHandler from "express-async-handler";


export const send_msg = asyncHandler(async (req, res) => {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }
  
    // Get io instance from express app
    const io = req.app.get("io");
    io.emit("receiveMessage", message); // ✅ Use existing Socket.IO instance
  
    return res.json({ success: true, message: "Message sent successfully" });
  });
  

export const get_msg = asyncHandler(async (req, res) => {
  try {
    // Listen for incoming messages
    io.on("connection", (socket) => {
      socket.on("getMessage", (data) => {
        // Emit the message back to the client
        socket.emit("receiveMessage", data);
      });
    });

    return res.status(200).json({
      success: 200,
      message: "Socket connection established for receiving messages",
    });
  } catch (error) {
    return res.status(500).json({
      success: 500,
      error: error.message,
    });
  }
});
