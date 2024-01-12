
class Scene extends GameObjectBase{
    /**
     * @type {string | null} allows a scene to override the GameCore background set by the GameCore 
     * without changing it.
     */
    backgroundColor = null;

    /**
     * Entities tracked by game
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