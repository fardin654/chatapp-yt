import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { setAvatarRoute } from '../utils/APIRoutes.js';
import { Buffer } from 'buffer';

// Material-UI imports
import {
  Typography,
  Button,
  Box,
  CircularProgress,
  Fade,
  IconButton
} from '@mui/material';
import {
  Refresh,
  CheckCircle,
  AccountCircle
} from '@mui/icons-material';

export default function SetAvatar() {
    const api = 'https://api.multiavatar.com/45678945';
    const navigate = useNavigate();
    const [avatars, setAvatars] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedAvatar, setSelectedAvatar] = useState(undefined);
    const [loading, setLoading] = useState(false);

    const toastOptions = {
        position: "bottom-right",
        autoClose: 5000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
        closeOnClick: true,
    };

    async function setProfilePicture() {
        if (selectedAvatar === undefined) {
            toast.error("Please select an avatar", toastOptions);
        } else {
            setLoading(true);
            const user = await JSON.parse(localStorage.getItem("chat-app-user"));
            
            const svgResponse = await axios.get(avatars[selectedAvatar], {
                responseType: 'text',
            });
            const base64Image = Buffer.from(svgResponse.data).toString('base64');

            const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
                image: base64Image,
            });

            if (data.isSet) {
                user.isAvatarImageSet = true;
                user.avatarImage = data.image;
                localStorage.setItem("chat-app-user", JSON.stringify(user));
                navigate("/");
            } else {
                toast.error("Error setting avatar. Please try again.", toastOptions);
            }
        }
    }

    useEffect(()=>{
        if(!localStorage.getItem('chat-app-user')){
          navigate("/login");
        }
      },[])

    useEffect(() => {
        generateAvatars();
    }, []);

    const generateAvatars = () => {
        setIsLoading(true);
        const data = [];
        for (let i = 0; i < 6; i++) {
            data.push(`https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.floor(Math.random() * 1000)}`);
        }
        setAvatars(data);
        setSelectedAvatar(undefined);
        setTimeout(() => setIsLoading(false), 500);
    };

    return (
        <>
            <Container>
                <Fade in={true} timeout={800}>
                    <ContentBox>
                        <TitleContainer>
                        <Typography variant="h3" component="h3" color="white" fontWeight="700" gutterBottom sx={{ fontSize: '1.8rem'}}>
                                Choose Your Avatar
                            </Typography>
                        </TitleContainer>

                        {isLoading ? (
                            <LoaderContainer>
                                <CircularProgress size={60} thickness={4} sx={{ color: '#7b68ee' }} />
                            </LoaderContainer>
                        ) : (
                            <>
                                <AvatarsContainer>
                                    {avatars.map((avatar, index) => (
                                        <AvatarItem 
                                            key={index}
                                            className={selectedAvatar === index ? 'selected' : ''}
                                            onClick={() => setSelectedAvatar(index)}
                                        >
                                            <AvatarImage src={avatar} alt="avatar" className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full" />
                                            {selectedAvatar === index && (
                                                <SelectedIndicator>
                                                    <CheckCircle sx={{ fontSize: 30, color: '#7b68ee' }} />
                                                </SelectedIndicator>
                                            )}
                                        </AvatarItem>
                                    ))}
                                </AvatarsContainer>

                                <ButtonsContainer>
                                    <SelectButton
                                        variant="contained"
                                        onClick={setProfilePicture}
                                        disabled={loading || selectedAvatar === undefined}
                                        fullWidth
                                    >
                                        {loading ? (
                                            <CircularProgress size={24} color="inherit" />
                                        ) : (
                                            "Set as Profile"
                                        )}
                                    </SelectButton>
                                    
                                    <RefreshButton
                                        variant="outlined"
                                        onClick={generateAvatars}
                                        startIcon={<Refresh />}
                                    >
                                        Generate New Avatars
                                    </RefreshButton>
                                </ButtonsContainer>
                            </>
                        )}
                    </ContentBox>
                </Fade>
            </Container>
            <ToastContainer />
        </>
    );
}

// Styled components
const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 10px;
    background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
`;

const ContentBox = styled.div`
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    padding: 40px;
    padding-top: 20px;
    width: 100%;
    max-width: 700px;
    max-height: 95vh;
    overflow-y: auto; 
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.1);
    text-align: center;

    scroll-behavior: smooth;

    scrollbar-width: thin;
    scrollbar-color: #7b68ee rgba(255, 255, 255, 0.1);
    }

    .container::-webkit-scrollbar {
    width: 8px; /* thin scrollbar */
    }

    .container::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 10px;
    }

    .container::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, #7b68ee, #9a8df0);
    border-radius: 10px;
    }

    .container::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(180deg, #6a5acd, #8579e6);
    }

    @media (max-width: 768px) {
        padding: 20px;
        max-width: 90%;
    }

    @media (max-width: 480px) {
       padding: 15px;
       border-radius: 15px;
   }
`;

const TitleContainer = styled.div`
    margin-bottom: 20px;
`;

const LoaderContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px;
`;

const AvatarsContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 20px;
    margin-bottom: 40px;

    @media (max-width: 600px) {
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
    }

    @media (max-width: 400px) {
       grid-template-columns: 1fr;   
   }
`;

const AvatarItem = styled.div`
    position: relative;
    border-radius: 50%;
    padding: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 3px solid transparent;
    
    &:hover {
        transform: scale(1.05);
        border-color: rgba(123, 104, 238, 0.5);
    }
    
    &.selected {
        border-color: #7b68ee;
        box-shadow: 0 0 20px rgba(123, 104, 238, 0.5);
    }
`;

const AvatarImage = styled.img`
    width: 120px;
    height: 120px;
    border-radius: 50%;
    aspect-ratio: 1/1;
    border: 2px solid white;

    @media (max-width: 480px) {
       width: 80%;
    }

    @media (max-width: 768px) {
       width: 100px;
       height: 100px;
    }
 
    @media (max-width: 480px) {
       width: 80px;
       height: 80px;
    }
 
    @media (max-width: 360px) {
       width: 65px;
       height: 65px;
    }
`;

const SelectedIndicator = styled.div`
    position: absolute;
    top: -5px;
    right: -5px;
    background: white;
    border-radius: 50%;
    padding: 2px;
`;

const ButtonsContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 15px;
    max-width: 300px;
    margin: 0 auto;

    @media (max-width: 480px) {
       width: 100%;
       gap: 10px;
    }
`;

const SelectButton = styled(Button)`
    && {
        background: linear-gradient(45deg, #7b68ee 0%, #6a5acd 100%);
        border-radius: 12px;
        padding: 12px;
        font-weight: 600;
        text-transform: none;
        font-size: 1.1rem;
        transition: all 0.3s ease;

        &:hover {
            transform: translateY(-2px);
            box-shadow: 0 7px 14px rgba(123, 104, 238, 0.4);
            background: linear-gradient(45deg, #6a5acd 0%, #7b68ee 100%);
        }

        &:disabled {
            background: rgba(255, 255, 255, 0.1);
            color: rgba(255, 255, 255, 0.3);
        }
    }
`;

const RefreshButton = styled(Button)`
    && {
        color: #7b68ee;
        border-color: #7b68ee;
        border-radius: 12px;
        padding: 10px;
        font-weight: 600;
        text-transform: none;
        transition: all 0.3s ease;

        &:hover {
            background-color: rgba(123, 104, 238, 0.1);
            border-color: #9b87f8;
            color: #9b87f8;
            transform: translateY(-2px);
        }
    }
`;