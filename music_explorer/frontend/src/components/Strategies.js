import {
  Typography,
  Select,
  FormControl,
  MenuItem,
  InputLabel,
  Box,
  Grid,
  Button,
  Slider,
} from "@mui/material";
import { display } from "@mui/system";
import React from "react";
import { useState } from "react";
import { primaryGreen } from "../Colors";
import Strategy from "../models/Strategy";

//Right side of dashboard
function Strategies() {
  const strategies = [
    new Strategy(
        "Smooth transition",
        "This is the description of smooth transition strategy which is very long bla bla bla bla bla ipsum lorem lore upsut"
      ),
    new Strategy(
      "Take me away",
      "This is the description of Take me away strategy which is very long bla bla bla bla bla ipsum lorem lore upsut"
    ),
    new Strategy(
      "A little curious a little cautious",
      "This is the description of A little curious a little cautious strategy which is very long bla bla bla bla bla ipsum lorem lore upsut"
    ),
    new Strategy(
      "Radnom",
      "This is the description of Radnom strategy which is very long bla bla bla bla bla ipsum lorem lore upsut"
    ),
  ];
  const [strategy, setStrategy] = React.useState(null);
  const [numberOfSongsPerGenre, setNumberOfSongsPerGenre] = useState(2);

  const handleChange = (event) => {
    setStrategy(event.target.value);
  };

  const handleChangeSlider = (event, newValue) => {
    setNumberOfSongsPerGenre(newValue);
  };
  return (
    <div style={{ paddingTop: 100, height: "100%" }}>
      <Typography variant="h3" style={{ fontWeight: "bold", paddingLeft: 25 }}>
        Strategy
      </Typography>

      <Box
        sx={{ display: "flex", minHeight: "75%", flexGrow: 1 }}
        flexDirection="column"
        alignItems="center"
      >
        <FormControl sx={{ minWidth: 300 }}>
          <InputLabel id="label-id">Select strategy...</InputLabel>
          <Select
            labelId="label-id"
            id="selector"
            value={strategy == null ? "" : strategy.name}
            label="Select strategy..."
            onChange={handleChange}
          >
            <MenuItem value={strategies[0]}>Smooth transition</MenuItem>
            <MenuItem value={strategies[1]}>Take me away</MenuItem>
            <MenuItem value={strategies[2]}>A little cautious a little curious</MenuItem>
            <MenuItem value={strategies[3]}>Random</MenuItem>
          </Select>
        </FormControl>
        <Box width={300} flex="center">
          <Typography id="slider-id" gutterBottom>
            Number of wanted songs per genre: {numberOfSongsPerGenre}
          </Typography>
          <Slider
            size="small"
            defaultValue={2}
            aria-label="Small"
            valueLabelDisplay="auto"
            min={1}
            max={10}
            onChange={handleChangeSlider}
            aria-labelledby="slider-id"
          />
          {strategy != null ? (
            <div>
              <Typography sx={{ fontWeight: "bold" }}>Description</Typography>
              <Typography>
                {strategy.description}
              </Typography>
            </div>
          ) : (
            <></>
          )}
        </Box>
      </Box>
      <Box justifyContent="center" alignItems="center" display="flex">
        <Button
          variant="contained"
          style={{
            borderRadius: 200,
            backgroundColor: primaryGreen,
            color: "white",
          }}
        >
          <Box
            flexDirection="column"
            alignItems="center"
            sx={{ display: "flex", paddingLeft: 10, paddingRight: 10 }}
          >
            <Typography sx={{ fontWeight: "bold" }}>GENERATE</Typography>
            <Typography sx={{ fontWeight: "bold" }}>PLAYLIST</Typography>
          </Box>
        </Button>
      </Box>
    </div>
  );
}

export default Strategies;
