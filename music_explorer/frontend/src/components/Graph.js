import React, { useState, useEffect } from "react";
import Graph3D from './Graph3D'
import Graph2D from './Graph2D'

function Graph() {
  const [data, setData] = useState(null);
  const [dimensions, setDimensions] = useState(null)

  useEffect(() => {
    fetch("static/graph_data_3d.json")
    .then(response => response.json())
    .then(data => {
      //TODO check if data is ok 
      setData(data)
    })
  },[]) //empty array to avoid multiple fetches

  let graph;
  let headline;

  //Dynamic headline
  if (data === null) {
    headline = "Fetching data..."
  } else {
    headline = "Genre graph"
  }

  //Dynamic graph type rendering
  if (dimensions == 2){
    graph = <Graph2D data={data}/>
  } else if (dimensions == 3){
    graph = <Graph3D data={data}/>
  }

  return (
    <div>
      <h1>{headline}</h1>
      <div>
        <label for="dimension-select">Graph style: </label>
        <select name="dimensions" id="dimension-select" onChange={(input) => setDimensions(input.target.value)}>
            <option value="">--Please select dimensions--</option>
            <option value="2">2D</option>
            <option value="3">3D</option>
        </select>
        <br></br>
      </div>

      {graph}

    </div>
  );
}

export default Graph;