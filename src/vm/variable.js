/* 
 * @author Niklas von Hertzen <niklas at hertzen.com>
 * @created 24.6.2012 
 * @website http://hertzen.com
 */

PHP.VM.VariableHandler = function( ENV ) {
    
    var variables = {};
    
    return function( variableName ) {
        if ( variables[ variableName ] === undefined ) { 
            
          
            variables[ variableName ] = new PHP.VM.Variable();
            variables[ variableName ][ PHP.VM.Variable.prototype.DEFINED ] = variableName;
            variables[ variableName ].ENV = ENV;
           
        /*
            Object.defineProperty( variables, variableName, {
                value: new PHP.VM.Variable()
            });
            
           
           
           
            Object.defineProperty( variables, variableName, {
                value: Object.defineProperty( {}, PHP.Compiler.prototype.VARIABLE_VALUE, {
                        set: function( val ) {
                            // we are setting a val to a newly created variable
                           variables[ variableName ] = new PHP.VM.Variable( val );
                        },
                        get: function() {
                            // attempting to retrieve a value of undefined property
                            console.log( variables );
                            console.log( variableName + " not defined");
                        }
                    }
                
                )
            });
             */
            
        }
        
        return variables[ variableName ];
    };
    
};

PHP.VM.VariableProto = function() {

    }

PHP.VM.VariableProto.prototype[ PHP.Compiler.prototype.CONCAT ] = function( combinedVariable ) {
    
    var COMPILER = PHP.Compiler.prototype;
    
    return new PHP.VM.Variable( this[ COMPILER.VARIABLE_VALUE ].toString() + combinedVariable[ COMPILER.VARIABLE_VALUE ].toString() );
};

PHP.VM.VariableProto.prototype[ PHP.Compiler.prototype.ADD ] = function( combinedVariable ) {
    
    var COMPILER = PHP.Compiler.prototype;
    
    return new PHP.VM.Variable( (this[ COMPILER.VARIABLE_VALUE ] - 0) + ( combinedVariable[ COMPILER.VARIABLE_VALUE ] - 0 ) );
};

PHP.VM.Variable = function( arg ) {

    var value,
    __toString = "__toString",
    COMPILER = PHP.Compiler.prototype,
    setValue = function( newValue ) {
        this[ this.DEFINED ] = true;
        
        if ( newValue === undefined ) {
            newValue = null;
        }
        
        if ( typeof newValue === "string" ) {
            this[ this.TYPE ] = this.STRING;
        } else if ( typeof newValue === "number" ) {
            this[ this.TYPE ] = this.INT;
            this[ this.CAST_STRING ] = function() {  
                return new PHP.VM.Variable( value.toString() );
            };
            
        } else if ( newValue === null ) {   
            this[ this.TYPE ] = this.NULL;

        } else if ( typeof newValue === "boolean" ) {
            this[ this.TYPE ] = this.BOOL;
            
            this[ this.CAST_STRING ] = function() {    
                return new PHP.VM.Variable( ( value ) ? "1" : "0" );
            };
            
        } else if ( newValue instanceof PHP.VM.ClassPrototype ) {
            if ( newValue[ COMPILER.CLASS_NAME ] === PHP.VM.Array.prototype.CLASS_NAME ) {
                this[ this.TYPE ] = this.ARRAY;
            } else {
                // check for __toString();
                if ( typeof newValue[PHP.VM.Class.METHOD + __toString ] === "function" ) {
                    this[ this.CAST_STRING ] = newValue[PHP.VM.Class.METHOD + __toString ];
                }
                
                this[ this.TYPE ] = this.OBJECT;
            }
        } else if ( newValue instanceof PHP.VM.Resource ) {    
            this[ this.TYPE ] = this.RESOURCE;
        } else {
         
        }
        value = newValue;
        
        // remove this later, debugging only
        this.val = newValue;
    };
    
    
    setValue.call( this, arg );
    
    
   
    this[ PHP.Compiler.prototype.UNSET ] = function() {
        setValue( null );
        this.DEFINED = false;
    };
    
    Object.defineProperty( this, COMPILER.VARIABLE_VALUE,
    {
        get : function(){
            
            if ( this[ this.DEFINED ] !== true ) {
                this.ENV[ COMPILER.ERROR ](" Undefined variable " + this.DEFINED + " parameter, ", PHP.Constants.E_CORE_NOTICE );    
                
            }
            return value;
        },  
        set : setValue
    }
    );
        
    Object.defineProperty( this, COMPILER.DIM_FETCH,
    {
        get : function(){
         
            return function( ctx, variable ) {
                if ( this[ this.TYPE ] === this.ARRAY ) {
                    //  console.log(value[ COMPILER.METHOD_CALL ]( ctx, COMPILER.ARRAY_GET, variable ));
                    return  value[ COMPILER.METHOD_CALL ]( ctx, COMPILER.ARRAY_GET, variable );
                } else {
                    //  console.log(new PHP.VM.Variable( null ));
                    return new PHP.VM.Variable( null );
                }
            };
        },  
        set : setValue
    }
    );
    
    
    return this;
    
};

PHP.VM.Variable.prototype = new PHP.VM.VariableProto();

PHP.VM.Variable.prototype.DEFINED = "$Defined";

PHP.VM.Variable.prototype.CAST_STRING = "$String";

PHP.VM.Variable.prototype.NULL = 0;
PHP.VM.Variable.prototype.BOOL = 1;
PHP.VM.Variable.prototype.INT = 2;
PHP.VM.Variable.prototype.FLOAT = 3;
PHP.VM.Variable.prototype.STRING = 4;
PHP.VM.Variable.prototype.ARRAY = 5;
PHP.VM.Variable.prototype.OBJECT = 6;
PHP.VM.Variable.prototype.RESOURCE = 7;
PHP.VM.Variable.prototype.TYPE = "type";

