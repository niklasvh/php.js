/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 30.6.2012 
* @website http://hertzen.com
 */
PHP.Modules.prototype.foreachInit = function( expr ) {
     
    var COMPILER = PHP.Compiler.prototype,
    VAR = PHP.VM.Variable.prototype,
    ARRAY = PHP.VM.Array.prototype;
    
    if ( expr[ VAR.TYPE ] === VAR.ARRAY ) {
        var pointer = expr[ COMPILER.VARIABLE_VALUE ][ PHP.VM.Class.PROPERTY + ARRAY.POINTER];
        pointer[ COMPILER.VARIABLE_VALUE ] = 0;
      
        return {
            expr: expr
        };
      
    } else if ( expr[ VAR.TYPE ] === VAR.OBJECT ) {
        var objectValue = expr[ COMPILER.VARIABLE_VALUE ]
        
        
        // iteratorAggregate implemented objects
        if ( objectValue[ PHP.VM.Class.INTERFACES ].indexOf("IteratorAggregate") !== -1 ) {
            var iterator = objectValue[ COMPILER.METHOD_CALL ]( this, "getIterator" )[ COMPILER.VARIABLE_VALUE ];
            return {
                expr: expr,  
                Class:iterator
            };
        }
    }
   
};

PHP.Modules.prototype.foreach = function( iterator, value, key ) {
     
    var COMPILER = PHP.Compiler.prototype,
    VAR = PHP.VM.Variable.prototype,
    ARRAY = PHP.VM.Array.prototype;
    
    var expr = iterator.expr;
    
    if ( expr[ VAR.TYPE ] === VAR.ARRAY ) {
        var values = expr[ COMPILER.VARIABLE_VALUE ][ PHP.VM.Class.PROPERTY + ARRAY.VALUES ][ COMPILER.VARIABLE_VALUE ],
        keys =  expr[ COMPILER.VARIABLE_VALUE ][ PHP.VM.Class.PROPERTY + ARRAY.KEYS ][ COMPILER.VARIABLE_VALUE ],
        len = values.length,
        pointer = expr[ COMPILER.VARIABLE_VALUE ][ PHP.VM.Class.PROPERTY + ARRAY.POINTER];
        
        var result = ( pointer[ COMPILER.VARIABLE_VALUE ] < len );
        
        if ( result === true ) {
            value[ COMPILER.VARIABLE_VALUE ] = values[ pointer[ COMPILER.VARIABLE_VALUE ] ][ COMPILER.VARIABLE_VALUE ];
            
            if ( key instanceof PHP.VM.Variable ) {
                key[ COMPILER.VARIABLE_VALUE ] = keys[ pointer[ COMPILER.VARIABLE_VALUE ] ];
            }
            
            pointer[ COMPILER.VARIABLE_VALUE ]++;
        }
        
        return result;
        
        
        
  
    } else if ( expr[ VAR.TYPE ] === VAR.OBJECT ) {
        var objectValue = expr[ COMPILER.VARIABLE_VALUE ]
        
        
        // iteratorAggregate implemented objects
        if ( objectValue[ PHP.VM.Class.INTERFACES ].indexOf("IteratorAggregate") !== -1 ) {
            
            
            if ( iterator.first === undefined ) {
                iterator.first = true;
            } else {
                iterator.Class[ COMPILER.METHOD_CALL ]( this, "next" );
            }
            
            var result = iterator.Class[ COMPILER.METHOD_CALL ]( this, "valid" )[ VAR.CAST_BOOL ][ COMPILER.VARIABLE_VALUE ];
            
            if ( result === true ) {
                
                value[ COMPILER.VARIABLE_VALUE ] = iterator.Class[ COMPILER.METHOD_CALL ]( this, "current" )[ COMPILER.VARIABLE_VALUE ];
                
                if ( key instanceof PHP.VM.Variable ) {
                    key[ COMPILER.VARIABLE_VALUE ] = iterator.Class[ COMPILER.METHOD_CALL ]( this, "key" )[ COMPILER.VARIABLE_VALUE ];
                }
            }

            return result;
        
        }
        
       
    }
    
    
    
};