import React from "react";
import SpriteText from "three-spritetext";
import { graph_data_prettyfier } from "../Util";

import {
  ForceGraph2D,
  ForceGraph3D,
  ForceGraphVR,
  ForceGraphAR,
  GraphData,
} from "react-force-graph";



function GraphColorTest(props) {
  //Genres found in selected user playlists
  var userGenres = {
    "pop":2,
    "rock":5,
    "techno":3
  }

  for(var key in userGenres) {
    var value = userGenres[key];
    console.log(key, value)
  }

  function getNodeVal(node){
    if (node.name in userGenres){
      return userGenres[node.name]
    } else {
      return 1;
    }
  }

  function getNodeLabel(node){
    return node.name + "[" +getNodeVal(node).toString() + "]"
  }

  function getNodeColor(node){
    if (node.name in userGenres){
      return "green";
    } else{
      return "red"
    }
  }
  
  return (
    <ForceGraph2D
      backgroundColor={props.properties.backgroundColor}
      enableNodeDrag={props.properties.enableNodeDrag}
      graphData={props.data}
      //nodeAutoColorBy={node => node.name in userGenres}
      nodeColor={node => getNodeColor(node)}
      nodeLabel={node => getNodeLabel(node)} //label when hovering
      nodeVal={node => getNodeVal(node)}
      //nodeVal={node => node.name in userGenres ? userGenres[node.name].value : 1}
      //nodeVal={100}
      nodeCanvasObject={(node, ctx, globalScale) => {
        const label = getNodeLabel(node)
        const fontSize = (getNodeVal(node)*12) / globalScale;
        ctx.font = `${fontSize}px Sans-Serif`;
        const textWidth = ctx.measureText(label).width;
        const bckgDimensions = [textWidth, fontSize].map(
          (n) => n + fontSize * 0.2
        ); // some padding

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = getNodeColor(node)
        ctx.fillText(label, node.x, node.y);

        node.__bckgDimensions = bckgDimensions; // to re-use in nodePointerAreaPaint
      }}
    />
  );
}

export default GraphColorTest;
