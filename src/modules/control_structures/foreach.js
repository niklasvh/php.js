/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 30.6.2012 
* @website http://hertzen.com
 */
PHP.Modules.prototype.$foreachInit = function( expr ) {
     
    var COMPILER = PHP.Compiler.prototype,
    VAR = PHP.VM.Variable.prototype,
    ARRAY = PHP.VM.Array.prototype;
    
    if ( expr[ VAR.TYPE ] === VAR.ARRAY ) {
        var pointer = expr[ COMPILER.VARIABLE_VALUE ][ PHP.VM.Class.PROPERTY + ARRAY.POINTER];
        pointer[ COMPILER.VARIABLE_VALUE ] = 0;
      
        return {
            len: expr[ COMPILER.VARIABLE_VALUE ][ PHP.VM.Class.PROPERTY + ARRAY.VALUES ][ COMPILER.VARIABLE_VALUE ].length,
            expr: expr,
            clone: expr[ COMPILER.VARIABLE_VALUE ][ COMPILER.METHOD_CALL ]( this, COMPILER.ARRAY_CLONE )
        };
      
    } else if ( expr[ VAR.TYPE ] === VAR.OBJECT ) {
        var objectValue = expr[ COMPILER.VARIABLE_VALUE ]
        
        
        // iteratorAggregate implemented objects
        
        if ( objectValue[ PHP.VM.Class.INTERFACES ].indexOf("Traversable") !== -1 ) {
      
            var iterator = objectValue;
            
            if ( objectValue[ PHP.VM.Class.INTERFACES ].indexOf("Iterator") === -1 ) {
                iterator = objectValue[ COMPILER.METHOD_CALL ]( this, "getIterator" )[ COMPILER.VARIABLE_VALUE ];
            }
  
            iterator[ COMPILER.METHOD_CALL ]( this, "rewind" );

            return {
                expr: expr,  
                Class:iterator
            };
        } else {
            // public members in object
            
            var classProperty = PHP.VM.Class.PROPERTY;
            
            return {
                expr: expr,
                pointer: 0,
                keys:  (function( keys ) {
                    var items = [];
                    
                    keys.forEach( function( key ){
                        if ( key.substring(0, classProperty.length ) === classProperty) {
                            items.push( key.substring( classProperty.length ) );
                        } 
                    });
                    
                    return items;
                })(Object.keys ( objectValue ))
                
            };
            
        }
    } else {
               this[ COMPILER.ERROR ]( "Invalid argument supplied for foreach()", PHP.Constants.E_CORE_WARNING, true );
     
    }
   
};

PHP.Modules.prototype.$foreachEnd = function( iterator ) {
    
    var COMPILER = PHP.Compiler.prototype;
    
    // destruct iterator
    if ( iterator !== undefined && iterator.Class !== undefined ) {
        iterator.Class[ COMPILER.CLASS_DESTRUCT ]();
    }
 
};

PHP.Modules.prototype.foreach = function( iterator, byRef, value, key ) {
   
    var COMPILER = PHP.Compiler.prototype,
    VAR = PHP.VM.Variable.prototype,
    ARRAY = PHP.VM.Array.prototype,
    expr;

    if ( iterator === undefined  || iterator.expr === undefined ) {
        return false;
    }
    expr = iterator.expr;

    if ( expr[ VAR.TYPE ] === VAR.ARRAY ) {
        
        if ( !byRef && iterator.expr[ VAR.IS_REF ] !== true ) {
            expr = iterator.clone;
        } else {
            expr = expr[ COMPILER.VARIABLE_VALUE ];
        }
        
        var values = expr[ PHP.VM.Class.PROPERTY + ARRAY.VALUES ][ COMPILER.VARIABLE_VALUE ],
        keys =  expr[ PHP.VM.Class.PROPERTY + ARRAY.KEYS ][ COMPILER.VARIABLE_VALUE ],
        len = ( byRef || iterator.expr[ VAR.IS_REF ] === true) ? values.length : iterator.len,
        pointer = expr[ PHP.VM.Class.PROPERTY + ARRAY.POINTER];
      
        var result = ( pointer[ COMPILER.VARIABLE_VALUE ] < len );
        
        if ( result === true ) {
            if (byRef === true || iterator.expr[ VAR.IS_REF ] === true  ) {
                value[ VAR.REF ]( values[ pointer[ COMPILER.VARIABLE_VALUE ] ] );
            } else {
                value[ COMPILER.VARIABLE_VALUE ] = values[ pointer[ COMPILER.VARIABLE_VALUE ] ][ COMPILER.VARIABLE_VALUE ];
            }
            if ( key instanceof PHP.VM.Variable ) {
                key[ COMPILER.VARIABLE_VALUE ] = keys[ pointer[ COMPILER.VARIABLE_VALUE ] ];
            }
            if (!byRef && iterator.expr[ VAR.IS_REF ] !== true ) {
                iterator.expr[ COMPILER.VARIABLE_VALUE ][ PHP.VM.Class.PROPERTY + ARRAY.POINTER][ COMPILER.VARIABLE_VALUE ]++;
            }
            pointer[ COMPILER.VARIABLE_VALUE ]++;
        }
        
        return result;
        
        
        
  
    } else if ( expr[ VAR.TYPE ] === VAR.OBJECT ) {
        var objectValue = expr[ COMPILER.VARIABLE_VALUE ]
        

        // iteratorAggregate implemented objects
        if ( objectValue[ PHP.VM.Class.INTERFACES ].indexOf("Traversable") !== -1 ) {

            if ( byRef === true ) {
                this.ENV[ PHP.Compiler.prototype.ERROR ]( "An iterator cannot be used with foreach by reference", PHP.Constants.E_ERROR, true );
            }
           
            
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
        
        } else {
            // loop through public members
            
            value[ COMPILER.VARIABLE_VALUE ] = objectValue[ PHP.VM.Class.PROPERTY + iterator.keys[ iterator.pointer ]];
            
            if ( key instanceof PHP.VM.Variable ) {
                key[ COMPILER.VARIABLE_VALUE ] =  iterator.keys[ iterator.pointer ];
            }
            
            return ( iterator.pointer++ < iterator.keys.length);
           
        }
        
       
    } else {
         this[ COMPILER.ERROR ]( "Invalid argument supplied for foreach()", PHP.Constants.E_CORE_WARNING, true );
        return false;
    }
    
    
    
};