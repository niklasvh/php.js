/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 11.7.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.function_exists = function( function_name ) {
    var COMPILER = PHP.Compiler.prototype,
    VARIABLE = PHP.VM.Variable.prototype;
    

    return new PHP.VM.Variable(typeof this[ function_name[ COMPILER.VARIABLE_VALUE ]] === "function");
    
    
   
  
    
};
