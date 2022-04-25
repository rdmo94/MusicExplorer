import React from "react";
import { Container, Box, Grid } from "@mui/material";
import Strategies from "../components/Strategies";
import Graph from "./Graph";
import PlaylistScreen from "./PlaylistScreen";
import Playlists from "./Playlists";
import { useLocalStorage } from "../Util";

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

  function handleUpdatePlaylistGenreMap(genreOccurrenceMap) {
    console.log("playlistGenreMap updated");
    setPlaylistsGenreMap(genreOccurrenceMap);
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
          <Box sx={{ bgcolor: "#d9d9d9", height: "100vh", flexGrow: 1 }}>
            <Graph genreMap={playlistsGenreMap} />
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
              {Strategies()}
            </Box>
          }
        </Container>
        
      </Box>
    </div>
  );
}

export default Dashboard;
