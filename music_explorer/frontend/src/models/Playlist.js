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
     * @param {Object} object 
     * @returns {Playlist}
     */
    static fromObject(object) {
        let playlist = new Playlist();
        playlist.title = "New playlist"
        playlist.tracks = Object.keys(object).map((k) => {return Song.fromJSON(object[k], k);});
        return playlist;
    }
}

export default Playlist