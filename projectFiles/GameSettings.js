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