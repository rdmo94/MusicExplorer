 import React, { Component } from "react";
 import Button from "@material-ui/core/Button"
 import { render } from "react-dom";

 export default class App extends Component {
    constructor(props) {
        super(props);
    } 

    render() {
        return <h1>alskdjflaksdjfldaksjfdasfllllllllll</h1>;
    }
 }

 const appDiv = document.getElementById("app");
 render(<App />, appDiv);