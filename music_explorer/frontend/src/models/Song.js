class Song {
    constructor(id, title, artists, genre, duration, uri, image) {
        this.id = id;
        this.title = title;
        this.artists = artists;
        this.genre = genre;
        this.duration = duration;
        this.uri = uri;
        this.image = image
    }
    /**
     * 
     * @param {Object} jsonObject 
     * @param {string} genre 
     * @returns {Song}
     */
    static fromJSON(jsonObject, genre) {
        console.log("From Song.fromJSON: ", jsonObject, genre);
        let song = new Song();
        song.id = jsonObject["id"];
        song.title = jsonObject["name"];
        song.artists = jsonObject["artists"] ?? [];
        song.genre = genre;
        song.duration = jsonObject["duration"];
        song.image = jsonObject["image"]
        return song;
    }
}

export default Song