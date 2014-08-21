/**
 * financial formula group.
 * adapted from stoic's formula.js (http://www.stoic.com/pages/formula)
 * with modification to adapt Calx environment
 * @type {Object}
 */
financial: {
    NPV : function() {
        // Cast arguments to array
        var args = [];
        for (var i = 0; i < arguments.length; i++) {
            if(typeof(arguments[i]) == 'object'){
                for(var a in arguments[i]){
                    args = args.concat(parseFloat(arguments[i][a], 10));
                }
            }else{
                args = args.concat(parseFloat(arguments[i], 10));
            }
        }

        // Lookup rate
        var rate = args[0];

        // Initialize net present value
        var value = 0;

        // Loop on all values
        for (var j = 1; j < args.length; j++) {
            value += args[j] / Math.pow(1 + rate, j);
        }

        // Return net present value
        return value;
    }
}