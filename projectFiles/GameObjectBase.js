/**
 * Base class from which all game objects derive
 * @abstract
 */
class GameObjectBase {
    /**
     * @preserve
     *Unique identifier for this scene
     * @type {number}
     */
    uId;

    /**
     * @preserve
     *Game the object belongs to.
     * @type {GameCore}
     */
    gameCore;

    /**
     * @preserve
     *@abstract 
     * @type {function | null} Process the entity frame
     */
    proc = null;

    /**
     * @preserve
     *@abstract
     * @type {function | null} Render entity frame if it is renderable. When set to null this call will be ignored.
     */
    render = null;

    /**
     * @preserve
     *Base constructor for all game objects. Ensures child classes have access to the GameCore object they belong to 
     * and a uniqueIdentifier
     * @param {GameCore} game GameCore that this entity belongs to.
     */
    constructor(gameCore) {
        this.gameCore = gameCore;
        this.uId = GameCore.getUniqueId();
    }
}