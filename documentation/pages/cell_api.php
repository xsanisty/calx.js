<!-- Cell API -->
<a name="cell"></a><br><br>
<div class="row page-header" style="margin-top:0">
    <div class="col-md-12">
        <h3>
            Cell API
        </h3>
    </div>
</div>
<div class="row">
    <div class="col-md-12">
        <p>
            Cell object is created after sheet object is completely initialized, and is stored in the
            cells registry inside the sheet object. You can retreive this cell object using two methods,
            via calx api, and via sheet object
        </p>

        <p>
            <code>$(selector).calx('getCell', cellAddress)</code>
        </p>
        <p>or</p>
        <p>
            <code>sheet.getCell(cellAddress)</code>
        </p>
        <p>
            After cell object is retrieved, you can access all the method available in cell object
        </p>

        <h4 class="method-title">calculate</h4>
        <p><code>cell.calculate()</code></p>
        <p>
            Evaluate the formula of the current cell, and all it's dependant (all cells that depends on this cell)
        </p>

        <h4 class="method-title">evaluateFormula</h4>
        <p><code>cell.evaluateFormula()</code></p>
        <p>
            Calculate only formula of this cell, and return the value.
        </p>

        <h4 class="method-title">getAddress</h4>
        <p><code>cell.getAddress()</code></p>
        <p>
            Get the cell address of current cell object.
        </p>

        <h4 class="method-title">getFormat</h4>
        <p><code>cell.getFormat()</code></p>
        <p>
            Get the formatting rule.
        </p>

        <h4 class="method-title">getFormattedValue</h4>
        <p><code>cell.getFormattedValue()</code></p>
        <p>
            Get the formatted value
        </p>

        <h4 class="method-title">getFormula</h4>
        <p><code>cell.getFormula()</code></p>
        <p>
            Get the formula
        </p>

        <h4 class="method-title">getValue</h4>
        <p><code>cell.getValue()</code></p>
        <p>
            Get the raw value of the cell, if cell has formula defined, it will return the calculated value
        </p>

        <h4 class="method-title">renderComputedValue</h4>
        <p><code>cell.renderComputedValue()</code></p>
        <p>
            Render the computed value to the cell's element
        </p>

        <h4 class="method-title">setConditionalStyle</h4>
        <p><code>cell.setConditionalStyle(function(value, element){})</code></p>
        <p>
            Setup conditional styling for the cell element, it should be function with the cell value as first
            parameter, and jQuery object of the cell element as second parameter
        </p>
<pre><code>
cell.setConditionalStyle(function(cellValue, cellElement){
    if(cellValue < 0){
        cellElement.css('color', 'red');
    }else{
        cellElement.css('color', 'green');
    }
});
</code></pre>

        <h4 class="method-title">setFormat</h4>
        <p><codecellsetFormat(format)</code></p>
        <p>
            Set the formatting rule of the current cell.
        </p>
        <p>
            Please note that you must not set the format on the fly via <code>$(selector).attr('data-format', format)</code>
            since jQuery Calx will not notice the change.
        </p>

        <h4 class="method-title">setFormula</h4>
        <p><code>cell.setFormula(formula)</code></p>
        <p>
            Set the calculation formula of the current cell.
        </p>
        <p>
            Please note that you must not set the formula on the fly via <code>$(selector).attr('data-formula', formula)</code>
            since jQuery Calx will not notice the change.
        </p>

        <h4 class="method-title">setValue</h4>
        <p><code>cell.setValue(value)</code></p>
        <p>
            Set the value of the current cell.
        </p>
        <p>
            Please note that you must not set the value on the fly via <code>$(selector).val(value)</code>
            since jQuery Calx will not notice the change.<br>
            Cell with formula defined, will not affected by this change since it will always return the
            calculated value. <br>
            Cell with <code>data-format</code> caontains % like <code>0%</code>, <code>0.00 %</code>, will parse
            10 as 10% (0.1), 10% as 10%.

        </p>
    </div>
</div>