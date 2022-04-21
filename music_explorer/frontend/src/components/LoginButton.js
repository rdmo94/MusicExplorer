import { Button, ButtonBase, Typography, Grid, CircularProgress } from "@material-ui/core";
import { useEffect, useState } from "react";
import React from "react";
import { Icon } from "@iconify/react";
import { primaryGreen } from "../Colors";


function LoginButton(props) {
  const [userState, setUserState] = useState(null);
  const [loading, setLoading] = useState(false);

  function getSpotifyLoginUrl() {
    fetch("/spotify/get-auth-url")
      .then((response) => response.json())
      .then((data) => {
        console.log("spotify response data", data);
        window.location.href = data.url;
        setLoading(false);
      });
  }

  useEffect(() => {
    fetch("/spotify/is-authenticated").then((response) => {
        console.log(response);
        response.json().then((data) => {
          console.log(data);
        });
    }
    );
  }, []);
  return (
    <Grid container direction="column" justifyContent="center" alignItems="center" style={{padding: 100}}>
      <Button
        variant="contained"
        style={{ borderRadius: 200, backgroundColor: primaryGreen, paddingLeft: 40, paddingRight: 40, paddingTop: 20, paddingBottom: 20}}
        endIcon={<Icon icon="mdi:spotify" color="white" />}
        onClick={() => {
         setLoading(true);
         getSpotifyLoginUrl();
        }}
      >
        <Typography variant="body1" style={{color: "white"}}>Login</Typography>
      </Button>
      {loading ? <CircularProgress style={{height: 20, width: 20 ,margin: 50}}/> : <div style={{height: 20, width: 20, margin: 50}}></div>}
    </Grid>
  );
}

export default LoginButton;
