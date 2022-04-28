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

  const graphRef = useRef(null);

  useEffect(() => {
    fetch("static/graph_data_2d.json")
      .then((response) => response.json())
      .then((data) => {
        //TODO check if data is ok
        setData(data);
      });
  }, [graphRef]); //empty array to avoid multiple fetches

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
    graph = <Graph2D data={data} properties={localGraphProperties} />;
  } else if (graphType == "3D") {
    graph = <Graph3D data={data} properties={localGraphProperties} />;
  } else if (graphType == "GraphColorTest") {
    var links = [];
    if (strategyData && Object.keys(strategyData)[0] == 3) {
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
      />
    );
  }

  return (
    <Box className="container" style={{ width: "100%" }}>
      <Box display={"flex"} flexDirection={"column"} alignItems={"center"}>
        <Typography
          variant={"h3"}
          style={{ fontWeight: "bold", color: "white" }}
        >
          {headline}
        </Typography>
      </Box>
      <Box
        style={{
          borderRadius: 200,
          margin: 5,
          boxShadow:
            "rgba(0, 0, 0, 0.03) 0px 5px 10px, rgba(0, 0, 0, 0.23) 0px 4px 4px",
          padding: 5,
          backgroundColor: `${primaryGrey}`,
        }}
      >
        <Typography variant={"h4"} style={{ color: "white" }}>
          Graph properties
        </Typography>
        <Grid container direction="row" justifyContent={"space-evenly"}>
          <Grid item>
            <InputLabel id="nodeAutoColorBy">nodeAutoColorBy</InputLabel>
            <Select
              labelId="nodeAutoColorBy"
              id="nodeAutoColorBy"
              label="nodeAutoColorBy"
              name="nodeAutoColorBy"
              value={localGraphProperties.nodeAutoColorBy}
              onChange={changeHandler}
            >
              <MenuItem value={"fy"}>fy</MenuItem>
              <MenuItem value={"fx"}>fx</MenuItem>
              <MenuItem value={"test"}>test</MenuItem>
            </Select>
          </Grid>

          <Grid item>
            <InputLabel id="backgroundColor">backgroundColor</InputLabel>
            <Select
              labelId="backgroundColor"
              id="backgroundColor"
              label="backgroundColor"
              name="backgroundColor"
              value={localGraphProperties.backgroundColor}
              onChange={changeHandler}
            >
              <MenuItem value={"white"}>white</MenuItem>
              <MenuItem value={"black"}>black</MenuItem>
            </Select>
          </Grid>

          <Grid item>
            <InputLabel id="enableNodeDrag">enableNodeDrag</InputLabel>
            <Switch
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
            <InputLabel id="graph-type">Graph type</InputLabel>
            <Select
              defaultValue={graphType}
              labelId="graph-type"
              id="graph-type"
              label="Graph type"
              name="graph-type"
              onChange={(input) => {
                setGraphType(input.target.value);
              }}
            >
              <MenuItem value={"GraphColorTest"}>GraphColorTest</MenuItem>
              <MenuItem value={"2D"}>2D</MenuItem>
              <MenuItem value={"3D"}>3D</MenuItem>
            </Select>
          </Grid>
        </Grid>
      </Box>

      <Box
        height={"80%"}
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"center"}
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
