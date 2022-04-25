import React from "react";
import { Container, Box, Grid, Button } from "@mui/material";
import Strategies from "../components/Strategies";
import Graph from "./Graph";
import PlaylistScreen from "./PlaylistScreen";
import Playlists from "./Playlists";
import { useLocalStorage } from "../Util";
import "../../static/css/styles.css";
import { primaryGreen } from "../Colors";

//grid components style
//const useStyles = makeStyles((theme) => ({
//  paper: {
//    padding: theme.spacing(1),
//    textAlign: "center",
//    color: theme.palette.text.secondary,
//  },
//}));

function Dashboard() {
  const [playlistsGenreMap, setPlaylistsGenreMap] = useLocalStorage(
    "playlistsGenreMap",
    null
  );

  const [generatedPlaylist, setGeneratedPlaylist] = useLocalStorage(
    "generatedPlaylist",
    null
  );

  const [showGraph, setShowGraph] = useLocalStorage("showGraph", null);

  function handleUpdatePlaylistGenreMap(genreOccurrenceMap) {
    console.log("playlistGenreMap updated");
    setPlaylistsGenreMap(genreOccurrenceMap);
  }

  function handleGeneratedPlaylistChange(generatedPlaylist) {
    setGeneratedPlaylist(generatedPlaylist);
    setShowGraph(false);
  }

  return (
    <div className="container">
      {generatedPlaylist ? (
        <Box
          display="flex"
          style={{ padding: 10, position: "fixed", top: 10, left: 350 }}
        >
          <Button
            variant="contained"
            onClick={() => setShowGraph(!showGraph)}
            style={{
              padding: 10,
              borderRadius: 200,
              backgroundColor: primaryGreen,
            }}
          >
            {showGraph ? "Go to playlist" : "Show graph"}
          </Button>
        </Box>
      ) : (
        <></>
      )}
      <Grid container direction={"row"}>
        <Grid item width={350}>
          <Playlists updateUserGenreMap={handleUpdatePlaylistGenreMap} />
        </Grid>
        <Box display={"flex"} flexGrow={1}>
          <Grid item>
            {generatedPlaylist == null || showGraph ? (
              <Graph genreMap={playlistsGenreMap} />
            ) : (
              <PlaylistScreen generatedPlaylist={generatedPlaylist} />
            )}
          </Grid>
        </Box>
        <Grid item width={350}>
          <Strategies
            selectedUserGenres={playlistsGenreMap}
            updateGeneratedPlaylistCallback={handleGeneratedPlaylistChange}
          />
        </Grid>
      </Grid>

      {/* <Box display="flex">
        <Container disableGutters={true}>
          <Box
            sx={{
              bgcolor: "#d9d9d9",
              width: "350px",
              height: "100vh",
              position: "fixed",
              left: 0,
              borderRight: "2px solid",
            }}
          >
            <Playlists updateUserGenreMap={handleUpdatePlaylistGenreMap} />
          </Box>
        </Container>
        <Container disableGutters={true}>
          <Box sx={{ bgcolor: "#d9d9d9", height: "100vh", width: "auto" }}>
            {generatedPlaylist == null || showGraph ? (
              <Graph genreMap={playlistsGenreMap} />
            ) : (
              <PlaylistScreen generatedPlaylist={generatedPlaylist} />
            )}
          </Box>
        </Container>
        <Container disableGutters={true}>
          {
            <Box
              sx={{
                bgcolor: "#d9d9d9",
                width: "350px",
                height: "100vh",
                position: "fixed",
                right: 0,
                borderLeft: "2px solid",
              }}
            >
              {
                <Strategies
                  selectedUserGenres={playlistsGenreMap}
                  updateGeneratedPlaylistCallback={
                    handleGeneratedPlaylistChange
                  }
                />
              }
            </Box>
          }
        </Container>
      </Box> */}
    </div>
  );
}

export default Dashboard;
