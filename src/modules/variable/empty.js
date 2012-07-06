/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 6.7.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.empty = function() {

    var len = arguments.length, i = -1, arg,
    VARIABLE = PHP.VM.Variable.prototype;

    while( ++i < len ) {
        arg = arguments[ i ];
        
        // http://www.php.net/manual/en/types.comparisons.php
        if ( arg[ VARIABLE.TYPE ] === VARIABLE.NULL ) {
            return new PHP.VM.Variable( false );
        }

        
    }

    return new PHP.VM.Variable( true );

};
