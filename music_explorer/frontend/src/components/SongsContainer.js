import React from "react";
import { useEffect } from "react";
import { Button, Grid, Typography, Box, List } from "@material-ui/core";
import { millisToMinutesAndSeconds } from "../Util";
import { primaryGrey } from "../Colors";
import Song from "../models/Song.js";

/**
 *
 * @param {List<Song>} tracks
 * @param {*} playSongCallback
 * @returns
 */
function SongsContainer({ tracks, playSongCallback }) {
  return (
    tracks.map((track, index) => {
      return (
        <Grid item key={index}>
        <Box
        onClick={() => {
          playSongCallback(track.id);
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
              {
                /*console.log(track)*/
              }
              <Typography style={{ color: "white" }}>
                <List style={{maxHeight: 100, overflow: "auto"}}>

                {track.artists.map((artist, index) =>
                  index + 1 != track.artists.length ? artist + ", " : artist
                )}
                </List>
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
        </Grid>
      );
    })
    
  );
}

export default SongsContainer;
