

/**
 * Core controller class of the game. Handles all settings, timings, and orchestration of game entities.
 */
class GameCore{
    /**
     * @type {Array.<string>} Protected members that can not be overridden by the initializer options!
     */
    static protectedKeys = [
        "protectedKeys",
        "paper",
        "pen",
        "nextId",
        "getUniqueId",
        "init",
        "interval",
        "scenes"
    ]

    /**
     * @type {HTMLCanvasElement | null} The HTML5 canvas the game will be rendering to.
     */
    paper;

    /**
     * @type {CanvasRenderingContext2D | null} Canvas context for rendering content to canvas
     */
    pen;

    /**
     * Size of the canvas.
     */
    paperSize = {
        /**
         * @type {number}
         */
        width,

        /**
         * @type {number}
         */
        height
    }


    /**
     * @private {number} Tracks the next entity Id to be assigned. IMPORTANT! DO NOT ASSIGN DIRECTLY FROM THIS! Use the 
     * AssignId method to ensure this counter is incremented properly and all entities have a unique 
     * Id associated with them!
     */
    static nextId = 0;

    /**
     * @type {number} Frames per second
     */
    framerate = 60;

    /**
     * @type {number} Number of frames rendered. Used for tracking actual framerate delivered and for actions that 
     * happen every n number of frames
     */
    framesCount = 0;

    /**
     * @type {number} interval Id used to stop the game loop if needed
     */
    interval;

    /**
     * @type {string} Color string defining the desired default color
     */
    backgroundColor = "white";;

    /**
     * @type {Array.<Scene>} Individual scenes that make up a game. At least 
     * one scene must be added to the gameCore for any functionality. 
     */
    scenes;

    /**
     * @type {number} Index number of the current scene.
     */
    currentScene;

    /**
     * @type {Array.<InputAction>} Bound inputs currently being tracked.
     */
    inputQueue;

    /**
     * Gets a unique identifier for an entity.
     * @returns {number}
     */
    getUniqueId() {
        let id = GameCore.nextId;
        GameCore.nextId++;
        return id;
    }

    /**
     * Creates and initializes a new GameCore instance with the provided options
     * @param {string} canvasId HTML id tag used to target the canvas
     * @param {GameSettings | Object.any} options object containing any number of options that you would like to set. NOTE:
     * options MUST contain a width and height key-value pair to initialize properly. Even if they are set to null! It is 
     * recommended you use the GameSettings as a base for any options you would like to add as opposed to a generic JS 
     * object.
     * @returns {GameCore | null}
     */
    static init(canvasId, options = new GameSettings) {
        var game = new GameCore;

        try {
            game.paper = document.getElementById(canvasId);

            //verify that a canvas element was selected
            if (typeof(game.paper) !== "HTMLCanvasElement") {
                console.log(`Element with id "${canvasId} is of type ${game.paper.tagName} not canvas. Please check spelling and select a canvas element."`)
            }
        } 
        catch (error) {
            console.log(`Faild to locate canvas with id "${canvasId}" please verify spelling.`);
            console.info(error);
            return null;
        }
        
        if (!options.width || !options.height)
            return null;

        //configure width
        if (options.width !== null) game.paperSize.width = game.paper.width;
        
        //configure height
        if (options.height !== null) game.paper.height = options.height;

        //configure dimensions
        game.paperSize.height = game.paper.height;
        game.paperSize.width = game.paper.width;

        //remove width and height from options
        delete options.width;
        delete options.height;

        //configure optional settings
        for(const [key, value] of Object.entries(options)) {
            //ensures members that are vital to the functioning of the GameCore do not get overridden by mistake
            if (GameCore.protectedKeys.includes(key)) {
                console.log(`The member '${key}' is a foundational component of GameCore and cannot be overwritten! Please select a new name for the key`);
            }

            //allows the overriding of existing properties or methods that are not protected
            else if (game[key]) {
                game[key] = value;
            }

            //Allows for extension of the GameCore via options passed to the initializer
            else {
                game[key] = value;
            }
        }

        //get the canvas context (pen)
        game.pen = game.paper.getContext("2d");

        //start the game loop
        game.interval = setInterval(game.gameLoop, 1000/game.framerate)

        return game;
    }

    gameLoop() {
        //verify there is a scene loaded or load first scene.
        if (this.scenes && !this.currentScene)
            this.currentScene = 0;
        else {
            clearInterval(this.interval);
            console.log(`GameCore associated with canvasId:${this.paper.id} crashed: No scenes defined!`);
        }

        //separate data entities
        var startDE = []; var afterInputDe = []; var endDE = [];
        this.scenes[this.currentScene].entities.dataEntities.forEach(dataEntity => {
            switch (dataEntity.procLocation)
            {
                case procLoc.start:
                    startDE.push(dataEntity.proc);
                    break;
                case procLoc.afterInput:
                    afterInputDe.push(dataEntity.proc);
                    break;
                case procLoc.end:
                    endDE.push(dataEntity.proc);
                    break;
            }
        });

        //process start DataEntities
        startDE.forEach(proc => {
            if (typeof(proc) === "function") proc();
        });

        //process inputs
        this.inputQueue.forEach(action => {
            action.proc();
            if (action.complete) {
                this.inputQueue.splice(this.inputQueue.indexOf(action), 1);
            }
        });

        //process after input DataEntities
        afterInputDe.forEach(proc => {
            if (typeof(proc) === "function") proc();
        });

        //clear screen
        this.pen.fillStyle = this.backgroundColor;
        this.pen.fillRect(0, 0, this.paperSize.width, this.paperSize.height)

        //update scene
        this.scenes[this.currentScene].proc();

        //render scene
        this.scenes[this.currentScene].render();

        //process end DataEntities
        endDE.forEach(proc => {
            if (typeof(proc) === "function") proc();
        });

        //unload unused resource files
        this.scenes[this.currentScene].entities.resoruces.forEach(resource => {
            resource.proc()
        });

        //increment framecounter
        this.framesCount++;
    }
}