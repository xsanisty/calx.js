var engine = {};

engine.formula = {

};

engine.comparator = {
    less : function($a, $b){
        console.log(arguments);
        return $a < $b;
    }
};

engine.handler = {
	cell : function($cell){
		console.log('cell_handler: '+ $cell);
		return $cell;
	},

	cell_range: function($start, $stop){
		console.log('cell_range_handler : ' + $start+' , '+$stop);

		return [$start, $stop];
	},

	cell_range_remote : function(){
		console.log('remote_cell_range_handler');
		console.log(arguments);
		return arguments;
	},

	cell_remote : function(){
		console.log('remote_cell_handler');
		console.log(arguments);
		return arguments;
	},

	func : function($function, $param){
		console.log('calling function '+$function+' with arguments V');
		console.log(arguments);
		return $function+' result';
	},

	time : function(){
		console.log('time_handler');
		console.log(arguments);
	},

	object : function(){
		console.log('get object instead of cell');
		return arguments[0];
	}
};

engine.obj = {
	type : 'cell'
};