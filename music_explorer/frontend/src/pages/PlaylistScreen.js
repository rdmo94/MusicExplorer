import React, { useState, useEffect } from "react";
import PlaylistCheckboxContainer from "../components/PlaylistCheckboxContainer";
import SongContainer from "../components/SongContainer";
import { Grid, Typography, Button } from "@material-ui/core";
import Playlist from "../models/Playlist";
import Song from "../models/Song";
import PropTypes from "prop-types";
import { primaryGreen } from "../Colors";

function PlaylistScreen(props) {
  const [playlist, setPlaylist] = useState(new Playlist());
  const [currentSongPlaying, setCurrentSongPlaying] = useState(null);
  const [playlistTracks, setPlaylistTracks] = useState([]);

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
          261333
        ),
        new Song(
          "3IAfUEeaXRX9s9UdKOJrFI",
          "Envolver",
          ["Anitta"],
          "Pop",
          193805
        ),
      ]
    );
    
    setPlaylist(object);
    setPlaylistTracks(object.tracks);
  }, []);

  return (
    <div>
      <Grid container direction="column">
        <Grid container direction="row" justifyContent="space-between">
          <Grid item>
            <Typography variant="h3">{playlist.title}</Typography>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              style={{ borderRadius: 200, backgroundColor: primaryGreen }}
            >
              <Typography style={{ fontWeight: "bold", color: "white" }}>
                {"SAVE TO\nSPOTIFY"}
              </Typography>
            </Button>
          </Grid>
        </Grid>
        {playlistTracks.map((track) => (
          <Grid item>
            <SongContainer song={track} playSongCallback={() => {setCurrentSongPlaying(track.id)}}></SongContainer>
          </Grid>
        ))}
      </Grid>
      {currentSongPlaying != null ?  
      <iframe style={{borderRadius: 12, position: "absolute", bottom: 20, left: "50%", marginLeft: -150}} src={`https://open.spotify.com/embed/track/${currentSongPlaying}?utm_source=generator`} width="300" height={"80"} frameBorder={"0"} allowfullscreen={""} allow={"autoplay"}></iframe>
        :
        <></>
    }
      </div>
  );
}

export default PlaylistScreen;
