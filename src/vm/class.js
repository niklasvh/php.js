/* 
 * @author Niklas von Hertzen <niklas at hertzen.com>
 * @created 26.6.2012 
 * @website http://hertzen.com
 */


PHP.VM.Class = function( ENV, classRegistry, magicConstants, initiatedClasses, undefinedConstants ) {
    
    var methodPrefix = PHP.VM.Class.METHOD,
    methodArgumentPrefix = "_$_",
    propertyPrefix = PHP.VM.Class.PROPERTY,
    methodTypePrefix = "$£",
    propertyTypePrefix = "$£$",
    COMPILER = PHP.Compiler.prototype,
    VARIABLE = PHP.VM.Variable.prototype,
    __call = "__call",
    __set = "__set",
    __get = "__get",
    PRIVATE = "PRIVATE",
    PUBLIC = "PUBLIC",
    STATIC = "STATIC",
    ABSTRACT = "ABSTRACT",
    FINAL = "FINAL",
    INTERFACE = "INTERFACE",
    PROTECTED = "PROTECTED",
    __destruct = "__destruct",
    __construct = "__construct";
    
    
    // helper function for checking whether variable/method is of type
    function checkType( value, type) {
        if ( type === PUBLIC) {
            return ((value & PHP.VM.Class[ type ]) === PHP.VM.Class[ type ]) || (value  === PHP.VM.Class[ STATIC ]);
        } else {
            return ((value & PHP.VM.Class[ type ]) === PHP.VM.Class[ type ]);
        }
        
    }
    
    var buildVariableContext = function( methodName, args, className ) {
        
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
                    
                    if ( arg[ COMPILER.PROPERTY_DEFAULT ] !== undefined ) {
                        console.log('setting default', arg[ COMPILER.PROPERTY_DEFAULT ]);
                        $( arg.name )[ COMPILER.VARIABLE_VALUE ] = arg[ COMPILER.PROPERTY_DEFAULT ][ COMPILER.VARIABLE_VALUE ];
                    } else {
                        $( arg.name )[ COMPILER.VARIABLE_VALUE ] = (new PHP.VM.Variable())[ COMPILER.VARIABLE_VALUE ];
                    }
                }
                
                
                var classObj,
                typeInterface = false;
               
                // perform type hint check
            
                if ( arg[ COMPILER.PROPERTY_TYPE ] !== undefined ) {
                    /*
                    if ( args[ index ] instanceof PHP.VM.VariableProto) {
                        classObj = args[ index ][ COMPILER.VARIABLE_VALUE ];
                    } else {
                        classObj = args[ index ];
                    }
                    */
                   
                    classObj = $( arg.name )[ COMPILER.VARIABLE_VALUE ];
                   
                    if ( arg[ COMPILER.PROPERTY_DEFAULT ] === undefined || (arg[ COMPILER.PROPERTY_DEFAULT ][ VARIABLE.TYPE ] !==  VARIABLE.NULL && $( arg.name )[ VARIABLE.TYPE ] !== VARIABLE.NULL ) ) {
                    
                        var argPassedTo = "Argument " + (index + 1) + " passed to " + className + "::" + methodName + "() must ",
                        calledIn = ", called in " + ENV[ COMPILER.GLOBAL ]('_SERVER')[ COMPILER.VARIABLE_VALUE ][ COMPILER.METHOD_CALL ]( this, COMPILER.ARRAY_GET, 'SCRIPT_FILENAME' )[ COMPILER.VARIABLE_VALUE ] + " on line 1 and defined",
                        argGiven,
                        variableType = $( arg.name )[ VARIABLE.TYPE ],
                        errorMsg;
                    
                        switch ( variableType  ) {
                            
                            case VARIABLE.OBJECT:
                                argGiven = ", instance of " + classObj[ COMPILER.CLASS_NAME ] + " given";
                                break;
                            
                            case VARIABLE.INT:
                                argGiven = ", integer given";
                                break;
                            
                        }
                    
                        // check if we are looking for implement or instance
                        // do a check if it exists before getting, so we don't trigger an __autoload
                        if ( ENV.$Class.Exists( arg[ COMPILER.PROPERTY_TYPE ] ) &&  checkType(ENV.$Class.Get( arg[ COMPILER.PROPERTY_TYPE ] ).prototype[ COMPILER.CLASS_TYPE ], INTERFACE)) {
                            typeInterface = true;
                        } 
                        
                        
                        switch( arg[ COMPILER.PROPERTY_TYPE ].toLowerCase() ) {
                            
                            case "array":
                                if ( VARIABLE.ARRAY !== variableType) {
                                    errorMsg = argPassedTo + "be of the type array" + argGiven + calledIn;
                                }
                                break;
                            
                            default:
                                // we are looking for an instance
                                if ( !typeInterface && classObj[ COMPILER.CLASS_NAME ] !== arg[ COMPILER.PROPERTY_TYPE ] ) {
                                    // not of same class type
                                    errorMsg = argPassedTo + "be an instance of " + arg[ COMPILER.PROPERTY_TYPE ] + argGiven + calledIn;
                            
                                }
                     
                                // we are looking for an implementation of interface
                                else if ( typeInterface && classObj[ PHP.VM.Class.INTERFACES ].indexOf( arg[ COMPILER.PROPERTY_TYPE ] ) === -1) {
                                    errorMsg = argPassedTo + "implement interface " + arg[ COMPILER.PROPERTY_TYPE ] + argGiven + calledIn;
                                }
                        }
                      
                        
                        if ( errorMsg !== undefined ) {
                            ENV[ COMPILER.ERROR ]( errorMsg , PHP.Constants.E_RECOVERABLE_ERROR, true );   
                        }
                        
                    }
                }   
                

                

            });
        }
        
        $("$__METHOD__")[ COMPILER.VARIABLE_VALUE ] = className + "::" + methodName;
        
        return $;
    }
    
    
    
    return function() {
       
        var className = arguments[ 0 ], 
        classType = arguments[ 1 ], 
        opts = arguments[ 2 ],
        classDefinition = arguments[ 3 ],
        DECLARED = false,
        props = {},
        
        callMethod = function( methodName, args ) {
            
            console.log('calling ', methodName, this[ PHP.VM.Class.METHOD_PROTOTYPE + methodName ], args);
            
            var $ = buildVariableContext.call( this, methodName, args, this[ PHP.VM.Class.METHOD_PROTOTYPE + methodName ][ COMPILER.CLASS_NAME ] );
           
          
            //magicConstants.METHOD = this[ PHP.VM.Class.METHOD_PROTOTYPE + methodName ][ COMPILER.CLASS_NAME ] + "::" + methodName;
            
            return this[ methodPrefix + methodName ].call( this, $, this[ PHP.VM.Class.METHOD_PROTOTYPE + methodName ] );
        };

        var Class = function( ctx ) {
         
            Object.keys( props ).forEach(function( propertyName ){
                
                if ( checkType(this[propertyTypePrefix + propertyName], STATIC)) {
                // static, so refer to the one and only same value defined in actual prototype

                //  this[ propertyPrefix + propertyName ] = this[ propertyPrefix + propertyName ];
                    
                } else {
                    if ( Array.isArray( props[ propertyName ] ) ) {
                        this[ propertyPrefix + propertyName ] = new PHP.VM.Variable( [] );
                    } else {
                        this[ propertyPrefix + propertyName ] = new PHP.VM.Variable( props[ propertyName ] );
                    }
                }
                
                this [ PHP.VM.Class.CLASS_PROPERTY + className + "_" + propertyPrefix + propertyName] = this[ propertyPrefix + propertyName ];
            }, this);
            
            // call constructor
            
            if ( ctx !== true ) {
                // check if we are extending class, i.e. don't call constructors
                 
                 
                 
                 
                // make sure we aren't initiating an abstract class 
                if (checkType( this[ COMPILER.CLASS_TYPE ], ABSTRACT ) ) {
                    ENV[ PHP.Compiler.prototype.ERROR ]( "Cannot instantiate abstract class " + className, PHP.Constants.E_ERROR, true ); 
                }

                // make sure we aren't initiating an interface 
                if (checkType( this[ COMPILER.CLASS_TYPE ], INTERFACE ) ) {
                    ENV[ PHP.Compiler.prototype.ERROR ]( "Cannot instantiate interface " + className, PHP.Constants.E_ERROR, true ); 
                }
                 
                // register new class initiated into registry (for destructors at shutdown) 
                initiatedClasses.push ( this ); 
                 
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
         * Declare class constant
         */ 
        methods [ COMPILER.CLASS_CONSTANT ] = function( constantName, constantValue ) {
            
            if ( Class.prototype[ PHP.VM.Class.CONSTANT + constantName ] !== undefined ) {
                ENV[ PHP.Compiler.prototype.ERROR ]( "Cannot redefine class constant " + className + "::" + constantName, PHP.Constants.E_ERROR, true );    
            }
            
            
            if ( undefinedConstants[ className + "::" + constantName] !== undefined ) {
                
                Class.prototype[ PHP.VM.Class.CONSTANT + constantName ] = undefinedConstants[ className + "::" + constantName];
                
                if ( constantValue[ VARIABLE.CLASS_CONSTANT ] ) {
                    // class constant referring another class constant, use reference
                    undefinedConstants[ className + "::" + constantName][ VARIABLE.REFERRING ] = constantValue;
                    undefinedConstants[ className + "::" + constantName][ VARIABLE.DEFINED ] = true;
                } else {
                    Class.prototype[ PHP.VM.Class.CONSTANT + constantName ][ COMPILER.VARIABLE_VALUE ] = constantValue[ COMPILER.VARIABLE_VALUE ];
                }
                
                
            } else {
                constantValue[ VARIABLE.CLASS_CONSTANT ] = true;
                Class.prototype[ PHP.VM.Class.CONSTANT + constantName ] = constantValue;
            }
            
            if (Class.prototype[ PHP.VM.Class.CONSTANT + constantName ][ VARIABLE.TYPE ] === VARIABLE.ARRAY ) {
                ENV[ PHP.Compiler.prototype.ERROR ]( "Arrays are not allowed in class constants", PHP.Constants.E_ERROR, true );  
            }
            
            return methods;
        };
        
        /*
         * Declare class property
         */       
        
        methods [ COMPILER.CLASS_PROPERTY ] = function( propertyName, propertyType, propertyDefault ) {
            props[ propertyName ] = propertyDefault;
            
            // can't define members for interface
            if ( classType === PHP.VM.Class.INTERFACE ) {
                ENV[ PHP.Compiler.prototype.ERROR ]( "Interfaces may not include member variables", PHP.Constants.E_ERROR, true ); 
            }
            
            if ( Class.prototype[ propertyTypePrefix + propertyName ] !== undefined &&  Class.prototype[ propertyTypePrefix + propertyName ] !== propertyType ) {
                // property has been defined in an inherited class and isn't of same type as newly defined one, 
                // so let's make sure it is weaker or throw an error
                
                var type = Class.prototype[ propertyTypePrefix + propertyName ],
                inheritClass = Object.getPrototypeOf( Class.prototype )[ COMPILER.CLASS_NAME ];
                
                // redeclaring a (non-private) static as non-static
                if (!checkType( propertyType, STATIC ) && checkType( type, STATIC ) && !checkType( type, PRIVATE ) ) {
                    ENV[ PHP.Compiler.prototype.ERROR ]( "Cannot redeclare static " + inheritClass + "::$" + propertyName + " as non static " + className + "::$" + propertyName, PHP.Constants.E_ERROR, true ); 
                }
                
                // redeclaring a (non-private) non-static as static
                if (checkType( propertyType, STATIC ) && !checkType( type, STATIC ) && !checkType( type, PRIVATE ) ) {
                    ENV[ PHP.Compiler.prototype.ERROR ]( "Cannot redeclare non static " + inheritClass + "::$" + propertyName + " as static " + className + "::$" + propertyName, PHP.Constants.E_ERROR, true ); 
                }
                
                if (!checkType( propertyType, PUBLIC ) ) {
                    
                    if ( ( checkType( propertyType, PRIVATE ) || checkType( propertyType, PROTECTED ) ) && checkType( type, PUBLIC )  ) {
                        ENV[ PHP.Compiler.prototype.ERROR ]( "Access level to " + className + "::$" + propertyName + " must be public (as in class " + inheritClass + ")", PHP.Constants.E_ERROR, true );
                    }
                    
                    if ( ( checkType( propertyType, PRIVATE )  ) && checkType( type, PROTECTED )  ) {
                        ENV[ PHP.Compiler.prototype.ERROR ]( "Access level to " + className + "::$" + propertyName + " must be protected (as in class " + inheritClass + ") or weaker", PHP.Constants.E_ERROR, true );
                    }
                    
                }

                
            }
            
           
            
            if ( checkType( propertyType, STATIC )) {
                Object.defineProperty( Class.prototype,  propertyPrefix + propertyName, {
                    value: propertyDefault
                });
            } 
            
            
            
            
            Object.defineProperty( Class.prototype, propertyTypePrefix + propertyName, {
                value: propertyType
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
            
                        
            // can't override final 
            if ( Class.prototype[ PHP.VM.Class.METHOD_PROTOTYPE + methodName ] !== undefined && checkType( Class.prototype[ methodTypePrefix + methodName ], FINAL ) ) {
                ENV[ PHP.Compiler.prototype.ERROR ]( "Cannot override final method " + Class.prototype[ PHP.VM.Class.METHOD_PROTOTYPE + methodName ][ COMPILER.CLASS_NAME ] + "::" + methodName + "()", PHP.Constants.E_ERROR, true );
            }
            
            // can't make static non-static
            if ( Class.prototype[ PHP.VM.Class.METHOD_PROTOTYPE + methodName ] !== undefined && checkType( Class.prototype[ methodTypePrefix + methodName ], STATIC ) && !checkType( methodType, STATIC ) ) {
                ENV[ PHP.Compiler.prototype.ERROR ]( "Cannot make static method " + Class.prototype[ PHP.VM.Class.METHOD_PROTOTYPE + methodName ][ COMPILER.CLASS_NAME ] + "::" + methodName + "() non static in class " + className, PHP.Constants.E_ERROR, true );
            }
            
            // can't make non-static  static
            if ( Class.prototype[ PHP.VM.Class.METHOD_PROTOTYPE + methodName ] !== undefined && !checkType( Class.prototype[ methodTypePrefix + methodName ], STATIC ) && checkType( methodType, STATIC ) ) {
                ENV[ PHP.Compiler.prototype.ERROR ]( "Cannot make non static method " + Class.prototype[ PHP.VM.Class.METHOD_PROTOTYPE + methodName ][ COMPILER.CLASS_NAME ] + "::" + methodName + "() static in class " + className, PHP.Constants.E_ERROR, true );
            }
 
            // A final method cannot be abstract
            if ( checkType( methodType, ABSTRACT ) && checkType( methodType, FINAL ) ) {
                ENV[ PHP.Compiler.prototype.ERROR ]( "Cannot use the final modifier on an abstract class member", PHP.Constants.E_ERROR, true );
            }
           
            
            // visibility from public
            if ( Class.prototype[ PHP.VM.Class.METHOD_PROTOTYPE + methodName ] !== undefined && checkType( Class.prototype[ methodTypePrefix + methodName ], PUBLIC ) && (checkType( methodType, PROTECTED ) || checkType( methodType, PRIVATE ) ) ) {
                ENV[ PHP.Compiler.prototype.ERROR ]( "Access level to " + className + "::" + methodName + "() must be public (as in class same)", PHP.Constants.E_ERROR, true );
            } 
            // visibility from protected
            if ( Class.prototype[ PHP.VM.Class.METHOD_PROTOTYPE + methodName ] !== undefined && checkType( Class.prototype[ methodTypePrefix + methodName ], PROTECTED ) && checkType( methodType, PRIVATE ) ) {
                ENV[ PHP.Compiler.prototype.ERROR ]( "Access level to " + className + "::" + methodName + "() must be protected (as in class same) or weaker", PHP.Constants.E_ERROR, true );
            }
           
            
            // __call
            if ( methodName === __call  ) { 
                
                if ( methodProps.length !== 2 ) {
                    ENV[ PHP.Compiler.prototype.ERROR ]( "Method " + className + "::" + methodName + "() must take exactly 2 arguments", PHP.Constants.E_ERROR, true );
                }
                
                if ( !checkType( methodType, PUBLIC ) || checkType( methodType, STATIC ) ) {
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
                value: methodFunc,
                enumerable: true
            });
            
            Object.defineProperty( Class.prototype, methodArgumentPrefix + methodName, {
                value: methodProps 
            });
            
            return methods;
        };
            
        methods [ COMPILER.CLASS_DECLARE ] = function() {
            
            if ( !checkType( classType, ABSTRACT ) ) {
                // make sure there are no abstract methods left undeclared
                
                if ( classType !== PHP.VM.Class.INTERFACE) {
                    Object.keys( Class.prototype ).forEach(function( item ){
                        if ( item.substring( 0, methodPrefix.length ) === methodPrefix ) {
                        
                            var methodName = item.substring( methodPrefix.length );
                            if ( checkType( Class.prototype[ methodTypePrefix + methodName ], ABSTRACT ) ) {
                                ENV[ PHP.Compiler.prototype.ERROR ]( "Class " + className + " contains 1 abstract method and must therefore be declared abstract or implement the remaining methods (" + className + "::" + methodName + ")", PHP.Constants.E_ERROR, true );
                            }
                     
                        }
                    });
                
                    // interfaces
                
                    Class.prototype[ PHP.VM.Class.INTERFACES ].forEach( function( interfaceName ){
                  
                        var interfaceProto = classRegistry[ interfaceName.toLowerCase() ].prototype;
                        Object.keys( interfaceProto ).forEach(function( item ){
                            if ( item.substring( 0, methodPrefix.length ) === methodPrefix ) {
                        
                                var methodName = item.substring( methodPrefix.length );
                                if (Class.prototype[ methodTypePrefix + methodName ] === undefined ) {
                                    ENV[ PHP.Compiler.prototype.ERROR ]( "Class " + className + " contains 1 abstract method and must therefore be declared abstract or implement the remaining methods (" + interfaceName + "::" + methodName + ")", PHP.Constants.E_ERROR, true );
                                }
                            }
                        });
                    
                    });
                }

                
            }
            
            
            DECLARED = true;
            
            return Class;
        };
        
        
        /*
         * Extends and implements
         */
        
        if (opts.Extends  !== undefined) {
            
            var Extends = ENV.$Class.Get( opts.Extends );
            
            if ( Extends.prototype[ COMPILER.CLASS_TYPE ] === PHP.VM.Class.INTERFACE ) {
                // can't extend interface
                ENV[ PHP.Compiler.prototype.ERROR ]( "Class " + className + " cannot extend from interface " + opts.Extends, PHP.Constants.E_ERROR, true );
              
            } else if ( checkType(Extends.prototype[ COMPILER.CLASS_TYPE ], FINAL ) ) {
                // can't extend final class
                ENV[ PHP.Compiler.prototype.ERROR ]( "Class " + className + " may not inherit from final class (" + opts.Extends + ")", PHP.Constants.E_ERROR, true );
              
            }
            
            Class.prototype = new Extends( true );
        } else {      
            Class.prototype = new PHP.VM.ClassPrototype();
            Class.prototype[ PHP.VM.Class.INTERFACES ] = [];
        }
        
        var pushInterface = function( interfaceName, interfaces, ignore ) {
            
            if ( interfaceName.toLowerCase() === "traversable" && ignore !== true && !/^iterato(r|raggregate)$/i.test( className ) ) {
                ENV[ PHP.Compiler.prototype.ERROR ]( "Class " + className + " must implement interface Traversable as part of either Iterator or IteratorAggregate", PHP.Constants.E_ERROR, true );
            } 
            
            if ( interfaces.indexOf( interfaceName ) === -1 ) {
                // only add interface if it isn't present already
                interfaces.push( interfaceName );
            }
        }
        
        if (opts.Implements !== undefined || classType === PHP.VM.Class.INTERFACE) {

            (( classType === PHP.VM.Class.INTERFACE) ? opts : opts.Implements).forEach(function( interfaceName ){
                
                var Implements = ENV.$Class.Get( interfaceName, undefined, true ); 
                
                if ( Implements.prototype[ COMPILER.CLASS_TYPE ] !== PHP.VM.Class.INTERFACE ) {
                    // can't implement non-interface
                    ENV[ PHP.Compiler.prototype.ERROR ]( className + " cannot implement " + interfaceName + " - it is not an interface", PHP.Constants.E_ERROR, true );
                }
                
                pushInterface( interfaceName, Class.prototype[ PHP.VM.Class.INTERFACES ] ); 
          
                // add interfaces from interface
                
                Implements.prototype[ PHP.VM.Class.INTERFACES ].forEach( function( interfaceName ) {
                    pushInterface( interfaceName, Class.prototype[ PHP.VM.Class.INTERFACES ], true );               
                });
                
            });
        }

        
        Class.prototype[ COMPILER.CLASS_TYPE ] = classType;
        
        Class.prototype[ COMPILER.CLASS_NAME ] = className;
        
        Class.prototype[ COMPILER.METHOD_CALL ] = function( ctx, methodName ) {
             
            var args = Array.prototype.slice.call( arguments, 2 ),
            value;

            if ( typeof this[ methodPrefix + methodName ] !== "function" ) {
                // no method with that name found
                  
                if ( typeof this[ methodPrefix + __call ] === "function" ) {
                    // __call method defined, let's call that instead then
                    
                    
                    // determine which __call to use in case there are several defined
                    if ( ctx instanceof PHP.VM ) {
                        // normal call, use current context
                        value = callMethod.call( this, __call, [ new PHP.VM.Variable( methodName ), new PHP.VM.Variable( PHP.VM.Array.fromObject.call( ENV, args ) ) ] );
                    } else {
                        // static call, ensure current scope's __call() is favoured over the specified class's  __call()
                        value = ctx.callMethod.call( ctx, __call, [ new PHP.VM.Variable( methodName ), new PHP.VM.Variable( PHP.VM.Array.fromObject.call( ENV, args ) ) ] );
                    }
                    
                    return (( value === undefined ) ? new PHP.VM.Variable() : value);
               
                }
                  
            } else {
               
                if ( checkType( this[ methodTypePrefix + methodName ], PRIVATE ) && this[ PHP.VM.Class.METHOD_PROTOTYPE + methodName ][ COMPILER.CLASS_NAME ] !== ctx[ COMPILER.CLASS_NAME ] ) {
                   
                    // targeted function is private and inaccessible from current context, 
                    // but let's make sure current context doesn't have it's own private method that has been overwritten
                    if ( !ctx instanceof PHP.VM.ClassPrototype || 
                        ctx[ PHP.VM.Class.METHOD_PROTOTYPE + methodName ] === undefined ||
                        ctx[ PHP.VM.Class.METHOD_PROTOTYPE + methodName ][ COMPILER.CLASS_NAME ] !== ctx[ COMPILER.CLASS_NAME ] ) {
                        ENV[ PHP.Compiler.prototype.ERROR ]( "Call to private method " + this[ PHP.VM.Class.METHOD_PROTOTYPE + methodName ][ COMPILER.CLASS_NAME ] + "::" + methodName + "() from context '" + ((ctx instanceof PHP.VM.ClassPrototype) ? ctx[ COMPILER.CLASS_NAME ] : '') + "'", PHP.Constants.E_ERROR, true );
                    }
                    
                }
                
              
            }

           

            // favor current context's private method
            if ( ctx instanceof PHP.VM.ClassPrototype && 
                ctx[ PHP.VM.Class.METHOD_PROTOTYPE + methodName ] !== undefined &&
                checkType( ctx[ methodTypePrefix + methodName ], PRIVATE ) &&
                ctx[ PHP.VM.Class.METHOD_PROTOTYPE + methodName ][ COMPILER.CLASS_NAME ] === ctx[ COMPILER.CLASS_NAME ] ) {
                
                value = this.callMethod.call( ctx, methodName, args );
                
            } else {
                value = this.callMethod.call( this, methodName, args );
            
            }
            
            return (( value === undefined ) ? new PHP.VM.Variable() : value);
            
           
              
        };
        
        Class.prototype.callMethod = callMethod;
        
        
        Class.prototype[  COMPILER.STATIC_CALL  ] = function( ctx, methodClass, methodName ) {
            
            var args = Array.prototype.slice.call( arguments, 3 );

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
               
                if ( checkType( this[ methodTypePrefix + methodName ], PRIVATE ) && this[ PHP.VM.Class.METHOD_PROTOTYPE + methodName ][ COMPILER.CLASS_NAME ] !== ctx[ COMPILER.CLASS_NAME ] ) {
                    ENV[ PHP.Compiler.prototype.ERROR ]( "Call to private method " + this[ PHP.VM.Class.METHOD_PROTOTYPE + methodName ][ COMPILER.CLASS_NAME ] + "::" + methodName + "() from context '" + ((ctx instanceof PHP.VM.ClassPrototype) ? ctx[ COMPILER.CLASS_NAME ] : '') + "'", PHP.Constants.E_ERROR, true ); 
                }
                
              
            }
           
           
            var methodToCall,
            methodCTX,
            $;
            var proto;
            if ( /^parent$/i.test( methodClass ) ) {
                proto = Object.getPrototypeOf( Object.getPrototypeOf( this ) );
                

            } else if ( methodClass !== className ){
              
                proto = Object.getPrototypeOf( this );
                while ( proto[ COMPILER.CLASS_NAME ] !== methodClass ) {
                    proto = Object.getPrototypeOf( proto );
                }

            }
            
            if ( proto !== undefined ) {
                methodToCall = proto[ methodPrefix + methodName ];
                methodCTX = proto[ PHP.VM.Class.METHOD_PROTOTYPE + methodName ];
                
                $ = buildVariableContext.call( this, methodName, args, methodCTX[ COMPILER.CLASS_NAME ] );
           

   
                if ( checkType( proto[ methodTypePrefix + methodName ], PRIVATE ) && methodCTX[ COMPILER.CLASS_NAME ] !== ctx[ COMPILER.CLASS_NAME ] ) {
                    ENV[ PHP.Compiler.prototype.ERROR ]( "Call to private method " + methodCTX[ COMPILER.CLASS_NAME ] + "::" + methodName + "() from context '" + ((ctx instanceof PHP.VM.ClassPrototype) ? ctx[ COMPILER.CLASS_NAME ] : '') + "'", PHP.Constants.E_ERROR, true ); 
                }
               
                if ( checkType( proto[ methodTypePrefix + methodName ], ABSTRACT ) ) {
                    
                    ENV[ PHP.Compiler.prototype.ERROR ]( "Cannot call abstract method " + methodCTX[ COMPILER.CLASS_NAME ] + "::" + methodName + "()", PHP.Constants.E_ERROR, true ); 
                }
   
                return methodToCall.call( this, $, methodCTX );
            }
            
            
           
           
            return this.callMethod.call( this, methodName, args );
            
 
        };
        
        Class.prototype[ COMPILER.STATIC_PROPERTY_GET ] = function( ctx, propertyClass, propertyName ) {
            
            var methodCTX;
            if ( /^self$/i.test( propertyClass ) ) {
                methodCTX = ctx;
            } else if ( /^parent$/i.test( propertyClass )) {
                methodCTX = Object.getPrototypeOf( ctx );
            } else {
                methodCTX = this;
            }
            
            
            return methodCTX[ propertyPrefix + propertyName ];
            
            
        };
        
        Class.prototype[ COMPILER.CLASS_CONSTANT_FETCH ] = function( ctx, constantName ) {
            if ( this[ PHP.VM.Class.CONSTANT + constantName ] === undefined && DECLARED === true ) {  
                ENV[ PHP.Compiler.prototype.ERROR ]( "Undefined class constant '" + constantName + "'", PHP.Constants.E_ERROR, true ); 
            } else if ( this[ PHP.VM.Class.CONSTANT + constantName ] === undefined ) {
                //  undefinedConstants
                if ( undefinedConstants[ className + "::" + constantName] === undefined ) {
                    var variable = new PHP.VM.Variable();
                    variable[ VARIABLE.CLASS_CONSTANT ] = true;
                    variable[ VARIABLE.DEFINED ] = className + "::$" + constantName;
                    undefinedConstants[ className + "::" + constantName] = variable;
                    
                }
                
                return undefinedConstants[ className + "::" + constantName];
            }
            
            
            
            return this[ PHP.VM.Class.CONSTANT + constantName ];

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
                
                obj [ VARIABLE.DEFINED ] = true;
                
                obj [ COMPILER.POST_INC ] = function() {
                 
                    if ( this[ methodPrefix + __get ] !== undefined ) {
                     
                        var value = callMethod.call( this, __get, [ new PHP.VM.Variable( propertyName ) ] );  
                        
                        
                        // setting ++
                        if ( this[ methodPrefix + __set ] !== undefined ) {
                            
                            callMethod.call( this, __set,  [ new PHP.VM.Variable( propertyName ), ( value instanceof PHP.VM.Variable ) ? ++value[ COMPILER.VARIABLE_VALUE ] : new PHP.VM.Variable( 1 ) ] );    
                        }
                     
                        return value;
                
                    }
                }.bind( this );
                
                
                obj [ COMPILER.PRE_INC ] = function() {
                   
                    if ( this[ methodPrefix + __get ] !== undefined ) {
                     
                        var value = callMethod.call( this, __get, [ new PHP.VM.Variable( propertyName ) ] );  
                        
                        
                        // setting ++
                        if ( this[ methodPrefix + __set ] !== undefined ) {
                            
                            callMethod.call( this, __set,  [ new PHP.VM.Variable( propertyName ), ( value instanceof PHP.VM.Variable ) ? ++value[ COMPILER.VARIABLE_VALUE ] : new PHP.VM.Variable( 1 ) ] );    
                        }
                        
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
                          
                } else {
                    
                    if ( this[ PHP.VM.Class.CLASS_UNDEFINED_PROPERTY + propertyName ] === undefined ) {
                        var variable = new PHP.VM.Variable();
                        variable[ VARIABLE.PROPERTY ] = true;
                        variable[ VARIABLE.DEFINED ] = className + "::$" + propertyName;
                    
                        this[ PHP.VM.Class.CLASS_UNDEFINED_PROPERTY + propertyName ] = variable;
                    
                        variable[ VARIABLE.REGISTER_SETTER ] = function() {
                            this[ propertyPrefix + propertyName ] = variable;
                        }
                    
                    
                    
                        return variable;
                    } else {
                        return this[ PHP.VM.Class.CLASS_UNDEFINED_PROPERTY + propertyName ];
                    }
                    
                }
                return obj;
              
                
            } else {

                if ( checkType( this[ propertyTypePrefix + propertyName ], PROTECTED ) && !(ctx instanceof PHP.VM.ClassPrototype) ) {
                    ENV[ PHP.Compiler.prototype.ERROR ]( "Cannot access protected property " + className + "::$" + propertyName, PHP.Constants.E_ERROR, true );   
                }

                
                if ( ctx instanceof PHP.VM.ClassPrototype && this[ PHP.VM.Class.CLASS_PROPERTY + ctx[ COMPILER.CLASS_NAME ] + "_" + propertyPrefix + propertyName ] !== undefined ) {
                    // favor current context over object only if current context property is private
                    if ( checkType( ctx[ propertyTypePrefix + propertyName ], PRIVATE ) ) {
                        return this[ PHP.VM.Class.CLASS_PROPERTY + ctx[ COMPILER.CLASS_NAME ] + "_" + propertyPrefix + propertyName ];
                    }
                }
                
                return this[ propertyPrefix + propertyName ];
            }
            
            
        };
        
        
        Class.prototype[ COMPILER.CLASS_DESTRUCT ] = function( ctx ) {
            
            console.log('destruct');
            if ( Object.getPrototypeOf( this ).hasOwnProperty(  methodPrefix + __destruct  ) ) {
                return callMethod.call( this, __destruct, [] );         
            }
     
            
        };
        
        // register class
        classRegistry[ className.toLowerCase() ] = Class;
        
        
        var constant$ = PHP.VM.VariableHandler();
        
   
        constant$("$__FILE__")[ COMPILER.VARIABLE_VALUE ] = "__FILE__";
         
        //   constant$("$__FILE__")[ COMPILER.VARIABLE_VALUE ] = ENV[ COMPILER.GLOBAL ]('_SERVER')[ COMPILER.VARIABLE_VALUE ][ COMPILER.METHOD_CALL ]( ENV, COMPILER.ARRAY_GET, 'SCRIPT_FILENAME' )[ COMPILER.VARIABLE_VALUE ];
        
        constant$("$__METHOD__")[ COMPILER.VARIABLE_VALUE ] = className;
        
        constant$("$__CLASS__")[ COMPILER.VARIABLE_VALUE ] = className;
        
        constant$("$__FUNCTION__")[ COMPILER.VARIABLE_VALUE ] = "";
        
        constant$("$__LINE__")[ COMPILER.VARIABLE_VALUE ] = 1;
        
        classDefinition.call( Class, methods, constant$ );
        
        return methods;
    };
    

    
};
PHP.VM.ClassPrototype = function() {};

PHP.VM.Class.METHOD = "_";

PHP.VM.Class.CLASS_UNDEFINED_PROPERTY = "_£$";

PHP.VM.Class.CLASS_PROPERTY = "_£";

PHP.VM.Class.INTERFACES = "$Interfaces";

PHP.VM.Class.METHOD_PROTOTYPE = "$MP";

PHP.VM.Class.CONSTANT = "€";

PHP.VM.Class.PROPERTY = "$$";

PHP.VM.Class.Predefined = {};

PHP.VM.Class.PUBLIC = 1;
PHP.VM.Class.PROTECTED = 2;
PHP.VM.Class.PRIVATE = 4;
PHP.VM.Class.STATIC = 8;
PHP.VM.Class.ABSTRACT = 16;
PHP.VM.Class.FINAL = 32;
PHP.VM.Class.INTERFACE = 64;

