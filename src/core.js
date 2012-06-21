/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 15.6.2012 
* @website http://hertzen.com
 */


var PHP = function( tokens ) {
    
    var parser = new Parser( this, tokens );
    console.log(parser);
    
};

PHP.Constants = {};

PHP.Utils = {};

PHP.Utils.Merge = function(obj1, obj2) {
    
    Object.keys( obj2 ).forEach(function( key ){
       obj1[ key ] = obj2 [ key ]; 
    });
    
    return obj1;
};