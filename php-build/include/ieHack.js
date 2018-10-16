
    /************************************************
     *                Begin of IE Hack              *
     ************************************************/
    //ie support for Array.indexOf
    if (typeof Array.indexOf !== "function") {
        Array.prototype.indexOf = function(obj, start) {
            for (var i = (start || 0); i < this.length; i++) {
                if (this[i] == obj) {
                    return i;
                }
            }
            return -1;
        };
    }

    //ie support for getPrototypeOf
    if (typeof Object.getPrototypeOf !== "function") {
        if (typeof "test".__proto__ === "object") {
            Object.getPrototypeOf = function(object) {
                return object.__proto__;
            };
        } else {
            Object.getPrototypeOf = function(object) {
                // May break if the constructor has been tampered with
                return object.constructor.prototype;
            };
        }
    }
