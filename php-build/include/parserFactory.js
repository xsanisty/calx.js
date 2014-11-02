function parserFactory(sheet){
	var parser = {trace: function trace(){},
yy: {},
symbols_: {"error":2,"expressions":3,"e":4,"EOF":5,"variableSequence":6,"TRUE":7,"FALSE":8,"NULL":9,"TIME_AMPM":10,"TIME_24":11,"number":12,"STRING":13,"&":14,"=":15,"+":16,"(":17,")":18,"[":19,"expseq":20,"]":21,"<":22,">":23,"NOT":24,"-":25,"*":26,"/":27,"^":28,"E":29,"FUNCTION":30,"cell":31,"FIXEDCELL":32,":":33,"CELL":34,"SHEET":35,"!":36,";":37,",":38,"VARIABLE":39,"DECIMAL":40,"NUMBER":41,"%":42,"#":43,"$accept":0,"$end":1},
terminals_: {5:"EOF",7:"TRUE",8:"FALSE",9:"NULL",10:"TIME_AMPM",11:"TIME_24",13:"STRING",14:"&",15:"=",16:"+",17:"(",18:")",19:"[",21:"]",22:"<",23:">",24:"NOT",25:"-",26:"*",27:"/",28:"^",29:"E",30:"FUNCTION",32:"FIXEDCELL",33:":",34:"CELL",35:"SHEET",36:"!",37:";",38:",",39:"VARIABLE",40:"DECIMAL",41:"NUMBER",42:"%",43:"#"},
productions_: [0,[3,2],[4,1],[4,1],[4,1],[4,1],[4,1],[4,1],[4,1],[4,1],[4,3],[4,3],[4,3],[4,3],[4,3],[4,4],[4,4],[4,4],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4,2],[4,2],[4,1],[4,3],[4,4],[4,1],[4,1],[4,2],[31,1],[31,3],[31,1],[31,3],[31,3],[31,5],[20,1],[20,3],[20,3],[6,1],[6,3],[12,1],[12,3],[12,2],[2,3],[2,4]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 1:return $$[$0-1];
break;
case 2:
            this.$ = sheet.getVariable($$[$0])

break;
case 3:
            this.$ = true;

break;
case 4:
            this.$ = false;

break;
case 5:
            this.$ = null;

break;
case 6:
            this.$ = sheet.time($$[$0]);

break;
case 7:
            this.$ = sheet.time($$[$0]);

break;
case 8:
            this.$ = $$[$0] * 1;

            if (isNaN(this.$)) this.$ = 0;

break;
case 9:
            this.$ = $$[$0].substring(1, $$[$0].length - 1);

break;
case 10:
            this.$ = ''+$$[$0-2]+$$[$0];

break;
case 11:
            this.$ = sheet.comparator.equal.call(sheet, $$[$0-2], $$[$0]);

break;
case 12:
            this.$ = formula.math.SUM.call(sheet, $$[$0-2], $$[$0]);

break;
case 13:this.$ = $$[$0-1] * 1;
break;
case 14:
            this.$ = $$[$0-1];

break;
case 15:
            this.$ = sheet.comparator.lessEqual.call(sheet, $$[$0-3], $$[$0]);

break;
case 16:
            this.$ = sheet.comparator.greaterEqual.call(sheet, $$[$0-3], $$[$0]);

break;
case 17:
            this.$ = sheet.comparator.notEqual.call(sheet, $$[$0-3], $$[$0]);

break;
case 18:
            this.$ = $$[$0-2] != $$[$0];

break;
case 19:
            this.$ = sheet.comparator.greater.call(sheet, $$[$0-2], $$[$0]);

break;
case 20:
            this.$ = sheet.comparator.less.call(sheet, $$[$0-2], $$[$0]);

break;
case 21:
            this.$ = formula.math.SUBTRACT.call(sheet, $$[$0-2], $$[$0]);

break;
case 22:
            this.$ = formula.math.MULTIPLY.call(sheet, $$[$0-2], $$[$0]);

break;
case 23:
            this.$ = formula.math.DIVIDE.call(sheet, $$[$0-2], $$[$0]);

break;
case 24:
            this.$ = formula.math.POWER.call(sheet, $$[$0-2], $$[$0]);

break;
case 25:
            this.$ = $$[$0] * -1;
            if (isNaN(this.$)) this.$ = 0;

break;
case 26:
            this.$ = $$[$0] * 1;
            if (isNaN(this.$)) this.$ = 0;

break;
case 27:
            this.$ = Math.E;

break;
case 28:
            this.$ = sheet.callFunction($$[$0-2]);

break;
case 29:
            this.$ = sheet.callFunction($$[$0-3], $$[$0-1]);

break;
case 33:
            this.$ = sheet.getCellValue($$[$0]);

break;
case 34:
            this.$ = sheet.getCellRangeValue($$[$0-2], $$[$0]);

break;
case 35:
            this.$ = sheet.getCellValue($$[$0]);

break;
case 36:
            this.$ = sheet.getCellRangeValue($$[$0-2], $$[$0]);

break;
case 37:
            this.$ = sheet.getRemoteCellValue($$[$0-2], $$[$0]);

break;
case 38:
            this.$ = sheet.getRemoteCellRangeValue($$[$0-4], $$[$0-2], $$[$0]);

break;
case 39:
            this.$ = [$$[$0]];

break;
case 40:
            $$[$0-2].push($$[$0]);
            this.$ = $$[$0-2];


break;
case 41:
            $$[$0-2].push($$[$0]);
            this.$ = $$[$0-2];


break;
case 42:
            this.$ = [$$[$0]];

break;
case 43:
            this.$ = ($.isArray($$[$0-2]) ? $$[$0-2] : [$$[$0-2]]);
            this.$.push($$[$0]);


break;
case 44:
            this.$ = $$[$0] * 1;

break;
case 45:
            this.$ = ($$[$0-2] + '.' + $$[$0]) * 1;

break;
case 46:
            this.$ = $$[$0-1] * 0.01;

break;
case 47:
            this.$ = $$[$0-2] + $$[$0-1] + $$[$0];

break;
case 48:
            this.$ = $$[$0-2] + $$[$0-1] + $$[$0];

break;
}
},
table: [{2:18,3:1,4:2,6:3,7:[1,4],8:[1,5],9:[1,6],10:[1,7],11:[1,8],12:9,13:[1,10],16:[1,14],17:[1,11],19:[1,12],25:[1,13],29:[1,15],30:[1,16],31:17,32:[1,21],34:[1,22],35:[1,23],39:[1,19],41:[1,20],43:[1,24]},{1:[3]},{5:[1,25],14:[1,26],15:[1,27],16:[1,28],22:[1,29],23:[1,30],24:[1,31],25:[1,32],26:[1,33],27:[1,34],28:[1,35]},{5:[2,2],14:[2,2],15:[2,2],16:[2,2],18:[2,2],21:[2,2],22:[2,2],23:[2,2],24:[2,2],25:[2,2],26:[2,2],27:[2,2],28:[2,2],37:[2,2],38:[2,2],40:[1,36]},{5:[2,3],14:[2,3],15:[2,3],16:[2,3],18:[2,3],21:[2,3],22:[2,3],23:[2,3],24:[2,3],25:[2,3],26:[2,3],27:[2,3],28:[2,3],37:[2,3],38:[2,3]},{5:[2,4],14:[2,4],15:[2,4],16:[2,4],18:[2,4],21:[2,4],22:[2,4],23:[2,4],24:[2,4],25:[2,4],26:[2,4],27:[2,4],28:[2,4],37:[2,4],38:[2,4]},{5:[2,5],14:[2,5],15:[2,5],16:[2,5],18:[2,5],21:[2,5],22:[2,5],23:[2,5],24:[2,5],25:[2,5],26:[2,5],27:[2,5],28:[2,5],37:[2,5],38:[2,5]},{5:[2,6],14:[2,6],15:[2,6],16:[2,6],18:[2,6],21:[2,6],22:[2,6],23:[2,6],24:[2,6],25:[2,6],26:[2,6],27:[2,6],28:[2,6],37:[2,6],38:[2,6]},{5:[2,7],14:[2,7],15:[2,7],16:[2,7],18:[2,7],21:[2,7],22:[2,7],23:[2,7],24:[2,7],25:[2,7],26:[2,7],27:[2,7],28:[2,7],37:[2,7],38:[2,7]},{5:[2,8],14:[2,8],15:[2,8],16:[2,8],18:[2,8],21:[2,8],22:[2,8],23:[2,8],24:[2,8],25:[2,8],26:[2,8],27:[2,8],28:[2,8],37:[2,8],38:[2,8],42:[1,37]},{5:[2,9],14:[2,9],15:[2,9],16:[2,9],18:[2,9],21:[2,9],22:[2,9],23:[2,9],24:[2,9],25:[2,9],26:[2,9],27:[2,9],28:[2,9],37:[2,9],38:[2,9]},{2:18,4:38,6:3,7:[1,4],8:[1,5],9:[1,6],10:[1,7],11:[1,8],12:9,13:[1,10],16:[1,14],17:[1,11],19:[1,12],25:[1,13],29:[1,15],30:[1,16],31:17,32:[1,21],34:[1,22],35:[1,23],39:[1,19],41:[1,20],43:[1,24]},{2:18,4:40,6:3,7:[1,4],8:[1,5],9:[1,6],10:[1,7],11:[1,8],12:9,13:[1,10],16:[1,14],17:[1,11],19:[1,12],20:39,25:[1,13],29:[1,15],30:[1,16],31:17,32:[1,21],34:[1,22],35:[1,23],39:[1,19],41:[1,20],43:[1,24]},{2:18,4:41,6:3,7:[1,4],8:[1,5],9:[1,6],10:[1,7],11:[1,8],12:9,13:[1,10],16:[1,14],17:[1,11],19:[1,12],25:[1,13],29:[1,15],30:[1,16],31:17,32:[1,21],34:[1,22],35:[1,23],39:[1,19],41:[1,20],43:[1,24]},{2:18,4:42,6:3,7:[1,4],8:[1,5],9:[1,6],10:[1,7],11:[1,8],12:9,13:[1,10],16:[1,14],17:[1,11],19:[1,12],25:[1,13],29:[1,15],30:[1,16],31:17,32:[1,21],34:[1,22],35:[1,23],39:[1,19],41:[1,20],43:[1,24]},{5:[2,27],14:[2,27],15:[2,27],16:[2,27],18:[2,27],21:[2,27],22:[2,27],23:[2,27],24:[2,27],25:[2,27],26:[2,27],27:[2,27],28:[2,27],37:[2,27],38:[2,27]},{17:[1,43]},{5:[2,30],14:[2,30],15:[2,30],16:[2,30],18:[2,30],21:[2,30],22:[2,30],23:[2,30],24:[2,30],25:[2,30],26:[2,30],27:[2,30],28:[2,30],37:[2,30],38:[2,30]},{2:44,5:[2,31],14:[2,31],15:[2,31],16:[2,31],18:[2,31],21:[2,31],22:[2,31],23:[2,31],24:[2,31],25:[2,31],26:[2,31],27:[2,31],28:[2,31],37:[2,31],38:[2,31],39:[1,45],43:[1,24]},{5:[2,42],14:[2,42],15:[2,42],16:[2,42],18:[2,42],21:[2,42],22:[2,42],23:[2,42],24:[2,42],25:[2,42],26:[2,42],27:[2,42],28:[2,42],37:[2,42],38:[2,42],40:[2,42],43:[1,46]},{5:[2,44],14:[2,44],15:[2,44],16:[2,44],18:[2,44],21:[2,44],22:[2,44],23:[2,44],24:[2,44],25:[2,44],26:[2,44],27:[2,44],28:[2,44],37:[2,44],38:[2,44],40:[1,47],42:[2,44]},{5:[2,33],14:[2,33],15:[2,33],16:[2,33],18:[2,33],21:[2,33],22:[2,33],23:[2,33],24:[2,33],25:[2,33],26:[2,33],27:[2,33],28:[2,33],33:[1,48],37:[2,33],38:[2,33]},{5:[2,35],14:[2,35],15:[2,35],16:[2,35],18:[2,35],21:[2,35],22:[2,35],23:[2,35],24:[2,35],25:[2,35],26:[2,35],27:[2,35],28:[2,35],33:[1,49],37:[2,35],38:[2,35]},{36:[1,50]},{39:[1,51]},{1:[2,1]},{2:18,4:52,6:3,7:[1,4],8:[1,5],9:[1,6],10:[1,7],11:[1,8],12:9,13:[1,10],16:[1,14],17:[1,11],19:[1,12],25:[1,13],29:[1,15],30:[1,16],31:17,32:[1,21],34:[1,22],35:[1,23],39:[1,19],41:[1,20],43:[1,24]},{2:18,4:53,6:3,7:[1,4],8:[1,5],9:[1,6],10:[1,7],11:[1,8],12:9,13:[1,10],16:[1,14],17:[1,11],19:[1,12],25:[1,13],29:[1,15],30:[1,16],31:17,32:[1,21],34:[1,22],35:[1,23],39:[1,19],41:[1,20],43:[1,24]},{2:18,4:54,6:3,7:[1,4],8:[1,5],9:[1,6],10:[1,7],11:[1,8],12:9,13:[1,10],16:[1,14],17:[1,11],19:[1,12],25:[1,13],29:[1,15],30:[1,16],31:17,32:[1,21],34:[1,22],35:[1,23],39:[1,19],41:[1,20],43:[1,24]},{2:18,4:57,6:3,7:[1,4],8:[1,5],9:[1,6],10:[1,7],11:[1,8],12:9,13:[1,10],15:[1,55],16:[1,14],17:[1,11],19:[1,12],23:[1,56],25:[1,13],29:[1,15],30:[1,16],31:17,32:[1,21],34:[1,22],35:[1,23],39:[1,19],41:[1,20],43:[1,24]},{2:18,4:59,6:3,7:[1,4],8:[1,5],9:[1,6],10:[1,7],11:[1,8],12:9,13:[1,10],15:[1,58],16:[1,14],17:[1,11],19:[1,12],25:[1,13],29:[1,15],30:[1,16],31:17,32:[1,21],34:[1,22],35:[1,23],39:[1,19],41:[1,20],43:[1,24]},{2:18,4:60,6:3,7:[1,4],8:[1,5],9:[1,6],10:[1,7],11:[1,8],12:9,13:[1,10],16:[1,14],17:[1,11],19:[1,12],25:[1,13],29:[1,15],30:[1,16],31:17,32:[1,21],34:[1,22],35:[1,23],39:[1,19],41:[1,20],43:[1,24]},{2:18,4:61,6:3,7:[1,4],8:[1,5],9:[1,6],10:[1,7],11:[1,8],12:9,13:[1,10],16:[1,14],17:[1,11],19:[1,12],25:[1,13],29:[1,15],30:[1,16],31:17,32:[1,21],34:[1,22],35:[1,23],39:[1,19],41:[1,20],43:[1,24]},{2:18,4:62,6:3,7:[1,4],8:[1,5],9:[1,6],10:[1,7],11:[1,8],12:9,13:[1,10],16:[1,14],17:[1,11],19:[1,12],25:[1,13],29:[1,15],30:[1,16],31:17,32:[1,21],34:[1,22],35:[1,23],39:[1,19],41:[1,20],43:[1,24]},{2:18,4:63,6:3,7:[1,4],8:[1,5],9:[1,6],10:[1,7],11:[1,8],12:9,13:[1,10],16:[1,14],17:[1,11],19:[1,12],25:[1,13],29:[1,15],30:[1,16],31:17,32:[1,21],34:[1,22],35:[1,23],39:[1,19],41:[1,20],43:[1,24]},{2:18,4:64,6:3,7:[1,4],8:[1,5],9:[1,6],10:[1,7],11:[1,8],12:9,13:[1,10],16:[1,14],17:[1,11],19:[1,12],25:[1,13],29:[1,15],30:[1,16],31:17,32:[1,21],34:[1,22],35:[1,23],39:[1,19],41:[1,20],43:[1,24]},{39:[1,65]},{5:[2,46],14:[2,46],15:[2,46],16:[2,46],18:[2,46],21:[2,46],22:[2,46],23:[2,46],24:[2,46],25:[2,46],26:[2,46],27:[2,46],28:[2,46],37:[2,46],38:[2,46],42:[2,46]},{14:[1,26],15:[1,27],16:[1,28],18:[1,66],22:[1,29],23:[1,30],24:[1,31],25:[1,32],26:[1,33],27:[1,34],28:[1,35]},{21:[1,67],37:[1,68],38:[1,69]},{14:[1,26],15:[1,27],16:[1,28],18:[2,39],21:[2,39],22:[1,29],23:[1,30],24:[1,31],25:[1,32],26:[1,33],27:[1,34],28:[1,35],37:[2,39],38:[2,39]},{5:[2,25],14:[2,25],15:[2,25],16:[2,25],18:[2,25],21:[2,25],22:[2,25],23:[2,25],24:[2,25],25:[2,25],26:[1,33],27:[1,34],28:[1,35],37:[2,25],38:[2,25]},{5:[2,26],14:[2,26],15:[2,26],16:[2,26],18:[2,26],21:[2,26],22:[2,26],23:[2,26],24:[2,26],25:[2,26],26:[1,33],27:[1,34],28:[1,35],37:[2,26],38:[2,26]},{2:18,4:40,6:3,7:[1,4],8:[1,5],9:[1,6],10:[1,7],11:[1,8],12:9,13:[1,10],16:[1,14],17:[1,11],18:[1,70],19:[1,12],20:71,25:[1,13],29:[1,15],30:[1,16],31:17,32:[1,21],34:[1,22],35:[1,23],39:[1,19],41:[1,20],43:[1,24]},{5:[2,32],14:[2,32],15:[2,32],16:[2,32],18:[2,32],21:[2,32],22:[2,32],23:[2,32],24:[2,32],25:[2,32],26:[2,32],27:[2,32],28:[2,32],37:[2,32],38:[2,32]},{43:[1,46]},{39:[1,72]},{41:[1,73]},{32:[1,74]},{34:[1,75]},{34:[1,76]},{36:[1,77]},{5:[2,10],14:[2,10],15:[2,10],16:[1,28],18:[2,10],21:[2,10],22:[1,29],23:[1,30],24:[1,31],25:[1,32],26:[1,33],27:[1,34],28:[1,35],37:[2,10],38:[2,10]},{5:[2,11],14:[2,11],15:[2,11],16:[1,28],18:[2,11],21:[2,11],22:[1,29],23:[1,30],24:[1,31],25:[1,32],26:[1,33],27:[1,34],28:[1,35],37:[2,11],38:[2,11]},{5:[2,12],14:[2,12],15:[2,12],16:[2,12],18:[2,12],21:[2,12],22:[2,12],23:[2,12],24:[2,12],25:[2,12],26:[1,33],27:[1,34],28:[1,35],37:[2,12],38:[2,12]},{2:18,4:78,6:3,7:[1,4],8:[1,5],9:[1,6],10:[1,7],11:[1,8],12:9,13:[1,10],16:[1,14],17:[1,11],19:[1,12],25:[1,13],29:[1,15],30:[1,16],31:17,32:[1,21],34:[1,22],35:[1,23],39:[1,19],41:[1,20],43:[1,24]},{2:18,4:79,6:3,7:[1,4],8:[1,5],9:[1,6],10:[1,7],11:[1,8],12:9,13:[1,10],16:[1,14],17:[1,11],19:[1,12],25:[1,13],29:[1,15],30:[1,16],31:17,32:[1,21],34:[1,22],35:[1,23],39:[1,19],41:[1,20],43:[1,24]},{5:[2,20],14:[2,20],15:[2,20],16:[1,28],18:[2,20],21:[2,20],22:[2,20],23:[2,20],24:[2,20],25:[1,32],26:[1,33],27:[1,34],28:[1,35],37:[2,20],38:[2,20]},{2:18,4:80,6:3,7:[1,4],8:[1,5],9:[1,6],10:[1,7],11:[1,8],12:9,13:[1,10],16:[1,14],17:[1,11],19:[1,12],25:[1,13],29:[1,15],30:[1,16],31:17,32:[1,21],34:[1,22],35:[1,23],39:[1,19],41:[1,20],43:[1,24]},{5:[2,19],14:[2,19],15:[2,19],16:[1,28],18:[2,19],21:[2,19],22:[2,19],23:[2,19],24:[2,19],25:[1,32],26:[1,33],27:[1,34],28:[1,35],37:[2,19],38:[2,19]},{5:[2,18],14:[2,18],15:[2,18],16:[1,28],18:[2,18],21:[2,18],22:[1,29],23:[1,30],24:[2,18],25:[1,32],26:[1,33],27:[1,34],28:[1,35],37:[2,18],38:[2,18]},{5:[2,21],14:[2,21],15:[2,21],16:[2,21],18:[2,21],21:[2,21],22:[2,21],23:[2,21],24:[2,21],25:[2,21],26:[1,33],27:[1,34],28:[1,35],37:[2,21],38:[2,21]},{5:[2,22],14:[2,22],15:[2,22],16:[2,22],18:[2,22],21:[2,22],22:[2,22],23:[2,22],24:[2,22],25:[2,22],26:[2,22],27:[2,22],28:[1,35],37:[2,22],38:[2,22]},{5:[2,23],14:[2,23],15:[2,23],16:[2,23],18:[2,23],21:[2,23],22:[2,23],23:[2,23],24:[2,23],25:[2,23],26:[2,23],27:[2,23],28:[1,35],37:[2,23],38:[2,23]},{5:[2,24],14:[2,24],15:[2,24],16:[2,24],18:[2,24],21:[2,24],22:[2,24],23:[2,24],24:[2,24],25:[2,24],26:[2,24],27:[2,24],28:[2,24],37:[2,24],38:[2,24]},{5:[2,43],14:[2,43],15:[2,43],16:[2,43],18:[2,43],21:[2,43],22:[2,43],23:[2,43],24:[2,43],25:[2,43],26:[2,43],27:[2,43],28:[2,43],37:[2,43],38:[2,43],40:[2,43]},{5:[2,13],14:[2,13],15:[2,13],16:[2,13],18:[2,13],21:[2,13],22:[2,13],23:[2,13],24:[2,13],25:[2,13],26:[2,13],27:[2,13],28:[2,13],37:[2,13],38:[2,13]},{5:[2,14],14:[2,14],15:[2,14],16:[2,14],18:[2,14],21:[2,14],22:[2,14],23:[2,14],24:[2,14],25:[2,14],26:[2,14],27:[2,14],28:[2,14],37:[2,14],38:[2,14]},{2:18,4:81,6:3,7:[1,4],8:[1,5],9:[1,6],10:[1,7],11:[1,8],12:9,13:[1,10],16:[1,14],17:[1,11],19:[1,12],25:[1,13],29:[1,15],30:[1,16],31:17,32:[1,21],34:[1,22],35:[1,23],39:[1,19],41:[1,20],43:[1,24]},{2:18,4:82,6:3,7:[1,4],8:[1,5],9:[1,6],10:[1,7],11:[1,8],12:9,13:[1,10],16:[1,14],17:[1,11],19:[1,12],25:[1,13],29:[1,15],30:[1,16],31:17,32:[1,21],34:[1,22],35:[1,23],39:[1,19],41:[1,20],43:[1,24]},{5:[2,28],14:[2,28],15:[2,28],16:[2,28],18:[2,28],21:[2,28],22:[2,28],23:[2,28],24:[2,28],25:[2,28],26:[2,28],27:[2,28],28:[2,28],37:[2,28],38:[2,28]},{18:[1,83],37:[1,68],38:[1,69]},{36:[1,84]},{5:[2,45],14:[2,45],15:[2,45],16:[2,45],18:[2,45],21:[2,45],22:[2,45],23:[2,45],24:[2,45],25:[2,45],26:[2,45],27:[2,45],28:[2,45],37:[2,45],38:[2,45],42:[2,45]},{5:[2,34],14:[2,34],15:[2,34],16:[2,34],18:[2,34],21:[2,34],22:[2,34],23:[2,34],24:[2,34],25:[2,34],26:[2,34],27:[2,34],28:[2,34],37:[2,34],38:[2,34]},{5:[2,36],14:[2,36],15:[2,36],16:[2,36],18:[2,36],21:[2,36],22:[2,36],23:[2,36],24:[2,36],25:[2,36],26:[2,36],27:[2,36],28:[2,36],37:[2,36],38:[2,36]},{5:[2,37],14:[2,37],15:[2,37],16:[2,37],18:[2,37],21:[2,37],22:[2,37],23:[2,37],24:[2,37],25:[2,37],26:[2,37],27:[2,37],28:[2,37],33:[1,85],37:[2,37],38:[2,37]},{5:[2,47],14:[2,47],15:[2,47],16:[2,47],18:[2,47],21:[2,47],22:[2,47],23:[2,47],24:[2,47],25:[2,47],26:[2,47],27:[2,47],28:[2,47],37:[2,47],38:[2,47],39:[2,47],43:[2,47]},{5:[2,15],14:[2,15],15:[2,15],16:[1,28],18:[2,15],21:[2,15],22:[2,15],23:[2,15],24:[2,15],25:[1,32],26:[1,33],27:[1,34],28:[1,35],37:[2,15],38:[2,15]},{5:[2,17],14:[2,17],15:[2,17],16:[1,28],18:[2,17],21:[2,17],22:[2,17],23:[2,17],24:[2,17],25:[1,32],26:[1,33],27:[1,34],28:[1,35],37:[2,17],38:[2,17]},{5:[2,16],14:[2,16],15:[2,16],16:[1,28],18:[2,16],21:[2,16],22:[2,16],23:[2,16],24:[2,16],25:[1,32],26:[1,33],27:[1,34],28:[1,35],37:[2,16],38:[2,16]},{14:[1,26],15:[1,27],16:[1,28],18:[2,40],21:[2,40],22:[1,29],23:[1,30],24:[1,31],25:[1,32],26:[1,33],27:[1,34],28:[1,35],37:[2,40],38:[2,40]},{14:[1,26],15:[1,27],16:[1,28],18:[2,41],21:[2,41],22:[1,29],23:[1,30],24:[1,31],25:[1,32],26:[1,33],27:[1,34],28:[1,35],37:[2,41],38:[2,41]},{5:[2,29],14:[2,29],15:[2,29],16:[2,29],18:[2,29],21:[2,29],22:[2,29],23:[2,29],24:[2,29],25:[2,29],26:[2,29],27:[2,29],28:[2,29],37:[2,29],38:[2,29]},{5:[2,48],14:[2,48],15:[2,48],16:[2,48],18:[2,48],21:[2,48],22:[2,48],23:[2,48],24:[2,48],25:[2,48],26:[2,48],27:[2,48],28:[2,48],37:[2,48],38:[2,48],39:[2,48],43:[2,48]},{34:[1,86]},{5:[2,38],14:[2,38],15:[2,38],16:[2,38],18:[2,38],21:[2,38],22:[2,38],23:[2,38],24:[2,38],25:[2,38],26:[2,38],27:[2,38],28:[2,38],37:[2,38],38:[2,38]}],
defaultActions: {25:[2,1]},
parseError: function parseError(str,hash){if(hash.recoverable){this.trace(str)}else{throw new Error(str)}},
parse: function parse(input){var self=this,stack=[0],vstack=[null],lstack=[],table=this.table,yytext="",yylineno=0,yyleng=0,recovering=0,TERROR=2,EOF=1;var args=lstack.slice.call(arguments,1);this.lexer.setInput(input);this.lexer.yy=this.yy;this.yy.lexer=this.lexer;this.yy.parser=this;if(typeof this.lexer.yylloc=="undefined"){this.lexer.yylloc={}}var yyloc=this.lexer.yylloc;lstack.push(yyloc);var ranges=this.lexer.options&&this.lexer.options.ranges;if(typeof this.yy.parseError==="function"){this.parseError=this.yy.parseError}else{this.parseError=Object.getPrototypeOf(this).parseError}function popStack(n){stack.length=stack.length-2*n;vstack.length=vstack.length-n;lstack.length=lstack.length-n}function lex(){var token;token=self.lexer.lex()||EOF;if(typeof token!=="number"){token=self.symbols_[token]||token}return token}var symbol,preErrorSymbol,state,action,a,r,yyval={},p,len,newState,expected;while(true){state=stack[stack.length-1];if(this.defaultActions[state]){action=this.defaultActions[state]}else{if(symbol===null||typeof symbol=="undefined"){symbol=lex()}action=table[state]&&table[state][symbol]}_handle_error:if(typeof action==="undefined"||!action.length||!action[0]){var error_rule_depth;var errStr="";function locateNearestErrorRecoveryRule(state){var stack_probe=stack.length-1;var depth=0;for(;;){if(TERROR.toString()in table[state]){return depth}if(state===0||stack_probe<2){return false}stack_probe-=2;state=stack[stack_probe];++depth}}if(!recovering){error_rule_depth=locateNearestErrorRecoveryRule(state);expected=[];for(p in table[state]){if(this.terminals_[p]&&p>TERROR){expected.push("'"+this.terminals_[p]+"'")}}if(this.lexer.showPosition){errStr="Parse error on line "+(yylineno+1)+":\n"+this.lexer.showPosition()+"\nExpecting "+expected.join(", ")+", got '"+(this.terminals_[symbol]||symbol)+"'"}else{errStr="Parse error on line "+(yylineno+1)+": Unexpected "+(symbol==EOF?"end of input":"'"+(this.terminals_[symbol]||symbol)+"'")}this.parseError(errStr,{text:this.lexer.match,token:this.terminals_[symbol]||symbol,line:this.lexer.yylineno,loc:yyloc,expected:expected,recoverable:error_rule_depth!==false})}else if(preErrorSymbol!==EOF){error_rule_depth=locateNearestErrorRecoveryRule(state)}if(recovering==3){if(symbol===EOF||preErrorSymbol===EOF){throw new Error(errStr||"Parsing halted while starting to recover from another error.")}yyleng=this.lexer.yyleng;yytext=this.lexer.yytext;yylineno=this.lexer.yylineno;yyloc=this.lexer.yylloc;symbol=lex()}if(error_rule_depth===false){throw new Error(errStr||"Parsing halted. No suitable error recovery rule available.")}popStack(error_rule_depth);preErrorSymbol=symbol==TERROR?null:symbol;symbol=TERROR;state=stack[stack.length-1];action=table[state]&&table[state][TERROR];recovering=3}if(action[0]instanceof Array&&action.length>1){throw new Error("Parse Error: multiple actions possible at state: "+state+", token: "+symbol)}switch(action[0]){case 1:stack.push(symbol);vstack.push(this.lexer.yytext);lstack.push(this.lexer.yylloc);stack.push(action[1]);symbol=null;if(!preErrorSymbol){yyleng=this.lexer.yyleng;yytext=this.lexer.yytext;yylineno=this.lexer.yylineno;yyloc=this.lexer.yylloc;if(recovering>0){recovering--}}else{symbol=preErrorSymbol;preErrorSymbol=null}break;case 2:len=this.productions_[action[1]][1];yyval.$=vstack[vstack.length-len];yyval._$={first_line:lstack[lstack.length-(len||1)].first_line,last_line:lstack[lstack.length-1].last_line,first_column:lstack[lstack.length-(len||1)].first_column,last_column:lstack[lstack.length-1].last_column};if(ranges){yyval._$.range=[lstack[lstack.length-(len||1)].range[0],lstack[lstack.length-1].range[1]]}r=this.performAction.apply(yyval,[yytext,yyleng,yylineno,this.yy,action[1],vstack,lstack].concat(args));if(typeof r!=="undefined"){return r}if(len){stack=stack.slice(0,-1*len*2);vstack=vstack.slice(0,-1*len);lstack=lstack.slice(0,-1*len)}stack.push(this.productions_[action[1]][0]);vstack.push(yyval.$);lstack.push(yyval._$);newState=table[stack[stack.length-2]][stack[stack.length-1]];stack.push(newState);break;case 3:return true}}return true}};
/* generated by jison-lex 0.2.1 */
var lexer = (function(){
var lexer = {

EOF:1,

parseError:function parseError(str,hash){
"use strict";
if(this.yy.parser){this.yy.parser.parseError(str,hash)}else{throw new Error(str)}},

// resets the lexer, sets new input
setInput:function (input){
"use strict";
this._input=input;this._more=this._backtrack=this.done=false;this.yylineno=this.yyleng=0;this.yytext=this.matched=this.match="";this.conditionStack=["INITIAL"];this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0};if(this.options.ranges){this.yylloc.range=[0,0]}this.offset=0;return this},

// consumes and returns one char from the input
input:function (){
"use strict";
var ch=this._input[0];this.yytext+=ch;this.yyleng++;this.offset++;this.match+=ch;this.matched+=ch;var lines=ch.match(/(?:\r\n?|\n).*/g);if(lines){this.yylineno++;this.yylloc.last_line++}else{this.yylloc.last_column++}if(this.options.ranges){this.yylloc.range[1]++}this._input=this._input.slice(1);return ch},

// unshifts one char (or a string) into the input
unput:function (ch){
"use strict";
var len=ch.length;var lines=ch.split(/(?:\r\n?|\n)/g);this._input=ch+this._input;this.yytext=this.yytext.substr(0,this.yytext.length-len-1);this.offset-=len;var oldLines=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1);this.matched=this.matched.substr(0,this.matched.length-1);if(lines.length-1){this.yylineno-=lines.length-1}var r=this.yylloc.range;this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:lines?(lines.length===oldLines.length?this.yylloc.first_column:0)+oldLines[oldLines.length-lines.length].length-lines[0].length:this.yylloc.first_column-len};if(this.options.ranges){this.yylloc.range=[r[0],r[0]+this.yyleng-len]}this.yyleng=this.yytext.length;return this},

