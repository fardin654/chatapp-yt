import React from "react";
import styled from "styled-components";
import Robot from "../assets/robot.gif";

// Material-UI imports
import {
  Typography,
  Box,
  Fade
} from '@mui/material';
import {
  Chat,
  EmojiPeople
} from '@mui/icons-material';

function Welcome({ currentUser }) {
  return (
    <Container>
      <Fade in={true} timeout={1000}>
        <ContentBox>
          <ImageContainer>
            <img src={Robot} alt="Robot" />
          </ImageContainer>
          
          <TextContainer>
            <Typography variant="h5" component="h5" color="white" fontWeight="600" gutterBottom>
              Welcome, <Username>{currentUser.username}!</Username>
            </Typography>
            
            <MessageContainer>
              <Chat sx={{ fontSize: 20, color: '#7b68ee', mr: 1 }} />
              <Typography variant="h6" color="rgba(255,255,255,0.8)">
                Select a chat to start messaging
              </Typography>
            </MessageContainer>
          </TextContainer>
          
          <HintContainer>
            <EmojiPeople sx={{ fontSize: 20, color: 'rgba(255,255,255,0.6)', mr: 1 }} />
            <Typography variant="body2" color="rgba(255,255,255,0.6)">
              Your conversations will appear here
            </Typography>
          </HintContainer>
        </ContentBox>
      </Fade>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 20px;
  background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
`;

const ContentBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 600px;
  padding: 30px;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
`;

const ImageContainer = styled.div`
  margin-bottom: 20px;
  
  img {
    height: 18rem;
    border-radius: 50%;
    box-shadow: 0 0 30px rgba(123, 104, 238, 0.4);
    
    @media (max-width: 768px) {
      height: 14rem;
    }
    
    @media (max-width: 480px) {
      height: 12rem;
    }
  }
`;

const TextContainer = styled.div`
  margin-bottom: 20px;
`;

const Username = styled.span`
  color: #7b68ee;
  text-shadow: 0 0 10px rgba(123, 104, 238, 0.5);
`;

const MessageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 15px;
  padding: 10px;
  background: rgba(123, 104, 238, 0.1);
  border-radius: 12px;
  border: 1px solid rgba(123, 104, 238, 0.2);
`;

const HintContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
  padding: 10px 15px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
`;

export default Welcome;