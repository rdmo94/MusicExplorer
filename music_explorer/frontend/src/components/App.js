import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import { render } from "react-dom";
import { BrowserRouter, Routes, Link, Route, Router } from "react-router-dom";
import Home from "./Home";
import Graph from "./Graph";
import Login from "./Login";
import { useEffect } from "react";

export default class App extends Component {
  constructor(props) {
    super(props);
  }



  render() {

    // let authenticated = isAuthenticated()

    return (
      <BrowserRouter> 
        <Routes>
            <Route path="" element={<Home/>}> </Route>
            <Route path="/graph" element={<Graph/>}> </Route>
        </Routes>
      </BrowserRouter>
    );
  }
}

const appDiv = document.getElementById("app");
render(<App />, appDiv);
