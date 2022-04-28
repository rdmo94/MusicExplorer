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

/**
 *
 * @param {Object} selectedUserGenres
 * @param updateStrategyOutputCallback
 * @returns
 */

function Strategies({ selectedUserGenres, updateStrategyOutputCallback }) {
  const strategies = [
    new Strategy(
      0,
      "Random",
      "This is the description of Radnom strategy which is very long bla bla bla bla bla ipsum lorem lore upsut",
      "random"
    ),
    new Strategy(
      1,
      "Take me away",
      "This is the description of Take me away strategy which is very long bla bla bla bla bla ipsum lorem lore upsut",
      "tma"
    ),
    new Strategy(
      2,
      "A little curious a little cautious",
      "This is the description of A little curious a little cautious strategy which is very long bla bla bla bla bla ipsum lorem lore upsut",
      "alc"
    ),
    new Strategy(
      3,
      "Smooth transition",
      "This is the description of smooth transition strategy which is very long bla bla bla bla bla ipsum lorem lore upsut",
      "st"
    ),
  ];
  const [strategy, setStrategy] = useLocalStorage("", null);
  const [numberOfSongsPerGenre, setNumberOfSongsPerGenre] = useState(2);
  const [numberOfGenresToExplore, setNumberOfGenreToExplore] = useState(10);
  const [userGenres, setUserGenres] = useState(selectedUserGenres);
  const [isLoading, setIsLoading] = useState(false);
  const [sourceGenre, setSourceGenre] = useState();
  const [targetGenre, setTargetGenre] = useState();
  const [allGenres, setAllGenres] = useState();

  useEffect(() => {
    fetch("api/get_all_genres").then((response) =>
    response.json().then((json) => setAllGenres(JSON.parse(json)))
    );
    
    if (selectedUserGenres == null) {
      setUserGenres([]);
    } else {
      setUserGenres(selectedUserGenres);
    }
  }, []);

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
          setIsLoading(false);
        })
      )
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const handleSourceChange = (event) => {
    setSourceGenre(event.target.value);
  };

  const handleTargetChange = (event) => {
    setTargetGenre(event.target.value);
  };

  const handleChangeSelect = (event) => {
    setStrategy(event.target.value);
  };

  const handleChangeSlider = (event, newValue) => {
    setNumberOfSongsPerGenre(newValue);
  };
  return (
    <Box className="main" style={{ paddingTop: 100, height: "100%" }}>
      <Typography
        color={"white"}
        variant="h3"
        style={{ fontWeight: "bold", paddingLeft: 25 }}
      >
        Strategy
      </Typography>
      {userGenres == null || Object.keys(userGenres).length == 0 ? (
        <Typography color={"white"} padding={2}>
          Please select one or more of your playlists in the panel to the left.
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
            <Select
              sx={{ color: "white" }}
              //defaultValue={""}
              labelId="label-id"
              id="selector"
              value={strategy ? strategy : ""}
              label="Select strategy..."
              onChange={handleChangeSelect}
            >
              <MenuItem value={0}>Random</MenuItem>
              <MenuItem value={1}>Take me away</MenuItem>
              <MenuItem value={2}>A little cautious a little curious</MenuItem>
              <MenuItem value={3}>Smooth transition</MenuItem>
            </Select>
          </FormControl>
          {userGenres != null && strategy != null && strategies[strategy].id == 3 ? (
            <Box
              padding={2}
              display={"flex"}
              flexDirection={"column"}
              justifyContent={"space-evenly"}
              alignItems={"center"}
            >
              <Typography padding={2} fontStyle={{ color: "white" }}>
                Please select one of your own genres as a starting point and
                which unknown genre you would like to end up at:
              </Typography>
              <FormControl
                sx={{
                  color: "white",
                  borderColor: "white",
                  minWidth: 300,
                  padding: 2,
                }}
              >
                <InputLabel id="label-id1" sx={{ color: "white" }}>
                  Select starting genre...
                </InputLabel>
                <Select
                  sx={{ color: "white" }}
                  //defaultValue={""}
                  labelId="label-id1"
                  id="selector"
                  label="Select starting genre..."
                  value={sourceGenre ? sourceGenre : ""}
                  onChange={handleSourceChange}
                >
                  {Object.keys(userGenres).map((genre) => {
                    return <MenuItem value={genre}>{genre}</MenuItem>;
                  })}
                </Select>
              </FormControl>

              <FormControl sx={{ color: "white", minWidth: 300, padding: 2 }}>
                <InputLabel id="label-id" sx={{ color: "white" }}>
                  Select destination genre...
                </InputLabel>
                <Select
                  sx={{ color: "white" }}
                  //defaultValue={""}
                  labelId="label-id"
                  id="selector"
                  label="Select destination genre..."
                  value={targetGenre ? targetGenre : ""}
                  onChange={handleTargetChange}
                >
                  {allGenres ? (
                    allGenres.map((genre) => (
                      <MenuItem value={genre}>{genre}</MenuItem>
                    ))
                  ) : (
                    <></>
                  )}
                </Select>
              </FormControl>
            </Box>
          ) : (
            <></>
          )}
          <Typography color={"white"} width={300}>
            {"Number of genres collected: " +
              Object.keys(selectedUserGenres).length}
          </Typography>
          <Box width={300} flex="center" paddingTop={5}>
            <Typography color={"white"} id="slider-id" gutterBottom>
              Number of wanted songs per genre: {numberOfSongsPerGenre}
            </Typography>
            <Slider
              sx={{ color: primaryGreen }}
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
                <Typography color={"white"} sx={{ fontWeight: "bold" }}>
                  Description
                </Typography>
                <Typography color={"white"}>
                  {strategies[strategy].description}
                </Typography>
              </div>
            ) : (
              <></>
            )}
          </Box>
        </Box>
      )}

      <Box
        sx={{
          position: "absolute",
          bottom: 65,
          right: 65,
          paddingTop: 5,
        }}
      >
        <LoadingButton
          disabled={strategy == null || Object.keys(userGenres).length == 0}
          loading={isLoading}
          variant="contained"
          style={{
            width: 200,
            height: 75,
            borderRadius: 200,
            backgroundColor:
              strategy == null || Object.keys(userGenres).length == 0
                ? "#FFFFF"
                : isLoading
                ? primaryGreyLight
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
                    strategy == null || Object.keys(userGenres).length == 0
                      ? primaryGreyDark
                      : "white"
                  }
                  sx={{ fontWeight: "bold" }}
                >
                  GENERATE
                </Typography>
                <Typography
                  color={
                    strategy == null || Object.keys(userGenres).length == 0
                      ? primaryGreyDark
                      : "white"
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
    </Box>
  );
}

export default Strategies;
