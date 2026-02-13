describe('Excel Formula Parser', () => {
    const { lexer, parser } = require('../src/Calx/Parser/Chevrotain/chevrotain-parser-0.js');

    function parse(input) {
        const lexingResult = lexer.tokenize(input);
        parser.input = lexingResult.tokens;
        return parser.expression();
    }

    describe('Basic Operations', () => {
        test('Arithmetic', () => {
            expect(parse('1 + 2')).toBeDefined();
            expect(parse('1 - 2')).toBeDefined();
            expect(parse('1 * 2')).toBeDefined();
            expect(parse('1 / 2')).toBeDefined();
            expect(parse('1 + 2 * 3')).toBeDefined();
            expect(parse('(1 + 2) * 3')).toBeDefined();
            expect(parse('-1')).toBeDefined();
            expect(parse('-(1 + 2)')).toBeDefined();
        });

        test('String Operations', () => {
            expect(parse('"Hello"')).toBeDefined();
            expect(parse("'Hello'")).toBeDefined();
            expect(parse('"Hello" & " World"')).toBeDefined();
            expect(parse("'Hello' & ' World'")).toBeDefined();
        });

        test('Comparisons', () => {
            expect(parse('A1 > B1')).toBeDefined();
            expect(parse('A1 >= B1')).toBeDefined();
            expect(parse('A1 < B1')).toBeDefined();
            expect(parse('A1 <= B1')).toBeDefined();
            expect(parse('A1 = B1')).toBeDefined();
            expect(parse('A1 <> B1')).toBeDefined();
        });
    });

    describe('Cell References', () => {
        test('Basic References', () => {
            expect(parse('A1')).toBeDefined();
            expect(parse('$A$1')).toBeDefined();
            expect(parse('Sheet1!A1')).toBeDefined();
            expect(parse('Sheet1!$A$1')).toBeDefined();
        });

        test('Range References', () => {
            expect(parse('A1:B2')).toBeDefined();
            expect(parse('Sheet1!A1:B2')).toBeDefined();
            expect(parse('$A$1:$B$2')).toBeDefined();
            expect(parse('Sheet1!$A$1:$B$2')).toBeDefined();
        });

        test('Column Range References', () => {
            expect(parse('A:A')).toBeDefined();
            expect(parse('$A:$Z')).toBeDefined();
            expect(parse('Sheet1!A:B')).toBeDefined();
            expect(parse('Sheet1!$A:$B')).toBeDefined();
            expect(parse('SUM(A:A)')).toBeDefined();
            expect(parse('AVERAGE(B:C)')).toBeDefined();
        });

        test('Row Range References', () => {
            expect(parse('1:1')).toBeDefined();
            expect(parse('$1:$10')).toBeDefined();
            expect(parse('Sheet1!1:2')).toBeDefined();
            expect(parse('Sheet1!$1:$2')).toBeDefined();
            expect(parse('SUM(1:1)')).toBeDefined();
            expect(parse('AVERAGE(1:2)')).toBeDefined();
        });

        test('Mixed Range References', () => {
            expect(parse('SUM(A:A 1:1)')).toBeDefined(); // Intersection
            expect(parse('SUM(A1:B2,C:C,1:1)')).toBeDefined(); // Multiple ranges
            expect(parse('Sheet1!A:A Sheet1!1:1')).toBeDefined(); // Sheet qualified intersection
        });
    });

    describe('Functions', () => {
        test('Basic Functions', () => {
            expect(parse('SUM(1,2)')).toBeDefined();
            expect(parse('sum(1,2)')).toBeDefined(); // Case insensitive
            expect(parse('SUM(A1:B2)')).toBeDefined();
            expect(parse('AVERAGE(1,2,3)')).toBeDefined();
        });

        test('Nested Functions', () => {
            expect(parse('SUM(1,AVERAGE(2,3))')).toBeDefined();
            expect(parse('IF(SUM(A1:A10)>10,TRUE,FALSE)')).toBeDefined();
        });

        test('IF Variations', () => {
            expect(parse('IF(A1>0,1)')).toBeDefined(); // Optional false part
            expect(parse('IF(A1>0,1,2)')).toBeDefined();
            expect(parse('IF(AND(A1>0,B1<0),1,2)')).toBeDefined();
        });

        test('IFERROR Function', () => {
            expect(parse('IFERROR(A1/B1,0)')).toBeDefined();
            expect(parse('IFERROR(1/0,"Division by zero")')).toBeDefined();
        });

        test('IFS Function', () => {
            expect(parse('IFS(A1>0,"Positive",A1<0,"Negative",TRUE,"Zero")')).toBeDefined();
        });

        test('SWITCH Function', () => {
            expect(parse('SWITCH(A1,1,"One",2,"Two","Other")')).toBeDefined();
        });
    });

    describe('Constants', () => {
        test('Logical Constants', () => {
            expect(parse('TRUE')).toBeDefined();
            expect(parse('FALSE')).toBeDefined();
            expect(parse('true')).toBeDefined(); // Case insensitive
            expect(parse('false')).toBeDefined();
        });

        test('Error Constants', () => {
            expect(parse('#DIV/0!')).toBeDefined();
            expect(parse('#N/A')).toBeDefined();
            expect(parse('#NAME?')).toBeDefined();
            expect(parse('#NULL!')).toBeDefined();
            expect(parse('#NUM!')).toBeDefined();
            expect(parse('#REF!')).toBeDefined();
            expect(parse('#VALUE!')).toBeDefined();
        });

        test('NULL Constant', () => {
            expect(parse('NULL')).toBeDefined();
            expect(parse('null')).toBeDefined(); // Case insensitive
        });
    });

    describe('Array Formulas', () => {
        test('Basic Array Formulas', () => {
            expect(parse('{SUM(A1:B2)}')).toBeDefined();
            expect(parse('{=SUM(A1:B2)}')).toBeDefined();
        });

        test('Array Constants', () => {
            expect(parse('{1,2,3}')).toBeDefined();
            expect(parse('{1,2,3;4,5,6}')).toBeDefined();
            expect(parse('{(1,2,3;4,5,6)}')).toBeDefined();
        });

        test('Complex Array Formulas', () => {
            expect(parse('{=IF(A1:A10>0,A1:A10*2,A1:A10/2)}')).toBeDefined();
            expect(parse('{=MMULT(A1:B2,C1:D2)}')).toBeDefined();
        });
    });

    describe('Complex Expressions', () => {
        test('Mixed Operations', () => {
            expect(parse('IF(A1>0,SUM(B1:B10),AVERAGE(C1:C10))')).toBeDefined();
            expect(parse('(A1 + B1) * (C1 + D1)')).toBeDefined();
            expect(parse('IF(AND(A1>0,B1>0),A1+B1,A1*B1)')).toBeDefined();
        });

        test('String and Math Mixed', () => {
            expect(parse('"Total: " & SUM(A1:A10)')).toBeDefined();
            expect(parse('IF(A1>0,"Positive: " & A1,"Negative: " & ABS(A1))')).toBeDefined();
        });

        test('Named Ranges and Variables', () => {
            expect(parse('SUM(FirstQuarter)')).toBeDefined();
            expect(parse('Sales_2023 * 1.1')).toBeDefined();
            expect(parse('Sheet1!MyRange')).toBeDefined();
        });
    });
});
