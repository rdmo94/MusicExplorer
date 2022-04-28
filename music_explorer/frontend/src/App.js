import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import { render } from "react-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Graph from "./pages/Graph";
import Login from "./pages/Login";
import NavBar from "./components/NavBar";
import Dashboard from "./pages/Dashboard";
import "../static/css/styles.css";
import Playlists from "./pages/Playlists";
import PlaylistScreen from "./pages/PlaylistScreen";
import Footer from "./components/Footer";
import Header from "./components/Header";

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    // let authenticated = isAuthenticated()

    return (
      <Router>
        {/* <NavBar /> */}
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/graph" element={<Graph />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/playlists" element={<Playlists />} />
          <Route path="/playlist" element={<PlaylistScreen />} />
          <Route path="/login" element={<Login />} /> */}
        </Routes>
        {/* <Routes> */}
        
        <Header />
        <Footer />
        {/* </Routes> */}
      </Router>
    );
  }
}

const appDiv = document.getElementById("app");
render(<App />, appDiv);
