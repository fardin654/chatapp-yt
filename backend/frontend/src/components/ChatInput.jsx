import React,{useState} from 'react';
import styled from "styled-components";
import Picker from 'emoji-picker-react';
import {IoMdSend} from "react-icons/io";
import MoodIcon from '@mui/icons-material/Mood';
import SendIcon from '@mui/icons-material/Send';

function ChatInput({handleSendMessage}) {
  const [showEmojiPicker,setShowEmojiPicker]=useState(false);
  const [msg,setMsg]=useState("");

  function handleEmojiPickerShow(){
    setShowEmojiPicker(!showEmojiPicker);
  }

  function handleEmojiClick(event){
    let message = msg;
    message+=event.emoji;
    setMsg(message);
  }

  function sendChat(event){
    event.preventDefault();
    if(msg.length>0){
      handleSendMessage(msg);
      setMsg("");
    }
  }
  
  return (
    <Container>
        <form className="input-container" onSubmit={sendChat}>
          <div className="emoji">
            <MoodIcon onClick={handleEmojiPickerShow}/>
            {showEmojiPicker && <Picker className="emoji-picker-react" onEmojiClick={handleEmojiClick}/>}
          </div>
          <input type="text" placeholder="Type your message here" value={msg} onChange={(e)=>setMsg(e.target.value)}/>
          <button className="submit">
            <SendIcon/>
          </button>
        </form>

    </Container>
  )
}

const Container = styled.div`
  /* 🎨 CSS Variables for easy theming and consistency */
  --primary-color: #9a86f3;
  --primary-color-hover: #7c6ee7;
  --bg-dark: #080420;
  --bg-picker: #0b0523;
  --bg-input: #ffffff24;
  --text-color: #ffffff;
  --placeholder-color: #ccc;
  --shadow-color: #9a86f3aa;
  --input-height: 2.8rem;

  display: flex;
  align-items: center;
  background-color: var(--bg-dark);
  padding: 0.5rem 2rem;
  position: relative;
  bottom:0.2rem;

  @media screen and (max-width: 720px) {
    padding: 0.5rem 1rem;
  }

  .input-container {
    width: 100%;
    height: var(--input-height);
    border-radius: 2rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    background-color:white;
    padding: 0 0.5rem 0 1rem;
    transition: box-shadow 0.3s ease;

    /* ✨ Improved accessibility with a clear focus state on the entire input area */
    &:focus-within {
      box-shadow: 0 0 0 2px var(--primary-color);
    }
  }

  .emoji {
    position: relative;
    display: flex;
    align-items: center;

    svg {
      font-size: 1.5rem;
      color: black;
      cursor: pointer;
      transition: transform 0.2s ease-in-out;

      &:hover {
        transform: scale(1.1);
      }
    }

    /* Targeting the picker via its wrapper for better style encapsulation */
    .emoji-picker-react {
      position: absolute;
      bottom: 50px; /* More space from the input */
      background-color: var(--bg-picker);
      box-shadow: 0 5px 15px var(--shadow-color);
      border: 1px solid var(--primary-color);
      border-radius: 10px;
      z-index: 10;
      
      /* Consistent scrollbar styling */
      .emoji-scroll-wrapper::-webkit-scrollbar {
        width: 5px;
        background-color: var(--bg-picker);
        &-thumb {
          background-color: var(--primary-color);
          border-radius: 5px;
        }
      }

      .emoji-categories button {
        filter: contrast(0.5);
      }

      .emoji-search {
        background-color: transparent;
        border: 1px solid var(--primary-color);
        color: var(--text-color);
      }

      .emoji-group:before {
        background-color: var(--bg-picker);
      }
    }
  }

  input {
    flex: 1;
    background-color: transparent;
    color: var(--text-color);
    border: none;
    font-size: 1.1rem;
    padding: 0.4rem 0;
    color: black;

    &::selection {
      background-color: var(--primary-color);
    }
    &:focus {
      outline: none; /* Focus is now handled by .input-container:focus-within */
    }
    &::placeholder {
      color: #555;
    }
  }

  button.submit {
    width: var(--input-height);
    height: var(--input-height);
    padding: 0;
    border-radius: 50%;
    background-color: var(--primary-color);
    border: none;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: background-color 0.0s ease;
    position: relative;
    left:0.5rem;

    &:hover {
      background-color: var(--primary-color-hover);
    }

    svg {
      font-size: 1.3rem;
      color: var(--text-color);
    }

    @media screen and (max-width: 720px) {
      svg {
        font-size: 1.1rem;
      }
    }
  }
`;
export default ChatInput;