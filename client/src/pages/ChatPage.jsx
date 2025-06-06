"use client"

import { useEffect, useState, useRef } from "react"
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
  const [selectedFile, setSelectedFile] = useState(null)
  const fileInputRef = useRef(null)
  const messagesContainerRef = useRef(null)
  const searchInputRef = useRef(null)
  const userId = localStorage.getItem("userId")
  const token = localStorage.getItem("token")
  const [allUsers, setAllUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showSearchDropdown, setShowSearchDropdown] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const [isHoveringAttachment, setIsHoveringAttachment] = useState(false)

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

  // Search functionality
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([])
      setShowSearchDropdown(false)
      return
    }

    const keyword = searchTerm.trim().toLowerCase()

    // Search in existing chats
    const chatResults = chatList
      .filter((chat) => chat && chat.user)
      .filter((chat) => {
        const username = chat.user?.username?.toLowerCase() || ""
        const email = chat.user?.email?.toLowerCase() || ""
        return username.includes(keyword) || email.includes(keyword)
      })
      .map((chat) => ({ ...chat.user, type: "existing_chat", hasMessages: true }))

    // Search in all users (excluding current user and existing chats)
    const userResults = allUsers
      .filter((user) => user && user._id !== userId)
      .filter((user) => !chatList.find((chat) => chat._id === user._id))
      .filter((user) => {
        const username = user?.username?.toLowerCase() || ""
        const email = user?.email?.toLowerCase() || ""
        return username.includes(keyword) || email.includes(keyword)
      })
      .map((user) => ({ ...user, type: "new_user", hasMessages: false }))

    const combinedResults = [...chatResults, ...userResults]
    setSearchResults(combinedResults)
    setShowSearchDropdown(combinedResults.length > 0)
  }, [searchTerm, chatList, allUsers, userId])

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  // Handle search result click
  const handleSearchResultClick = (user) => {
    setSelectedChat(user)
    setSearchTerm("")
    setShowSearchDropdown(false)
    handleSelectUser(user)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target)) {
        setShowSearchDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

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

            // Kiểm tra xem tin nhắn cuối có phải là tin nhắn mới không
            const isNewMessage = lastMessage && lastMessage.senderId !== userId

            chats.push({
              _id: otherId,
              user,
              lastMessage,
              conversationId: docSnap.id,
              lastMessageTime: lastMessage?.createdAt || null,
              isNewMessage,
            })
          }
        }
      }

      // Sắp xếp theo thứ tự:
      // 1. Tin nhắn mới (người khác gửi) lên đầu
      // 2. Sau đó sắp xếp theo thời gian tin nhắn mới nhất
      chats.sort((a, b) => {
        // Nếu một trong hai là tin nhắn mới, ưu tiên đưa lên đầu
        if (a.isNewMessage && !b.isNewMessage) return -1
        if (!a.isNewMessage && b.isNewMessage) return 1

        // Nếu cả hai đều là tin nhắn mới hoặc không phải, sắp xếp theo thời gian
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
    if ((!message.trim() && !selectedFile) || !selectedChat) return

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
        file: selectedFile
          ? {
              name: selectedFile.name,
              type: selectedFile.type,
              size: selectedFile.size,
              url: URL.createObjectURL(selectedFile),
            }
          : null,
        createdAt: serverTimestamp(),
      })

      setMessage("")
      setSelectedFile(null)
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
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

  if (!userId) {
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

  // Attachment icon SVG
  const attachmentIcon = (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
    </svg>
  )

  return (
    <div
      style={{
        fontFamily: "'Roboto', sans-serif",
        backgroundColor: "#FAF3E0",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      {/* Logo */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <img src={pawLetter || "/placeholder.svg"} alt="Pawmily" style={{ height: "150px", objectFit: "contain" }} />
      </div>

      {/* Search Bar with Dropdown */}
      <div style={{ textAlign: "center", marginBottom: "15px", position: "relative" }}>
        <div ref={searchInputRef} style={{ display: "inline-block", position: "relative" }}>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={() => searchTerm.trim() && setShowSearchDropdown(true)}
            placeholder="Tìm kiếm theo tên hoặc email..."
            style={{
              width: "350px",
              padding: "10px 16px",
              borderRadius: "25px",
              border: "2px solid #D7A86E",
              outline: "none",
              fontSize: "16px",
              backgroundColor: "#FFFFFF",
              color: "#5D4037",
            }}
          />

          {/* Search Dropdown */}
          {showSearchDropdown && searchResults.length > 0 && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: "0",
                right: "0",
                backgroundColor: "#FFFFFF",
                border: "2px solid #D7A86E",
                borderTop: "none",
                borderRadius: "0 0 15px 15px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                zIndex: 1000,
                maxHeight: "300px",
                overflowY: "auto",
              }}
            >
              {searchResults.map((user, index) => (
                <div
                  key={`search-${user._id}-${index}`}
                  onClick={() => handleSearchResultClick(user)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "12px 16px",
                    cursor: "pointer",
                    borderBottom: index < searchResults.length - 1 ? "1px solid #F5E8C7" : "none",
                    backgroundColor: "transparent",
                    transition: "background-color 0.2s ease",
                  }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = "#FFF8E7")}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
                >
                  <img
                    src={user?.avatar && !user.avatar.includes("default-avatar.jpg") ? user.avatar : "/placeholder.svg"}
                    alt={user?.username || user?.email || "User"}
                    style={{
                      width: "35px",
                      height: "35px",
                      borderRadius: "50%",
                      marginRight: "12px",
                      border: "1px solid #D7A86E",
                    }}
                  />
                  <div style={{ flex: 1, textAlign: "left" }}>
                    <div
                      style={{
                        fontWeight: "bold",
                        color: "#5D4037",
                        fontSize: "14px",
                        marginBottom: "2px",
                      }}
                    >
                      {user?.username || user?.email || "No name"}
                    </div>
                    <div
                      style={{
                        color: "#8B4513",
                        fontSize: "12px",
                      }}
                    >
                      {user.hasMessages ? "Có tin nhắn" : "Bắt đầu trò chuyện"}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#A47148",
                      backgroundColor: user.hasMessages ? "#E8F5E8" : "#F0F8FF",
                      padding: "4px 8px",
                      borderRadius: "12px",
                      border: `1px solid ${user.hasMessages ? "#90EE90" : "#87CEEB"}`,
                    }}
                  >
                    {user.hasMessages ? "💬" : "👋"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chat Container */}
      <div
        style={{
          display: "flex",
          maxWidth: "1400px",
          margin: "0 auto",
          height: "calc(100vh - 200px)",
          borderRadius: "15px",
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}
      >
        {/* Chat List */}
        <div
          style={{
            width: "400px",
            backgroundColor: "#FFFFFF",
            borderRight: "1px solid #F5E8C7",
            overflowY: "auto",
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
                .filter((chat) => chat && chat.user)
                .map((chat) => (
                  <div
                    key={`chat-${chat._id}`}
                    style={{
                      ...chatItemStyle(selectedChat?._id === chat._id),
                      backgroundColor:
                        selectedChat?._id === chat._id
                          ? "#FFF8E7"
                          : chat.isNewMessage
                            ? "#FFF0D9"
                            : chat.lastMessage
                              ? "#FFFBF0"
                              : "transparent",
                      height: "70px",
                    }}
                    onClick={() => handleSelectUser(chat.user)}
                  >
                    <img
                      src={
                        chat.user?.avatar && !chat.user.avatar.includes("default-avatar.jpg")
                          ? chat.user.avatar
                          : "/placeholder.svg"
                      }
                      alt={chat.user?.username || chat.user?.email || "No name"}
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
                        {chat.user?.username || chat.user?.email || "No name"}
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
                      height: "70px",
                    }}
                    onClick={() => handleSelectUser(user)}
                  >
                    <img
                      src={
                        user?.avatar && !user.avatar.includes("default-avatar.jpg") ? user.avatar : "/placeholder.svg"
                      }
                      alt={user?.username || user?.email || "No name"}
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
                        {user?.username || user?.email || "No name"}
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
                  src={
                    selectedChat?.avatar && !selectedChat.avatar.includes("default-avatar.jpg")
                      ? selectedChat.avatar
                      : "/placeholder.svg"
                  }
                  alt={selectedChat?.username || selectedChat?.email || "No name"}
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
                  {selectedChat?.username || selectedChat?.email || "No name"}
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
                              {selectedChat?.username || selectedChat?.email || "No name"}
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
                            {msg.file && (
                              <div style={{ marginTop: "8px" }}>
                                {msg.file.type.startsWith("image/") ? (
                                  <img
                                    src={msg.file.url || "/placeholder.svg"}
                                    alt={msg.file.name}
                                    style={{
                                      maxWidth: "200px",
                                      maxHeight: "200px",
                                      borderRadius: "8px",
                                      border: "1px solid #D7A86E",
                                    }}
                                  />
                                ) : (
                                  <a
                                    href={msg.file.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "8px",
                                      padding: "8px 12px",
                                      backgroundColor: "#FFF8E7",
                                      borderRadius: "8px",
                                      border: "1px solid #D7A86E",
                                      color: "#5D4037",
                                      textDecoration: "none",
                                      maxWidth: "200px",
                                    }}
                                  >
                                    📎 {msg.file.name}
                                  </a>
                                )}
                              </div>
                            )}
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
                    Bắt đầu cuộc trò chuyện với {selectedChat?.username || selectedChat?.email || "No name"}
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
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                {selectedFile && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "10px",
                      backgroundColor: "#FFFFFF",
                      borderRadius: "10px",
                      border: "1px solid #D7A86E",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: "bold", color: "#5D4037" }}>{selectedFile.name}</div>
                      <div style={{ fontSize: "12px", color: "#A47148" }}>
                        {(selectedFile.size / 1024).toFixed(1)} KB
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      style={{
                        backgroundColor: "#FF6B6B",
                        color: "white",
                        border: "none",
                        borderRadius: "50%",
                        width: "30px",
                        height: "30px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "16px",
                      }}
                    >
                      ×
                    </button>
                  </div>
                )}
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
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
                  <input type="file" ref={fileInputRef} onChange={handleFileSelect} style={{ display: "none" }} />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    onMouseEnter={() => setIsHoveringAttachment(true)}
                    onMouseLeave={() => setIsHoveringAttachment(false)}
                    style={{
                      backgroundColor: isHoveringAttachment ? "#C69447" : "#D7A86E",
                      color: "white",
                      border: "none",
                      borderRadius: "50%",
                      width: "40px",
                      height: "40px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "18px",
                      transition: "all 0.2s ease",
                      boxShadow: isHoveringAttachment ? "0 3px 8px rgba(0,0,0,0.2)" : "0 2px 5px rgba(0,0,0,0.1)",
                      transform: isHoveringAttachment ? "translateY(-2px)" : "translateY(0)",
                    }}
                  >
                    {attachmentIcon}
                  </button>
                  <button
                    type="submit"
                    disabled={!message.trim() && !selectedFile}
                    style={{
                      backgroundColor: message.trim() || selectedFile ? "#D7A86E" : "#E0E0E0",
                      color: "white",
                      border: "none",
                      borderRadius: "50%",
                      width: "40px",
                      height: "40px",
                      cursor: message.trim() || selectedFile ? "pointer" : "not-allowed",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "18px",
                      transition: "background-color 0.2s ease",
                    }}
                  >
                    ➤
                  </button>
                </div>
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
