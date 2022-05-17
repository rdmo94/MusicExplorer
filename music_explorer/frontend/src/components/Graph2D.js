import React from "react";
import SpriteText from "three-spritetext";
import { graph_data_prettyfier, replace_special_characters } from "../Util";
import { useState, useEffect } from "react";
import { primaryGrey } from "../Colors";

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
 * @param {Map<String,number>} param.userGenreMap Map<genre,occurrence>
 * @param {Map<number,list<String>>} param.strategy Map<strategy_number,list<genres>>
 * @param {List<String>} param.links List<genres>
 * @returns 
 */
function Graph2D({ data, properties, userGenreMap, strategy_genres, height, width, nodeClickCallback, selectViewMode}) {
  console.log(data)
  function getNodeVisibility(node){
    const min_node_weight = 10 //CONFIG
    if (selectViewMode == "source"){
      if (!(node.name in userGenreMap)){
        return false;
      }
    } else if (selectViewMode == "target"){
      if (node.name in userGenreMap){
        return false;
      }
    }
    if (strategy_genres.includes(node.name)) return true;
    if (node.weight > min_node_weight) return true;
    else return false;
    
  }

  function getNodeVal(node, globalScale) {
    const base_size = 10/globalScale;
    const max_size = base_size+(10/globalScale)//4
    const min_size = base_size//1
    
    const occurrence_divider = 8
    const weight_divider = 100
    const strategy_size = base_size+(10/globalScale)//6


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
        if (node.weight/weight_divider > min_size){
          if (node.weight/weight_divider > max_size){
            return max_size
          } else {
            return node.weight/weight_divider;
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
      replace_special_characters(node.name, false)//+
      //  " [" +
      //  getNodeVal(node, globalScale).toString() +
      //  "]"
    ); //TODO remove last part - only for testing
  }

  function getNodeColor(node) {
    if (strategy_genres && strategy_genres.includes(node.name)) {
      //console.log(node.name + " in " + strategy_genres)
      return '#0258ad'; //blue
    } else if (userGenreMap && node.name in userGenreMap) {
      return '#057a01'; //green
    } 
    else {
      return '#5c5c5c'; //grey
    }
  }

  function getNodeBackgroundFillStyle(node) {
    if (strategy_genres && strategy_genres.includes(node.name)) {
      return 'rgba(255, 255, 255, 0.8)'; //darker grey
    } else {
      return 'rgba(255, 255, 255, 0.1)'; //light grey
    } 
  }

  
  return (
    <ForceGraph2D
      height={height}
      width={width}
      backgroundColor={'white'}//{primaryGrey}
      enableNodeDrag={properties.enableNodeDrag}
      onNodeClick={nodeClickCallback}
      graphData={data}
      //nodeAutoColorBy={node => node.name in userGenreMap}
      nodeVisibility={(node) => getNodeVisibility(node)}
      nodeColor={(node) => getNodeColor(node)}
      nodeLabel={(node) => getNodeLabel(node)} //label when hovering
      //nodeVal={(node) => getNodeVal(node)}
      
      //nodeVal={node => node.name in userGenreMap ? userGenreMap[node.name].value : 1}
      //nodeVal={100}
      nodeCanvasObject={(node, ctx, globalScale) => {
        const label = getNodeLabel(node);
        // const fontSize = (getNodeVal(node) * 12) / globalScale; //higher is smaller?
        const fontSize = (getNodeVal(node, globalScale)); //higher is smaller?
        ctx.font = `${fontSize}px Sans-Serif`;
        const textWidth = ctx.measureText(label).width;
        const bckgDimensions = [textWidth, fontSize].map(
          (n) => n + fontSize * 0.2
        ); // some padding

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = getNodeBackgroundFillStyle(node);
        ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);
        ctx.fillStyle = getNodeColor(node);
        ctx.fillText(label, node.x, node.y);

        node.__bckgDimensions = bckgDimensions; // to re-use in nodePointerAreaPaint
      }}
      nodePointerAreaPaint={(node, color, ctx) => {
        ctx.fillStyle = color;
        const bckgDimensions = node.__bckgDimensions;
        bckgDimensions && ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);
      }}
      minZoom={2}
      //zoom={0.2} //doesnt work.. zz
      linkColor={() => '#0258ad'}
      linkOpacity={0.9}
      linkWidth={8}
    />
  );
}

export default Graph2D;