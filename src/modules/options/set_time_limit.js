/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 11.7.2012 
* @website http://hertzen.com
 */

( function( MODULES ){
    MODULES.set_time_limit = function( varname, newvalue ) {
        
        var COMPILER = PHP.Compiler.prototype;
    
        setTimeout(function(){
            console.log('sup');
            this[ COMPILER.ERROR ]( "Maximum execution time of 1 second exceeded", PHP.Constants.E_CORE, true ); 
        }.bind(this), 1000);
    };
})( PHP.Modules.prototype );
