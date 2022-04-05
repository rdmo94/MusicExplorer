import React, { useState, useEffect } from "react";

function Profile() {
  const [playlists, setPlaylists] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("/api/get_user").then(response => response.json().then(json => setUser(json)))
    fetch("/spotify/get_playlists")
      .then(response => response.json())
      .then(json => setPlaylists(json))
  }, []);

  var status;
  if(playlists == null) {
    status = "Loading..."
  } else {
    status = "Done loading!"
  }

  return (
    <div>
      <h1>{user == null ? "Loader..." : user.user}</h1>
      <p></p>
    </div>
  );
}

export default Profile;
