import React from "react";
import SpriteText from "three-spritetext";
import { graph_data_prettyfier } from "../Util";
import { useEffect, useState } from "react";

import {
  ForceGraph2D,
  ForceGraph3D,
  ForceGraphVR,
  ForceGraphAR,
  GraphData,
} from "react-force-graph";

function Graph2D(props) {
  return (
    <ForceGraph2D
      height={props.graphHeight}
      width={props.graphWidth}
      backgroundColor={props.properties.backgroundColor}
      enableNodeDrag={props.properties.enableNodeDrag}
      graphData={props.data}
      nodeAutoColorBy={props.properties.nodeAutoColorBy}
      nodeCanvasObject={(node, ctx, globalScale) => {
        const cleanName = graph_data_prettyfier(node.name);
        const label = cleanName;
        const fontSize = 12 / globalScale;
        ctx.font = `${fontSize}px Sans-Serif`;
        const textWidth = ctx.measureText(label).width;
        const bckgDimensions = [textWidth, fontSize].map(
          (n) => n + fontSize * 0.2
        ); // some padding

        ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        ctx.fillRect(
          node.x - bckgDimensions[0] / 2,
          node.y - bckgDimensions[1] / 2,
          ...bckgDimensions
        );

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = node.color;
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
    />
  );
}

export default Graph2D;
