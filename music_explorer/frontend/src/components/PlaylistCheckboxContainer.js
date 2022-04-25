import React from "react";
import { useEffect } from "react";
import {
  Button,
  Grid,
  Checkbox,
  Typography,
  FormGroup,
  FormControlLabel,
} from "@mui/material";

/**
 *
 *
 * @param {Object} param
 * @param {String} param.title
 * @param {String} param.playlistId
 * @param {Function} param.updatePlaylistsCallback
 * @param {Boolean} param.isChecked
 * @return {*}
 */
function PlaylistCheckboxContainer({
  title,
  playlistId,
  updatePlaylistsCallback,
  isChecked,
}) {
  return (
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              defaultChecked={isChecked}
              onChange={(event) =>
                updatePlaylistsCallback(playlistId, event.target.checked)
              }
              key={playlistId.toString()}
              value={title}
            />
          }
          label={title}
        />
      </FormGroup>
  );
}

export default PlaylistCheckboxContainer;
