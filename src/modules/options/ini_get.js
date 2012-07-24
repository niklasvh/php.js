/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 15.7.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.ini_get = function( varname ) {
    var COMPILER = PHP.Compiler.prototype,
    old = this.$ini[ varname[ COMPILER.VARIABLE_VALUE ] ];
   
    if (old === undefined ) {
        return new PHP.VM.Variable( false );
    } else {
        
        old = old.toString().replace(/^On$/i,"1");
        old = old.toString().replace(/^Off$/i,"0");
        
        return new PHP.VM.Variable( old + "" );
    }
    
    
  
};
