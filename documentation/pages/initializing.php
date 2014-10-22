<!-- initialize -->
<a name="initialize"></a><br><br>
<div class="row page-header" style="margin-top:0">
    <div class="col-md-12">
        <h3>
            Initializing
        </h3>
    </div>
</div>
<div class="row">
    <div class="col-md-12">
        <p>
            The very first step to enable jQuery Calx, is to load jQuery and the jQuery Calx itself
        </p>
<pre><code>&lt;script type="text/javascript" src="path/to/jquery-1.10.2.min.js"&gt;&lt;/script&gt;
&lt;script type="text/javascript" src="path/to/jquery-calx-2.0.0.min.js"&gt;&lt;/script&gt;
</code></pre>
        <p>
            Like any other jQuery plugin, it is easy to initialize jQuery Calx, you just need to prepare the element
            with configured <code>data-cell</code>, <code>data-formula</code>, or <code>data-format</code> attribute
            and call <code>$('selector').calx()</code> to enable jQuery Calx.
        </p>
        <p>
            We are using <code>data-cell</code> attribute to define the cell address,
            <code>data-formula</code> attribute to define the calculation formula, and <code>data-format</code> attribute
            to define formatting rule, and then, let jQuery Calx do the magic.
        </p>
        <p>
            Once jQuery Calx is initialized, it will respond to any changes occured in cell's element,
            and do the calculation based on the cell value and formula, let's see below example:
        </p>
        <div class="highlight">
        <pre>
&lt;form id="sheet"&gt;
    &lt;input type="text" data-cell="A1"&gt; &lt;br&gt;
    &lt;input type="text" data-cell="A2"&gt; &lt;br&gt;
    &lt;input type="text" data-cell="A3"&gt; &lt;br&gt;
    &lt;input type="text" data-cell="A4" data-formula="SUM(A1:A3)"&gt;
&lt;/form&gt;

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
            <code>form#sheet</code> where the jQuery Calx is initialized, and <code>cell</code> for all element inside the <code>form#sheet</code> that
            involved in calculation process, this mean all element that has <code>data-cell</code> and/or <code>data-formula</code> attribute.
        </p>
        <p>
            In case <code>data-formula</code> attribute present without <code>data-cell</code> attribute, jQuery Calx will assign reserved cell address
            prefixed with <code>CALX</code> and count the index incrementally, the resulting cell address will be like <code>CALX1</code>,
            <code>CALX2</code>,<code>CALX3</code>,<code>CALX4</code>
        </p>
    </div>
</div>