import React from "react";
import { Button, CssBaseline } from "@material-ui/core";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Dashboard from "./Dashboard";
import "../../static/css/styles.css";
import Login from "./Login";
import { createTheme } from "@mui/material";
function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    handleAuthentication();
  }, []);

  async function handleAuthentication() {
    var authenticated = await checkIfAuthenticated();
    setIsAuthenticated(authenticated);
  }

  function checkIfAuthenticated() {
    //Automatically updates the token, if it has expired
    return fetch("/spotify/is-authenticated")
      .then((response) => response.json())
      .then((data) => {
        if (data.status) {
          //authenticated
          return true;
        } else {
          //not authenticated
          //Try to update
          return false;
        }
      });
  }

  function spotifyLogout() {
    return fetch("/spotify/logout").then((response) => true);
  }

  function logoutSpotify() {
    spotifyLogout().then((response) => (window.location.href = "/"));
    setIsAuthenticated(false);
  }
  
  

  return (
     <div className="main">{isAuthenticated === true ? <Dashboard /> : isAuthenticated === false ? <Login/> : <></>}</div>
  );
}

export default Home;
