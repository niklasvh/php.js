/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 4.7.2012 
* @website http://hertzen.com
 */

PHP.Modules.prototype.call_user_func_array = function( callback ) {
    var COMPILER = PHP.Compiler.prototype,
    VARIABLE = PHP.VM.Variable.prototype,
    Class,
    methodParts;
  
    if ( callback[ VARIABLE.TYPE ] === VARIABLE.ARRAY ) {

        var ClassVar = callback[ COMPILER.VARIABLE_VALUE ][ COMPILER.METHOD_CALL ]( this, COMPILER.ARRAY_GET, 0 ),
        methodName = callback[ COMPILER.VARIABLE_VALUE ][ COMPILER.METHOD_CALL ]( this, COMPILER.ARRAY_GET, 1 )[ COMPILER.VARIABLE_VALUE ],
        args;
        
        methodParts = methodName.split("::");
        
      
       
        if ( ClassVar[ VARIABLE.TYPE] === VARIABLE.STRING ) {
            Class = this.$Class.Get(ClassVar[ COMPILER.VARIABLE_VALUE ]).prototype;
        } else if ( ClassVar[ VARIABLE.TYPE] === VARIABLE.OBJECT ) {
            Class = ClassVar[ COMPILER.VARIABLE_VALUE ];
        }
        
        // method call
        if ( methodParts.length === 1 ) {
            args = [ this, methodName].concat( Array.prototype.slice.call( arguments, 1 ) );
            
            if ((Class[ "$£" + methodName] & PHP.VM.Class.PRIVATE) === PHP.VM.Class.PRIVATE) {
                    this[ COMPILER.ERROR ]( "call_user_func_array() expects parameter 1 to be a valid callback, cannot access private method " + Class[ COMPILER.CLASS_NAME ] + "::"+ methodName + "()", PHP.Constants.E_WARNING, true );
            
            }
            
            
            return Class[ COMPILER.METHOD_CALL ].apply( Class, args );
        } else {
            args = [ this, methodParts[ 0 ], methodParts[ 1 ] ].concat( Array.prototype.slice.call( arguments, 1 ) );
            return Class[ COMPILER.STATIC_CALL ].apply( Class, args );
        }
        
    } else {
        methodParts = callback[ COMPILER.VARIABLE_VALUE ].split("::");
        
        if ( methodParts.length === 1 ) {
            // function call
            args = Array.prototype.slice.call( arguments, 1 );
            
                return this[ callback[ COMPILER.VARIABLE_VALUE ]].apply( this, args  );
        } else {
            // static call
            
            if ( this.$Class.__autoload(methodParts[ 0 ]) ) {
                Class = this.$Class.Get(methodParts[ 0 ]).prototype;
            
                args = [ this, methodParts[ 0 ], methodParts[ 1 ] ].concat( Array.prototype.slice.call( arguments, 1 ) );
            
                return Class[ COMPILER.STATIC_CALL ].apply( Class, args );
            } else {
                this[ PHP.Compiler.prototype.ERROR ]( "call_user_func() expects parameter 1 to be a valid callback, class '" + methodParts[ 0 ] + "' not found", PHP.Constants.E_CORE_WARNING, true );
            }
            

        }
       
       
    }
    
   
  
    
};
