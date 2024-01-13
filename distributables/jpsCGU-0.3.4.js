/**********************************************************************************
* This is a concatenation of all the selected files, including files in subfolders.
* The start and end of each file contains a comment with its name.
***********************************************************************************
* These are the line numbers for the included files:
* 17		D:\DROPBOX\JP\DOCUMENTS\JPSCANVASGAMEUTILIS\JPSCANVASJSUTILITIES\PROJECTFILES\GAMECORE.JS
* 261		D:\DROPBOX\JP\DOCUMENTS\JPSCANVASGAMEUTILIS\JPSCANVASJSUTILITIES\PROJECTFILES\GAMEOBJECTBASE.JS
* 306		D:\DROPBOX\JP\DOCUMENTS\JPSCANVASGAMEUTILIS\JPSCANVASJSUTILITIES\PROJECTFILES\GAMESETTINGS.JS
* 343		D:\DROPBOX\JP\DOCUMENTS\JPSCANVASGAMEUTILIS\JPSCANVASJSUTILITIES\PROJECTFILES\JPSCANVASGAMEUTILITIES_V2.JS
* 875		D:\DROPBOX\JP\DOCUMENTS\JPSCANVASGAMEUTILIS\JPSCANVASJSUTILITIES\PROJECTFILES\ENTITIES\BGOBJECT.JS
* 1002		D:\DROPBOX\JP\DOCUMENTS\JPSCANVASGAMEUTILIS\JPSCANVASJSUTILITIES\PROJECTFILES\ENTITIES\DATAENTITY.JS
* 1048		D:\DROPBOX\JP\DOCUMENTS\JPSCANVASGAMEUTILIS\JPSCANVASJSUTILITIES\PROJECTFILES\ENTITIES\FGOBJECT.JS
* 1208		D:\DROPBOX\JP\DOCUMENTS\JPSCANVASGAMEUTILIS\JPSCANVASJSUTILITIES\PROJECTFILES\ENTITIES\INPUTACTION.JS
* 1265		D:\DROPBOX\JP\DOCUMENTS\JPSCANVASGAMEUTILIS\JPSCANVASJSUTILITIES\PROJECTFILES\ENTITIES\RESOURCEFILE.JS
* 1321		D:\DROPBOX\JP\DOCUMENTS\JPSCANVASGAMEUTILIS\JPSCANVASJSUTILITIES\PROJECTFILES\ENTITIES\SCENE.JS
***********************************************************************************/
/*********************************************************************************
* Start: D:\DROPBOX\JP\DOCUMENTS\JPSCANVASGAMEUTILIS\JPSCANVASJSUTILITIES\PROJECTFILES\GAMECORE.JS
**********************************************************************************/


/**
 * Core controller class of the game. Handles all settings, timings, and orchestration of game entities.
 */
class GameCore{
    /**
     * @preserve
     *@type {Array.<string>} Protected members that can not be overridden by the initializer options!
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
     * @preserve
     *@type {HTMLCanvasElement | null} The HTML5 canvas the game will be rendering to.
     */
    paper;

    /**
     * @preserve
     *@type {CanvasRenderingContext2D | null} Canvas context for rendering content to canvas
     */
    pen;

    /**
     * @preserve
     *Size of the canvas.
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
     * @preserve
     *@private {number} Tracks the next entity Id to be assigned. IMPORTANT! DO NOT ASSIGN DIRECTLY FROM THIS! Use the 
     * AssignId method to ensure this counter is incremented properly and all entities have a unique 
     * Id associated with them!
     */
    static nextId = 0;

    /**
     * @preserve
     *@type {number} Frames per second
     */
    framerate = 60;

    /**
     * @preserve
     *@type {number} Number of frames rendered. Used for tracking actual framerate delivered and for actions that 
     * happen every n number of frames
     */
    framesCount = 0;

    /**
     * @preserve
     *@type {number} interval Id used to stop the game loop if needed
     */
    interval;

    /**
     * @preserve
     *@type {string} Color string defining the desired default color
     */
    backgroundColor = "white";;

