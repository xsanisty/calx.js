sheet.prototype.init = function(){
    var cells = this.el.find('[data-cell],[data-formula],[data-format]'),
        sheet = this,
        $cell;

    this.parser = parserFactory(this);
    this.el.attr('data-calx-identifier', this.identifier);

    cells.each(function(){
        $cell = new cell(sheet, this);
        sheet.registerCell($cell);
    });

    sheet.attachEvent();
};