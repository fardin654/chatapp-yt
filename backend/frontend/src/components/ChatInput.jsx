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
        <div className="button-container">
            <div className="emoji">
                <MoodIcon onClick={handleEmojiPickerShow}/>
                {
                  showEmojiPicker && <Picker className="emoji-picker-react" onEmojiClick={handleEmojiClick}/>
                }
            </div>
        </div>
        <form className="input-container" onSubmit={sendChat}>
            <input type="text" placeholder="Type your message here" value={msg} onChange={(e)=>setMsg(e.target.value)}/>
            <button className="submit">
                <SendIcon/>
            </button>
        </form>
    </Container>
  )
}

const Container=styled.div`
display: grid;
align-items: center;
grid-template-columns: 5% 95%;
background-color: #080420;
padding: 0 2rem;
@media screen and (min-width: 720px) and (max-width: 1080px) {
  padding: 0 1rem;
  gap: 1rem;
}
.button-container {
  display: flex;
  align-items: center;
  color: white;
  gap: 1rem;
  .emoji {
    position: relative;
    svg {
      font-size: 2rem;
      color: white;
      cursor: pointer;
    }
    .emoji-picker-react {
      position: absolute;
      top: -470px;
      background-color: #080420;
      box-shadow: 0 5px 10px #9a86f3;
      border-color: #9a86f3;
      .emoji-scroll-wrapper::-webkit-scrollbar {
        background-color: #080420;
        width: 5px;
        &-thumb {
          background-color: #9a86f3;
        }
      }
      .emoji-categories {
        button {
          filter: contrast(0);
        }
      }
      .emoji-search {
        background-color: transparent;
        border-color: #9a86f3;
      }
      .emoji-group:before {
        background-color: #080420;
      }
    }
  }
}
.input-container {
  width: 100%;
  border-radius: 2rem;
  display: flex;
  align-items: center;
  gap: 2rem;
  background-color: #ffffff34;
  input {
    width: 90%;
    height: 60%;
    background-color: transparent;
    color: white;
    border: none;
    padding-left: 1rem;
    font-size: 1.2rem;

    &::selection {
      background-color: #9a86f3;
    }
    &:focus {
      outline: none;
    }
  }
  button {
    padding: 0.3rem 2rem;
    border-radius: 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: transparent;
    border: none;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      padding: 0.3rem 1rem;
      svg {
        font-size: 1rem;
      }
    }
    svg {
      font-size: 2rem;
      color: white;
    }
  }
}

`;

export default ChatInput;