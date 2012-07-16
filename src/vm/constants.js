/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 29.6.2012 
* @website http://hertzen.com
 */

PHP.VM.Constants = function(  predefined, ENV ) {
    
    var constants = {},
    constantVariables = {},
    COMPILER = PHP.Compiler.prototype,
    VARIABLE = PHP.VM.Variable.prototype,
    methods = {};
    
    Object.keys( predefined ).forEach(function( key ){
       
        constants[ key ] = predefined[ key ];
    }, this); 
    
    methods[ COMPILER.CONSTANT_GET ] = function( constantName ) {
        
        var variable = new PHP.VM.Variable( constants[ constantName ] ); 

        if ( constants[ constantName ] === undefined  ) {
            
            if ( constantVariables[ constantName ] === undefined ) {
                constantVariables[ constantName ] = variable;
            } else {
                return constantVariables[ constantName ];
            }  
            
            variable[ VARIABLE.DEFINED ] = constantName;
            variable[ VARIABLE.CONSTANT ] = true;
            
            
            
            
        }

        return variable;    
    };
    
    methods[ COMPILER.CONSTANT_SET ] = function( constantName, constantValue ) {
              
        if ( constantVariables[ constantName ] !== undefined ) {
            constantVariables[ constantName ][ COMPILER.VARIABLE_VALUE ] = constantValue;
        }
        constants[ constantName ] = constantValue;
    };
    
    return methods;
    
};