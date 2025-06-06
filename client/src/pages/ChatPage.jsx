"use client"

import { useEffect, useState, useRef } from "react"
import { useNavigate, useLocation } from "react-router-dom";
import { db } from "../firebase"
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  doc,
  getDocs,
  setDoc,
  limit,
} from "firebase/firestore"
import pawLetter from "../assets/PawLetter.png"

export default function ChatPage() {
  const [chatList, setChatList] = useState([])
  const [selectedChat, setSelectedChat] = useState(null)
  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState("")
  const messagesContainerRef = useRef(null)
  const userId = localStorage.getItem("userId")
  const token = localStorage.getItem("token")
  const [allUsers, setAllUsers] = useState([])
  const navigate = useNavigate();
  const location = useLocation();

  // Chặn truy cập nếu chưa đăng nhập
  useEffect(() => {
    if (!userId) {
      navigate("/login");
    }
  }, [userId, navigate]);

  // Lấy danh sách user thực tế từ API
  useEffect(() => {
    if (!token) return
    fetch("http://localhost:3000/api/users", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json())
      .then((data) => setAllUsers(data))
      .catch((err) => console.error("Error fetching users:", err))
  }, [token])

  // Lấy danh sách hội thoại và sắp xếp theo tin nhắn mới nhất
  useEffect(() => {
    if (!userId || allUsers.length === 0) return

    const q = query(collection(db, "conversations"))
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const chats = []

      for (const docSnap of snapshot.docs) {
        const ids = docSnap.id.split("_")
        // Chỉ lấy hội thoại mà user hiện tại là 1 trong 2 thành viên
        if (ids.includes(userId)) {
          const otherId = ids[0] === userId ? ids[1] : ids[0]
          const user = allUsers.find((u) => u._id === otherId)

          if (user) {
            // Lấy tin nhắn cuối cùng của conversation này
            const msgQuery = query(
              collection(db, "conversations", docSnap.id, "messages"),
              orderBy("createdAt", "desc"),
              limit(1),
            )
            const msgSnap = await getDocs(msgQuery)
            const lastMessage = msgSnap.docs[0]?.data()

            chats.push({
              _id: otherId,
              user,
              lastMessage,
              conversationId: docSnap.id,
              lastMessageTime: lastMessage?.createdAt || null,
            })
          }
        }
      }

      // Sắp xếp theo thời gian tin nhắn mới nhất (mới nhất lên đầu)
      chats.sort((a, b) => {
        if (!a.lastMessageTime && !b.lastMessageTime) return 0
        if (!a.lastMessageTime) return 1
        if (!b.lastMessageTime) return -1

        const timeA = a.lastMessageTime.seconds || 0
        const timeB = b.lastMessageTime.seconds || 0
        return timeB - timeA
      })

      setChatList(chats)
    })

    return () => unsubscribe()
  }, [userId, allUsers])

  // Tự động chọn user nếu có query param 'to'
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const toId = params.get('to');
    if (toId && allUsers.length > 0) {
      const found = allUsers.find(u => u._id === toId);
      if (found) setSelectedChat(found);
    }
  }, [location.search, allUsers]);

  // Khi click vào user, tạo hội thoại nếu chưa có
  const handleSelectUser = async (user) => {
    setSelectedChat(user)
    const conversationId = userId < user._id ? `${userId}_${user._id}` : `${user._id}_${userId}`
    // Đảm bảo conversation tồn tại
    await setDoc(doc(db, "conversations", conversationId), {
      participants: [userId, user._id],
      createdAt: serverTimestamp(),
    })
  }

  // Lắng nghe tin nhắn realtime chỉ của conversationId đúng cặp user
  useEffect(() => {
    if (!selectedChat || !userId) return
    const conversationId = userId < selectedChat._id ? `${userId}_${selectedChat._id}` : `${selectedChat._id}_${userId}`
    const q = query(collection(db, "conversations", conversationId, "messages"), orderBy("createdAt"))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
      // Auto scroll to bottom
      setTimeout(() => {
        if (messagesContainerRef.current) {
          messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
        }
      }, 100)
    })
    return () => unsubscribe()
  }, [selectedChat, userId])

  // Gửi tin nhắn
  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!message.trim() || !selectedChat) return

    const conversationId = userId < selectedChat._id ? `${userId}_${selectedChat._id}` : `${selectedChat._id}_${userId}`

    try {
      // Đảm bảo conversation tồn tại
      await setDoc(
        doc(db, "conversations", conversationId),
        {
          participants: [userId, selectedChat._id],
          lastActivity: serverTimestamp(),
        },
        { merge: true },
      )

      // Thêm tin nhắn
      await addDoc(collection(db, "conversations", conversationId, "messages"), {
        senderId: userId,
        content: message,
        createdAt: serverTimestamp(),
      })

      setMessage("")
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

  const chatItemStyle = (isSelected) => ({
    display: "flex",
    padding: "15px",
    borderBottom: "1px solid #F5E8C7",
    cursor: "pointer",
    backgroundColor: isSelected ? "#FFF8E7" : "transparent",
    transition: "background-color 0.2s ease",
  })

  // Hiển thị thời gian relative
  const formatTime = (timestamp) => {
    if (!timestamp || !timestamp.seconds) return ""

    const messageDate = new Date(timestamp.seconds * 1000)
    const now = new Date()
    const diffInHours = (now - messageDate) / (1000 * 60 * 60)

    if (diffInHours < 1) {
      return "Vừa xong"
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} giờ trước`
    } else if (diffInHours < 48) {
      return "Hôm qua"
    } else {
      return messageDate.toLocaleDateString("vi-VN")
    }
  }

  // Responsive styles
  const responsiveStyles = `
    @media (max-width: 900px) {
      .chat-container { flex-direction: column !important; height: auto !important; }
      .chat-sidebar { width: 100% !important; min-width: 0 !important; border-right: none !important; border-bottom: 1px solid #F5E8C7 !important; }
      .chat-main { width: 100% !important; }
    }
    @media (max-width: 600px) {
      .chat-container { padding: 0 !important; }
      .chat-sidebar { display: ${selectedChat ? 'none' : 'block'} !important; }
      .chat-main { width: 100vw !important; min-width: 0 !important; }
      .chat-header { font-size: 16px !important; }
      .chat-message-input { font-size: 14px !important; padding: 10px !important; }
      .chat-send-btn { width: 36px !important; height: 36px !important; font-size: 16px !important; }
    }
  `;

  if (!userId) {
    return null; // Đã redirect ở trên
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
      <style>{responsiveStyles}</style>
      {/* Logo */}
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <img src={pawLetter || "/placeholder.svg"} alt="Pawmily" style={{ height: "120px", objectFit: "contain" }} />
      </div>

      {/* Chat Container */}
      <div
        className="chat-container"
        style={{
          display: "flex",
          maxWidth: "1200px",
          margin: "0 auto",
          height: "calc(100vh - 200px)",
          borderRadius: "15px",
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}
      >
        {/* Chat List - Hiển thị conversations đã có tin nhắn trước, sau đó là users chưa chat */}
        <div
          className="chat-sidebar"
          style={{
            width: "350px",
            backgroundColor: "#FFFFFF",
            borderRight: "1px solid #F5E8C7",
            overflowY: "auto",
            minWidth: 250,
          }}
        >
          {/* Conversations với tin nhắn */}
          {chatList.length > 0 && (
            <>
              <div
                style={{
                  padding: "10px 15px",
                  backgroundColor: "#F5E8C7",
                  fontWeight: "bold",
                  color: "#A47148",
                  fontSize: "14px",
                }}
              >
                Tin nhắn gần đây
              </div>
              {chatList
                .filter((chat) => chat && chat.user) // Add filter to remove invalid chats
                .map((chat) => (
                  <div
                    key={`chat-${chat._id}`}
                    style={{
                      ...chatItemStyle(selectedChat?._id === chat._id),
                      backgroundColor:
                        selectedChat?._id === chat._id ? "#FFF8E7" : chat.lastMessage ? "#FFFBF0" : "transparent",
                      height: "70px", // Fixed height for chat items
                    }}
                    onClick={() => handleSelectUser(chat.user)}
                  >
                    <img
                      src={
                        chat.user?.avatar && !chat.user.avatar.includes("default-avatar.jpg")
                          ? chat.user.avatar
                          : "/placeholder.svg"
                      }
                      alt={chat.user?.email || "User"}
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        marginRight: "15px",
                        border: "1px solid #D7A86E",
                        alignSelf: "flex-start",
                      }}
                    />
                    <div
                      style={{
                        flex: 1,
                        minWidth: 0,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                      }}
                    >
                      <div
                        style={{
                          fontWeight: "bold",
                          color: "#5D4037",
                          fontSize: "16px",
                          marginBottom: "6px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {chat.user?.email || "No name"}
                      </div>
                      <div
                        style={{
                          color: chat.lastMessage ? "#8B4513" : "#B0B0B0",
                          fontSize: "14px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          lineHeight: "1.2",
                        }}
                      >
                        {chat.lastMessage?.content || "Bắt đầu cuộc trò chuyện"}
                      </div>
                    </div>
                    <div
                      style={{
                        color: "#A47148",
                        fontSize: "11px",
                        textAlign: "right",
                        minWidth: "70px",
                        alignSelf: "flex-start",
                        marginTop: "2px",
                        flexShrink: 0,
                      }}
                    >
                      {formatTime(chat.lastMessageTime)}
                    </div>
                  </div>
                ))}
            </>
          )}

          {/* Users chưa có conversation */}
          {allUsers.filter((u) => u && u._id !== userId && !chatList.find((c) => c && c._id === u._id)).length > 0 && (
            <>
              <div
                style={{
                  padding: "10px 15px",
                  backgroundColor: "#F0F0F0",
                  fontWeight: "bold",
                  color: "#888",
                  fontSize: "14px",
                }}
              >
                Người dùng khác
              </div>
              {allUsers
                .filter((u) => u && u._id && u._id !== userId && !chatList.find((c) => c && c._id === u._id))
                .map((user) => (
                  <div
                    key={`user-${user._id}`}
                    style={{
                      ...chatItemStyle(selectedChat?._id === user._id),
                      height: "70px", // Fixed height for user items
                    }}
                    onClick={() => handleSelectUser(user)}
                  >
                    <img
                      src={
                        user?.avatar && !user.avatar.includes("default-avatar.jpg") ? user.avatar : "/placeholder.svg"
                      }
                      alt={user?.email || "User"}
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        marginRight: "15px",
                        border: "1px solid #D7A86E",
                        alignSelf: "center",
                      }}
                    />
                    <div
                      style={{
                        flex: 1,
                        minWidth: 0,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                      }}
                    >
                      <div
                        style={{
                          fontWeight: "bold",
                          color: "#5D4037",
                          fontSize: "16px",
                          marginBottom: "6px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {user?.email || "No name"}
                      </div>
                      <div
                        style={{
                          color: "#B0B0B0",
                          fontSize: "14px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          lineHeight: "1.2",
                        }}
                      >
                        Bắt đầu cuộc trò chuyện
                      </div>
                    </div>
                  </div>
                ))}
            </>
          )}

          {allUsers.length === 0 && (
            <div
              style={{
                textAlign: "center",
                color: "#A47148",
                padding: "20px",
              }}
            >
              Đang tải danh sách người dùng...
            </div>
          )}
        </div>

        {/* Chat Messages */}
        <div
          className="chat-main"
          style={{
            flex: 1,
            backgroundColor: "#FFFFFF",
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
          }}
        >
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div
                className="chat-header"
                style={{
                  padding: "15px 20px",
                  borderBottom: "1px solid #F5E8C7",
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "#FFF8E7",
                }}
              >
                <img
                  src={
                    selectedChat?.avatar && !selectedChat.avatar.includes("default-avatar.jpg")
                      ? selectedChat.avatar
                      : "/placeholder.svg"
                  }
                  alt={selectedChat?.email || "User"}
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    marginRight: "15px",
                    border: "1px solid #D7A86E",
                  }}
                />
                <div
                  style={{
                    fontWeight: "bold",
                    color: "#5D4037",
                    fontSize: "18px",
                  }}
                >
                  {selectedChat?.email || "No name"}
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
                    const isSender = msg.senderId === userId
                    return (
                      <div
                        key={msg.id}
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
                              style={{
                                fontSize: "12px",
                                color: "#8B4513",
                                fontWeight: "bold",
                                marginBottom: "4px",
                              }}
                            >
                              {selectedChat?.email || "User"}
                            </div>
                          )}
                          <div
                            style={{
                              fontSize: "16px",
                              color: "#5D4037",
                              wordWrap: "break-word",
                            }}
                          >
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
                            {msg.createdAt && msg.createdAt.seconds
                              ? new Date(msg.createdAt.seconds * 1000).toLocaleTimeString("vi-VN", {
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
                    Bắt đầu cuộc trò chuyện với {selectedChat.email || "No name"}
                  </div>
                )}
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
                  className="chat-message-input"
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
                  className="chat-send-btn"
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
