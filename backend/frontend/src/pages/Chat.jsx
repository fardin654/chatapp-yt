import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { allUsersRoute, host } from "../utils/APIRoutes.js";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";
import ChatContainer from "../components/ChatContainer";
import { io } from "socket.io-client";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Chat() {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const socket = useRef();

  const toastOptions = {
    position: "bottom-right",
    autoClose: 5000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
    closeOnClick: true,
  };

  // detect screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 720);
    };
    handleResize(); // initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      if (!localStorage.getItem("chat-app-user")) {
        navigate("/login");
      } else {
        setCurrentUser(await JSON.parse(localStorage.getItem("chat-app-user")));
        setIsLoaded(true);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchContacts = async () => {
      if (currentUser) {
        if (currentUser.isAvatarImageSet) {
          const { data } = await axios.get(
            `${allUsersRoute}/${currentUser._id}`
          );
          setContacts(data);
        } else {
          navigate("/setAvatar");
        }
      }
    };
    fetchContacts();
  }, [currentUser]);

  function handleChatChange(chat) {
    setCurrentChat(chat);
  }

  function handleToggle(){
    console.log("Toggle clicked");
    setCurrentChat(undefined);
  }

  function handleToast(msg) {
    toast.info(`New Message From ${msg}`, toastOptions);
  }

  return (
    <Container>
      <div className="container">
        {/* Desktop / Tablet: Show both */}
        {!isMobileView && (
          <>
            <Contacts
              contacts={contacts}
              currentUser={currentUser}
              changeChat={handleChatChange}
              socket={socket}
            />
            {isLoaded && currentChat === undefined ? (
              <Welcome currentUser={currentUser} />
            ) : (
              <ChatContainer
                currentChat={currentChat}
                currentUser={currentUser}
                socket={socket}
                handleToggle = {handleToggle}
                handleToast= {handleToast}
              />
            )}
          </>
        )}

        {/* Mobile: Show either contacts or chat */}
        {isMobileView && (
          <>
            {currentChat ? (
              <ChatContainer
                currentChat={currentChat}
                currentUser={currentUser}
                socket={socket}
                handleToggle = {handleToggle} 
              />
            ) : (
              <Contacts
                contacts={contacts}
                currentUser={currentUser}
                changeChat={handleChatChange}
                socket={socket}
              />
            )}
          </>
        )}
      </div>
      <ToastContainer />
    </Container>
  );
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #1a1a2e;

  .container {
    border-radius: 15px;
    height: 92vh;
    width: 92vw;
    max-width: 1400px;
    max-height: 95vh;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    transition: all 0.3s ease-in-out;

    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }

    @media screen and (max-width: 719px) {
      display: block; /* stack in mobile */
      width: 98vw;
      height: 92vh;
    }
  }
`;

export default Chat;
