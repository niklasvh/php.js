/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 16.7.2012 
* @website http://hertzen.com
 */

// todo improve
PHP.Modules.prototype.preg_match = function( pattern, subject, matches ) {
    var COMPILER = PHP.Compiler.prototype;
    
    var re = new RegExp( pattern[ COMPILER.VARIABLE_VALUE ].substr(1, pattern[ COMPILER.VARIABLE_VALUE ].length - 2) );
    var result = subject[ COMPILER.VARIABLE_VALUE ].toString().match( re );
        
    return new PHP.VM.Variable( ( result === null ) ? 0 : result.length );
};