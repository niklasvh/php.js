/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 15.6.2012 
* @website http://hertzen.com
 */


var PHP = function( tokens, opts ) {
    
    this.AST = new Parser( this, tokens );
  
    console.log( opts );
    this.compiler = new PHP.Compiler( this.AST );
    console.log(this.compiler.src);
    this.vm = new PHP.VM( this.compiler.src, opts );
    

    
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

PHP.Utils.QueryString = function( str ) {
    
    var variables = str.split(/&/);
    
    var items = {};
    
    variables.forEach( function( variable ) {
        
        var parts = variable.split(/=/),
            key = decodeURIComponent( parts[ 0 ] ),
            value = (parts.length > 1 ) ? decodeURIComponent( parts[ 1 ] ) : null;
        
            var arraySearch = key.match(/^(.*)\[\]$/);
        
            if ( arraySearch !== null ) {
                console.log( arraySearch );
            } else  {
                items[ key ] = ( value !== null) ? value.replace(/\+/g," ") : null;
            }
        
        }, this);
    
    return items;
    
    };
    
    