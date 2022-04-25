import React, { useState, useEffect } from "react";
import PlaylistCheckboxContainer from "../components/PlaylistCheckboxContainer";
import SongContainer from "../components/SongContainer";
import { Grid, Typography, Button, List } from "@mui/material";
import { useLocalStorage } from "../Util";

function Playlists({ updateUserGenreMap }) {
  const [playlists, setPlaylists] = useState(null);
  const [selectedPlaylists, setSelectedPlaylists] = useLocalStorage(
    "selectedPlaylists",
    []
  );

  useEffect(() => {
    fetch("/spotify/get_playlists").then((response) =>
      response.json().then((json) => {
        setPlaylists(JSON.parse(json));
      })
    );
  }, []);

  /**
   *
   * @param {Map<String,String>} playlists <playlist_name, playlist_id>
   */
  function getSelectedPlaylistGenreMap(playlists) {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(playlists),
    };
    fetch("/spotify/get_playlist_genres", requestOptions).then((response) =>
      response.json().then((json) => {
        updateUserGenreMap(JSON.parse(json));
        return JSON.parse(json);
      })
    );
  }

  function resetPlaylistGenreMap() {
    //TODO uncheck all checkboxes
    setSelectedPlaylists([]);
    updateUserGenreMap(null);
  }

  const selectedPlaylistsHandler = (playlistId, isChecked) => {
    if (isChecked) {
      setSelectedPlaylists(selectedPlaylists.concat([playlistId]));
    } else {
      setSelectedPlaylists(
        selectedPlaylists.filter((element) => element !== playlistId)
      );
    }
  };

  return (
    <div style={{ paddingTop: 100 }}>
      <List style={{ overflow: "auto", maxHeight: "100%" }}>
        <Grid container direction="column" justifyContent="space-between">
          <Grid item>
            <Typography variant="h3" style={{ fontWeight: "bold" }}>
              My playlists
            </Typography>
            <Grid
              container
              direction="row"
              justifyContent="space-evenly"
              alignItems="center"
            >
              <Button
                variant="contained"
                onClick={() => getSelectedPlaylistGenreMap(selectedPlaylists)}
              >
                Fetch genres
              </Button>
              <Button
                variant="outlined"
                onClick={() => resetPlaylistGenreMap()}
              >
                Reset
              </Button>
            </Grid>

            {playlists == null ? (
              <div>
                <p>Loading...</p>
              </div>
            ) : (
              <List
                style={{
                  maxHeight: 300,
                  overflow: "auto",
                }}
              >
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
              </List>
            )}
          </Grid>
          <Grid item>
            <Grid container direction="column">
              {playlists.map((playlist) => {
                let playlistName = Object.values(playlist)[0];
                let playlistId = Object.keys(playlist)[0];
                var playlistAlreadyChecked =
                  Object.values(selectedPlaylists).includes(playlistId);

                return (
                  //Must have unique key or react will throw console error!!!

                  <PlaylistCheckboxContainer
                    title={playlistName}
                    playlistId={playlistId}
                    updatePlaylistsCallback={selectedPlaylistsHandler}
                    isChecked={playlistAlreadyChecked}
                  />
                );
              })}
            </Grid>
          </Grid>
        </Grid>
      </List>
    </div>
  );
}

export default Playlists;
