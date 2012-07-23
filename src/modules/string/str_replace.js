/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 22.7.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.str_replace = function( search, replace, subject ) {
    var VARIABLE = PHP.VM.Variable.prototype,
    COMPILER = PHP.Compiler.prototype;
    
    var re = new RegExp( search[ COMPILER.VARIABLE_VALUE ], "g");
    console.log( re );
    return new PHP.VM.Variable( subject[ COMPILER.VARIABLE_VALUE ].replace( re, replace[ COMPILER.VARIABLE_VALUE ] ) );
};