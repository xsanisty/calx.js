<!-- Overview -->
<a name="overview"></a><br><br>
<div class="row page-header" style="margin-top: 0">
    <div class="col-md-12">
        <h3>
            jQuery Calx Overview
        </h3>
    </div>
</div>

<div class="row">
    <div class="col-md-12">

        <p>
            jQuery Calx is an excel calculation engine that wrapped as jQuery plugin,
            It is useful for building calculation in html page using excel formula.
            You can simply define the cell address in <code>data-cell</code> attribute,
            calculation formula in <code>data-formula</code> attribute, result formatting
            rule in <code>data-format</code> attribute, and let jQuery Calx do the magic.
        </p>
        <p>
            Once jQuery Calx is initialized, it will respond to any changes occured in cell's element,
            and do the calculation based on the cell value and formula, let's see below example:
        </p>
        <div class="highlight">
        <pre>
&lt;div id="sheet"&gt;
&lt;input type="text" data-cell="A1"&gt; &lt;br&gt;
&lt;input type="text" data-cell="A2"&gt; &lt;br&gt;
&lt;input type="text" data-cell="A3"&gt; &lt;br&gt;
&lt;input type="text" data-cell="A4" data-formula="SUM(A1:A3)"&gt;
&lt;/div&gt;

&lt;script&gt;
$('#sheet').calx();
&lt;/script&gt;
        </pre>
        </div>

        <p>
            In the above sample code snippet, <code>A4</code> will display whatever result of <code>SUM(A1:A3)</code>, any change occured
            in <code>A1</code>, <code>A2</code>, or <code>A3</code> will be represented in <code>A4</code> since <code>A4</code>
            depend on cell ranged from <code>A1</code> to <code>A3</code>.
        </p>
        <p>
            If you are familiar with any spreadsheet application like Microsoft Excel or LibreOffice,
            you will also get familiar with jQuery Calx. We use term <code>sheet</code> for wrapper element like
            <code>div#sheet</code> where the jQuery Calx is initialized, and <code>cell</code> for all element inside the <code>div#sheet</code> that
            involved in calculation process, this mean all element that has <code>data-cell</code> and/or <code>data-formula</code> attribute.
        </p>
        <p>
            In case <code>data-formula</code> attribute present without <code>data-cell</code> attribute, jQuery Calx will assign reserved cell address
            prefixed with <code>CALX</code> and counted incrementally, the cell address will look like <code>CALX1</code>,
            <code>CALX2</code>,<code>CALX3</code>,<code>CALX4</code>
        </p>
    </div>
</div>