// When called from action, caches matched text and appends it on next action
more:function (){
"use strict";
this._more=true;return this},

// When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
reject:function (){
"use strict";
if(this.options.backtrack_lexer){this._backtrack=true}else{return this.parseError("Lexical error on line "+(this.yylineno+1)+". You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n"+this.showPosition(),{text:"",token:null,line:this.yylineno})}return this},

// retain first n characters of the match
less:function (n){
"use strict";
this.unput(this.match.slice(n))},

// displays already matched input, i.e. for error messages
pastInput:function (){
"use strict";
var past=this.matched.substr(0,this.matched.length-this.match.length);return(past.length>20?"...":"")+past.substr(-20).replace(/\n/g,"")},

// displays upcoming input, i.e. for error messages
upcomingInput:function (){
"use strict";
var next=this.match;if(next.length<20){next+=this._input.substr(0,20-next.length)}return(next.substr(0,20)+(next.length>20?"...":"")).replace(/\n/g,"")},

// displays the character position where the lexing error occurred, i.e. for error messages
showPosition:function (){
"use strict";
var pre=this.pastInput();var c=new Array(pre.length+1).join("-");return pre+this.upcomingInput()+"\n"+c+"^"},

// test the lexed token: return FALSE when not a match, otherwise return token
test_match:function (match,indexed_rule){
"use strict";
var token,lines,backup;if(this.options.backtrack_lexer){backup={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done};if(this.options.ranges){backup.yylloc.range=this.yylloc.range.slice(0)}}lines=match[0].match(/(?:\r\n?|\n).*/g);if(lines){this.yylineno+=lines.length}this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:lines?lines[lines.length-1].length-lines[lines.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+match[0].length};this.yytext+=match[0];this.match+=match[0];this.matches=match;this.yyleng=this.yytext.length;if(this.options.ranges){this.yylloc.range=[this.offset,this.offset+=this.yyleng]}this._more=false;this._backtrack=false;this._input=this._input.slice(match[0].length);this.matched+=match[0];token=this.performAction.call(this,this.yy,this,indexed_rule,this.conditionStack[this.conditionStack.length-1]);if(this.done&&this._input){this.done=false}if(token){return token}else if(this._backtrack){for(var k in backup){this[k]=backup[k]}return false}return false},

