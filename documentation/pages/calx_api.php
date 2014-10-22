<!-- Calx API -->
<a name="calx"></a><br><br>
<div class="row page-header" style="margin-top:0">
    <div class="col-md-12">
        <h3>
            Calx API
        </h3>
    </div>
</div>
<div class="row">
    <div class="col-md-12">
        Calx comes with several API that can be invoked using this syntax <code>$('selector').calx('method')</code>,
        here is list of available method that can be accessed by jQuery Calx:

        <ul type="none">
            <li>
                <h4 class="method-title">calculate</h4>
                <p><code>$('selector').calx('calculate')</code></p>
                <p>
                    This method is used to trigger calculation process on the sheet related to the selected element,
                    which is useful when you configure jQuery Calx with <code>autoCalculate : false</code> or working
                    with large sheet where the calculation process take some times to finish and need to be triggerred
                    manually.
                </p>
            </li>
            <li>
                <h4 class="method-title">destroy</h4>
                <p><code>$('selector').calx('destroy')</code></p>
                <p>
                    This method is used to destroy sheet object related to the selected element, any formula referenced
                    to the cells inside this sheet will become invalid, and may result in wrong calculation.
                </p>
            </li>
            <li>
                <h4 class="method-title">evaluate</h4>
                <p><code>$('selector').calx('evaluate', formula)</code></p>
                <p>
                    This method is used to evaluate formula against the current selected sheet, all cell adrresses and
                    variables are referenced to the current sheet.
                </p>

                <p>
                    You can do something like :

                    <code>$('selector').calx('evaluate', 'SUM(A1:A5)')</code>

                    and jQuery Calx will return the result of the formula.
                </p>
            </li>
            <li>
                <h4 class="method-title">getCell</h4>
                <p><code>$('selector').calx('getCell', cellAddress)</code></p>
                <p>
                    This method is used to retreive specified cell object of the selected sheet.
                    Please refer to <a href="#cell">Cell API</a> for detailed documentation about cell object.
                </p>
            </li>
            <li>
                <h4 class="method-title">getSheet</h4>
                <p><code>$('selector').calx('getSheet')</code></p>
                <p>
                    This method is used to retreive sheet object related to the selected element.
                    Please refer to <a href="#sheet">Sheet API</a> for detailed documentation about sheet object.
                </p>
            </li>
            <li>
                <h4 class="method-title">getUtility</h4>
                <p><code>$('selector').calx('getUtility')</code></p>
                <p>
                    This method is used to retreive utility object when you need some help with the cell or cell range.
                </p>
            </li>
            <li>
                <h4 class="method-title">refresh</h4>
                <p><code>$('selector').calx('refresh')</code></p>
                <p>
                    This method is used to force jQuery Calx to rebuild the sheet of the selected element.
                    It will destroy the cell registry and rebuild it from scratch.
                </p>
            </li>
            <li>
                <h4 class="method-title">registerFunction</h4>
                <p><code>$('selector').calx('registerFunction', FUNCTION_NAME, function_definition [, override])</code></p>
                <p>
                    This method is used to register new function and can be used in <code>data-formula</code> attribute.
                    The parameters is described as below:
                    <ul type="square">
                        <li>FUNCTION_NAME<br>the function name such as SUM, AVG, etc, must be uppercase letter</li>
                        <li>
                            function_definition<br>the function definition define how the function should behave <code>function(){ /** bla bla bla **/ }</code>,
                            jQuery Calx will pass the sheet object as the context, so you can access all the sheet API via
                            <code>this</code> keyword.
                        </li>
                        <li>
                            override<br>the optional override flag, could be true or false to indicate if new function should override the
                            original one or not. If true, the built in function will be overrided, default value is false.
                        </li>
                    </ul>
                </p>
                <p>
<pre>
<code>
$('selector').calx('registerFunction', 'CUSTOM', function(args1, args2, ... , argsN){
    //&lt;this&gt; keyword will be sheet object where the current formula is evaluated
    //if data-formula look like CUSTOM(A1), the value of A1 will be passed as args1
    //if data-formula look like CUSTOM(A1:B2), the value of args1 will be like
    //{A1:value, A2:value, B1:value, B2:value}

    //function should return calculated value to be rendered into the cell that invoke this function
});
</code>
</pre>
                </p>
                <p>
                    And after the function is registered, you can simply write it in the <code>data-formula</code> attribute:
                    <code>&lt;span data-formula="CUSTOM(A1,A2,100,C1:D5)"&gt;&lt;/span&gt;</code>
                </p>
            </li>
            <li>
                <h4 class="method-title">registerVariable</h4>
                <p><code>$('selector').calx('registerVariable', var_name [, var_value])</code></p>
                <p>
                    This method is used to register variables to the calx, and are available to all sheet. The variable name
                    should be all lowercase and underscore character ([a-z_]) and the value could be anything as far as the function
                    can handle it.
                </p>
                <p>
                    <pre><code>$().calx('registerVariable', 'the_year_i_was_born', 1988)</code></pre>
                </p>
                <p>
                    Or you can define multiple variable at one time using javascript object
                </p>
                <p>
                    <pre><code>$().calx('registerVariable', {varname: 'value', another_var: 'another value'})</code></pre>
                </p>
                <p>
                    After variable is registered, you can reference it in data-formula attribute like
                    <code>data-formula="CONCAT('I was born in ', the_year_i_was_born)"</code>
                </p>
                <p>
                    Please note that there are predefined variables: true, false, and null disregard of the character is lower
                    case or upper case, or mix of both, which mean true, TRUE, tRue are all the same.
                </p>
            </li>
            <li>
                <h4 class="method-title">update</h4>
                <p><code>$('selector').calx('update')</code></p>
                <p>
                    This method is used to update cell registry against any change in the element related to the sheet,
                    <code>update</code> is similar to <code>refresh</code>, but instead of rebuild the cell registry from
                    the scratch, it only add or delete cell that has been added or removed from the sheet's element.
                </p>
                <p>
                    This is useful when you are working with dynamic form where form elements are added or removed on the fly.
                </p>
            </li>

            <li>
                <h4 class="method-title">reset</h4>
                <p><code>$('selector').calx('reset')</code></p>
                <p>
                    This method is used to reset the form inside the sheet element to its original state.
                </p>
            </li>
        </ul>
    </div>
</div>