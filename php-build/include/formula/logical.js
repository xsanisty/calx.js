/**
 * logical formula group.
 * adapted from stoic's formula.js (http://www.stoic.com/pages/formula)
 * with modification to adapt Calx environment
 * @type {Object}
 */
logical : {
    AND : function() {
        var result = true;
        for (var i = 0; i < arguments.length; i++) {
            if (!arguments[i]) {
                result = false;
            }
        }
        return result;
    },

    CHOOSE : function(){
        var key = arguments[0];

        return (typeof(arguments[key]) == 'undefined') ? '#NUM!' : arguments[key];
    },

    FALSE : function(){
        return false;
    },

    IF : function(test, then_value, otherwise_value) {
        if (test) {
            return (typeof then_value === 'undefined') ? true : then_value;
        } else {
            return (typeof otherwise_value === 'undefined') ? true : otherwise_value;
        }
    },

    IFERROR : function(value, value_if_error) {
        return (data.ERROR.indexOf(value) >= 0) ? value_if_error : value;
    },

    IFNA : function(value, value_if_na) {
        return (value === '#N/A') ? value_if_na : value;
    },

    NOT : function(logical) {
        return !logical;
    },

    OR : function() {
        var result = false;
        for (var i = 0; i < arguments.length; i++) {
            if (arguments[i]) {
                result = true;
            }
        }
        return result;
    },

    SWITCH : function() {
        var result;
        if (arguments.length > 0) {
            var targetValue = arguments[0];
            var argc = arguments.length - 1;
            var switchCount = Math.floor(argc / 2);
            var switchSatisfied = false;
            var defaultClause = argc % 2 === 0 ? null : arguments[arguments.length - 1];

            if (switchCount) {
                for (var index = 0; index < switchCount; index++) {
                    if (targetValue == arguments[index * 2 + 1]) {
                        result = arguments[index * 2 + 2];
                        switchSatisfied = true;
                        break;
                    }
                }
            }

            if (!switchSatisfied && defaultClause) {
                result = defaultClause;
            }
        }

        return result;
    },

    TRUE : function() {
        return true;
    },

    XOR : function() {
        var result = 0;
        for (var i = 0; i < arguments.length; i++) {
            if (arguments[i]) {
                result++;
            }
        }
        return (Math.floor(Math.abs(result)) & 1) ? true : false;
    }


}