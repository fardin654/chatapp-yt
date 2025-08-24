import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import logo from "../assets/logo.svg";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import { registerRoute } from '../utils/APIRoutes.js';

// Material-UI imports
import {
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  InputAdornment,
  IconButton,
  Divider,
  Fade
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Person,
  Lock,
  Email,
  HowToReg
} from '@mui/icons-material';

function Register() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const toastOptions = {
    position: "bottom-right",
    autoClose: 5000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
    closeOnClick: true,
  };

  useEffect(() => {
    if (localStorage.getItem('chat-app-user')) {
      navigate("/");
    }
  }, []);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);

  async function handleSubmit(event) {
    event.preventDefault();
    if (handleValidation()) {
      setLoading(true);
      const { username, email, password } = values;
      const { data } = await axios.post(registerRoute, {
        username,
        email,
        password,
      });

      if (data.status === false) {
        toast.error(data.msg, toastOptions);
        setLoading(false);
      }
      if (data.status === true) {
        localStorage.setItem('chat-app-user', JSON.stringify(data.user));
        navigate("/");
      }
    }
  }

  function handleValidation() {
    const { username, email, password, confirmPassword } = values;

    if (username.length < 3) {
      toast.error("Username should be greater than 3 characters.", toastOptions);
      return false;
    } else if (email === "") {
      toast.error("Email is required.", toastOptions);
      return false;
    } else if (password.length < 8) {
      toast.error("Password must be at least 8 characters.", toastOptions);
      return false;
    } else if (password !== confirmPassword) {
      toast.error("Password and Confirm Password must be same.", toastOptions);
      return false;
    } else {
      return true;
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((prevValue) => { return ({ ...prevValue, [name]: value }) });
  }

  return (
    <>
      <FormContainer>
        <Fade in={true} timeout={800}>
          <FormBox>
            <BrandContainer>
              <LogoContainer>
                <Logo src={logo} alt="YouChat Logo" />
                <Typography variant="h3" component="h3" color="white" fontWeight="500" gutterBottom sx={{ fontSize: '1.8rem'}}>
                  YouChat
                </Typography>
              </LogoContainer>
            </BrandContainer>

            <Form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Username"
                name="username"
                value={values.username}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                required
                helperText="Must be at least 3 characters"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person sx={{ color: 'rgba(255,255,255,0.5)' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    borderRadius: 2,
                    backgroundColor: 'rgba(255, 255, 255, 0.07)',
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                    },
                    '&:hover fieldset': {
                      borderColor: '#7b68ee',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#7b68ee',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255,255,255,0.6)',
                  },
                  '& .MuiFormHelperText-root': {
                    color: 'rgba(255,255,255,0.5)',
                  },
                }}
              />

              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={values.email}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: 'rgba(255,255,255,0.5)' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    borderRadius: 2,
                    backgroundColor: 'rgba(255, 255, 255, 0.07)',
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                    },
                    '&:hover fieldset': {
                      borderColor: '#7b68ee',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#7b68ee',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255,255,255,0.6)',
                  },
                }}
              />

              <TextField
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={values.password}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                required
                helperText="Must be at least 8 characters"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: 'rgba(255,255,255,0.5)' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                        sx={{ color: 'rgba(255,255,255,0.5)' }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    borderRadius: 2,
                    backgroundColor: 'rgba(255, 255, 255, 0.07)',
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                    },
                    '&:hover fieldset': {
                      borderColor: '#7b68ee',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#7b68ee',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255,255,255,0.6)',
                  },
                  '& .MuiFormHelperText-root': {
                    color: 'rgba(255,255,255,0.5)',
                  },
                }}
              />

              <TextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={values.confirmPassword}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: 'rgba(255,255,255,0.5)' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle confirm password visibility"
                        onClick={handleClickShowConfirmPassword}
                        edge="end"
                        sx={{ color: 'rgba(255,255,255,0.5)' }}
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    borderRadius: 2,
                    backgroundColor: 'rgba(255, 255, 255, 0.07)',
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                    },
                    '&:hover fieldset': {
                      borderColor: '#7b68ee',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#7b68ee',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255,255,255,0.6)',
                  },
                }}
              />

              <RegisterButton
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                size="large"
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  <>
                    <HowToReg sx={{ mr: 1 }} />
                    Create Account
                  </>
                )}
              </RegisterButton>


              <LoginContainer>
                <Typography variant="body2" color="rgba(255,255,255,0.7)">
                  Already have an account?
                <LoginLink to="/login">
                  Login
                </LoginLink>
                </Typography>
              </LoginContainer>
            </Form>
          </FormBox>
        </Fade>
      </FormContainer>
      <ToastContainer />
    </>
  )
}

// Styled components
const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
  padding: 20px;
`;

const FormBox = styled.div`
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 40px;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  max-height: 95vh;

`;


const BrandContainer = styled.div`
  text-align: center;
  margin-bottom: 10px;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 8px;
`;

const Logo = styled.img`
  height: 50px;
  width: 50px;
  filter: drop-shadow(0 0 8px rgba(123, 104, 238, 0.6));
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const RegisterButton = styled(Button)`
  && {
    background: linear-gradient(45deg, #7b68ee 0%, #6a5acd 100%);
    border-radius: 12px;
    padding: 12px;
    font-weight: 600;
    text-transform: none;
    font-size: 1.1rem;
    margin-top: 10px;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 7px 14px rgba(123, 104, 238, 0.4);
      background: linear-gradient(45deg, #6a5acd 0%, #7b68ee 100%);
    }

    &:disabled {
      background: rgba(255, 255, 255, 0.1);
    }
  }
`;

const LoginContainer = styled.div`
  text-align: center;
  margin-top: 10px;
`;

const LoginLink = styled(Link)`
  color: #7b68ee;
  text-decoration: none;
  font-weight: 600;
  margin-left: 5px;
  transition: all 0.2s ease;

  &:hover {
    color: #9b87f8;
    text-decoration: underline;
  }
`;

export default Register;