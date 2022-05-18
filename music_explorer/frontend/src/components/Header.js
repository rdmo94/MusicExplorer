import { Typography, Link, Box } from "@material-ui/core";
import React from "react";
import { makeStyles } from "@material-ui/core";
import logo from "../../static/images/logo.png"


const styles = makeStyles(() => {});

const Header = () => (
  <div className="header">
    <Link href={"/"}>
      <img  src={logo} className="headerText" height={35}/>
    </Link>
  </div>
);
export default Header;
