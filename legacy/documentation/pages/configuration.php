<!-- Configuration -->
<a name="configure"></a><br><br>
<div class="row page-header" style="margin-top:0">
    <div class="col-md-12">
        <h3>
            Configuration
        </h3>
    </div>
</div>
<div class="row">
    <div class="col-md-12">
        <p>
            You can configure how jQuery Calx should behave by passing configuration object when initializing
            jQuery Calx, the default configuration is used when you pass nothing to initialize jQuery Calx.
            The default configuration is shown as below:
        </p>
<pre>
    <code>
/************************************************
 *             Default Configuration            *
 ************************************************/

var defaultConfig = {
    /**
     * tell calx to perform auto calculation after change has been made,
     * if autoCalculate is false, you need to trigger calculation manually
     * by calling the calculate method $(selector).calx('calculate');
     */
    'autoCalculate'         : true,

    /**
     * event that trigger calculation to be executed when autoCalculate is true
     */
    'autoCalculateTrigger'  : 'blur',

    /**
     * callback triggered right before calculation is performed
     * when callback is executed, jQuery Calx will pass sheet object as the context
     * so you can access all sheet API via &lt;this&gt; keyword
     */
    'onBeforeCalculate'     : null ,

    /**
     * callback triggered right after calculation is performed
     */
    'onAfterCalculate'      : null ,

    /**
     * callback triggered right before calculation result is rendered
     */
    'onBeforeRender'         : null ,

    /**
     * callback triggered right after calculation result is rendered
     */
    'onAfterRender'          : null ,

    /**
     * default fomatting rule when data-format is not present
     */
    'defaultFormat'         : false,

    /**
     * used for server side formula, when you call the SERVER() function,
     * jQuery Calx will pass everything to this URL, and wait for the response
     * before processing the next calculation
     */
    'ajaxUrl'               : null,

    /**
     * ajax method used for requesting formula result from the server side
     */
    'ajaxMethod'            : 'get',

    /**
     * check for circular reference upon initialization, default false
     */
    'checkCircularReference': false

};
    </code>
</pre>
    </div>
</div>