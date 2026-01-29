import { Lexer, CstParser, Rule, TokenType, ParserMethod, CstNode } from 'chevrotain';
import { allTokens, CalxTokens as token } from './Tokens';

const CalxLexer = new Lexer(allTokens);

class CalxParser extends CstParser {
    // Declare parser rules with type annotations
    public expression!: ParserMethod<unknown[], CstNode>;
    public arrayFormula!: ParserMethod<unknown[], CstNode>;
    public comparisonExpression!: ParserMethod<unknown[], CstNode>;
    public additionExpression!: ParserMethod<unknown[], CstNode>;
    public concatenationExpression!: ParserMethod<unknown[], CstNode>;
    public multiplicationExpression!: ParserMethod<unknown[], CstNode>;
    public exponentiationExpression!: ParserMethod<unknown[], CstNode>;
    public unaryExpression!: ParserMethod<unknown[], CstNode>;
    public atomicExpression!: ParserMethod<unknown[], CstNode>;
    public ifFunctionCall!: ParserMethod<unknown[], CstNode>;
    public functionCall!: ParserMethod<unknown[], CstNode>;
    public ifErrorFunctionCall!: ParserMethod<unknown[], CstNode>;
    public ifsFunctionCall!: ParserMethod<unknown[], CstNode>;
    public switchFunctionCall!: ParserMethod<unknown[], CstNode>;
    public arrayExpression!: ParserMethod<unknown[], CstNode>;
    public arrayRow!: ParserMethod<unknown[], CstNode>;

    cache: { comparisonExpression: boolean; atomicExpression: boolean; };

