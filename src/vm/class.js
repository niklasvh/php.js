/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 26.6.2012 
* @website http://hertzen.com
 */


PHP.VM.Class = function( ENV, classRegistry, magicConstants ) {
    
    var methodPrefix = "_",
    propertyPrefix = "$$",
    COMPILER = PHP.Compiler.prototype,
    __call = "__call";
    
    
    return function() {
       
        var className = arguments[ 0 ], 
        classType = arguments[ 1 ], 
        opts = arguments[ 2 ];
   
        var Class = function() {
        
            
     

        }, 
        methods = {};
        
         /*
         * Declare class property
         */       
        
        methods [ COMPILER.CLASS_PROPERTY ] = function( propertyName, propertyType, propertyDefault ) {
            
            Object.defineProperty( Class.prototype, propertyPrefix + propertyName, {
               value: propertyDefault 
            });
            
            return methods;
        };

        /*
         * Declare method
         */

        methods [ COMPILER.CLASS_METHOD ] = function( methodName, methodType, methodProps, methodFunc ) {
            
            /*
             * signature checks
             */
            if ( methodName === __call && methodProps.length !== 2 ) {
                ENV[ PHP.Compiler.prototype.ERROR ]( "Method " + methodName + "::__call() must take exactly 2 arguments in %s__call_002.php on line %d" );
                
            }
            
            
            Object.defineProperty( Class.prototype, methodPrefix + methodName, {
               value: methodFunc 
            });
            
            return methods;
        };
            
        methods [ COMPILER.CLASS_DECLARE ] = function() {
            classRegistry[ className ] = Class;
               
            return Class;
        };
        
        

    
        if (opts.Extends  !== undefined) {
            Class.prototype = new classRegistry[ opts.Extends ]( true );
        }
    
        if (opts.Implements !== undefined ) {
            implementArr = opts.Implements
        }
        
        Class.prototype[ COMPILER.CLASS_NAME ] = className;
        
        Class.prototype[ COMPILER.METHOD_CALL ] = function( ctx, methodName ) {
              
              var args = Array.prototype.slice.call( arguments, 2 );
 
              if ( typeof this[ methodPrefix + methodName ] !== "function" ) {
                  // no method with that name found
                  
                  if ( typeof this[ methodPrefix + __call ] === "function" ) {
                      // __call method defined, let's call that instead then
                      magicConstants.METHOD = this[ COMPILER.CLASS_NAME ] + ":" + __call;
                      return this[ methodPrefix + __call ]( methodName, args );
                      
                  }
                  
              }
              magicConstants.METHOD = this[ COMPILER.CLASS_NAME ] + ":" + methodName;
              return this[ methodPrefix + methodName ]( args );
              
              
        };
        
        Class.prototype[  COMPILER.STATIC_CALL  ] = function( ctx, methodName ) {
            Class.prototype[ COMPILER.METHOD_CALL ].apply( ctx, arguments );
         //   console.log( ctx );
        //  console.log( className );  
        };
        
       
        
        Class.prototype[ COMPILER.CLASS_PROPERTY_GET ] = function( ctx, propertyName ) {
            
            
            return this[ propertyPrefix + propertyName ];
            
        };
        
        
        return methods;
    };
    

    
};