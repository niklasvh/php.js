/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 18.7.2012 
* @website http://hertzen.com
 */



PHP.Modules.prototype.file_get_contents = function( filenameObj ) {
    var COMPILER = PHP.Compiler.prototype,
    filename = filenameObj[ COMPILER.VARIABLE_VALUE ];
    
    if ( filename === "php://input") {
        return new PHP.VM.Variable( this.INPUT_BUFFER );
    } else {
        this.ENV[ COMPILER.ERROR ]("file_get_contents(" + filename + "): failed to open stream: No such file or directory", PHP.Constants.E_WARNING, true );    
        return new PHP.VM.Variable( new PHP.VM.Resource() );
    }            

};