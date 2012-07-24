/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 10.7.2012 
* @website http://hertzen.com
 */




PHP.Modules.prototype.list = function() {
    var COMPILER = PHP.Compiler.prototype,
    VARIABLE = PHP.VM.Variable.prototype,
    ARRAY = PHP.VM.Array.prototype,
    array = Array.prototype.pop.call(arguments);
        
    if ( array [ VARIABLE.TYPE ] === VARIABLE.ARRAY ) {
        var pointer = array[ COMPILER.VARIABLE_VALUE ][ PHP.VM.Class.PROPERTY + ARRAY.POINTER],
        values = array[ COMPILER.VARIABLE_VALUE ][ PHP.VM.Class.PROPERTY + ARRAY.VALUES ][ COMPILER.VARIABLE_VALUE ];
       
        Array.prototype.slice.call( arguments, 0 ).forEach(function( variable, index ){
            if ( variable instanceof PHP.VM.Variable ) {
                if ( values[ index ] !== undefined ) {
                    variable[ COMPILER.VARIABLE_VALUE ] = values[ index ][ COMPILER.VARIABLE_VALUE ];
                } else {
                    this.ENV[ COMPILER.ERROR ]("Undefined offset: " + index, PHP.Constants.E_NOTICE, true );
                    variable[ COMPILER.VARIABLE_VALUE ] = new PHP.VM.Variable();
                }
            } else if ( Array.isArray( variable )) {
                this.list.apply( this, variable.concat(values[ index ]) );
            }
        }, this);
        
        
        return array;
        
        
       
    } 
    
    // fill with null
    Array.prototype.slice.call( arguments, 0 ).forEach(function( variable ){
        if ( variable instanceof PHP.VM.Variable ) {
            variable[ COMPILER.VARIABLE_VALUE ] = (new PHP.VM.Variable())[ COMPILER.VARIABLE_VALUE ];
        }
    });
    
    return new PHP.VM.Variable(false);
    
    
};