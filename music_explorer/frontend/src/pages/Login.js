import { Grid, Typography } from "@material-ui/core";
import LoginButton from "../components/LoginButton";
import React from "react";

function Login() {
  
  return (
    <div >
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        style={{ minHeight: "100vh" }}
      >
        <Grid item>
          <Typography
            variant="h3"
            style={{ fontWeight: "bold", textAlign: "center", color: "white" }}
          >
            Welcome to MusicXplorer!
          </Typography>
          <Typography variant="h4" style={{color: "white"}}>
            Sign in with your Spotify account to start exploring.
          </Typography>
        </Grid>
        <Grid item>
          <LoginButton />
        </Grid>
      </Grid>
    </div>
  );
}

export default Login;
