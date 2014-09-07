/* description: Parses end evaluates mathematical expressions. */
/* lexical grammar */
%lex
%%
\s+                                 {/* skip whitespace */}
'"'("\\"["]|[^"])*'"'               {return 'STRING';}
"'"('\\'[']|[^'])*"'"               {return 'STRING';}
'#'[A-Za-z0-9_]+                    {return 'SHEET';}
[A-Za-z]{1,}[A-Za-z_0-9]+(?=[(])    {return 'FUNCTION';}
([0]?[1-9]|1[0-2])[:][0-5][0-9]([:][0-5][0-9])?[ ]?(AM|am|aM|Am|PM|pm|pM|Pm)
                                    {return 'TIME_AMPM';}
([0]?[0-9]|1[0-9]|2[0-3])[:][0-5][0-9]([:][0-5][0-9])?
                                    {return 'TIME_24';}
[A-Za-z0-9_]+'>'[A-Za-z0-9_]+
%{
    if (sheet.obj.type == 'cell') return 'SHEET';
    return 'VARIABLE';

%}
'$'[A-Za-z]+'$'[0-9]+
%{
    if (sheet.obj.type == 'cell') return 'FIXEDCELL';
    return 'VARIABLE';

%}
[A-Za-z]+[0-9]+
%{
    if (sheet.obj.type == 'cell') return 'CELL';
    return 'VARIABLE';

%}
[A-Za-z]+(?=[(])                    {return 'FUNCTION';}
[A-Za-z]{1,}[A-Za-z_0-9]+           {return 'VARIABLE';}
[A-Za-z_]+                          {return 'VARIABLE';}
[0-9]+                              {return 'NUMBER';}
"$"                                 {/* skip whitespace */}
" "                                 {return ' ';}
[.]                                 {return 'DECIMAL';}
":"                                 {return ':';}
";"                                 {return ';';}
","                                 {return ',';}
"*"                                 {return '*';}
"/"                                 {return '/';}
"-"                                 {return '-';}
"+"                                 {return '+';}
"^"                                 {return '^';}
"("                                 {return '(';}
")"                                 {return ')';}
"["                                 {return '[';}
"]"                                 {return ']';}
">"                                 {return '>';}
"<"                                 {return '<';}
"NOT"                               {return 'NOT';}
"PI"                                {return 'PI';}
"E"                                 {return 'E';}
'"'                                 {return '"';}
"'"                                 {return "'";}
"!"                                 {return "!";}
"="                                 {return '=';}
"%"                                 {return '%';}
[#]                                 {return '#';}
<<EOF>>                             {return 'EOF';}


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
            $$ = sheet.getVariable($1)
        }
    | TIME_AMPM
        {
            $$ = sheet.time($1);
        }
    | TIME_24
        {
            $$ = sheet.time($1);
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
            $$ = sheet.comparator.equal($1, $3);
        }
    | e '+' e
        {
            $$ = formula.math.SUM($1, $3);
        }
    | '(' e ')'
        {$$ = $2 * 1;}
    | '[' expseq ']'
        {
            $$ = $2;
        }
    | e '<' '=' e
        {
            $$ = sheet.comparator.lessEqual($1, $3);
        }
    | e '>' '=' e
        {
            $$ = sheet.comparator.greaterEqual($1, $3);
        }
    | e '<' '>' e
        {
            $$ = sheet.comparator.notEqual($1, $4);
        }
    | e NOT e
        {
            $$ = $1 != $3;
        }
    | e '>' e
        {
            $$ = sheet.comparator.greater($1, $3);
        }
    | e '<' e
        {
            $$ = sheet.comparator.less($1, $3);
        }
    | e '-' e
        {
            $$ = formula.math.SUBTRACT($1, $3);
        }
    | e '*' e
        {
            $$ = formula.math.MULTIPLY($1, $3);
        }
    | e '/' e
        {
            $$ = formula.math.DIVIDE($1, $3);
        }
    | e '^' e
        {
            $$ = formula.math.POWER($1, $3);
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
        {
            $$ = Math.E;
        }
    | FUNCTION '(' ')'
        {
            $$ = sheet.callFunction($1);
        }
    | FUNCTION '(' expseq ')'
        {
            $$ = sheet.callFunction($1, $3);
        }
    | cell
    | error
    | error error
;

cell :
    FIXEDCELL
        {
            $$ = sheet.getCellValue($1);
        }
    | FIXEDCELL ':' FIXEDCELL
        {
            $$ = sheet.getCellRangeValue($1, $3);
        }
    | CELL
        {
            $$ = sheet.getCellValue($1);
        }
    | CELL ':' CELL
        {
            $$ = sheet.getCellRangeValue($1, $3);
        }
    | SHEET '!' CELL
        {
            $$ = sheet.getRemoteCellValue($1, $3);
        }
    | SHEET '!' CELL ':' CELL
        {
            $$ = sheet.getRemoteCellRangeValue($1, $3, $5);
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
