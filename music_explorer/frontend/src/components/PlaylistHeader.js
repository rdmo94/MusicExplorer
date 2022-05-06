import React from "react";
import { EditOutlined, Done } from "@material-ui/icons";
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

function PlaylistHeader({editCallback, isEditable, title}) {
  const [name, setName] = useState(title);
  const [isNameFocused, setIsNamedFocused] = useState(false);
  const [isNameChangeLoading, setIsNameChangeLoading] = useState(false);

  return (
    <Grid container direction="row" justifyContent="center" alignItems="center">
      <Grid item>
        {!isNameFocused ? (
          <Typography variant="h3" style={{ color: "white" }}>
            {name}
          </Typography>
        ) : (
          <TextField
            style={{ input: { color: "white" } }}
            autoFocus
            // inputProps={{ className: classes.name }}
            value={name}
            onChange={(event) => setName(event.target.value)}
            // onBlur={(_) => setIsNamedFocused(false)}
          />
        )}
      </Grid>
      {isEditable ? (
        <Grid item>
          {isNameFocused ? (
            <Button
              disabled={isNameChangeLoading ? true : false}
              variant="contained"
              style={{ borderRadius: 200 }}
              onClick={() => {
                console.log("Button clicked")
                editCallback(name);
                setIsNameChangeLoading(false);
                setIsNamedFocused(false);
              }}
            >
              {isNameChangeLoading ? <CircularProgress size={20} /> : <Done />}
            </Button>
          ) : (
            <EditOutlined
              style={{ color: "white", cursor: "pointer", padding: 20 }}
              onClick={() => {
                setIsNamedFocused(true);
              }}
            />
          )}
        </Grid>
      ) : (
        <></>
      )}
    </Grid>
  );
}

export default PlaylistHeader;
