/**
 * formatting cell value based on given format
 * @param  {[type]} value  [description]
 * @param  {[type]} format [description]
 * @return {[type]}        [description]
 */
formatter: function (value, format) {
    return value;
    if(numeral){
        return numeral(value).format(format);
    }else{
        return value;
    }
}