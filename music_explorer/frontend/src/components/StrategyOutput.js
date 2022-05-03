import {
  Typography,
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import "@mui/icons-material";
import React from "react";
import { primaryGreen } from "../Colors";
import { replace_special_characters } from "../Util";
import { Circle, FormatListBulleted } from "@mui/icons-material";

/**
 *
 * @param {List<String>} output
 * @param {Function} resetOutputCallback
 */

function StrategyOutput({ output, resetOutputCallback }) {
  return (
    <Box height={"100%"} display={"flex"} flexDirection={"column"}>
      {output !== null ? (
        <div style={{ paddingLeft: 25 }}>
          <Typography variant="h5" color={"white"}>
            Discorered genres:
          </Typography>
          <List sx={{ overflow: "auto", height: "70vh", width: "100%" }}>
              {console.log(output)}
            {output["genres"].map((genre, index) => {
              return (
                <ListItem sx={{ display: "list-item", color: "white" }}>
                  <Box
                    display={"flex"}
                    flexDirection={"row"}
                    alignItems={"center"}
                  >
                    <ListItemIcon color={"white"} key={index}>
                      {output["id"] == 3 ? (
                        <Typography color={"white"}>{index+1 + "."}</Typography>
                      ) : (
                        <Circle style={{ color: "white", fontSize: 10 }} />
                      )}
                    </ListItemIcon>
                    <ListItemText>
                      {replace_special_characters(genre)}
                    </ListItemText>
                  </Box>
                </ListItem>
              );
            })}
          </List>
          <Box display={"flex"} justifyContent={"center"}>
            <Button
              variant="outlined"
              style={{
                marginTop: 30,
                marginBottom: 30,
                color: `${primaryGreen}`,
                border: `2px solid ${primaryGreen}`,
                borderRadius: 200,
              }}
              onClick={resetOutputCallback}
            >
              Start over
            </Button>
          </Box>
        </div>
      ) : (
        <></>
      )}
    </Box>
    // <></>
  );
}

export default StrategyOutput;
