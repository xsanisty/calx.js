(function calculatorExample() {
    // ----------------- lexer -----------------
    const createToken = chevrotain.createToken;
    const Lexer = chevrotain.Lexer;
    const CstParser = chevrotain.CstParser;

    const Plus = createToken({ name: "Plus", pattern: /\+/ });
    const Minus = createToken({ name: "Minus", pattern: /-/ });
    const Mult = createToken({ name: "Mult", pattern: /\*/ });
    const Div = createToken({ name: "Div", pattern: /\// });
    const LParen = createToken({ name: "LParen", pattern: /\(/ });
    const RParen = createToken({ name: "RParen", pattern: /\)/ });
    const Comma = createToken({ name: "Comma", pattern: /,/ });

    const RowRange = createToken({
        name: "RowRange",
        pattern: /\$?\d+:\$?\d+/
    });

    const NumberLiteral = createToken({
        name: "NumberLiteral",
        pattern: /\d+(\.\d+)?/,
        longer_alt: RowRange  // Add RowRange as longer alternative
    });

    // Update Variable token to exclude sheet name
    const Variable = createToken({
        name: "Variable",
        pattern: /[A-Za-z_][A-Za-z0-9_]*/
    });

    const SheetName = createToken({
        name: "SheetName",
        pattern: /[A-Za-z_][A-Za-z0-9_]*!/
    });

    const CellRange = createToken({
        name: "CellRange",
        pattern: /\$?[A-Za-z]+\$?\d+:\$?[A-Za-z]+\$?\d+/
    });

    const CellRef = createToken({
        name: "CellRef",
        pattern: /\$?[A-Za-z]+\$?\d+/
    });

    const StringLiteral = createToken({
        name: "StringLiteral",
        pattern: /(["'])(?:(?!\1).)*\1/  // Matches either quote style and captures everything between matching quotes
    });

    const Concat = createToken({
        name: "Concat",
        pattern: /&/
    });

    const FunctionName = createToken({
        name: "FunctionName",
        pattern: /[A-Za-z]+(?=\()/i,  // Added 'i' flag for case insensitive
        longer_alt: CellRef  // In case the pattern matches a cell reference
    });

    const WhiteSpace = createToken({ name: "WhiteSpace", pattern: /\s+/, group: Lexer.SKIPPED });

    // Add new comparison operator tokens
    const GreaterThan = createToken({ name: "GreaterThan", pattern: />/ });
    const LessThan = createToken({ name: "LessThan", pattern: /</ });
    const GreaterThanEqual = createToken({ name: "GreaterThanEqual", pattern: />=/ });
    const LessThanEqual = createToken({ name: "LessThanEqual", pattern: /<=/ });
    const Equal = createToken({ name: "Equal", pattern: /=/ });
    const NotEqual = createToken({ name: "NotEqual", pattern: /<>/ });

    // Add special IF token before FunctionName
    const IfFunction = createToken({
        name: "IfFunction",
        pattern: /IF(?=\()/i,  // Added 'i' flag for case insensitive
        longer_alt: Variable
    });

    // Add reserved keywords tokens
    const TrueKeyword = createToken({
        name: "TrueKeyword",
        pattern: /TRUE/i,  // Added 'i' flag for case insensitive
        longer_alt: Variable
    });

    const FalseKeyword = createToken({
        name: "FalseKeyword",
        pattern: /FALSE/i,  // Added 'i' flag for case insensitive
        longer_alt: Variable
    });

    const NullKeyword = createToken({
        name: "NullKeyword",
        pattern: /NULL/i,  // Added 'i' flag for case insensitive
        longer_alt: Variable
    });

    // Add array operators
    const ArrayRowSep = createToken({ name: "ArrayRowSep", pattern: /;/ });
    const RangeIntersect = createToken({ name: "RangeIntersect", pattern: / +/ }); // one or more spaces

    // Add error constants
    const ErrorConstant = createToken({
        name: "ErrorConstant",
        pattern: /#(DIV\/0!|N\/A|NAME\?|NULL!|NUM!|REF!|VALUE!|#SPILL!)/
    });

    // Add special function tokens
    const IfErrorFunction = createToken({
        name: "IfErrorFunction",
        pattern: /IFERROR(?=\()/i,
        longer_alt: Variable
    });

    const IfsFunction = createToken({
        name: "IfsFunction",
        pattern: /IFS(?=\()/i,
        longer_alt: Variable
    });

    const SwitchFunction = createToken({
        name: "SwitchFunction",
        pattern: /SWITCH(?=\()/i,
        longer_alt: Variable
    });

    // Add curly brace tokens for array formulas
    const LCurly = createToken({ name: "LCurly", pattern: /{/ });
    const RCurly = createToken({ name: "RCurly", pattern: /}/ });

    // Add new tokens for full column/row ranges
    const ColumnRange = createToken({
        name: "ColumnRange",
        pattern: /\$?[A-Za-z]+:\$?[A-Za-z]+/
    });

    const Power = createToken({ name: "Power", pattern: /\*\*|\^/ });

    const allTokens = [
        WhiteSpace,
        // Comparison operators (order important)
        GreaterThanEqual, LessThanEqual, NotEqual,
        GreaterThan, LessThan, Equal,

        // Basic operators
        Plus, Minus, Concat,
        Power,  // Add Power token here
        Mult, Div,

        // Brackets and delimiters
        LParen, RParen, LCurly, RCurly,
        Comma, ArrayRowSep, // Single instance of ArrayRowSep

        // References and ranges (order important for matching)
        SheetName,      // Include SheetName token here
        ColumnRange,    // Try column range first
        RowRange,       // Then row range
        CellRange,      // Then cell range
        CellRef,        // Then cell reference
        RangeIntersect, // Then range intersection

        // Literals and constants (after ranges to avoid number conflicts)
        NumberLiteral, // Moved after RowRange
        StringLiteral,
        ErrorConstant,

        // Functions and keywords
        IfFunction, IfErrorFunction, IfsFunction, SwitchFunction,
        TrueKeyword, FalseKeyword, NullKeyword,
        FunctionName,

        // References and variables
        Variable
    ];

    const CalxLexer = new Lexer(allTokens);

    class CalxParser extends CstParser {
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
                $.CONSUME(LCurly);
                $.OPTION(() => {
                    $.CONSUME(Equal);
                });
                $.SUBRULE($.expression);
              	$.MANY(() => {
                    $.CONSUME(Comma);
                    $.SUBRULE2($.expression);
                });
                $.CONSUME(RCurly);
            });


            // Add new comparison expression rule
            $.RULE("comparisonExpression", () => {
                $.SUBRULE($.additionExpression, { LABEL: "lhs" });
                $.OPTION(() => {
                    $.cache.comparisonExpression || ($.OR([
                        { ALT: () => $.CONSUME(GreaterThan) },
                        { ALT: () => $.CONSUME(LessThan) },
                        { ALT: () => $.CONSUME(GreaterThanEqual) },
                        { ALT: () => $.CONSUME(LessThanEqual) },
                        { ALT: () => $.CONSUME(Equal) },
                        { ALT: () => $.CONSUME(NotEqual) }
                    ]));
                    $.SUBRULE2($.additionExpression, { LABEL: "rhs" });
                });
            });

            $.RULE("additionExpression", () => {
                $.SUBRULE($.concatenationExpression, { LABEL: "lhs" });
                $.MANY(() => {
                    $.OR([
                        { ALT: () => $.CONSUME(Plus) },
                        { ALT: () => $.CONSUME(Minus) }
                    ]);
                    $.SUBRULE2($.concatenationExpression, { LABEL: "rhs" });
                });
            });

            $.RULE("concatenationExpression", () => {
                $.SUBRULE($.multiplicationExpression, { LABEL: "lhs" });
                $.MANY(() => {
                    $.CONSUME(Concat);
                    $.SUBRULE2($.multiplicationExpression, { LABEL: "rhs" });
                });
            });

            $.RULE("multiplicationExpression", () => {
                $.SUBRULE($.exponentiationExpression, { LABEL: "lhs" });
                $.MANY(() => {
                    $.OR([
                        { ALT: () => $.CONSUME(Mult) },
                        { ALT: () => $.CONSUME(Div) }
                    ]);
                    $.SUBRULE2($.exponentiationExpression, { LABEL: "rhs" });
                });
            });

            // Add new rule for exponentiationExpression
            $.RULE("exponentiationExpression", () => {
                $.SUBRULE($.unaryExpression, { LABEL: "lhs" });
                $.MANY(() => {
                    $.CONSUME(Power);
                    $.SUBRULE2($.unaryExpression, { LABEL: "rhs" });
                });
            });

            // Add a new rule for unary expressions
            $.RULE("unaryExpression", () => {
                $.OR([
                    { ALT: () => {
                        $.CONSUME(Minus); // Match unary minus
                        $.SUBRULE($.unaryExpression); // Recursive unary expression
                    }},
                    { ALT: () => $.SUBRULE($.atomicExpression) }
                ]);
            });

            $.RULE("atomicExpression", () => {
                $.cache.atomicExpression || ($.OR([
                    { ALT: () => $.CONSUME(NumberLiteral) },
                    { ALT: () => $.CONSUME(StringLiteral) },
                    { ALT: () => $.CONSUME(TrueKeyword) },    // Add keywords
                    { ALT: () => $.CONSUME(FalseKeyword) },
                    { ALT: () => $.CONSUME(NullKeyword) },
                    { ALT: () => {
                        $.OPTION(() => {
                            $.CONSUME(SheetName);
                        });
                        $.OR1([
                            { ALT: () => $.CONSUME(Variable) },
                            { ALT: () => $.CONSUME(CellRef) },
                            { ALT: () => $.CONSUME(CellRange) },
                            { ALT: () => $.CONSUME(RowRange) },
                            { ALT: () => $.CONSUME(ColumnRange) }
                        ]);
                    }},
                    { ALT: () => $.SUBRULE($.ifFunctionCall) },  // Try IF function first
                    { ALT: () => $.SUBRULE($.functionCall) },
                    { ALT: () => $.CONSUME(ErrorConstant) },
                    { ALT: () => $.SUBRULE($.ifErrorFunctionCall) },
                    { ALT: () => $.SUBRULE($.ifsFunctionCall) },
                    { ALT: () => $.SUBRULE($.switchFunctionCall) },
                    { ALT: () => {
                        $.CONSUME(LParen);
                        $.SUBRULE($.expression);
                        $.CONSUME(RParen);
                    }},
                ]));
            });

            // Update IF function rule to make false branch optional
            $.RULE("ifFunctionCall", () => {
                $.CONSUME(IfFunction);
                $.CONSUME(LParen);
                // Condition expression
                $.SUBRULE($.expression, { LABEL: "condition" });
                $.CONSUME1(Comma);
                // True branch
                $.SUBRULE2($.expression, { LABEL: "whenTrue" });
                // Optional false branch
                $.OPTION(() => {
                    $.CONSUME2(Comma);
                    $.SUBRULE3($.expression, { LABEL: "whenFalse" });
                });
                $.CONSUME(RParen);
            });

            // Add special rules for IFERROR
            $.RULE("ifErrorFunctionCall", () => {
                $.CONSUME(IfErrorFunction);
                $.CONSUME(LParen);
                $.SUBRULE($.expression, { LABEL: "value" });
                $.CONSUME1(Comma);
                $.SUBRULE2($.expression, { LABEL: "valueIfError" });
                $.CONSUME(RParen);
            });

            // Add rule for IFS function (multiple IF conditions)
            $.RULE("ifsFunctionCall", () => {
                $.CONSUME(IfsFunction);
                $.CONSUME(LParen);
                $.AT_LEAST_ONE(() => {
                    $.SUBRULE($.expression, { LABEL: "condition" });
                    $.CONSUME1(Comma);
                    $.SUBRULE2($.expression, { LABEL: "value" });
                    $.OPTION(() => $.CONSUME2(Comma));
                });
                $.CONSUME(RParen);
            });

            // Add rule for SWITCH
            $.RULE("switchFunctionCall", () => {
                $.CONSUME(SwitchFunction);
                $.CONSUME(LParen);
                $.SUBRULE($.expression, { LABEL: "expression" });
                $.CONSUME1(Comma);
                $.AT_LEAST_ONE(() => {
                    $.SUBRULE2($.expression, { LABEL: "value" });
                    $.CONSUME2(Comma);
                    $.SUBRULE3($.expression, { LABEL: "result" });
                    $.OPTION(() => $.CONSUME3(Comma));
                });
                // Optional default value
                $.OPTION2(() => {
                    $.SUBRULE4($.expression, { LABEL: "default" });
                });
                $.CONSUME(RParen);
            });

            $.RULE("functionCall", () => {
                $.CONSUME(FunctionName);
                $.CONSUME(LParen);
                $.OPTION(() => {
                    $.SUBRULE($.expression);
                    $.MANY(() => {
                        $.CONSUME(Comma);
                        $.SUBRULE2($.expression);
                    });
                });
                $.CONSUME(RParen);
            });

            // Add array expression support
            $.RULE("arrayExpression", () => {
                $.CONSUME(LParen);
                $.SUBRULE($.arrayRow);
                $.MANY(() => {
                    $.CONSUME(ArrayRowSep);
                    $.SUBRULE2($.arrayRow);
                });
                $.CONSUME(RParen);
            });

            $.RULE("arrayRow", () => {
                $.SUBRULE($.expression);
                $.MANY(() => {
                    $.CONSUME(Comma);
                    $.SUBRULE2($.expression);
                });
            });

            this.performSelfAnalysis();
        }
    }

    return {
        lexer: CalxLexer,
        parser: CalxParser,
        defaultRule: "expression",
    };
}())
