import React, { useState, useEffect, useRef } from "react";
import Graph3D from "../components/Graph3D";
import Graph2D from "../components/Graph2D";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import Switch from "@mui/material/Switch";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useLocalStorage } from "../Util";
import { Typography } from "@material-ui/core";
import { primaryGrey, primaryGreyDark, primaryGreyLight } from "../Colors";
import { styled, CircularProgress, LinearProgress, Slider, Box } from "@mui/material";

const WhiteSelect = styled(Select)(({ theme }) => ({
  color: "white",
  "& .MuiSvgIcon-root": {
    color: "white",
  },
  borderColor: "white",
}));
function Graph({
  genreMap,
  strategyData,
  graphNodeClickCallback,
  graphSelectViewMode,
}) {
  const [data, setData] = useState();
  const [graphType, setGraphType] = useLocalStorage("graphType", "2D");
  const [localGraphProperties, setLocalGraphProperties] = useLocalStorage(
    "graphProperties",
    {
      backgroundColor: "white",
      genrePopularity: 0,
    }
  );
  const [graphHeight, setGraphHeight] = useState();
  const [graphWidth, setGraphWidth] = useState();
  const graphRef = useRef(null);
  const [graphLoaded, setGraphLoaded] = useState(false);

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

  //console.log("links", links)
  //console.log("genre links", links)
  //console.log("genreIdLinks", genreIdLinks)
  //console.log("data", data)
  // console.log("links from graphcolortest", links)
  // console.log("genreIdLinks from graphcolortest", genreIdLinks)
  //console.log("new data", data)

  function convert_genre_list_to_graph_links(genreList) {
    var graphReadableLinks = [];
    for (var i = 0; i < genreList.length - 1; i++) {
      var link = { source: genreList[i], target: genreList[i + 1] };
      graphReadableLinks.push(link);
    }
    //console.log(graphReadableLinks)
    return graphReadableLinks;
  }

  function translate_genre_links_to_node_id_links(links) {
    function get_node_id_from_genre(genre_nodes, genre) {
      for (var i = 0; i < genre_nodes.length; i++) {
        if (genre_nodes[i].name == genre) return genre_nodes[i].id;
      }
      //console.log(genre + "'s id was not found... :/")
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
        //console.log("could not find id links from " + links[i].source + " to " + links[i].target)
      }
    }
    return newLinks;
  }

  function reorderData() {
    if (data) {
      if (strategy_genres) {
        for (var i = 0; i < strategy_genres.length; i++) {
          var strategy_genre = strategy_genres[i];
          var indexOfGenre = getNodeIndexOfGenre(strategy_genre);
          moveIndexToEndOfNodes(indexOfGenre);
        }
      }
      if (user_genres) {
        for (var i = 0; i < user_genres.length; i++) {
          var user_genre = user_genres[i];
          var indexOfGenre = getNodeIndexOfGenre(user_genre);
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
    let availableSizeElement = document.getElementById("graph");
    if (availableSizeElement) {
      setGraphHeight(availableSizeElement.clientHeight / 2);
      setGraphWidth(availableSizeElement.clientWidth / 2.1);
    }
  }, [graphRef]);

  //Different useEffect, as the one above gets called every time the graphRef changes
  useEffect(() => {
    if (graphType) {
      var file =
        graphType == "3D"
          ? "static/graph_data_3d.json"
          : "static/graph_data_2d.json";
      console.log("fetching new graph " + file);
      fetch(file).then((response) =>
        response.json().then((data) => {
          //TODO check if data is ok
          setData(data);
        })
      );
    }
  }, [graphType]); //empty array to avoid multiple fetches

  let graph;
  let headline;

  //updates the properties of the graph
  const changeHandler = (e) => {
    console.log(e.target);
    //setGraphProperties({ ...graphProperties, [e.target.name]: e.target.value });
    setLocalGraphProperties({
      ...localGraphProperties,
      [e.target.name]: e.target.value,
    });
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
        graphIsLoadedCallback={setGraphLoaded}
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
        graphIsLoadedCallback={setGraphLoaded}
      />
    );
  }

  const marks = [
    {
      value: 0,
      label: "All genres",
    },
    {
      value: 10,
      label: ""
    },
    {
      value: 20,
      label: ""
    },
    {
      value: 30,
      label: ""
    },
    {
      value: 40,
      label: ""
    },
    {
      value: 50,
      label: ""
    },
    {
      value: 60,
      label: ""
    },
    {
      value: 70,
      label: ""
    },
    {
      value: 80,
      label: ""
    },
    {
      value: 90,
      label: ""
    },
    {
      value: 100,
      label: ""
    },
    {
      value: 200,
      label: ""
    },
    {
      value: 300,
      label: ""
    },
    {
      value: 400,
      label: ""
    },
    {
      value: 500,
      label: ""
    },
    {
      value: 600,
      label: ""
    },
    {
      value: 700,
      label: ""
    },
    {
      value: 800,
      label: ""
    },
    {
      value: 900,
      label: ""
    },
    {
      value: 1000,
      label: "Most popular",
    },
  ];

  return (
    <Box className="container" style={{ width: "100%" }}>
      {/* <Box display={"flex"} flexDirection={"column"} alignItems={"center"}>
        <Typography
          variant={"h3"}
          style={{ fontWeight: "bold", color: "white" }}
        >
          {headline}
        </Typography>
      </Box> */}
      <Box
        display="flex"
        flexDirection={"column"}
        alignItems={"center"}
        justifyContent={"space-evenly"}
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
          style={{ color: "white", paddingBottom: 10 }}
        >
          Graph properties
        </Typography>
        <Grid container direction="row" justifyContent={"space-between"}>
          <Grid item>
            <InputLabel sx={{ color: "white" }} id="genrePopularity">
              Show genres by popularity
            </InputLabel>
            <Box sx={{ width: 300 }}>
              <Slider
                id="genrePopularity"
                name="genrePopularity"
                defaultValue={5}
                //getAriaValueText={valuetext}
                min={0}
                max={1000}
                step={null}
                valueLabelDisplay="auto"
                marks={marks}
                onChange={changeHandler}
                value={localGraphProperties.genrePopularity}
              />
            </Box>
          </Grid>

          <Grid item>
            <InputLabel sx={{ color: "white" }} id="backgroundColorLabal">
              backgroundColor
            </InputLabel>
            <WhiteSelect
              labelId="backgroundColorLabal"
              id="backgroundColor"
              name="backgroundColor"
              value={localGraphProperties.backgroundColor}
              onChange={changeHandler}
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
        height={"70%"}
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"flex-start"}
        alignItems={"center"}
        flexGrow={1}
        paddingTop={5}
      >
        {graph}
        {graphLoaded ? (
          ""
        ) : (
          <Box
            height={"70%"}
            flexDirection={"row"}
            justifyContent={"center"}
            alignItems={"center"}
            flexGrow={3}
            paddingTop={3}
          >
            <div>
              Graph is loading...
              <LinearProgress />
            </div>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default Graph;
