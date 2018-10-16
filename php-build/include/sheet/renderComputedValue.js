sheet.fx.renderComputedValue = function(){
    //console.log('sheet[#'+this.elementId+'] : rendering all computed value to the element');

    //console.log(this.el.attr('id'));
    //console.log(this.affectedCell);
    for(var a = 0; a < this.affectedCell.length; a++){
        this.cells[this.affectedCell[a]].renderComputedValue();
    }
    this.clearAffectedCell();
};
