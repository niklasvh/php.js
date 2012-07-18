/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 18.7.2012 
* @website http://hertzen.com
 */



PHP.Modules.prototype.is_uploaded_file = function( filenameObj ) {
    var COMPILER = PHP.Compiler.prototype,
    filename = filenameObj[ COMPILER.VARIABLE_VALUE ];
    
    // todo add check to see it is an uploaded file
    try {
        var stats = this[ COMPILER.FILESYSTEM ].lstatSync( filename );
    } catch(e) {
        return new PHP.VM.Variable( false );
    }
  
                        
    return new PHP.VM.Variable( true );
};