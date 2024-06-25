const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const httpServer = http.createServer();

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3002", // Replace with your frontend URL
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

io.on("connection",async (socket) => {
  console.log("A user connected:", socket.id);
  
  socket.on('join_room', async (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);

 
  });


 
  socket.on("send_msg",async (data) => {
    console.log(data, "DATA");
    //This will send a message to a specific room ID
    const chat = await Chat.findOneAndUpdate(
      { _id: data.roomId },
      { $push: { messages: { message: data.message, time: data.time, sent_by: data.sent_by } } },
      { new: true, upsert: true }
    );
    socket.to(data.roomId).emit("receive_msg", data);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Socket.io server is running on port ${PORT}`);
});