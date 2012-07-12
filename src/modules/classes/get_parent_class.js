/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 13.7.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.get_parent_class = function( object ) {
    var COMPILER = PHP.Compiler.prototype,
    VARIABLE = PHP.VM.Variable.prototype,
    classObj,
    parent;
    
    if ( object[ VARIABLE.TYPE ] === VARIABLE.STRING ) {
        classObj = this.$Class.Get( object[ COMPILER.VARIABLE_VALUE ] ).prototype;
    } else {
        classObj = Object.getPrototypeOf(object[ COMPILER.VARIABLE_VALUE ] );
    }
    
    if ( (parent = Object.getPrototypeOf( classObj )[ COMPILER.CLASS_NAME ]) === undefined ) {
        return new PHP.VM.Variable( false );
    } else {
        return new PHP.VM.Variable( parent );
    }
    
};