/* 
 * @author Niklas von Hertzen <niklas at hertzen.com>
 * @created 24.6.2012 
 * @website http://hertzen.com
 */

PHP.VM.VariableHandler = function() {
    
    var variables = {};
    
    return function( variableName ) {
        if ( variables[ variableName ] === undefined ) { 
            Object.defineProperty( variables, variableName, {
                value: new PHP.VM.Variable()
            });
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
    COMPILER = PHP.Compiler.prototype,
    setValue = function( newValue ) {
        
        if ( typeof newValue === "string" ) {
            this[ this.TYPE ] = this.STRING;
        } else if ( typeof newValue === "number" ) {
            this[ this.TYPE ] = this.INT;
        } else if ( newValue === null ) {   
            this[ this.TYPE ] = this.NULL;
        } else if ( newValue instanceof PHP.VM.ClassPrototype ) {
            if ( newValue[ COMPILER.CLASS_NAME ] === PHP.VM.Array.prototype.CLASS_NAME ) {
                this[ this.TYPE ] = this.ARRAY;
            } else {
                this[ this.TYPE ] = this.OBJECT;
            }
        } else {
         
        }
        value = newValue;
        
        // remove this later, debugging only
        this.val = newValue;
    };
    
    
    setValue.call( this, arg );
    
    
   
    
    
    Object.defineProperty( this, COMPILER.VARIABLE_VALUE,
    {
        get : function(){
         
            return value;
        },  
        set : setValue
    }
    );
    
    
    return this;
    
};

PHP.VM.Variable.prototype = new PHP.VM.VariableProto();



PHP.VM.Variable.prototype.NULL = 0;
PHP.VM.Variable.prototype.BOOL = 1;
PHP.VM.Variable.prototype.INT = 2;
PHP.VM.Variable.prototype.FLOAT = 3;
PHP.VM.Variable.prototype.STRING = 4;
PHP.VM.Variable.prototype.ARRAY = 5;
PHP.VM.Variable.prototype.OBJECT = 6;
PHP.VM.Variable.prototype.RESOURCE = 7;

PHP.VM.Variable.prototype.TYPE = "type";