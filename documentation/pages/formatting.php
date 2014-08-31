<!-- Formatting -->
                <a name="format"></a><br><br>
                <div class="row page-header" style="margin-top:0">
                    <div class="col-md-12">
                        <h3>
                            Formatting
                        </h3>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-12">
                        <p>
                            jQuery Calx depends on <code>numeral.js</code> for output formatting. In jQuery Calx version 1.x , numeral is integrated
                            into the core, but no longer integrated in jQuery Calx 2.x and listed as dependency, you need to load it before loading
                            jQuery Calx if you need the formatting feature.
                        </p>
                        <pre>
&lt;script src="js/numeral.min.js"&gt;&lt/script&gt;
&lt;script src="jquery-1.9.1.min.js"&gt;&lt/script&gt;
&lt;script src="jquery-calx-2.0.0.min.js"&gt;&lt/script&gt; </pre><br>

                        <h4>Setting up locale</h4>
                        <p>
                            In jQuery Calx 1.x, locale settings are defined inside the jQuery Calx configuration, since jQuery Calx 2 no longer
                            integrated with numeral.js, local settings are defined in numeral config
                        </p>
                        <pre>
// load a language
    numeral.language('fr', {
        delimiters: {
            thousands: ' ',
            decimal: ','
        },
        abbreviations: {
            thousand: 'k',
            million: 'm',
            billion: 'b',
            trillion: 't'
        },
        ordinal : function (number) {
            return number === 1 ? 'er' : 'ème';
        },
        currency: {
            symbol: '€'
        }
    });

// switch between languages
    numeral.language('fr');
                        </pre><br>

                        <h4>
                            Formatting Value
                        </h4>
                        <p>
                            Cell value formatting is defined in the <code>data-format</code> attribute using pre-defined rule, below is example
                            of how to format the cell value and list of available formatting rules.
                        </p>
                        <pre>
&lt;input data-cell="A1" data-format="$ 0,0[.]00" /&gt;</pre>

                        <div class="row">
                            <div class="col-md-6">

                                <h4>Numbers</h4>
                                <table id="format-numbers" class="table striped bordered">
                                    <thead>
                                        <tr>
                                            <th>Number</th>
                                            <th>Format</th>
                                            <th>String</th>
                                        </tr>
                                    </thead>
                                    <tbody><tr><td>10000</td><td>'0,0.0000'</td><td>10,000.0000</td></tr><tr><td>10000.23</td><td>'0,0'</td><td>10,000</td></tr><tr><td>10000.23</td><td>'+0,0'</td><td>+10,000</td></tr><tr><td>-10000</td><td>'0,0.0'</td><td>-10,000.0</td></tr><tr><td>10000.1234</td><td>'0.000'</td><td>10000.123</td></tr><tr><td>10000.1234</td><td>'0[.]00000'</td><td>10000.12340</td></tr><tr><td>-10000</td><td>'(0,0.0000)'</td><td>(10,000.0000)</td></tr><tr><td>-0.23</td><td>'.00'</td><td>-.23</td></tr><tr><td>-0.23</td><td>'(.00)'</td><td>(.23)</td></tr><tr><td>0.23</td><td>'0.00000'</td><td>0.23000</td></tr><tr><td>0.23</td><td>'0.0[0000]'</td><td>0.23</td></tr><tr><td>1230974</td><td>'0.0a'</td><td>1.2m</td></tr><tr><td>1460</td><td>'0 a'</td><td>1 k</td></tr><tr><td>-104000</td><td>'0a'</td><td>-104k</td></tr><tr><td>1</td><td>'0o'</td><td>1st</td></tr><tr><td>52</td><td>'0o'</td><td>52nd</td></tr><tr><td>23</td><td>'0o'</td><td>23rd</td></tr><tr><td>100</td><td>'0o'</td><td>100th</td></tr></tbody>
                                </table>


                                <h4>Percentages</h4>
                                <table id="format-percentage" class="table striped bordered">
                                    <thead>
                                        <tr>
                                            <th>Number</th>
                                            <th>Format</th>
                                            <th>String</th>
                                        </tr>
                                    </thead>
                                    <tbody><tr><td>1</td><td>'0%'</td><td>100%</td></tr><tr><td>0.974878234</td><td>'0.000%'</td><td>97.488%</td></tr><tr><td>-0.43</td><td>'0 %'</td><td>-43 %</td></tr><tr><td>0.43</td><td>'(0.000 %)'</td><td>43.000 %</td></tr></tbody>
                                </table>
                            </div>
                            <div class="col-md-6">
                                <h4>Currency</h4>
                                <table id="format-currency" class="table striped bordered">
                                    <thead>
                                        <tr>
                                            <th>Number</th>
                                            <th>Format</th>
                                            <th>String</th>
                                        </tr>
                                    </thead>
                                    <tbody><tr><td>1000.234</td><td>'$0,0.00'</td><td>$1,000.23</td></tr><tr><td>1000.2</td><td>'0,0[.]00 $'</td><td>1,000.20 $</td></tr><tr><td>1001</td><td>'$ 0,0[.]00'</td><td>$ 1,001</td></tr><tr><td>-1000.234</td><td>'($0,0)'</td><td>($1,000)</td></tr><tr><td>-1000.234</td><td>'$0.00'</td><td>-$1000.23</td></tr><tr><td>1230974</td><td>'($ 0.00 a)'</td><td>$ 1.23 m</td></tr></tbody>
                                </table>
                                <h4>Bytes</h4>
                                <table id="format-bytes" class="table striped bordered">
                                    <thead>
                                        <tr>
                                            <th>Number</th>
                                            <th>Format</th>
                                            <th>String</th>
                                        </tr>
                                    </thead>
                                    <tbody><tr><td>100</td><td>'0b'</td><td>100B</td></tr><tr><td>2048</td><td>'0 b'</td><td>2 KB</td></tr><tr><td>7884486213</td><td>'0.0b'</td><td>7.3GB</td></tr><tr><td>3467479682787</td><td>'0.000 b'</td><td>3.154 TB</td></tr></tbody>
                                </table>

                                <h4>Time</h4>
                                <table id="format-time" class="table striped bordered">
                                    <thead>
                                        <tr>
                                            <th>Number</th>
                                            <th>Format</th>
                                            <th>String</th>
                                        </tr>
                                    </thead>
                                    <tbody><tr><td>25</td><td>'00:00:00'</td><td>0:00:25</td></tr><tr><td>238</td><td>'00:00:00'</td><td>0:03:58</td></tr><tr><td>63846</td><td>'00:00:00'</td><td>17:44:06</td></tr></tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>