sheet.fx.init = function(){
    //console.log('sheet[#'+this.elementId+'] : Initializing the sheet');
    var cells = this.el.find('[data-cell],[data-formula],[data-format]'),
        sheet = this,
        $cell;

    this.totalCell = cells.length;
    this.parser = parserFactory(this);
    this.el.attr('data-calx-identifier', this.identifier);

    cells.each(function(){
        $cell = new cell(sheet, this);
        sheet.registerCell($cell);
    });

    //sheet.buildCellDependency();
    sheet.attachEvent();
};