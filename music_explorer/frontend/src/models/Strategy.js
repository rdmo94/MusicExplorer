
class Strategy {
    /**
     * 
     * @param {string} name 
     * @param {string} description list of artist id's from sSpotify
     * @param {string} endpoints url after .../api/...
     */
    constructor(name, description, endpoint) {
        this.name = name;
        this.description = description;
        this.endpoint = `/api/${endpoint}`
    }
}

export default Strategy