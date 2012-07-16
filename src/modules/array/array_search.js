/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 17.7.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.array_search = function( needle, haystack, strict ) {
    
    var COMPILER = PHP.Compiler.prototype,
    VAR = PHP.VM.Variable.prototype;
    
    if ( haystack[ VAR.TYPE ] === VAR.ARRAY ) {
        var values = haystack[ COMPILER.VARIABLE_VALUE ][ PHP.VM.Class.PROPERTY + PHP.VM.Array.prototype.VALUES ][ COMPILER.VARIABLE_VALUE ],
        keys = haystack[ COMPILER.VARIABLE_VALUE ][ PHP.VM.Class.PROPERTY + PHP.VM.Array.prototype.KEYS ][ COMPILER.VARIABLE_VALUE ];
        
        
                 
        var index = -1,
        value = needle[ COMPILER.VARIABLE_VALUE ];
        
        
        
        values.some(function( item, i ){
                
            if ( item instanceof PHP.VM.Variable ) {
                item = item[ COMPILER.VARIABLE_VALUE ];
            } 
                
          
                
            if ( item === value) {
                index = i;
                return true;
            }
                
            return false;
        });
        
        if ( index !== -1 ) {
            return new PHP.VM.Variable(  keys[ index ] );
        } 
        
        return new PHP.VM.Variable( false );
    }
    
};