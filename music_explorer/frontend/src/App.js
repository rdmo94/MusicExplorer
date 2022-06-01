import React, { Component } from "react";
import { render } from "react-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import "../static/css/styles.css";
import Footer from "./components/Footer";
import Header from "./components/Header";

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>        
        <Header />
        <Footer />
      </Router>
    );
  }
}

const appDiv = document.getElementById("app");
render(<App />, appDiv);
