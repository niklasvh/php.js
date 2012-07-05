/* 
 * @author Niklas von Hertzen <niklas at hertzen.com>
 * @created 26.6.2012 
 * @website http://hertzen.com
 */


PHP.VM.Class = function( ENV, classRegistry, magicConstants ) {
    
    var methodPrefix = PHP.VM.Class.METHOD,
    methodArgumentPrefix = "_$_",
    propertyPrefix = PHP.VM.Class.PROPERTY,
    methodTypePrefix = "$£",
    COMPILER = PHP.Compiler.prototype,
    VARIABLE = PHP.VM.Variable.prototype,
    __call = "__call",
    __set = "__set",
    __get = "__get",
    PRIVATE = "PRIVATE",
    __construct = "__construct";
    
    
    // helper function for checking whether variable/method is of type
    function checkType( value, type) {
        return ((value & PHP.VM.Class[ type ]) === PHP.VM.Class[ type ]);
    }
    
    return function() {
       
        var className = arguments[ 0 ], 
        classType = arguments[ 1 ], 
        opts = arguments[ 2 ],
        props = {},
        
        callMethod = function( methodName, args ) {
            var $ = PHP.VM.VariableHandler(),
            argumentObj = this[ methodArgumentPrefix + methodName ];
            
            
            if ( Array.isArray(argumentObj) ) {
                argumentObj.forEach( function( arg, index ) {
                    // assign arguments to correct variable names
                    if ( args[ index ] !== undefined ) {
                        if ( args[ index ] instanceof PHP.VM.VariableProto) {
                            $( arg.name )[ COMPILER.VARIABLE_VALUE ] = args[ index ][ COMPILER.VARIABLE_VALUE ];
                        } else {
                            $( arg.name )[ COMPILER.VARIABLE_VALUE ] = args[ index ];
                        }
                    } else {
                        // no argument passed for the specified index
                        $( arg.name )[ COMPILER.VARIABLE_VALUE ] = (new PHP.VM.Variable())[ COMPILER.VARIABLE_VALUE ];
                    }
                

                });
            }
            /*
            args.forEach(function( arg, index ) {
                if (arg instanceof PHP.VM.VariableProto) {
                    $( argumentObj[ index ].name ).$ = arg.$;
                } else {
                    $( argumentObj[ index ].name ).$ = arg;
                }
                
            }, this);
           */

            magicConstants.METHOD = this[ PHP.VM.Class.METHOD_PROTOTYPE + methodName ][ COMPILER.CLASS_NAME ] + "::" + methodName;
            
            return this[ methodPrefix + methodName ].call( this, $ );
        };
   
        var Class = function( ctx ) {
           
            Object.keys( props ).forEach(function( propertyName ){
                if ( Array.isArray( props[ propertyName ] ) ) {
                    this[ propertyPrefix + propertyName ] = new PHP.VM.Variable( [] );
                } else {
                    this[ propertyPrefix + propertyName ] = new PHP.VM.Variable( props[ propertyName ] );
                }
               
            }, this);
            
            // call constructor
            
            if ( ctx !== true ) {
                // check if we are extending class, i.e. don't call constructors
                 
                // PHP 5 style constructor in current class
                
                if ( Object.getPrototypeOf( this ).hasOwnProperty(  methodPrefix + __construct  ) ) {
                    return callMethod.call( this, __construct, Array.prototype.slice.call( arguments, 1 ) );         
                }
                
                // PHP 4 style constructor in current class
                
                else if ( Object.getPrototypeOf( this ).hasOwnProperty(  methodPrefix + className  ) ) {
                    return callMethod.call( this, className, Array.prototype.slice.call( arguments, 1 ) );         
                }
                
                // PHP 5 style constructor in any inherited class
                
                else if ( typeof this[ methodPrefix + __construct ] === "function" ) {
                    return callMethod.call( this, __construct, Array.prototype.slice.call( arguments, 1 ) );         
                }
                
                // PHP 4 style constructor in any inherited class
                
                else {
                    var proto = this;
                    
                    while ( ( proto = Object.getPrototypeOf( proto ) ) instanceof PHP.VM.ClassPrototype ) {
                        
                        if ( proto.hasOwnProperty( methodPrefix + proto[ COMPILER.CLASS_NAME  ] ) ) {
                           
                            return callMethod.call( proto, proto[ COMPILER.CLASS_NAME  ], Array.prototype.slice.call( arguments, 1 ) ); 
                        }
                            
                            
                    }
                        
                }
            }
           
     

        }, 
        methods = {};
        
        /*
         * Declare class property
         */       
        
        methods [ COMPILER.CLASS_PROPERTY ] = function( propertyName, propertyType, propertyDefault ) {
            props[ propertyName ] = propertyDefault;
            
            /*
            Object.defineProperty( Class.prototype, propertyPrefix + propertyName, {
                value: new PHP.VM.Variable( propertyDefault )
            });
             */
            return methods;
        };

        /*
         * Declare method
         */

        methods [ COMPILER.CLASS_METHOD ] = function( methodName, methodType, methodProps, methodFunc ) {
            
            /*
             * signature checks
             */
            
            // can't make static non-static
            if ( Class.prototype[ PHP.VM.Class.METHOD_PROTOTYPE + methodName ] !== undefined && checkType( Class.prototype[ methodTypePrefix + methodName ], "STATIC" ) && !checkType( methodType, "STATIC" ) ) {
                ENV[ PHP.Compiler.prototype.ERROR ]( "Cannot make static method " + Class.prototype[ PHP.VM.Class.METHOD_PROTOTYPE + methodName ][ COMPILER.CLASS_NAME ] + "::" + methodName + "() non static in class " + className, PHP.Constants.E_ERROR, true );
            }
            
            // can't make non-static  static
            if ( Class.prototype[ PHP.VM.Class.METHOD_PROTOTYPE + methodName ] !== undefined && !checkType( Class.prototype[ methodTypePrefix + methodName ], "STATIC" ) && checkType( methodType, "STATIC" ) ) {
                ENV[ PHP.Compiler.prototype.ERROR ]( "Cannot make non static method " + Class.prototype[ PHP.VM.Class.METHOD_PROTOTYPE + methodName ][ COMPILER.CLASS_NAME ] + "::" + methodName + "() static in class " + className, PHP.Constants.E_ERROR, true );
            }
            
           
            // __call
            if ( methodName === __call  ) { 
                
                if ( methodProps.length !== 2 ) {
                    ENV[ PHP.Compiler.prototype.ERROR ]( "Method " + className + "::" + methodName + "() must take exactly 2 arguments", PHP.Constants.E_ERROR, true );
                }
                
                if ( !checkType( methodType, "PUBLIC" ) || checkType( methodType, "STATIC" ) ) {
                    ENV[ PHP.Compiler.prototype.ERROR ]( "The magic method " + methodName + "() must have public visibility and cannot be static", PHP.Constants.E_CORE_WARNING, true );
                }
                
            }
            
            // __get
            
            else if ( methodName === __get  ) { 
                if ( methodProps.length !== 1 ) {
                    ENV[ PHP.Compiler.prototype.ERROR ]( "Method " + className + "::" + methodName + "() must take exactly 1 argument", PHP.Constants.E_ERROR, true );
                }
            }
            
            // __set
            
            else if ( methodName === __set  ) { 
                if ( methodProps.length !== 2 ) {
                    ENV[ PHP.Compiler.prototype.ERROR ]( "Method " + className + "::" + methodName + "() must take exactly 2 arguments", PHP.Constants.E_ERROR, true );
                }
            }
            
            // end signature checks
            
            Object.defineProperty( Class.prototype, PHP.VM.Class.METHOD_PROTOTYPE + methodName, {
                value: Class.prototype 
            });
            
            Object.defineProperty( Class.prototype, methodTypePrefix + methodName, {
                value: methodType 
            });
            
            Object.defineProperty( Class.prototype, methodPrefix + methodName, {
                value: methodFunc 
            });
            
            Object.defineProperty( Class.prototype, methodArgumentPrefix + methodName, {
                value: methodProps 
            });
            
            return methods;
        };
            
        methods [ COMPILER.CLASS_DECLARE ] = function() {
            classRegistry[ className.toLowerCase() ] = Class;
               
            return Class;
        };
        
        
        
        
        if (opts.Extends  !== undefined) {
            Class.prototype = new classRegistry[ opts.Extends.toLowerCase() ]( true );
        } else {
            Class.prototype = new PHP.VM.ClassPrototype();
        }
        
        /*
    
        if (opts.Extends  !== undefined) {
            Class.prototype = new classRegistry[ opts.Extends ]( true );
        }
         */
    
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
                    
                    
                    // determine which __call to use in case there are several defined
                    if ( ctx instanceof PHP.VM ) {
                        // normal call, use current context
                        return callMethod.call( this, __call, [ new PHP.VM.Variable( methodName ), new PHP.VM.Variable( PHP.VM.Array.fromObject.call( ENV, args ) ) ] );
                    } else {
                        // static call, ensure current scope's __call() is favoured over the specified class's  __call()
                        return ctx.callMethod.call( ctx, __call, [ new PHP.VM.Variable( methodName ), new PHP.VM.Variable( PHP.VM.Array.fromObject.call( ENV, args ) ) ] );
                    }
               
                }
                  
            } else {
              
                if ( checkType( this[ methodTypePrefix + methodName ], PRIVATE ) && this[ COMPILER.CLASS_NAME ] !== ctx[ COMPILER.CLASS_NAME ] ) {
                    console.log( ctx );
                    ENV[ PHP.Compiler.prototype.ERROR ]( "Call to private method " + className + "::" + methodName + "() from context '" + ((ctx instanceof PHP.VM.ClassPrototype) ? ctx[ COMPILER.CLASS_NAME ] : '') + "'", PHP.Constants.E_ERROR, true );
   
                    
                }
                
              
            }
            
           
            return this.callMethod.call( this, methodName, args );
            
           
            
           
              
        };
        
        Class.prototype.callMethod = callMethod;
        
        Class.prototype[  COMPILER.STATIC_CALL  ] = function( ctx, methodName ) {
            return Class.prototype[ COMPILER.METHOD_CALL ].apply( this, arguments);
            
            this[ COMPILER.METHOD_CALL ].apply( this, arguments );
 
        };
        
       
        
        Class.prototype[ COMPILER.CLASS_PROPERTY_GET ] = function( ctx, propertyName ) {
           
            if ( this[ propertyPrefix + propertyName ] === undefined ) {


                var obj = {}, props = {};
                
                // property set
                if ( this[ methodPrefix + __set ] !== undefined ) {
                    obj [ COMPILER.ASSIGN ] = function( value ) {
                        console.log( propertyName, value );
                        callMethod.call( this, __set,  [ new PHP.VM.Variable( propertyName ), value ] );        
                    }.bind( this );
                }
                
                // Post inc ++
                // getting value
                obj [ COMPILER.POST_INC ] = function() {
                    console.log( "getting ");
                    if ( this[ methodPrefix + __get ] !== undefined ) {
                     
                        var value = callMethod.call( this, __get, [ new PHP.VM.Variable( propertyName ) ] );  
                        
                        console.log('sup', obj);
                        // setting ++
                        if ( this[ methodPrefix + __set ] !== undefined ) {
                            
                            callMethod.call( this, __set,  [ new PHP.VM.Variable( propertyName ), ( value instanceof PHP.VM.Variable ) ? ++value[ COMPILER.VARIABLE_VALUE ] : new PHP.VM.Variable( 1 ) ] );    
                        }
                        console.log( obj );
                        return value;
                
                    }
                }.bind( this );
                
                var $this = this;
                // property get
                if ( this[ methodPrefix + __get ] !== undefined ) {
                  
                    props[ COMPILER.VARIABLE_VALUE ] = {
                        get : function(){
                            console.log( "getting", propertyName );
                            console.log( $this );
                            return callMethod.call( $this, __get, [ new PHP.VM.Variable( propertyName ) ] )[ COMPILER.VARIABLE_VALUE ];   
                             
                            
                        }
                    };
                    
                    props[ VARIABLE.TYPE ] = {
                        get: function() {
                            console.log( VARIABLE.TYPE );
                            obj = callMethod.call( $this, __get, [ new PHP.VM.Variable( propertyName ) ] );   
                            return obj[ VARIABLE.TYPE ];
                        }
                      
                    };
                    
                    Object.defineProperties( obj, props );
                          
                }
                return obj;
            /*
                Object.defineProperty( obj, COMPILER.VARIABLE_VALUE,
                {
                    get : function(){
                        
                        if ( this[ methodPrefix + __get ] !== undefined ) {
                            var value = callMethod.call( this, __get,  new PHP.VM.Variable( propertyName ) );   
                            return value[ COMPILER.VARIABLE_VALUE ]; 
                        }
                    },  
                    set : function( value ) {
                        if ( this[ methodPrefix + __set ] !== undefined ) {
                            callMethod.call( this, __set,  new PHP.VM.Variable( propertyName ), value );                      
                        }
                    }
                }
                );
                    
                    */
                    
                
                
                
            } else {
                return this[ propertyPrefix + propertyName ];
            }
            
            
        };
        
        
        return methods;
    };
    

    
};
PHP.VM.ClassPrototype = function() {};

PHP.VM.Class.METHOD = "_";

PHP.VM.Class.METHOD_PROTOTYPE = "$MP";

PHP.VM.Class.PROPERTY = "$$";

PHP.VM.Class.Predefined = {};

PHP.VM.Class.PUBLIC = 1;
PHP.VM.Class.PROTECTED = 2;
PHP.VM.Class.PRIVATE = 4;
PHP.VM.Class.STATIC = 8;
PHP.VM.Class.ABSTRACT = 16;
PHP.VM.Class.FINAL = 32;

