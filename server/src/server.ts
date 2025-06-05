import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import connectDB from "./config/database";
import logger from "./utils/logger";
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import Message from './model/Message';
import User from './model/User';

const PORT = process.env.PORT || 5000;

connectDB();

// Tạo HTTP server từ Express app
const server = http.createServer(app);

// Khởi tạo Socket.io
const io = new SocketIOServer(server, {
  cors: {
    origin: '*', // Đổi thành domain frontend nếu cần
    methods: ['GET', 'POST']
  }
});

// Lưu userId <-> socketId mapping
const onlineUsers = new Map();

io.on('connection', (socket) => {
  // Khi user đăng nhập, client sẽ emit 'join' với userId
  socket.on('join', (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  // Khi nhận tin nhắn mới từ client
  socket.on('send_message', async (data) => {
    let { senderId, receiverId, content, attachments } = data;

    // Nếu senderId hoặc receiverId không phải ObjectId (24 ký tự), truy vấn User để lấy _id
    if (senderId && senderId.length !== 24) {
      const senderUser = await User.findOne({ firebaseUID: senderId });
      if (senderUser) senderId = senderUser._id;
    }
    if (receiverId && receiverId.length !== 24) {
      const receiverUser = await User.findOne({ firebaseUID: receiverId });
      if (receiverUser) receiverId = receiverUser._id;
    }

    // Lưu vào MongoDB
    const msg = await Message.create({
      sender: senderId,
      receiver: receiverId,
      content,
      attachments,
    });

    // Populate sender và receiver để trả về đầy đủ thông tin cho frontend
    const populatedMsg = await Message.findById(msg._id)
      .populate('sender', 'username email avatar')
      .populate('receiver', 'username email avatar');

    // Gửi realtime cho người nhận nếu đang online
    const receiverSocketId = onlineUsers.get(receiverId.toString());
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('receive_message', populatedMsg);
    }
    // Gửi realtime cho người gửi nếu đang online (và khác người nhận)
    const senderSocketId = onlineUsers.get(senderId.toString());
    if (senderSocketId && senderSocketId !== receiverSocketId) {
      io.to(senderSocketId).emit('receive_message', populatedMsg);
    }
  });

  // Khi user disconnect
  socket.on('disconnect', () => {
    for (const [userId, id] of onlineUsers.entries()) {
      if (id === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
  });
});

// Khởi động server
server.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
