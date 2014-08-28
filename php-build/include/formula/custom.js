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
    }
}