import Sheet from "../Sheet"
import Workbook from "../Workbook"

export type SharedContext = {
    /**
     * The workbook as main context of the parser
     */
    workbook ?: Workbook,

    /**
     * Collection of sheets in the workbook
     */
    sheets : Record<string, Sheet>,

    /**
     * Current active sheet which the parser will refer to when parsing formula
     */
    activeSheet ?: Sheet,

    /**
     * Utility that can be used inside the parser
     */
    utility : object,

    /**
     * Default comparator for comparing cell and value
     */
    comparator ?: {
        equal : (a : any, b : any) => boolean,
        notEqual : (a : any, b : any) => boolean,
        lessThan : (a : any, b : any) => boolean,
        greaterThan : (a : any, b : any) => boolean,
        lessEqualThan : (a : any, b : any) => boolean,
        greaterEqualThan : (a : any, b : any) => boolean,
    }
}