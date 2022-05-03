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
function GraphColorTest({ data, properties, userGenreMap, strategy, links, height, width}) {
  var strategy_number = undefined
  var strategy_genres = [] //clean array of genres in strategy
  var user_genres = [] //clean array of genres in userGenreMap

  if (strategy){
    //console.log(strategy)
    strategy_number = Object.keys(strategy)[0]
    //console.log("strategy_number", strategy_number)
    strategy_genres = strategy[strategy_number]
    //console.log("strategy_genres", strategy_genres)
  } 

  if (userGenreMap){
    user_genres = Object.keys(userGenreMap)
  }



  //fix genre names in data 

  //fix genre names in userGenreMap

  //fix genre names in strategy
  


  /** add list of link to data **/
  if (links && data){
    //console.log("links", links)
    var graphReadableLinks = convert_genre_list_to_graph_links(links)
    var genreIdLinks = translate_genre_links_to_node_id_links(graphReadableLinks)
    //console.log("genre links", links)
    //console.log("genreIdLinks", genreIdLinks)
    //console.log("data", data)
    data.links = genreIdLinks
    console.log("links from graphcolortest", links)
    console.log("genreIdLinks from graphcolortest", genreIdLinks)
    //console.log("new data", data)
  }

  function convert_genre_list_to_graph_links(genreList){
    var graphReadableLinks = []
    for (var i = 0; i < genreList.length - 1; i++){
      var link = {"source": genreList[i], "target":genreList[i+1]}
      graphReadableLinks.push(link)
    }
    //console.log(graphReadableLinks)
    return graphReadableLinks
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

  function reorderData(){
    if (data){
      if (strategy_genres){
        for (var i = 0; i<strategy_genres.length; i++){
          var strategy_genre = strategy_genres[i]
          var indexOfGenre = getNodeIndexOfGenre(strategy_genre)
          moveIndexToEndOfNodes(indexOfGenre)
        }
      }
      if (user_genres){
        for (var i = 0; i<user_genres.length; i++){
          var user_genre = user_genres[i]
          var indexOfGenre = getNodeIndexOfGenre(user_genre)
          moveIndexToEndOfNodes(indexOfGenre)
        }
      }
    }
  }

  function getNodeIndexOfGenre(genre){
    for (var i = 0; i<data.nodes.length; i++){
      if (data.nodes[i].name === genre){
        return i
      }
    }
    console.log("could not find index of genre " + genre)
  }

  /**
   * Moves index of node to end of nodes = rendered last
   * @param {Integer} index 
   */
  function moveIndexToEndOfNodes(index){
    data.nodes.push(data.nodes.splice(index, 1)[0]);
  }

  reorderData()

  

  

  function getNodeVal(node) {
    const weight_divider = 400
    const max_size = 4
    const min_size = 1
    const strategy_size = 6
    if (userGenreMap) {
      if (node.name in userGenreMap) {
        var knownGenreSize = userGenreMap[node.name] / 8;
        if (knownGenreSize > max_size) return max_size;
        else if (knownGenreSize > min_size) return knownGenreSize;
        else return min_size;
      }else if (strategy_genres && strategy_genres.includes(node.name)) {
        return strategy_size;
      }
      else {
        //determine size based on weight
        if (node.weight/weight_divider > min_size){
          if (node.weight/weight_divider > max_size){
            return max_size
          } else {
            return node.weight/weight_divider;
          }
        } else {
          return 1;
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
    if (userGenreMap && node.name in userGenreMap) {
      return "green";
    } 
    else if (strategy_genres && strategy_genres.includes(node.name)) {
      //console.log(node.name + " in " + strategy_genres)
      return "blue";
    } 
    else {
      return "red";
    }
  }

  
  return (
    <ForceGraph2D
      height={height}
      width={width}
      backgroundColor={primaryGrey}
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
        // const fontSize = (getNodeVal(node) * 12) / globalScale; //higher is smaller?
        const fontSize = (getNodeVal(node)); //higher is smaller?
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
      minZoom={2}
      //zoom={0.2} //doesnt work.. zz
      linkColor={() => '#2ab04e'}
      linkOpacity={0.9}
      linkWidth={10}
    />
  );
}

export default GraphColorTest;