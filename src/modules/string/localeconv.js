/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 20.7.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.localeconv = function(  ) {
    var COMPILER = PHP.Compiler.prototype,
    VARIABLE = PHP.VM.Variable.prototype,
     item = PHP.VM.Array.arrayItem;
    
    var locale = this.$locale;
   
    
    // todo add all
    return this.array( [ 
        item( "decimal_point", locale.decimal_point ), 
        item( "thousands_sep", locale.thousands_sep ) ] 
);
    
};