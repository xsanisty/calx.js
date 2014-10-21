sheet.fx.time = function(time){
    var $time   = time.split(':'),
        $today  = new Date(),
        $hour   = typeof($time[0]) == 'undefined' ? 0 : $time[0],
        $minute = typeof($time[1]) == 'undefined' ? 0 : $time[1],
        $second = typeof($time[2]) == 'undefined' ? 0 : $time[2],
        $result = new Date($today.getFullYear(), $today.getMonth(), $today.getDate(), $hour, $minute, $second);

    return $result;
};