/* 
* @author Eric Lewis <elewis at boxy.co>
* @created 25.7.2012 
* @website www.boxy.co
 */


PHP.Modules.prototype.ltrim = function( variable ) {
    var COMPILER = PHP.Compiler.prototype,
    VARIABLE = PHP.VM.Variable.prototype;
    
    if ( variable[ VARIABLE.TYPE ] !== VARIABLE.STRING ) {
        variable = variable[ VARIABLE.CAST_STRING ];
    }
    
    charlist = !charlist ? ' \\s\u00A0' : (charlist + '').replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, '$1');
    var re = new RegExp('^[' + charlist + ']+', 'g');
    
    return new PHP.VM.Variable( (variable + '').replace(re, '') );
    
    
};