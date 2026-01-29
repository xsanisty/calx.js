import { createToken, Lexer } from "chevrotain";

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
    pattern: /[A-Za-z_][A-Za-z0-9_-]*!/
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

export const allTokens = [
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

export const CalxTokens = {
    Plus, Minus, Mult, Div, LParen, RParen, Comma,
    RowRange, NumberLiteral, Variable, SheetName,
    CellRange, CellRef, StringLiteral, Concat,
    FunctionName, WhiteSpace, GreaterThan, LessThan,
    GreaterThanEqual, LessThanEqual, Equal, NotEqual,
    IfFunction, TrueKeyword, FalseKeyword, NullKeyword,
    ArrayRowSep, RangeIntersect, ErrorConstant,
    IfErrorFunction, IfsFunction, SwitchFunction,
    LCurly, RCurly, ColumnRange, Power
};