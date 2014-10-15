custom : {
    SERVER : function(){
        if(this.config.ajaxUrl == null){
            return '#NAME?';
        }


        var result,
            funcName = arguments[0],
            params = {};

        for (var a = 1; a < arguments.length; a++){
            params['params['+a+']'] = arguments[a];
        }

        $.ajax({
            url: this.config.ajaxUrl,
            method: this.config.ajaxMethod,
            data: params,
            async: false,
            success: function(response){
                result = response;
            },
            error: function(response){
                result = '#NAME?';
            }
        });

        return result;
    },

    GRAPH : function(range, orientation, type){

        var cellElement = this.getActiveCell().el;

        $(cellElement).html('We are drawing graph here');

        console.log(arguments);
        return false;

    }
}