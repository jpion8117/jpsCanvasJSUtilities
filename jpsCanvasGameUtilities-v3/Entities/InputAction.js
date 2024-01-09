/**
 * @extends {GameObjectBase}
 * Maps an input handler to a keyword that can be used to determine what input actions need to be taken. Centralizes 
 * the handling of inputs to a series of 'actions' that are independant of the input(s) used.
 */
class InputAction extends GameObjectBase {
    /**
     * True when an input action has been triggered.
     * @type {boolean}
     */
    triggered = false;

    /**
     * Name of the input action
     * @type {string}
     */
    keyword;

    /**
     * Creates an InputAction NOTE: THIS SHOULD NOT BE USED ON ITS OWN, USE 'bind' TO BOTH CREATE THE INPUT AND BIND IT 
     * TO A GameCore!!!
     * @param {GameCore} gameCore GameCore object this input is being monitored on.
     * @param {string} keyword Call name used to identfy this action. Ex 'up' for moving player up or 'attack' for an attack. 
     * The same name can be used by multiple input actions thus binding multiple keys to a single action. 
     * @param {function} checkInput Handler for monitoring this input.
     */
    constructor(gameCore, keyword, checkInput) {
        super(gameCore);
        this.checkInput = checkInput;
        this.keyword = keyword;
    }

    /**
     * Creates a bound input that is added to the GameCore's monitored inputs
     * @param {GameCore} gameCore GameCore object this input is being monitored on.
     * @param {string} keyword keyword used to identfy this action. Ex 'up' for moving player up or 'attack' for an attack. 
     * The same name can be used by multiple input actions thus binding multiple keys to a single action. 
     * @param {function} checkInput Handler for monitoring this input.
     */
    static bind(gameCore, keyword, checkInput) {
        if (typeof(keyword) !== "string") {
            console.log(`Input binding failed: keyword must be of type 'string' but was provided type '${typeof(keyword)}.'`);
            return false;
        }
        if (typeof(checkInput) !== "function") {
            console.log(`Input binding failed: proc must be of type 'function' but was provided type '${typeof(checkInput)}.'`);
            return false;
        }

        //add bound input to the game and return true;
        let input = new InputAction(gameCore, keyword, checkInput);
        gameCore.inputs.push(input);
        return true;
    }
}