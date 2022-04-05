import React from 'react';
import SpriteText from 'three-spritetext';

import {
  ForceGraph2D,
  ForceGraph3D,
  ForceGraphVR,
  ForceGraphAR,
  GraphData,
} from "react-force-graph";



function graph_data_prettyfier(text){
  //TODO function that prettyfies genres by replacing correct characters, uppercases etc
  function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
  }
  
  text = replaceAll(text, "____","&")
  text = replaceAll(text, "___", "'")
  text = replaceAll(text, "__", "-")
  text = replaceAll(text, "_", " ")

  text = text.toLowerCase().replace(/(^\w{1})|(\s{1}\w{1})/g, match => match.toUpperCase());
  return text
}

function Graph2D(props){
    return (
        <ForceGraph2D
            enableNodeDrag={false}
            graphData={props.data}
            nodeAutoColorBy="fy"
            nodeCanvasObject={(node, ctx, globalScale) => {
                const cleanName = graph_data_prettyfier(node.name)
                const label = cleanName
                const fontSize = 12/globalScale;
                ctx.font = `${fontSize}px Sans-Serif`;
                const textWidth = ctx.measureText(label).width;
                const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2); // some padding
    
                ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);
    
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = node.color;
                ctx.fillText(label, node.x, node.y);
    
                node.__bckgDimensions = bckgDimensions; // to re-use in nodePointerAreaPaint
              }}
              nodePointerAreaPaint={(node, color, ctx) => {
                ctx.fillStyle = color;
                const bckgDimensions = node.__bckgDimensions;
                bckgDimensions && ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);
              }}
        />
    )
}

export default Graph2D;