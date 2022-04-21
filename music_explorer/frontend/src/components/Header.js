import { Typography, Link } from "@material-ui/core";
import React from "react";
import { makeStyles } from "@material-ui/core";

const styles = makeStyles(() => {});

const Header = () => (
  <div className="header">
    <Link href={"/"}>
      <Typography className="headerText" variant="h3">
        MusicExplorer
      </Typography>
    </Link>
  </div>
);

export default Header;
