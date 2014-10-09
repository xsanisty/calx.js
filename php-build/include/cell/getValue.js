cell.prototype.getValue = function(){
    var returnValue;

    if(this.formula){
        returnValue = this.computedValue;
    }else{
        returnValue = this.value;
    }

    if(this.format && this.format.indexOf('%') > -1){
        returnValue = (returnValue*100)+' %';
    }

    return returnValue;
}