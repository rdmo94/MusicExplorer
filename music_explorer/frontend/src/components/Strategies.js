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
  CircularProgress,
  ToggleButton,
  TextField,
  Chip,
  FilledInput,
  InputAdornment,
  OutlinedInput,
  List
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { display } from "@mui/system";
import React, { useEffect } from "react";
import { useState } from "react";
import {
  primaryGreen,
  primaryGrey,
  primaryGreyDark,
  primaryGreyLight,
} from "../Colors";
import Strategy from "../models/Strategy";
import { useLocalStorage } from "../Util";
import { makeStyles } from "@mui/styles";
import { replace_special_characters } from "../Util";
import { styled } from "@mui/system";
import {
  CheckCircleOutlineIcon,
  RadioButtonUncheckedIcon,
  Edit,
} from "@mui/icons-material";

import StrategyOutput from "./StrategyOutput";
/**
 *
 * @param {Object} selectedUserGenres
 * @param updateStrategyOutputCallback
 * @param lastSelectedNode
 * @returns
 */

function Strategies({
  selectedUserGenres,
  updateStrategyOutputCallback,
  lastSelectedNode,
  setMapSelectMode
}) {
  const strategies = [
    new Strategy(
      0,
      "Random",
      "The Random strategy finds a number of randomly chosen genres that does not exist in your personal music collection, based on the playlists you have chosen. How many genres and how many songs per genres you would like to explore can be adjusted with the sliders above.",
      "random"
    ),
    new Strategy(
      1,
      "Take me away",
      "Take me away will look at the genres that is currently present in the playlists you have selected. Then the algorithm will select a number of unknown genres, that are as far away from your taste in genres (based on the selected playlists). How many genres and how many songs per genres you would like to explore can be adjusted with the sliders above.",
      "tma"
    ),
    new Strategy(
      2,
      "A little curious a little cautious",
      "A little curious, a little cautious will look at the genres of the playlists you have chosen and find a number of unknown genres, that are as close as possible to your current taste. This method of exploration is for the one who does not want to move too far away from what they like. How many genres and how many songs per genres you would like to explore can be adjusted with the sliders above.",
      "alc"
    ),
    new Strategy(
      3,
      "Smooth transition",
      "Smooth transition will help you explore genres along the way from a starting genre, that you alreadt have in the playlists you have selected, to an unknown genre of your choice. How many genres and how many songs per genres you would like to explore can be adjusted with the sliders above.",
      "st"
    ),
  ];

  const WhiteSelect = styled(Select)(({ theme }) => ({
    color: "white",
    "& .MuiSvgIcon-root": {
      color: "white",
    },
    borderColor: "white",
  }));

  const [strategy, setStrategy] = useLocalStorage("selectedStrategy", null);
  const [numberOfSongsPerGenre, setNumberOfSongsPerGenre] = useState(1);
  const [numberOfGenresToExplore, setNumberOfGenreToExplore] = useState(1);
  const [userGenres, setUserGenres] = useState(selectedUserGenres);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingButtonDisabled, setIsLoadingButtonDisabled] = useState(true);
  const [sourceGenre, setSourceGenre] = useState();
  const [targetGenre, setTargetGenre] = useState();
  //const [allGenres, setAllGenres] = useState();
  const [isSelectingSource, setIsSelectingSource] = useState(false);
  const [isSelectingTarget, setIsSelectingTarget] = useState(false);
  const [allGenres, setAllGenres] = useState();
  const [output, setOutput] = useLocalStorage("generatedOutput", null);

  // useEffect(() => {
  //   console.log(
  //     "Setting selectedUserGernes in Strategies.js with value = ",
  //     selectedUserGenres
  //   );
  //   fetch("api/get_all_genres").then((response) =>
  //     response.json().then((json) => setAllGenres(JSON.parse(json).sort()))
  //   );

  //   if (selectedUserGenres == null) {
  //     setUserGenres([]);
  //   } else {
  //     setUserGenres(selectedUserGenres);
  //   }
  //   console.log("done rendering");
  // }, [selectedUserGenres]);

  useEffect(() => {
    if (lastSelectedNode) {
      if (isSelectingSource) {
        setSourceGenre(lastSelectedNode.name);
        setIsSelectingSource(false);
        setMapSelectMode("")
      } else if (isSelectingTarget) {
        setTargetGenre(lastSelectedNode.name);
        setIsSelectingTarget(false);
        setMapSelectMode("")
      }
    }
    setMapSelectMode("")
  }, [lastSelectedNode]);

  const executeStrategy = () => {
    setIsLoading(true);
    const requestBody = {
      n_genres: numberOfGenresToExplore,
      n_songs_genre: numberOfSongsPerGenre,
      user_genres: Object.keys(userGenres),
    };

    //If smooth transition
    if (strategy != null && strategies[strategy].id == 3) {
      requestBody["source_genre"] = sourceGenre;
      requestBody["target_genre"] = targetGenre;
    }

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    };

    fetch(strategies[strategy].endpoint, requestOptions)
      .then((response) =>
        response.json().then((data) => {
          updateStrategyOutputCallback(JSON.parse(data));
          console.log(
            "Setting out out with values: ",
            JSON.parse(data)["genres"]
          );
          setIsLoading(false);
          setOutput(JSON.parse(data));
        })
      )
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const handleSourceChange = (event) => {
    if (targetGenre) {
      setIsLoadingButtonDisabled(false);
    }
    setSourceGenre(event.target.value);
  };

  const handleTargetChange = (event) => {
    if (sourceGenre) {
      setIsLoadingButtonDisabled(false);
    }
    setTargetGenre(event.target.value);
  };

  const handleChangeSelect = (event) => {
    if (
      event.target.value != 3 ||
      (sourceGenre !== undefined && targetGenre !== undefined)
    ) {
      setIsLoadingButtonDisabled(false);
    } else {
      setIsLoadingButtonDisabled(true);
    }

    setStrategy(event.target.value);
  };

  const handleChangeSongsSlider = (event, newValue) => {
    setNumberOfSongsPerGenre(newValue);
  };

  const handleChangeGenresSlider = (event, newValue) => {
    setNumberOfGenreToExplore(newValue);
  };

  function sourceClicked() {
    setIsSelectingTarget(false);
    setMapSelectMode("source")
    var reversed = !isSelectingSource;
    setIsSelectingSource(reversed);
  }

  function targetClicked() {
    setIsSelectingSource(false);
    setMapSelectMode("target")
    var reversed = !isSelectingTarget;
    setIsSelectingTarget(reversed);
  }

  return (
    <Box className="main" style={{ paddingTop: 100, height: "100%" }}>
      <List style={{overflow: "auto", maxHeight: "100%"}}>
        <Typography
          color={"white"}
          variant="h3"
          style={{ fontWeight: "bold", paddingLeft: 25 }}
        >
          Strategy
        </Typography>
        {output !== null ? (
          <div>
            <StrategyOutput
              output={output}
              resetOutputCallback={() => {
                setOutput(null);
              }}
            />
          </div>
        ) : (
          <div>
            {userGenres == null || Object.keys(userGenres).length == 0 ? (
              <Typography color={"white"} padding={2}>
                Please select one or more of your playlists in the panel to the
                left.
              </Typography>
            ) : (
              <Box
                sx={{ display: "flex", paddingTop: 5 }}
                flexDirection="column"
                alignItems="center"
              >
                <FormControl
                  sx={{ color: "white", minWidth: 300, borderColor: "white" }}
                >
                  <InputLabel id="label-id" sx={{ color: "white" }}>
                    Select strategy...
                  </InputLabel>
                  <WhiteSelect
                    sx={{ borderColor: "white", color: "white" }}
                    //defaultValue={""}
                    labelId="label-id"
                    id="selector"
                    value={strategy != null ? strategy : ""}
                    label="Select strategy..."
                    onChange={handleChangeSelect}
                  >
                    <MenuItem value={0}>Random</MenuItem>
                    <MenuItem value={1}>Take me away</MenuItem>
                    <MenuItem value={2}>
                      A little cautious a little curious
                    </MenuItem>
                    <MenuItem value={3}>Smooth transition</MenuItem>
                  </WhiteSelect>
                </FormControl>
                {userGenres != null && strategy != null ? (
                  <Box
                    padding={2}
                    display={"flex"}
                    flexDirection={"column"}
                    justifyContent={"space-evenly"}
                    alignItems={"center"}
                  >
                    {strategies[strategy].id == 3 ? (
                      <div>
                        <Typography padding={2} fontStyle={{ color: "white" }}>
                          Please select one of your own genres as a starting
                          point and which unknown genre you would like to end up
                          at:
                        </Typography>
                        <Chip
                    icon={<Edit />}
                    label={
                      isSelectingSource
                        ? "Select a source genre on map"
                        : sourceGenre
                        ? replace_special_characters(sourceGenre, false)
                        : "Click to select source genre"
                    }
                    color={isSelectingSource ? "primary" : "success"}
                    onClick={sourceClicked}
                  />

                  <Chip
                    icon={<Edit />}
                    label={
                      isSelectingTarget
                        ? "Select a target genre on map"
                        : targetGenre
                        ? replace_special_characters(targetGenre, false)
                        : "Click to select target genre"
                    }
                    color={isSelectingTarget ? "primary" : "success"}
                    onClick={targetClicked}
                  />

                      </div>
                    ) : (
                      <></>
                    )}
                    <Typography color={"white"} width={300}>
                      {"Number of genres collected: " +
                        Object.keys(selectedUserGenres).length}
                    </Typography>
                    <Box width={300} flex="center" paddingTop={5}>
                      <Typography
                        color={"white"}
                        id="songsSliderLabel"
                        gutterBottom
                      >
                        Number of wanted songs per genre:{" "}
                        {numberOfSongsPerGenre}
                      </Typography>
                      <Slider
                        sx={{ color: primaryGreen }}
                        size="small"
                        defaultValue={2}
                        value={numberOfSongsPerGenre}
                        aria-label="Small"
                        valueLabelDisplay="auto"
                        min={1}
                        max={10}
                        label="songsSliderLabel"
                        onChange={handleChangeSongsSlider}
                        aria-labelledby="songsSliderLabel"
                      />

                      <Typography
                        color={"white"}
                        id="genresSliderLabel"
                        gutterBottom
                      >
                        Number of wanted new genres to explore:{" "}
                        {numberOfGenresToExplore}
                      </Typography>
                      <Slider
                        sx={{ color: primaryGreen }}
                        size="small"
                        defaultValue={2}
                        value={numberOfGenresToExplore}
                        aria-label="Small"
                        valueLabelDisplay="auto"
                        min={1}
                        max={50}
                        label="genresSliderLabel"
                        onChange={handleChangeGenresSlider}
                        aria-labelledby="genresSliderLabel"
                      />
                      <div>
                        <Typography color={"white"} sx={{ fontWeight: "bold" }}>
                          Description
                        </Typography>
                        <Typography color={"white"}>
                          {strategies[strategy].description}
                        </Typography>
                      </div>
                    </Box>
                  </Box>
                ) : (
                  <></>
                )}
              </Box>
            )}

            <Box
              sx={{
                position: "fixed",
                bottom: 65,
                right: 65,
                paddingTop: 5,
              }}
            >
              <LoadingButton
                disabled={isLoadingButtonDisabled}
                loading={isLoading}
                variant="contained"
                style={{
                  width: 200,
                  height: 75,
                  borderRadius: 200,
                  backgroundColor: isLoadingButtonDisabled
                    ? primaryGreyDark
                    : isLoading
                    ? primaryGreyDark
                    : primaryGreen,
                }}
                onClick={executeStrategy}
              >
                <Box
                  flexDirection="column"
                  alignItems="center"
                  sx={{ display: "flex", paddingLeft: 10, paddingRight: 10 }}
                >
                  {isLoading ? (
                    <></>
                  ) : (
                    <div>
                      <Typography
                        color={
                          isLoadingButtonDisabled ? primaryGreyLight : "white"
                        }
                        sx={{ fontWeight: "bold" }}
                      >
                        GENERATE
                      </Typography>
                      <Typography
                        color={
                          isLoadingButtonDisabled ? primaryGreyLight : "white"
                        }
                        sx={{ fontWeight: "bold" }}
                      >
                        PLAYLIST
                      </Typography>
                    </div>
                  )}
                </Box>
              </LoadingButton>
            </Box>
          </div>
        )}
      </List>
    </Box>
  );
}

export default Strategies;
