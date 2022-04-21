import React from 'react';
// import { Nav, Button, Container, Navbar, NavbarBrand, NavItem } from 'react-bootstrap';


import {
  AppBar,
  Toolbar,
  CssBaseline,
  Typography,
  makeStyles,
} from "@material-ui/core";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  navlinks: {
    marginLeft: theme.spacing(10),
    display: "flex",
  },
 logo: {
    flexGrow: "1",
    cursor: "pointer",
    "&:hover": {
      color: "silver",
    },
    margin: 0,
    padding: 0,
  },
  link: {
    textDecoration: "none",
    color: "white",
    fontSize: "20px",
    marginLeft: theme.spacing(20),
    "&:hover": {
      color: "silver",
    },
  },
  navbar: {

  }
}));

function Navbar() {
  const classes = useStyles();

  return (
    <AppBar position="static" className={classes.navbar}>
      <CssBaseline />
      <Toolbar>
        <Typography variant="h4" className={classes.logo}>
          MusicExplorer
        </Typography>
          <div>
            <Link to="/dashboard" className={classes.link}>
                Dashboard
              </Link> 
          </div>
          {/* <div className={classes.navlinks}> */}
            {/* <Link to="/" className={classes.link}>
              Home
            </Link> 
            <Link to="/about" className={classes.link}>
              About
            </Link>
            <Link to="/contact" className={classes.link}>
              Contact
            </Link>
            <Link to="/faq" className={classes.link}>
              FAQ
            </Link> */}
          {/* </div> */}
      </Toolbar>
    </AppBar>
  );
}
export default Navbar;