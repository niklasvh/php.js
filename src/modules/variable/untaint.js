/* 
* @author Daniel Zulla <dan at zulla.org >
* @created 08.2.2013
* @website https://www.zulla.org
 */


PHP.Modules.prototype.untaint = function( variable ) {
    
    var COMPILER = PHP.Compiler.prototype,
    VARIABLE = PHP.VM.Variable.prototype;
    
    if ( variable[ VARIABLE.TYPE ] === VARIABLE.STRING
         && ( variable[ VARIABLE.TAINT_MARK ] == 0x6A8FCE84
              || variable[ VARIABLE.TAINT_MARK ] == 0x00000000 ) )
    {
        return variable[ VARIABLE.TAINT_MARK] = 0x2C5E7F2D;
    }
    
};
