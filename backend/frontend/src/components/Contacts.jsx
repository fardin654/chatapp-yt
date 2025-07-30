import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Logo from "../assets/logo.svg";
import Logout from "./Logout";
import {io} from "socket.io-client";
import { host } from "../utils/APIRoutes";
import { useNavigate } from "react-router-dom";



function Contacts({ contacts, currentUser,changeChat}) {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);
  const [onlineUsers, setOnlineUsers] = useState({});

  const navigate = useNavigate();


  useEffect(()=>{
      const socket = io(host);
      socket.on("onlineUsers",(data)=>{
        setOnlineUsers(data);
      })
      return () => {
        socket.disconnect();
      };
  },[])


  useEffect(() => {
    if(currentUser){
    setCurrentUserName(currentUser.username);
    setCurrentUserImage(currentUser.avatarImage);
    }
  }, [currentUser],);

  function changeCurrentChat(index,contact){
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
          <div className="contacts">
            {contacts.map((contact, index) => {
              return (
                <div
                  key={contact._id}
                  className={`contact ${index === currentSelected ? "selected" : ""}`}
                  onClick={()=>changeCurrentChat(index,contact)}
                >
                  <div className="avatar">
                    <img
                      src={`data:image/svg+xml;base64,${contact.avatarImage}`} alt="avatar"
                    />
                  </div>
                  <div className="username">
                    <h3>{contact.username}</h3>
                  </div>
                   {onlineUsers[contact._id] && <GreenDot><div></div></GreenDot>} 

                </div>
              );
            })}
            
          </div>
          
          <div className="current-user">
            <div className="avatar">
              <img
                src={`data:image/svg+xml;base64,${currentUserImage}`}
                alt="avatar"
                onClick={goToAvatarSetup}
              />
            </div>
            <div className="username">
              <h2>{currentUserName}</h2>
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
  border-top-left-radius: 1rem;
  border-bottom-left-radius: 1rem;
  display: grid;
  grid-template-rows: 10% 75% 15%;
  overflow: hidden;
  background-color: rgba(8, 4, 32, 0.85);
  backdrop-filter: blur(6px);
  box-shadow: inset 0 0 10px rgba(255, 255, 255, 0.05);

  .brand {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.8rem;
    padding: 0.5rem 0;
    img {
      height: 2.2rem;
      filter: drop-shadow(0 0 2px white);
    }
    h3 {
      color: white;
      text-transform: uppercase;
      font-weight: 600;
      letter-spacing: 1px;
    }
  }

  .contacts {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: auto;
    padding: 0.5rem 0;
    gap: 0.8rem;

    &::-webkit-scrollbar {
      width: 0.3rem;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #ffffff3b;
      border-radius: 1rem;
    }

    .contact {
      background-color: #ffffff14;
      min-height: 4.8rem;
      width: 90%;
      border-radius: 0.5rem;
      padding: 0.6rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      cursor: pointer;
      transition: background-color 0.3s ease, transform 0.2s ease;

      .avatar img {
        height: 2.2rem;
        border-radius: 50%;
      }

      .username h3 {
        color: white;
        font-size: 1rem;
        font-weight: 500;
      }

      &:hover {
        background-color: #3b5998cc;
        transform: scale(1.02);
      }
    }

    .contact.selected {
      background-color: #3b5998;
    }
  }

  .current-user {
  background-color: #ffffff1a;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.6rem 1rem;
  flex-wrap: wrap;
  gap: 1rem;

  .avatar img {
    height: 3rem;
    border-radius: 50%;
    border: 2px solid white;
    background-color: #aaaaaaff;
    cursor: pointer;
  }

  .username {
    flex: 1;
    min-width: 0;

    h2 {
      color: white;
      font-size: 1.5rem;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 100%;
    }
  }

  .actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-shrink: 0;

    .avatar-btn {
      padding: 0.4rem 0.6rem;
      font-size: 0.75rem;
      color: white;
      background-color: #4c5cf4;
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: background-color 0.3s ease;

      &:hover {
        background-color: #3b4cd1;
      }
    }
  }

  @media screen and (max-width: 720px) {
    flex-direction: column;
    align-items: center;

    .username h2 {
      font-size: 1rem;
    }

    .actions {
      justify-content: center;
    }
  }
}

  @media screen and (max-width: 720px) {
    border-radius: 0;
    grid-template-rows: auto auto auto;
    .contacts {
      padding: 0.3rem 0;
    }
    .brand h3 {
      font-size: 0.9rem;
    }
  }

  .actions {
    display: flex;
    align-items: center;
    gap: 1rem;

    .avatar-btn {
      padding: 0.4rem 0.8rem;
      font-size: 0.8rem;
      color: white;
      background-color: #4c5cf4;
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: background-color 0.3s ease;

      &:hover {
        background-color: #3b4cd1;
      }
    }
  }

`;


const GreenDot = styled.div`
  div{
    height:10px;
    width:10px;
    border-radius:50%;
    background-color: #00FF00;
  }

`
export default Contacts