// return next match in input
next:function (){
"use strict";
if(this.done){return this.EOF}if(!this._input){this.done=true}var token,match,tempMatch,index;if(!this._more){this.yytext="";this.match=""}var rules=this._currentRules();for(var i=0;i<rules.length;i++){tempMatch=this._input.match(this.rules[rules[i]]);if(tempMatch&&(!match||tempMatch[0].length>match[0].length)){match=tempMatch;index=i;if(this.options.backtrack_lexer){token=this.test_match(tempMatch,rules[i]);if(token!==false){return token}else if(this._backtrack){match=false;continue}else{return false}}else if(!this.options.flex){break}}}if(match){token=this.test_match(match,rules[index]);if(token!==false){return token}return false}if(this._input===""){return this.EOF}else{return this.parseError("Lexical error on line "+(this.yylineno+1)+". Unrecognized text.\n"+this.showPosition(),{text:"",token:null,line:this.yylineno})}},

// return next match that has a token
lex:function lex(){
"use strict";
var r=this.next();if(r){return r}else{return this.lex()}},

// activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
begin:function begin(condition){
"use strict";
this.conditionStack.push(condition)},

// pop the previously active lexer condition state off the condition stack
popState:function popState(){
"use strict";
var n=this.conditionStack.length-1;if(n>0){return this.conditionStack.pop()}else{return this.conditionStack[0]}},

