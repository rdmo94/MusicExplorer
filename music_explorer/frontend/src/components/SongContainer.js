import React from "react";
import { useEffect } from "react";
import { Button, Grid, Typography, Box } from "@material-ui/core";
import { millisToMinutesAndSeconds } from "../Util";
import { primaryGrey } from "../Colors";

function SongContainer(props) {
  return (
    <Box onClick={() => {props.playSongCallback()}} variant="conained" sx={{"border" : `2px solid ${primaryGrey}`, "border-radius" : "200px", "padding" : "20px", "margin" : "5px"}}>
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Grid
          item
          direction="column"
          justifyContent="center"
          alignItems="flex-start"
        >
          <Grid item xs>
            <Typography style={{ fontWeight: "bold" }}>{props.song.title}</Typography>
          </Grid>
          <Grid item xs>
            <Typography>{props.song.artists.map((artist, index) => index+1 != props.song.artists.length ? artist + ", "  : artist)}</Typography>
          </Grid>
          <Grid item xs>
            <Typography>Genre:  {props.song.genre}</Typography>
          </Grid>
        </Grid>
        <Grid item>
          <Typography>
            {millisToMinutesAndSeconds(props.song.duration)}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
}

export default SongContainer;
