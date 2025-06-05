import dotenv from "dotenv";
dotenv.config();

import app from "./app"; // your Express app
import connectDB from "./config/database"; // Database connection
import logger from "./utils/logger";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import Message from "./model/Message";
import User from "./model/User";
import { Types } from "mongoose";
import admin from "./config/firebaseAdmin"; // Firebase admin for push notifications

const PORT = process.env.PORT || 3000;

connectDB();

// Create HTTP server from Express app
const server = http.createServer(app);

// Initialize Socket.io
const io = new SocketIOServer(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "http://localhost:5173", // Frontend server for development
      "http://localhost:5174"
    ],
    methods: ["GET", "POST"]
  }
});

const onlineUsers = new Map(); // Store userId to socketId mapping

// Handle socket connections
io.on("connection", (socket) => {
  // When a user joins (send their userId)
  socket.on("join", (userId) => {
    onlineUsers.set(userId, socket.id);
    logger.info(`User ${userId} joined with socket ID ${socket.id}`);
  });

  // Handle sending message event
  socket.on("send_message", async (data, callback) => {
    let { senderId, receiverId, content, attachments } = data;

    try {
      // Validate and resolve userIds if necessary
      if (senderId && senderId.length !== 24) {
        const senderUser = await User.findOne({ firebaseUID: senderId });
        senderId = senderUser?._id?.toString() || senderId;
      }
      if (receiverId && receiverId.length !== 24) {
        const receiverUser = await User.findOne({ firebaseUID: receiverId });
        receiverId = receiverUser?._id?.toString() || receiverId;
      }

      if (!senderId || !receiverId || senderId.length !== 24 || receiverId.length !== 24) {
        return callback({ error: "Invalid sender or receiver ID" });
      }

      // Save message to the database
      const msg = await Message.create({
        sender: senderId,
        receiver: receiverId,
        content,
        attachments,
      });

      // Notify the receiver using Firebase Push Notification
      const receiver = await User.findById(receiverId).select("fcmToken");
      if (receiver?.fcmToken) {
        const payload: admin.messaging.MessagingPayload = {
          notification: {
            title: `New message from ${senderId}`,
            body: content ? content.slice(0, 100) : "You have new attachments",
          },
          data: {
            messageId: String(msg._id),
            senderId,
            receiverId,
            attachments: JSON.stringify(attachments),
          },
        };
        await admin.messaging().send({
          token: receiver.fcmToken,
          ...payload,
        });
      }

      // Emit message to receiver if they are online
      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receive_message", msg);
      }

      // Emit message to sender as well for confirmation
      const senderSocketId = onlineUsers.get(senderId);
      if (senderSocketId && senderSocketId !== receiverSocketId) {
        io.to(senderSocketId).emit("receive_message", msg);
      }

      return callback({ success: true, message: msg });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      callback({ error: errorMsg });
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    for (const [userId, id] of onlineUsers.entries()) {
      if (id === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
  });
});

// Start the server
server.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
