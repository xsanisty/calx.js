import { CalxInterpreter } from '../src/Calx/Parser/Chevrotain/Interpreter';
import { SharedContext } from '../src/Calx/Parser/SharedContext';
import * as Utility from '../src/Calx/Utility/Utility';

describe('Parser', () => {
    let interpreter: CalxInterpreter;
    let context: SharedContext;

    beforeEach(() => {
        context = new SharedContext({ utility: Utility });
        interpreter = new CalxInterpreter();
        interpreter.setContext(context);
    });

    describe('Arithmetic Operations', () => {
        test('should parse addition', () => {
            const result = interpreter.parse('=1+2');
            expect(result).toBe(3);
        });

        test('should parse subtraction', () => {
            const result = interpreter.parse('=5-3');
            expect(result).toBe(2);
        });

        test('should parse multiplication', () => {
            const result = interpreter.parse('=3*4');
            expect(result).toBe(12);
        });

        test('should parse division', () => {
            const result = interpreter.parse('=10/2');
            expect(result).toBe(5);
        });

        test('should parse exponentiation', () => {
            const result = interpreter.parse('=2^3');
            expect(result).toBe(8);
        });

        test('should handle division by zero', () => {
            const result = interpreter.parse('=1/0');
            expect(result).toContain('DIV');
        });
    });

    describe('Comparison Operations', () => {
        test('should parse equals', () => {
            expect(interpreter.parse('=1=1')).toBe(true);
            expect(interpreter.parse('=1=2')).toBe(false);
        });

        test('should parse not equals', () => {
            expect(interpreter.parse('=1<>2')).toBe(true);
            expect(interpreter.parse('=1<>1')).toBe(false);
        });

        test('should parse greater than', () => {
            expect(interpreter.parse('=5>3')).toBe(true);
            expect(interpreter.parse('=3>5')).toBe(false);
        });

        test('should parse less than', () => {
            expect(interpreter.parse('=3<5')).toBe(true);
            expect(interpreter.parse('=5<3')).toBe(false);
        });
    });

    describe('String Operations', () => {
        test('should parse string concatenation', () => {
            const result = interpreter.parse('="Hello"&" "&"World"');
            expect(result).toBe('Hello World');
        });

        test('should concatenate numbers as strings', () => {
            const result = interpreter.parse('=1&2');
            expect(result).toBe('12');
        });
    });

    describe('Functions', () => {
        test('should parse SUM function', () => {
            const result = interpreter.parse('=SUM(1,2,3,4,5)');
            expect(result).toBe(15);
        });

        test('should parse AVERAGE function', () => {
            const result = interpreter.parse('=AVERAGE(10,20,30)');
            expect(result).toBe(20);
        });

        test('should parse MAX function', () => {
            const result = interpreter.parse('=MAX(5,10,3,8)');
            expect(result).toBe(10);
        });

        test('should parse MIN function', () => {
            const result = interpreter.parse('=MIN(5,10,3,8)');
            expect(result).toBe(3);
        });

        test('should parse COUNT function', () => {
            const result = interpreter.parse('=COUNT(1,2,3,4,5)');
            expect(result).toBe(5);
        });

        test('should parse IF function', () => {
            expect(interpreter.parse('=IF(TRUE,10,20)')).toBe(10);
            expect(interpreter.parse('=IF(FALSE,10,20)')).toBe(20);
            expect(interpreter.parse('=IF(5>3,"Yes","No")')).toBe('Yes');
        });

        test('should parse AND function', () => {
            expect(interpreter.parse('=AND(TRUE,TRUE)')).toBe(true);
            expect(interpreter.parse('=AND(TRUE,FALSE)')).toBe(false);
        });

        test('should parse OR function', () => {
            expect(interpreter.parse('=OR(TRUE,FALSE)')).toBe(true);
            expect(interpreter.parse('=OR(FALSE,FALSE)')).toBe(false);
        });

        test('should parse CONCATENATE function', () => {
            const result = interpreter.parse('=CONCATENATE("Hello"," ","World")');
            expect(result).toBe('Hello World');
        });
    });

    describe('Complex Expressions', () => {
        test('should handle operator precedence', () => {
            const result = interpreter.parse('=1+2*3');
            expect(result).toBe(7);
        });

        test('should handle parentheses', () => {
            const result = interpreter.parse('=(1+2)*3');
            expect(result).toBe(9);
        });

        test('should handle nested functions', () => {
            const result = interpreter.parse('=SUM(1,MAX(5,10),3)');
            expect(result).toBe(14);
        });

        test('should handle unary minus', () => {
            const result = interpreter.parse('=-5');
            expect(result).toBe(-5);
        });
    });

    describe('Literals', () => {
        test('should parse number literals', () => {
            expect(interpreter.parse('=42')).toBe(42);
            expect(interpreter.parse('=3.14')).toBe(3.14);
        });

        test('should parse string literals', () => {
            expect(interpreter.parse('="Hello"')).toBe('Hello');
        });

        test('should parse boolean literals', () => {
            expect(interpreter.parse('=TRUE')).toBe(true);
            expect(interpreter.parse('=FALSE')).toBe(false);
        });
    });
});
