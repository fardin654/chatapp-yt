import React, { useState } from 'react'; 
import styled from "styled-components";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import LogoutIcon from '@mui/icons-material/Logout';
import {io} from "socket.io-client";
import { host } from "../utils/APIRoutes";

function Logout({currentUser}) {
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    async function handleClick(){
        setIsLoggingOut(true);
        try {
            localStorage.clear();
            const socket = io(host);
            socket.emit("logout", currentUser);
            navigate('/login');
        } catch (error) {
            console.error("Logout error:", error);
            setIsLoggingOut(false);
        }
    }

    return (
        <Button 
            onClick={handleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            disabled={isLoggingOut}
            className={isHovered ? "hovered" : ""}
            aria-label="Logout"
        >
            <LogoutIcon />
            {isHovered && <Tooltip>Logout</Tooltip>}
            {isLoggingOut && <LoadingSpinner />}
        </Button>
    );
}

const Button = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    padding: 0.6rem;
    border-radius: 50%;
    background-color: transparent;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-left: 0.5rem;
    
    svg {
        font-size: 1.4rem;
        color: rgba(255, 255, 255, 0.7);
        transition: all 0.3s ease;
    }
    
    &:hover:not(:disabled) {
        background-color: rgba(255, 255, 255, 0.1);
        
        svg {
            color: #ff4757;
            transform: scale(1.1);
        }
    }
    
    &:active:not(:disabled) {
        transform: scale(0.95);
    }
    
    &:disabled {
        cursor: not-allowed;
        opacity: 0.7;
    }
    
    &.hovered {
        background-color: rgba(255, 255, 255, 0.08);
    }
    
    @media screen and (max-width: 768px) {
        padding: 0.5rem;
        
        svg {
            font-size: 1.2rem;
        }
    }
    
    @media screen and (max-width: 480px) {
        padding: 0.4rem;
        margin-left: 0.3rem;
        
        svg {
            font-size: 1.1rem;
        }
    }
`;

const Tooltip = styled.span`
    position: absolute;
    top: -35px;
    left: 50%;
    transform: translateX(-50%);
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 0.4rem 0.8rem;
    border-radius: 4px;
    font-size: 0.8rem;
    white-space: nowrap;
    z-index: 1000;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    
    &::after {
        content: '';
        position: absolute;
        bottom: -5px;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-top: 5px solid rgba(0, 0, 0, 0.8);
    }
    
    @media screen and (max-width: 480px) {
        font-size: 0.7rem;
        padding: 0.3rem 0.6rem;
        top: -30px;
    }
`;

const LoadingSpinner = styled.div`
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top: 2px solid #ff4757;
    animation: spin 1s linear infinite;
    position: absolute;
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    @media screen and (max-width: 480px) {
        width: 14px;
        height: 14px;
    }
`;

export default Logout;