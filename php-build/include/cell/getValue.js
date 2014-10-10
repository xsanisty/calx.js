cell.prototype.getValue = function(){
    var returnValue;

    if(this.formula){
        returnValue = this.computedValue;
    }else{
        returnValue = this.value;
    }

    return returnValue;
}