    /**
     * @preserve
     *@type {Array.<Scene>} Individual scenes that make up a game. At least 
     * one scene must be added to the gameCore for any functionality. 
     */
    scenes;

    /**
     * @preserve
     *@type {number} Index number of the current scene.
     */
    currentScene;

    /**
     * @preserve
     *@type {Array.<InputAction>} Bound inputs currently being tracked.
     */
    inputQueue;

    /**
     * @preserve
     *Gets a unique identifier for an entity.
     * @returns {number}
     */
    getUniqueId() {
        let id = GameCore.nextId;
        GameCore.nextId++;
        return id;
    }

    /**
     * @preserve
     *Creates and initializes a new GameCore instance with the provided options
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
/*********************************************************************************
* End: D:\DROPBOX\JP\DOCUMENTS\JPSCANVASGAMEUTILIS\JPSCANVASJSUTILITIES\PROJECTFILES\GAMECORE.JS
**********************************************************************************/
/*********************************************************************************
* Start: D:\DROPBOX\JP\DOCUMENTS\JPSCANVASGAMEUTILIS\JPSCANVASJSUTILITIES\PROJECTFILES\GAMEOBJECTBASE.JS
**********************************************************************************/
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
/*********************************************************************************
* End: D:\DROPBOX\JP\DOCUMENTS\JPSCANVASGAMEUTILIS\JPSCANVASJSUTILITIES\PROJECTFILES\GAMEOBJECTBASE.JS
**********************************************************************************/
/*********************************************************************************
* Start: D:\DROPBOX\JP\DOCUMENTS\JPSCANVASGAMEUTILIS\JPSCANVASJSUTILITIES\PROJECTFILES\GAMESETTINGS.JS
**********************************************************************************/
/**
 * Game options base class. Intended to be used to configure the game settings that get passed to the GameCore 
 * initializer as options
 */
class GameSettings {
    /**
     * @preserve
     *Width of the canvas, if set to null, the width of the canvas will be the width defined in 
     * the HTML/CSS for the page
     * @type {number}
     */
    width = null;
    
    /**
     * @preserve
     *Height of the canvas, if set to null, the height of the canvas will be the height defined in 
     * the HTML/CSS for the page
     * @type {number}
     */
    height = null;

    /**
     * @preserve
     *Color string defining the desired default color
     * @type {string}
     */
    backgroundColor = "white";

