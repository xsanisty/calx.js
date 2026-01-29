export interface FormatterInterface {
    format(rawValue: any): string;
    parse?(input: string): any;
}
