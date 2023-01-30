import { Event } from "../Cell/Event";
import EventDispatcher from "../Utility/EventDispatcher";

export class DependencyGraph {
    
    constructor(
        private data : any, 
        private dispatcher : EventDispatcher
    ) {
        this.dispatcher.listen(Event.FORMULA_CHANGED, this._updateGraph);
    }

    private _updateGraph()
    {

    }

    /**
     * Flat dependency tree into leveled layer
     * 
     * a -
     *    |- c -
     * b -      | - e -
     *       d -        | - g
     *                  |
     *              f -
     * 
     * to 
     * 
     * a | c | e | g
     * b | d | f |
     */
    flatten() {

    }
}