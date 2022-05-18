import React, { useState, useEffect } from "react";
import SongsContainer from "../components/SongsContainer";
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
  const [newlyCreatedPlaylist, setNewlyCreatedPlaylist] = useLocalStorage(
    "newlySavedPL",
    null
  );
  const [playlistName, setPlaylistName] = useLocalStorage("playlistName", null);
  const [isPlaylistnameEditable, setIsPlaylistnameEditable] = useLocalStorage(
    "plnEditable",
    true
  );

  useEffect(() => {
    console.log("changes to generated playlist: ", generatedPlaylist);
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
    //console.log(generatedPlaylist);
    if (generatedPlaylist === null) {
      setIsPlaylistnameEditable(true);
      setNewlyCreatedPlaylist(null);
      setPlaylistName(null);
    } else {
      let playlist = Playlist.fromObject(generatedPlaylist);
      console.log(playlist);
      //console.log(playlist);
      setPlaylist(playlist);
      setPlaylistTracks(playlist.tracks);
    }

    // if (newlyCreatedPlaylist === null) {
    // }
    // if (playlistName === null) {
    // }
  }, [generatedPlaylist]);

  const saveToSpotifyStates = {
    SUCCESS: <Done color="white" />,
    ERROR: <ErrorOutline color="white" />,
    LOADING: (
      <CircularProgress sx={{ "background-color": "white" }} size={20} />
    ),
    IDLE: <></>,
  };

  const saveToSpotifyHandler = (_) => {
    setSaveToSpotifyState("LOADING");
    console.log("playlistname", playlistName);
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playlistTracks, name: playlistName }),
    };
    fetch("/spotify/playlist/save", requestOptions).then((response) => {
      console.log("actually called fetch");
      if (response.status == 201) {
        setSaveToSpotifyState("SUCCESS");
        response.json().then((json) => {
          let _json = JSON.parse(json);
          setNewlyCreatedPlaylist(_json);
          setIsPlaylistnameEditable(false);
        });
      } else {
        setSaveToSpotifyState("ERROR");
      }
    });
  };

  function editTitleHandler(name) {
    console.log(
      "Setting new playlist name as ",
      name,
      " inside PlaylistScreen.js"
    );
    setPlaylistName(name);
    // setIsPlaylistnameEditable(false);
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
    <div style={{ height: "100%", width: "100%" }}>
      <Box
        display={"flex"}
        justifyContent={"flex-end"}
        flexGrow={1}
        style={{ position: "fixed", top: 20, right: 350, zIndex: 99 }}
      >
        <Button
          variant="contained"
          style={{
            margin: 5,
            borderRadius: 200,
            backgroundColor: primaryGreen,
          }}
          endIcon={saveToSpotifyStates[saveToSpotifyState]}
        >
          <Typography
            style={{ fontWeight: "bold", color: "white" }}
            onClick={saveToSpotifyHandler}
          >
            {"SAVE TO\nSPOTIFY"}
          </Typography>
        </Button>

        {newlyCreatedPlaylist != null ? (
          <Button
            variant="contained"
            style={{
              margin: 5,
              borderRadius: 200,
              backgroundColor: primaryGreen,
            }}
            endIcon={<Icon icon="mdi:spotify" style={{ color: "white" }} />}
            onClick={() => {
              window.open(newlyCreatedPlaylist.external_urls.spotify, "_blank");
              setSaveToSpotifyState("IDLE");
            }}
          >
            <Typography style={{ fontWeight: "bold", color: "white" }}>
              {"OPEN PLAYLIST"}
            </Typography>
          </Button>
        ) : (
          <></>
        )}
      </Box>

      <Grid
        container
        direction="column"
        justifyContent="flex-start"
        alignItems={"center"}
        id={"songContainer"}
        style={{ height: "100%", paddingTop: 75 }}
      >
        {playlist ? (
          <Grid
            item
            container
            direction="column"
            justifyContent="center"
            alignContent="flex-start"
          >
            <Grid
              item
              container
              direction="column"
              justifyContent="center"
              alignContent="flex-start"
            >
              <PlaylistHeader
                isEditable={isPlaylistnameEditable}
                editCallback={editTitleHandler}
                title={
                  playlistName != null
                    ? playlistName
                    : "New playlist"
                }
              />

              {
                <Grid item>
                  <SongsContainer
                    tracks={playlistTracks}
                    playSongCallback={setCurrentSongPlaying}
                  ></SongsContainer>
                </Grid>
              }

              {/* {playlistTracks.map((track) => {
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
              })} */}
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
          <Typography variant="h3">
            Add songs to a playlist to view them here
          </Typography>
        )}
      </Grid>
    </div>
  );
}

export default PlaylistScreen;
