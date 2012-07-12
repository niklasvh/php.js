/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 27.6.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.explode = function( delim, string ) {
    var VARIABLE = PHP.VM.Variable.prototype,
    COMPILER = PHP.Compiler.prototype,
    item = PHP.VM.Array.arrayItem;
    
    if ( string[ VARIABLE.TYPE ] === VARIABLE.STRING ) {
        // Defaults to an empty string
        var items = string[ COMPILER.VARIABLE_VALUE ].split( delim[ COMPILER.VARIABLE_VALUE ] ),
        arr = [];
        
        
        items.forEach(function( val, index ){
            arr.push( item( index, val ) )
        });
       
        return this.array( arr );
    }

};