    /**
     * @preserve
     *Frames per second
     * @type {number} 
     */
    framerate = 60;
}
/*********************************************************************************
* End: D:\DROPBOX\JP\DOCUMENTS\JPSCANVASGAMEUTILIS\JPSCANVASJSUTILITIES\PROJECTFILES\GAMESETTINGS.JS
**********************************************************************************/
/*********************************************************************************
* Start: D:\DROPBOX\JP\DOCUMENTS\JPSCANVASGAMEUTILIS\JPSCANVASJSUTILITIES\PROJECTFILES\JPSCANVASGAMEUTILITIES_V2.JS
**********************************************************************************/
/**************************************************************
 * This will function as a template script for building 
 * canvas based games.
**************************************************************/

function CreateGameMaster(targetID)
{
    try
    {
        this.paper = document.getElementById(targetID);
    }
    catch(err)
    {
        console.log("Failed to initialize canvas. Try checking the spelling of your targetID.");
        console.info(err);
        return;
    }

    this.pen = this.paper.getContext("2d");
    this.interval = null;
    this.gameForegroundObjects = [];
    this.gameBackgroundObjects = [];
    this.framerate = 60;
    this.framesCount = 0;
    this.backgroundColor = "white";
    this.objectID = 1000;
    this.init = function(options = {width: "default", height:"default"})
    {
        //if width and height are not specified when initializing, the width and height set in HTML or CSS will be used.
        if (options.width != NaN && options.width > 0) this.paper.width = options.width;
        if (options.height != NaN && options.height > 0) this.paper.height = options.height;

        //import other options
        if(options.framerate) this.framerate = options.framerate;
        if(options.backgroundColor) this.backgroundColor = options.backgroundColor;

        //start the game loop.
        var tmp = this;
        this.interval = window.setInterval(function() { tmp.gameUpdate(tmp); }, 1000/this.framerate);
    };
    this.gameUpdate = function(game)
    {
        //make sure pen isn't out of ink (verify that getContext("2d") was successful)
        if(!game.pen)
        {
            console.log("Your pen's outta ink mate...");
            game.interval.stopInterval();
        }
        //first step is to clear the frame, I chose fillRect because it can fill the screen with any chosen color
        game.pen.fillStyle = game.backgroundColor;
        game.pen.fillRect(0, 0, game.paper.width, game.paper.height);

        //draws any background elements to the frame first
        for (let i = 0; i < game.gameBackgroundObjects.length; ++i)
        {
            game.gameBackgroundObjects[i].drawFrame(game);
        }

        //processes all foreground elements in four step process
        for (let i = 0; i < game.gameForegroundObjects.length; ++i)
        {
            //step 1: check element's collisions and track them in that element's collision array
            game.gameForegroundObjects[i].checkCollisions(game);

            //step 2: Process any nessassary updates to the frame (by default this function just returns false)
            //        including acting on collisions, getting user input, and moving the element.
            game.gameForegroundObjects[i].updateFrame(game);

            //step 3: Draw the element at it's current position (by default this just draws a square at the coords
            //        of the element, but it can easily be overloaded for other functionality)
            game.gameForegroundObjects[i].drawFrame(game);
            
            //step 4: remove the object from the array if it was marked to be removed. Doing this at this step prevents
            //        errors caused by attempted function calls on "dead" entities
            if(game.gameForegroundObjects[i].markForRemoval)
            {
                game.gameForegroundObjects.splice(i, 1); //remove element from array
                i--; //adjust i since the array is now one element smaller
            }
        }

        //draw overlay layer
        this.drawOverlay();

        //update the frameCount property. this is used to track when certain events happen in the game
        this.framesCount++
    };
    //this function is called at the end of the game update loop to render an info layer at the top most layer of the screen
    //anything drawn in this layer is automatically the rendered above all background and foreground objects.
    this.drawOverlay = function() {};
    //this is used to force all background objects to reindex. Depending on the number of background objects this could be very resource 
    //intensive and should therefore only be used when nessassary
    this.reindexBGObjects = function()
    {
        for (let i = 0; i < this.gameBackgroundObjects.length; ++i)
        {
            this.gameBackgroundObjects[i].index = i;
        }
    };
}

function GameBGObject(Game, x, y, width, height, options = {color:"black"})
{
    //I litterally can't think of a reason why a uniqueID is needed for background objects, but I figured it
    //really doesn't take much effort to add it
    this.uniqueID = Game.objectID;
    Game.objectID++;

    //set the coords for this object
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    //save the GameObject so methods in this class are perpetually aware of which object they belong to
    this.GameObject = Game;

    //set the background color
    this.color = options.color;

    this.desciption = ""

    //define the default render method
    //this will simply fill in a rectangle with the coords and dimensions provided but can be overridden
    //to do much more!
    this.drawFrame = function(GameObject)
    {
        //make sure pen isn't out of ink (verify that getContext("2d") was successful)
        if(!GameObject.pen)
        {
            console.log("Your pen's outta ink mate...");
            GameObject.interval.stopInterval();
        }

        //first step is to clear the frame, I chose fillRect because it can fill the screen with any chosen color
        GameObject.pen.fillStyle = this.color;
        GameObject.pen.fillRect(this.x, this.y, this.width, this.height);
    };

    //by default, all background objects will render in the order they were declared with with the most recently declared 
    //appearing on top, the folowing methods will allow you to reorder the background draw order on the fly.
    this.moveUp = function()
    {
        //make sure we don't exceed the boundries of the array
        if(this.index === this.GameObject.gameBackgroundObjects.length - 1)
        {
            console.log("BackgroundObject #"+this.uniqueID+" is already at the top of the render stack!");
            console.info(this);
            return;
        }
        
        //save the 
        
        var tmp = this.GameObject.gameBackgroundObjects[this.index + 1];

        //swap the objects around.
        this.GameObject.gameBackgroundObjects[this.index + 1] = this;
        this.GameObject.gameBackgroundObjects[this.index] = tmp;

        //update each object's array index number;
        this.GameObject.gameBackgroundObjects[this.index].index = this.index;
        this.index++;
    };
    this.moveDown = function()
    {
        //make sure we don't exceed the boundries of the array
        if(this.index === 0)
        {    
            console.log("BackgroundObject #"+this.uniqueID+" is already at the bottom of the render stack!");
            console.info(this);
            return;
        }
        
        //save the object currently in front of this one
        var tmp = this.GameObject.gameBackgroundObjects[this.index - 1];

        //swap the objects around.
        this.GameObject.gameBackgroundObjects[this.index - 1] = this;
        this.GameObject.gameBackgroundObjects[this.index] = tmp;

        //update each object's array index number;
        this.GameObject.gameBackgroundObjects[this.index].index = this.index;
        this.index--;
    };
    //the following functions are both very powerful in their percision, but involve moving many elements in the
    //array and therefore may be resource intensive. Use at your own risk!
    this.moveBefore = function(targetID)
    {
        //find target element and get it's index
        var targetIndex = "unknown object";
        for (let i = 0; i < this.GameObject.gameBackgroundObjects.length; ++i)
        {
            if(this.GameObject.gameBackgroundObjects[i].uniqueID === targetID)
            {
                targetIndex = i;
                break;
            }
        }

        //verify element was located
        if(targetIndex === "unknown object") 
        {
            console.log("failed to locate GameBGObject #"+targetID+" please make sure you entered the correct ID.");
        }

        //remove original
        this.GameObject.gameBackgroundObjects.splice(this.index,1);

        //perform move opperation
        if(targetIndex === 0)
        {
            this.GameObject.gameBackgroundObjects.unshift(this);
        }
        else
        {
            this.GameObject.gameBackgroundObjects.splice(targetIndex, 0, this);
        }

        //reindex array elements to ensure they all have the proper index number
        this.GameObject.reindexBGObjects();
    };
    this.moveAfter = function(targetID)
    {
        //find target element and get it's index
        var targetIndex = "unknown object";
        for (let i = 0; i < this.GameObject.gameBackgroundObjects.length; ++i)
        {
            if(this.GameObject.gameBackgroundObjects[i].uniqueID === targetID)
            {
                targetIndex = i;
                break;
            }
        }

        //remove original
        this.GameObject.gameBackgroundObjects.splice(this.index,1);

        //verify element was located
        if(targetIndex === "unknown object") 
        {
            console.log("failed to locate GameBGObject #"+targetID+" please make sure you entered the correct ID.");
        }

        //perform move opperation
        if(targetIndex === this.GameObject.gameBackgroundObjects.length - 1)
        {
            this.GameObject.gameBackgroundObjects.push(this);
        }
        else
        {
            this.GameObject.gameBackgroundObjects.splice(targetIndex, 0, this);
        }
        
        //reindex array elements to ensure they all have the proper index number
        this.GameObject.reindexBGObjects();
    };

    //register with the background object array.
    this.GameObject.gameBackgroundObjects.push(this);

    //save the index number
    this.index = this.GameObject.gameBackgroundObjects.length - 1;

    //load optional parameters
    if(options.desciption) this.desciption = options.desciption;
    if(typeof options.drawFrame === "function") this.drawFrame = options.drawFrame;
}

//Creates a foreground game object with the coords passed to it, then adds the object to the MasterGame.gameForegroundObjects array
//for frame processing.
function GameFGObject(Game, x, y, width, height, options = {})
{
    //get a uniqueID for this object
    //this ID is assigned by the master game object and is unique for every element of the game both background and 
    //foreground
    this.uniqueID = Game.objectID
    Game.objectID++; //iterate the ID so the next one remains unique

    //store the game object that this piece belongs to
    this.GameObject = Game;

    //set the bounding box of this object
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.type = ""; //by default this is blank, but this is used to identify object types for collision detection
    this.overlapObjects = []; //this array contains all the elements overlapping with this one (except itself)
    this.color = "black" //simple default color, designed to be either ignored or overwritten
    
    //Function checks if this element is overlapping with any other foreground elements
    this.checkCollisions = function(Game)
    {
        //reset overlapping objects for this frame
        this.overlapObjects = [];

        //begin searching other objects in the foreground for collisions
        for (let i = 0; i < Game.gameForegroundObjects.length; ++i)
        {
            //indicates loop needs skip (continue statements didn't work for some reason!)
            let skip = false;

            //make sure we're not checking collision on the same object as this
            if(this.uniqueID == Game.gameForegroundObjects[i].uniqueID) skip=true; //obviously this object will overlap itself
            
            if(!skip)
            {
                //check for collisions
                let c = Game.gameForegroundObjects[i];
                if(this.x < c.x + c.width &&
                    this.x + this.width > c.x &&
                    this.y < c.y + c.height &&
                    this.height + this.y > c.y)
                {
                    //registerCollision
                    this.overlapObjects.push(Game.gameForegroundObjects[i]);
                }
            }
        }
    }

    //any elements that need additional processing between frames can override this function others will simply call it and throw out the result
    this.updateFrame = function(){ return false; /* used to quickly verify if custom update code was supplied */ }
    
    //provides basic instructions for drawing this element's current frame (after processing), for more advanced elements (non-rectangular shapes,
    //pre-rendered graphics, text, etc.) this can be overridden to draw the frame in any way needed
    this.drawFrame = function(Game) //can be overridden for custom behavior
    {
        //run pre draw method if it exists
        if(this.preDrawFrame && typeof(preDrawFrame) === "function") this.preDrawFrame();

        //default draw action
        Game.pen.fillStyle = this.color;
        Game.pen.fillRect(this.x, this.y, this.width, this.height);

        //run post draw method if it exists
        if(this.postDrawFrame && typeof postDrawFrame === "function") this.postDrawFrame();
    }

    //save this element's location in the foregroundObject array
    // this.arrayIndex = Game.gameForegroundObjects.length;

    //put the element in the foreground array. elements will render in the order they were declared (newest elements will render on top) 
    Game.gameForegroundObjects.push(this);

    //make object aware of it's position in the render stack
    this.index = Game.gameForegroundObjects.length - 1;

    //removal indicator
    this.markForRemoval = false; //not imediatly deleting an object it insures it can be removed from the game safely

    this.remove = function()
    {
        this.markForRemoval = true;
    }

    //render position methods
    this.moveUp = function()
    {
        //check if the object is already rendering on top
        if(this.index === this.gameForegroundObjects.length-1)
        {
            console.log("ForegroundObject #"+this.uniqueID+" is already at the top of the render stack!");
            console.info(this);
            return;
        }

        //create a local var to store the current object above this one
        var otherFGO = this.GameObject.gameForegroundObjects[this.index+1];

        //move the objects.
        this.GameObject.gameForegroundObjects[this.index+1] = this.GameObject.gameForegroundObjects[this.index];
        this.GameObject.gameForegroundObjects[this.index] = otherFGO;

        //update both object's index position
        this.GameObject.gameForegroundObjects[this.index].index = this.index;
        this.index++;
    }
    this.moveDown = function()
    {
        //check if the object is already rendering on top
        if(this.index === 0)
        {
            console.log("ForegroundObject #"+this.uniqueID+" is already at the bottom of the render stack!");
            console.info(this);
            return;
        }

        //create a local var to store the current object above this one
        var otherFGO = this.GameObject.gameForegroundObjects[this.index-1];

        //move the objects.
        this.GameObject.gameForegroundObjects[this.index-1] = this.GameObject.gameForegroundObjects[this.index];
        this.GameObject.gameForegroundObjects[this.index] = otherFGO;

        //update both object's index position
        this.GameObject.gameForegroundObjects[this.index].index = this.index;
        this.index--;
    }
    //the following render stack methods should be used sparingly as they have the potential to be very resource intesive due to the
    //reindexing of many elements. 
    this.sendToBack = function()
    {
        while(this.index !== 0)
        {
            this.moveDown();
        }
    }
    this.sendToFront = function()
    {
        while(this.index !== this.gameForegroundObjects.length-1)
        {
            this.moveUp();
        }
    }
    //set optional parameters
    if(options.type) this.type = options.type;
    if(options.color) this.color = options.color;
    if(typeof options.updateFrame === "function") this.updateFrame = options.updateFrame;
    if(typeof options.drawFrame === "function") this.drawFrame = options.drawFrame;
    if(typeof options.preDrawFrame === "function") this.preDrawFrame = options.preDrawFrame;
    if(typeof options.postDrawFrame === "function") this.postDrawFrame = options.postDrawFrame;
}

Sprite = {
    //can be used to call the default render function from within a custom one. Provided mostly as a convienence
    //when defining a custom render method
    render: function(sprite, game, x, y, scale = 1)
    {
        //get the current cell location
        var cellRow = Math.floor(sprite.frame / sprite.rows);
        var cellCol = Math.floor(sprite.frame % sprite.rows);

        //draw the image using the game object
        game.pen.drawImage( sprite.image, 
                            cellCol * sprite.frameW, cellRow * sprite.frameH,
                            sprite.frameW, sprite.frameH,
                            x, y,
                            sprite.frameW * scale, sprite.frameH * scale
                          );
    },
    spriteRegistration: []
};


function GameSprite(url, frameW, frameH, columns, rows, options = {})
{
    //log creation of sprite for error checking
    if(options.debugLogCreation) console.log("Creating new generic sprite with these attributes.\nurl: "+url+"\nframeW: "+frameW+"\nframeH: "+frameH+
                "\ncolumns: "+columns+"\nrows:"+rows+"\noptions: "+options)
    
    //check if another sprite has already loaded the requested url
    this.uniqueSprite = true; //start out assuming the sprite is unique until check is performed
    for(let i = 0; i < Sprite.spriteRegistration.length; ++i)
    {
        if(Sprite.spriteRegistration[i].url === url)
        {
            if(options.debugLogCreation) console.log("Sprite created with existing image");
            this.image = Sprite.spriteRegistration[i].image;
            this.uniqueSprite = false;
            break;
        }
    }

    //get the image object
    if(!this.image)
    {
        if(options.debugLogCreation) console.log("Sprite created with new image")
        this.image = new Image();
        this.image.src = url;
    }

    //set the frame dimensions
    this.frameW = frameW;
    this.frameH = frameH;

    //set the frame table parameters
    this.cols = columns;
    this.rows = rows;

    //save the url string
    this.url = url;

    //set frame data
    this.endFrame = rows * columns - 1; //default can be overwritten in frame options
    this.startFrame = 0; //by default frame will start at 0

    //default methods
    //all default methods can be overwritten for additional functionality
    this.render = function(game, x, y, scale = 1) { Sprite.render(this, game, x, y, scale); };
    
    this.nextFrame = function()
    {
        //advance the frame foreward one
        this.frame++;
        
        //if the frame advanced past the end frame, loop it
        if(this.frame > this.endFrame) this.frame = this.startFrame;
    };
    this.prevFrame = function()
    {
        //advance the frame back one
        this.frame--;
        
        //if the frame advanced past the start frame, loop it
        if(this.frame < this.startFrame) this.frame = this.endFrame;
    }

    //check for/set optional parameters
    if(options.endFrame) this.endFrame = options.endFrame;
    if(options.startFrame) this.startFrame = options.startFrame;
    if(typeof options.render === "function") this.render = options.render;
    if(typeof options.nextFrame === "function") this.nextFrame = option.nextFrame; // I litterally can't think of a reason to override this, but the option is there
    if(typeof options.prevFrame === "function") this.prevFrame = option.prevFrame; // I litterally can't think of a reason to override this, but the option is there

    //set the current frame
    this.frame = this.startFrame;

    //register the sprite if it is unique
    //this cuts down on the number of elements to search when looking for shared sprite images.
    if(this.uniqueSprite)
        Sprite.spriteRegistration.push(this);
}


/*********************************************************************************
* End: D:\DROPBOX\JP\DOCUMENTS\JPSCANVASGAMEUTILIS\JPSCANVASJSUTILITIES\PROJECTFILES\JPSCANVASGAMEUTILITIES_V2.JS
**********************************************************************************/
/*********************************************************************************
* Start: D:\DROPBOX\JP\DOCUMENTS\JPSCANVASGAMEUTILIS\JPSCANVASJSUTILITIES\PROJECTFILES\ENTITIES\BGOBJECT.JS
**********************************************************************************/
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
/*********************************************************************************
* End: D:\DROPBOX\JP\DOCUMENTS\JPSCANVASGAMEUTILIS\JPSCANVASJSUTILITIES\PROJECTFILES\ENTITIES\BGOBJECT.JS
**********************************************************************************/
/*********************************************************************************
* Start: D:\DROPBOX\JP\DOCUMENTS\JPSCANVASGAMEUTILIS\JPSCANVASJSUTILITIES\PROJECTFILES\ENTITIES\DATAENTITY.JS
**********************************************************************************/
/**
 * Non-rendering entity used for processing game data.
 * @class 
 * @extends {GameObjectBase}
 */
class DataEntity extends GameObjectBase {
    /**
     * @preserve
     *
     * @param {GameCore} gameCore 
     * @param {Scene} scene 
     * @param {procLoc} procLocation 
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
/*********************************************************************************
* End: D:\DROPBOX\JP\DOCUMENTS\JPSCANVASGAMEUTILIS\JPSCANVASJSUTILITIES\PROJECTFILES\ENTITIES\DATAENTITY.JS
**********************************************************************************/
/*********************************************************************************
* Start: D:\DROPBOX\JP\DOCUMENTS\JPSCANVASGAMEUTILIS\JPSCANVASJSUTILITIES\PROJECTFILES\ENTITIES\FGOBJECT.JS
**********************************************************************************/
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
/*********************************************************************************
* End: D:\DROPBOX\JP\DOCUMENTS\JPSCANVASGAMEUTILIS\JPSCANVASJSUTILITIES\PROJECTFILES\ENTITIES\FGOBJECT.JS
**********************************************************************************/
/*********************************************************************************
* Start: D:\DROPBOX\JP\DOCUMENTS\JPSCANVASGAMEUTILIS\JPSCANVASJSUTILITIES\PROJECTFILES\ENTITIES\INPUTACTION.JS
**********************************************************************************/
/**
 * Maps an input handler to a keyword that can be used to determine what input actions need to be taken. Centralizes 
 * the handling of inputs to a series of 'actions' that are independant of the input(s) used.
 */
class InputAction {
    /**
     * @preserve
     *Name of the input action
     * @type {string}
     */
    keyword;

