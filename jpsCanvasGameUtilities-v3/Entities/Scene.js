
class Scene extends GameObjectBase{
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
         * @type {number}
         */
        totalEntities: 0
    };
}