import React, { useState, useEffect } from "react";
import PlaylistCheckboxContainer from "../components/PlaylistCheckboxContainer";
import SongContainer from "../components/SongContainer";
import { Grid, Typography } from "@material-ui/core";

function Playlists() {
  const [playlists, setPlaylists] = useState(null);
  const [selectedPlaylists, setSelectedPlaylists] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // fetch("/api/get_user").then(response => response.json().then(json => setUser(json)))

    fetch("/spotify/get_playlists").then((response) =>
      response.json().then((json) => {
        setPlaylists(JSON.parse(json));
      })
    );
  }, []);

  const selectedPlaylistsHandler = (playlist, isChecked) => {
    // selectedPlaylists.forEach((item) => console.log("before" + item));
    // selectedPlaylists.push(playlist);
    if (isChecked) {
      setSelectedPlaylists(selectedPlaylists.concat([playlist]));
    } else {
      setSelectedPlaylists(
        selectedPlaylists.filter((element) => element !== playlist)
      );
    }
    // selectedPlaylists.forEach((item) => console.log("after" + item));
  };

  return (
    <div style={{padding: 25, paddingTop: 100}}>
      <Grid container direction="row">
        <Grid item>
          <Typography variant="h3" style={{ fontWeight: "bold" }}>
            My playlists
          </Typography>
          {playlists == null ? (
            <div>
              <p>Loading...</p>
            </div>
          ) : (
            <Grid container direction="column">
              {playlists.map((playlist) => {
                let playlistName = Object.values(playlist)[0];
                return (
                  <Grid item>
                    <PlaylistCheckboxContainer
                      title={playlistName}
                      updatePlaylistsCallback={selectedPlaylistsHandler}
                    />
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Grid>
        <Grid item>
          <Grid container direction="column">
            <Grid item>
              <Typography variant="h3" style={{ fontWeight: "bold" }}>
                Selected playlists
              </Typography>
            </Grid>
            {selectedPlaylists.map((playlist) => {
              console.log(playlist);
              return (
                <Grid item>
                  <Typography>{playlist}</Typography>
                </Grid>
              );
            })}
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default Playlists;
