/**
 * Base class from which all game objects derive
 * @abstract
 */
class GameObjectBase {
    /**
     * Unique identifier for this scene
     * @type {number}
     */
    uId;

    /**
     * Game the object belongs to.
     * @type {GameCore}
     */
    gameCore;

    /**
     * @abstract 
     * @type {function | null} Process the entity frame
     */
    proc = null;

    /**
     * @abstract
     * @type {function | null} Render entity frame if it is renderable. When set to null this call will be ignored.
     */
    render = null;

    /**
     * Base constructor for all game objects. Ensures child classes have access to the GameCore object they belong to 
     * and a uniqueIdentifier
     * @param {GameCore} game GameCore that this entity belongs to.
     */
    constructor(gameCore) {
        this.gameCore = gameCore;
        this.uId = GameCore.getUniqueId();
    }
}