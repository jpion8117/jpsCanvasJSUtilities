/**
 * @class 
 * @extends {GameObjectBase}
 * Provides a base class for non-interactive background objects that can be either used 
 * directly or extended further into more specific background entities. NOTE: since this 
 * class is designed for decorative entities only, the proc() method is not called during 
 * normal game loop opperation! Please process any appearance modifications in the 
 * render method!
 */
class BGObject extends GameObjectBase {
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
        this.scene.entities.background.push(this);
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
     *@type {Scene}
     */
    scene;

    /**
     * @preserve
     *@type {ResourceFile | null}
     */
    resource = null;

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
     *Default render method: override for more advanced implementations including complex 
     * shapes or using image based graphics like sprite sheets/tilemaps
     */
    render() {
        let box = this.getBoundingBox();
        this.gameCore.pen.fillStyle = this.color;
        this.gameCore.pen.fillRect(box.left, box.top, box.left + this.dimensions.w, box.top + this.dimensions.h);
    }
}