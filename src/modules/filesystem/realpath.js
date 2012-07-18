/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 18.7.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.realpath = function( filenameObj ) {
    var COMPILER = PHP.Compiler.prototype,
    filename = filenameObj[ COMPILER.VARIABLE_VALUE ];
    
    // todo implement properly
                        
    return new PHP.VM.Variable( filename );
};