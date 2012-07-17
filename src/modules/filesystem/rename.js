/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 17.7.2012 
* @website http://hertzen.com
 */

PHP.Modules.prototype.rename = function( from, to ) {
    var COMPILER = PHP.Compiler.prototype,
    filename = from[ COMPILER.VARIABLE_VALUE ],
    filename2  = to[ COMPILER.VARIABLE_VALUE ];
    
    this.ENV[ COMPILER.ERROR ]("rename(" + filename + "," + filename2 + "):  The system cannot find the file specified. (code: 2)", PHP.Constants.E_WARNING, true );    
                        
    return new PHP.VM.Variable( false );
};

