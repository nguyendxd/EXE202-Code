"use client"

import { useEffect, useState, useRef } from "react"
import { io } from "socket.io-client"
import pawLetter from "../assets/PawLetter.png"

const SOCKET_URL = "http://localhost:3000" // Đảm bảo dùng đúng port backend

export default function ChatPage() {
  const [chatList, setChatList] = useState([])
  const [selectedChat, setSelectedChat] = useState(null)
  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState("")
  const socketRef = useRef(null)
  const messagesEndRef = useRef(null) // Để tự động scroll đến tin nhắn mới nhất
  const messagesContainerRef = useRef(null)
  const userId = localStorage.getItem("userId")
  const token = localStorage.getItem("token")

  // Tự động scroll đến tin nhắn mới nhất khi messages thay đổi
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
    }
  }

  useEffect(() => {
    // Delay scroll to ensure DOM is updated
    const timer = setTimeout(() => {
      scrollToBottom()
    }, 100)
    return () => clearTimeout(timer)
  }, [messages])

  // Kết nối socket khi mount
  useEffect(() => {
    if (!userId || !token) {
      console.error("Missing userId or token. Please login again.")
      return
    }

    const socket = io(SOCKET_URL, {
      transports: ["websocket"],
      autoConnect: false,
      auth: { token: `Bearer ${token}` }, // Gửi token để xác thực socket
    })
    socketRef.current = socket

    socket.connect()
    socket.emit("join", userId)

    // Nhận tin nhắn realtime
    socket.on("receive_message", (msg) => {
      // Nếu tin nhắn liên quan đến selectedChat thì push vào state
      if (
        selectedChat &&
        (
          (msg.sender._id === selectedChat._id) ||
          (msg.receiver._id === selectedChat._id) ||
          (msg.sender === selectedChat._id) ||
          (msg.receiver === selectedChat._id)
        )
      ) {
        setMessages((prev) => {
          const exists = prev.some((m) => m._id === msg._id);
          if (exists) return prev;
          return [...prev, msg].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        });
      }
    })

    // Xác nhận tin nhắn đã gửi
    socket.on("message_sent", (msg) => {
      console.log("[SOCKET] Message sent confirm:", msg, "Selected chat:", selectedChat);
      if (
        selectedChat &&
        (
          (msg.sender._id === selectedChat._id) ||
          (msg.receiver._id === selectedChat._id) ||
          (msg.sender === selectedChat._id) ||
          (msg.receiver === selectedChat._id)
        )
      ) {
        setMessages((prev) => {
          const exists = prev.some((m) => m._id === msg._id);
          if (exists) return prev;
          return [...prev, msg].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        });
      }
    })

    // Xử lý lỗi Socket
    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message)
    })

    return () => {
      if (socket.connected) socket.disconnect()
    }
  }, [userId, token, selectedChat])

  // Lấy danh sách hội thoại khi load trang
  useEffect(() => {
    if (!userId || !token) {
      console.error("Missing userId or token. Please login again.")
      return
    }
    fetch("http://localhost:3000/api/messages/conversations", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => res.json())
      .then((data) => setChatList(data))
      .catch((err) => console.error("Error fetching conversations:", err))
  }, [token, userId])

  // Khi chọn 1 chat, lấy lịch sử tin nhắn và đánh dấu tin nhắn đã đọc
  const handleSelectChat = (chat) => {
    setSelectedChat(chat)
    fetch(`http://localhost:3000/api/messages/conversation/${chat._id}`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // Sort messages by creation date to ensure chronological order
        const sortedMessages = Array.isArray(data)
          ? data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
          : []
        setMessages(sortedMessages)
        // Scroll to bottom after loading messages
        setTimeout(() => scrollToBottom(), 200)
      })
      .catch((err) => console.error("Error fetching messages:", err))
  }

  // Khi gửi tin nhắn chỉ emit, không tự push vào state
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim() || !selectedChat) return;
    const msgData = {
      senderId: userId,
      receiverId: selectedChat._id,
      content: message,
      attachments: [],
    };
    socketRef.current.emit("send_message", msgData);
    setMessage("");
  };

  const chatItemStyle = (isSelected) => ({
    display: "flex",
    alignItems: "center",
    padding: "15px",
    borderBottom: "1px solid #F5E8C7",
    cursor: "pointer",
    backgroundColor: isSelected ? "#FFF8E7" : "transparent",
    transition: "background-color 0.2s ease",
  })

  if (!userId || !token) {
    return (
      <div
        style={{
          fontFamily: "'Roboto', sans-serif",
          backgroundColor: "#FAF3E0",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <p style={{ color: "#A47148", fontSize: "24px" }}>Vui lòng đăng nhập để sử dụng tính năng chat.</p>
      </div>
    )
  }

  return (
    <div
      style={{
        fontFamily: "'Roboto', sans-serif",
        backgroundColor: "#FAF3E0",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      {/* Pawmily Logo */}
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <img
          src={pawLetter || "/placeholder.svg"}
          alt="Pawmily"
          style={{
            height: "200px",
            objectFit: "contain",
          }}
        />
      </div>

      {/* Chat Container */}
      <div
        style={{
          display: "flex",
          maxWidth: "1200px",
          margin: "0 auto",
          height: "calc(100vh - 280px)",
          borderRadius: "15px",
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}
      >
        {/* Chat List */}
        <div
          style={{
            width: "350px",
            backgroundColor: "#FFFFFF",
            borderRight: "1px solid #F5E8C7",
            overflowY: "auto",
          }}
        >
          {chatList.length > 0 ? (
            chatList.map((chat) => (
              <div
                key={chat._id}
                style={chatItemStyle(selectedChat?._id === chat._id)}
                onClick={() => handleSelectChat(chat)}
              >
                <img
                  src={chat.user?.avatar || "/placeholder.svg"}
                  alt={chat.user?.email}
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    marginRight: "15px",
                    border: "1px solid #D7A86E",
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: "bold", color: "#5D4037", fontSize: "16px" }}>
                    {chat.user?.email || "No name"}
                  </div>
                  <div style={{ color: "#8B4513", fontSize: "14px" }}>{chat.lastMessage?.content || ""}</div>
                </div>
                <div style={{ color: "#A47148", fontSize: "12px" }}>
                  {chat.lastMessage?.createdAt ? new Date(chat.lastMessage.createdAt).toLocaleDateString() : ""}
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: "center", color: "#A47148", padding: "20px" }}>Không có hội thoại nào.</div>
          )}
        </div>

        {/* Chat Messages */}
        <div
          style={{
            flex: 1,
            backgroundColor: "#FFFFFF",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div
                style={{
                  padding: "15px 20px",
                  borderBottom: "1px solid #F5E8C7",
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "#FFF8E7",
                }}
              >
                <img
                  src={selectedChat.user?.avatar || "/placeholder.svg"}
                  alt={selectedChat.user?.email}
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    marginRight: "15px",
                    border: "1px solid #D7A86E",
                  }}
                />
                <div style={{ fontWeight: "bold", color: "#5D4037", fontSize: "18px" }}>
                  {selectedChat.user?.email || "No name"}
                </div>
              </div>

              {/* Messages Container */}
              <div
                ref={messagesContainerRef}
                style={{
                  flex: 1,
                  padding: "20px",
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                {messages.length > 0 ? (
                  messages.map((msg) => {
                    const isSender = (msg.sender?._id || msg.sender) === userId
                    return (
                      <div
                        key={msg._id}
                        style={{
                          display: "flex",
                          justifyContent: isSender ? "flex-end" : "flex-start",
                          width: "100%",
                        }}
                      >
                        <div
                          style={{
                            backgroundColor: isSender ? "#FFCC80" : "#FFF8E7",
                            padding: "12px 16px",
                            borderRadius: isSender ? "18px 18px 0 18px" : "18px 18px 18px 0",
                            maxWidth: "70%",
                            boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                            border: isSender ? "1px solid #FFB74D" : "1px solid #D7A86E",
                          }}
                        >
                          {!isSender && (
                            <div
                              style={{ fontSize: "12px", color: "#8B4513", fontWeight: "bold", marginBottom: "4px" }}
                            >
                              {msg.sender?.username || msg.sender?.email || "User"}
                            </div>
                          )}
                          <div style={{ fontSize: "16px", color: "#5D4037", wordWrap: "break-word" }}>
                            {msg.content}
                          </div>
                          <div
                            style={{
                              fontSize: "11px",
                              color: "#A47148",
                              marginTop: "4px",
                              textAlign: isSender ? "right" : "left",
                            }}
                          >
                            {msg.createdAt
                              ? new Date(msg.createdAt).toLocaleTimeString("vi-VN", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : ""}
                          </div>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div
                    style={{
                      textAlign: "center",
                      color: "#A47148",
                      margin: "auto",
                      fontSize: "16px",
                    }}
                  >
                    Bắt đầu cuộc trò chuyện với {selectedChat.user?.email || "No name"}
                  </div>
                )}
                {/* Invisible element to scroll to */}
                <div ref={messagesEndRef} style={{ height: "1px" }} />
              </div>

              {/* Message Input */}
              <form
                onSubmit={handleSendMessage}
                style={{
                  padding: "15px 20px",
                  borderTop: "1px solid #F5E8C7",
                  backgroundColor: "#FFF8E7",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Nhập tin nhắn..."
                  style={{
                    flex: 1,
                    padding: "12px 15px",
                    borderRadius: "25px",
                    border: "2px solid #D7A86E",
                    outline: "none",
                    fontSize: "16px",
                    backgroundColor: "#FFFFFF",
                  }}
                />
                <button
                  type="submit"
                  disabled={!message.trim()}
                  style={{
                    backgroundColor: message.trim() ? "#D7A86E" : "#E0E0E0",
                    color: "white",
                    border: "none",
                    borderRadius: "50%",
                    width: "40px",
                    height: "40px",
                    cursor: message.trim() ? "pointer" : "not-allowed",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "18px",
                    transition: "background-color 0.2s ease",
                  }}
                >
                  ➤
                </button>
              </form>
            </>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                color: "#A47148",
              }}
            >
              <p style={{ fontSize: "18px" }}>Chọn một cuộc trò chuyện để bắt đầu</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
