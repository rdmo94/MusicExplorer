import React from "react";
import { useEffect } from "react";
import { Button, Grid, Typography, Box, List, Icon, IconButton } from "@material-ui/core";
import { millisToMinutesAndSeconds, replace_special_characters } from "../Util";
import { primaryGrey, primaryGreyDark, primaryGreyLight } from "../Colors";
import Song from "../models/Song.js";
import { useState } from "react";
import {Autorenew} from "@material-ui/icons"
import { useRef } from "react";


/**
 *
 * @param {List<Song>} tracks
 * @param {*} playSongCallback
 * @returns
 */
function SongsContainer({ tracks, playSongCallback, renewSongCallback }) {
  const songContainerRef = useRef(null);
  const [listHeight, setListHeight] = useState();
  const [playlistTracks, setPlaylistTracks] = useState([]);
  useEffect(() => {
    let availableSizeElement = document.getElementById("songContainer");
    if (availableSizeElement) {
      setListHeight(availableSizeElement.clientHeight * 0.79);
    }
  }, [songContainerRef]);

  useEffect(() => {
    setPlaylistTracks(tracks);
    console.log("ThEY ChAnGeD!!")
  }, [tracks]);
  

  return (
    <List style={{ overflow: "auto", maxHeight: listHeight}}>
      {playlistTracks.map((track, index) => {
        return (
          <Grid item key={index}>
            <Box
              onClick={() => {
                playSongCallback(track.id);
              }}
              variant="conained"
              sx={{
                cursor: "pointer",
                backgroundColor: `${primaryGrey}`,
                "&:hover": {
                  backgroundColor: `${primaryGreyLight}`,
                },
                borderRadius: "200px",
                paddingLeft: "30px",
                paddingRight: "5px",
                margin: "15px",
                boxShadow:
                  "rgba(0, 0, 0, 0.03) 0px 5px 10px, rgba(0, 0, 0, 0.23) 0px 4px 4px",
              }}
            >
              <Grid
                container
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Grid container item xs justifyContent={"center"}>
                  <img
                    src={track.image}
                    style={{
                      height: 60,
                      width: 60,
                      border: `2px solid ${primaryGreyDark}`,
                    }}
                  ></img>
                </Grid>
                <Grid
                  container
                  direction={"column"}
                  spacing={0}
                  item
                  justifyContent={"center"}
                  alignItems={"flex-start"}
                  xs={8}
                  style={{padding: 15}}
                >
                  <Grid item>
                    <Typography style={{ color: "white", fontWeight: "bold" }}>
                      {track.title}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography style={{ color: "white" }}>
                      {track.artists.map((artist, index) =>
                        index + 1 != track.artists.length
                          ? artist + ", "
                          : artist
                      )}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography style={{ color: "white" }}>
                      Genre: {replace_special_characters(track.genre, false)}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid item >
                  <IconButton style={{marginRight: 30}} onClick={() => renewSongCallback(track)}>
                    <Autorenew style={{ color: "white" }} />
                  </IconButton>
                </Grid>
                <Grid item xs>
                  <Typography style={{ color: "white" }}>
                    {millisToMinutesAndSeconds(track.duration)}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        );
      })}
    </List>
  );
}

export default SongsContainer;
