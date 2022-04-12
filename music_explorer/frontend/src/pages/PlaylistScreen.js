import React, { useState, useEffect } from "react";
import PlaylistCheckboxContainer from "../components/PlaylistCheckboxContainer";
import SongContainer from "../components/SongContainer";
import { Grid, Typography, Button, CircularProgress } from "@material-ui/core";
import { Done, ErrorOutline } from "@material-ui/icons";
import Playlist from "../models/Playlist";
import Song from "../models/Song";
import PropTypes from "prop-types";
import { primaryGreen } from "../Colors";
import createBreakpoints from "@material-ui/core/styles/createBreakpoints";
import { Icon } from "@iconify/react";

function PlaylistScreen(props) {
  const [playlist, setPlaylist] = useState(new Playlist());
  const [currentSongPlaying, setCurrentSongPlaying] = useState(null);
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [saveToSpotifyState, setSaveToSpotifyState] = useState("IDLE");
  const [newlyCreatedPlaylist, setNewlyCreatedPlaylist] = useState(null);

  useEffect(() => {
    let object = new Playlist(
      "0DIvpjaOZNK0Qqb5bEm2lf",
      "New playlist",
      [],
      [
        new Song(
          "5GzKIbJyrV6rUakLyezNwn",
          "Mad Professor",
          ["Large Professor"],
          "Hip Hop",
          261333,
          "spotify:track:5GzKIbJyrV6rUakLyezNwn"
        ),
        new Song(
          "3IAfUEeaXRX9s9UdKOJrFI",
          "Envolver",
          ["Anitta"],
          "Pop",
          193805,
          "spotify:track:3IAfUEeaXRX9s9UdKOJrFI"
        ),
      ]
    );
    setPlaylist(object);
    setPlaylistTracks(object.tracks);
  }, []);

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
      body: JSON.stringify({ playlistTracks }),
    };
    fetch("/spotify/playlist/save", requestOptions).then((response) => {
      console.log("actually called fetch");
      if (response.status == 201) {
        setSaveToSpotifyState("SUCCESS");
        response.json().then((json) => {
          setNewlyCreatedPlaylist(json);
        });
      } else {
        setSaveToSpotifyState("ERROR");
      }
    });
  };

  return (
    <div>
      {playlist ? (
        <div>
          <Grid container direction="column">
            <Grid container direction="row" justifyContent="space-between">
              <Grid item>
                <Typography variant="h3">{playlist.title}</Typography>
              </Grid>
              <Grid item></Grid>
            </Grid>
            {playlistTracks.map((track) => (
              <Grid item>
                <SongContainer
                  song={track}
                  playSongCallback={() => {
                    setCurrentSongPlaying(track.id);
                  }}
                ></SongContainer>
              </Grid>
            ))}
          </Grid>
          <Button
            variant="contained"
            style={{ borderRadius: 200, backgroundColor: primaryGreen }}
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
              style={{ borderRadius: 200, backgroundColor: primaryGreen }}
              endIcon={<Icon icon="mdi:spotify" color="white" />}
              onClick={() => {
                window.open(newlyCreatedPlaylist, "_blank");
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

          {currentSongPlaying != null ? (
            <iframe
              style={{
                borderRadius: 12,
                position: "absolute",
                bottom: 20,
                left: "50%",
                marginLeft: -150,
              }}
              src={`https://open.spotify.com/embed/track/${currentSongPlaying}?utm_source=generator`}
              width="300"
              height={"80"}
              frameBorder={"0"}
              allowfullscreen={""}
              allow={"autoplay"}
            ></iframe>
          ) : (
            <></>
          )}
        </div>
      ) : 
      (
        <Typography variant="h3">
          Add songs to a playlist to view them here
        </Typography>
      )}
    </div>
  );
}

export default PlaylistScreen;
