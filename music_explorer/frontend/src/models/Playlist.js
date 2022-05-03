import Song from "./Song";

class Playlist {
  /**
   *
   * @param {string} id the id of the playlist from Spotify
   * @param {string} title
   * @param {string[]} artists list of artist id's from sSpotify
   * @param {Song[]} tracks list of Song objects
   */
  constructor(id, title, artists, tracks) {
    this.id = id;
    this.title = title;
    this.tracks = tracks;
  }

  /**
   *
   * @param {Object} genreToSongs
   * @returns {Playlist}
   */
  static fromObject(genreToSongs) {
    let playlist = new Playlist();
    playlist.title = "New playlist";
    playlist.tracks = []
    var songs = Object.values(genreToSongs)
    var genres = Object.keys(genreToSongs)
    for (var i = 0; i<songs.length; i++){
      for (var j = 0; j<songs[i].length; j++){
        var song = songs[i][j]
        playlist.tracks.push(Song.fromJSON(song, genres[i]))
      }
    }
    
    // Object.values(list)[0].map((track) => {
    //   return Song.fromJSON(track, Object.keys(list)[0]);
    // });
    return playlist;
  }
}

export default Playlist;
