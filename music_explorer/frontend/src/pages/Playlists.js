import React, { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  Button,
  List,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Box
} from "@mui/material";
import { useLocalStorage } from "../Util";

function Playlists({ updateUserGenreMap }) {
  const [playlists, setPlaylists] = useState([]);
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
    <Box className="main" style={{ paddingTop: 100, height: "100%"}} flexDirection={"column"} display={"flex"} flexGrow={1}>
      <List style={{ overflow: "auto" }}>
        <Grid container direction="column" justifyContent="space-between">
          <Grid item padding={2}>
            <Typography
              variant="h3"
              style={{ color: "white", fontWeight: "bold" }}
            >
              My playlists
            </Typography>

            {playlists == null ? (
              <div>
                <p>Loading...</p>
              </div>
            ) : (
              <List
                style={{
                  maxHeight: 800,
                  overflow: "auto",
                }}
              >
                <Grid container direction="column" paddingLeft={2}>
                  {playlists.map((playlist) => {
                    let playlistName = Object.values(playlist)[0];
                    let playlistId = Object.keys(playlist)[0];
                    var playlistAlreadyChecked =
                      Object.values(selectedPlaylists).includes(playlistId);

                    return (
                      //Must have unique key or react will throw console error!!!

                      <FormGroup key={playlistId}>
                        <FormControlLabel
                          sx={{ color: "white" }}
                          control={
                            <Checkbox
                              sx={{ color: "white" }}
                              checked={playlistAlreadyChecked}
                              onChange={(event) =>
                                selectedPlaylistsHandler(
                                  playlistId,
                                  event.target.checked
                                )
                              }
                              key={playlistId.toString()}
                              value={playlistId}
                            />
                          }
                          label={playlistName}
                        />
                      </FormGroup>
                    );
                  })}
                </Grid>
              </List>
            )}
          </Grid>
        </Grid>
      </List>

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
        <Button variant="outlined" onClick={() => resetPlaylistGenreMap()}>
          Reset
        </Button>
      </Grid>
    </Box>
  );
}

export default Playlists;
