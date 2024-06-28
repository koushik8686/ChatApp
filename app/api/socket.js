import { Server } from "socket.io";
import connectmongodb from "../../libs/mongodb";
import Chats from "../../models/chatmodel";

export default function handler(req, res) {
  if (!res.socket.server.io) {
    console.log("Setting up Socket.IO server...");
    const io = new Server(res.socket.server, {
      cors: {
        origin: "http://localhost:3000", // frontend URL
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true,
      },
    });

    io.on("connection", (socket) => {
      connectmongodb();
      var id;
      socket.on("join_room", async (roomId) => {
        socket.join(roomId);
        id = roomId;
        try {
          const chat = await Chats.findOne({ _id: roomId });
          let lastMessages = [];
          if (chat && chat.messages) {
            lastMessages = chat.messages.slice(-10);
          }
          socket.emit("last_10_msgs", lastMessages);
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
        console.log(`user with id-${socket.id} joined room - ${roomId}`);
      });

      socket.on("send_msg", async (data) => {
        console.log(data, "DATA");
        const chat = await Chats.findOneAndUpdate(
          { _id: data.roomId },
          {
            $push: {
              messages: {
                message: data.message,
                time: data.time,
                sent_by: data.sent_by,
                name: data.name,
              },
            },
          },
          { new: true, upsert: true }
        );
        socket.to(data.roomId).emit("receive_msg", data);
      });

      socket.on("leave_room", () => {
        console.log("A user disconnected:", socket.id);
      });
    });

    res.socket.server.io = io;
  } else {
    console.log("Socket.IO server already set up.");
  }
  res.end();
}