    /**
     * @preserve
     *@type {boolean} marks when an input action can be removed from the queue.
     */
    complete;

    /**
     * @preserve
     *@abstract
     * @type {function} 
     * Process the input's action
     */
    proc;

    /**
     * @preserve
     *Creates an InputAction NOTE: THIS SHOULD NOT BE USED ON ITS OWN, USE 'bind' TO BOTH CREATE THE INPUT AND BIND IT 
     * TO A GameCore!!!
     * @param {string} keyword Call name used to identfy this action. Ex 'up' for moving player up or 'attack' for an attack. 
     * The same name can be used by multiple input actions thus binding multiple keys to a single action. 
     */
    constructor(keyword) {
        this.keyword = keyword;
    }

    /**
     * @preserve
     *Creates a bound input that is added to the GameCore's monitored inputs
     * @param {GameCore} gameCore GameCore object this input is being monitored on.
     * @param {string} keyword keyword used to identfy this action. Ex 'up' for moving player up or 'attack' for an attack. 
     * The same name can be used by multiple input actions thus binding multiple keys to a single action. 
     */
    static queue(gameCore, keyword) {
        if (typeof(keyword) !== "string") {
            console.log(`Input binding failed: keyword must be of type 'string' but was provided type '${typeof(keyword)}.'`);
            return false;
        }

        //add bound input to the game and return true;
        let input = new InputAction(gameCore, keyword);
        gameCore.inputQueue.push(input);
        return true;
    }
}
/*********************************************************************************
* End: D:\DROPBOX\JP\DOCUMENTS\JPSCANVASGAMEUTILIS\JPSCANVASJSUTILITIES\PROJECTFILES\ENTITIES\INPUTACTION.JS
**********************************************************************************/
/*********************************************************************************
* Start: D:\DROPBOX\JP\DOCUMENTS\JPSCANVASGAMEUTILIS\JPSCANVASJSUTILITIES\PROJECTFILES\ENTITIES\RESOURCEFILE.JS
**********************************************************************************/

class ResourceFile extends GameObjectBase {
    constructor(gameObject, scene) {

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

        //if no match was found the entity will remove itself
        if (!inUse) {
            this.scene.removeResource(this.uId);
        }
    }
}
/*********************************************************************************
* End: D:\DROPBOX\JP\DOCUMENTS\JPSCANVASGAMEUTILIS\JPSCANVASJSUTILITIES\PROJECTFILES\ENTITIES\RESOURCEFILE.JS
**********************************************************************************/
/*********************************************************************************
* Start: D:\DROPBOX\JP\DOCUMENTS\JPSCANVASGAMEUTILIS\JPSCANVASJSUTILITIES\PROJECTFILES\ENTITIES\SCENE.JS
**********************************************************************************/

class Scene extends GameObjectBase{
    /**
     * @preserve
     *
     * @param {GameCore} gameCore 
     */
    constructor(gameCore) {
        super(gameCore);
    }
    /**
     * @preserve
     *@type {string | null} allows a scene to override the GameCore background set by the GameCore 
     * without changing it.
     */
    backgroundColor = null;

