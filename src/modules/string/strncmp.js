/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 2.7.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.strncmp = function( str1, str2, len ) {
    
    var COMPILER = PHP.Compiler.prototype,
    VAR = PHP.VM.Variable.prototype;
    
  //  console.log(( str1[ COMPILER.VARIABLE_VALUE ].substring(0, len[ COMPILER.VARIABLE_VALUE ] ) === str2[ COMPILER.VARIABLE_VALUE ].substring(0, len[ COMPILER.VARIABLE_VALUE ] ) ), str1[ COMPILER.VARIABLE_VALUE ], str2[ COMPILER.VARIABLE_VALUE ]);
    // TODO add real
    
    if ( ( str1[ VAR.CAST_STRING ][ COMPILER.VARIABLE_VALUE ].substring(0, len[ COMPILER.VARIABLE_VALUE ] ) === str2[ VAR.CAST_STRING ][ COMPILER.VARIABLE_VALUE ].substring(0, len[ COMPILER.VARIABLE_VALUE ] ) ) ) {
         return new PHP.VM.Variable( 0 );
    } else {
         return new PHP.VM.Variable( 1 );
    }
   
    
    
};