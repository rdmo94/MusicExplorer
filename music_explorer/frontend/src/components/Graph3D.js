import React from "react";
import {useState} from "react";
import SpriteText from "three-spritetext";
import { graph_data_prettyfier, replace_special_characters } from "../Util";

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
import { StrikethroughS } from "@mui/icons-material";

function Graph3D({
  data,
  properties,
  userGenreMap,
  strategy_genres,
  height,
  width,
  nodeClickCallback,
  selectViewMode,
  graphIsLoadedCallback,
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

  function getNodeVal(node) {
    const occurrence_divider = 2;
    const weight_divider = 100;
    const max_size = 0.2;
    const min_size = 0.1;
    const strategy_size = max_size + 0.2;

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
        if ((node.weight / weight_divider) > min_size) {
          if ((node.weight / weight_divider) > max_size) {
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
      return "#057a01"; //green
    } else {
      return "#5c5c5c"; //grey
    }
  }

  function nodeClickCallbackFix(node){
    if (selectViewMode == "source" || selectViewMode == "target") {
      nodeClickCallback(node)
    } 
  }

  const { useRef } = React;
  const fgRef = useRef();

  return (
    <div>
      <ForceGraph3D
        ref={fgRef}
        onEngineStop={() => {
          fgRef.current.zoomToFit(400)
          setGraphLoaded(true)
        }}
        height={height}
        width={width}
        backgroundColor={properties.backgroundColor}
        graphData={data}
        onNodeClick={nodeClickCallbackFix}
        nodeThreeObject={(node) => {
          const sprite = new SpriteText(getNodeLabel(node));
          sprite.color = getNodeColor(node);
          sprite.textHeight = getNodeVal(node);
          sprite.strokeWidth = 1;
          sprite.strokeColor = "lightgrey";
          //sprite.borderWidth = 0.01
          //sprite.backgroundColor = 'rgba(0,0,0,0.1)';
          
          return sprite;
        }}
        enableNodeDrag={false}
        nodeVisibility={(node) => getNodeVisibility(node)}
        nodeLabel={(node) => getNodeLabel(node)} //label when hovering
        nodeVal={(node) => getNodeVal(node)}
        //zoom={0.2} //doesnt work.. zz
        linkColor={() => "#ccc900"}
        //zoomToFit={(1, 700, (_node) => true)}
        linkOpacity={0.9}
        linkWidth={0.2}
      />
      {graphLoaded ? (
        ""
      ) : (
        <Box
          backgroundColor={"rgba(0, 0, 0, 0.4)"}
          borderRadius={200}
          position={"fixed"}
          flexDirection={"column"}
          justifyContent={"center"}
          alignItems={"center"}
          flexGrow={3}
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

export default Graph3D;
