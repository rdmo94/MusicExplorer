import React from "react";
import { useEffect } from "react";
import { Button, Grid, Typography, Box } from "@material-ui/core";
import { millisToMinutesAndSeconds } from "../Util";
import { primaryGrey } from "../Colors";
import Song from "../models/Song.js";

/**
 *
 * @param {Song} track
 * @param {*} playSongCallback
 * @returns
 */
function SongContainer({ track, playSongCallback }) {
  return (
    <Box
      onClick={() => {
        playSongCallback();
      }}
      variant="conained"
      

      sx={{
        border: `2px solid ${primaryGrey}`,
        borderRadius: "200px",
        paddingLeft: "30px",
        paddingRight: "5px",
        margin: "5px",
      }}
    >
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Grid item>
          <Grid item xs>
            <Typography style={{ color: "white", fontWeight: "bold" }}>
              {track.title}
            </Typography>
          </Grid>
          <Grid item xs>
            {console.log(track)}
            <Typography style={{ color: "white" }}>
              {track.artists.map((artist, index) =>
                index + 1 != track.artists.length ? artist + ", " : artist
              )}
            </Typography>
          </Grid>
          <Grid item xs>
            <Typography style={{ color: "white" }}>
              Genre: {track.genre}
            </Typography>
          </Grid>
        </Grid>
        <Grid item>
          <Typography style={{ color: "white" }}>
            {millisToMinutesAndSeconds(track.duration)}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
}

export default SongContainer;