    /**
     * @preserve
     *Entities tracked by game
     */
    entities = {
        /**
         * Interactive forground entities
         * @type {FGObject[]}
         */
        foreground,

        /**
         * Background/decorative entities
         * @type {BGObject[]}
         */
        background,

        /**
         * loaded resources actively in use by at least one entity
         * @type {ResourceFile[]}
         */
        resoruces,

        /**
         * @type {Array.<DataEntity>} 
         */
        dataEntities,

        /**
         * Total number of entities being tracked.
         * @param {Array.<string> | string | null} types type(s) of entities to count. Leave blank to count all.
         * @returns {number}
         */
        getTotalEntities: function(types = null) {
            if (types !== null) {
                var selectiveTotal = 0;
                if (typeof(types) === "string") {
                    if (this[types]) selectiveTotal += this[types].length;
                }
                else { 
                    types.forEach(entityType => {
                        if (this[entityType]) selectiveTotal += this[entityType].length;
                    });
                }

                return selectiveTotal;
            }

            return this.foreground.length + this.background.length + this.resoruces.length;
        }
    };

    /**
     * @preserve
     *Removes a ResourceFile from loaded resources via its uId
     * @param {number} uId 
     */
    removeResource(uId) {
        for (let i = 0; i < this.entities.resoruces.length; i++) {
            if (this.entities.resoruces[i].uId == uId)
            {
                this.entities.resoruces.splice(i, 1);
                return;
            }
        }
    }

    proc() {
        //check collisions

        //process forground entity changes
        this.entities.foreground.forEach(element => {
            if(typeof(element) === "function") element.proc()
        });
    }

    render() {
        if (this.backgroundColor || this.backgroundColor !== this.gameCore.backgroundColor) {
            this.gameCore.pen.fillStyle = this.backgroundColor;
            this.gameCore.pen.fillRect(0, 0, this.gameCore.paperSize.width, this.gameCore.paperSize.height);
        }

        //render background entities
        this.entities.background.forEach(bgEntity => {
            if (typeof(bgEntity.render) === "function") bgEntity.render();
        });

        //render foreground entities
        this.entities.foreground.forEach(fgEntity => {
            if (typeof(fgEntity.render) === "function") fgEntity.render();
        }); 
    }
}
/*********************************************************************************
* End: D:\DROPBOX\JP\DOCUMENTS\JPSCANVASGAMEUTILIS\JPSCANVASJSUTILITIES\PROJECTFILES\ENTITIES\SCENE.JS
**********************************************************************************/