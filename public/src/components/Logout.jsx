import React from 'react'; 
import styled from "styled-components";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import LogoutIcon from '@mui/icons-material/Logout';
import {io} from "socket.io-client";
import { host } from "../utils/APIRoutes";

function Logout({currentUser}) {
    const navigate=useNavigate();
    async function handleClick(){
        localStorage.clear();
        const socket = io(host);
        socket.emit("logout",currentUser);
        navigate('/login');

    }
  return (
    <Button onClick={handleClick}>
      <LogoutIcon/>
    </Button>
  );
}

const Button = styled.button`
display: flex;
justify-content: center;
align-items: center;
padding: 0.5rem;
border-radius: 0.5rem;
background-color: transparent;
border: none;
cursor: pointer;
svg {
  font-size: 1.3rem;
  color: #ebe7ff;
}
    `;

export default Logout