    constructor() {
        super(allTokens);

        this.cache = {
            comparisonExpression: false,
            atomicExpression: false
        };

        const $ = this;


        // Update the expression rule to start with comparison
        $.RULE("expression", () => {
            $.OR([
                { ALT: () => $.SUBRULE($.arrayFormula) },
                { ALT: () => $.SUBRULE($.comparisonExpression) }
            ]);
        });

        // Add array formula rule
        $.RULE("arrayFormula", () => {
            $.CONSUME(token.LCurly);
            $.OPTION(() => {
                $.CONSUME(token.Equal);
            });
            $.SUBRULE($.expression);
            $.MANY(() => {
                $.OR([
                    { ALT: () => $.CONSUME(token.Comma) },
                    { ALT: () => $.CONSUME(token.ArrayRowSep) }
                ]);
                $.SUBRULE2($.expression);
            });
            $.CONSUME(token.RCurly);
        });


        // Add new comparison expression rule
        $.RULE("comparisonExpression", () => {
            $.SUBRULE($.additionExpression, { LABEL: "lhs" });
            $.OPTION(() => {
                $.cache.comparisonExpression || ($.OR([
                    { ALT: () => $.CONSUME(token.GreaterThan) },
                    { ALT: () => $.CONSUME(token.LessThan) },
                    { ALT: () => $.CONSUME(token.GreaterThanEqual) },
                    { ALT: () => $.CONSUME(token.LessThanEqual) },
                    { ALT: () => $.CONSUME(token.Equal) },
                    { ALT: () => $.CONSUME(token.NotEqual) }
                ]));
                $.SUBRULE2($.additionExpression, { LABEL: "rhs" });
            });
        });

        $.RULE("additionExpression", () => {
            $.SUBRULE($.concatenationExpression, { LABEL: "lhs" });
            $.MANY(() => {
                $.OR([
                    { ALT: () => $.CONSUME(token.Plus) },
                    { ALT: () => $.CONSUME(token.Minus) }
                ]);
                $.SUBRULE2($.concatenationExpression, { LABEL: "rhs" });
            });
        });

        $.RULE("concatenationExpression", () => {
            $.SUBRULE($.multiplicationExpression, { LABEL: "lhs" });
            $.MANY(() => {
                $.CONSUME(token.Concat);
                $.SUBRULE2($.multiplicationExpression, { LABEL: "rhs" });
            });
        });

        $.RULE("multiplicationExpression", () => {
            $.SUBRULE($.exponentiationExpression, { LABEL: "lhs" });
            $.MANY(() => {
                $.OR([
                    { ALT: () => $.CONSUME(token.Mult) },
                    { ALT: () => $.CONSUME(token.Div) }
                ]);
                $.SUBRULE2($.exponentiationExpression, { LABEL: "rhs" });
            });
        });

        // Add new rule for exponentiationExpression
        $.RULE("exponentiationExpression", () => {
            $.SUBRULE($.unaryExpression, { LABEL: "lhs" });
            $.MANY(() => {
                $.CONSUME(token.Power);
                $.SUBRULE2($.unaryExpression, { LABEL: "rhs" });
            });
        });

        // Add a new rule for unary expressions
        $.RULE("unaryExpression", () => {
            $.OR([
                { ALT: () => {
                    $.CONSUME(token.Minus); // Match unary minus
                    $.SUBRULE($.unaryExpression); // Recursive unary expression
                }},
                { ALT: () => $.SUBRULE($.atomicExpression) }
            ]);
        });

        $.RULE("atomicExpression", () => {
            $.cache.atomicExpression || ($.OR([
                { ALT: () => $.CONSUME(token.NumberLiteral) },
                { ALT: () => $.CONSUME(token.StringLiteral) },
                { ALT: () => $.CONSUME(token.TrueKeyword) },    // Add keywords
                { ALT: () => $.CONSUME(token.FalseKeyword) },
                { ALT: () => $.CONSUME(token.NullKeyword) },
                { ALT: () => {
                    $.OPTION(() => {
                        $.CONSUME(token.SheetName);
                    });
                    $.OR1([
                        { ALT: () => $.CONSUME(token.Variable) },
                        { ALT: () => $.CONSUME(token.CellRef) },
                        { ALT: () => $.CONSUME(token.CellRange) },
                        { ALT: () => $.CONSUME(token.RowRange) },
                        { ALT: () => $.CONSUME(token.ColumnRange) }
                    ]);
                }},
                { ALT: () => $.SUBRULE($.ifFunctionCall) },  // Try IF function first
                { ALT: () => $.SUBRULE($.functionCall) },
                { ALT: () => $.CONSUME(token.ErrorConstant) },
                { ALT: () => $.SUBRULE($.ifErrorFunctionCall) },
                { ALT: () => $.SUBRULE($.ifsFunctionCall) },
                { ALT: () => $.SUBRULE($.switchFunctionCall) },
                { ALT: () => {
                    $.CONSUME(token.LParen);
                    $.SUBRULE($.expression);
                    $.CONSUME(token.RParen);
                }},
            ]));
        });

        // Update IF function rule to make false branch optional
        $.RULE("ifFunctionCall", () => {
            $.CONSUME(token.IfFunction);
            $.CONSUME(token.LParen);
            // Condition expression
            $.SUBRULE($.expression, { LABEL: "condition" });
            $.CONSUME1(token.Comma);
            // True branch
            $.SUBRULE2($.expression, { LABEL: "whenTrue" });
            // Optional false branch
            $.OPTION(() => {
                $.CONSUME2(token.Comma);
                $.SUBRULE3($.expression, { LABEL: "whenFalse" });
            });
            $.CONSUME(token.RParen);
        });

        // Add special rules for IFERROR
        $.RULE("ifErrorFunctionCall", () => {
            $.CONSUME(token.IfErrorFunction);
            $.CONSUME(token.LParen);
            $.SUBRULE($.expression, { LABEL: "value" });
            $.CONSUME1(token.Comma);
            $.SUBRULE2($.expression, { LABEL: "valueIfError" });
            $.CONSUME(token.RParen);
        });

        // Add rule for IFS function (multiple IF conditions)
        $.RULE("ifsFunctionCall", () => {
            $.CONSUME(token.IfsFunction);
            $.CONSUME(token.LParen);
            $.AT_LEAST_ONE(() => {
                $.SUBRULE($.expression, { LABEL: "condition" });
                $.CONSUME1(token.Comma);
                $.SUBRULE2($.expression, { LABEL: "value" });
                $.OPTION(() => $.CONSUME2(token.Comma));
            });
            $.CONSUME(token.RParen);
        });

        // Add rule for SWITCH
        $.RULE("switchFunctionCall", () => {
            $.CONSUME(token.SwitchFunction);
            $.CONSUME(token.LParen);
            $.SUBRULE($.expression, { LABEL: "expression" });
            $.CONSUME1(token.Comma);
            $.AT_LEAST_ONE(() => {
                $.SUBRULE2($.expression, { LABEL: "value" });
                $.CONSUME2(token.Comma);
                $.SUBRULE3($.expression, { LABEL: "result" });
                $.OPTION(() => $.CONSUME3(token.Comma));
            });
            // Optional default value
            $.OPTION2(() => {
                $.SUBRULE4($.expression, { LABEL: "default" });
            });
            $.CONSUME(token.RParen);
        });

        $.RULE("functionCall", () => {
            $.CONSUME(token.FunctionName);
            $.CONSUME(token.LParen);
            $.OPTION(() => {
                $.SUBRULE($.expression);
                $.MANY(() => {
                    $.CONSUME(token.Comma);
                    $.SUBRULE2($.expression);
                });
            });
            $.CONSUME(token.RParen);
        });

        // Add array expression support
        $.RULE("arrayExpression", () => {
            $.CONSUME(token.LParen);
            $.SUBRULE($.arrayRow);
            $.MANY(() => {
                $.CONSUME(token.ArrayRowSep);
                $.SUBRULE2($.arrayRow);
            });
            $.CONSUME(token.RParen);
        });

        $.RULE("arrayRow", () => {
            $.SUBRULE($.expression);
            $.MANY(() => {
                $.CONSUME(token.Comma);
                $.SUBRULE2($.expression);
            });
        });

        this.performSelfAnalysis();
    }

    parse(inputText: string) {
        console.log("Parsing input:", inputText);

        const lexResult = CalxLexer.tokenize(inputText);

        console.log("Lexer result:", lexResult.tokens);

        if (lexResult.errors.length > 0) {
            console.error(lexResult.errors);

            throw new Error("Lexer errors detected");
        }

        this.input = lexResult.tokens;
        const cst = this.expression();

        if (this.errors.length > 0) {
            console.error(this.errors);

            throw new Error("Parsing errors detected");
        }

        return cst;
    }
}

export { CalxLexer, CalxParser };