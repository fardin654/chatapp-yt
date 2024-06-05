import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Logo from "../assets/logo.svg";
import Logout from "./Logout";
import {io} from "socket.io-client";
import { host } from "../utils/APIRoutes";


function Contacts({ contacts, currentUser,changeChat}) {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);
  const [onlineUsers, setOnlineUsers] = useState({});

  useEffect(()=>{
    const socket = io("https://chatapp-yt-c4h4.onrender.com");
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
              />
            </div>
            <div className="username">
              <h2>{currentUserName}</h2>
            </div>
            <Logout currentUser={currentUser}/>
          </div>
        </Container>
      )}
    </>
  );
}

const Container = styled.div`
border-top-left-radius:10px;
border-bottom-left-radius:10px;
display: grid;
grid-template-rows: 10% 75% 15%;
overflow: hidden;
background-color: #080420;

.brand {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  img {
    height: 2rem;
  }
  h3 {
    color: white;
    text-transform: uppercase;
  }
}

.contacts {
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: auto;
  gap: 0.8rem;
  &::-webkit-scrollbar{
    width:0.2rem;
    &-thumb{
      background-color:#ffffff39;
      width:0.1rem;
      border-radius:1rem;
    }
  }

  .contact {
    background-color: #ffffff39;
    min-height: 5rem;
    cursor: pointer;
    width: 90%;
    border-radius: 0.2rem;
    padding: 0.4rem;
    display: flex;
    gap: 1rem;
    align-items: center;
    transition: 0.5s ease-in-out;

    .avatar {
      img {
        height: 2rem;
      }
    }

    .username {
      h3 {
        color: white;
      }
    }
  }

  .contact.selected {
    background-color:#3b5998;
  }
}

.current-user {
  background-color: #ffffff39;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;

  .avatar {
    img {
      height: 4rem;
      max-inline-size: 100%;
    }
  }

  .username {
      color: white;
  }

  @media screen and (min-width: 720px) and (max-width: 1080px) {
    gap: 0.5rem;

    .username {
      h3 {
        font-size: 1rem;
      }
    }
  }
}
`

const GreenDot = styled.div`
  div{
    height:10px;
    width:10px;
    border-radius:50%;
    background-color: #00FF00;
  }

`
export default Contacts