/* description: Parses end executes mathematical expressions. */

/* lexical grammar */
%lex
%%

\s+                   /* skip whitespace */
[0-9]+("."[0-9]+)?\b  return 'NUMBER'
"*"                   return '*'
"/"                   return '/'
"-"                   return '-'
"+"                   return '+'
"^"                   return '^'
"MOD"                 return 'MOD'
"("                   return '('
")"                   return ')'
","                   return ','
">"                   return '>'
"<"                   return '<'
"="                   return '='
"PI"                  return 'PI'
"E"                   return 'E'
"IF"                  return 'IF'
<<EOF>>               return 'EOF'
.                     return 'INVALID'

/lex

/* operator associations and precedence */

%left ',' '='
%left '<=' '>=' '<>' 
%left '>' '<'
%left '+' '-'
%left '*' '/' 'MOD'
%left '^'
%left UMINUS IF

%start expressions

%% /* language grammar */

expressions
    : e EOF
        {return $1;}
    ;

e
    : e '+' e
        {$$ = $1+$3;}
    | e '-' e
        {$$ = $1-$3;}
    | e '*' e
        {$$ = $1*$3;}
    | e '/' e
        {$$ = $1/$3;}
    | e '^' e
        {$$ = Math.pow($1, $3);}
    | e 'MOD' e
        {$$ = $1%$3;}
    | '-' e %prec UMINUS
        {$$ = -$2;}
    | '(' e ')'
        {$$ = $2;}
    | e '>' e
        {$$ = $1 > $3}
    | e '<' e
        {$$ = $1 < $3}
    | e '=' e
        {$$ = $1 == $3}
    | e '<''>' e
        {$$ = $1 != $4}
    | 'IF' '(' e ',' e ',' e ')'
        {$$ = ($3) ? $5 : $7}
    | NUMBER
        {$$ = Number(yytext);}
    | E
        {$$ = Math.E;}
    | PI
        {$$ = Math.PI;}
    ;
