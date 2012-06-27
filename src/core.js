/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 15.6.2012 
* @website http://hertzen.com
 */


var PHP = function( tokens ) {
    
    this.AST = new Parser( this, tokens );
  
  
    this.compiler = new PHP.Compiler( this.AST );
    console.log(this.compiler.src);
    this.vm = new PHP.VM( this.compiler.src );
    

    
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