statistic: {
    AVEDEV : function() {
        if(typeof(jStat) == 'undefined'){
            return data.ERRKEY.jStatRequired;
        }
        var range = utility.arrayMerge(arguments);
        return jStat.sum(jStat(range).subtract(jStat.mean(range)).abs()[0]) / range.length;
    },

    AVERAGE : function() {
        var range = utility.arrayMerge(arguments);
        var n = range.length;
        var count = 0;
        var sigma = 0;
        var floatVal = 0;
        for (var i = 0; i < n; i++) {
            if (range[i] !== true && range[i] !== false) {
                floatVal = parseFloat(range[i]);
                sigma += isNaN(floatVal) ? 0 : floatVal;
                count++;
            }
        }
        return sigma / count;
    },

    AVERAGEA : function() {
        if(typeof(jStat) == 'undefined'){
            return data.ERRKEY.jStatRequired;
        }
        return jStat.mean(utility.arrayMerge(arguments));
    },

    AVERAGEIF : function(range, criteria, average_range) {
        average_range = (typeof average_range === 'undefined') ? range : average_range;
        var average_count = 0;
        var result = 0;
        for (var i = 0; i < range.length; i++) {
            if (eval(range[i] + criteria)) {
                result += average_range[i];
                average_count++;
            }
        }
        return result / average_count;
    },

    AVERAGEIFS : function() {
        var criteria = (arguments.length - 1) / 2;
        var range = arguments[0];
        var count = 0;
        var result = 0;
        for (var i = 0; i < range.length; i++) {
            var fit = true;
            for (var j = 0; j < criteria; j++) {
                if (!eval(arguments[2 * j + 1][i] + arguments[2 * j + 2])) {
                    fit = false;
                }
            }
            if (fit) {
                result += range[i];
                count++;
            }
        }
        return result / count;
    },

    BETADIST : function(x, alpha, beta, cumulative, A, B) {
        if(typeof(jStat) == 'undefined'){
            return data.ERRKEY.jStatRequired;
        }
        A = (typeof A === 'undefined') ? 0 : A;
        B = (typeof B === 'undefined') ? 1 : B;
        x = (x - A) / (B - A);
        return (cumulative) ? jStat.beta.cdf(x, alpha, beta) : jStat.beta.pdf(x, alpha, beta);
    },

    BETAINV : function(probability, alpha, beta, A, B) {
        if(typeof(jStat) == 'undefined'){
            return data.ERRKEY.jStatRequired;
        }
        A = (typeof A === 'undefined') ? 0 : A;
        B = (typeof B === 'undefined') ? 1 : B;
        return jStat.beta.inv(probability, alpha, beta) * (B - A) + A;
    },

    BINOMDIST : function(successes, trials, probability, cumulative) {
        if(typeof(jStat) == 'undefined'){
            return data.ERRKEY.jStatRequired;
        }
        return (cumulative) ? jStat.binomial.cdf(successes, trials, probability) : jStat.binomial.pdf(successes, trials, probability);
    },

    BINOMDISTRANGE : function(trials, probability, successes, successes2) {
        successes2 = (typeof successes2 === 'undefined') ? successes : successes2;
        var result = 0;
        for (var i = successes; i <= successes2; i++) {
            result += formula.math.COMBIN(trials, i) * Math.pow(probability, i) * Math.pow(1 - probability, trials - i);
        }
        return result;
    },

    BINOMINV : function(trials, probability, alpha) {
        if(typeof(jStat) == 'undefined'){
            return data.ERRKEY.jStatRequired;
        }
        var x = 0;
        while (x <= trials) {
            if (jStat.binomial.cdf(x, trials, probability) >= alpha) {
                return x;
            }
            x++;
        }
    },

    CHISQDIST : function(x, k, cumulative) {
        if(typeof(jStat) == 'undefined'){
            return data.ERRKEY.jStatRequired;
        }
        return (cumulative) ? jStat.chisquare.cdf(x, k) : jStat.chisquare.pdf(x, k);
    },

    CHISQDISTRT : function(x, k) {
        return;
    },

    CHISQINV : function(probability, k) {
        if(typeof(jStat) == 'undefined'){
            return data.ERRKEY.jStatRequired;
        }
        return jStat.chisquare.inv(probability, k);
    },

    CHISQINVRT : function() {
        return;
    },

    CHISQTEST : function() {
        return;
    },

    CONFIDENCENORM : function(alpha, sd, n) {
        if(typeof(jStat) == 'undefined'){
            return data.ERRKEY.jStatRequired;
        }
        return jStat.normalci(1, alpha, sd, n)[1] - 1;
    },

    CONFIDENCET : function(alpha, sd, n) {
        if(typeof(jStat) == 'undefined'){
            return data.ERRKEY.jStatRequired;
        }
        return jStat.tci(1, alpha, sd, n)[1] - 1;
    },

    CORREL : function() {
        if(typeof(jStat) == 'undefined'){
            return data.ERRKEY.jStatRequired;
        }
        return jStat.corrcoeff.apply(this, arguments);
    },

    COUNT : function() {
        return utility.arrayMerge(arguments).length;
    },

    COUNTA : function() {
        var range = utility.arrayMerge(arguments);
        return range.length - formula.statistic.COUNTBLANK(range);
    },

    COUNTBLANK : function() {
        var range = utility.arrayMerge(arguments);
        var blanks = 0;
        for (var i = 0; i < range.length; i++) {
            if (range[i] === null || range[i] === '') {
                blanks++;
            }
        }
        return blanks;
    },

    COUNTIF : function(range, criteria) {
        var matches = 0;
        for (var i = 0; i < range.length; i++) {
            if (range[i].match(new RegExp(criteria))) {
                matches++;
            }
        }
        return matches;
    },

    COUNTIFS : function() {
        var criteria = (arguments.length - 1) / 2;
        var range = arguments[0];
        var result = 0;
        for (var i = 0; i < range.length; i++) {
            var fit = true;
            for (var j = 0; j < criteria; j++) {
                if (!eval(arguments[2 * j + 1][i] + arguments[2 * j + 2])) {
                    fit = false;
                }
            }
            result += (fit) ? 1 : 0;
        }
        return result;
    },

    COUNTUNIQUE : function () {
        return utility.unique(utility.arrayMerge(arguments)).length;
    },

    COVARIANCEP : function(array1, array2) {
        if(typeof(jStat) == 'undefined'){
            return data.ERRKEY.jStatRequired;
        }
        var mean1 = jStat.mean(array1);
        var mean2 = jStat.mean(array2);
        var result = 0;
        var n = array1.length;
        for (var i = 0; i < n; i++) {
            result += (array1[i] - mean1) * (array2[i] - mean2);
        }
        return result / n;
    },

    COVARIANCES : function() {
        if(typeof(jStat) == 'undefined'){
            return data.ERRKEY.jStatRequired;
        }
        return jStat.covariance.apply(this, arguments);
    },

    DEVSQ : function() {
        if(typeof(jStat) == 'undefined'){
            return data.ERRKEY.jStatRequired;
        }
        var range = utility.arrayMerge(arguments);
        var mean = jStat.mean(range);
        var result = 0;
        for (var i = 0; i < range.length; i++) {
            result += Math.pow((range[i] - mean), 2);
        }
        return result;
    },

    EXPONDIST : function(x, lambda, cumulative) {
        if(typeof(jStat) == 'undefined'){
            return data.ERRKEY.jStatRequired;
        }
        return (cumulative) ? jStat.exponential.cdf(x, lambda) : jStat.exponential.pdf(x, lambda);
    },

    FDIST : function(x, d1, d2, cumulative) {
        if(typeof(jStat) == 'undefined'){
            return data.ERRKEY.jStatRequired;
        }
        return (cumulative) ? jStat.centralF.cdf(x, d1, d2) : jStat.centralF.pdf(x, d1, d2);
    },

    FDISTRT : function() {
        return;
    },

    FINV : function(probability, d1, d2) {
        if(typeof(jStat) == 'undefined'){
            return data.ERRKEY.jStatRequired;
        }
        return jStat.centralF.inv(probability, d1, d2);
    },

    FINVRT : function() {
        return;
    },

    FTEST : function() {
        return;
    },

    FISHER : function(x) {
        return Math.log((1 + x) / (1 - x)) / 2;
    },

    FISHERINV : function(y) {
        var e2y = Math.exp(2 * y);
        return (e2y - 1) / (e2y + 1);
    },

    FORECAST : function(x, data_y, data_x) {
        if(typeof(jStat) == 'undefined'){
            return data.ERRKEY.jStatRequired;
        }
        var xmean = jStat.mean(data_x);
        var ymean = jStat.mean(data_y);
        var n = data_x.length;
        var num = 0;
        var den = 0;
        for (var i = 0; i < n; i++) {
            num += (data_x[i] - xmean) * (data_y[i] - ymean);
            den += Math.pow(data_x[i] - xmean, 2);
        }
        var b = num / den;
        var a = ymean - b * xmean;
        return a + b * x;
    },

    FREQUENCY : function(data, bins) {
        var n = data.length;
        var b = bins.length;
        var r = [];
        for (var i = 0; i <= b; i++) {
            r[i] = 0;
            for (var j = 0; j < n; j++) {
                if (i === 0) {
                    if (data[j] <= bins[0]) {
                        r[0] += 1;
                    }
                } else if (i < b) {
                    if (data[j] > bins[i - 1] && data[j] <= bins[i]) {
                        r[i] += 1;
                    }
                } else if (i === b) {
                    if (data[j] > bins[b - 1]) {
                        r[b] += 1;
                    }
                }
            }
        }
        return r;
    },

    GAMMA : function() {
        if(typeof(jStat) == 'undefined'){
            return data.ERRKEY.jStatRequired;
        }
        return jStat.gammafn.apply(this, arguments);
    },

    GAMMADIST : function(x, alpha, beta, cumulative) {
        /*
           var shape = alpha;
           var scale = 1 / beta;
           return (cumulative) ? jStat.gamma.cdf(x, shape, scale) : jStat.gamma.pdf(x, shape, scale);
           */
        return;
    },

    GAMMAINV : function(probability, alpha, beta) {
        /*
           var shape = alpha;
           var scale = 1 / beta;
           return jStat.gamma.inv(probability, shape, scale);
           */
        return;
    },

    GAMMALN : function() {
        if(typeof(jStat) == 'undefined'){
            return data.ERRKEY.jStatRequired;
        }
        return jStat.gammaln.apply(this, arguments);
    },

    GAMMALNPRECISE : function() {
        return;
    },

    GAUSS : function(z) {
        if(typeof(jStat) == 'undefined'){
            return data.ERRKEY.jStatRequired;
        }
        return jStat.normal.cdf(z, 0, 1) - 0.5;
    },

    GEOMEAN : function() {
        if(typeof(jStat) == 'undefined'){
            return data.ERRKEY.jStatRequired;
        }
        return jStat.geomean(utility.arrayMerge(arguments));
    },

    GROWTH : function(known_y, known_x, new_x, use_const) {
        // Credits: Ilmari Karonen

        // Default values for optional parameters:
        var i;
        if (typeof(known_x) === 'undefined') {
            known_x = [];
            for (i = 1; i <= known_y.length; i++) {
                known_x.push(i);
            }
        }
        if (typeof(new_x) === 'undefined') {
            new_x = [];
            for (i = 1; i <= known_y.length; i++) {
                new_x.push(i);
            }
        }
        if (typeof(use_const) === 'undefined') {
            use_const = true;
        }

        // Calculate sums over the data:
        var n = known_y.length;
        var avg_x = 0;
        var avg_y = 0;
        var avg_xy = 0;
        var avg_xx = 0;
        for (i = 0; i < n; i++) {
            var x = known_x[i];
            var y = Math.log(known_y[i]);
            avg_x += x;
            avg_y += y;
            avg_xy += x * y;
            avg_xx += x * x;
        }
        avg_x /= n;
        avg_y /= n;
        avg_xy /= n;
        avg_xx /= n;

        // Compute linear regression coefficients:
        var beta;
        var alpha;
        if (use_const) {
            beta = (avg_xy - avg_x * avg_y) / (avg_xx - avg_x * avg_x);
            alpha = avg_y - beta * avg_x;
        } else {
            beta = avg_xy / avg_xx;
            alpha = 0;
        }

        // Compute and return result array:
        var new_y = [];
        for (i = 0; i < new_x.length; i++) {
            new_y.push(Math.exp(alpha + beta * new_x[i]));
        }
        return new_y;
    },

    HARMEAN : function() {
        var range = utility.arrayMerge(arguments);
        var n = range.length;
        var den = 0;
        for (var i = 0; i < n; i++) {
            den += 1 / range[i];
        }
        return n / den;
    },

    HYPGEOMDIST : function(x, n, M, N, cumulative) {
        function pdf(x, n, M, N) {
            return formula.math.COMBIN(M, x) * formula.math.COMBIN(N - M, n - x) / formula.math.COMBIN(N, n);
        }

        function cdf(x, n, M, N) {
            var result = 0;
            for (var i = 0; i <= x; i++) {
                result += pdf(i, n, M, N);
            }
            return result;
        }

        return (cumulative) ? cdf(x, n, M, N) : pdf(x, n, M, N);
    },

    INTERCEPT : function(data_y, data_x) {
        return formula.statistic.FORECAST(0, data_y, data_x);
    },

    KURT : function() {
        if(typeof(jStat) == 'undefined'){
            return data.ERRKEY.jStatRequired;
        }
        var range = utility.arrayMerge(arguments);
        var mean = jStat.mean(range);
        var n = range.length;
        var sigma = 0;
        for (var i = 0; i < n; i++) {
            sigma += Math.pow(range[i] - mean, 4);
        }
        sigma = sigma / Math.pow(jStat.stdev(range, true), 4);
        return ((n * (n + 1)) / ((n - 1) * (n - 2) * (n - 3))) * sigma - 3 * (n - 1) * (n - 1) / ((n - 2) * (n - 3));
    },

    LARGE : function(array, k) {
        array = utility.objectToArray(array);
        return array.sort(function(a, b) {
            return b - a;
        })[k - 1];
    },

    LINEST : function(data_y, data_x) {
        if(typeof(jStat) == 'undefined'){
            return data.ERRKEY.jStatRequired;
        }
        var xmean = jStat.mean(data_x);
        var ymean = jStat.mean(data_y);
        var n = data_x.length;
        var num = 0;
        var den = 0;
        for (var i = 0; i < n; i++) {
            num += (data_x[i] - xmean) * (data_y[i] - ymean);
            den += Math.pow(data_x[i] - xmean, 2);
        }
        var m = num / den;
        var b = ymean - m * xmean;
        return [m, b];
    },

    LOGEST : function() {
        return;
    },

    LOGNORMDIST : function(x, mean, sd, cumulative) {
        if(typeof(jStat) == 'undefined'){
            return data.ERRKEY.jStatRequired;
        }

        return (cumulative) ? jStat.lognormal.cdf(x, mean, sd) : jStat.lognormal.pdf(x, mean, sd);
    },

    LOGNORMINV : function(probability, mean, sd) {
        if(typeof(jStat) == 'undefined'){
            return data.ERRKEY.jStatRequired;
        }
        return jStat.lognormal.inv(probability, mean, sd);
    },

    MAX : function() {
        var range = utility.arrayMerge(arguments);
        var n = range.length;
        var max = (n > 0) ? range[0] : 0;
        for (var i = 0; i < n; i++) {
            max = (range[i] > max && (range[i] !== true) && (range[i] !== false)) ? range[i] : max;
        }
        return max;
    },

    MAXA : function() {
        var range = utility.arrayMerge(arguments);
        return (range.length > 0) ? Math.max.apply(Math, range) : 0;
    },

    MEDIAN : function() {
        if(typeof(jStat) == 'undefined'){
            return data.ERRKEY.jStatRequired;
        }
        return jStat.median(utility.arrayMerge(arguments));
    },

    MIN : function() {
        var range = utility.arrayMerge(arguments);
        var n = range.length;
        var min = (n > 0) ? range[0] : 0;
        for (var i = 0; i < n; i++) {
            min = (range[i] < min && (range[i] !== true) && (range[i] !== false)) ? range[i] : min;
        }
        return min;
    },

    MINA : function() {
        var range = utility.arrayMerge(arguments);
        return (range.length > 0) ? Math.min.apply(Math, range) : 0;
    },

    MODEMULT : function() {
        // Credits: Roönaän
        var range = utility.arrayMerge(arguments),
            n = range.length,
            count = {},
            maxItems = [],
            max = 0,
            currentItem;
        for (var i = 0; i < n; i++) {
            currentItem = range[i];
            count[currentItem] = count[currentItem] ? count[currentItem] + 1 : 1;
            if (count[currentItem] > max) {
                max = count[currentItem];
                maxItems = [];
            }
            if (count[currentItem] === max) {
                maxItems[maxItems.length] = currentItem;
            }
        }
        return maxItems;
    },

    MODESNGL : function() {
        return formula.statistic.MODEMULT(utility.arrayMerge(arguments)).sort(function(a, b) {
            return a - b;
        })[0];
    },

    NEGBINOMDIST : function(k, r, p, cumulative) {
        if(typeof(jStat) == 'undefined'){
            return data.ERRKEY.jStatRequired;
        }
        return (cumulative) ? jStat.negbin.cdf(k, r, p) : jStat.negbin.pdf(k, r, p);
    },

    NORMDIST : function(x, mean, sd, cumulative) {
        if(typeof(jStat) == 'undefined'){
            return data.ERRKEY.jStatRequired;
        }
        // Check parameters
        if (isNaN(x) || isNaN(mean) || isNaN(sd)) {
            return '#VALUE!';
        }
        if (sd <= 0) {
            return '#NUM!';
        }

        // Return normal distribution computed by jStat [http://jstat.org]
        return (cumulative) ? jStat.normal.cdf(x, mean, sd) : jStat.normal.pdf(x, mean, sd);
    },

    NORMINV : function(probability, mean, sd) {
        if(typeof(jStat) == 'undefined'){
            return data.ERRKEY.jStatRequired;
        }
        return jStat.normal.inv(probability, mean, sd);
    },

    NORMSDIST : function(z, cumulative) {
        if(typeof(jStat) == 'undefined'){
            return data.ERRKEY.jStatRequired;
        }
        return (cumulative) ? jStat.normal.cdf(z, 0, 1) : jStat.normal.pdf(z, 0, 1);
    },

    NORMSINV : function(probability) {
        if(typeof(jStat) == 'undefined'){
            return data.ERRKEY.jStatRequired;
        }
        return jStat.normal.inv(probability, 0, 1);
    },

    PEARSON : function(data_x, data_y) {
        if(typeof(jStat) == 'undefined'){
            return data.ERRKEY.jStatRequired;
        }
        var xmean = jStat.mean(data_x);
        var ymean = jStat.mean(data_y);
        var n = data_x.length;
        var num = 0;
        var den1 = 0;
        var den2 = 0;
        for (var i = 0; i < n; i++) {
            num += (data_x[i] - xmean) * (data_y[i] - ymean);
            den1 += Math.pow(data_x[i] - xmean, 2);
            den2 += Math.pow(data_y[i] - ymean, 2);
        }
        return num / Math.sqrt(den1 * den2);
    },

    PERCENTILEEXC : function(array, k) {
        array = array.sort(function(a, b) {
            {
                return a - b;
            }
        });
        var n = array.length;
        if (k < 1 / (n + 1) || k > 1 - 1 / (n + 1)) {
            return '#NUM!';
        }
        var l = k * (n + 1) - 1;
        var fl = Math.floor(l);
        return utility.cleanFloat((l === fl) ? array[l] : array[fl] + (l - fl) * (array[fl + 1] - array[fl]));
    },

    PERCENTILEINC : function(array, k) {
        array = array.sort(function(a, b) {
            return a - b;
        });
        var n = array.length;
        var l = k * (n - 1);
        var fl = Math.floor(l);
        return utility.cleanFloat((l === fl) ? array[l] : array[fl] + (l - fl) * (array[fl + 1] - array[fl]));
    },

    PERCENTRANKEXC : function(array, x, significance) {
        array = array.sort(function(a, b) {
            return a - b;
        });
        var uniques = utility.unique(array);
        var n = array.length;
        var m = uniques.length;
        significance = (typeof significance === 'undefined') ? 3 : significance;
        var power = Math.pow(10, significance);
        var result = 0;
        var match = false;
        var i = 0;
        while (!match && i < m) {
            if (x === uniques[i]) {
                result = (array.indexOf(uniques[i]) + 1) / (n + 1);
                match = true;
            } else if (x >= uniques[i] && (x < uniques[i + 1] || i === m - 1)) {
                result = (array.indexOf(uniques[i]) + 1 + (x - uniques[i]) / (uniques[i + 1] - uniques[i])) / (n + 1);
                match = true;
            }
            i++;
        }
        return Math.floor(result * power) / power;
    },

    PERCENTRANKINC : function(array, x, significance) {
        array = array.sort(function(a, b) {
            return a - b;
        });
        var uniques = utility.unique(array);
        var n = array.length;
        var m = uniques.length;
        significance = (typeof significance === 'undefined') ? 3 : significance;
        var power = Math.pow(10, significance);
        var result = 0;
        var match = false;
        var i = 0;
        while (!match && i < m) {
            if (x === uniques[i]) {
                result = array.indexOf(uniques[i]) / (n - 1);
                match = true;
            } else if (x >= uniques[i] && (x < uniques[i + 1] || i === m - 1)) {
                result = (array.indexOf(uniques[i]) + (x - uniques[i]) / (uniques[i + 1] - uniques[i])) / (n - 1);
                match = true;
            }
            i++;
        }
        return Math.floor(result * power) / power;
    },

    PERMUT : function(number, number_chosen) {
        return formula.math.FACT(number) / formula.math.FACT(number - number_chosen);
    },

    PERMUTATIONA : function(number, number_chosen) {
        return Math.pow(number, number_chosen);
    },

    PHI : function(x) {
        return Math.exp(-0.5 * x * x) / data.SQRT2PI;
    },

    POISSONDIST : function(x, mean, cumulative) {
        if(typeof(jStat) == 'undefined'){
            return data.ERRKEY.jStatRequired;
        }
        return (cumulative) ? jStat.poisson.cdf(x, mean) : jStat.poisson.pdf(x, mean);
    },

    PROB : function(range, probability, lower, upper) {
        if (typeof lower === 'undefined') {
            return 0;
        }

        upper = (typeof upper === 'undefined') ? lower : upper;
        if (lower === upper) {
            return (range.indexOf(lower) >= 0) ? probability[range.indexOf(lower)] : 0;
        }

        var sorted = range.sort(function(a, b) {
            return a - b;
        });
        var n = sorted.length;
        var result = 0;
        for (var i = 0; i < n; i++) {
            if (sorted[i] >= lower && sorted[i] <= upper) {
                result += probability[range.indexOf(sorted[i])];
            }
        }
        return result;
    },

    QUARTILEEXC : function(range, quart) {
        switch (quart) {
            case 1:
                return formula.statistic.PERCENTILEEXC(range, 0.25);
            case 2:
                return formula.statistic.PERCENTILEEXC(range, 0.5);
            case 3:
                return formula.statistic.PERCENTILEEXC(range, 0.75);
            default:
                return '#NUM!';
        }
    },

    QUARTILEINC : function(range, quart) {
        switch (quart) {
            case 1:
                return formula.statistic.PERCENTILEINC(range, 0.25);
            case 2:
                return formula.statistic.PERCENTILEINC(range, 0.5);
            case 3:
                return formula.statistic.PERCENTILEINC(range, 0.75);
            default:
                return '#NUM!';
        }
    },

    RANKAVG : function(number, range, order) {
        order = (typeof order === 'undefined') ? false : order;
        var sort = (order) ? function(a, b) {
            return a - b;
        } : function(a, b) {
            return b - a;
        };
        range = range.sort(sort);
        var count = utility.countIn(range, number);
        return (count > 1) ? (2 * range.indexOf(number) + count + 1) / 2 : range.indexOf(number) + 1;
    },

    RANKEQ : function(number, range, order) {
        order = (typeof order === 'undefined') ? false : order;
        var sort = (order) ? function(a, b) {
            return a - b;
        } : function(a, b) {
            return b - a;
        };
        range = range.sort(sort);
        return range.indexOf(number) + 1;
    },

    RSQ : function(data_x, data_y) {
        return Math.pow(formula.statistic.PEARSON(data_x, data_y), 2);
    },

    SKEW : function() {
        if(typeof(jStat) == 'undefined'){
            return data.ERRKEY.jStatRequired;
        }
        var range = utility.arrayMerge(arguments);
        var mean = jStat.mean(range);
        var n = range.length;
        var sigma = 0;
        for (var i = 0; i < n; i++) {
            sigma += Math.pow(range[i] - mean, 3);
        }
        return n * sigma / ((n - 1) * (n - 2) * Math.pow(jStat.stdev(range, true), 3));
    },

    SKEWP : function() {
        if(typeof(jStat) == 'undefined'){
            return data.ERRKEY.jStatRequired;
        }
        var range = utility.arrayMerge(arguments);
        var mean = jStat.mean(range);
        var n = range.length;
        var m2 = 0;
        var m3 = 0;
        for (var i = 0; i < n; i++) {
            m3 += Math.pow(range[i] - mean, 3);
            m2 += Math.pow(range[i] - mean, 2);
        }
        m3 = m3 / n;
        m2 = m2 / n;
        return m3 / Math.pow(m2, 3 / 2);
    },

    SLOPE : function(data_y, data_x) {
        if(typeof(jStat) == 'undefined'){
            return data.ERRKEY.jStatRequired;
        }
        var xmean = jStat.mean(data_x);
        var ymean = jStat.mean(data_y);
        var n = data_x.length;
        var num = 0;
        var den = 0;
        for (var i = 0; i < n; i++) {
            num += (data_x[i] - xmean) * (data_y[i] - ymean);
            den += Math.pow(data_x[i] - xmean, 2);
        }
        return num / den;
    },

    SMALL : function(array, k) {
        return array.sort(function(a, b) {
            return a - b;
        })[k - 1];
    },

    STANDARDIZE : function(x, mean, sd) {
        return (x - mean) / sd;
    },

    STDEVA : function() {
        var range = utility.arrayMerge(arguments);
        var n = range.length;
        var sigma = 0;
        var mean = jStat.mean(range);
        for (var i = 0; i < n; i++) {
            sigma += Math.pow(range[i] - mean, 2);
        }
        return Math.sqrt(sigma / (n - 1));
    },

    STDEVP : function() {
        var range = utility.arrayMerge(arguments);
        var n = range.length;
        var sigma = 0;
        var count = 0;
        var mean = formula.statistic.AVERAGE(range);
        for (var i = 0; i < n; i++) {
            if (range[i] !== true && range[i] !== false) {
                sigma += Math.pow(range[i] - mean, 2);
                count++;
            }
        }
        return Math.sqrt(sigma / count);
    },

    STDEVPA : function() {
        if(typeof(jStat) == 'undefined'){
            return data.ERRKEY.jStatRequired;
        }
        var range = utility.arrayMerge(arguments);
        var n = range.length;
        var sigma = 0;
        var mean = jStat.mean(range);
        for (var i = 0; i < n; i++) {
            sigma += Math.pow(range[i] - mean, 2);
        }
        return Math.sqrt(sigma / n);
    },

    STDEVS : function() {
        var range = utility.arrayMerge(arguments);
        var n = range.length;
        var sigma = 0;
        var count = 0;
        var mean = formula.statistic.AVERAGE(range);
        for (var i = 0; i < n; i++) {
            if (range[i] !== true && range[i] !== false) {
                sigma += Math.pow(range[i] - mean, 2);
                count++;
            }
        }
        return Math.sqrt(sigma / (count - 1));
    },

    STEYX : function(data_y, data_x) {
        if(typeof(jStat) == 'undefined'){
            return data.ERRKEY.jStatRequired;
        }
        var xmean = jStat.mean(data_x);
        var ymean = jStat.mean(data_y);
        var n = data_x.length;
        var lft = 0;
        var num = 0;
        var den = 0;
        for (var i = 0; i < n; i++) {
            lft += Math.pow(data_y[i] - ymean, 2);
            num += (data_x[i] - xmean) * (data_y[i] - ymean);
            den += Math.pow(data_x[i] - xmean, 2);
        }
        return Math.sqrt((lft - num * num / den) / (n - 2));
    },

    TDIST : function(x, df, cumulative) {
        if(typeof(jStat) == 'undefined'){
            return data.ERRKEY.jStatRequired;
        }
        return (cumulative) ? jStat.studentt.cdf(x, df) : jStat.studentt.pdf(x, df);
    },

    TDIST2T : function() {
        return;
    },

    TDISTRT : function() {
        return;
    },

    TINV : function(probability, df) {
        if(typeof(jStat) == 'undefined'){
            return data.ERRKEY.jStatRequired;
        }
        return jStat.studentt.inv(probability, df);
    },

    TINV2T : function() {
        return;
    },

    TTEST : function() {
        return;
    },

    TREND : function() {
        return;
    },

    TRIMMEAN : function(range, percent) {
        if(typeof(jStat) == 'undefined'){
            return data.ERRKEY.jStatRequired;
        }
        var n = range.length;
        var trim = formula.math.FLOOR(range.length * percent, 2) / 2;
        return jStat.mean(utility.initial(utility.rest(range.sort(function(a, b) {
            return a - b;
        }), trim), trim));
    },

    VARA : function() {
        if(typeof(jStat) == 'undefined'){
            return data.ERRKEY.jStatRequired;
        }
        var range = utility.arrayMerge(arguments);
        var n = range.length;
        var sigma = 0;
        var mean = jStat.mean(range);
        for (var i = 0; i < n; i++) {
            sigma += Math.pow(range[i] - mean, 2);
        }
        return sigma / (n - 1);
    },

    VARP : function() {
        var range = utility.arrayMerge(arguments);
        var n = range.length;
        var sigma = 0;
        var count = 0;
        var mean = formula.statistic.AVERAGE(range);
        for (var i = 0; i < n; i++) {
            if (range[i] !== true && range[i] !== false) {
                sigma += Math.pow(range[i] - mean, 2);
                count++;
            }
        }
        return sigma / count;
    },

    VARPA : function() {
        if(typeof(jStat) == 'undefined'){
            return data.ERRKEY.jStatRequired;
        }
        var range = utility.arrayMerge(arguments);
        var n = range.length;
        var sigma = 0;
        var mean = jStat.mean(range);
        for (var i = 0; i < n; i++) {
            sigma += Math.pow(range[i] - mean, 2);
        }
        return sigma / n;
    },

    VARS : function() {
        var range = utility.arrayMerge(arguments);
        var n = range.length;
        var sigma = 0;
        var count = 0;
        var mean = formula.statistic.AVERAGE(range);
        for (var i = 0; i < n; i++) {
            if (range[i] !== true && range[i] !== false) {
                sigma += Math.pow(range[i] - mean, 2);
                count++;
            }
        }
        return sigma / (count - 1);
    },

    WEIBULLDIST : function(x, alpha, beta, cumulative) {
        return (cumulative) ? 1 - Math.exp(-Math.pow(x / beta, alpha)) : Math.pow(x, alpha - 1) * Math.exp(-Math.pow(x / beta, alpha)) * alpha / Math.pow(beta, alpha);
    },

    ZTEST : function(range, x, sigma) {
        var n = range.length;
        var sd = (typeof sigma === 'undefined') ? formula.statistic.STDEVS(range) : sigma;
        return 1 - formula.statistic.NORMSDIST((formula.statistic.AVERAGE(range) - x) / (sd / Math.sqrt(n)), formula.logical.TRUE);
    }
}