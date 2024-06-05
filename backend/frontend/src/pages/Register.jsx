import React,{useState,useEffect} from 'react';
import {Link,useNavigate} from "react-router-dom";
import styled from "styled-components";
import logo from "../assets/logo.svg";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import { registerRoute } from '../utils/APIRoutes.js';


function Register() {

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
          
            <button type="submit">Create User</button>
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
  gap: 1rem;
  align-items: center;
  // background-color: #131324;
  background-color: black;
  background-image: url("https://www.transparenttextures.com/patterns/45-degree-fabric-light.png");
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 5rem;
    }
    h1 {
      color: white;
      text-transform: uppercase;
    }
  }

  form {
    backdrop-filter: blur(5px);
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #00000076;
    border-radius: 2rem;
    padding: 3rem 5rem;
  }
  input {
    background-color: transparent;
    padding: 1rem;
    border: 0.1rem solid #4e0eff;
    border-radius: 0.4rem;
    color: white;
    width: 100%;
    font-size: 1rem;
    &:focus {
      border: 0.1rem solid #997af0;
      outline: none;
    }
  }
  button {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #4e0eff;
    }
  }
  span {
    color: white;
    text-transform: uppercase;
    a {
      color: #4e0eff;
      text-decoration: none;
      font-weight: bold;
    }
  }
`;

export default Register;
