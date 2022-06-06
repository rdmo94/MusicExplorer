import React, { useState, useEffect, useRef } from "react";
import Graph3D from "../components/Graph3D";
import Graph2D from "../components/Graph2D";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useLocalStorage } from "../Util";
import { primaryGreen } from "../Colors";
import SearchIcon from '@mui/icons-material/Search';

import { primaryGrey } from "../Colors";
import { styled, Slider, Box, Typography, TextField, Button } from "@mui/material";
import { Circle, HorizontalRule } from "@mui/icons-material";

const WhiteSelect = styled(Select)(({ theme }) => ({
  color: "white",
  "& .MuiSvgIcon-root": {
    color: "white",
  },
  borderColor: "white",
}));

const WhiteSlider = styled(Slider)(({ theme }) => ({
  "& .MuiSlider-markLabel": {
    color: "white",
  },
  "& .MuiSlider-markLabelActive": {
    color: "white",
  },
}));

function Graph({
  genreMap,
  strategyData,
  graphNodeClickCallback,
  graphSelectViewMode,
}) {
  const [data, setData] = useState();
  const [graphType, setGraphType] = useLocalStorage("graphType", "2D");
  const [sliderValue, setSliderValue] = useLocalStorage(
    "popularitySliderValue",
    0
  );
  const [localGraphProperties, setLocalGraphProperties] = useLocalStorage(
    "graphProperties",
    {
      backgroundColor: "white",
      genrePopularity: 0,
      genreFilter: "",
    }
  );
  const [graphHeight, setGraphHeight] = useState();
  const [localGenreFilter, setLocalGenreFilter] = useState();
  const [graphWidth, setGraphWidth] = useState();
  const [currentSongPlaying, setCurrentSongPlaying] = useLocalStorage(
    "currentGenrePlaying",
    null
  );
  const graphRef = useRef(null);

  //set links
  var links = [];
  var strategy_number = undefined;
  var strategy_genres = []; //clean array of genres in strategy
  var user_genres = []; //clean array of genres in genreMap

  if (strategyData) {
    strategy_number = Object.keys(strategyData)[0];
    strategy_genres = strategyData[strategy_number];
    if (Object.keys(strategyData)[0] == "3") {
      //strategy 3 is path strategy
      links = Object.values(strategyData)[0];
    }
  }

  if (genreMap) {
    user_genres = Object.keys(genreMap);
  }

  /** add list of link to data **/
  if (links && data) {
    var graphReadableLinks = convert_genre_list_to_graph_links(links);
    var genreIdLinks =
      translate_genre_links_to_node_id_links(graphReadableLinks);
    data.links = genreIdLinks;
  }

  function convert_genre_list_to_graph_links(genreList) {
    var graphReadableLinks = [];
    for (var i = 0; i < genreList.length - 1; i++) {
      var link = { source: genreList[i], target: genreList[i + 1] };
      graphReadableLinks.push(link);
    }
    return graphReadableLinks;
  }

  function translate_genre_links_to_node_id_links(links) {
    function get_node_id_from_genre(genre_nodes, genre) {
      for (var i = 0; i < genre_nodes.length; i++) {
        if (genre_nodes[i].name == genre) return genre_nodes[i].id;
      }
      return null;
    }

    var newLinks = [];
    for (var i = 0; i < links.length; i++) {
      var newLinkSource = get_node_id_from_genre(data.nodes, links[i].source);
      var newLinkTarget = get_node_id_from_genre(data.nodes, links[i].target);
      if (newLinkSource && newLinkTarget) {
        var newLink = { source: newLinkSource, target: newLinkTarget };
        newLinks.push(newLink);
      } else {
      }
    }
    return newLinks;
  }

  function reorderData() {
    //renders strategy genres first and user genres last
    if (data) {
      if (user_genres) {
        for (var i = 0; i < user_genres.length; i++) {
          var user_genre = user_genres[i];
          var indexOfGenre = getNodeIndexOfGenre(user_genre);
          moveIndexToEndOfNodes(indexOfGenre);
        }
      }
      if (strategy_genres) {
        for (var i = 0; i < strategy_genres.length; i++) {
          var strategy_genre = strategy_genres[i];
          var indexOfGenre = getNodeIndexOfGenre(strategy_genre);
          moveIndexToEndOfNodes(indexOfGenre);
        }
      }
    }
  }

  function getNodeIndexOfGenre(genre) {
    for (var i = 0; i < data.nodes.length; i++) {
      if (data.nodes[i].name === genre) {
        return i;
      }
    }
    console.warn("could not find index of genre " + genre);
  }

  /**
   * Moves index of node to end of nodes = rendered last
   * @param {Integer} index
   */
  function moveIndexToEndOfNodes(index) {
    data.nodes.push(data.nodes.splice(index, 1)[0]);
  }

  reorderData();

  useEffect(() => {
    console.log("graphref useEffect")
    let availableSizeElement = document.getElementById("graph");
    if (availableSizeElement) {
      setGraphHeight(availableSizeElement.clientHeight / 1.5);
      setGraphWidth(availableSizeElement.clientWidth / 1.6);
    }
  }, [graphRef]);

  //Different useEffect, as the one above gets called every time the graphRef changes
  useEffect(() => {
    console.log("graphType useEffect")
    if (graphType) {
      var file =
        graphType == "3D"
          ? "static/graph_data_3d.json"
          : "static/graph_data_2d.json";
      fetch(file).then((response) =>
        response.json().then((data) => {
          setData(data);
        })
      );
    }
  }, [graphType]); //empty array to avoid multiple fetches

  let graph;
  let headline;

  const changeHandlerSlider = (e, value) => {
    setSliderValue(value);
  };

  const nodeClickStartMusicPlayback = (node) => {
    console.log(node.name);
    fetch(`api/get_random_song/${node.name}`).then((response) => {
      console.log(response);
      response.json().then((data) => {
        console.log(data);
        setCurrentSongPlaying(data.id);
      });
    });
  };

  //updates the properties of the graph
  const changeHandler = (e, value) => {
    if (value) {
      //slider
      setLocalGraphProperties({
        ...localGraphProperties,
        ["genrePopularity"]: value,
      });
    } else {
      setLocalGraphProperties({
        ...localGraphProperties,
        [e.target.name]: e.target.value,
      });
    }
  };

  //Dynamic headline
  if (data === null) {
    headline = "Fetching data...";
  } else {
    headline = "Genre graph";
  }

  //Dynamic graph type rendering
  if (graphType == "2D") {
    graph = (
      <Graph2D
        data={data}
        properties={localGraphProperties}
        userGenreMap={genreMap}
        strategy_genres={strategy_genres}
        height={graphHeight}
        width={graphWidth}
        nodeClickCallback={graphNodeClickCallback}
        selectViewMode={graphSelectViewMode}
        nodeClickStartMusicPlayback={nodeClickStartMusicPlayback}
      />
    );
  } else if (graphType == "3D") {
    graph = (
      <Graph3D
        data={data}
        properties={localGraphProperties}
        userGenreMap={genreMap}
        strategy_genres={strategy_genres}
        height={graphHeight}
        width={graphWidth}
        nodeClickCallback={graphNodeClickCallback}
        selectViewMode={graphSelectViewMode}
        nodeClickStartMusicPlayback={nodeClickStartMusicPlayback}
      />
    );
  }

  function handleLocalFilterChange(e){
    console.log("updating local genreFilter")
    setLocalGenreFilter(e.target.value)
  }

  //document.getElementById('genreFilter').value = localGraphProperties.genreFilter
  
  function updateGenreFilter(){
    console.log("updating global genreFilter")
    var value = document.getElementById('genreFilter').value

    setLocalGraphProperties({
      ...localGraphProperties,
      ['genreFilter']: value,
    });
  }

  const marks = [
    {
      value: 0,
      label: "All genres",
    },
    {
      value: 10,
      label: "",
    },
    {
      value: 20,
      label: "",
    },
    {
      value: 30,
      label: "",
    },
    {
      value: 40,
      label: "",
    },
    {
      value: 50,
      label: "",
    },
    {
      value: 60,
      label: "",
    },
    {
      value: 70,
      label: "",
    },
    {
      value: 80,
      label: "",
    },
    {
      value: 90,
      label: "",
    },
    {
      value: 100,
      label: "",
    },
    {
      value: 200,
      label: "",
    },
    {
      value: 300,
      label: "",
    },
    {
      value: 400,
      label: "",
    },
    {
      value: 500,
      label: "",
    },
    {
      value: 600,
      label: "",
    },
    {
      value: 700,
      label: "",
    },
    {
      value: 800,
      label: "",
    },
    {
      value: 900,
      label: "",
    },
    {
      value: 1000,
      label: "Most popular",
    },
  ];

  return (
    <Box className="container" style={{ width: "100%" }}>
      <Box
        display="flex"
        flexDirection={"column"}
        alignItems={"center"}
        justifyContent={"flex-start"}
        style={{
          borderRadius: 30,
          margin: 20,
          boxShadow:
            "rgba(0, 0, 0, 0.03) 0px 5px 10px, rgba(0, 0, 0, 0.23) 0px 4px 4px",
          padding: 10,
          backgroundColor: `${primaryGrey}`,
        }}
      >
        <Typography
          variant={"h4"}
          style={{ color: "white", paddingBottom: 10, fontWeight: "bold" }}
        >
          Graph properties
        </Typography>
        <Grid
          container
          direction="row"
          justifyContent={"space-between"}
          paddingLeft={5}
        >
          <Grid item>
            <InputLabel sx={{ color: "white" }} id="genrePopularity">
              Show genres by popularity
            </InputLabel>
            <Box sx={{ width: 300 }}>
              <WhiteSlider
                sx={{ color: primaryGreen }}
                id="genrePopularity"
                name="genrePopularity"
                defaultValue={0}
                //getAriaValueText={valuetext}
                min={0}
                max={1000}
                step={null}
                valueLabelDisplay="auto"
                marks={marks}
                onChangeCommitted={changeHandler}
                onChange={changeHandlerSlider}
                value={sliderValue}
              />
            </Box>
          </Grid>

          <Grid item>
            <InputLabel sx={{ color: "white" }} id="genreFilter-label">
              Filter genres
            </InputLabel>
            <Box sx={{ width: 300 }}>
              <TextField
                id="genreFilter"
                //label="Outlined"
                variant="standard"
                //defaultValue={localGraphProperties.genreFilter}
                defaultValue={localGraphProperties.genreFilter}
                //onChange={handleLocalFilterChange}
              />
              <Button onClick={() => updateGenreFilter()} variant="contained" size="small">
                APPLY
              </Button>
            </Box>
          </Grid>

          <Grid item>
            <InputLabel sx={{ color: "white" }} id="backgroundColorLabal">
              Background color
            </InputLabel>
            <WhiteSelect
              labelId="backgroundColorLabal"
              id="backgroundColor"
              name="backgroundColor"
              size="small"
              value={localGraphProperties.backgroundColor}
              onChange={(e) => changeHandler(e)}
            >
              <MenuItem value={"white"}>white</MenuItem>
              <MenuItem value={"black"}>black</MenuItem>
            </WhiteSelect>
          </Grid>

          <Grid item>
            <InputLabel sx={{ color: "white" }} id="graph-type-label">
              Graph type
            </InputLabel>
            <WhiteSelect
              defaultValue={graphType}
              labelId="graph-type-label"
              id="graph-type"
              size="small"
              onChange={(input) => {
                setGraphType(input.target.value);
              }}
            >
              <MenuItem value={"2D"}>2D</MenuItem>
              <MenuItem value={"3D"}>3D</MenuItem>
            </WhiteSelect>
          </Grid>
        </Grid>
      </Box>

      <Box
        height={"60%"}
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"flex-start"}
        alignItems={"center"}
        flexGrow={1}
      >
        {graph}
        <Box
          display={"flex"}
          width={"100%"}
          flexDirection={"row"}
          flexGrow={1}
          justifyContent={"space-evenly"}
          alignItems={"flex-start"}
        >
          {/* "#0258ad"; //blue
    
      "#057a01"; //green
 
      "#5c5c5c";//grey */}

          <Box display={"flex"} flexDirection={"row"}>
            <Circle style={{ color: "#5c5c5c" }} />
            <Typography style={{ color: "white" }}>
              {" "}
              = Unknown genres
            </Typography>
          </Box>
          <Box display={"flex"} flexDirection={"row"}>
            <Circle style={{ color: "#057a01" }} />
            <Typography style={{ color: "white" }}> = Your genres</Typography>
          </Box>
          <Box display={"flex"} flexDirection={"row"}>
            <Circle style={{ color: "#0258ad" }} />
            <Typography style={{ color: "white" }}>
              {" "}
              = Discovered genres
            </Typography>
          </Box>
          <Box display={"flex"} flexDirection={"row"}>
            <HorizontalRule style={{ color: "#ccc900" }} />
            <Typography style={{ color: "white" }}>
              {" "}
              = Smooth transition segment
            </Typography>
          </Box>
        </Box>
      </Box>
      {currentSongPlaying != null ? (
        <iframe
          style={{
            borderRadius: 12,
            position: "fixed",
            bottom: 30,
            left: "50%",
            marginLeft: -150,
          }}
          src={`https://open.spotify.com/embed/track/${currentSongPlaying}?utm_source=generator`}
          width="300"
          height={"80"}
          frameBorder={"0"}
          allowFullScreen={""}
          allow={"autoplay"}
        ></iframe>
      ) : (
        <></>
      )}
    </Box>
  );
}

export default Graph;
