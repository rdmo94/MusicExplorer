import React, { useState, useEffect } from "react";
import PlaylistCheckboxContainer from "../components/PlaylistCheckboxContainer";
import SongContainer from "../components/SongContainer";
import { Grid, Typography, Button } from "@material-ui/core";
import {useLocalStorage} from '../Util'

function Playlists({ updateUserGenreMap }) {
  const [playlists, setPlaylists] = useState(null);
  const [selectedPlaylists, setSelectedPlaylists] = useLocalStorage("selectedPlaylists", []);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // fetch("/api/get_user").then(response => response.json().then(json => setUser(json)))
    fetch("/spotify/get_playlists").then((response) =>
      response.json().then((json) => {
        console.log("My playlists:", JSON.parse(json));
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
      body: JSON.stringify({
        "kr sh lort i mund": "0VfACbAYiIeof8DnNGxCrX",
        jaistyle: "7IbxycULNvdHLD5uIVIyQr",
      }),
    };
    fetch("/spotify/get_playlist_genres", requestOptions).then((response) =>
      response.json().then((json) => {
        console.log(JSON.parse(json));
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

  const selectedPlaylistsHandler = (playlist, isChecked) => {
    // selectedPlaylists.forEach((item) => console.log("before" + item));
    // selectedPlaylists.push(playlist);
    console.log("p:", playlist);
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
    <div>
      <Grid container direction="row">
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
                onClick={() => getSelectedPlaylistGenreMap()}
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
          <Button onClick={() => props.updateUserGenreMap({ rock: 2, pop: 1 })}>
            hey anitta
          </Button>
          <Button onClick={() => props.updateUserGenreMap({})}>
            bye anitta
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}

export default Playlists;
