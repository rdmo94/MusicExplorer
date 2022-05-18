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
import { useRef } from "react";

function Playlists({ updateUserGenreMap }) {
  const [listHeight, setListHeight] = useState(60);
  const [loadingPlaylists, setLoadingPlaylists] = useState(false);
  const [loadingGenres, setLoadingGenres] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylists, setSelectedPlaylists] = useLocalStorage(
    "selectedPlaylists",
    []
  );
  const playlistRef = useRef(null);

  useEffect(() => {
    // let availableSizeElement = document.getElementById("playlist");
    // if (availableSizeElement) {
    //   setListHeight(availableSizeElement.clientHeight * 0.6);
    // }
    setLoadingPlaylists(true);
    fetch("/spotify/get_playlists").then((response) =>
      response.json().then((json) => {
        setLoadingPlaylists(false);
        setPlaylists(JSON.parse(json));
      })
    );
  }, []);

  useEffect(() => {
    let availableSizeElement = document.getElementById("playlist");
    if (availableSizeElement) {
      console.log("Height available ", availableSizeElement.clientHeight)
      setListHeight(availableSizeElement.clientHeight * 0.6);
    }
  }, [playlistRef]);

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
    console.log("Calling getSelectedPlaylistGenreMap from Playlist.js");
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
      <List style={{ overflow: "auto", width: "100%" }}>
        <Grid
          container
          direction="column"
          justifyContent="space-between"
          height={"100%"}
        >
          <Grid item>
            <Typography
              variant="h4"
              style={{ color: "white", fontWeight: "bold", paddingLeft: 20 }}
            >
              My playlists
            </Typography>

            <List
              style={{
                width: "100%",
                maxHeight: listHeight,
                overflow: "auto",
              }}
            >
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
                <Grid container direction="column" >
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

                              sx={{ color: "white", }}
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
              )}
            </List>
          </Grid>
        </Grid>
      </List>
      <Box
        style={{
          // position: "fixed",
          // bottom: 10,
          // paddingTop: 10,
          // paddingBottom: 10,
          width: 250,
        }}
        flexDirection="row"
        justifyContent="space-evenly"
        alignItems="center"
        display={"flex"}
      >
        <LoadingButton
          size="small"
          onClick={() => getSelectedPlaylistGenreMap(selectedPlaylists)}
          endIcon={<DownloadIcon />}
          loading={loadingGenres}
          loadingPosition="end"
          variant="contained"
          style={{ borderRadius: 200, backgroundColor: primaryGreen }}
          disabled={selectedPlaylists.length == 0 ? true : false}
        >
          Fetch Genres
        </LoadingButton>

        <Button
          variant="outlined"
          style={{
            borderRadius: 200,
            borderColor: primaryGreen,
            color: primaryGreen,
          }}
          onClick={() => resetPlaylistGenreMap()}
        >
          Clear
        </Button>
      </Box>
    </Box>
  );
}

export default Playlists;
