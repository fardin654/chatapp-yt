import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import loader from '../assets/loader.gif';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { setAvatarRoute } from '../utils/APIRoutes.js';
import { Buffer } from 'buffer';

export default function SetAvatar() {
    const api = 'https://api.multiavatar.com/45678945';
    const navigate = useNavigate();
    const [avatars, setAvatars] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedAvatar, setSelectedAvatar] = useState(undefined);

    const toastOptions = {
        position: "bottom-right",
        autoClose: 5000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
        closeOnClick: true,
    };

    async function setProfilePicture(){
        if(selectedAvatar===undefined){
            toast.error("Select an Avatar",toastOptions);
        }else{
            const user = await JSON.parse(localStorage.getItem("chat-app-user"));
            const {data} = await axios.post(`${setAvatarRoute}/${user._id}`,{
                image:avatars[selectedAvatar],
            });
            if(data.isSet){
                user.isAvatarImageSet = true;
                user.avatarImage = data.image;
                localStorage.setItem("chat-app-user",JSON.stringify(user));
                navigate("/");
            }else{
                toast.error("Error Setting Avatar. Please Try Again",toastOptions);
            }
        }
    }

    useEffect(()=>{
        if(!localStorage.getItem('chat-app-user')){
          navigate("/login");
        }
      },[])

    useEffect(() => {
        const fetchAvatars = async () => {
            const data = [];
            for (let i = 0; i < 5; i++) {
                const response = await axios.get(`${api}/${Math.round(Math.random() * 1000)}`);
                const buffer = Buffer.from(response.data);
                data.push(buffer.toString("base64"));
            }
            setAvatars(data);
            setIsLoading(false);
        };

        fetchAvatars();
    }, []);

    return (
        <>
            <Container>
                <div className="title-container">
                    <h1>Pick an Avatar for your profile</h1>
                </div>
                {isLoading ? (
                    <img src={loader} alt="loader" className="loader" />
                ) : (
                    <>
                        <div className="avatars">
                            {avatars.map((avatar, index) => (
                                <div
                                    key={index}
                                    className={`avatar ${selectedAvatar === index ? 'selected' : ''}`}
                                    onClick={() => setSelectedAvatar(index)}
                                >
                                    <img src={`data:image/svg+xml;base64,${avatar}`} alt="avatar" />
                                </div>
                            ))}
                        </div>
                        <button className="submit-btn" onClick={setProfilePicture}>Select Avatar</button>
                    </>
                )}
            </Container>
            <ToastContainer />
        </>
    );
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2rem;
    height: 100vh;
    width: 100vw;
    background-color: #131324;

    .title-container {
        h1 {
            color: white;
        }
    }

    .avatars {
        display: flex;
        gap: 2rem;

        .avatar {
            border: 0.4rem solid transparent;
            padding: 0.4rem;
            border-radius: 5rem;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: 0.5s ease-in-out;
            cursor: pointer;

            img {
                height: 6rem;
            }
        }

        .selected {
            border: 0.4rem solid #4e0eff;
        }
    }

    .loader {
        height: 6rem;
    }
    button {
        background-color: #4e0eff;
        color: white;
        padding: 1rem 2rem;
        border: none;
        border-radius: 0.5rem;
        cursor: pointer;
        transition: 0.3s ease-in-out;

        &:hover {
            background-color: #3a0ccc;
        }
    }
`;
