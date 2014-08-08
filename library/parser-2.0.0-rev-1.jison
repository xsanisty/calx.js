/* description: Parses end evaluates mathematical expressions. */
/* lexical grammar */
%lex
%%
\s+									{/* skip whitespace */}
'"'("\\"["]|[^"])*'"'				{return 'STRING';}
"'"('\\'[']|[^'])*"'"				{return 'STRING';}
'#'[A-Za-z0-9_]+                {return 'SHEET';}
[A-Za-z]{1,}[A-Za-z_0-9]+(?=[(])    {return 'FUNCTION';}
([0]?[1-9]|1[0-2])[:][0-5][0-9]([:][0-5][0-9])?[ ]?(AM|am|aM|Am|PM|pm|pM|Pm)
									{return 'TIME_AMPM';}
([0]?[0-9]|1[0-9]|2[0-3])[:][0-5][0-9]([:][0-5][0-9])?
									{return 'TIME_24';}
[A-Za-z0-9_]+'>'[A-Za-z0-9_]+
%{
	if (engine.obj.type == 'cell') return 'SHEET';
	return 'VARIABLE';

%}
'$'[A-Za-z]+'$'[0-9]+
%{
	if (engine.obj.type == 'cell') return 'FIXEDCELL';
	return 'VARIABLE';

%}
[A-Za-z]+[0-9]+
%{
	if (engine.obj.type == 'cell') return 'CELL';
	return 'VARIABLE';

%}
[A-Za-z]+(?=[(])    				{return 'FUNCTION';}
[A-Za-z]{1,}[A-Za-z_0-9]+			{return 'VARIABLE';}
[A-Za-z_]+           				{return 'VARIABLE';}
[0-9]+          			  		{return 'NUMBER';}
"$"									{/* skip whitespace */}
" "									{return ' ';}
[.]									{return 'DECIMAL';}
":"									{return ':';}
";"									{return ';';}
","									{return ',';}
"*" 								{return '*';}
"/" 								{return '/';}
"-" 								{return '-';}
"+" 								{return '+';}
"^" 								{return '^';}
"(" 								{return '(';}
")" 								{return ')';}
">" 								{return '>';}
"<" 								{return '<';}
"NOT"								{return 'NOT';}
"PI"								{return 'PI';}
"E"									{return 'E';}
'"'									{return '"';}
"'"									{return "'";}
"!"									{return "!";}
"="									{return '=';}
"%"									{return '%';}
[#]									{return '#';}
<<EOF>>								{return 'EOF';}


/lex

/* operator associations and precedence (low-top, high- bottom) */
%left '='
%left '<=' '>=' '<>' 'NOT' '||'
%left '>' '<'
%left '+' '-'
%left '*' '/'
%left '^'
%left '%'
%left UMINUS

%start expressions

%% /* language grammar */

expressions
: e EOF
     {return $1;}
 ;

e :
	variableSequence
		{
			//$$ = yy.lexer.handler.variable.apply(yy.lexer.obj, $1);
			$$ = engine.handler.object($1);
		}
	| TIME_AMPM
		{
			//$$ = yy.lexer.handler.time.apply(yy.lexer.obj, [$1, true]);
			$$ = engine.handler.time($1);
		}
	| TIME_24
		{
			//$$ = yy.lexer.handler.time.apply(yy.lexer.obj, [$1]);
			$$ = engine.handler.time($1);
		}
	| number
		{
			$$ = $1 * 1;

			if (isNaN($$)) $$ = 0;
		}
	| STRING
		{
			$$ = $1.substring(1, $1.length - 1);
		}
	| e '=' e
		{
			$$ = engine.comparator.equal($1, $3);
			//$$ = yy.lexer.handler.callFunction.apply(yy.lexer.obj, ['EQUAL', [$1, $3]]);
		}
	| e '+' e
		{
			/*
			
			yy.lexer.obj.html.pop();
			yy.lexer.obj.html.pop();
			yy.lexer.obj.html.push(null);

			if (!isNaN($1) && !isNaN($3)) {
				$$ = ($1 * 1) + ($3 * 1);
			} else {
				$$ = yy.lexer.handler.concatenate.apply(yy.lexer.obj, [$1,$3]);
			}

			*/
		
			$$ = $1 + $3;

		}
	| '(' e ')'
		{$$ = $2 * 1;}
	| e '<' '=' e
		{
			//$$ = yy.lexer.handler.callFunction.apply(yy.lexer.obj, ['LESS_EQUAL', [$1, $3]]);
			$$ = engine.comparator.less_equal($1, $3);
		}
	| e '>' '=' e
		{
			//$$ = yy.lexer.handler.callFunction.apply(yy.lexer.obj, ['GREATER_EQUAL', [$1, $3]]);
			$$ = engine.comparator.greater_equal($1, $3);
		}
	| e '<' '>' e
		{
			$$ = ($1 * 1) != ($4 * 1);

			/*
			if (isNaN($$)) $$ = 0;

			yy.lexer.obj.html.pop();
			yy.lexer.obj.html.pop();
			yy.lexer.obj.html.push(null);
			*/
		}
	| e NOT e
		{
			$$ = $1 != $3;

			/*
			yy.lexer.obj.html.pop();
			yy.lexer.obj.html.pop();
			yy.lexer.obj.html.push(null);
			*/
		}
	| e '>' e
		{
			//$$ = yy.lexer.handler.callFunction.apply(yy.lexer.obj, ['GREATER', [$1, $3]]);
			$$ = engine.comparator.greater($1, $3);
		}
	| e '<' e
		{
			//$$ = yy.lexer.handler.callFunction.apply(yy.lexer.obj, ['LESS', [$1, $3]]);			
			$$ = engine.comparator.less($1, $3);
		}
	| e '-' e
		{
			$$ = ($1 * 1) - ($3 * 1);

			/*
			if (isNaN($$)) $$ = 0;

			yy.lexer.obj.html.pop();
			yy.lexer.obj.html.pop();
			yy.lexer.obj.html.push(null);
			*/
		}
	| e '*' e
		{
			$$ = ($1 * 1) * ($3 * 1);

			/*
			if (isNaN($$)) $$ = 0;

			yy.lexer.obj.html.pop();
			yy.lexer.obj.html.pop();
			yy.lexer.obj.html.push(null);
			*/
		}
	| e '/' e
		{
			$$ = ($1 * 1) / ($3 * 1);

			/*
			if (isNaN($$)) $$ = 0;

			yy.lexer.obj.html.pop();
			yy.lexer.obj.html.pop();
			yy.lexer.obj.html.push(null);
			*/
		}
	| e '^' e
		{
			$$ = Math.pow(($1 * 1), ($3 * 1));

			/*
			if (isNaN($$)) $$ = 0;

			yy.lexer.obj.html.pop();
			yy.lexer.obj.html.pop();
			yy.lexer.obj.html.push(null);
			*/

		}
	| '-' e
		{
			$$ = $2 * -1;
			if (isNaN($$)) $$ = 0;
		}
	| '+' e
		{
			$$ = $2 * 1;
			if (isNaN($$)) $$ = 0;
		}
	| E
		{/*$$ = Math.E;*/;}
	| FUNCTION '(' ')'
		{
			//$$ = yy.lexer.handler.callFunction.apply(yy.lexer.obj, [$1, '']);
			$$ = engine.handler.func($1);
		}
	| FUNCTION '(' expseq ')'
		{
			//$$ = yy.lexer.handler.callFunction.apply(yy.lexer.obj, [$1, $3]);
			$$ = engine.handler.func($1, $3);
		}
	| cell
	| error
	| error error
;

cell :
	FIXEDCELL
		{
			//$$ = yy.lexer.handler.fixedCellValue.apply(yy.lexer.obj, [$1]);
			$$ = engine.handler.cell($1);
		}
	| FIXEDCELL ':' FIXEDCELL
		{
			//$$ = yy.lexer.handler.fixedCellRangeValue.apply(yy.lexer.obj, [$1, $3]);
			$$ = engine.handler.cell_range($1, $3);
		}
	| CELL
		{
			//$$ = yy.lexer.handler.cellValue.apply(yy.lexer.obj, [$1]);
			$$ = engine.handler.cell($1);
		}
	| CELL ':' CELL
		{
			//$$ = yy.lexer.handler.cellRangeValue.apply(yy.lexer.obj, [$1, $3]);
			$$ = engine.handler.cell_range($1, $3);
		}
	| SHEET '>' CELL
		{
			//$$ = yy.lexer.handler.remoteCellValue.apply(yy.lexer.obj, [$1, $3]);
			$$ = engine.handler.cell_remote($1, $3);
		}
	| SHEET '>' CELL ':' CELL
		{
			//$$ = yy.lexer.handler.remoteCellRangeValue.apply(yy.lexer.obj, [$1, $3, $5]);
			$$ = engine.handler.cell_range_remote($1, $3, $5);
		}
;

expseq : 
	e
		{
			$$ = [$1];
		}
	| expseq ';' e
	    {
	        $1.push($3);
	        $$ = $1;

	    }
 	| expseq ',' e
		{
	        $1.push($3);
	        $$ = $1;

	    }
 ;


variableSequence :
	VARIABLE
		{
			$$ = [$1];
		}
	| variableSequence DECIMAL VARIABLE
		{
			$$ = ($.isArray($1) ? $1 : [$1]);
            $$.push($3);

		}
;

number :
	NUMBER
		{
			$$ = $1 * 1;
		}
	| NUMBER DECIMAL NUMBER
		{
			$$ = ($1 + '.' + $3) * 1;
		}
	| number '%'
		{
			$$ = $1 * 0.01;
		}
;

error :
	'#' VARIABLE '!' {
			$$ = $1 + $2 + $3;
      	}
    | VARIABLE '#' VARIABLE '!' {
			$$ = $2 + $3 + $4;
		}
;
