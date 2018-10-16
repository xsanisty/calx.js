/**
 * implement goal seeking
 * @param  {[type]} changing [description]
 * @param  {[type]} target   [description]
 * @return {[type]}          [description]
 */
sheet.fx.goalSeek = function(changing, target, expectedValue, incremental, repeat){
    var changingCell = this.cells[changing],
        targetCell   = this.cells[target],
        changingVal  = 0,
        result       = false,
        incremental  = typeof(incremental) == 'undefined' ? 0.1 : incremental,
        repeat       = typeof(repeat) == 'undefined' ? 5 : repeat;

        this.calculate();
        changingCell.setFormula('');

        var seek = function(){

        }
};
