
class ResourceFile extends GameObjectBase {
    /**
     * @preserve
     * @constructor
     * @param {GameCore} gameCore GameCore object associated with this object.
     * @param {Scene} scene Scene associated with this object.
     * @param {string} URL Url of the resource to load.
     */
    constructor(gameCore, scene, url) {
        super(gameCore);
        this.scene = scene;
        
        //register the entity with it's scene
        this.scene.entities.resoruces.push(this);
    }

    /**
     * @preserve
     *File URL
     * @type {string}
     */
    url;

    /**
     * @preserve
     *@type {HTMLImageElement} Image associated with this resource.
     */
    image;

    /**
     * @preserve
     *@type {Scene} Scene this resource belongs to.
     */
    scene;

    /**
     * @preserve
     *Checks to see if resource is still in use and if not it will delete itself
     */
    proc() {
        let inUse = false;
        /** @type {Array.<GameObjectBase>} */
        let entities = [];
        entities = entities.concat(this.scene.entities.background, this.scene.entities.foreground);

        //searchs scene entities to locate the first one using the resource. Searches 
        //from both the front and the back of the array to minimize iterations.
        for (let i = 0; i < entities.length; ++i) {
            let f = entities[i];
            let l = entities[entities.length - 1 - i];

            if ((f.resource && f.resource.uId === this.uId) ||
                 l.resource && l.resource.uId == this.uId) {
                    inUse = true;
                    break;
            }
        }

        //if no match was found the entity will unalive itself
        if (!inUse) {
            this.scene.removeResource(this.uId);
        }
    }
}