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
            toast.error("Select an Avatar", toastOptions);
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
                toast.error("Error Setting Avatar. Please Try Again", toastOptions);
            }
        }
    }

    useEffect(()=>{
        if(!localStorage.getItem('chat-app-user')){
          navigate("/login");
        }
      },[])

    useEffect(() => {
        const data = [];
        for (let i = 0; i < 5; i++) {
            data.push(`https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.floor(Math.random() * 1000)}`);
        }
        setAvatars(data);
        setIsLoading(false);
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
                                    <img src={avatar} alt="avatar" />
                                </div>
                            ))}
                        </div>
                            <button className="submit-btn" onClick={setProfilePicture} disabled={loading}>
                            {loading ? <span className="spinner" /> : "Select Avatar"}
                            </button>
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
    // background-color: #131324;
    background-color: black;
    background-color: #2a2a2a; /* medium‑dark gray */
    background-image:
        radial-gradient(circle, #bbbbbb 1px, transparent 1px),
        radial-gradient(circle, #bbbbbb 1px, transparent 1px);
    background-size: 20px 20px;
    background-position: 0 0, 10px 10px;
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
            transition: none;
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
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 0.5rem;
        background-color: #4e0eff;
        color: white;
        padding: 1rem 2rem;
        border: none;
        border-radius: 0.5rem;
        cursor: pointer;
        transition: none;

        &:hover {
            background-color: #3a0ccc;
        }
    }

    .spinner {
        width: 20px;
        height: 20px;
        border: 3px solid rgba(255, 255, 255, 0.3);
        border-top: 3px solid #fff;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
        display: inline-block;
        vertical-align: middle;
    }



    @keyframes spin {
        to {
        transform: rotate(360deg);
        }
    }
`;
