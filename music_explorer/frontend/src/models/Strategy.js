
class Strategy {
    /**
     * @param {int} id
     * @param {string} name 
     * @param {string} description list of artist id's from sSpotify
     * @param {string} endpoints url after .../api/...
     */
    constructor(id, name, description, endpoint) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.endpoint = `/api/${endpoint}`
    }
}

export default Strategy