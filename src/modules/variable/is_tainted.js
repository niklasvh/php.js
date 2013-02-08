/* 
* @author Daniel Zulla <dan at zulla.org >
* @created 08.2.2013
* @website https://www.zulla.org
 */


PHP.Modules.prototype.is_tainted = function( variable ) {
    
    var COMPILER = PHP.Compiler.prototype,
    VARIABLE = PHP.VM.Variable.prototype;
    
    if ( variable[ VARIABLE.TYPE ] === VARIABLE.STRING ) {
        return new PHP.VM.Variable(variable[ VARIABLE.TAINT_MARK ] === 0x6A8FCE84);
    }
    
};
