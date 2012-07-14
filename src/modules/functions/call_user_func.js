/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 4.7.2012 
* @website http://hertzen.com
 */

PHP.Modules.prototype.call_user_func = function( callback ) {
    var COMPILER = PHP.Compiler.prototype,
    VARIABLE = PHP.VM.Variable.prototype;
 
    if ( callback[ VARIABLE.TYPE ] === VARIABLE.ARRAY ) {

        var ClassVar = callback[ COMPILER.VARIABLE_VALUE ][ COMPILER.METHOD_CALL ]( this, COMPILER.ARRAY_GET, 0 ),
        methodName = callback[ COMPILER.VARIABLE_VALUE ][ COMPILER.METHOD_CALL ]( this, COMPILER.ARRAY_GET, 1 )[ COMPILER.VARIABLE_VALUE ],
        methodParts = methodName.split("::"),
        args,
        Class;
        
      
        
        if ( ClassVar[ VARIABLE.TYPE] === VARIABLE.STRING ) {
            Class = this.$Class.Get(ClassVar[ COMPILER.VARIABLE_VALUE ]).prototype;
        } else if ( ClassVar[ VARIABLE.TYPE] === VARIABLE.OBJECT ) {
            Class = ClassVar[ COMPILER.VARIABLE_VALUE ];
        }
        
        if ( methodParts.length === 1 ) {
            args = [ this, methodName].concat( Array.prototype.slice.call( arguments, 1 ) );
            return Class[ COMPILER.METHOD_CALL ].apply( Class, args );
        } else {
            args = [ this, methodParts[ 0 ], methodParts[ 1 ] ].concat( Array.prototype.slice.call( arguments, 1 ) );
            return Class[ COMPILER.STATIC_CALL ].apply( Class, args );
        }
        
    } else {
        args = Array.prototype.slice.call( arguments, 1 );
        
            return this[ callback[ COMPILER.VARIABLE_VALUE ]].apply( this, args  );
       
       
    }
    
   
  
    
};
