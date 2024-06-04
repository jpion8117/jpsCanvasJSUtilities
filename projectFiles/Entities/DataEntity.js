/**
 * Non-rendering entity used for processing game data.
 * @class 
 * @extends {GameObjectBase}
 */
class DataEntity extends GameObjectBase {
    /**
     * @preserve
     * @param {GameCore} gameCore GameCore object associated with this object.
     * @param {Scene} scene Scene associated with this object.
     * @param {procLoc} procLocation  Location within game loop where the data 
     * should be handled (procLoc.start for begining of loop, procLoc.afterInput 
     * for after user input processing, procLoc.end after all other entities are processed)
     */
    constructor(gameCore, scene, procLocation) {
        super(gameCore);
        this.scene = scene;
        this.procLocation = procLocation;

        this.scene.entities.dataEntities.push(this);
    }

    /**
     * @preserve
     *@type {Scene}
     */
    scene;

    /**
     * @preserve
     *@type {procLoc} Where should entity process data.
     */
    procLocation;
}

/**
 * @enum {string} Enumeration defining what part of the game loop a data entity will process its data
 */
const procLoc = Object.freeze({
    
    start: "___START___",
    afterInput: "___AFTER_INPUT___",
    end: "___END___"
});