import React from "react";
import { useEffect } from "react";
import { Button, Grid, Checkbox, Typography } from "@material-ui/core";
function PlaylistCheckboxContainer({title, updatePlaylistsCallback}) {
  

  return (
    <div variant="contained">
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
      >
        <Grid item >

          <Checkbox onChange={(event) => updatePlaylistsCallback(title, event.target.checked)} />
        </Grid>
        <Grid item xs>
          <Typography>{title}</Typography>
        </Grid>
      </Grid>
    </div>
  );
}

export default PlaylistCheckboxContainer;
