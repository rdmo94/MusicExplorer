import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import { render } from "react-dom";
import { BrowserRouter, Routes, Link, Route, Router } from "react-router-dom";
import Home from "./pages/Home"
import Graph from "./pages/Graph";
import Login from "./pages/Login"
import NavBar from "./components/NavBar";
import Dashboard from "./pages/Dashboard";
import '../static/css/styles.css';
import Playlists from "./pages/Playlists"
import PlaylistScreen from "./pages/PlaylistScreen";

export default class App extends Component {
  constructor(props) {
    super(props);
  }



  render() {

    // let authenticated = isAuthenticated()

    return (
      <BrowserRouter> 
        {/* <NavBar> */}

        <Routes>
            <Route path="" element={<Home/>}> </Route>
            <Route path="/graph" element={<Graph/>}> </Route>
            <Route path="/dashboard" element={<Dashboard/>}> </Route>
            <Route path="/playlists" element={<Playlists/>}> </Route>
            <Route path="/playlist" element={<PlaylistScreen/>}> </Route>
        </Routes>
        {/* </NavBar> */}
      </BrowserRouter>
    );
  }
}

const appDiv = document.getElementById("app");
render(<App />, appDiv);
