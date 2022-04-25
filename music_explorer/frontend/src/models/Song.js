class Song {
    constructor(id, title, artists, genre, duration, uri) {
        this.id = id;
        this.title = title;
        this.artists = artists;
        this.genre = genre;
        this.duration = duration;
        this.uri = uri;
    }
    /**
     * 
     * @param {Object} jsonObject 
     * @param {string} genre 
     * @returns {Song}
     */
    static fromJSON(jsonObject, genre) {
        let song = new Song();
        song.id = jsonObject["id"];
        song.title = jsonObject["name"];
        song.artists = jsonObject["artists"];
        song.genre = genre;
        song.duration = jsonObject["duration"];
        return song;
    }
}

export default Song