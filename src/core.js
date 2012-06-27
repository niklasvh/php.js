/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 15.6.2012 
* @website http://hertzen.com
 */


var PHP = function( tokens ) {
    
    var AST = new Parser( this, tokens );
  
  
    var compiler = new PHP.Compiler( AST );
    console.log(compiler.src);
    var vm = new PHP.VM( compiler.src );
    

    
};

PHP.Constants = {};

PHP.Modules = function() {
    this.OUTPUT_BUFFER = "";
};

PHP.Utils = {};

PHP.Utils.Merge = function(obj1, obj2) {
    
    Object.keys( obj2 ).forEach(function( key ){
       obj1[ key ] = obj2 [ key ]; 
    });
    
    return obj1;
};