sheet.prototype.getCellValue = function(address){
    var cell = address.toUpperCase();
    if(typeof(this.cells[cell]) == 'undefined'){
        return false;
    }
    return this.cells[cell].getValue();
};

sheet.prototype.getCellRangeValue = function(addressStart, addressStop){
    var cellRangeAddress= utility.cellRange(addressStart, addressStop),
        cellRangeLength = cellRangeAddress.length,
        cellRangeValue  = {},
        i;

    for (i = 0; i < cellRangeLength; i++) {
        cellRangeValue[cellRangeAddress[i]] = this.getCellValue(cellRangeAddress[i]);
    }

    return cellRangeValue;
};

sheet.prototype.getRemoteCellRangeValue = function(sheet, addressStart, addressStop){

    var identifier = $(sheet).attr('data-calx-identifier');

    if(!identifier || typeof(calx.sheetRegistry[identifier]) == 'undefined'){
        return false;
    }

    return calx.sheetRegistry[identifier].getCellRangeValue(addressStart, addressStop);
};

sheet.prototype.getRemoteCellValue = function(sheet, address){
    var identifier = $(sheet).attr('data-calx-identifier');

    if(!identifier || typeof(calx.sheetRegistry[identifier]) == 'undefined'){
        return false;
    }

    return calx.sheetRegistry[identifier].getCellValue(address);
};

sheet.prototype.getRemoteCellRange = function(sheet, addressStart, addressStop){

    var identifier = $(sheet).attr('data-calx-identifier');

    if(!identifier || typeof(calx.sheetRegistry[identifier]) == 'undefined'){
        return false;
    }

    return calx.sheetRegistry[identifier].getCellRange(addressStart, addressStop);
};

sheet.prototype.getRemoteCell = function(sheet, address){
    var identifier = $(sheet).attr('data-calx-identifier');

    if(!identifier || typeof(calx.sheetRegistry[identifier]) == 'undefined'){
        return false;
    }

    return calx.sheetRegistry[identifier].getCell(address);
};

sheet.prototype.callFunction = function(functionName, params){
    var category, func;

    func = functionName.toUpperCase();
    if(typeof(formula[func]) == 'function'){
        return formula[func].apply(this, params);
    }

    for(category in formula){
        if(typeof(formula[category][func]) == 'function' ){
            return formula[category][func].apply(this, params);
        }
    }

    return '#NAME?'
};

sheet.prototype.time = function(time){
    var $time   = time.split(':'),
        $today  = new Date(),
        $hour   = typeof($time[0]) == 'undefined' ? 0 : $time[0],
        $minute = typeof($time[1]) == 'undefined' ? 0 : $time[1],
        $second = typeof($time[2]) == 'undefined' ? 0 : $time[2],
        $result = new Date($today.getFullYear(), $today.getMonth(), $today.getDate(), $hour, $minute, $second);

    return $result;
};

sheet.prototype.getVariable = function(varName){
    var varIndex = varName[0];

    if(typeof(data.VARIABLE[varIndex]) == 'undefined'){
        return '#NAME?';
    }else{
        return data.VARIABLE[varIndex];
    }
};

sheet.prototype.comparator = {
    greater: function(a, b){
        return a > b;
    },

    greaterEqual: function(a, b){
        return a >= b;
    },

    less: function(a, b){
        return a < b;
    },

    lessEqual : function(a, b){
        console.log('lessEqual executed', a, b);
        return a <= b;
    },

    equal: function(a,b){
        return a == b;
    },

    notEqual: function(a,b){
        return a!= b;
    }
}

sheet.prototype.obj = {
    type : 'cell'
};