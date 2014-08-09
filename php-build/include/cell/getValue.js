cell.prototype.getValue = function(){
    if(this.formula){
        return this.computedValue;
    }
    return this.value;
}