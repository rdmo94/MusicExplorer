import React from "react";
import { Container, Box, Grid } from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";
import Strategies from "../components/Strategies";
import Graph from "./Graph";
import PlaylistScreen from "./PlaylistScreen";
import Playlists from "./Playlists";

//grid components style
const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
}));

function Dashboard() {
  return (
    <Grid
      container
      direction="row"
      spacing={0.5}
      justifyContent="space-evenly"
      alignItems="stretch"
    >
      <Grid item xs={3}>
        <Container disableGutters={true}>
          <Box sx={{ bgcolor: "#979797", height: "100vh" }} >
            <Playlists/>
          </Box>
        </Container>
      </Grid>
      <Grid item xs={6}>
        <Container disableGutters={true}>
          <Box sx={{ bgcolor: "#979797", height: "100vh" }}>{Graph()}</Box>
        </Container>
      </Grid>
      <Grid item xs={3}>
        <Container disableGutters={true}>{Strategies()}</Container>
      </Grid>
    </Grid>
  );
}

export default Dashboard;
