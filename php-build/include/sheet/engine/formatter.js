formatter: function (value, format) {
    if(numeral){
        return numeral(value).format(format);
    }else{
        return value;
    }
}