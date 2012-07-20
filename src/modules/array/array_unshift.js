/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 16.7.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.array_unshift = function( array ) {
    var COMPILER = PHP.Compiler.prototype,
    VARIABLE = PHP.VM.Variable.prototype,
    ARRAY = PHP.VM.Array.prototype,
    CLASS_PROPERTY = PHP.VM.Class.PROPERTY;
    
    var items = Array.prototype.slice.call( arguments, 1),
    vals = [],
    lastIndex,
    keys = [];
    items.forEach(function( item, index ){
        if ( item[ VARIABLE.IS_REF ] ) {
            vals.push( item );
        } else {
            vals.push( new PHP.VM.Variable( item[ COMPILER.VARIABLE_VALUE ]) );
        }
        keys.push( index );
        lastIndex = index;
    });
    lastIndex++;
    var value = Array.prototype.unshift.apply(array[ COMPILER.VARIABLE_VALUE ][ CLASS_PROPERTY + ARRAY.VALUES ][ COMPILER.VARIABLE_VALUE ], vals);
    
    // remap keys
    array[ COMPILER.VARIABLE_VALUE ][ CLASS_PROPERTY + ARRAY.KEYS ][ COMPILER.VARIABLE_VALUE ].forEach(function( key, index ){
        // todo take into account other type of keys
        if ( typeof key === "number" && key % 1 === 0) {
            array[ COMPILER.VARIABLE_VALUE ][ CLASS_PROPERTY + ARRAY.KEYS ][ COMPILER.VARIABLE_VALUE ][ index ] = key + lastIndex;
        }
    });
    
    Array.prototype.unshift.apply(array[ COMPILER.VARIABLE_VALUE ][ CLASS_PROPERTY + ARRAY.KEYS ][ COMPILER.VARIABLE_VALUE ], keys);
    array[ COMPILER.VARIABLE_VALUE ][ CLASS_PROPERTY + ARRAY.POINTER][ COMPILER.VARIABLE_VALUE ] -= vals.length;
        
    return new PHP.VM.Variable( value.length );

};