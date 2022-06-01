import React, { useState, useEffect } from "react";
import SongsContainer from "../components/SongsContainer";
import {
  Grid,
  Typography,
  Button,
  CircularProgress,
  Box,
} from "@material-ui/core";
import { Done, ErrorOutline } from "@material-ui/icons";
import Playlist from "../models/Playlist";
import { primaryGreen } from "../Colors";
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
    if (generatedPlaylist === null) {
      setIsPlaylistnameEditable(true);
      setNewlyCreatedPlaylist(null);
      setPlaylistName(null);
    } else {
      let playlist = Playlist.fromObject(generatedPlaylist);
      setPlaylist(playlist);
      setPlaylistTracks(playlist.tracks);
    }
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
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playlistTracks, name: playlistName }),
    };
    fetch("/spotify/playlist/save", requestOptions).then((response) => {
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
    setPlaylistName(name);
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
