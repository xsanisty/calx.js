/**
 * update cell reference inside the sheet, detect removed and added cells
 */
sheet.prototype.update = function(){
    var cells = this.el.find('[data-cell],[data-formula],[data-format]'),
        sheet = this,
        $cell;

    /** detect and remove detached cells and its reference */
    for(var a in this.cells){
        if(this.cells[a].el && !$.contains(document, this.cells[a].el[0])){
            delete(this.cells[a]);
        }
    }

    /** add new cell reference */
    cells.each(function(){
        var cellAddr = $(this).attr('data-cell');

        if(cellAddr && typeof(sheet.cells[cellAddr]) != 'undefined'){
            $cell = new cell(sheet, this);
            sheet.registerCell($cell);
        }
    });

    /** rebuild the dependency tree */
    this.buildCellDependency();
};