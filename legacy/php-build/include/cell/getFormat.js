/**
 * return format definition of the current cell object
 * @return {string}     format definition or false
 */
cell.fx.getFormat = function(){
    return this.format;
};

cell.fx.getFormatter = function(){
    return this.formatter;
}

cell.fx.getUnformatter = function(){
    return this.unformatter;
}
