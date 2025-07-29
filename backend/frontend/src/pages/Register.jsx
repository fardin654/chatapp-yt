import React,{useState,useEffect} from 'react';
import {Link,useNavigate} from "react-router-dom";
import styled from "styled-components";
import logo from "../assets/logo.svg";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import { registerRoute } from '../utils/APIRoutes.js';


function Register() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [values,setValues] = useState({
        username:"",
        email:"",
        password:"",
        confirmPassword:""
    });

    const toastOptions={
        position:"bottom-right",
        autoClose:5000,
        pauseOnHover:true,
        draggable:true,
        theme:"dark",
        closeOnClick:true,
    };

    useEffect(()=>{
      if(localStorage.getItem('chat-app-user')){
        navigate("/");
      }
    },[])

    async function handleSubmit(event){
        event.preventDefault();
        if(handleValidation()){
            setLoading(true);
            console.log("In Validation",registerRoute);
            const {username,email,password,confirmPassword} = values;
            const {data} = await axios.post(registerRoute,{
                username,
                email,
                password,
            });

            if(data.status===false){
              toast.error(data.msg,toastOptions);
            }
            if(data.status===true){
              localStorage.setItem('chat-app-user',JSON.stringify(data.user));
              navigate("/");
            }
        }
    }

    function handleValidation(event){
        const {username,email,password,confirmPassword} = values;

        if(username.length < 3){
            toast.error("Username should be greater than 3 characters.",
            toastOptions
            );
            return false;
        }else if(email===""){
            toast.error("Email is required.",
            toastOptions
            );
            return false;
        }else if(password.length < 8){
            toast.error("Password must be at least 8 characters.",
            toastOptions
            );
            return false;
        }else if(password!==confirmPassword){
            toast.error("Password and Confirm Password must be same.",
            toastOptions
            );
            return false;
        }else{
            return true;
        }

    }

    function handleChange(event){
        const {name,value}=event.target;
        setValues((prevValue)=>{return ({...prevValue,[name]:value})});
    }

  return (
    <>
    <FormContainer>
        <form onSubmit={handleSubmit}>
            <div className="brand">
                <img src={logo} alt="Logo"/>
                <h1>YouChat</h1>
            </div>
            <input 
                type="text"
                placeholder="Username" 
                name="username"
                onChange={handleChange}
                value={values.username}
                />
            <input 
                type="email"
                placeholder="Email" 
                name="email"
                onChange={handleChange}
                value={values.email}
                />
            <input 
                type="password"
                placeholder="Password" 
                name="password"
                onChange={handleChange}
                value={values.password}
                />
            <input 
                type="password"
                placeholder="Confirm Password"
                name="confirmPassword" 
                onChange={handleChange}
                value={values.confirmPassword}
                />
          
            <button type="submit" disabled={loading}>{loading ? <span className="spinner"></span> : "Create User"}</button>
            <span>Already Have an Account?<a href="/login">Login</a>
</span>
        </form>
    </FormContainer>
    <ToastContainer/>
    </>
  )
}

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #1f1f1f;
  background-image:
    radial-gradient(circle, #444 1px, transparent 1px),
    radial-gradient(circle, #444 1px, transparent 1px);
  background-size: 30px 30px;
  background-position: 0 0, 15px 15px;

  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 4rem;
    }
    h1 {
      color: #ffffff;
      text-transform: uppercase;
      font-size: 2rem;
      letter-spacing: 2px;
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
    border-radius: 1.5rem;
    padding: 3rem 4rem;
    width: 90%;
    max-width: 400px;
  }

  input {
    background-color: rgba(255, 255, 255, 0.05);
    padding: 1rem;
    border: 1px solid #4e0eff;
    border-radius: 0.5rem;
    color: white;
    font-size: 1rem;
    transition: all 0.3s ease-in-out;
    &:focus {
      border-color: #997af0;
      outline: none;
      background-color: rgba(255, 255, 255, 0.08);
    }
  }

  button {
    background: linear-gradient(to right, #4e0eff, #997af0);
    color: white;
    padding: 1rem;
    border: none;
    border-radius: 0.5rem;
    font-weight: bold;
    font-size: 1rem;
    cursor: pointer;
    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    text-transform: uppercase;
    &:hover {
      transform: scale(1.03);
      box-shadow: 0 0 12px #4e0effa6;
    }
  }

  span {
    color: #ddd;
    text-align: center;
    text-transform: uppercase;
    font-size: 0.9rem;
    a {
      color: #4e0eff;
      text-decoration: none;
      font-weight: bold;
      margin-left: 0.3rem;
      &:hover {
        text-decoration: underline;
      }
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
  }


  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }


  @media screen and (max-width: 480px) {
    form {
      padding: 2rem;
    }
    .brand h1 {
      font-size: 1.5rem;
    }
  }
`;



export default Register;
