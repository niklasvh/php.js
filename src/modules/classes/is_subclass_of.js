/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 13.7.2012 
* @website http://hertzen.com
 */




PHP.Modules.prototype.is_subclass_of = function( object, classNameObj ) {
    var COMPILER = PHP.Compiler.prototype,
    VARIABLE = PHP.VM.Variable.prototype,
    classObj,
    parent,
    className = classNameObj[ COMPILER.VARIABLE_VALUE ];
    
    if ( object[ VARIABLE.TYPE ] === VARIABLE.STRING ) {
        classObj = this.$Class.Get( object[ COMPILER.VARIABLE_VALUE ] ).prototype;
    } else {
        classObj = Object.getPrototypeOf(object[ COMPILER.VARIABLE_VALUE ] );
    }
    
    
    while ( (parent = Object.getPrototypeOf( classObj )[ COMPILER.CLASS_NAME ]) !== undefined && parent !== className ) {
        
    }
    
    if ( parent === undefined ) {
        return new PHP.VM.Variable( false );
    } else {
        return new PHP.VM.Variable( true );
    }
    
};