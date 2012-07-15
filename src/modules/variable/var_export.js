/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 15.7.2012 
* @website http://hertzen.com
 */




PHP.Modules.prototype.var_export = function( variable, ret ) {
    var COMPILER = PHP.Compiler.prototype,
    VARIABLE = PHP.VM.Variable.prototype;
    
    var val = "";
   
    switch (variable[ VARIABLE.TYPE ] ) {
        case VARIABLE.STRING:
            val += "'" + variable[ COMPILER.VARIABLE_VALUE ] + "'";
            break;
    }
    
    val = new PHP.VM.Variable( val );

    if ( ret === undefined || ret[ COMPILER.VARIABLE_VALUE ] === false) { 
        this.echo( val );
    } else {
        return val;
    }
    
    return new PHP.VM.Variable();

};