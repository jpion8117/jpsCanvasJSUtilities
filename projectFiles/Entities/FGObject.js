/**
 * @class 
 * @extends {GameObjectBase}
 * Defines a foreground entity that is able to interact with other 
 * foreground entities contained within a scene.
 */
class FGObject extends GameObjectBase {
    /**
     * @preserve
     *@constructor
     * @param {GameCore} gameCore 
     * @param {Scene} scene 
     */
    constructor(gameCore, scene) {
        super(gameCore);
        this.scene = scene;

        //register the entity with it's scene
        this.scene.entities.foreground.push(this);
    }

    /**
     * @preserve
     *@type {string} entity display color. By default this is the color of the box that 
     * is rendered by the default implementation of the render function.
     */
    color;

    /**
     * @preserve
     *location of the foreground object within the visiable scene
     */
    location = {
        /**
         * @type {number} 
         */
        x,

        /**
         * @type {number}
         */
        y,

        /**
         * @type {originPoint} x,y coordinate pair location.
         */
        originPoint: originPoint.topLeft
    };

    /**
     * @preserve
     *Width and height of the entity 
     */
    dimensions = {
        /**
         * @type {number} width
         */
        w,

        /**
         * @type {number} height
         */
        h
    }

    /**
     * @preserve
     *Gets entity's boundingBox
     * @returns {boundingBox}
     */
    getBoundingBox() {
        let box = new boundingBox;

        switch (this.location.originPoint) {
            case originPoint.topLeft:
                box.left = this.location.x;
                box.top = this.location.y;
                box.right = this.location.x + this.dimensions.w;
                box.bottom = this.location.y + this.dimensions.h;
                break;
            case originPoint.topRight:
                box.left = this.location.x - this.dimensions.w;
                box.top = this.location.y;
                box.right = this.location.x;
                box.bottom = this.location.y + this.dimensions.h;
                break;
            case originPoint.bottomLeft:
                box.left = this.location.x;
                box.top = this.location.y - this.dimensions.h;
                box.right = this.location.x + this.dimensions.w;
                box.bottom = this.location.y;
                break;
            case originPoint.bottomRight:
                box.left = this.location.x - this.dimensions.w;
                box.top = this.location.y - this.dimensions.h;
                box.right = this.location.x;
                box.bottom = this.location.y;
                break;
        }

        return box;
    }

    /**
     * @preserve
     *Override to respond to collisions or other game data.
     */
    proc = null;

    /**
     * @preserve
     *Default render method: override for more advanced implementations including complex 
     * shapes or using image based graphics like sprite sheets/tilemaps
     */
    render() {
        let box = this.getBoundingBox();
        this.gameCore.pen.fillStyle = this.color;
        this.gameCore.pen.fillRect(box.left, box.top, box.left + this.dimensions.w, box.top + this.dimensions.h);
    }
}

/**
 * @class
 * Simple Data structure containing the box boundries around an entity
 * @property {number} left Left edge of the box
 * @property {number} top Top edge of the box
 * @property {number} right Right edge of the box
 * @property {number} bottom Bottom edge of the box
 */
class boundingBox {
    /**
     * @preserve
     *@type {number} Left edge of the box
     */
    left;

    /**
     * @preserve
     *@type {number} Top edge of the box
     */
    top;

    /**
     * @preserve
     *@type {number} Right edge of the box
     */
    right;

    /**
     * @preserve
     *@type {number} Bottom edge of the box
     */
    bottom;
}

/**
 * @enum {number} Defines what corner an entity is being drawn 
 * from (where the x,y coord is located)
 */
const originPoint = Object.freeze({
    topLeft: 0,
    topRight: 1,
    bottomLeft: 2,
    bottomRight:3
});