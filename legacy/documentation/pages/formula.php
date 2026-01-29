<!-- Formula -->
<a name="formula"></a><br><br>
<div class="row page-header" style="margin-top:0">
    <div class="col-md-12">
        <h3>
            Formula
        </h3>
    </div>
</div>
<div class="row">
    <div class="col-md-12">
        <p>
            Formula is used to define calculation rule, you can define the formula inside the
            <code>data-formula</code> attribute and write the formula like the you write it in excel. There are a lot excel
            compatible formula can be used from simple <code>SUM</code>, <code>HLOOKUP</code>, <code>VLOOKUP</code>
            to complex financial function like <code>NPV</code>, <code>IRR</code>, etc.
        </p>

        <p>
            Beside the excel compatible formula, there is also custom formula built in jQuery Calx, they are
            <code>SERVER()</code> and <code>GRAPH()</code>
        </p>

        <h4 class="method-title">SERVER()</h4>
        <p>
            This is special function to perform calculation in server side, you must define <code>ajaxUrl</code>
            parameter when configuring calx. The first parameter of this function is the formula name, and the rest is
            formula parameters
        </p>
        <p>
            When it invoked, jQuery Calx will send the request to the configured ajaxUrl and wait for the response
            before continue to the next formula execution.
        </p>
        <p>
            <pre><code>SERVER('SUM', A1:A3, B4)</code></pre>
        </p>
        <p>
            Formula above will send request looks like below
        </p>
        <p>
<pre><code>
[
    function    => 'SUM',
    params      => array(
        /* range from A1 to A3 */
        1   => array(
            A1  => 'value of A1',
            A2  => 'value of A2',
            A3  => 'value of A3'
        ),

        /* the value of B4 */
        2   => 'value of B4'
    )
]
</code></pre>
        </p>

        <p>
            <code>#ERROR_SEND_REQUEST!</code> will be returned when error occured.
        </p>

        <h4 class="method-title">GRAPH()</h4>
        <p>
            This is special function used to draw graphic or chart to represent the data in graphical way.
            You need to place the GRAPH formula in the div element with specified height and width.
        </p>

        <p>
            <pre><code>&lt;div data-formula="GRAPH(B2:G8, ['type=bar', 'label=B1:G1', 'legend=A2:A8'])"&gt;&lt;/div&gt;</code></pre>
        </p>

        <p>
            The first parameter is cell range contains data that need to be represented as graphic. <br>
            The second parameter is array containing some 'key=value' to define how the chart should be rendered.

            <ul type="square">
                <li>
                    type: <br>
                    type could be one of the following bar, line, pie, or doughnut, default is line.
                </li>
                <li>
                    label: <br>
                    label is used in bar or line type chart to draw label in the x-axis of the chart.
                    If none is given, the label will be incremental number starting from 0.
                </li>
                <li>
                    legend: <br>
                    legend is used to give explanation on the chart. If none is given, the legend will be blank
                </li>
                <li>
                    bar_orientation: <br>
                    if the chart type is bar, you can define bar_orientaion, it could be vertical or horizontal.
                    If none is given, the default will be vertical
                </li>
                <li>
                    show_x_axis: <br>
                    show_x_axis is used to control the appearance of x axis label, it could be true or false.
                    If none is given, default is true.
                </li>
                <li>
                    show_y_axis: <br>
                    show_y_axis is used to control the appearance of y axis label, it could be true or false.
                    If none is given, default is true.
                </li>
                <li>
                    reverse: <br>
                    revers is used to control the order of the data, it could be true or false.
                    If none is given, default is false.
                </li>
                <!--<li>
                    color: <br>
                    color is used to tell jQuery Calx in which color the graph should be drawn, you can use
                    comma separated color to define color sequence.
                    If none is given, it will use auto-generated color squence.
                </li>-->
                <li>
                    orientation: <br>
                    orientation is used to define the table orientation, it could be vertical or horizontal,
                    default it horizontal<br>

                    Horizontal table:<br>
                    jQuery Calx will parse single row as single series.<br>
<pre>
+-------+-------+-------+-------+-------+
| val 1 | val 2 | val 3 | val 4 | val 5 |
+-------+-------+-------+-------+-------+
| val 1 | val 2 | val 3 | val 4 | val 5 |
+-------+-------+-------+-------+-------+
</pre>

                    Vertical table: <br>
                    jQuery Calx will parse single column as single series.<br>

<pre>
+-------+-------+
| val 1 | val 1 |
+-------+-------+
| val 2 | val 2 |
+-------+-------+
| val 3 | val 3 |
+-------+-------+
| val 4 | val 4 |
+-------+-------+
| val 5 | val 5 |
+-------+-------+

</pre>

                </li>
            </ul>
        </p>

    </div>
</div>