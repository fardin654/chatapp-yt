import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import ChatInput from "../components/ChatInput";
import axios from "axios";
import { sendMessageRoute, getAllMessagesRoute } from "../utils/APIRoutes";
import { v4 as uuidv4 } from "uuid";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { io } from "socket.io-client";
import { host } from "../utils/APIRoutes";
import { toast, ToastContainer } from 'react-toastify';


function ChatContainer({ currentChat, currentUser, socket, handleToggle }) {
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState({});

  const toastOptions = {
    position: "bottom-right",
    autoClose: 5000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
    closeOnClick: true,
  };

  useEffect(() => {
    const socket = io(host);
    socket.on("onlineUsers", (data) => {
      setOnlineUsers(data);
    });
    return () => {
      socket.disconnect();
    };
  }, []);
  
  const scrollRef = useRef();



  useEffect(() => {
    const fetchMessages = async () => {
      if (currentChat) {
        try {
          const response = await axios.post(getAllMessagesRoute, {
            from: currentUser._id,
            to: currentChat._id,
          });
          setMessages(response.data);
        } catch (error) {
          console.error("Error fetching messages", error);
        }
      }
    };

    fetchMessages();
  }, [currentChat]);

  async function handleSendMessage(messageContent) {
    await axios.post(sendMessageRoute, {
      from: currentUser._id,
      to: currentChat._id,
      message: messageContent,
    });

    socket.current.emit("send-msg", {
      to: currentChat._id,
      from: currentUser._id,
      message: messageContent,
    });

    const newMessage = {
      fromSelf: true,
      message: messageContent,
      createdAt: new Date(), 
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
  }

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-received", (msg) => {
        if (msg.from === currentChat._id) {
          setArrivalMessage({
            from: msg.from,
            fromSelf: false,
            message: msg.message,
            createdAt: new Date(),
          });
        }else{
          console.log("New message from another user");
          toast.info(`New message from ${currentChat.username}`, toastOptions);
        }
      });
    }
  }, [socket, currentChat]);

  useEffect(() => {
    if(arrivalMessage){
      if( arrivalMessage.from === currentChat._id){
        setMessages((prevMessages) => [...prevMessages, arrivalMessage]);
      }else{
        toast.info(`New message from ${currentChat.username}`, toastOptions);
      }
    }
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString([], options);
  }

  function formatTime(dateString) {
    const options = { hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleTimeString([], options);
  }

  function groupMessagesByDate(messages) {
    return messages.reduce((groups, message) => {
      const date = formatDate(message.createdAt);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
      return groups;
    }, {});
  }

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <>
      {currentChat && (
        <Container>
          <div className="chat-header">
            <div className="user-details">
              <div className="avatar">
                <img src={`data:image/svg+xml;base64,${currentChat.avatarImage}`} alt="avatar" />
              </div>
              <div className="username-status">
                <h3>{currentChat.username}</h3>
                {onlineUsers[currentChat._id] ?<p className="statusOnline">Online</p>:<p className="statusOffline">Offline</p>}
              </div>
            </div>
            <div className="header-icons">
              <i className="fas fa-video"></i>
              <i className="fas fa-phone"></i>
              <i className="fas fa-ellipsis-v"></i>
            </div>

            <div className="back-button">
                <Tooltip title="Back to contacts">
                  <IconButton
                    onClick={handleToggle}
                    sx={{
                      color: "white",
                      backgroundColor: "rgba(255,255,255,0.1)",
                      "&:hover": { backgroundColor: "rgba(255,255,255,0.25)" },
                    }}
                  >
                    <ArrowBackIcon />
                  </IconButton>
                </Tooltip>
              </div>
          </div>

          <div className="chat-messages">
            {Object.keys(groupedMessages).map((date) => (
              <div key={date}>
                <div className="date-separator">
                  <span>{date}</span>
                </div>
                {groupedMessages[date].map((message) => (
                  <div ref={scrollRef} key={uuidv4()}>
                    <div className={`message ${message.fromSelf ? "sended" : "received"}`}>
                      <div className="content">
                        <p>{message.message}</p>
                        <p className="timeStamp">{formatTime(message.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <ChatInput handleSendMessage={handleSendMessage} />
          <ToastContainer />
        </Container>
      )}
    </>
  );
}

const Container = styled.div`
  border-radius: 16px;
  display: grid;
  grid-template-rows: 70px 1fr 80px;
  height: 100%;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);

  @media screen and (max-width: 768px) {
    border-radius: 0;
    border: none;
  }

  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 1.5rem;
    background: rgba(255, 255, 255, 0.05);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      
      .avatar {
        height: 40px;
        width: 40px;
        border-radius: 50%;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
        background: linear-gradient(135deg, #3b5998, #2d4373);
        border: 2px solid rgba(255, 255, 255, 0.2);
        
        img {
          height: 36px;
          width: 36px;
          object-fit: cover;
          border-radius: 50%;
        }

        .back-button {
          display: none;
        }

      }
      
      .username-status {
        h3 {
          color: white;
          margin: 0;
          font-size: 1.1rem;
          font-weight: 600;
        }
        
        .statusOnline {
          color: #00c853;
          margin: 0;
          font-size: 0.8rem;
        }
        .statusOffline {
          color: #d72020ff;
          margin: 0;
          font-size: 0.8rem;
        }
      }
    }
    
    .header-icons {
      display: flex;
      gap: 1.2rem;
      color: rgba(255, 255, 255, 0.7);
      
      i {
        cursor: pointer;
        transition: color 0.2s;
        
        &:hover {
          color: white;
        }
      }
    }
  }
  
  .chat-messages {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    overflow: auto;
    
    &::-webkit-scrollbar {
      width: 6px;
    }
    
    &::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 10px;
    }
    
    &::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 10px;
    }
    
    .date-separator {
      text-align: center;
      margin: 0.5rem 0;
      
      span {
        background: rgba(255, 255, 255, 0.1);
        padding: 0.4rem 1.2rem;
        border-radius: 20px;
        color: rgba(255, 255, 255, 0.7);
        font-size: 0.8rem;
        font-weight: 500;
      }
    }
    
    .message {
      display: flex;
      margin: 0.2rem 0;
      
      .content {
        max-width: 65%;
        overflow-wrap: break-word;
        padding: 0.7rem 1rem;
        font-size: 0.95rem;
        border-radius: 18px;
        position: relative;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        
        p {
          margin: 0;
          line-height: 1.4;
        }
        
        .timeStamp {
          font-size: 0.7rem;
          margin: 0;
          margin-top: 4px;
          text-align: right;
          opacity: 0.8;
        }
      }
    }
    
    .sended {
      justify-content: flex-end;
      
      .content {
        background: linear-gradient(135deg, #3b5998, #2d4373);
        color: white;
        border-bottom-right-radius: 5px;
        
        .timeStamp {
          color: rgba(255, 255, 255, 0.7);
        }
      }
    }
    
    .received {
      justify-content: flex-start;
      
      .content {
        background: rgba(255, 255, 255, 0.1);
        color: white;
        border-bottom-left-radius: 5px;
        
        .timeStamp {
          color: rgba(255, 255, 255, 0.7);
        }
      }
    }
  }
`;

export default ChatContainer;