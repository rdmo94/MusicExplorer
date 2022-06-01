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
import {
  styled,
  CircularProgress,
  LinearProgress,
  Slider,
  Box,
  Typography,
} from "@mui/material";

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
function Graph2D({
  data,
  properties,
  userGenreMap,
  strategy_genres,
  height,
  width,
  nodeClickCallback,
  selectViewMode,
}) {
  const [graphLoaded, setGraphLoaded] = useState(false);

  function getNodeVisibility(node) {
    const min_node_weight = properties.genrePopularity;
    if (strategy_genres.includes(node.name)) return true;

    if (node.weight < min_node_weight) return false;
    else if (selectViewMode == "source") {
      if (!(node.name in userGenreMap)) {
        return false;
      } else {
        return true;
      }
    } else if (selectViewMode == "target") {
      if (node.name in userGenreMap) {
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  }

  function getNodeVal(node, globalScale) {
    // globalScale *= 0.5;
    const base_size = 12 / globalScale;
    // const max_size = base_size + 10 / globalScale; //4
    const max_size = base_size * 1.8
    const min_size = base_size * 0.8; //1

    const occurrence_divider = 8;
    const weight_divider = 100;
    const strategy_size = base_size + 10 / globalScale; //6

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
    return replace_special_characters(node.name, false); //+
    //  " [" +
    //  getNodeVal(node, globalScale).toString() +
    //  "]" //TODO remove last part - only for testing
  }

  function getNodeColor(node) {
    if (strategy_genres && strategy_genres.includes(node.name)) {
      //console.log(node.name + " in " + strategy_genres)
      return "#0258ad"; //blue
    } else if (userGenreMap && node.name in userGenreMap) {
      return "#08bd02"; //green
    } else {
      return "#5c5c5c"; //grey
    }
  }

  function getNodeBackgroundFillStyle(node) {
    if (strategy_genres && strategy_genres.includes(node.name)) {
      return "rgba(255, 255, 255, 0.9)"; //less transparent white
    } else if (userGenreMap && node.name in userGenreMap) {
      return "rgba(255, 255, 255, 0.9)";
    } else {
      return "rgba(255, 255, 255, 0.05)"; //transparent white
    }
  }

  function nodeClickCallbackFix(node) {
    if (selectViewMode == "source" || selectViewMode == "target") {
      nodeClickCallback(node);
    }
  }

  return (
    <div>
      <ForceGraph2D
        height={height}
        width={width}
        backgroundColor={properties.backgroundColor} //{primaryGrey}
        enableNodeDrag={false}
        onNodeClick={nodeClickCallbackFix}
        graphData={data}
        onEngineStop={() => {
          setGraphLoaded(true);
        }}
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
          const fontSize = getNodeVal(node, globalScale); //higher is smaller?
          ctx.font = `${fontSize}px Sans-Serif`;
          const textWidth = ctx.measureText(label).width;
          const bckgDimensions = [textWidth, fontSize].map(
            (n) => n + fontSize * 0.5 //0.2
          ); // some padding

          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillStyle = getNodeBackgroundFillStyle(node);
          ctx.fillRect(
            node.x - bckgDimensions[0] / 2,
            node.y - bckgDimensions[1] / 2,
            ...bckgDimensions
          );
          ctx.fillStyle = getNodeColor(node);
          ctx.fillText(label, node.x, node.y);

          node.__bckgDimensions = bckgDimensions; // to re-use in nodePointerAreaPaint
        }}
        nodePointerAreaPaint={(node, color, ctx) => {
          ctx.fillStyle = color;
          const bckgDimensions = node.__bckgDimensions;
          bckgDimensions &&
            ctx.fillRect(
              node.x - bckgDimensions[0] / 2,
              node.y - bckgDimensions[1] / 2,
              ...bckgDimensions
            );
        }}
        minZoom={0.8}
        //zoom={0.2} //doesnt work.. zz
        linkColor={() => "#ccc900"}
        linkOpacity={0.9}
        linkWidth={6}
        linkCurvature={0.1}
        linkDirectionalParticles={1}
        linkDirectionalParticleColor={"black"}
      />
      {graphLoaded ? (
        ""
      ) : (
        <Box
          backgroundColor={"rgba(0, 0, 0, 0.4)"}
          borderRadius={"0 0 20px 20px"}
          flexDirection={"row"}
          justifyContent={"center"}
          alignItems={"center"}
          paddingTop={1}
          paddingLeft={3}
          paddingRight={3}
          paddingBottom={1}
          bottom={30}
        >
          <div>
            <Typography style={{ color: "white" }}>
              Graph is loading...
            </Typography>
            <LinearProgress />
          </div>
        </Box>
      )}
    </div>
  );
}

export default Graph2D;
