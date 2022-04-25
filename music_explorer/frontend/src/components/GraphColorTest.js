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
 * @param {List<Object>} param.links List<{'source': genre, 'target': genre}>
 * @returns 
 */
function GraphColorTest({ data, properties, userGenreMap, strategy, links}) {
  
  //console.log("userGenreMap", userGenreMap);
  //console.log("data", data);

  //fix genre names in data

  //fix genre names in userGenreMap

  //fix genre names in strategy
  
  var strategy_number = undefined
  var strategy_genres = []

  /** add list of link to data **/
  if (links && data){
    //console.log("links", links)
    var genreIdLinks = translate_genre_links_to_node_id_links(links)
    //console.log("genre links", links)
    //console.log("genreIdLinks", genreIdLinks)
    //console.log("data", data)
    data.links = genreIdLinks
    //console.log("new data", data)
  }

  function translate_genre_links_to_node_id_links(links){
    function get_node_id_from_genre(genre_nodes, genre){
      for (var i = 0; i < genre_nodes.length; i++){
        if (genre_nodes[i].name == genre) return genre_nodes[i].id
      }
      //console.log(genre + "'s id was not found... :/")
      return null
    }

    var newLinks = []
    for (var i = 0; i < links.length; i++){
      var newLinkSource = get_node_id_from_genre(data.nodes, links[i].source)
      var newLinkTarget = get_node_id_from_genre(data.nodes, links[i].target)
      if (newLinkSource && newLinkTarget){
        var newLink = {"source": newLinkSource, "target": newLinkTarget}
        newLinks.push(newLink)
      } else {
        //console.log("could not find id links from " + links[i].source + " to " + links[i].target)
      }
    }
    return newLinks
  }

  

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
        const fontSize = (getNodeVal(node) * 12) / globalScale; //higher is smaller?
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
      minZoom={15}
      //zoom={0.2} //doesnt work.. zz
      linkColor={() => '#2ab04e'}
      linkOpacity={0.9}
      linkWidth={10}
    />
  );
}

export default GraphColorTest;
