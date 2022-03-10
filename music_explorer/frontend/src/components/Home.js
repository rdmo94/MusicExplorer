import React from "react";
import { Button } from "@material-ui/core";
import {useEffect, useState} from "react";
import { Navigate } from "react-router-dom";

function Home() {
    //let navigate = Navigate()
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    
    useEffect(() => {
        handleAuthentication();
    },[])

    async function handleAuthentication(){
        var authenticated = await checkIfAuthenticated()
        setIsAuthenticated(authenticated)
    }

    function checkIfAuthenticated(){
        return fetch("/spotify/is-authenticated")
        .then((response) => response.json())
        .then((data) => {
            console.log("is-authenticated", data)
            if (data.status){
              //authenticated
                return true
            } else {
              //not authenticated
                return false
            }
        });
      }
    
    function spotifyLogout(){
        return fetch("/spotify/logout").then(response => true)
    }

    function getSpotifyLoginUrl(){
        fetch("/spotify/get-auth-url")
        .then((response) => response.json())
        .then((data) => {
            console.log("spotify response data", data)
            window.location.href = data.url;
        });
    }

    function logoutSpotify() {
        spotifyLogout().then(response => window.location.href = "/")
        setIsAuthenticated(false)
    }

    return (
        <div>
        <h1>Homes page</h1>
        <Button variant="contained" onClick={isAuthenticated ? logoutSpotify : getSpotifyLoginUrl} >{isAuthenticated? "Logout": "Login"}</Button>
        {/* <Button variant="contained" onClick={getSpotifyLoginUrl} >{"Login"}</Button> */}
        </div>
    );
}

export default Home;
