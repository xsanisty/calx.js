(function($){

	/** 
	 * [engine : the calx calculation engine, including formula definition, formula locator, formula parser, numeral formatter]
	 * @type {Object}
	 */
	var engine = {
		parser : null,
		formatter : null,
		formula : {
			math : {},
			financial : {},
			logical : {},
			geometry : {},
			text : {},
			trigonometry : {},
			general : {}
		}
	};

	/**
	 * [sheet description]
	 * @param  {[type]} $element [description]
	 * @return {[type]}          [description]
	 */
	var sheet = function($element){
		this.id = $id;
		this.el = $element;
	};

	/**
	 * [core : the calx core function]
	 * @type {Object}
	 */
	var core = {};


	$.fn.calx = function($action, $options) {
		if (core[$action]) {
			return core[$action].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof($action) == 'object' || typeof($action) == 'undefined') {
			return core.init.apply(this, arguments);
		} else {
			$.error('Method ' + method + ' does not exist on jQuery.calx');
		}
	};

})(jQuery);