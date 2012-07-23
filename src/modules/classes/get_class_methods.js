/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 12.7.2012 
* @website http://hertzen.com
 */




PHP.Modules.prototype.get_class_methods = function( object ) {
    var COMPILER = PHP.Compiler.prototype,
    VARIABLE = PHP.VM.Variable.prototype;
    
    var prefix = PHP.VM.Class.METHOD,
    items = [],
    classObj,
    index = 0;

    if ( object[ VARIABLE.TYPE ] === VARIABLE.STRING ) {
        classObj = this.$Class.Get( object[ COMPILER.VARIABLE_VALUE ]).prototype;
    } else if ( object[ VARIABLE.TYPE ] === VARIABLE.OBJECT ) {
        classObj =  object[ COMPILER.VARIABLE_VALUE ];
    }
    var item = PHP.VM.Array.arrayItem;
       
    

    for ( var key in classObj )  {
        if ( key.substring(0, prefix.length ) === prefix ) {
            var name = key.substring( prefix.length );
            
            
            items.push( item( index++, classObj[ PHP.VM.Class.METHOD_REALNAME + name ]) );
        }
    }

    return this.array( items );
    
    
};