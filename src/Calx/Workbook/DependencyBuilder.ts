import EventDispatcher from "../Utility/EventDispatcher";
import { DependencyGraph } from "./DependencyGraph";

export class DependencyBuilder {
    constructor(
        private data : any,
        private dispatcher : EventDispatcher
    ) {

    }

    build() :DependencyGraph {
        return new DependencyGraph(this.data, this.dispatcher);
    }

    private _extractDependencies(formula : string) {

    }
}