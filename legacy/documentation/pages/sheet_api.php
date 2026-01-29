<!-- Sheet API -->
<a name="sheet"></a><br><br>
<div class="row page-header" style="margin-top:0">
    <div class="col-md-12">
        <h3>
            Sheet API
        </h3>
    </div>
</div>
<div class="row">
    <div class="col-md-12">
        <p>
            Each time jQuery Calx is initialized, sheet object is created for each selected element and
            stored in the sheet registry inside the calx object, you can retreive this sheet object using
            <code>getSheet</code> method.
        </p>
        <p>
            <pre><code>$('selector').calx('getSheet')</code></pre>
        </p>
        <p>
            Please note, that selector should retrieve single dom element to get correct sheet object. After sheet
            object is retreived, you can call all the method available.
        </p>

        <h4 class="method-title">calculate</h4>
        <p><code>sheet.calculate()</code></p>
        <p>
            Calculate the whole sheet and display the result in each cell.
        </p>

        <h4 class="method-title">checkCircularReference</h4>
        <p><code>sheet.checkCircularReference()</code></p>
        <p>
            Checking if circular reference exist in the sheet.
        </p>

        <h4 class="method-title">evaluate</h4>
        <p><code>sheet.evaluate(formula)</code></p>
        <p>
            Evaluating formula in the current sheet.
        </p>

        <h4 class="method-title">getCell</h4>
        <p><code>sheet.getCell(cellAddress)</code></p>
        <p>
            Get the cell object on the specified address.
        </p>

        <h4 class="method-title">getCellValue</h4>
        <p><code>sheet.getCellValue(cellAddress)</code></p>
        <p>
            get value of the cell on specified address
        </p>

        <h4 class="method-title">getCellRange</h4>
        <p><code>sheet.getCellRange(rangeStart, rangeStop)</code></p>
        <p>
            Get the cells object in the range, the result will be object looks like below
<pre><code>{
    A1: cellObject,
    A2: cellObject,
    ...
}</code></pre>
        </p>

        <h4 class="method-title">getCellRangeValue</h4>
        <p><code>sheet.getCellRangeValue(rangeStart, rangeStop)</code></p>
        <p>
            Get value of the cells in the range, the result will be object looks like below
<pre><code>{
    A1: 'some value',
    A2: 100
    ...
}</code></pre>
        </p>

        <h4 class="method-title">getVariable</h4>
        <p><code>sheet.getVariable(varName)</code></p>
        <p>
            Get the defined variable value.
        </p>

        <h4 class="method-title">refresh</h4>
        <p><code>sheet.refresh()</code></p>
        <p>
            Rebuild cell registry from the scratch.
        </p>

        <h4 class="method-title">reset</h4>
        <p><code>sheet.reset()</code></p>
        <p>
            Reset the form inside sheet element to its original state.
        </p>

        <h4 class="method-title">update</h4>
        <p><code>sheet.update()</code></p>
        <p>
            Update cell registry against any change in the sheet element.
        </p>
    </div>
</div>