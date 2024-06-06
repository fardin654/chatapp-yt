import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import ChatInput from "../components/ChatInput";
import axios from "axios";
import { sendMessageRoute, getAllMessagesRoute } from "../utils/APIRoutes";
import { v4 as uuidv4 } from "uuid";

function ChatContainer({ currentChat, currentUser, socket }) {
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
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
        console.log(msg);
        setArrivalMessage({ fromSelf: false, message: msg, createdAt: new Date() });
      });
    }
  }, []);

  useEffect(() => {
    arrivalMessage && setMessages((prevMessages) => [...prevMessages, arrivalMessage]);
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
              <div className="username">
                <h3>{currentChat.username}</h3>
              </div>
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
        </Container>
      )}
    </>
  );
}

const Container = styled.div`
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  display: grid;
  grid-template-rows: 10% 80% 10%;
  gap: 0.1rem;
  overflow: hidden;
  backdrop-filter: blur(2px);
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem;
    padding-top: 1.5rem;
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: white;
        }
      }
    }
  }
  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: grey;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .date-separator {
      text-align: center;
      margin: 1rem 0;
      span {
        background-color: #d1d1d1;
        padding: 0.2rem 1rem;
        border-radius: 1rem;
        color: #000;
      }
    }
    .message {
      display: flex;
      align-items: center;
      margin: 0.1rem 0;
      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 0.8rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #d1d1d1;
        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
        p {
          display: inline-block;
        }
        .timeStamp {
          color: grey;
          font-size: 10px;
          margin-left: 5px;
        }
      }
    }
    .sended {
      justify-content: flex-end;
      .content {
        background-color:  #3b5998;
      }
    }
    .received {
      justify-content: flex-start;
      .content {
        background-color: rgb(32, 40, 41);
        color: #ffffff;
      }
    }
  }
`;

export default ChatContainer;