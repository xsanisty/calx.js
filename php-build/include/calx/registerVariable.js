/**
 * register custom variable to the calx object / sheet object
 * @param  {string} varName     variable name
 * @param  {mixed}  varValue    variable value
 * @param  {bool}   global      register variable as global or only in current sheet
 */
registerVariable : function (varName, varValue, global) {
    global = typeof(global) == 'undefined' ? false : global;

    if(this.length === 0){
        global = true;
    }

    if(global){
        if(typeof(varName) == 'object'){
            for(var a in varName){
                data.VARIABLE[a] = varName[a];
            }
        }else{
            data.VARIABLE[varName] = varValue;
        }
    }else{
        this.each(function(){
            var sheetIdentifier = $(this).attr('data-calx-identifier');

            if(sheetIdentifier && typeof(calx.sheetRegistry[sheetIdentifier]) != 'undefined'){
                calx.sheetRegistry[sheetIdentifier].registerVariable(varName, varValue);
                calx.sheetRegistry[sheetIdentifier].calculate();
            }
        });
    }

    return this;
}