// produce the lexer rule set which is active for the currently active lexer condition state
_currentRules:function _currentRules(){
"use strict";
if(this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]){return this.conditions[this.conditionStack[this.conditionStack.length-1]].rules}else{return this.conditions["INITIAL"].rules}},

// return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
topState:function topState(n){
"use strict";
n=this.conditionStack.length-1-Math.abs(n||0);if(n>=0){return this.conditionStack[n]}else{return"INITIAL"}},

// alias for begin(condition)
pushState:function pushState(condition){
"use strict";
this.begin(condition)},

// return the number of states currently on the stack
stateStackSize:function stateStackSize(){
"use strict";
return this.conditionStack.length},
options: {},
performAction: function anonymous(yy, yy_, $avoiding_name_collisions, YY_START) {

var YYSTATE=YY_START;
switch($avoiding_name_collisions) {
case 0:/* skip whitespace */
break;
case 1:return 13;
break;
case 2:return 13;
break;
case 3:return 35;
break;
case 4:return 30;
break;
case 5:return 10;
break;
case 6:return 11;
break;
case 7:
    if (sheet.obj.type == 'cell') return 35;
    return 39;


break;
case 8:
    if (sheet.obj.type == 'cell') return 32;
    return 39;


break;
case 9:
    if (sheet.obj.type == 'cell') return 34;
    return 39;


break;
case 10:return 30;
break;
case 11:return 39;
break;
case 12:return 39;
break;
case 13:return 41;
break;
case 14:/* skip whitespace */
break;
case 15:return ' ';
break;
case 16:return 40;
break;
case 17:return 33;
break;
case 18:return 37;
break;
case 19:return 38;
break;
case 20:return 26;
break;
case 21:return 27;
break;
case 22:return 25;
break;
case 23:return 16;
break;
case 24:return 28;
break;
case 25:return 17;
break;
case 26:return 18;
break;
case 27:return 19;
break;
case 28:return 21;
break;
case 29:return 23;
break;
case 30:return 22;
break;
case 31:return 24;
break;
case 32:return 'PI';
break;
case 33:return 29;
break;
case 34:return 7;
break;
case 35:return 8;
break;
case 36:return 9;
break;
case 37:return '"';
break;
case 38:return "'";
break;
case 39:return "!";
break;
case 40:return 15;
break;
case 41:return 42;
break;
case 42:return 43;
break;
case 43:return 14;
break;
case 44:return 5;
break;
}
},
rules: [/^(?:\s+)/,/^(?:"(\\["]|[^"])*")/,/^(?:'(\\[']|[^'])*')/,/^(?:#[A-Za-z0-9_]+)/,/^(?:[A-Za-z]{1,}[A-Za-z_0-9]+(?=[(]))/,/^(?:([0]?[1-9]|1[0-2])[:][0-5][0-9]([:][0-5][0-9])?[ ]?(AM|am|aM|Am|PM|pm|pM|Pm))/,/^(?:([0]?[0-9]|1[0-9]|2[0-3])[:][0-5][0-9]([:][0-5][0-9])?)/,/^(?:[A-Za-z0-9_]+>[A-Za-z0-9_]+)/,/^(?:\$[A-Za-z]+\$[0-9]+)/,/^(?:[A-Za-z]+[0-9]+)/,/^(?:[A-Za-z]+(?=[(]))/,/^(?:[A-Za-z]{1,}[A-Za-z_0-9]+)/,/^(?:[A-Za-z_]+)/,/^(?:[0-9]+)/,/^(?:\$)/,/^(?: )/,/^(?:[.])/,/^(?::)/,/^(?:;)/,/^(?:,)/,/^(?:\*)/,/^(?:\/)/,/^(?:-)/,/^(?:\+)/,/^(?:\^)/,/^(?:\()/,/^(?:\))/,/^(?:\[)/,/^(?:\])/,/^(?:>)/,/^(?:<)/,/^(?:NOT\b)/,/^(?:PI\b)/,/^(?:E\b)/,/^(?:TRUE\b)/,/^(?:FALSE\b)/,/^(?:NULL\b)/,/^(?:")/,/^(?:')/,/^(?:!)/,/^(?:=)/,/^(?:%)/,/^(?:[#])/,/^(?:[&])/,/^(?:$)/],
conditions: {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44],"inclusive":true}}
};
return lexer;
})();
parser.lexer = lexer;
function Parser () {
  this.yy = {};
}
Parser.prototype = parser;parser.Parser = Parser;
return new Parser;
}