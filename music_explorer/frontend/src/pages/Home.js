import React from "react";
import { Button, CssBaseline } from "@material-ui/core";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Dashboard from "./Dashboard";
import "../../static/css/styles.css";
import Login from "./Login";
import { createTheme } from "@mui/material";
function Home() {
  //let navigate = Navigate()
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    handleAuthentication();
  }, []);

  async function handleAuthentication() {
    var authenticated = await checkIfAuthenticated();
    setIsAuthenticated(authenticated);
  }

  function checkIfAuthenticated() {
    return fetch("/spotify/is-authenticated")
      .then((response) => response.json())
      .then((data) => {
        if (data.status) {
          //authenticated
          return true;
        } else {
          //not authenticated
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
     <div className="main">{isAuthenticated ? <Dashboard /> : <Login />}</div>
  
    // <div>

    // <h1>Homes page</h1>
    // <Button variant="contained" onClick={isAuthenticated ? logoutSpotify : getSpotifyLoginUrl} >{isAuthenticated? "Logout": "Login"}</Button>
    // {/* <Button variant="contained" onClick={getSpotifyLoginUrl} >{"Login"}</Button> */}
    // </div>
  );
}

export default Home;
