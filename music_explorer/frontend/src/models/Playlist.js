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
   * @param {List<Object>} object
   * @returns {Playlist}
   */
  static fromObject(list) {
    let playlist = new Playlist();
    playlist.title = "New playlist";
    playlist.tracks = list.map((object) => {
      return Song.fromJSON(Object.values(object)[0], Object.keys(object)[0]);
    });
    return playlist;
  }
}

export default Playlist;
