import React from "react";
import { useEffect } from "react";
import { Button, Grid, Checkbox, Typography } from "@material-ui/core";
function PlaylistContainer(props) {
  

  return (
    <div variant="contained">
      <Grid
        container
        direction="row"
        justifyContent="space-around"
        alignItems="center"
      >
        <Grid item xs={1}>

          <Checkbox onChange={(event) => props.updatePlaylistsCallback(props.title, event.target.checked)} />
        </Grid>
        <Grid item xs>
          <Typography>{props.title}</Typography>
        </Grid>
      </Grid>
    </div>
  );
}

export default PlaylistContainer;
