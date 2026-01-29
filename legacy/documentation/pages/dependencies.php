<!-- Dependency -->
<a name="dependency"></a><br><br>
<div class="row page-header" style="margin-top:0">
    <div class="col-md-12">
        <h3>
            Dependencies
        </h3>
    </div>
</div>
<div class="row">
    <div class="col-md-12">
        <p>
            By default, the only dependency of jQuery Calx is jQuery, the other dependencies located in <code>js</code> directory only required when you perform
            specific formula, including value formatting, date operation, and statistic operation. jQuery Calx using formula
            sets from <a href="https://github.com/sutoiku/formula.js">formula.js</a> in the core,
            but it already modified to work seamlessly with jQuery Calx to minimize dependencies.
        </p>

        <h4 class="method-title">Value Formatting</h4>
        <p>
            In regards to format value using the <code>data-format</code> attribute, you need to include <code>numeral.min.js</code> located
            in <code>js</code> directory, or you can download the latest version from
            <a href="https://github.com/adamwdraper/Numeral-js">https://github.com/adamwdraper/Numeral-js</a>.

            If <code>numeral.js</code> is not included, jQuery Calx will render the raw value instead of formatted one.
        </p>

        <h4 class="method-title">Date Processing</h4>
        <p>
            Most of the date processing formula like <code>DATE</code>, <code>DATEDIF()</code> require <code>moment.js</code> to be executed correctly,
            you need to include <code>moment.min.js</code> located in <code>js</code> directory.
            If <code>moment.js</code> is not loaded, jQuery Calx will return <code>#ERROR_MOMENT_JS_REQUIRED</code> error.
        </p>

        <h4 class="method-title">Statistical Calculation</h4>
        <p>
            Most of the statistical processing formula like <code>CORREL()</code>, <code>EXPONDIF()</code> require <code>jstat.js</code> to be executed.
            you need to include <code>jstat.min.js</code> located in <code>js</code> directory.
            If <code>jstat.js</code> is not loaded, jQuery Calx will return <code>#ERROR_JSTAT_JS_REQUIRED</code> error.
        </p>

        <h4 class="method-title">Chart Drawing and Plotting</h4>
        <p>
            Currently, jQuery calx only support chart drawing and plotting using jQuery Flot (<a href="http://www.flotcharts.org">http://www.flotcharts.org</a>)
            therefore you need to include jQuery Flot script and required plugin to draw the chart.
        </p><br>

        <pre>
&lt;script src="jquery-1.9.1.min.js"&gt;&lt/script&gt;
&lt;script src="js/jquery.flot.min.js"&gt;&lt/script&gt;
&lt;script src="js/flot_plugin/jquery.flot.pie.js"&gt;&lt/script&gt;
&lt;script src="js/flot_plugin/jquery.flot.categries.js"&gt;&lt/script&gt;
&lt;script src="js/numeral.min.js"&gt;&lt/script&gt;
&lt;script src="js/moment.min.js"&gt;&lt/script&gt;
&lt;script src="js/jstat.min.js"&gt;&lt/script&gt;
&lt;script src="jquery-calx-2.0.0.min.js"&gt;&lt/script&gt; </pre><br>
    </div>
</div>