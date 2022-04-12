
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
        this.artists = artists;
        this.tracks = tracks;
    }
}

export default Playlist