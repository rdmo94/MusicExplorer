import React, { useState, useEffect } from "react";
import SongContainer from "../components/SongContainer";
import {
  Grid,
  Typography,
  Button,
  CircularProgress,
  Box,
  TextField,
  List,
} from "@material-ui/core";
import { Done, ErrorOutline } from "@material-ui/icons";
import Playlist from "../models/Playlist";
import Song from "../models/Song";
import PropTypes from "prop-types";
import { primaryGreen } from "../Colors";
import createBreakpoints from "@material-ui/core/styles/createBreakpoints";
import { Icon } from "@iconify/react";
import { useLocalStorage } from "../Util";
import PlaylistHeader from "../components/PlaylistHeader";

function PlaylistScreen({ generatedPlaylist }) {
  const [playlist, setPlaylist] = useState();
  const [currentSongPlaying, setCurrentSongPlaying] = useState(null);
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [saveToSpotifyState, setSaveToSpotifyState] = useState("IDLE");
  const [newlyCreatedPlaylist, setNewlyCreatedPlaylist] = useState(null);
  const [playlistName, setPlaylistName] = useState(null);

  useEffect(() => {
    // let object = new Playlist(
    //   "0DIvpjaOZNK0Qqb5bEm2lf",
    //   "New playlist",
    //   [],
    //   [
    //     new Song(
    //       "5GzKIbJyrV6rUakLyezNwn",
    //       "Mad Professor",
    //       ["Large Professor"],
    //       "Hip Hop",
    //       261333,
    //       "spotify:track:5GzKIbJyrV6rUakLyezNwn"
    //     ),
    //     new Song(
    //       "3IAfUEeaXRX9s9UdKOJrFI",
    //       "Envolver",
    //       ["Anitta"],
    //       "Pop",
    //       193805,
    //       "spotify:track:3IAfUEeaXRX9s9UdKOJrFI"
    //     ),
    //   ]
    // );
    console.log(generatedPlaylist);
    let playlist = Playlist.fromObject(generatedPlaylist);
    console.log(playlist);
    setPlaylist(playlist);
    setPlaylistTracks(playlist.tracks);
  }, []);

  const saveToSpotifyStates = {
    SUCCESS: <Done color="secondary" />,
    ERROR: <ErrorOutline color="secondary" />,
    LOADING: (
      <CircularProgress sx={{ "background-color": "secondary" }} size={20} />
    ),
    IDLE: <></>,
  };

  const saveToSpotifyHandler = (_) => {
    setSaveToSpotifyState("LOADING");
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playlistTracks }),
    };
    fetch("/spotify/playlist/save", requestOptions).then((response) => {
      console.log("actually called fetch");
      if (response.status == 201) {
        setSaveToSpotifyState("SUCCESS");
        response.json().then((json) => {
          let _json = JSON.parse(json);
          setNewlyCreatedPlaylist(_json);
          setPlaylistName(_json.name);
        });
      } else {
        setSaveToSpotifyState("ERROR");
      }
    });
  };

  async function editTitleHandler(name) {
    // var object = {
    //     "name": name,
    // }
    // const requestOptions = {
    //   method: "PUT",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ object }),
    // };
    // fetch(`/spotify/playlist/${newlyCreatedPlaylist.id}`, requestOptions).then((response) => {
    // console.log("actually called fetch");
    // if (response.status == 201) {
    //   setSaveToSpotifyState("SUCCESS");
    //   response.json().then((json) => {
    //     setNewlyCreatedPlaylist(JSON.parse(json));
    //     console.log(JSON.parse(json));
    //   });
    // } else {
    //   setSaveToSpotifyState("ERROR");
    // }
    // });
  }

  return (
    <List sx={{ overflow: "auto", height: 100 }}>
      <Grid container direction="column" justifyContent="center" sx={{backgroundColor: "red"}}>
        {playlist ? (
          <Grid
          sx={{backgroundColor: "red"}}
          item
            container
            direction="column"
            justifyContent="center"
            alignContent="center"
          >
            <Grid
            sx={{backgroundColor: "red"}}
            item
              container
              direction="column"
              justifyContent="center"
              alignContent="center"
            >
              <PlaylistHeader
                editCallback={editTitleHandler}
                title={
                  newlyCreatedPlaylist
                    ? newlyCreatedPlaylist.name
                    : "New playlist"
                }
              />

              {playlistTracks.map((track) => {
                return (
                  <Grid item>
                    <SongContainer
                      track={track}
                      playSongCallback={() => {
                        setCurrentSongPlaying(track.id);
                      }}
                    ></SongContainer>
                  </Grid>
                );
              })}
            </Grid>
            <Grid
              container
              direction="column"
              justifyContent="center"
              alignContent="center"
            >
              <Grid item>
                <Button
                  variant="contained"
                  style={{ borderRadius: 200, backgroundColor: primaryGreen }}
                  endIcon={saveToSpotifyStates[saveToSpotifyState]}
                >
                  <Typography color={"white"}
                    style={{ fontWeight: "bold", color: "white" }}
                    onClick={saveToSpotifyHandler}
                  >
                    {"SAVE TO\nSPOTIFY"}
                  </Typography>
                </Button>
              </Grid>
              <Box sx={{ backgroundColor: "red" }}>
                {newlyCreatedPlaylist != null ? (
                  <Button
                    variant="contained"
                    style={{ borderRadius: 200, backgroundColor: primaryGreen }}
                    endIcon={<Icon icon="mdi:spotify" color="white" />}
                    onClick={() => {
                      window.open(
                        newlyCreatedPlaylist.external_urls.spotify,
                        "_blank"
                      );
                      setSaveToSpotifyState("IDLE");
                    }}
                  >
                    <Typography color={"white"} style={{ fontWeight: "bold", color: "white" }}>
                      {"OPEN PLAYLIST"}
                    </Typography>
                  </Button>
                ) : (
                  <></>
                )}
              </Box>
            </Grid>

            {currentSongPlaying != null ? (
              <iframe
                style={{
                  borderRadius: 12,
                  position: "fixed",
                  bottom: 30,
                  left: "50%",
                  marginLeft: -150,
                }}
                src={`https://open.spotify.com/embed/track/${currentSongPlaying}?utm_source=generator`}
                width="300"
                height={"80"}
                frameBorder={"0"}
                allowFullScreen={""}
                allow={"autoplay"}
              ></iframe>
            ) : (
              <></>
            )}
          </Grid>
        ) : (
          <Typography color={"white"} variant="h3">
            Add songs to a playlist to view them here
          </Typography>
        )}
      </Grid>
    </List>
  );
}

export default PlaylistScreen;
