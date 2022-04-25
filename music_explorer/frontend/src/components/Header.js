import { Typography, Link, Box } from "@material-ui/core";
import React from "react";
import { makeStyles } from "@material-ui/core";
//import logo from "../../assets/images/logo.png"


const styles = makeStyles(() => {});

const Header = () => (
  <div className="header">
    <Link href={"/"}>
      <img className="headerText" height={50}/>
    </Link>
  </div>
);
//src={logo} 
export default Header;
