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
'$'?[A-Za-z]+'$'?[0-9]+             {return 'FIXEDCELL';}
[A-Za-z]+[0-9]                      {return 'CELL';}
[A-Za-z]+[:][A-Za-z]+               {return 'COLUMNRANGE';}
[0-9]+[:][0-9]+                     {return 'ROWRANGE';}
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
"<="                                {return "LTE";}
">="                                {return "GTE";}
"<>"                                {return "NE";}
">"                                 {return '>';}
"<"                                 {return '<';}
"NOT"                               {return 'NOT';}
"PI"                                {return 'PI';}
"E"                                 {return 'E';}
"TRUE"                              {return 'TRUE';}
"FALSE"                             {return 'FALSE';}
"NULL"                              {return 'NULL';}
"IF"                                {return 'IF';}
'"'                                 {return '"';}
"'"                                 {return "'";}
"!"                                 {return "!";}
"="                                 {return '=';}
"%"                                 {return '%';}
[#]                                 {return '#';}
[&]                                 {return '&';}
<<EOF>>                             {return 'EOF';}


/lex

/* operator associations and precedence (low-top, high- bottom) */
%left '=' '&'
%left 'NOT' '||'
%left '>' '<' 'LTE' 'GTE' 'NE'
%left '+' '-'
%left '*' '/'
%left '^'
%left '%'
%left 'PI' 'FALSE' 'NULL' 'TRUE'
%left 'IF'
%left UMINUS

%start expressions

%%

/* language grammar */

expressions
: e EOF
     {return $1;}
;

e :
    variableSequence
        {
            $$ = yy.workbook.getVariable($1)
        }
    | TRUE
        {
            $$ = true;
        }
    | FALSE
        {
            $$ = false;
        }
    | NULL
        {
            $$ = null;
        }
    | TIME_AMPM
        {
            $$ = yy.utility.time($1);
        }
    | TIME_24
        {
            $$ = yy.utility.time($1);
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
    | e '&' e
        {
            $$ = ''+$1+$3;
        }
    | e '=' e
        {
            $$ = yy.comparator.equal.call(yy, $1, $3);
        }
    | e '+' e
        {
            $$ = yy.formula.math.SUM.call(yy, $1, $3);
        }
    | '(' e ')'
        {$$ = $2 * 1;}
    | '[' expseq ']'
        {
            $$ = $2;
        }
    | e LTE e
        {
            $$ = yy.comparator.lessEqualThan.call(yy.activeSheet, $1, $3);
        }
    | e GTE e
        {
            $$ = yy.comparator.greaterEqualThan.call(yy.activeSheet, $1, $3);
        }
    | e NE e
        {
            $$ = yy.comparator.notEqual.call(yy.activeSheet, $1, $3);
        }
    | e NOT e
        {
            $$ = $1 != $3;
        }
    | e '>' e
        {
            $$ = yy.comparator.greaterThan.call(yy.activeSheet, $1, $3);
        }
    | e '<' e
        {
            $$ = yy.comparator.lessThan.call(yy.activeSheet, $1, $3);
        }
    | e '-' e
        {
            $$ = yy.formula.math.SUBTRACT.call(yy.activeSheet, $1, $3);
        }
    | e '*' e
        {
            $$ = yy.formula.math.MULTIPLY.call(yy.activeSheet, $1, $3);
        }
    | e '/' e
        {
            $$ = yy.formula.math.DIVIDE.call(yy.activeSheet, $1, $3);
        }
    | e '^' e
        {
            $$ = yy.formula.math.POWER.call(yy.activeSheet, $1, $3);
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
    | IF '(' expseq ',' expseq ',' expseq ')'
        {
            $$ = yy.activeSheet.eval($2)
                ? yy.activeSheet.eval($4)
                : yy.activeSheet.eval($6);
        }
    | FUNCTION '(' ')'
        {
            $$ = yy.workbook.callFunction($1);
        }
    | FUNCTION '(' expseq ')'
        {
            $$ = yy.workbook.callFunction($1, $3);
        }
    | cell
    | error
    | error error
;

cell :
    FIXEDCELL
        {
            $$ = yy.activeSheet.getCellValue($1);
        }
    | FIXEDCELL ':' FIXEDCELL
        {
            $$ = yy.activeSheet.getCellRangeValue($1, $3);
        }
    | CELL
        {
            $$ = yy.activeSheet.getCellValue($1);
        }
    | CELL ':' CELL
        {
            $$ = yy.activeSheet.getCellRangeValue($1, $3);
        }
    | SHEET '!' CELL
        {
            $$ = yy.activeSheet.getRemoteCellValue($1, $3);
        }
    | SHEET '!' CELL ':' CELL
        {
            $$ = yy.activeSheet.getRemoteCellRangeValue($1, $3, $5);
        }
    | COLUMNRANGE
        {
            $$ = yy.activeSheet.getColumnRange($1)
        }
    | SHEET '!' COLUMNRANGE
        {
            $$ = yy.activeSheet.getRemoteColumnRange($1, $3);
        }
    | ROWRANGE
        {
            $$ = yy.activeSheet.getRowRange($1)
        }
    | SHEET '!' ROWRANGE
        {
            $$ = yy.activeSheet.getRemoteRowRange($1, $3);
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
