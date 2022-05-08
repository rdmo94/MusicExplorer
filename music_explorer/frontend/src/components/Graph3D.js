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

function Graph3D({
  data,
  properties,
  userGenreMap,
  strategy_genres,
  height,
  width,
  nodeClickCallback,
  selectViewMode,
}) {
  function getNodeVisibility(node) {
    const min_node_weight = 10; //CONFIG
    if (selectViewMode == "source") {
      if (!(node.name in userGenreMap)) {
        return false;
      }
    } else if (selectViewMode == "target") {
      if (node.name in userGenreMap) {
        return false;
      }
    }
    if (node.weight > min_node_weight) return true;
    else return false;
  }

  function getNodeVal(node) {
    const occurrence_divider = 8;
    const weight_divider = 400;
    const max_size = 4;
    const min_size = 1;
    const strategy_size = 6;

    if (userGenreMap) {
      if (strategy_genres && strategy_genres.includes(node.name)) {
        return strategy_size;
      } else if (node.name in userGenreMap) {
        var knownGenreSize = userGenreMap[node.name] / occurrence_divider;
        if (knownGenreSize > max_size) return max_size;
        else if (knownGenreSize > min_size) return knownGenreSize;
        else return min_size;
      } else {
        //determine size based on weight
        if (node.weight / weight_divider > min_size) {
          if (node.weight / weight_divider > max_size) {
            return max_size;
          } else {
            return node.weight / weight_divider;
          }
        } else {
          return min_size;
        }
      }
    } else {
      return min_size;
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
    if (strategy_genres && strategy_genres.includes(node.name)) {
      //console.log(node.name + " in " + strategy_genres)
      return "blue";
    } else if (userGenreMap && node.name in userGenreMap) {
      return "green";
    } else {
      return "red";
    }
  }

  return (
    <ForceGraph3D
      height={height}
      width={width}
      backgroundColor={properties.backgroundColor}
      graphData={data}
      nodeThreeObject={(node) => {
        const sprite = getNodeLabel(node);
        sprite.color = getNodeColor(node)
        sprite.textHeight = 0.5;
        return sprite;
      }}
      nodeVisibility={(node) => getNodeVisibility(node)}
      //nodeLabel={(node) => } //label when hovering
      nodeVal={(node) => getNodeVal(node)}
    />
  );
}

export default Graph3D;
