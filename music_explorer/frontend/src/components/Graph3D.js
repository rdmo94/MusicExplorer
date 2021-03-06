import React from "react";
import { useState } from "react";
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
  nodeClickStartMusicPlayback,
}) {
  const [graphLoaded, setGraphLoaded] = useState(false);

  function getNodeVisibility(node) {
    const min_node_weight = properties.genrePopularity;
    if (strategy_genres.includes(node.name)) return true;

    if (properties.genreFilter){
      if (node.name.includes(properties.genreFilter)) return true;
      else return false;
    }

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
  }

  function getNodeColor(node) {
    if (strategy_genres && strategy_genres.includes(node.name)) {
      return "#0258ad"; //blue
    } else if (userGenreMap && node.name in userGenreMap) {
      return "#08bd02"; //green
    } else {
      return "#5c5c5c"; //grey
    }
  }

  function nodeClickCallbackFix(node) {
    if (selectViewMode == "source" || selectViewMode == "target") {
      nodeClickCallback(node);
    } else {
      nodeClickStartMusicPlayback(node);
    }
  }

  function getNodeBackgroundFillStyle(node) {
    if (strategy_genres && strategy_genres.includes(node.name)) {
      return "rgba(255, 255, 255, 0.9)"; //less transparent white
    } else if (userGenreMap && node.name in userGenreMap) {
      return "rgba(255, 255, 255, 0.9)";
    } else {
      return "rgba(255, 255, 255, 0.07)"; //transparent white
    }
  }

  const { useRef } = React;
  const fgRef = useRef();

  return (
    <div>
      <ForceGraph3D
        backgroundColor={properties.backgroundColor}
        ref={fgRef}
        onEngineStop={() => {
          fgRef.current.zoomToFit(200);
          setGraphLoaded(true);
        }}
        onEngineTick={() => {
          setGraphLoaded(false);
        }}
        height={height}
        width={width}
        graphData={data}
        onNodeClick={nodeClickCallbackFix}
        nodeThreeObject={(node) => {
          const sprite = new SpriteText(getNodeLabel(node));
          sprite.color = getNodeColor(node);
          sprite.textHeight = getNodeVal(node);
          sprite.strokeWidth = 1;
          sprite.strokeColor = "lightgrey";
          sprite.backgroundColor = getNodeBackgroundFillStyle(node);

          return sprite;
        }}
        enableNodeDrag={false}
        nodeVisibility={(node) => getNodeVisibility(node)}
        nodeLabel={(node) => getNodeLabel(node)} //label when hovering
        nodeVal={(node) => getNodeVal(node)}
        linkColor={() => "#ccc900"}
        linkOpacity={0.9}
        linkWidth={0.2}
        linkCurvature={0.1}
        linkDirectionalParticles={1}
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

export default Graph3D;
