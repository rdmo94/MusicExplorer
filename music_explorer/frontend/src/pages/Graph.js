import React, { useState, useEffect, useRef } from "react";
import Graph3D from "../components/Graph3D";
import Graph2D from "../components/Graph2D";
import GraphColorTest from "../components/GraphColorTest";
import Grid from "@mui/material/Grid";
import { Box } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import Switch from "@mui/material/Switch";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useLocalStorage } from "../Util";
import { Typography } from "@material-ui/core";
import { primaryGrey, primaryGreyDark, primaryGreyLight } from "../Colors";
import { styled } from "@mui/material";

const WhiteSelect = styled(Select)(({ theme }) => ({
  color: "white",
  "& .MuiSvgIcon-root": {
    color: "white",
  },
  borderColor: "white",
}));
function Graph({ genreMap, strategyData }) {
  const [data, setData] = useState();
  const [graphType, setGraphType] = useLocalStorage("graphType", "");
  const [localGraphProperties, setLocalGraphProperties] = useLocalStorage(
    "graphProperties",
    {
      backgroundColor: "white",
      enableNodeDrag: false,
      nodeAutoColorBy: "",
    }
  );

  const [graphHeight, setGraphHeight] = useState();
  const [graphWidth, setGraphWidth] = useState();

  const graphRef = useRef(null);

  useEffect(() => {
    let availableSizeElement = document.getElementById("graph");
    if (availableSizeElement) {
      setGraphHeight(availableSizeElement.clientHeight / 2);
      setGraphWidth(availableSizeElement.clientWidth / 2.1);
    }
    
  }, [graphRef]); 

  //Different useEffect, as the one above gets called every time the graphRef changes
  useEffect(() => {
    
    fetch("static/graph_data_2d.json")
      .then((response) => response.json()
      .then((data) => {
        //TODO check if data is ok
        setData(data);
      }));
    
  }, []); //empty array to avoid multiple fetches

  let graph;
  let headline;

  //updates the properties of the graph
  const changeHandler = (e) => {
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
        height={graphHeight}
        width={graphWidth}
      />
    );
  } else if (graphType == "3D") {
    graph = (
      <Graph3D
        data={data}
        properties={localGraphProperties}
        height={graphHeight}
        width={graphWidth}
      />
    );
  } else if (graphType == "GraphColorTest") {
    var links = [];
    console.log("strategyData", strategyData)
    if (strategyData && Object.keys(strategyData)[0] == '3') {
      //strategy 3 is path strategy
      links = Object.values(strategyData)[0];
    }
    graph = (
      <GraphColorTest
        data={data}
        properties={localGraphProperties}
        userGenreMap={genreMap}
        strategy={strategyData}
        links={links}
        height={graphHeight}
        width={graphWidth}
      />
    );
  }

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
            <InputLabel sx={{ color: "white" }} id="nodeAutoColorBy">
              nodeAutoColorBy
            </InputLabel>
            <WhiteSelect
              labelId="nodeAutoColorBy"
              id="nodeAutoColorBy"
              // label="nodeAutoColorBy"
              // name="nodeAutoColorBy"
              value={localGraphProperties.nodeAutoColorBy}
              onChange={changeHandler}
            >
              <MenuItem value={"fy"}>fy</MenuItem>
              <MenuItem value={"fx"}>fx</MenuItem>
              <MenuItem value={"test"}>test</MenuItem>
            </WhiteSelect>
          </Grid>

          <Grid item>
            <InputLabel sx={{color: "white"}} id="backgroundColor">backgroundColor</InputLabel>
            <WhiteSelect
              labelId="backgroundColor"
              id="backgroundColor"
              // label="backgroundColor"
              // name="backgroundColor"
              value={localGraphProperties.backgroundColor}
              onChange={changeHandler}
            >
              <MenuItem value={"white"}>white</MenuItem>
              <MenuItem value={"black"}>black</MenuItem>
            </WhiteSelect>
          </Grid>

          <Grid item>
            <InputLabel sx={{ color: "white" }} id="enableNodeDrag">
              enableNodeDrag
            </InputLabel>
            <Switch
              sx={{ color: "white" }}
              checked={localGraphProperties.enableNodeDrag}
              name="enableNodeDrag"
              onChange={(e) =>
                setLocalGraphProperties({
                  ...localGraphProperties,
                  [e.target.name]: e.target.checked,
                })
              }
            />
          </Grid>
          <Grid item>
            <InputLabel sx={{ color: "white" }} id="graph-type">
              Graph type
            </InputLabel>
            <WhiteSelect
              defaultValue={graphType}
              labelId="graph-type"
              id="graph-type"
              // label="Graph type"
              // name="graph-type"
              onChange={(input) => {
                setGraphType(input.target.value);
              }}
            >
              <MenuItem value={"GraphColorTest"}>GraphColorTest</MenuItem>
              <MenuItem value={"2D"}>2D</MenuItem>
              <MenuItem value={"3D"}>3D</MenuItem>
            </WhiteSelect>
          </Grid>
        </Grid>
      </Box>

      <Box
        height={"80%"}
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"flex-start"}
        alignItems={"center"}
        flexGrow={1}
        paddingTop={5}
      >
        {graph}
      </Box>
    </Box>
  );
}

export default Graph;
