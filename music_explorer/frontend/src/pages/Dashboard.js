import React, { useEffect, useState } from "react";
import { Container, Box, Grid, Button } from "@mui/material";
import Strategies from "../components/Strategies";
import Graph from "./Graph";
import PlaylistScreen from "./PlaylistScreen";
import Playlists from "./Playlists";
import { useLocalStorage } from "../Util";
import "../../static/css/styles.css";
import { primaryGreen } from "../Colors";

function Dashboard() {
  const [playlistsGenreMap, setPlaylistsGenreMap] = useLocalStorage(
    "playlistsGenreMap",
    null
  );

  const [generatedPlaylist, setGeneratedPlaylist] = useLocalStorage(
    "generatedPlaylist",
    null
  );

  const [strategyData, setStrategyData] = useLocalStorage("strategyData", null);

  const [showGraph, setShowGraph] = useLocalStorage("showGraph", null);

  const [lastClickedGenreNode, setLastClickedGenreNode] = useLocalStorage(
    "lastClickedGenreNode",
    null
  );

  const [graphSelectViewMode, setGraphSelectViewMode] = useState("");

  function handleUpdatePlaylistGenreMap(genreOccurrenceMap) {
    setPlaylistsGenreMap(genreOccurrenceMap);
  }

  function handleStrategyOutputChange(strategyOutput) {
    if (strategyOutput) {
      var tempStrategyData = {};
      tempStrategyData[strategyOutput["id"]] = strategyOutput["genres"];
      setStrategyData(tempStrategyData);
      setGeneratedPlaylist(strategyOutput["playlist"]);

      setShowGraph(false);
    } else {
      localStorage.removeItem("playlistName");
      localStorage.removeItem("newlySavedPL");
      localStorage.removeItem("plnEditable");
      setStrategyData(null);
      setGeneratedPlaylist(null)
      setShowGraph(true);
    }
  }

  function handleNodeClick(node, event) {
    setLastClickedGenreNode(node);
  }

  return (
    <Box className="container" height={"100%"}>
      {generatedPlaylist ? (
        <Box
          display="flex"
          style={{ padding: 10, position: "fixed", top: 10, left: 250 }}
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
      <Grid container direction={"row"} id={"playlist"} height={"100%"}>
        <Box width={250} display={"flex"} flexDirection={"column"} height={"100%"}>
          <Playlists updateUserGenreMap={handleUpdatePlaylistGenreMap} />
        </Box>
        <Box
          display={"flex"}
          height={"100%"}
          flexGrow={1}
          flexDirection={"row"}
          justifyContent={"center"}
          id={"graph"}
        >
          {generatedPlaylist == null || showGraph ? (
            <Graph
              genreMap={playlistsGenreMap}
              strategyData={strategyData}
              graphNodeClickCallback={handleNodeClick}
              graphSelectViewMode={graphSelectViewMode}
            />
          ) : (
            <PlaylistScreen
              generatedPlaylist={generatedPlaylist}
              updatePlaylistsCallback={handleUpdatePlaylistGenreMap}
            />
          )}
        </Box>
        {/* </Box> */}

        <Box width={250} display={"flex"} flexDirection={"column"} height={"100%"}>
          <Strategies
            selectedUserGenres={playlistsGenreMap}
            updateStrategyOutputCallback={handleStrategyOutputChange}
            lastSelectedNode={lastClickedGenreNode}
            setMapSelectMode={setGraphSelectViewMode}
          />
        </Box>
      </Grid>
    </Box>
  );
}

export default Dashboard;
