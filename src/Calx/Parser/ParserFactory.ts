import { Parser } from "./Parser";
import { SharedContext } from "./SharedContext";

export default function createParser(context : SharedContext) : Parser {
    const parser = new Parser();

    parser.yy = context;

    return parser;
}