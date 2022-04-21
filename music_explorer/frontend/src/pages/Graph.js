import React, { useState, useEffect } from "react";
import Graph3D from "../components/Graph3D";
import Graph2D from "../components/Graph2D";
import GraphColorTest from "../components/GraphColorTest";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import Switch from "@mui/material/Switch";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useLocalStorage } from "../Util"

function Graph({genreMap}) {
  const [data, setData] = useState();
  const [graphType, setGraphType] = useLocalStorage("graphType", "")
  const [localGraphProperties, setLocalGraphProperties] = useLocalStorage("graphProperties", {
    backgroundColor: "white",
    enableNodeDrag: false,
    nodeAutoColorBy: "",
  })

  useEffect(() => {
    fetch("static/graph_data_2_no_link.json")
      .then((response) => response.json())
      .then((data) => {
        //TODO check if data is ok
        setData(data);
      });
  }, []); //empty array to avoid multiple fetches

  let graph;
  let headline;

  //updates the properties of the graph
  const changeHandler = (e) => {
    //setGraphProperties({ ...graphProperties, [e.target.name]: e.target.value });
    setLocalGraphProperties({ ...localGraphProperties, [e.target.name]: e.target.value })
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
    graph = <GraphColorTest data={data} properties={localGraphProperties} userGenreMap={genreMap}/>;
  } 

  return (
    <div>
      <h1>{headline}</h1>
      <h2>Graph properties</h2>

      <Grid container spacing={9} direction="row">
        <Grid item xs={3}>
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

        <Grid item xs={3}>
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

        <Grid item xs={3}>
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
      </Grid>
      {console.log("rendered select element")}
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <InputLabel id="graph-type">Graph type</InputLabel>
          <Select
            defaultValue={graphType}
            labelId="graph-type"
            id="graph-type"
            label="Graph type"
            name="graph-type"
            onChange={
              (input) => {
                console.log("onChange called on select element");
                setGraphType(input.target.value)
              }
            }
            >
            <MenuItem value={"GraphColorTest"}>GraphColorTest</MenuItem>
            <MenuItem value={"2D"}>2D</MenuItem>
            <MenuItem value={"3D"}>3D</MenuItem>
          </Select>
        </Grid>
      </Grid>

      {graph}
    </div>
  );
}



export default Graph;
