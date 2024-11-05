import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Button } from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";
import "./Header.css";
import {useHistory } from "react-router-dom";
// import { Logout } from "@mui/icons-material";

const Header = ({ children, hasHiddenAuthButtons }) => {
  let username
  username = window.localStorage.getItem("username") ? (window.localStorage.getItem("username")) : null
  const history = useHistory();

function logout(e){
  e.preventDefault()
  window.localStorage.clear()
  window.location.reload()
  // window.location.href = "/"
}

function redirectToLogin (e){
  console.log(e)
  e.preventDefault()
  if(e.target.id === "login"){
    history.push("/login")  
  } if (e.target.id === "register"){
    history.push("/register")  
  } if(e.target.id === "explore"){
    history.push("/")
  }
}


if(hasHiddenAuthButtons){
  // HEADER FOR LOGIN AND REGISTER PAGE
  return (
    <Box className="header">
        <Box className="header-title">
            <img src="logo_light.svg" alt="QKart-icon"></img>
        </Box>
          <Button 
          className="explore-button"
          startIcon={<ArrowBackIcon />}
          variant="text"
          id="explore" onClick={(e)=>redirectToLogin(e)}
        >
          Back to explore
        </Button>
      </Box>
  )
} if (!hasHiddenAuthButtons && window.localStorage.getItem("token") === null){
  // HEADER FOR HOMEPAGE AND NO LOCAL STORAGE (NOT LOGGED IN)
  return (
  <Box className="header">
  <Box className="header-title">
      <img src="logo_light.svg" alt="QKart-icon"></img>
  </Box>
  <Box>{children}</Box>
  <Box>
    <Button id="login" onClick={(e)=>redirectToLogin(e)}
  >
    Login
  </Button>
    <Button
    variant="contained" className="button" id="register" onClick={(e)=>redirectToLogin(e)}
  >
       Register
  
  </Button>
  </Box>
</Box> )
} 
if(window.localStorage.getItem("token") !== null){
    // HEADER FOR LOCAL STORAGE (LOGGED IN)
  return (
  <Box className="header">
  <Box className="header-title">
      <img src="logo_light.svg" alt="QKart-icon"></img>
  </Box>
  <Box>{children}</Box>
  <Box>
    {/* <Stack direction="row" spacing={2}> */}
    <Button>
    <img src="avatar.png" alt={username} className="userImg"></img>
    {username}
    </Button>
    <Button
    variant="text" onClick={(e)=>logout(e)}
  >
    Logout  
  </Button>
  {/* </Stack> */}
  </Box>
</Box>)
}

};

export default Header;
