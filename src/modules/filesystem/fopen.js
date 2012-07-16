/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 29.6.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.fopen = function( filenameObj ) {
    var COMPILER = PHP.Compiler.prototype,
    filename = filenameObj[ COMPILER.VARIABLE_VALUE ];
    
    this.ENV[ COMPILER.ERROR ]("fopen(" + filename + "): failed to open stream: No such file or directory", PHP.Constants.E_WARNING, true );    
                        
    return new PHP.VM.Variable( new PHP.VM.Resource() );
};