import Sheet from "../Sheet"

export type SharedContext = {
    sheets : Record<string, Sheet>,
    activeSheet ?: Sheet,
    utility : object 
}