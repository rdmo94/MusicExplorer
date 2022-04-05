import React from 'react';
import SpriteText from 'three-spritetext';
import {graph_data_prettyfier} from '../Util'

import {
  ForceGraph2D,
  ForceGraph3D,
  ForceGraphVR,
  ForceGraphAR,
  GraphData,
} from "react-force-graph";

function Graph3D(props){
    console.log("rendering 3D graph")
    return (
        <ForceGraph3D
            enableNodeDrag={false}
            graphData={props.data}
            nodeAutoColorBy="fy"
            nodeThreeObject={(node) => {
            const sprite = new SpriteText(graph_data_prettyfier(node.name));
            sprite.color = node.color;
            sprite.textHeight = 0.5;
            return sprite;
            }}
        />
    )
}

export default Graph3D;