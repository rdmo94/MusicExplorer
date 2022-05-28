import { Typography, Link, Box, Button, Grid } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core";
import logo from "../../static/images/logo.png";
import {primaryGreen} from "../Colors";
import {logout} from "../Util";

const styles = makeStyles(() => {});

function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState();

  useEffect(() => {
    fetch("spotify/is-authenticated").then((response) => {
      response.json().then((data) => {
        setIsAuthenticated(data["status"]);
      });
    });
  }, []);
  return (
    <div className="header">
      <Grid
        direction={"column"}
        alignItems={"center"}
        justifyContent={"center"}
        container
      >
        <Link href={"/"}>
          <img src={logo} className="headerText" height={35} />
        </Link>
        {isAuthenticated ? (
          <Button
            onClick={() => logout()}
            variant="contained"
            style={{ borderRadius: 200, backgroundColor: primaryGreen }}
          >
            LOG OUT
          </Button>
        ) : (
          <></>
        )}
      </Grid>
    </div>
  );
}
export default Header;
