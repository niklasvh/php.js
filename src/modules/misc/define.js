/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 7.7.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.define = function( name, value, case_insensitive ) {
    
    var COMPILER = PHP.Compiler.prototype,
    
    variableValue = value[ COMPILER.VARIABLE_VALUE ],
    variableName = name[ COMPILER.VARIABLE_VALUE ];
    
    if ( variableName.indexOf("::") !== -1 ) {
          this.ENV[ COMPILER.ERROR ]("Class constants cannot be defined or redefined", PHP.Constants.E_CORE_WARNING, true );    
          return new PHP.VM.Variable( false );
    }
   
    
    this[ COMPILER.CONSTANTS ][ COMPILER.CONSTANT_SET ]( variableName, variableValue );
    
     return new PHP.VM.Variable( true );
  
};