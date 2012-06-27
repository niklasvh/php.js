/* 
 * @author Niklas von Hertzen <niklas at hertzen.com>
 * @created 24.6.2012 
 * @website http://hertzen.com
 */

PHP.VM.VariableHandler = function() {
    
    var variables = {},
    variableValues = {};
    
    return function( variableName ) {
        if ( variables[ variableName ] === undefined ) {
            Object.defineProperty( variables, variableName, {
                value: Object.create(Object.prototype, { 
                    $: {
                        get: function() {
                      //      console.log("getting " + variableName);
                            return variableValues[ variableName ];
                        },
                        set: function( value ) {
                      //      console.log("setting " + variableName + " to " + value);
                            variableValues[ variableName ] = value;
                        }
                    }
            
                })
            });
        }
        
        return variables[ variableName ];
    };
    
};

PHP.VM.VariableProto = function( type ) {
    this.type = type;
}

PHP.VM.VariableProto.prototype[ PHP.Compiler.prototype.CONCAT ] = function( combinedVariable ) {
    return new PHP.VM.Variable( this.$.toString() + combinedVariable.$.toString() );
};

PHP.VM.Variable = function( arg ) {
    
    var obj = new PHP.VM.VariableProto( this.NULL ),
    value;
    
    
    if (typeof arg === "string") {
        obj.type = this.STRING;
        value = arg;
    } else if (typeof arg === "number") {
        obj.type = this.INT;
        value = arg;
    } else {
        value = arg;
    }
    
   
    
    
    Object.defineProperty( obj, PHP.Compiler.prototype.VARIABLE_VALUE,
    {
        get : function(){
            return value;
        },  
        set : function( newValue ){
            value = newValue;
        }
    }
    );
    
    
    return obj;
    
};



PHP.VM.Variable.prototype.NULL = 0;
PHP.VM.Variable.prototype.BOOL = 1;
PHP.VM.Variable.prototype.INT = 2;
PHP.VM.Variable.prototype.FLOAT = 3;
PHP.VM.Variable.prototype.STRING = 4;
PHP.VM.Variable.prototype.ARRAY = 5;
PHP.VM.Variable.prototype.OBJECT = 6;
PHP.VM.Variable.prototype.RESOURCE = 7;