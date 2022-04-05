import React, { useState, useEffect } from "react";
import Graph3D from './Graph3D'
import Graph2D from './Graph2D'

function Sean() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("static/graph_data_3d.json")
    .then(response => response.json())
    .then(data => {
      //TODO check if data is ok 
      setData(data)
    })
  },[]) //empty array to avoid multiple fetches

  //While fetching
  if (data === null) {
    return (
      <div>
        <h1>fetching data...</h1>
        <h1>fetching data...</h1>
        <h1>fetching data...</h1>
      </div>
    
    );
  }

  return (
    <div>
      <h1>Seanss page</h1>
        <Graph2D data={data}/>
    </div>
  );
}

export default Sean;