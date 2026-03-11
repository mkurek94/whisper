import { Socket, Server as SocketServer } from "socket.io";
import { Server as HttpServer } from "http";
import { verifyToken } from "@clerk/express";
import { Message } from "../models/Message";
import { Chat } from "../models/Chat";
import { User } from "../models/User";

//store online users in memory : userId -> socketId
export const onlineUsers: Map<string, string> = new Map();

export const initializeSocket = (httpServer: HttpServer) => {
  const allowedOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(",")
    : [];

  const io = new SocketServer(httpServer, {
    cors: {
      origin: allowedOrigins,
    },
  });

  //verify socket connection - if the user is authenticated, attach user info to socket

  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token; //this is what user will send from frontend when connecting to socket
    if (!token) {
      return next(new Error("Authentication token is required"));
    }
    try {
      const session = await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY,
      });

      const clerkId = session.sub;

      const user = await User.findOne({ clerkId });

      if (!user) {
        return next(new Error("User not found"));
      }

      socket.data.userId = user._id.toString(); //attach userId to socket for later use

      next();
    } catch (error) {
      return next(new Error("Authentication failed", { cause: error }));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.data.userId;

    //send list o currently connected users to the client
    socket.emit("online-users", { userIds: Array.from(onlineUsers.keys()) });

    //store user in the onlineUsers map
    onlineUsers.set(userId, socket.id);

    //notify other users that this user is online
    socket.broadcast.emit("user-online", { userId });

    socket.join(`user:${userId}`);

    socket.on("join-chat", async (chatId: string) => {
      const chat = await Chat.findOne({
        _id: chatId,
        participants: userId,
      });
      if (!chat) {
        return socket.emit("error", {
          message: "Chat not found or access denied",
        });
      }
      socket.join(`chat:${chatId}`);
    });

    socket.on("leave-chat", (chatId) => {
      socket.leave(`chat:${chatId}`);
    });

    //handle sending messages
    socket.on(
      "send-message",
      async (data: { chatId: string; text: string }) => {
        try {
          const { chatId, text } = data;

          const chat = await Chat.findOne({
            _id: chatId,
            participants: userId,
          });

          if (!chat) {
            return socket.emit("error", {
              message: "Chat not found or you are not a participant",
            });
          }

          const message = await Message.create({
            chat: chatId,
            sender: userId,
            text,
          });

          chat.lastMessage = message._id;
          chat.lastMessageAt = new Date();
          await chat.save();

          await message.populate("sender", "name avatar");

          io.to(`chat:${chatId}`).emit("new-message", message);

          for (const participantId of chat.participants) {
            io.to(`user:${participantId}`).emit("new-message", message);
          }
        } catch (error) {
          console.error("Error sending message:", error);
          socket.emit("error", { message: "Failed to send message" });
        }
      },
    );

    socket.on("typing", async (data) => {});

    socket.on("disconnect", () => {
      onlineUsers.delete(userId);
      socket.broadcast.emit("user-offline", { userId });
    });
  });

  return io;
};
