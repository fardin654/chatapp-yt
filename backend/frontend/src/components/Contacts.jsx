import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Logo from "../assets/logo.svg";
import Logout from "./Logout";
import {io} from "socket.io-client";
import { host } from "../utils/APIRoutes";
import { useNavigate } from "react-router-dom";

function Contacts({ contacts, currentUser, changeChat }) {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);
  const [onlineUsers, setOnlineUsers] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    const socket = io(host);
    socket.on("onlineUsers", (data) => {
      setOnlineUsers(data);
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (currentUser) {
      setCurrentUserName(currentUser.username);
      setCurrentUserImage(currentUser.avatarImage);
    }
  }, [currentUser]);

  function changeCurrentChat(index, contact) {
    setCurrentSelected(index);
    changeChat(contact);
  }

  function goToAvatarSetup() {
    navigate("/setAvatar");
  }

  return (
    <>
      {currentUserName && currentUserImage && (
        <Container>
          <div className="brand">
            <img src={Logo} alt="logo" />
            <h3>YouChat</h3>
          </div>
          
          <div className="contacts-header">
            <h4>Contacts ({contacts.length})</h4>
          </div>
          
          <div className="contacts">
            {contacts.length > 0 ? (
              contacts.map((contact, index) => {
                return (
                  <div
                    key={contact._id}
                    className={`contact ${index === currentSelected ? "selected" : ""}`}
                    onClick={() => changeCurrentChat(index, contact)}
                  >
                    <div className="avatar-container">
                      <img
                        src={`data:image/svg+xml;base64,${contact.avatarImage}`}
                        alt="avatar"
                        className="avatar"
                      />
                      {onlineUsers[contact._id] && <div className="online-indicator"></div>}
                    </div>
                    <div className="contact-info">
                      <h3 className="username">{contact.username}</h3>
                      <p className="status">{onlineUsers[contact._id] ? "Online" : "Offline"}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="no-contacts">
                <p>No contacts yet</p>
                <span>Start a conversation by adding friends</span>
              </div>
            )}
          </div>
          
          <div className="current-user">
            <div className="avatar-container" onClick={goToAvatarSetup}>
              <img
                src={`data:image/svg+xml;base64,${currentUserImage}`}
                alt="avatar"
                className="avatar"
              />
              <div className="online-indicator self"></div>
            </div>
            <div className="user-info">
              <h3 className="username">{currentUserName}</h3>
              <p className="status">Online</p>
            </div>
            <div className="actions">
              <Logout currentUser={currentUser} />
            </div>
          </div>
        </Container>
      )}
    </>
  );
}

const Container = styled.div`
  border-top-left-radius: 16px;
  border-bottom-left-radius: 16px;
  display: grid;
  grid-template-rows: auto 1fr auto;
  height: 100%;
  overflow: hidden;
  background: rgba(8, 4, 32, 0.9);
  backdrop-filter: blur(10px);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);

  @media screen and (max-width: 768px) {
    border-radius: 0;
    border-right: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .brand {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.8rem;
    padding: 1.2rem 1rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    
    img {
      height: 2.5rem;
      filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.3));
    }
    
    h3 {
      color: white;
      font-size: 1.5rem;
      font-weight: 700;
      letter-spacing: 0.5px;
      background: linear-gradient(135deg, #ffffff, #9a86f3);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }

  .contacts-header {
    padding: 1rem 1.2rem 0.5rem;
    
    h4 {
      color: rgba(255, 255, 255, 0.7);
      font-size: 0.9rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin: 0;
    }
  }

  .contacts {
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    padding: 0.5rem 0.8rem;
    gap: 0.5rem;

    &::-webkit-scrollbar {
      width: 4px;
    }
    
    &::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 2px;
    }
    
    &::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 2px;
    }

    .contact {
      display: flex;
      align-items: center;
      gap: 0.8rem;
      padding: 0.8rem 1rem;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;

      .avatar-container {
        position: relative;
        
        .avatar {
          height: 2.8rem;
          width: 2.8rem;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid rgba(255, 255, 255, 0.1);
        }
        
        .online-indicator {
          position: absolute;
          bottom: 0.35rem;
          right: 0;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background-color: #00c853;
          border: 2px solid rgba(8, 4, 32, 0.9);
        }
      }

      .contact-info {
        flex: 1;
        min-width: 0;
        
        .username {
          color: white;
          font-size: 1rem;
          font-weight: 500;
          margin: 0 0 0.2rem 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .status {
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.8rem;
          margin: 0;
        }
      }

      &:hover {
        background: rgba(255, 255, 255, 0.08);
      }

      &.selected {
        background: linear-gradient(135deg, #3b5998, #2d4373);
        
        .username {
          color: white;
        }
        
        .status {
          color: rgba(255, 255, 255, 0.8);
        }
      }
    }

    .no-contacts {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem 1rem;
      text-align: center;
      color: rgba(255, 255, 255, 0.5);
      
      p {
        font-size: 1rem;
        margin: 0 0 0.5rem 0;
        font-weight: 500;
      }
      
      span {
        font-size: 0.85rem;
      }
    }
  }

  .current-user {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    padding: 1rem 1.2rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.05);

    .avatar-container {
      position: relative;
      cursor: pointer;
      
      .avatar {
        height: 3.2rem;
        width: 3.2rem;
        border-radius: 50%;
        object-fit: cover;
        border: 2px solid rgba(255, 255, 255, 0.2);
        transition: all 0.2s ease;
        
        &:hover {
          border-color: rgba(255, 255, 255, 0.4);
          transform: scale(1.05);
        }
      }
      
      .online-indicator.self {
        position: absolute;
        bottom: 0.35rem;
        right: 0;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background-color: #00c853;
        border: 2px solid rgba(8, 4, 32, 0.9);
      }
    }

    .user-info {
      flex: 1;
      min-width: 0;
      
      .username {
        color: white;
        font-size: 1.1rem;
        font-weight: 600;
        margin: 0 0 0.2rem 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      
      .status {
        color: rgba(255, 255, 255, 0.7);
        font-size: 0.85rem;
        margin: 0;
      }
    }

    .actions {
      display: flex;
      align-items: center;
    }
  }

  @media screen and (max-width: 768px) {
    grid-template-rows: auto auto auto;
    
    .brand {
      padding: 0.8rem;
      
      img {
        height: 2rem;
      }
      
      h3 {
        font-size: 1.2rem;
      }
    }
    
    .contacts-header {
      padding: 0.8rem 1rem 0.4rem;
      
      h4 {
        font-size: 0.8rem;
      }
    }
    
    .contacts {
      padding: 0.4rem 0.6rem;
      gap: 0.4rem;
      
      .contact {
        padding: 0.6rem 0.8rem;
        
        .avatar-container .avatar {
          height: 2.4rem;
          width: 2.4rem;
        }
        
        .contact-info .username {
          font-size: 0.9rem;
        }
      }
    }
    
    .current-user {
      padding: 0.8rem 1rem;
      
      .avatar-container .avatar {
        height: 2.8rem;
        width: 2.8rem;
      }
      
      .user-info .username {
        font-size: 1rem;
      }
    }
  }

  @media screen and (max-width: 480px) {
    .brand {
      flex-direction: column;
      gap: 0.4rem;
      padding: 0.6rem;
      
      h3 {
        font-size: 1rem;
      }
    }
    
    .current-user {
      flex-wrap: wrap;
      justify-content: center;
      text-align: center;
      gap: 0.6rem;
      
      .user-info {
        flex-basis: 100%;
      }
    }
  }
`;

export default Contacts;