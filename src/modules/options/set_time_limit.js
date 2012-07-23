/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 11.7.2012 
* @website http://hertzen.com
 */

( function( MODULES ){
    MODULES.set_time_limit = function(  newvalue ) {
        
        var COMPILER = PHP.Compiler.prototype;
    
    
        this.$ini.max_execution_time = newvalue[ COMPILER.VARIABLE_VALUE ];
     
    };
})( PHP.Modules.prototype );
