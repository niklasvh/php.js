/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 17.7.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.get_declared_classes = function( ) {
    var COMPILER = PHP.Compiler.prototype,
    VARIABLE = PHP.VM.Variable.prototype,
    item = PHP.VM.Array.arrayItem;
    
    var items = [];
    this.$Class.DeclaredClasses().forEach(function( name, index ){
        items.push( item( index, name ));
    });
    
    return this.array( items );
    
};