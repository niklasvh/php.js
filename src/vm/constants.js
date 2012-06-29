/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 29.6.2012 
* @website http://hertzen.com
 */

PHP.VM.Constants = function( predefined ) {
    
    var constants = {},
    methods = {};
    
    Object.keys( predefined ).forEach(function( key ){
       
        constants[ key ] = predefined[ key ];
    }, this); 
    
    methods[ PHP.Compiler.prototype.CONSTANT_GET ] = function( constantName ) {
        return new PHP.VM.Variable( constants[ constantName ] );    
    };
    
    return methods;
    
};