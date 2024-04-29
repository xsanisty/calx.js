/**
 * Simple event dispatcher with pause and resume.
 *
 */
export default class EventDispatcher {
    private _listeners : Record<string, any> = {};
    private _isEventPaused : boolean = false;

    public listen (type : string, listener : Function) {
        if (this._listeners === undefined) this._listeners = {};

        var listeners = this._listeners;
        if (listeners[type] === undefined) {
            listeners[type] = [];
        }

        if (listeners[type].indexOf(listener) === - 1) {
            listeners[type].push(listener);
        }
    }

    public addListener (type : string, listener : Function) {
        this.listen(type, listener);
    }

    public hasListener (type : string, listener : Function) {
        if (this._listeners === undefined) return false;

        return this._listeners[type] !== undefined && this._listeners[type].indexOf(listener) !== - 1;
    }

    public removeListener (type : string, listener : Function) {
        if (this._listeners === undefined) return;

        var listenerArray = this._listeners[type];

        if (listenerArray !== undefined) {
            var index = listenerArray.indexOf(listener);

            if (index !== - 1) {
                listenerArray.splice(index, 1);
            }
        }
    }

    public dispatch (eventName : string, eventData : Record<string, any> = {}) {
        if (this._isEventPaused) return;

        if (this._listeners === undefined) return;

        var listeners = this._listeners[eventName];

        if (listeners !== undefined) {
            eventData.target = self;

            var listeners = listeners.slice(0);

            for (var i = 0, l = listeners.length; i < l; i ++) {
                listeners[i].call(this, eventData);
            }
        }
    }

    public pauseListener () {
        this._isEventPaused = true;
    }

    public resumeListener () {
        this._isEventPaused = false;
    }
}
