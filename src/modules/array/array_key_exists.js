
PHP.Modules.prototype.array_key_exists = function( key, search ) {
    
    var COMPILER = PHP.Compiler.prototype,
    VAR = PHP.VM.Variable.prototype;
    
    if ( search[ VAR.TYPE ] === VAR.ARRAY ) {
        var keys = search[ COMPILER.VARIABLE_VALUE ][ PHP.VM.Class.PROPERTY + PHP.VM.Array.prototype.KEYS ][ COMPILER.VARIABLE_VALUE ];
        
        
                 
        var index = -1,
        value = key[ COMPILER.VARIABLE_VALUE ];
        
        
        
        keys.some(function( item, i ){
                
            if ( item instanceof PHP.VM.Variable ) {
                item = item[ COMPILER.VARIABLE_VALUE ];
            } 
                
          
                
            if ( item === value) {
                index = i;
                return true;
            }
                
            return false;
        });
        
        return new PHP.VM.Variable( ( index !== -1) );
    }
    
};