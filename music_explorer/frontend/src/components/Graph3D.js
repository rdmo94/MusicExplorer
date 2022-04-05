import React from 'react';
import SpriteText from 'three-spritetext';

import {
  ForceGraph2D,
  ForceGraph3D,
  ForceGraphVR,
  ForceGraphAR,
  GraphData,
} from "react-force-graph";

function Graph3D(props){
    return (
        <ForceGraph3D
            enableNodeDrag={false}
            graphData={props.data}
            nodeAutoColorBy="test"
            nodeThreeObject={(node) => {
            const sprite = new SpriteText(node.name);
            sprite.color = node.color;
            sprite.textHeight = 0.1;
            return sprite;
            }}
        />
    )
}

export default Graph3D;