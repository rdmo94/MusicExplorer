import React, { useState, useEffect } from "react";
import DownloadIcon from "@mui/icons-material/Download";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Grid,
  Typography,
  Button,
  List,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Box,
  CircularProgress,
} from "@mui/material";
import { useLocalStorage } from "../Util";
import { primaryGreen } from "../Colors";

function Playlists({ updateUserGenreMap }) {
  const [loadingPlaylists, setLoadingPlaylists] = useState(false);
  const [loadingGenres, setLoadingGenres] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylists, setSelectedPlaylists] = useLocalStorage(
    "selectedPlaylists",
    []
  );

  useEffect(() => {
    setLoadingPlaylists(true);
    fetch("/spotify/get_playlists").then((response) =>
      response.json().then((json) => {
        setLoadingPlaylists(false);
        setPlaylists(JSON.parse(json));
      })
    );
  }, []);

  /**
   *
   * @param {Map<String,String>} playlists <playlist_name, playlist_id>
   */
  function getSelectedPlaylistGenreMap(playlists) {
    setLoadingGenres(true);
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(playlists),
    };
    fetch("/spotify/get_playlist_genres", requestOptions).then((response) =>
      response.json().then((json) => {
        setLoadingGenres(false);
        updateUserGenreMap(JSON.parse(json));
        return JSON.parse(json);
      })
    );
  }

  function resetPlaylistGenreMap() {
    //TODO uncheck all checkboxes
    setSelectedPlaylists([]);
    updateUserGenreMap({});
    setLoadingGenres(false);
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
    <Box
      className="main"
      style={{ paddingTop: 100, height: "100%" }}
      flexDirection={"column"}
      display={"flex"}
      flexGrow={1}
    >
      <List style={{ overflow: "auto" }}>
        <Grid container direction="column" justifyContent="space-between">
          <Grid item padding={2}>
            <Typography
              variant="h3"
              style={{ color: "white", fontWeight: "bold" }}
            >
              My playlists
            </Typography>

            {loadingPlaylists ? (
              <Grid
                container
                direction="row"
                justifyContent="space-evenly"
                alignItems="center"
              >
                <CircularProgress />
              </Grid>
            ) : (
              <List
                style={{
                  maxHeight: 900, //TODO fix to fit screen
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
        <LoadingButton
          size="small"
          onClick={() => getSelectedPlaylistGenreMap(selectedPlaylists)}
          endIcon={<DownloadIcon />}
          loading={loadingGenres}
          loadingPosition="end"
          variant="contained"
          style={{borderRadius: 200, backgroundColor: primaryGreen}}
          disabled={selectedPlaylists.length == 0 ? true : false}
        >
          Fetch Genres
        </LoadingButton>

        <Button variant="outlined" style={{borderRadius: 200, borderColor: primaryGreen, color: primaryGreen}} onClick={() => resetPlaylistGenreMap()}>
          Reset
        </Button>
      </Grid>
    </Box>
  );
}

export default Playlists;
