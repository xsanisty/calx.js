    /**
     * the surrogate of the calx world to the jQuery world
     * @param  string $action  [calx method]
     * @param  object $options [option object]
     * @return jQuery
     */
    $.fn.calx = function($action, $options) {
        if (calx[$action]) {
            return calx[$action].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof($action) == 'object' || typeof($action) == 'undefined') {
            var $calx = calx.init.apply(this, arguments);
            return $calx;
        } else {
            $.error('Method ' + $action + ' does not exist on jQuery.calx');
        }
    };
