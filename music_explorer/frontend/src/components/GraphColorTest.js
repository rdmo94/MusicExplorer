import React from "react";
import SpriteText from "three-spritetext";
import { graph_data_prettyfier, replace_special_characters } from "../Util";

import {
  ForceGraph2D,
  ForceGraph3D,
  ForceGraphVR,
  ForceGraphAR,
  GraphData,
} from "react-force-graph";

/**
 * 
 * @param {object} param 
 * @param {object} param.data
 * @param {object} param.properties graph properties
 * @param {Map<string,number>} param.userGenreMap Map<genre,occurrence>
 * @param {Map<number,list<string>>} param.strategy Map<strategy_number,list<genres>>
 * @returns 
 */
function GraphColorTest({ data, properties, userGenreMap, strategy}) {
  //console.log("userGenreMap", userGenreMap);
  //console.log("data", data);

  //fix genre names in data

  //fix genre names in userGenreMap

  //fix genre names in strategy
  
  var strategy_number = undefined
  var strategy_genres = []

  if (strategy){
    //console.log(strategy)
    strategy_number = Object.keys(strategy)[0]
    //console.log("strategy_number", strategy_number)
    strategy_genres = strategy[strategy_number]
    //console.log("strategy_genres", strategy_genres)
  }

  //Genres found in selected user playlists
  var userGenres = {
    pop: 2,
    rock: 5,
    techno: 3,
  };

  for (var key in userGenreMap) {
    var value = userGenreMap[key];
    // console.log(key, value)
  }

  function getNodeVal(node) {
    if (userGenreMap) {
      if (node.name in userGenreMap) {
        var knownGenreSize = userGenreMap[node.name] / 8;
        if (knownGenreSize > 1) return knownGenreSize;
        else return 1;
      } else {
        return 1;
      }
    } else {
      return 1;
    }
  }

  function getNodeLabel(node) {
    return (
      replace_special_characters(node.name, false) +
      " [" +
      getNodeVal(node).toString() +
      "]"
    ); //TODO remove last part - only for testing
  }

  function getNodeColor(node) {
    if (node.name in userGenreMap) {
      return "green";
    } 
    else if (strategy_genres.includes(node.name)) {
      //console.log(node.name + " in " + strategy_genres)
      return "blue";
    } 
    else {
      return "red";
    }
  }

  return (
    <ForceGraph2D
      height={1000}
      width={1000}
      backgroundColor={properties.backgroundColor}
      enableNodeDrag={properties.enableNodeDrag}
      graphData={data}
      //nodeAutoColorBy={node => node.name in userGenreMap}
      nodeColor={(node) => getNodeColor(node)}
      nodeLabel={(node) => getNodeLabel(node)} //label when hovering
      nodeVal={(node) => getNodeVal(node)}
      //nodeVal={node => node.name in userGenreMap ? userGenreMap[node.name].value : 1}
      //nodeVal={100}
      nodeCanvasObject={(node, ctx, globalScale) => {
        const label = getNodeLabel(node);
        const fontSize = (getNodeVal(node) * 12) / globalScale;
        ctx.font = `${fontSize}px Sans-Serif`;
        const textWidth = ctx.measureText(label).width;
        const bckgDimensions = [textWidth, fontSize].map(
          (n) => n + fontSize * 0.2
        ); // some padding

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = getNodeColor(node);
        ctx.fillText(label, node.x, node.y);

        node.__bckgDimensions = bckgDimensions; // to re-use in nodePointerAreaPaint
      }}
    />
  );
}

export default GraphColorTest;
