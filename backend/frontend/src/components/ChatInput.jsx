import React, { useState, useRef, useEffect } from 'react';
import styled from "styled-components";
import Picker from 'emoji-picker-react';
import {IoMdSend} from "react-icons/io";
import MoodIcon from '@mui/icons-material/Mood';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import MicIcon from '@mui/icons-material/Mic';

function ChatInput({handleSendMessage}) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [msg, setMsg] = useState("");
  const emojiPickerRef = useRef();

  function handleEmojiPickerShow(){
    setShowEmojiPicker(!showEmojiPicker);
  }

  function handleEmojiClick(event){
    setMsg(prevMsg => prevMsg + event.emoji);
  }

  function sendChat(event){
    event.preventDefault();
    if(msg.trim().length > 0){
      handleSendMessage(msg);
      setMsg("");
    }
  }

  // Close emoji picker when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Container>
      <div className="input-wrapper">
        <div className="action-buttons">
          <button className="action-btn">
            <AttachFileIcon />
          </button>
          <button className="action-btn">
            <MicIcon />
          </button>
        </div>
        
        <form className="input-container" onSubmit={sendChat}>
          <div className="emoji" ref={emojiPickerRef}>
            <button type="button" className="emoji-btn" onClick={handleEmojiPickerShow}>
              <MoodIcon />
            </button>
            {showEmojiPicker && (
              <div className="emoji-picker-wrapper">
                <Picker onEmojiClick={handleEmojiClick} />
              </div>
            )}
          </div>
          
          <input 
            type="text" 
            placeholder="Type your message here" 
            value={msg} 
            onChange={(e) => setMsg(e.target.value)}
            onFocus={() => setShowEmojiPicker(false)}
          />
          
          <button type="submit" className="submit" disabled={!msg.trim()}>
            <SendIcon />
          </button>
        </form>
      </div>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.03);
  padding: 0.8rem 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);

  @media screen and (max-width: 768px) {
    padding: 0.6rem 1rem;
  }

  .input-wrapper {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 0.8rem;
  }

  .action-buttons {
    display: flex;
    gap: 0.5rem;

    .action-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      border: none;
      color: rgba(255, 255, 255, 0.7);
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 50%;
      transition: all 0.2s ease;

      &:hover {
        color: white;
        background: rgba(255, 255, 255, 0.1);
      }

      svg {
        font-size: 1.3rem;
      }
    }
  }

  .input-container {
    flex: 1;
    height: 3rem;
    border-radius: 24px;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(255, 255, 255, 0.08);
    padding: 0 0.8rem;
    transition: all 0.3s ease;
    position: relative;

    &:focus-within {
      background: rgba(255, 255, 255, 0.12);
      box-shadow: 0 0 0 2px rgba(59, 89, 152, 0.4);
    }
  }

  .emoji {
    position: relative;
    display: flex;
    align-items: center;

    .emoji-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      border: none;
      color: rgba(255, 255, 255, 0.7);
      cursor: pointer;
      padding: 0.3rem;
      border-radius: 50%;
      transition: all 0.2s ease;

      &:hover {
        color: white;
        background: rgba(255, 255, 255, 0.1);
      }

      svg {
        font-size: 1.4rem;
      }
    }

    .emoji-picker-wrapper {
      position: absolute;
      bottom: 100%;
      left: 0;
      z-index: 100;
      margin-bottom: 0.5rem;

      .emoji-picker-react {
        background: #1e1e2e;
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);

        .emoji-search {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: white;
          margin-bottom: 10px;
        }

        .emoji-categories {
          button {
            filter: contrast(0.6);
          }
        }

        .emoji-group:before {
          background: #1e1e2e;
          color: rgba(255, 255, 255, 0.7);
        }

        .emoji-scroll-wrapper::-webkit-scrollbar {
          width: 6px;
        }

        .emoji-scroll-wrapper::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 3px;
        }

        .emoji-scroll-wrapper::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }
      }
    }
  }

  input {
    flex: 1;
    background: transparent;
    border: none;
    color: white;
    font-size: 0.95rem;
    padding: 0.5rem 0;

    &::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }

    &:focus {
      outline: none;
    }
  }

  button.submit {
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${props => props.disabled ? 'rgba(59, 89, 152, 0.4)' : 'rgba(59, 89, 152, 0.8)'};
    border: none;
    color: white;
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
    padding: 0.5rem;
    border-radius: 50%;
    transition: all 0.2s ease;
    width: 2.2rem;
    height: 2.2rem;

    &:hover:not(:disabled) {
      background: rgba(59, 89, 152, 1);
      transform: scale(1.05);
    }

    svg {
      font-size: 1.1rem;
    }
  }

  @media screen and (max-width: 480px) {
    .action-buttons {
      display: none;
    }
    
    .input-container {
      height: 2.8rem;
    }
    
    input {
      font-size: 0.9rem;
    }
  }
`;
export default ChatInput;