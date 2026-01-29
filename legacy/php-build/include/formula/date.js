/**
 * date formula group.
 * adapted from stoic's formula.js (http://www.stoic.com/pages/formula)
 * with modification to adapt Calx environment
 * @type {Object}
 */
date: {
    DATE : function(year, month, day) {
        if(typeof (moment) == 'undefined'){
            return data.ERRKEY.momentRequired;
        }
        if(typeof(month) == 'undefined'){
            return moment(year);
        }

        return new Date(year, month - 1, day);
    },

    DATEDIFF : function (start_date, end_date, period) {
        if(typeof (moment) == 'undefined'){
            return data.ERRKEY.momentRequired;
        }

        return moment(end_date).diff(moment.utc(start_date), period);
    },

    DATEFORMAT : function(date, format){
        if(typeof (moment) == 'undefined'){
            return data.ERRKEY.momentRequired;
        }

        return moment(date).format(format);
    },

    DATEVALUE : function(date_text) {
        if(typeof (moment) == 'undefined'){
            return data.ERRKEY.momentRequired;
        }

        return Math.ceil((moment(date_text) - moment('1900-1-1')) / 86400000) + 2;
    },

    DAY : function(date) {
        if(typeof (moment) == 'undefined'){
            return data.ERRKEY.momentRequired;
        }

        return moment(new Date(date)).date();
    },

    DAYNAME : function(date){
        return data.DAY_NAME[formula.date.WEEKDAY(date)-1];
    },

    DAYS : function(end_date, start_date) {
        if(typeof (moment) == 'undefined'){
            return data.ERRKEY.momentRequired;
        }

        return moment(new Date(end_date)).diff(moment(new Date(start_date)), 'days');
    },

    DAYS360 : function(start_date, end_date, method) {
        if(typeof (moment) == 'undefined'){
            return data.ERRKEY.momentRequired;
        }

        var start = moment(new Date(start_date));
        var end = moment(new Date(end_date));
        var smd = 31;
        var emd = 31;
        var sd = start.date();
        var ed = end.date();
        if (method) {
            sd = (sd === 31) ? 30 : sd;
            ed = (ed === 31) ? 30 : ed;
        } else {
            if (start.month() === 1) {
                smd = start.daysInMonth();
            }
            if (end.month() === 1) {
                emd = end.daysInMonth();
            }
            sd = (sd === smd) ? 30 : sd;
            if (sd === 30 || sd === smd) {
                ed = (ed === emd) ? 30 : ed;
            }
        }
        return 360 * (end.year() - start.year()) + 30 * (end.month() - start.month()) + (ed - sd);
    },

    EDATE : function(start_date, months) {
        if(typeof (moment) == 'undefined'){
            return data.ERRKEY.momentRequired;
        }

        return moment(new Date(start_date)).add('months', months).toDate();
    },

    EOMONTH : function(start_date, months) {
        if(typeof (moment) == 'undefined'){
            return data.ERRKEY.momentRequired;
        }

        var edate = moment(new Date(start_date)).add('months', months);
        return new Date(edate.year(), edate.month(), edate.daysInMonth());
    },

    FROMNOW : function(timestamp, nosuffix) {
        if(typeof (moment) == 'undefined'){
            return data.ERRKEY.momentRequired;
        }

        return moment(new Date(timestamp)).fromNow(nosuffix);
    },

    HOUR : function(timestamp) {
        if(typeof (moment) == 'undefined'){
            return data.ERRKEY.momentRequired;
        }

        return (timestamp <= 1) ? Math.floor(24 * timestamp) : moment(new Date(timestamp)).hours();
    },

    MINUTE : function(timestamp) {
        if(typeof (moment) == 'undefined'){
            return data.ERRKEY.momentRequired;
        }

        return (timestamp <= 1) ? Math.floor(24 * 60 * timestamp) - 60 * Math.floor(24 * timestamp) : moment(new Date(timestamp)).minutes();
    },

    ISOWEEKNUM : function(date) {
        if(typeof (moment) == 'undefined'){
            return data.ERRKEY.momentRequired;
        }

        return moment(new Date(date)).format('w');
    },

    MONTH : function(timestamp) {
        if(typeof (moment) == 'undefined'){
            return data.ERRKEY.momentRequired;
        }

        return moment(new Date(timestamp)).month() + 1;
    },

    NETWORKDAYS : function(start_date, end_date, holidays) {
        return formula.date.NETWORKDAYSINTL(start_date, end_date, 1, holidays);
    },

    NETWORKDAYSINTL : function(start_date, end_date, weekend, holidays) {
        if(typeof (moment) == 'undefined'){
            return data.ERRKEY.momentRequired;
        }

        var weekend_type = (typeof weekend === 'undefined') ? 1 : weekend;
        var weekend_days = data.WEEKEND_TYPES[weekend_type];
        var sd = moment(start_date);
        var ed = moment(end_date);
        var net_days = ed.diff(sd, 'days') + 1;
        var net_work_days = net_days;
        var day_of_week = '';
        var cd = sd;
        var holiday_dates = [];
        if (typeof holidays !== 'undefined') {
            for (var i = 0; i < holidays.length; i++) {
                holiday_dates[i] = moment(new Date(holidays[i])).format('MM-DD-YYYY');
            }
        }
        var j = 0;
        while (j < net_days) {
            day_of_week = cd.format('d');
            if (weekend_days.indexOf(parseInt(day_of_week, 10)) >= 0) {
                net_work_days--;
            } else if (holiday_dates.indexOf(cd.format('MM-DD-YYYY')) >= 0) {
                net_work_days--;
            }
            cd = cd.add('days', 1);
            j++;
        }
        return net_work_days;
    },

    NOW : function() {
        return new Date();
    },

    SECOND : function(timestamp) {
        if(typeof (moment) == 'undefined'){
            return data.ERRKEY.momentRequired;
        }

        return moment(new Date(timestamp)).seconds();
    },

    TIME : function(hour, minute, second) {
        return (3600 * hour + 60 * minute + second) / 86400;
    },

    TIMEVALUE : function(time_text) {
        if(typeof (moment) == 'undefined'){
            return data.ERRKEY.momentRequired;
        }

        var timestamp = moment(new Date(time_text));
        return (3600 * timestamp.hours() + 60 * timestamp.minutes() + timestamp.seconds()) / 86400;
    },

    TODAY : function() {
        return new Date();
    },

    WEEKDAY : function(date, type) {
        if(typeof (moment) == 'undefined'){
            return data.ERRKEY.momentRequired;
        }

        var week_day = moment(new Date(date)).format('d');
        var week_type = (typeof type === 'undefined') ? 1 : type;
        return data.WEEK_TYPES[week_type][week_day];
    },

    WEEKNUM : function(date, type) {
        if(typeof (moment) == 'undefined'){
            return data.ERRKEY.momentRequired;
        }

        var current_date = moment(new Date(date));
        var january_first = moment(new Date(current_date.year(), 0, 1));
        var week_type = (typeof type === 'undefined') ? 1 : type;
        var week_start = data.WEEK_STARTS[week_type];
        var first_day = january_first.format('d');
        var offset = (first_day < week_start) ? week_start - first_day + 1 : first_day - week_start;
        if (week_type === 21) {
            return formula.date.ISOWEEKNUM(date);
        } else {
            return Math.floor(current_date.diff(january_first.subtract('days', offset), 'days') / 7) + 1;
        }
    },

    WORKDAY : function(start_date, days, holidays) {
        return formula.date.WORKDAYINTL(start_date, days, 1, holidays);
    },

    WORKDAYINTL : function(start_date, days, weekend, holidays) {
        if(typeof (moment) == 'undefined'){
            return data.ERRKEY.momentRequired;
        }

        var weekend_type = (typeof weekend === 'undefined') ? 1 : weekend;
        var weekend_days = data.WEEKEND_TYPES[weekend_type];
        var sd = moment(new Date(start_date));
        var cd = sd;
        var day_of_week = '';
        var holiday_dates = [];
        if (typeof holidays !== 'undefined') {
            for (var i = 0; i < holidays.length; i++) {
                holiday_dates[i] = moment(new Date(holidays[i])).format('MM-DD-YYYY');
            }
        }
        var j = 0;
        while (j < days) {
            cd = cd.add('days', 1);
            day_of_week = cd.format('d');
            if (weekend_days.indexOf(parseInt(day_of_week, 10)) < 0 && holiday_dates.indexOf(cd.format('MM-DD-YYYY')) < 0) {
                j++;
            }
        }
        return cd.toDate();
    },

    YEAR : function(date) {
        if(typeof (moment) == 'undefined'){
            return data.ERRKEY.momentRequired;
        }

        return moment(new Date(date)).year();
    },

    YEARFRAC : function(start_date, end_date, basis) {
        if(typeof (moment) == 'undefined'){
            return data.ERRKEY.momentRequired;
        }

        // Credits: David A. Wheeler [http://www.dwheeler.com/]

        // Initialize parameters
        basis = (typeof basis === 'undefined') ? 0 : basis;
        var sdate = moment(new Date(start_date));
        var edate = moment(new Date(end_date));

        // Return error if either date is invalid
        if (!sdate.isValid() || !edate.isValid()) {
            return '#VALUE!';
        }

        // Return error if basis is neither 0, 1, 2, 3, or 4
        if ([0, 1, 2, 3, 4].indexOf(basis) === -1) {
            return '#NUM!';
        }

        // Return zero if start_date and end_date are the same
        if (sdate === edate) {
            return 0;
        }

        // Swap dates if start_date is later than end_date
        if (sdate.diff(edate) > 0) {
            edate = moment(new Date(start_date));
            sdate = moment(new Date(end_date));
        }

        // Lookup years, months, and days
        var syear = sdate.year();
        var smonth = sdate.month();
        var sday = sdate.date();
        var eyear = edate.year();
        var emonth = edate.month();
        var eday = edate.date();

        switch (basis) {
            case 0:
                // US (NASD) 30/360
                // Note: if eday == 31, it stays 31 if sday < 30
                if (sday === 31 && eday === 31) {
                    sday = 30;
                    eday = 30;
                } else if (sday === 31) {
                    sday = 30;
                } else if (sday === 30 && eday === 31) {
                    eday = 30;
                } else if (smonth === 1 && emonth === 1 && sdate.daysInMonth() === sday && edate.daysInMonth() === eday) {
                    sday = 30;
                    eday = 30;
                } else if (smonth === 1 && sdate.daysInMonth() === sday) {
                    sday = 30;
                }
                return ((eday + emonth * 30 + eyear * 360) - (sday + smonth * 30 + syear * 360)) / 360;

            case 1:
                // Actual/actual
                var feb29Between = function(date1, date2) {
                    // Requires year2 == (year1 + 1) or year2 == year1
                    // Returns TRUE if February 29 is between the two dates (date1 may be February 29), with two possibilities:
                    // year1 is a leap year and date1 <= Februay 29 of year1
                    // year2 is a leap year and date2 > Februay 29 of year2

                    var mar1year1 = moment(new Date(date1.year(), 2, 1));
                    if (moment([date1.year()]).isLeapYear() && date1.diff(mar1year1) < 0 && date2.diff(mar1year1) >= 0) {
                        return true;
                    }
                    var mar1year2 = moment(new Date(date2.year(), 2, 1));
                    if (moment([date2.year()]).isLeapYear() && date2.diff(mar1year2) >= 0 && date1.diff(mar1year2) < 0) {
                        return true;
                    }
                    return false;
                };
                var ylength = 365;
                if (syear === eyear || ((syear + 1) === eyear) && ((smonth > emonth) || ((smonth === emonth) && (sday >= eday)))) {
                    if (syear === eyear && moment([syear]).isLeapYear()) {
                        ylength = 366;
                    } else if (feb29Between(sdate, edate) || (emonth === 1 && eday === 29)) {
                        ylength = 366;
                    }
                    return edate.diff(sdate, 'days') / ylength;
                } else {
                    var years = (eyear - syear) + 1;
                    var days = moment(new Date(eyear + 1, 0, 1)).diff(moment(new Date(syear, 0, 1)), 'days');
                    var average = days / years;
                    return edate.diff(sdate, 'days') / average;
                }
                break;

            case 2:
                // Actual/360
                return edate.diff(sdate, 'days') / 360;

            case 3:
                // Actual/365
                return edate.diff(sdate, 'days') / 365;

            case 4:
                // European 30/360
                if (sday === 31) {
                    sday = 30;
                }

                if (eday === 31) {
                    eday = 30;
                }
                // Remarkably, do NOT change February 28 or February 29 at ALL
                return ((eday + emonth * 30 + eyear * 360) - (sday + smonth * 30 + syear * 360)) / 360;
        }
    }
}