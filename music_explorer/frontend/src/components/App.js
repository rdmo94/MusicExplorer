import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import { render } from "react-dom";
import { BrowserRouter, Routes, Link, Route, Router } from "react-router-dom";
import Sean from "./Sean";

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <BrowserRouter>
        <Routes>
            <Route path="/sean" element={<Sean/>}/>
            <Route path=""> <p>fsdfasdf</p> </Route>
        </Routes>
      </BrowserRouter>
    );
  }
}

const appDiv = document.getElementById("app");
render(<App />, appDiv);
