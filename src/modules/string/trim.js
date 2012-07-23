/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 23.7.2012 
* @website http://hertzen.com
 */



PHP.Modules.prototype.trim = function( variable ) {
    var COMPILER = PHP.Compiler.prototype,
    VARIABLE = PHP.VM.Variable.prototype;
    
    if ( variable[ VARIABLE.TYPE ] !== VARIABLE.STRING ) {
        variable = variable[ VARIABLE.CAST_STRING ];
    }
    console.log( variable );
    return new PHP.VM.Variable( variable[ COMPILER.VARIABLE_VALUE ].toString().trim() );
    
    
};