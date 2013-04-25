/**
 * jQuery Calx 1.0 <initial release>
 * author :  Ikhsan Agustian <ikhsan017@gmail.com>
 * credit :  jison generated parser <zaach.github.com/jison/>,
 *           js format number <http://phpjs.org/functions/number_format:481>
 *           stackoverflow community :D
 * lisence:  WTFPL
 */
(function($) {
    //ie support for Array.indexOf and Sstring.trim method
    if (!Array.indexOf) {
	Array.prototype.indexOf = function(obj, start) {
	    for (var i = (start || 0); i < this.length; i++) {
		if (this[i] == obj) {
		    return i;
		}
	    }
	    return -1;
	}
    }
    if (typeof String.prototype.trim !== 'function') {
	String.prototype.trim = function() {
	    return this.replace(/^\s+|\s+$/g, '');
	}
    }

    /** default option */
    var defaultOptions = {
	event: 'blur',
	autocalculate: true,
    }


    var defaultFormat = {
	format: 'decimal',
	//currency, percent
	decimal: 0,
	//digit decimal after number (xxx.00)
	suffix: '',
	//suffix $ xxx,xxx.xx
	prefix: '',
	//xx %, xx pcs
	digitsep: ',',
	//thousand separator $xxx,xxx.xx
	decsep: '.',
	//decimal separator xxx.xx
	absolute: false //if absolute, input will be positif, and absolute class added
    }

    var utility = {
	/** Jison generated parser
	 *  you may use your own parser by extend utility object
	 *  http://zaach.github.com/jison/
	 */
	parser: (function() {
	    var parser = {
		trace: function trace() {},
		yy: {},
		symbols_: {
		    "error": 2,
		    "expressions": 3,
		    "e": 4,
		    "EOF": 5,
		    "+": 6,
		    "-": 7,
		    "*": 8,
		    "/": 9,
		    "^": 10,
		    "MOD": 11,
		    "(": 12,
		    ")": 13,
		    ">": 14,
		    "<": 15,
		    "=": 16,
		    "IF": 17,
		    ",": 18,
		    "NUMBER": 19,
		    "E": 20,
		    "PI": 21,
		    "$accept": 0,
		    "$end": 1
		},
		terminals_: {
		    2: "error",
		    5: "EOF",
		    6: "+",
		    7: "-",
		    8: "*",
		    9: "/",
		    10: "^",
		    11: "MOD",
		    12: "(",
		    13: ")",
		    14: ">",
		    15: "<",
		    16: "=",
		    17: "IF",
		    18: ",",
		    19: "NUMBER",
		    20: "E",
		    21: "PI"
		},
		productions_: [0, [3, 2],
		    [4, 3],
		    [4, 3],
		    [4, 3],
		    [4, 3],
		    [4, 3],
		    [4, 3],
		    [4, 2],
		    [4, 3],
		    [4, 3],
		    [4, 3],
		    [4, 4],
		    [4, 4],
		    [4, 3],
		    [4, 4],
		    [4, 8],
		    [4, 1],
		    [4, 1],
		    [4, 1]
		],
		performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$) { /* this == yyval */

		    var $0 = $$.length - 1;
		    switch (yystate) {
		    case 1:
			return $$[$0 - 1];
			break;
		    case 2:
			this.$ = $$[$0 - 2] + $$[$0];
			break;
		    case 3:
			this.$ = $$[$0 - 2] - $$[$0];
			break;
		    case 4:
			this.$ = $$[$0 - 2] * $$[$0];
			break;
		    case 5:
			this.$ = $$[$0 - 2] / $$[$0];
			break;
		    case 6:
			this.$ = Math.pow($$[$0 - 2], $$[$0]);
			break;
		    case 7:
			this.$ = $$[$0 - 2] % $$[$0];
			break;
		    case 8:
			this.$ = -$$[$0];
			break;
		    case 9:
			this.$ = $$[$0 - 1];
			break;
		    case 10:
			this.$ = $$[$0 - 2] > $$[$0]
			break;
		    case 11:
			this.$ = $$[$0 - 2] < $$[$0]
			break;
		    case 12:
			this.$ = $$[$0 - 3] >= $$[$0]
			break;
		    case 13:
			this.$ = $$[$0 - 3] <= $$[$0]
			break;
		    case 14:
			this.$ = $$[$0 - 2] == $$[$0]
			break;
		    case 15:
			this.$ = $$[$0 - 3] != $$[$0]
			break;
		    case 16:
			this.$ = ($$[$0 - 5]) ? $$[$0 - 3] : $$[$0 - 1]
			break;
		    case 17:
			this.$ = Number(yytext);
			break;
		    case 18:
			this.$ = Math.E;
			break;
		    case 19:
			this.$ = Math.PI;
			break;
		    }
		},
		table: [{
		    3: 1,
		    4: 2,
		    7: [1, 3],
		    12: [1, 4],
		    17: [1, 5],
		    19: [1, 6],
		    20: [1, 7],
		    21: [1, 8]
		}, {
		    1: [3]
		}, {
		    5: [1, 9],
		    6: [1, 10],
		    7: [1, 11],
		    8: [1, 12],
		    9: [1, 13],
		    10: [1, 14],
		    11: [1, 15],
		    14: [1, 16],
		    15: [1, 17],
		    16: [1, 18]
		}, {
		    4: 19,
		    7: [1, 3],
		    12: [1, 4],
		    17: [1, 5],
		    19: [1, 6],
		    20: [1, 7],
		    21: [1, 8]
		}, {
		    4: 20,
		    7: [1, 3],
		    12: [1, 4],
		    17: [1, 5],
		    19: [1, 6],
		    20: [1, 7],
		    21: [1, 8]
		}, {
		    12: [1, 21]
		}, {
		    5: [2, 17],
		    6: [2, 17],
		    7: [2, 17],
		    8: [2, 17],
		    9: [2, 17],
		    10: [2, 17],
		    11: [2, 17],
		    14: [2, 17],
		    15: [2, 17],
		    16: [2, 17],
		    13: [2, 17],
		    18: [2, 17]
		}, {
		    5: [2, 18],
		    6: [2, 18],
		    7: [2, 18],
		    8: [2, 18],
		    9: [2, 18],
		    10: [2, 18],
		    11: [2, 18],
		    14: [2, 18],
		    15: [2, 18],
		    16: [2, 18],
		    13: [2, 18],
		    18: [2, 18]
		}, {
		    5: [2, 19],
		    6: [2, 19],
		    7: [2, 19],
		    8: [2, 19],
		    9: [2, 19],
		    10: [2, 19],
		    11: [2, 19],
		    14: [2, 19],
		    15: [2, 19],
		    16: [2, 19],
		    13: [2, 19],
		    18: [2, 19]
		}, {
		    1: [2, 1]
		}, {
		    4: 22,
		    7: [1, 3],
		    12: [1, 4],
		    17: [1, 5],
		    19: [1, 6],
		    20: [1, 7],
		    21: [1, 8]
		}, {
		    4: 23,
		    7: [1, 3],
		    12: [1, 4],
		    17: [1, 5],
		    19: [1, 6],
		    20: [1, 7],
		    21: [1, 8]
		}, {
		    4: 24,
		    7: [1, 3],
		    12: [1, 4],
		    17: [1, 5],
		    19: [1, 6],
		    20: [1, 7],
		    21: [1, 8]
		}, {
		    4: 25,
		    7: [1, 3],
		    12: [1, 4],
		    17: [1, 5],
		    19: [1, 6],
		    20: [1, 7],
		    21: [1, 8]
		}, {
		    4: 26,
		    7: [1, 3],
		    12: [1, 4],
		    17: [1, 5],
		    19: [1, 6],
		    20: [1, 7],
		    21: [1, 8]
		}, {
		    4: 27,
		    7: [1, 3],
		    12: [1, 4],
		    17: [1, 5],
		    19: [1, 6],
		    20: [1, 7],
		    21: [1, 8]
		}, {
		    4: 28,
		    16: [1, 29],
		    7: [1, 3],
		    12: [1, 4],
		    17: [1, 5],
		    19: [1, 6],
		    20: [1, 7],
		    21: [1, 8]
		}, {
		    4: 30,
		    16: [1, 31],
		    14: [1, 32],
		    7: [1, 3],
		    12: [1, 4],
		    17: [1, 5],
		    19: [1, 6],
		    20: [1, 7],
		    21: [1, 8]
		}, {
		    4: 33,
		    7: [1, 3],
		    12: [1, 4],
		    17: [1, 5],
		    19: [1, 6],
		    20: [1, 7],
		    21: [1, 8]
		}, {
		    6: [2, 8],
		    7: [2, 8],
		    8: [2, 8],
		    9: [2, 8],
		    10: [2, 8],
		    11: [2, 8],
		    14: [2, 8],
		    15: [2, 8],
		    16: [2, 8],
		    5: [2, 8],
		    13: [2, 8],
		    18: [2, 8]
		}, {
		    13: [1, 34],
		    6: [1, 10],
		    7: [1, 11],
		    8: [1, 12],
		    9: [1, 13],
		    10: [1, 14],
		    11: [1, 15],
		    14: [1, 16],
		    15: [1, 17],
		    16: [1, 18]
		}, {
		    4: 35,
		    7: [1, 3],
		    12: [1, 4],
		    17: [1, 5],
		    19: [1, 6],
		    20: [1, 7],
		    21: [1, 8]
		}, {
		    6: [2, 2],
		    7: [2, 2],
		    8: [1, 12],
		    9: [1, 13],
		    10: [1, 14],
		    11: [1, 15],
		    14: [2, 2],
		    15: [2, 2],
		    16: [2, 2],
		    5: [2, 2],
		    13: [2, 2],
		    18: [2, 2]
		}, {
		    6: [2, 3],
		    7: [2, 3],
		    8: [1, 12],
		    9: [1, 13],
		    10: [1, 14],
		    11: [1, 15],
		    14: [2, 3],
		    15: [2, 3],
		    16: [2, 3],
		    5: [2, 3],
		    13: [2, 3],
		    18: [2, 3]
		}, {
		    6: [2, 4],
		    7: [2, 4],
		    8: [2, 4],
		    9: [2, 4],
		    10: [1, 14],
		    11: [2, 4],
		    14: [2, 4],
		    15: [2, 4],
		    16: [2, 4],
		    5: [2, 4],
		    13: [2, 4],
		    18: [2, 4]
		}, {
		    6: [2, 5],
		    7: [2, 5],
		    8: [2, 5],
		    9: [2, 5],
		    10: [1, 14],
		    11: [2, 5],
		    14: [2, 5],
		    15: [2, 5],
		    16: [2, 5],
		    5: [2, 5],
		    13: [2, 5],
		    18: [2, 5]
		}, {
		    6: [2, 6],
		    7: [2, 6],
		    8: [2, 6],
		    9: [2, 6],
		    10: [2, 6],
		    11: [2, 6],
		    14: [2, 6],
		    15: [2, 6],
		    16: [2, 6],
		    5: [2, 6],
		    13: [2, 6],
		    18: [2, 6]
		}, {
		    6: [2, 7],
		    7: [2, 7],
		    8: [2, 7],
		    9: [2, 7],
		    10: [1, 14],
		    11: [2, 7],
		    14: [2, 7],
		    15: [2, 7],
		    16: [2, 7],
		    5: [2, 7],
		    13: [2, 7],
		    18: [2, 7]
		}, {
		    6: [1, 10],
		    7: [1, 11],
		    8: [1, 12],
		    9: [1, 13],
		    10: [1, 14],
		    11: [1, 15],
		    14: [2, 10],
		    15: [2, 10],
		    16: [2, 10],
		    5: [2, 10],
		    13: [2, 10],
		    18: [2, 10]
		}, {
		    4: 36,
		    7: [1, 3],
		    12: [1, 4],
		    17: [1, 5],
		    19: [1, 6],
		    20: [1, 7],
		    21: [1, 8]
		}, {
		    6: [1, 10],
		    7: [1, 11],
		    8: [1, 12],
		    9: [1, 13],
		    10: [1, 14],
		    11: [1, 15],
		    14: [2, 11],
		    15: [2, 11],
		    16: [2, 11],
		    5: [2, 11],
		    13: [2, 11],
		    18: [2, 11]
		}, {
		    4: 37,
		    7: [1, 3],
		    12: [1, 4],
		    17: [1, 5],
		    19: [1, 6],
		    20: [1, 7],
		    21: [1, 8]
		}, {
		    4: 38,
		    7: [1, 3],
		    12: [1, 4],
		    17: [1, 5],
		    19: [1, 6],
		    20: [1, 7],
		    21: [1, 8]
		}, {
		    6: [1, 10],
		    7: [1, 11],
		    8: [1, 12],
		    9: [1, 13],
		    10: [1, 14],
		    11: [1, 15],
		    14: [1, 16],
		    15: [1, 17],
		    16: [2, 14],
		    5: [2, 14],
		    13: [2, 14],
		    18: [2, 14]
		}, {
		    5: [2, 9],
		    6: [2, 9],
		    7: [2, 9],
		    8: [2, 9],
		    9: [2, 9],
		    10: [2, 9],
		    11: [2, 9],
		    14: [2, 9],
		    15: [2, 9],
		    16: [2, 9],
		    13: [2, 9],
		    18: [2, 9]
		}, {
		    18: [1, 39],
		    6: [1, 10],
		    7: [1, 11],
		    8: [1, 12],
		    9: [1, 13],
		    10: [1, 14],
		    11: [1, 15],
		    14: [1, 16],
		    15: [1, 17],
		    16: [1, 18]
		}, {
		    6: [1, 10],
		    7: [1, 11],
		    8: [1, 12],
		    9: [1, 13],
		    10: [1, 14],
		    11: [1, 15],
		    14: [2, 12],
		    15: [2, 12],
		    16: [2, 12],
		    5: [2, 12],
		    13: [2, 12],
		    18: [2, 12]
		}, {
		    6: [1, 10],
		    7: [1, 11],
		    8: [1, 12],
		    9: [1, 13],
		    10: [1, 14],
		    11: [1, 15],
		    14: [2, 13],
		    15: [2, 13],
		    16: [2, 13],
		    5: [2, 13],
		    13: [2, 13],
		    18: [2, 13]
		}, {
		    6: [1, 10],
		    7: [1, 11],
		    8: [1, 12],
		    9: [1, 13],
		    10: [1, 14],
		    11: [1, 15],
		    14: [2, 15],
		    15: [2, 15],
		    16: [2, 15],
		    5: [2, 15],
		    13: [2, 15],
		    18: [2, 15]
		}, {
		    4: 40,
		    7: [1, 3],
		    12: [1, 4],
		    17: [1, 5],
		    19: [1, 6],
		    20: [1, 7],
		    21: [1, 8]
		}, {
		    18: [1, 41],
		    6: [1, 10],
		    7: [1, 11],
		    8: [1, 12],
		    9: [1, 13],
		    10: [1, 14],
		    11: [1, 15],
		    14: [1, 16],
		    15: [1, 17],
		    16: [1, 18]
		}, {
		    4: 42,
		    7: [1, 3],
		    12: [1, 4],
		    17: [1, 5],
		    19: [1, 6],
		    20: [1, 7],
		    21: [1, 8]
		}, {
		    13: [1, 43],
		    6: [1, 10],
		    7: [1, 11],
		    8: [1, 12],
		    9: [1, 13],
		    10: [1, 14],
		    11: [1, 15],
		    14: [1, 16],
		    15: [1, 17],
		    16: [1, 18]
		}, {
		    5: [2, 16],
		    6: [2, 16],
		    7: [2, 16],
		    8: [2, 16],
		    9: [2, 16],
		    10: [2, 16],
		    11: [2, 16],
		    14: [2, 16],
		    15: [2, 16],
		    16: [2, 16],
		    13: [2, 16],
		    18: [2, 16]
		}],
		defaultActions: {
		    9: [2, 1]
		},
		parseError: function parseError(str, hash) {
		    if (hash.recoverable) {
			this.trace(str)
		    } else {
			throw new Error(str)
		    }
		},
		parse: function parse(input) {
		    var self = this,
			stack = [0],
			vstack = [null],
			lstack = [],
			table = this.table,
			yytext = '',
			yylineno = 0,
			yyleng = 0,
			recovering = 0,
			TERROR = 2,
			EOF = 1;
		    this.lexer.setInput(input);
		    this.lexer.yy = this.yy;
		    this.yy.lexer = this.lexer;
		    this.yy.parser = this;
		    if (typeof this.lexer.yylloc == 'undefined') {
			this.lexer.yylloc = {};
		    }
		    var yyloc = this.lexer.yylloc;
		    lstack.push(yyloc);
		    var ranges = this.lexer.options && this.lexer.options.ranges;
		    if (typeof this.yy.parseError === 'function') {
			this.parseError = this.yy.parseError;
		    } else {
			this.parseError = Object.getPrototypeOf(this).parseError;
		    }

		    function popStack(n) {
			stack.length = stack.length - 2 * n;
			vstack.length = vstack.length - n;
			lstack.length = lstack.length - n;
		    }

		    function lex() {
			var token;
			token = self.lexer.lex() || EOF;
			if (typeof token !== 'number') {
			    token = self.symbols_[token] || token;
			}
			return token;
		    }
		    var symbol, preErrorSymbol, state, action, a, r, yyval = {},
			p, len, newState, expected;
		    while (true) {
			state = stack[stack.length - 1];
			if (this.defaultActions[state]) {
			    action = this.defaultActions[state];
			} else {
			    if (symbol === null || typeof symbol == 'undefined') {
				symbol = lex();
			    }
			    action = table[state] && table[state][symbol];
			}
			if (typeof action === 'undefined' || !action.length || !action[0]) {
			    var errStr = '';
			    expected = [];
			    for (p in table[state]) {
				if (this.terminals_[p] && p > TERROR) {
				    expected.push('\'' + this.terminals_[p] + '\'');
				}
			    }
			    if (this.lexer.showPosition) {
				errStr = 'Parse error on line ' + (yylineno + 1) + ':\n' + this.lexer.showPosition() + '\nExpecting ' + expected.join(', ') + ', got \'' + (this.terminals_[symbol] || symbol) + '\'';
			    } else {
				errStr = 'Parse error on line ' + (yylineno + 1) + ': Unexpected ' + (symbol == EOF ? 'end of input' : '\'' + (this.terminals_[symbol] || symbol) + '\'');
			    }
			    this.parseError(errStr, {
				text: this.lexer.match,
				token: this.terminals_[symbol] || symbol,
				line: this.lexer.yylineno,
				loc: yyloc,
				expected: expected
			    });
			}
			if (action[0] instanceof Array && action.length > 1) {
			    throw new Error('Parse Error: multiple actions possible at state: ' + state + ', token: ' + symbol);
			}
			switch (action[0]) {
			case 1:
			    stack.push(symbol);
			    vstack.push(this.lexer.yytext);
			    lstack.push(this.lexer.yylloc);
			    stack.push(action[1]);
			    symbol = null;
			    if (!preErrorSymbol) {
				yyleng = this.lexer.yyleng;
				yytext = this.lexer.yytext;
				yylineno = this.lexer.yylineno;
				yyloc = this.lexer.yylloc;
				if (recovering > 0) {
				    recovering--;
				}
			    } else {
				symbol = preErrorSymbol;
				preErrorSymbol = null;
			    }
			    break;
			case 2:
			    len = this.productions_[action[1]][1];
			    yyval.$ = vstack[vstack.length - len];
			    yyval._$ = {
				first_line: lstack[lstack.length - (len || 1)].first_line,
				last_line: lstack[lstack.length - 1].last_line,
				first_column: lstack[lstack.length - (len || 1)].first_column,
				last_column: lstack[lstack.length - 1].last_column
			    };
			    if (ranges) {
				yyval._$.range = [
				lstack[lstack.length - (len || 1)].range[0], lstack[lstack.length - 1].range[1]];
			    }
			    r = this.performAction.call(yyval, yytext, yyleng, yylineno, this.yy, action[1], vstack, lstack);
			    if (typeof r !== 'undefined') {
				return r;
			    }
			    if (len) {
				stack = stack.slice(0, -1 * len * 2);
				vstack = vstack.slice(0, -1 * len);
				lstack = lstack.slice(0, -1 * len);
			    }
			    stack.push(this.productions_[action[1]][0]);
			    vstack.push(yyval.$);
			    lstack.push(yyval._$);
			    newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
			    stack.push(newState);
			    break;
			case 3:
			    return true;
			}
		    }
		    return true;
		}
	    }; /* generated by jison-lex 0.2.0 */
	    var lexer = (function() {
		var lexer = {

		    EOF: 1,

		    parseError: function parseError(str, hash) {
			if (this.yy.parser) {
			    this.yy.parser.parseError(str, hash)
			} else {
			    throw new Error(str)
			}
		    },

		    // resets the lexer, sets new input
		    setInput: function(input) {
			this._input = input;
			this._more = this._backtrack = this.done = false;
			this.yylineno = this.yyleng = 0;
			this.yytext = this.matched = this.match = "";
			this.conditionStack = ["INITIAL"];
			this.yylloc = {
			    first_line: 1,
			    first_column: 0,
			    last_line: 1,
			    last_column: 0
			};
			if (this.options.ranges) {
			    this.yylloc.range = [0, 0]
			}
			this.offset = 0;
			return this
		    },

		    // consumes and returns one char from the input
		    input: function() {
			var ch = this._input[0];
			this.yytext += ch;
			this.yyleng++;
			this.offset++;
			this.match += ch;
			this.matched += ch;
			var lines = ch.match(/(?:\r\n?|\n).*/g);
			if (lines) {
			    this.yylineno++;
			    this.yylloc.last_line++
			} else {
			    this.yylloc.last_column++
			}
			if (this.options.ranges) {
			    this.yylloc.range[1]++
			}
			this._input = this._input.slice(1);
			return ch
		    },

		    // unshifts one char (or a string) into the input
		    unput: function(ch) {
			var len = ch.length;
			var lines = ch.split(/(?:\r\n?|\n)/g);
			this._input = ch + this._input;
			this.yytext = this.yytext.substr(0, this.yytext.length - len - 1);
			this.offset -= len;
			var oldLines = this.match.split(/(?:\r\n?|\n)/g);
			this.match = this.match.substr(0, this.match.length - 1);
			this.matched = this.matched.substr(0, this.matched.length - 1);
			if (lines.length - 1) {
			    this.yylineno -= lines.length - 1
			}
			var r = this.yylloc.range;
			this.yylloc = {
			    first_line: this.yylloc.first_line,
			    last_line: this.yylineno + 1,
			    first_column: this.yylloc.first_column,
			    last_column: lines ? (lines.length === oldLines.length ? this.yylloc.first_column : 0) + oldLines[oldLines.length - lines.length].length - lines[0].length : this.yylloc.first_column - len
			};
			if (this.options.ranges) {
			    this.yylloc.range = [r[0], r[0] + this.yyleng - len]
			}
			this.yyleng = this.yytext.length;
			return this
		    },

		    // When called from action, caches matched text and appends it on next action
		    more: function() {
			this._more = true;
			return this
		    },

		    // When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
		    reject: function() {
			if (this.options.backtrack_lexer) {
			    this._backtrack = true
			} else {
			    return this.parseError("Lexical error on line " + (this.yylineno + 1) + ". You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n" + this.showPosition(), {
				text: "",
				token: null,
				line: this.yylineno
			    })
			}
			return this
		    },

		    // retain first n characters of the match
		    less: function(n) {
			this.unput(this.match.slice(n))
		    },

		    // displays already matched input, i.e. for error messages
		    pastInput: function() {
			var past = this.matched.substr(0, this.matched.length - this.match.length);
			return (past.length > 20 ? "..." : "") + past.substr(-20).replace(/\n/g, "")
		    },

		    // displays upcoming input, i.e. for error messages
		    upcomingInput: function() {
			var next = this.match;
			if (next.length < 20) {
			    next += this._input.substr(0, 20 - next.length)
			}
			return (next.substr(0, 20) + (next.length > 20 ? "..." : "")).replace(/\n/g, "")
		    },

		    // displays the character position where the lexing error occurred, i.e. for error messages
		    showPosition: function() {
			var pre = this.pastInput();
			var c = new Array(pre.length + 1).join("-");
			return pre + this.upcomingInput() + "\n" + c + "^"
		    },

		    // test the lexed token: return FALSE when not a match, otherwise return token
		    test_match: function(match, indexed_rule) {
			var token, lines, backup;
			if (this.options.backtrack_lexer) {
			    backup = {
				yylineno: this.yylineno,
				yylloc: {
				    first_line: this.yylloc.first_line,
				    last_line: this.last_line,
				    first_column: this.yylloc.first_column,
				    last_column: this.yylloc.last_column
				},
				yytext: this.yytext,
				match: this.match,
				matches: this.matches,
				matched: this.matched,
				yyleng: this.yyleng,
				offset: this.offset,
				_more: this._more,
				_input: this._input,
				yy: this.yy,
				conditionStack: this.conditionStack.slice(0),
				done: this.done
			    };
			    if (this.options.ranges) {
				backup.yylloc.range = this.yylloc.range.slice(0)
			    }
			}
			lines = match[0].match(/(?:\r\n?|\n).*/g);
			if (lines) {
			    this.yylineno += lines.length
			}
			this.yylloc = {
			    first_line: this.yylloc.last_line,
			    last_line: this.yylineno + 1,
			    first_column: this.yylloc.last_column,
			    last_column: lines ? lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length : this.yylloc.last_column + match[0].length
			};
			this.yytext += match[0];
			this.match += match[0];
			this.matches = match;
			this.yyleng = this.yytext.length;
			if (this.options.ranges) {
			    this.yylloc.range = [this.offset, this.offset += this.yyleng]
			}
			this._more = false;
			this._backtrack = false;
			this._input = this._input.slice(match[0].length);
			this.matched += match[0];
			token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
			if (this.done && this._input) {
			    this.done = false
			}
			if (token) {
			    if (this.options.backtrack_lexer) {
				delete backup
			    }
			    return token
			} else if (this._backtrack) {
			    for (var k in backup) {
				this[k] = backup[k]
			    }
			    return false
			}
			if (this.options.backtrack_lexer) {
			    delete backup
			}
			return false
		    },

		    // return next match in input
		    next: function() {
			if (this.done) {
			    return this.EOF
			}
			if (!this._input) {
			    this.done = true
			}
			var token, match, tempMatch, index;
			if (!this._more) {
			    this.yytext = "";
			    this.match = ""
			}
			var rules = this._currentRules();
			for (var i = 0; i < rules.length; i++) {
			    tempMatch = this._input.match(this.rules[rules[i]]);
			    if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
				match = tempMatch;
				index = i;
				if (this.options.backtrack_lexer) {
				    token = this.test_match(tempMatch, rules[i]);
				    if (token !== false) {
					return token
				    } else if (this._backtrack) {
					match = false;
					continue
				    } else {
					return false
				    }
				} else if (!this.options.flex) {
				    break
				}
			    }
			}
			if (match) {
			    token = this.test_match(match, rules[index]);
			    if (token !== false) {
				return token
			    }
			    return false
			}
			if (this._input === "") {
			    return this.EOF
			} else {
			    return this.parseError("Lexical error on line " + (this.yylineno + 1) + ". Unrecognized text.\n" + this.showPosition(), {
				text: "",
				token: null,
				line: this.yylineno
			    })
			}
		    },

		    // return next match that has a token
		    lex: function lex() {
			var r = this.next();
			if (r) {
			    return r
			} else {
			    return this.lex()
			}
		    },

		    // activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
		    begin: function begin(condition) {
			this.conditionStack.push(condition)
		    },

		    // pop the previously active lexer condition state off the condition stack
		    popState: function popState() {
			var n = this.conditionStack.length - 1;
			if (n > 0) {
			    return this.conditionStack.pop()
			} else {
			    return this.conditionStack[0]
			}
		    },

		    // produce the lexer rule set which is active for the currently active lexer condition state
		    _currentRules: function _currentRules() {
			if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
			    return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules
			} else {
			    return this.conditions["INITIAL"].rules
			}
		    },

		    // return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
		    topState: function topState(n) {
			n = this.conditionStack.length - 1 - Math.abs(n || 0);
			if (n >= 0) {
			    return this.conditionStack[n]
			} else {
			    return "INITIAL"
			}
		    },

		    // alias for begin(condition)
		    pushState: function pushState(condition) {
			this.begin(condition)
		    },

		    // return the number of states currently on the stack
		    stateStackSize: function stateStackSize() {
			return this.conditionStack.length
		    },
		    options: {},
		    performAction: function anonymous(yy, yy_, $avoiding_name_collisions, YY_START) {

			var YYSTATE = YY_START;
			switch ($avoiding_name_collisions) {
			case 0:
			    /* skip whitespace */
			    break;
			case 1:
			    return 19
			    break;
			case 2:
			    return 8
			    break;
			case 3:
			    return 9
			    break;
			case 4:
			    return 7
			    break;
			case 5:
			    return 6
			    break;
			case 6:
			    return 10
			    break;
			case 7:
			    return 11
			    break;
			case 8:
			    return 12
			    break;
			case 9:
			    return 13
			    break;
			case 10:
			    return 18
			    break;
			case 11:
			    return 14
			    break;
			case 12:
			    return 15
			    break;
			case 13:
			    return 16
			    break;
			case 14:
			    return 21
			    break;
			case 15:
			    return 20
			    break;
			case 16:
			    return 17
			    break;
			case 17:
			    return 5
			    break;
			case 18:
			    return 'INVALID'
			    break;
			}
		    },
		    rules: [/^(?:\s+)/, /^(?:[0-9]+(\.[0-9]+)?\b)/, /^(?:\*)/, /^(?:\/)/, /^(?:-)/, /^(?:\+)/, /^(?:\^)/, /^(?:MOD\b)/, /^(?:\()/, /^(?:\))/, /^(?:,)/, /^(?:>)/, /^(?:<)/, /^(?:=)/, /^(?:PI\b)/, /^(?:E\b)/, /^(?:IF\b)/, /^(?:$)/, /^(?:.)/],
		    conditions: {
			"INITIAL": {
			    "rules": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
			    "inclusive": true
			}
		    }
		};
		return lexer;
	    })();
	    parser.lexer = lexer;

	    function Parser() {
		this.yy = {};
	    }
	    Parser.prototype = parser;
	    parser.Parser = Parser;
	    return new Parser;
	})(),
	/** end of jison parser */

	/** Number formatter */
	formatter: {
	    _escapeRegex: function(str) {
		return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
	    },
	    _decimal: function(number, decimal) {
		var $number = parseFloat(number);
		return (isNaN($number)) ? false : $number.toFixed(decimal);
	    },
	    _percent: function(number, decimal) {
		var $number = parseFloat(number);
		return (isNaN($number)) ? false : ($number * 100).toFixed(decimal);
	    },
	    /** number format, courtesy of phpjs.org with little modification
	     *  http://phpjs.org/functions/number_format:481
	     */
	    _number: function(number, decimals, decimalSeparator, thousandSeparator) {
		var number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
		var n = !isFinite(+number) ? 0 : +number,
		    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
		    sep = (typeof thousandSeparator === 'undefined') ? ',' : thousandSeparator,
		    dec = (typeof decimalSeparator === 'undefined') ? '.' : decimalSeparator,
		    s = '',
		    toFixedFix = function(n, prec) {
			var k = Math.pow(10, prec);
			return '' + Math.round(n * k) / k;
		    };
		// Fix for IE parseFloat(0.55).toFixed(0) = 0;
		s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
		if (s[0].length > 3) {
		    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
		}
		if ((s[1] || '').length < prec) {
		    s[1] = s[1] || '';
		    s[1] += new Array(prec - s[1].length + 1).join('0');
		}
		return s.join(dec);
	    },
	    getNumber: function(formattedNumber, options) {
		var reNum = new RegExp(this._escapeRegex(options.digitsep), 'g');
		var reDec = new RegExp(this._escapeRegex(options.decsep), 'g');
		//var reSuf   = new RegExp(this._escapeRegex(options.suffix), 'g');
		//var rePref  = new RegExp(this._escapeRegex(options.prefix), 'g');
		var $number = formattedNumber.substring(options.prefix.length); //remove prefix
		$number = $number.substring(options.suffix * -1); //remove suffix
		$number = $number.replace(reNum, ''); //remove thousand separator
		$number = $number.replace(reDec, '.'); //change decimal delimiter to default '.'
		$number = parseFloat($number);
		if (isNaN($number)) {
		    return formattedNumber;
		} else {
		    return (options.format.toLowerCase() == 'percent') ? $number / 100 : $number;
		}
	    },
	    formatNumber: function(number, $format) {
		if ((number + '').trim() == '' || isNaN(number)) {
		    return '';
		}
		switch ($format.format.toLowerCase()) {
		case 'percent':
		    var $val = this._percent(number, $format.decimal);
		    break;
		case 'currency':
		case 'number':
		    var $val = this._number(parseFloat(number), $format.decimal, $format.decsep, $format.digitsep);
		    break;
		case 'decimal':
		default:
		    var $val = this._decimal(number, $format.decimal);
		    break;
		}
		return (!$val) ? number : $format.prefix + $val + $format.suffix;
	    },
	    parseFormat: function(str) {
		if (typeof(str) != 'undefined') {
		    if (str.trim() != '') {
			var $keyval = new Array;
			var $pieces = str.split(';');
			var $index = 0;
			//console.log($pieces);
			$.each($pieces, function($k, $v) {
			    var $kv = $v.split(':');
			    $keyval[$index] = '"' + $kv[0] + '":"' + $kv[1] + '"';
			    $index++;
			});
			var $format = $.parseJSON('{' + $keyval.join(',') + '}');
			//console.log($format);
		    }
		} else {
		    var $format = {}
		}

		var $defFormat = $.parseJSON(JSON.stringify(defaultFormat));
		$format = $.extend($defFormat, $format);
		if ($format.decsep == $format.digitsep) {
		    return false;
		}
		return $format;
	    }
	}
    }

    /** calculation table for cache*/
    var matrix = {
	update: function($key) {
	    $.each(matrix.data, function($dataKey, $dataObj) {
		if (matrix.data[$dataKey].dependency.length == 0) {
		    matrix.data[$dataKey].updated = true;
		} else {
		    matrix.data[$dataKey].updated = false;
		}
	    });
	    //for each element with formula in it, process the formula
	    $.each(matrix.data, function($dataKey, $dataObj) {
		if (typeof($dataObj.formula) != 'undefined') {
		    matrix.calculate($dataKey);
		}
	    });
	},
	/** calculate single matrix data member, include it's dependencies */
	calculate: function($key) {
	    if (matrix.data[$key].updated == false) {
		if (matrix.data[$key].dependency.length != 0) {
		    $.each(matrix.data[$key].dependency, function($dkey, $dval) {
			if (!matrix.data[$dval].updated) {
			    matrix.calculate($dval);
			}
		    });
		}

		//replace the formula with the value
		if (typeof(matrix.data[$key].formula) != 'undefined') {
		    var $replaceVal = {};
		    $.each(matrix.data[$key].dependency, function($k, $v) {
			$replaceVal['$' + $v] = matrix.value[$v];
		    });
		    //console.log($replaceVal);
		    if (matrix.data[$key].formula.trim() != '') {
			var $equation = matrix.data[$key].formula.replace(/\$\w+/g, function($key) {
			    return $replaceVal[$key] || '0';
			});

			//console.log('formula for '+$key+': '+matrix.data[$key].formula);
			//console.log('parsed formula :' + $equation);

			//if all value matched, execute the formula
			if ($equation.indexOf('$') < 0) {
			    $result = utility.parser.parse($equation);
			    //console.log('equation result: '+matrix.data[$key].value);
			    matrix.data[$key].value = isNaN($result) ? 0 : $result;
			    matrix.value[$key] = isNaN($result) ? '' : matrix.data[$key].value;
			}
		    }
		}
		//console.log('cell '+$key+' updated!');
		//console.log($dataObj);
	    }
	    matrix.data[$key].updated = true;
	    matrix.apply($key);

	},
	apply: function($key) {
	    if (typeof($key) == 'undefined') {
		$.each(matrix.value, function($index, $val) {
		    $key = $index.replace(/\$/g, '');

		    if ($val < 0 && matrix.data[$key].format.absolute != false) {
			$('#' + $key).addClass('absolute');
			$('#' + $key).val(utility.formatter.formatNumber(Math.abs(matrix.value[$key]), matrix.data[$key].format));
		    } else {
			$('#' + $key).removeClass('absolute');
			$('#' + $key).val(utility.formatter.formatNumber(matrix.value[$key], matrix.data[$key].format));
		    }
		});
	    } else {
		if (matrix.value[$key] < 0 && matrix.data[$key].format.absolute != false) {
		    $('#' + $key).addClass('absolute');
		    $('#' + $key).val(utility.formatter.formatNumber(Math.abs(matrix.value[$key]), matrix.data[$key].format));
		} else {
		    $('#' + $key).removeClass('absolute');
		    $('#' + $key).val(utility.formatter.formatNumber(matrix.value[$key], matrix.data[$key].format));
		}
	    }
	},
	data: {},
	//detail data attribute of each cell
	value: {} //native numberic value of each cell
    };

    $.fn.calx = function(action, options) {
	return this.each(function() {
	    var $form = $(this);
	    //scan for input type=text
	    $form.find('input, select').each(function() {
		var $input = $(this);
		var $formula = $input.attr('data-formula');
		var $format = $input.attr('data-format');
		var $format = utility.formatter.parseFormat($format);
		var $id = $input.attr('id');
		var $value = $input.val();
		var $dependency = [];

		if (!$format) {
		    $.error("Digit separator and decimal separator should be different charracter, found at #" + $id);
		}

		//add class dependency based on formula
		if ($formula) {
		    $input.attr('readonly', true);
		    var $placeholder = /\$\w+/g;
		    while (match = $placeholder.exec($formula)) {
			var $key = match[0].replace('$', '');
			if ($dependency.indexOf($key) < 0) {
			    $dependency.push($key);
			}
		    }
		    $input.addClass('readonly');
		} else {
		    $input.addClass('writeable');
		}

		var $matrixVal = $value.replace($format.digitsep, '');
		$matrixVal = $matrixVal.replace($format.decsep, '.');
		if ($format.format.toLowerCase() == 'percent') {
		    $matrixVal = parseFloat($matrixVal) / 100;
		} else {
		    $matrixVal = parseFloat($matrixVal)
		}
		//console.log($matrixVal);
		$matrixVal = (isNaN($matrixVal)) ? utility.formatter.getNumber($value, $format) : $matrixVal;
		//console.log($matrixVal);

		//calculate actual value based on data-format, place it on matrix.value
		matrix.value[$id] = isNaN($matrixVal) ? '' : $matrixVal;
		matrix.data[$id] = {
		    'updated': false,
		    'value': $value,
		    'id': $id,
		    'formula': $formula,
		    'format': $format,
		    'dependency': $dependency
		}
	    });
	    //console.log(matrix);


	    //later change to options.event
	    var $input_rw = $form.find('input:not([readonly])'); //the writeable input
	    $input_rw.bind('blur', function() {
		var $input = $(this);
		var $id = $input.attr('id');
		var $nativeVal = $input.val();
		var $intVal = isNaN(parseFloat($nativeVal)) ? 0 : parseFloat($nativeVal);
		$intVal = (matrix.data[$id].format.format == 'percent') ? $intVal / 100 : $intVal;
		var $formatVal = utility.formatter.formatNumber($intVal, matrix.data[$id].format);

		//console.log($nativeVal+' => '+$intVal+' => '+$formatVal);
		if ($intVal != matrix.value[$id]) {
		    matrix.value[$id] = $intVal;
		    matrix.update();
		    //console.log(matrix);
		}
		if ($nativeVal.trim() != '') {
		    $input.val($formatVal);
		}
	    });

	    $input_rw.bind('focus', function() {
		var $input = $(this);
		var $id = $input.attr('id');
		//var $nativeVal  = $input.val();
		//var $intVal     = utility.formatter.getNumber($nativeVal,matrix.data[$id].format);

		//console.log($intVal);
		if (matrix.data[$id].format.format == 'percent' && matrix.value[$id] != '') {
		    $input.val(matrix.value[$id] * 100);
		    //    $input.val($intVal*100);
		} else {
		    $input.val(matrix.value[$id]);
		    //    $input.val($intVal);
		}

	    });

	    //console.log(matrix);
	    matrix.apply();
	    //console.log(matrix);
	});
    }

})(jQuery)