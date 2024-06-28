const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const Chats = require('../models/chatmodel')
const httpServer = http.createServer();
const connectmongodb = require("../libs/mongodb")
const io = new Server(httpServer, {
  cors: {
    origin: "https://chat-room-9p333i7qg-pinnukoushikp-gmailcoms-projects.vercel.app/", //  frontend URL
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  // console.log("A user connected:", socket.id);
  connectmongodb()
  var id
  socket.on("join_room", async (roomId) => {
    socket.join(roomId);
    id= roomId
    try {
      // Fetch last 10 messages from MongoDB for the given room
      const chat = await Chats.findOne({ _id: roomId });
      let lastMessages = [];
      if (chat && chat.messages) {
        lastMessages = chat.messages.slice(-10);
      }
      socket.emit("last_10_msgs" ,lastMessages );  

    } catch (error) {
      console.error('Error fetching messages:', error);
    }
    console.log(`user with id-${socket.id} joined room - ${roomId}`);
  });
 
  socket.on("send_msg", async (data) => {
    console.log(data, "DATA");
    //This will send a message to a specific room ID
    const chat = await Chats.findOneAndUpdate(
      { _id: data.roomId },
      { $push: { 
          messages: { message: data.message,
          time: data.time,
          sent_by: data.sent_by ,
          name:data.name }
         } 
      },
      { new: true, upsert: true }
    );
    socket.to(data.roomId).emit("receive_msg", data);
  });

  socket.on("leave_room", () => {
    console.log("A user disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`Socket.io server is running on port ${PORT}`);
});