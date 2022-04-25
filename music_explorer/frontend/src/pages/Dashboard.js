import React from "react";
import { Container, Box, Grid } from "@mui/material";
import Strategies from "../components/Strategies";
import Graph from "./Graph";
import PlaylistScreen from "./PlaylistScreen";
import Playlists from "./Playlists";
import { useLocalStorage } from "../Util";
import "../../static/css/styles.css";

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

  function handleUpdatePlaylistGenreMap(genreOccurrenceMap) {
    console.log("playlistGenreMap updated");
    setPlaylistsGenreMap(genreOccurrenceMap);
  }

  function handleGeneratedPlaylistChange(generatedPlaylist) {
    setGeneratedPlaylist(generatedPlaylist);
  }

  return (
    <div>
      <Box display="flex">
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
            {generatedPlaylist == null ? (
              <Graph genreMap={playlistsGenreMap} />
            ) : (
              <PlaylistScreen generatedPlaylist={generatedPlaylist}/>
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
              {<Strategies selectedUserGenres={playlistsGenreMap} updateGeneratedPlaylistCallback={handleGeneratedPlaylistChange} />}
            </Box>
          }
        </Container>
      </Box>
    </div>
  );
}

export default Dashboard;
