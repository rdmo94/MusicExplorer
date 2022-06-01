import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function graph_data_prettyfier(text) {
  //TODO function that prettyfies genres by replacing correct characters, uppercases etc
  function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, "g"), replace);
  }

  text = replaceAll(text, "____", "&");
  text = replaceAll(text, "___", "'");
  text = replaceAll(text, "__", "-");
  text = replaceAll(text, "_", " ");

  text = text
    .toLowerCase()
    .replace(/(^\w{1})|(\s{1}\w{1})/g, (match) => match.toUpperCase());
  return text;
}

export function millisToMinutesAndSeconds(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}

/**
 *
 * @param {String} text
 * @param {Boolean} toWord2VecFormat true: converts special characters to text. false: reverts '_nd_' back to '&'
 */
export function replace_special_characters(text, toWord2VecFormat) {
  var replaceList = [
    [" ", "qqqspcqqq"],
    ["-", "qqqhphnqqq"],
    ["'", "qqqpstrphqqq"],
    ["&", "qqqndqqq"],
    [":", "qqqclnqqq"],
    ["+", "qqqplsqqq"],
    ["1", "qqqenoqqq"],
    ["2", "qqqowtqqq"],
    ["3", "qqqeerhtqqq"],
    ["4", "qqqruofqqq"],
    ["5", "qqqevifqqq"],
    ["6", "qqqxisqqq"],
    ["7", "qqqnevesqqq"],
    ["8", "qqqthgieqqq"],
    ["9", "qqqeninqqq"],
    ["0", "qqqorezqqq"],
  ];

  for (var i = 0; i < replaceList.length; i++) {
    if (toWord2VecFormat)
      text = text.replaceAll(replaceList[i][0], replaceList[i][1]);
    else text = text.replaceAll(replaceList[i][1], replaceList[i][0]);
  }

  if (!toWord2VecFormat) {
    //make nice with uppercase letters
    text = text
      .toLowerCase()
      .replace(/(^\w{1})|(\s{1}\w{1})/g, (match) => match.toUpperCase());
  } else {
    text = text.toLowerCase();
  }

  return text;
}

// https://usehooks.com/useLocalStorage/
export function useLocalStorage(key, initialValue) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.log(error);
      return initialValue;
    }
  });
  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error);
    }
  };
  return [storedValue, setValue];
}

export function logout() {
  console.log("logout called");
  localStorage.clear();
  sessionStorage.clear();
  fetch("/spotify/logout").then((response) => {
    const url = "https://www.spotify.com/logout/";
    const spotifyLogoutWindow = window.open(
      url,
      "Spotify Logout",
      "width=700,height=500,top=40,left=40"
    );
    setTimeout(() => {
      spotifyLogoutWindow.close();
      window.location.reload(false);
    }, 500);
  });
}
