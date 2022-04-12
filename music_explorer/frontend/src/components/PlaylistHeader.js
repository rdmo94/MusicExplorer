import React from "react";
import { Edit, Done } from "@material-ui/icons";
import {
  Grid,
  Typography,
  Button,
  TextField,
  CircularProgress,
} from "@material-ui/core";
import { grey, lightGreen } from "@material-ui/core/colors";
import { useState } from "react";
import Song from "../models/Song";
import Playlist from "../models/Playlist";

function PlaylistHeader(props) {
  const [name, setName] = useState(props.title);
  const [isNameFocused, setIsNamedFocused] = useState(false);
  const [isNameChangeLoading, setIsNameChangeLoading] = useState(false);

  return (
    <Grid container direction="row" justifyContent="space-between">
      <Grid item>
        {!isNameFocused ? (
          <Typography variant="h3">{name}</Typography>
        ) : (
          <TextField
            autoFocus
            // inputProps={{ className: classes.name }}
            value={name}
            onChange={(event) => setName(event.target.value)}
            onBlur={(event) => setIsNamedFocused(false)}
          />
        )}
      </Grid>
      <Grid item>
        {isNameFocused ? (
          <Button
            disabled={isNameChangeLoading ? true : false}
            variant="contained"
            style={{ borderRadius: 200 }}
            onClick={() => {
              props.editCallback().then((_) => {setIsNameChangeLoading(false)});
              setIsNamedFocused(false);
            }}
          >
            {isNameChangeLoading ? <CircularProgress size={20} /> : <Done />}
          </Button>
        ) : (
          <Edit
            sx={{ color: "red" }}
            onClick={() => {
              setIsNamedFocused(true);
            }}
          />
        )}
      </Grid>
    </Grid>
  );
}

export default PlaylistHeader;
