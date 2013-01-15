/*
 * @author Niklas von Hertzen <niklas at hertzen.com>
 * @created 26.6.2012
 * @website http://hertzen.com
 */


PHP.VM.Class = function( ENV, classRegistry, magicConstants, initiatedClasses, undefinedConstants, declaredClasses ) {

    var methodPrefix = PHP.VM.Class.METHOD,
    methodArgumentPrefix = "_$_",
    propertyPrefix = PHP.VM.Class.PROPERTY,
    methodTypePrefix = "$£",
    methodByRef = "__byRef",
    propertyTypePrefix = PHP.VM.Class.PROPERTY_TYPE,
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

    // check if obj inherits className
    function inherits( obj, name ) {
        return ENV.$Class.Inherits( obj, name );
    }

    var buildVariableContext = function( methodName, args, className, realName, ctx ) {

        var $ = PHP.VM.VariableHandler( ENV ),
        argumentObj = this[ methodArgumentPrefix + methodName ];

        if ( Array.isArray(argumentObj) ) {
            argumentObj.forEach( function( argObject, index  ) {


                var arg = $( argObject.name );

                PHP.Utils.ArgumentHandler( ENV, arg, argObject, args[ index ], index, className + "::" + realName );
            /*

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
                        $( arg.name )[ COMPILER.VARIABLE_VALUE ] = arg[ COMPILER.PROPERTY_DEFAULT ][ COMPILER.VARIABLE_VALUE ];
                    } else {
                        $( arg.name )[ COMPILER.VARIABLE_VALUE ] = (new PHP.VM.Variable())[ COMPILER.VARIABLE_VALUE ];
                    }
                }


                // perform type hint check

                if ( arg[ COMPILER.PROPERTY_TYPE ] !== undefined ) {
                    ENV[ COMPILER.TYPE_CHECK ]( $( arg.name ), arg[ COMPILER.PROPERTY_TYPE ], arg[ COMPILER.PROPERTY_DEFAULT ], index, className + "::" + realName );
                }

                 */


            });
        }

        $("GLOBALS", ENV[ COMPILER.GLOBAL ]( "GLOBALS" ));

        $("$__CLASS__")[ COMPILER.VARIABLE_VALUE ] = className;
        $("$__FUNCTION__")[ COMPILER.VARIABLE_VALUE ] = realName;
        $("$__METHOD__")[ COMPILER.VARIABLE_VALUE ] = className + "::" + realName;

        if ( ctx !== false ) {
            $("this")[ COMPILER.VARIABLE_VALUE ] = ( ctx !== undefined ) ? ctx : this;
        }

        return $;
    }



    return function() {

        var className = arguments[ 0 ],
        classType = arguments[ 1 ],
        opts = arguments[ 2 ],
        classDefinition = arguments[ 3 ],
        DECLARED = false,
        staticVars = {},
        props = {},

        callMethod = function( methodName, args, variablesCallback ) {
            var $ = buildVariableContext.call( this, methodName, args, this[ PHP.VM.Class.METHOD_PROTOTYPE + methodName ][ COMPILER.CLASS_NAME ], this[ PHP.VM.Class.METHOD_REALNAME + methodName ], (checkType( this[ methodTypePrefix + methodName ], STATIC )) ? false : this );

            if (staticVars[ methodName ] === undefined) {
                staticVars[ methodName ] = {};
            }

            Object.keys( staticVars[ methodName ] ).forEach(function( key ){

                $( key, staticVars[ methodName ][ key ] );
            });

            var staticHandler = {};
            PHP.Utils.StaticHandler.call( this, staticHandler, staticVars, $, ENV[ COMPILER.GLOBAL ] );

            if (variablesCallback !== undefined ) {
                variablesCallback();
            }

            return this[ methodPrefix + methodName ].call( this, $, this[ PHP.VM.Class.METHOD_PROTOTYPE + methodName ], staticHandler );
        };

        var Class = function( ctx ) {
            Object.keys( props ).forEach(function( propertyName ){

                if ( checkType(this[propertyTypePrefix + propertyName], STATIC)) {
                // static, so refer to the one and only same value defined in actual prototype
                } else {
                    if ( Array.isArray( props[ propertyName ] ) ) {
                        this[ propertyPrefix + propertyName ] = new PHP.VM.Variable( [] );
                    } else {
                        this[ propertyPrefix + propertyName ] = new PHP.VM.Variable( props[ propertyName ] );
                    }
                }

                this [ PHP.VM.Class.CLASS_PROPERTY + className + "_" + propertyPrefix + propertyName] = this[ propertyPrefix + propertyName ];
            }, this);


            var callConstruct = function( $this, name, args, ctx ) {

                if ( checkType( $this[ methodTypePrefix + name ], PRIVATE ) && this[ PHP.VM.Class.METHOD_PROTOTYPE + name ][ COMPILER.CLASS_NAME ] !== ctx[ COMPILER.CLASS_NAME ] ) {
                    ENV[ PHP.Compiler.prototype.ERROR ]( "Call to private " + $this[ PHP.VM.Class.METHOD_PROTOTYPE + name ][ COMPILER.CLASS_NAME ] + "::" + name + "() from invalid context", PHP.Constants.E_ERROR, true );
                }

                if ( checkType( this[ methodTypePrefix + name ], PROTECTED) && (!( ctx instanceof PHP.VM.ClassPrototype) || !inherits( ctx, this[ COMPILER.CLASS_NAME ] ))) {
                    ENV[ PHP.Compiler.prototype.ERROR ]( "Call to protected " + className + "::" + name + "() from invalid context", PHP.Constants.E_ERROR, true );
                }

                this[ PHP.VM.Class.KILLED ] = true;
                var ret = callMethod.call( $this, name, Array.prototype.slice.call( args, 1 ) );
                this[ PHP.VM.Class.KILLED ] = undefined;
                return ret;
            }.bind( this );

            // call constructor

            if ( ctx !== true ) {
                // check if we are extending class, i.e. don't call constructors
                if ( !/^(ArrayObject|__Globals)$/i.test( className ) ) {
                    Object.keys(undefinedConstants).forEach(function( itm ){
                        var parts = itm.split("::");
                        if (!this.$Class.Exists( parts[ 0 ])) {
                            ENV[ PHP.Compiler.prototype.ERROR ]( "Class '" + parts[0] + "' not found", PHP.Constants.E_ERROR, true );
                        }
                    }, ENV);
                    undefinedConstants = [];
                }

                this[ COMPILER.CLASS_STORED ] = []; // variables that store an instance of this class, needed for destructors


                // make sure we aren't initiating an abstract class
                if (checkType( this[ COMPILER.CLASS_TYPE ], ABSTRACT ) ) {
                    ENV[ PHP.Compiler.prototype.ERROR ]( "Cannot instantiate abstract class " + className, PHP.Constants.E_ERROR, true );
                }

                // make sure we aren't initiating an interface
                if (checkType( this[ COMPILER.CLASS_TYPE ], INTERFACE ) ) {
                    ENV[ PHP.Compiler.prototype.ERROR ]( "Cannot instantiate interface " + className, PHP.Constants.E_ERROR, true );
                }

                // register new class initiated into registry (for destructors at shutdown)
                if ( className !== "ArrayObject") {
                    initiatedClasses.push ( this );

                    this[ PHP.VM.Class.CLASS_INDEX ] = initiatedClasses.length;
                }

                // PHP 5 style constructor in current class
                if ( Object.getPrototypeOf( this ).hasOwnProperty(  methodPrefix + __construct  ) ) {
                    return callConstruct( this, __construct, arguments, ctx );
                }

                // PHP 4 style constructor in current class

                else if ( Object.getPrototypeOf( this ).hasOwnProperty(  methodPrefix + className.toLowerCase()  ) ) {
                    return callConstruct( this, className.toLowerCase(), arguments, ctx  );
                }

                // PHP 5 style constructor in any inherited class

                else if ( typeof this[ methodPrefix + __construct ] === "function" ) {
                    return callConstruct( this, __construct, arguments, ctx  );
                }

                // PHP 4 style constructor in any inherited class

                else {
                    var proto = this;

                    while ( ( proto = Object.getPrototypeOf( proto ) ) instanceof PHP.VM.ClassPrototype ) {

                        if ( proto.hasOwnProperty( methodPrefix + proto[ COMPILER.CLASS_NAME  ].toLowerCase() ) ) {
                            return callConstruct( proto, proto[ COMPILER.CLASS_NAME  ].toLowerCase(), arguments, ctx  );
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

            if ( classType === PHP.VM.Class.INTERFACE ) {
                Class.prototype[ PHP.VM.Class.INTERFACES ].forEach( function( interfaceName ){
                    if (ENV.$Class.Get( interfaceName ).prototype[ PHP.VM.Class.CONSTANT + constantName ] !== undefined ) {
                        ENV[ PHP.Compiler.prototype.ERROR ]( "Cannot inherit previously-inherited or override constant " + constantName + " from interface " + interfaceName, PHP.Constants.E_ERROR, true );
                    }

                }, this);

            }

            if (  Class.prototype[ PHP.VM.Class.CONSTANT + className  + "$" + constantName] !== undefined ) {
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

            Class.prototype[ PHP.VM.Class.CONSTANT + className  + "$" + constantName] = Class.prototype[ PHP.VM.Class.CONSTANT + constantName ];

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
                /*
                Object.defineProperty( Class.prototype,  propertyPrefix + propertyName, {
                    value: propertyDefault
                });
                 */
                Object.defineProperty( Class.prototype,  PHP.VM.Class.CLASS_STATIC_PROPERTY + propertyName, {
                    value: propertyDefault || new PHP.VM.Variable(null)
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

        methods [ COMPILER.CLASS_METHOD ] = function( realName, methodType, methodProps, byRef, methodFunc ) {

            /*
             * signature checks
             */
            var methodName = realName.toLowerCase();

            // can't override final
            if ( Class.prototype[ PHP.VM.Class.METHOD_PROTOTYPE + methodName ] !== undefined && checkType( Class.prototype[ methodTypePrefix + methodName ], FINAL ) ) {
                ENV[ PHP.Compiler.prototype.ERROR ]( "Cannot override final method " + Class.prototype[ PHP.VM.Class.METHOD_PROTOTYPE + methodName ][ COMPILER.CLASS_NAME ] + "::" + realName + "()", PHP.Constants.E_ERROR, true );
            }

            // can't override final php4 ctor extending php5 ctor
            if ( methodName === className.toLowerCase() && Class.prototype[ PHP.VM.Class.METHOD_PROTOTYPE + __construct ] !== undefined && checkType( Class.prototype[ methodTypePrefix + __construct ], FINAL ) ) {
                ENV[ PHP.Compiler.prototype.ERROR ]( "Cannot override final " + Class.prototype[ PHP.VM.Class.METHOD_PROTOTYPE + __construct ][ COMPILER.CLASS_NAME ] + "::" + __construct + "() with " + className + "::" + realName + "()", PHP.Constants.E_ERROR, true );
            }

            var ctorProto = ( function( proto ){


                while ( ( proto = Object.getPrototypeOf( proto ) ) instanceof PHP.VM.ClassPrototype ) {

                    if ( proto.hasOwnProperty( methodPrefix + proto[ COMPILER.CLASS_NAME  ].toLowerCase() ) ) {
                        return proto;
                    }

                }

            })( Class.prototype );

            // can't override final php5 ctor extending php4 ctor
            if ( methodName === __construct && ctorProto !== undefined && checkType( ctorProto[ methodTypePrefix + ctorProto[ COMPILER.CLASS_NAME ].toLowerCase() ], FINAL ) ) {
                ENV[ PHP.Compiler.prototype.ERROR ]( "Cannot override final " + ctorProto[ COMPILER.CLASS_NAME ] + "::" + ctorProto[ COMPILER.CLASS_NAME ] + "() with " + className + "::" + realName + "()", PHP.Constants.E_ERROR, true );
            }

            // can't make static non-static
            if ( Class.prototype[ PHP.VM.Class.METHOD_PROTOTYPE + methodName ] !== undefined && checkType( Class.prototype[ methodTypePrefix + methodName ], STATIC ) && !checkType( methodType, STATIC ) ) {
                ENV[ PHP.Compiler.prototype.ERROR ]( "Cannot make static method " + Class.prototype[ PHP.VM.Class.METHOD_PROTOTYPE + methodName ][ COMPILER.CLASS_NAME ] + "::" + realName + "() non static in class " + className, PHP.Constants.E_ERROR, true );
            }

            // can't make non-static  static
            if ( Class.prototype[ PHP.VM.Class.METHOD_PROTOTYPE + methodName ] !== undefined && !checkType( Class.prototype[ methodTypePrefix + methodName ], STATIC ) && checkType( methodType, STATIC ) ) {
                ENV[ PHP.Compiler.prototype.ERROR ]( "Cannot make non static method " + Class.prototype[ PHP.VM.Class.METHOD_PROTOTYPE + methodName ][ COMPILER.CLASS_NAME ] + "::" + realName + "() static in class " + className, PHP.Constants.E_ERROR, true );
            }

            // A final method cannot be abstract
            if ( checkType( methodType, ABSTRACT ) && checkType( methodType, FINAL ) ) {
                ENV[ PHP.Compiler.prototype.ERROR ]( "Cannot use the final modifier on an abstract class member", PHP.Constants.E_ERROR, true );
            }

            // abstract static warning
            if ( !checkType( classType, INTERFACE ) && checkType( methodType, STATIC ) && checkType( methodType, ABSTRACT ) ) {
                ENV[ PHP.Compiler.prototype.ERROR ]( "Static function " + className + "::" + methodName + "() should not be abstract", PHP.Constants.E_STRICT, true );
            }

            // visibility from public
            if ( Class.prototype[ PHP.VM.Class.METHOD_PROTOTYPE + methodName ] !== undefined && checkType( Class.prototype[ methodTypePrefix + methodName ], PUBLIC ) && (checkType( methodType, PROTECTED ) || checkType( methodType, PRIVATE ) ) ) {
                ENV[ PHP.Compiler.prototype.ERROR ]( "Access level to " + className + "::" + realName + "() must be public (as in class same)", PHP.Constants.E_ERROR, true );
            }
            // visibility from protected
            if ( Class.prototype[ PHP.VM.Class.METHOD_PROTOTYPE + methodName ] !== undefined && checkType( Class.prototype[ methodTypePrefix + methodName ], PROTECTED ) && checkType( methodType, PRIVATE ) ) {
                ENV[ PHP.Compiler.prototype.ERROR ]( "Access level to " + className + "::" + realName + "() must be protected (as in class same) or weaker", PHP.Constants.E_ERROR, true );
            }

            // interface methods can't be private
            if ( classType === PHP.VM.Class.INTERFACE && checkType( methodType, PRIVATE ) ) {
                ENV[ PHP.Compiler.prototype.ERROR ]( "Access type for interface method " + className + "::" + realName + "() must be omitted", PHP.Constants.E_ERROR, true );
            }

            // Default value for parameters with a class type hint can only be NULL
            methodProps.forEach(function( prop ){
                if ( prop[ COMPILER.PROPERTY_TYPE ] !== undefined && prop[ COMPILER.PROPERTY_DEFAULT ] instanceof PHP.VM.Variable && !/^(string|array)$/i.test(prop[ COMPILER.PROPERTY_TYPE ]) && prop[ COMPILER.PROPERTY_DEFAULT ][ VARIABLE.TYPE] !== VARIABLE.NULL ) {
                    ENV[ PHP.Compiler.prototype.ERROR ]( "Default value for parameters with a class type hint can only be NULL", PHP.Constants.E_ERROR, true );
                }
            }, this);


            // __call
            if ( methodName === __call  ) {

                if ( methodProps.length !== 2 ) {
                    ENV[ PHP.Compiler.prototype.ERROR ]( "Method " + className + "::" + realName + "() must take exactly 2 arguments", PHP.Constants.E_ERROR, true );
                }

                if ( !checkType( methodType, PUBLIC ) || checkType( methodType, STATIC ) ) {
                    ENV[ PHP.Compiler.prototype.ERROR ]( "The magic method " + realName + "() must have public visibility and cannot be static", PHP.Constants.E_CORE_WARNING, true );
                }

            }

            // __get

            else if ( methodName === __get  ) {
                if ( methodProps.length !== 1 ) {
                    ENV[ PHP.Compiler.prototype.ERROR ]( "Method " + className + "::" + realName + "() must take exactly 1 argument", PHP.Constants.E_ERROR, true );
                }
            }

            // __set

            else if ( methodName === __set  ) {
                if ( methodProps.length !== 2 ) {
                    ENV[ PHP.Compiler.prototype.ERROR ]( "Method " + className + "::" + realName + "() must take exactly 2 arguments", PHP.Constants.E_ERROR, true );
                }
            }


            // strict standards checks

            if ( Class.prototype[ PHP.VM.Class.METHOD_PROTOTYPE + methodName ] !== undefined ) {

                // method has been defined in an inherited class
                var propName,
                propDef,
                lastIndex = -1;
                if ( methodName !== __construct && (!Class.prototype[ methodArgumentPrefix + methodName ].every(function( item, index ){
                    propName = item;
                    lastIndex = index;

                    if ( (methodProps[ index ] !== undefined || item[ COMPILER.PROPERTY_DEFAULT ] !== undefined) ) {

                        if (methodProps[ index ] !== undefined) {

                            if ( item[ COMPILER.PROPERTY_TYPE ] === methodProps[ index ][ COMPILER.PROPERTY_TYPE ]  ) {

                                return true;
                            }
                        }
                    }
                    // or
                    if (item[ COMPILER.PROPERTY_DEFAULT ] !== undefined) {
                        propDef = item[ COMPILER.PROPERTY_DEFAULT ][ COMPILER.VARIABLE_VALUE ];
                    }
                    return false;

                // return (( (methodProps[ index ] !== undefined || item[ COMPILER.PROPERTY_DEFAULT ] !== undefined) && methodProps[ index ] !== undefined && item[ COMPILER.PROPERTY_TYPE ] === methodProps[ index ][ COMPILER.PROPERTY_TYPE ]) || item[ COMPILER.PROPERTY_DEFAULT ] !== undefined);
                //                                                                                                ^^ ^^^^^^ rechecking it on purpose
                }) || ( methodProps[ ++lastIndex ] !== undefined && methodProps[ lastIndex][ COMPILER.PROPERTY_DEFAULT ] === undefined) ) ) {
                    ENV[ PHP.Compiler.prototype.ERROR ]( "Declaration of " + className + "::" + realName + "() should be compatible with " + Class.prototype[ PHP.VM.Class.METHOD_PROTOTYPE + methodName ][ COMPILER.CLASS_NAME ] + "::" + realName + "(" + ((  propName !== undefined ) ? ((propName[ COMPILER.PROPERTY_TYPE ] === undefined ) ? "" : propName[ COMPILER.PROPERTY_TYPE ] + " ") + "$" + propName.name : "" ) + (( propDef !== undefined) ? " = " + propDef : "") + ")", PHP.Constants.E_STRICT, true, true );
                }


            }


            // end signature checks

            Object.defineProperty( Class.prototype, PHP.VM.Class.METHOD_PROTOTYPE + methodName, {
                value: Class.prototype
            });

            Object.defineProperty( Class.prototype, PHP.VM.Class.METHOD_REALNAME + methodName, {
                value: realName
            });

            Object.defineProperty( Class.prototype, methodTypePrefix + methodName, {
                value: methodType
            });

            Object.defineProperty( Class.prototype, methodByRef  + methodName, {
                value: byRef
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




                            if ( item.substring( 0, PHP.VM.Class.CONSTANT.length ) === PHP.VM.Class.CONSTANT ) {

                                if ( Class.prototype[ item ] !== undefined ) {
                                    Class.prototype[ PHP.VM.Class.INTERFACES ].forEach( function( interfaceName2 ){
                                        if ( interfaceName2 === interfaceName ) {
                                            if (ENV.$Class.Get( interfaceName2 ).prototype[ item ] !== undefined ) {
                                                ENV[ PHP.Compiler.prototype.ERROR ]( "Cannot inherit previously-inherited or override constant " + item.substring( PHP.VM.Class.CONSTANT.length ) + " from interface " + interfaceName2, PHP.Constants.E_ERROR, true );
                                            }
                                        }
                                    }, this);
                                }

                                methods [ COMPILER.CLASS_CONSTANT ]( item.substring( PHP.VM.Class.CONSTANT.length ), interfaceProto[ item ] );
                            }




                            // method checks
                            if ( item.substring( 0, methodPrefix.length ) === methodPrefix ) {

                                var methodName = item.substring( methodPrefix.length ),
                                propName,
                                propDef,
                                lastIndex = -1;

                                if (Class.prototype[ methodTypePrefix + methodName ] === undefined ) {
                                    ENV[ PHP.Compiler.prototype.ERROR ]( "Class " + className + " contains 1 abstract method and must therefore be declared abstract or implement the remaining methods (" + interfaceName + "::" + methodName + ")", PHP.Constants.E_ERROR, true );
                                }

                                if ( methodName === __construct && interfaceProto[ methodTypePrefix + methodName ] !== undefined ||  interfaceProto[ methodTypePrefix + interfaceName.toLowerCase() ] !== undefined) {

                                    var methodProps = Class.prototype[ methodArgumentPrefix + __construct ];

                                    if ((!interfaceProto[ methodArgumentPrefix + __construct ].every(function( item, index ){

                                        propName = item;
                                        lastIndex = index;

                                        if ( (methodProps[ index ] !== undefined || item[ COMPILER.PROPERTY_DEFAULT ] !== undefined) ) {

                                            if (methodProps[ index ] !== undefined) {

                                                if ( item[ COMPILER.PROPERTY_TYPE ] === methodProps[ index ][ COMPILER.PROPERTY_TYPE ]  ) {

                                                    return true;
                                                }
                                            }
                                        }
                                        if (item[ COMPILER.PROPERTY_DEFAULT ] !== undefined) {
                                            propDef = item[ COMPILER.PROPERTY_DEFAULT ][ COMPILER.VARIABLE_VALUE ];

                                        }

                                        return false;

                                    }) || ( methodProps[ ++lastIndex ] !== undefined && methodProps[ lastIndex][ COMPILER.PROPERTY_DEFAULT ] === undefined) ) ) {
                                        ENV[ PHP.Compiler.prototype.ERROR ]( "Declaration of " + className + "::" + __construct + "() must be compatible with " + interfaceName + "::" + __construct + "(" + ((  propName !== undefined ) ? ((propName[ COMPILER.PROPERTY_TYPE ] === undefined ) ? "" : propName[ COMPILER.PROPERTY_TYPE ] + " ") + "$" + propName.name : "" ) + (( propDef !== undefined) ? " = " + propDef : "") + ")", PHP.Constants.E_ERROR, true );
                                    }


                                }
                            }
                        });

                    });
                }


            }


            DECLARED = true;

            if ( classType !== PHP.VM.Class.INTERFACE ) {
                declaredClasses.push( className );
            }

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

        }


        Class.prototype[ PHP.VM.Class.INTERFACES ] = (Class.prototype[ PHP.VM.Class.INTERFACES ] === undefined ) ? [] : Array.prototype.slice.call(Class.prototype[ PHP.VM.Class.INTERFACES ], 0);

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
            methodName = methodName.toLowerCase();
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

                } else if ( checkType( this[ methodTypePrefix + methodName ], PROTECTED ) ) {
                    // we are calling a protected method, let's see if we are inside it
                    if ( !( ctx instanceof PHP.VM.ClassPrototype) ) { // todo check actually parents as well
                        ENV[ PHP.Compiler.prototype.ERROR ]( "Call to protected method " + this[ PHP.VM.Class.METHOD_PROTOTYPE + methodName ][ COMPILER.CLASS_NAME ] + "::" + methodName + "() from context '" + ((ctx instanceof PHP.VM.ClassPrototype) ? ctx[ COMPILER.CLASS_NAME ] : '') + "'", PHP.Constants.E_ERROR, true );
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

            value = (( value === undefined ) ? new PHP.VM.Variable() : value);
            if (className !== "ArrayObject") {
                PHP.Utils.CheckRef.call( ENV, value, this[ methodByRef  + methodName ] );
            }
            return value;


        };

        Class.prototype.callMethod = callMethod;


        Class.prototype[  COMPILER.STATIC_CALL  ] = function( ctx, methodClass, realName ) {
            var methodName = realName.toLowerCase();
            var ret;
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
                    ENV[ PHP.Compiler.prototype.ERROR ]( "Call to private method " + this[ PHP.VM.Class.METHOD_PROTOTYPE + methodName ][ COMPILER.CLASS_NAME ] + "::" + realName + "() from context '" + ((ctx instanceof PHP.VM.ClassPrototype) ? ctx[ COMPILER.CLASS_NAME ] : '') + "'", PHP.Constants.E_ERROR, true );
                } else if ( checkType( this[ methodTypePrefix + methodName ], PROTECTED ) ) {
                    // we are calling a protected method, let's see if we are inside it
                    if ( !( ctx instanceof PHP.VM.ClassPrototype) || !inherits( ctx, this[ COMPILER.CLASS_NAME ] ) ) {
                        ENV[ PHP.Compiler.prototype.ERROR ]( "Call to protected method " + this[ PHP.VM.Class.METHOD_PROTOTYPE + methodName ][ COMPILER.CLASS_NAME ] + "::" + realName + "() from context '" + ((ctx instanceof PHP.VM.ClassPrototype) ? ctx[ COMPILER.CLASS_NAME ] : '') + "'", PHP.Constants.E_ERROR, true );
                    }

                }



            }


            var methodToCall,
            methodCTX,
            $;
            var proto;



            if ( /^parent$/i.test( methodClass ) ) {
                proto = Object.getPrototypeOf( Object.getPrototypeOf( this ) );

            } else if ( /^self$/i.test( methodClass ) ) {
                proto = Object.getPrototypeOf( this );

            } else if ( methodClass !== className ){


                proto = Object.getPrototypeOf( this );
                while ( proto !== null && proto[ COMPILER.CLASS_NAME ] !== methodClass ) {
                    proto = Object.getPrototypeOf( proto );
                }

            }

            if ( proto !== undefined ) {
                methodToCall = proto[ methodPrefix + methodName ];
                methodCTX = proto[ PHP.VM.Class.METHOD_PROTOTYPE + methodName ];

                $ = buildVariableContext.call( proto, methodName, args, methodCTX[ COMPILER.CLASS_NAME ], realName, (checkType( proto[ methodTypePrefix + methodName ], STATIC )) ? false : this );



                if ( checkType( proto[ methodTypePrefix + methodName ], PRIVATE ) && methodCTX[ COMPILER.CLASS_NAME ] !== ctx[ COMPILER.CLASS_NAME ] ) {
                    if ( methodName === __construct ) {
                        ENV[ PHP.Compiler.prototype.ERROR ]( "Cannot call private " + methodCTX[ COMPILER.CLASS_NAME ] + "::" + realName + "()", PHP.Constants.E_ERROR, true );
                    }

                    ENV[ PHP.Compiler.prototype.ERROR ]( "Call to private method " + methodCTX[ COMPILER.CLASS_NAME ] + "::" + realName + "() from context '" + ((ctx instanceof PHP.VM.ClassPrototype) ? ctx[ COMPILER.CLASS_NAME ] : '') + "'", PHP.Constants.E_ERROR, true );

                }

                if ( checkType( proto[ methodTypePrefix + methodName ], ABSTRACT ) ) {

                    ENV[ PHP.Compiler.prototype.ERROR ]( "Cannot call abstract method " + methodCTX[ COMPILER.CLASS_NAME ] + "::" + realName + "()", PHP.Constants.E_ERROR, true );
                }

                if ( !checkType( proto[ methodTypePrefix + methodName ], STATIC ) && !/^(parent|self)$/i.test( methodClass ) && !inherits(ctx, proto[ PHP.VM.Class.METHOD_PROTOTYPE + methodName ][ COMPILER.CLASS_NAME ]) ) {
                    ENV[ PHP.Compiler.prototype.ERROR ]( "Non-static method " + proto[ PHP.VM.Class.METHOD_PROTOTYPE + methodName ][ COMPILER.CLASS_NAME ] + "::" + realName + "() should not be called statically", PHP.Constants.E_STRICT, true );
                }

                ret = methodToCall.call( this, $, methodCTX );


                PHP.Utils.CheckRef.call( ENV, ret, methodCTX[ methodByRef  + methodName ] );

                return ret;
            }



            ret = this.callMethod.call( this, methodName, args, function(){
                if ( !checkType( this[ methodTypePrefix + methodName ], STATIC ) && !/^(parent|self)$/i.test( methodClass ) && !inherits(ctx, this[ PHP.VM.Class.METHOD_PROTOTYPE + methodName ][ COMPILER.CLASS_NAME ]) ) {
                    ENV[ PHP.Compiler.prototype.ERROR ]( "Non-static method " + this[ PHP.VM.Class.METHOD_PROTOTYPE + methodName ][ COMPILER.CLASS_NAME ] + "::" + realName + "() should not be called statically", PHP.Constants.E_STRICT, true );
                }

            }.bind(this));


            PHP.Utils.CheckRef.call( ENV, ret, this[ methodByRef  + methodName ] );


            return ret;

        };

        Class.prototype[ COMPILER.STATIC_PROPERTY_GET ] = function( ctx, propertyClass, propertyName, ref ) {

            var methodCTX;
            if ( /^self$/i.test( propertyClass ) ) {
                methodCTX = ctx;
            } else if ( /^parent$/i.test( propertyClass )) {
                methodCTX = Object.getPrototypeOf( ctx );
            } else {
                methodCTX = this;
            }

            if (methodCTX[ PHP.VM.Class.CLASS_STATIC_PROPERTY + propertyName ] === undefined ) {
                ENV[ PHP.Compiler.prototype.ERROR ]( "Access to undeclared static property: " + methodCTX[ COMPILER.CLASS_NAME ] + "::$" + propertyName, PHP.Constants.E_ERROR, true );
            }


            if ( ref === true && !methodCTX.hasOwnProperty( PHP.VM.Class.CLASS_STATIC_PROPERTY + propertyName )) {
                methodCTX[ PHP.VM.Class.CLASS_STATIC_PROPERTY_REF + propertyClass + "$" + propertyName ] = new PHP.VM.Variable();
                return methodCTX[ PHP.VM.Class.CLASS_STATIC_PROPERTY_REF + propertyClass + "$" + propertyName ];
            }



            if (methodCTX[ PHP.VM.Class.CLASS_STATIC_PROPERTY_REF + propertyClass + "$" + propertyName ] !== undefined ) {
                return methodCTX[ PHP.VM.Class.CLASS_STATIC_PROPERTY_REF + propertyClass + "$" + propertyName ];
            }

            if (methodCTX[ PHP.VM.Class.CLASS_STATIC_PROPERTY + propertyName ] !== undefined ) {

                return methodCTX[ PHP.VM.Class.CLASS_STATIC_PROPERTY + propertyName ];
            } else {

        //      return methodCTX[ propertyPrefix + propertyName ];
        }


        };


        Class.prototype[ COMPILER.CLASS_STATIC_PROPERTY_ISSET ] = function( ctx, propertyClass, propertyName ) {

            var methodCTX;
            if ( /^self$/i.test( propertyClass ) ) {
                methodCTX = ctx;
            } else if ( /^parent$/i.test( propertyClass )) {
                methodCTX = Object.getPrototypeOf( ctx );
            } else {
                methodCTX = this;
            }

            if (methodCTX[ PHP.VM.Class.CLASS_STATIC_PROPERTY + propertyName ] === undefined ) {
                return false;
            }




            if (methodCTX[ PHP.VM.Class.CLASS_STATIC_PROPERTY_REF + propertyClass + "$" + propertyName ] !== undefined ) {
                return true;
            }

            if (methodCTX[ PHP.VM.Class.CLASS_STATIC_PROPERTY + propertyName ] !== undefined ) {

                return true;
            }

            return false;


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

        Class.prototype[ COMPILER.CLASS_PROPERTY_ISSET ] = function( ctx, propertyName ) {
            if ( this[ propertyPrefix + propertyName ] === undefined || checkType( this[ propertyTypePrefix + propertyName ], STATIC )) {
                return false;
            } else {
                return true;
            }

        };

        Class.prototype[ COMPILER.CLASS_PROPERTY_GET ] = function( ctx, propertyName ) {

            if ( this[ propertyPrefix + propertyName ] === undefined && this[ PHP.VM.Class.CLASS_STATIC_PROPERTY + propertyName] === undefined ) {


                var obj = {}, props = {};

                // property set
                if ( this[ methodPrefix + __set ] !== undefined ) {
                    obj [ COMPILER.ASSIGN ] = function( value ) {

                        callMethod.call( this, __set,  [ new PHP.VM.Variable( propertyName ), value ] );
                        return value;
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
                        if ( value === undefined ) {
                            return new PHP.VM.Variable();
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

                obj [ COMPILER.ASSIGN_PLUS ] = function( combined ) {

                    if ( this[ methodPrefix + __get ] !== undefined ) {

                        var value = callMethod.call( this, __get, [ new PHP.VM.Variable( propertyName ) ] );


                        // setting ++
                        if ( this[ methodPrefix + __set ] !== undefined ) {

                            callMethod.call( this, __set,  [ new PHP.VM.Variable( propertyName ), ( value instanceof PHP.VM.Variable ) ? value[ COMPILER.VARIABLE_VALUE ] + combined[ COMPILER.VARIABLE_VALUE ] : new PHP.VM.Variable( 1 ) ] );
                        }

                        return value;

                    }
                }.bind( this );

                obj [ COMPILER.CLASS_PROPERTY_GET ] = function() {

                    if ( this[ methodPrefix + __get ] !== undefined ) {

                        var value = callMethod.call( this, __get, [ new PHP.VM.Variable( propertyName ) ] );

                        return value[ COMPILER.CLASS_PROPERTY_GET ].apply( value, arguments );
                    }

                }.bind( this );

                obj [ COMPILER.ASSIGN_MINUS ] = function( combined ) {

                    if ( this[ methodPrefix + __get ] !== undefined ) {

                        var value = callMethod.call( this, __get, [ new PHP.VM.Variable( propertyName ) ] );


                        // setting ++
                        if ( this[ methodPrefix + __set ] !== undefined ) {

                            callMethod.call( this, __set,  [ new PHP.VM.Variable( propertyName ), ( value instanceof PHP.VM.Variable ) ? value[ COMPILER.VARIABLE_VALUE ] - combined[ COMPILER.VARIABLE_VALUE ] : new PHP.VM.Variable( 1 ) ] );
                        }

                        return value;

                    }
                }.bind( this );


                var $this = this;
                // property get
                if ( this[ methodPrefix + __get ] !== undefined ) {

                    props[ COMPILER.VARIABLE_VALUE ] = {
                        get : function(){

                            if (obj.__get === undefined ) {
                                obj.__get = callMethod.call( $this, __get, [ new PHP.VM.Variable( propertyName ) ] );
                            }
                            return obj.__get[ COMPILER.VARIABLE_VALUE ];


                        }
                    };

                    props[ VARIABLE.TYPE ] = {
                        get: function() {

                            if (obj.__get === undefined ) {
                                obj.__get = callMethod.call( $this, __get, [ new PHP.VM.Variable( propertyName ) ] );
                            }
                            return obj.__get[ VARIABLE.TYPE ];
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
                        }.bind(this);



                        return variable;
                    } else {
                        return this[ PHP.VM.Class.CLASS_UNDEFINED_PROPERTY + propertyName ];
                    }

                }
                return obj;


            } else {

                var checkPermissions = function( propertyPrefix ) {
                    if ( checkType( this[ propertyTypePrefix + propertyName ], PROTECTED ) && !(ctx instanceof PHP.VM.ClassPrototype) ) {
                        ENV[ PHP.Compiler.prototype.ERROR ]( "Cannot access protected property " + className + "::$" + propertyName, PHP.Constants.E_ERROR, true );
                    }

                    if ( checkType( this[ propertyTypePrefix + propertyName ], PRIVATE ) && !(ctx instanceof PHP.VM.ClassPrototype) ) {
                        ENV[ PHP.Compiler.prototype.ERROR ]( "Cannot access private property " + className + "::$" + propertyName, PHP.Constants.E_ERROR, true );
                    }

                    if (this[ propertyPrefix + propertyName ][ VARIABLE.DEFINED ] !== true && (!(ctx instanceof PHP.VM.ClassPrototype) || this[ PHP.VM.Class.CLASS_PROPERTY + ctx[ COMPILER.CLASS_NAME ] + "_" + propertyPrefix + propertyName ] === undefined  )) {
                        if (!(ctx instanceof PHP.VM.ClassPrototype) && checkType( this[ propertyTypePrefix + propertyName ], PRIVATE )) {
                            ENV[ PHP.Compiler.prototype.ERROR ]( "Cannot access private property " + className + "::$" + propertyName, PHP.Constants.E_ERROR, true );
                        }

                        if (checkType( this[ propertyTypePrefix + propertyName ], PROTECTED ) && ctx instanceof PHP.VM.ClassPrototype) {
                        // no change?
                        } else {
                            Object.getPrototypeOf(this)[ propertyTypePrefix + propertyName ] = 1;
                        }


                    }

                    if ( ctx instanceof PHP.VM.ClassPrototype && this[ PHP.VM.Class.CLASS_PROPERTY + ctx[ COMPILER.CLASS_NAME ] + "_" + propertyPrefix + propertyName ] !== undefined ) {
                        // favor current context over object only if current context property is private
                        if ( checkType( ctx[ propertyTypePrefix + propertyName ], PRIVATE ) ) {
                            return this[ PHP.VM.Class.CLASS_PROPERTY + ctx[ COMPILER.CLASS_NAME ] + "_" + propertyPrefix + propertyName ];
                        }
                    }

                }.bind(this),
                ret;

                if ( this[ propertyPrefix + propertyName ] !== undefined ) {
                    ret = checkPermissions( propertyPrefix );

                    if (ret !== undefined ) {
                        return ret;
                    }

                }

                if ( checkType( this[ propertyTypePrefix + propertyName ], STATIC ) ) {



                    ret = checkPermissions( PHP.VM.Class.CLASS_STATIC_PROPERTY );
                    if (ret !== undefined ) {
                        return ret;
                    }

                    ENV[ PHP.Compiler.prototype.ERROR ]( "Accessing static property " + className + "::$" + propertyName + " as non static", PHP.Constants.E_STRICT, true );
                    if ( this[ PHP.VM.Class.CLASS_UNDEFINED_PROPERTY + propertyName ] === undefined ) {
                        var variable = new PHP.VM.Variable();
                        variable[ VARIABLE.PROPERTY ] = true;
                        variable[ VARIABLE.DEFINED ] = className + "::$" + propertyName;

                        this[ PHP.VM.Class.CLASS_UNDEFINED_PROPERTY + propertyName ] = variable;

                        variable[ VARIABLE.REGISTER_SETTER ] = function() {
                            this[ propertyPrefix + propertyName ] = variable;
                        }.bind(this);



                        return variable;
                    } else {
                        if ( this[ PHP.VM.Class.CLASS_UNDEFINED_PROPERTY + propertyName ][ VARIABLE.DEFINED ] !== true ) {
                            this[ PHP.VM.Class.CLASS_UNDEFINED_PROPERTY + propertyName ][ VARIABLE.DEFINED ] = className + "::$" + propertyName;
                        }
                        return this[ PHP.VM.Class.CLASS_UNDEFINED_PROPERTY + propertyName ];
                    }
                }


                return this[ propertyPrefix + propertyName ];
            }


        };

        Class.prototype[  COMPILER.CLASS_CLONE  ] = function( ctx ) {

            var cloned = new (ENV.$Class.Get( this[ COMPILER.CLASS_NAME ] ))( true ),
            __clone = "__clone";
            cloned[ COMPILER.CLASS_STORED ] = []; // variables that store an instance of this class, needed for destructors

            // for...in, since we wanna go through the whole proto chain
            for (var prop in this) {
                if ( prop.substring(0, propertyPrefix.length) === propertyPrefix) {

                    if ( cloned[ prop ] === undefined ) {
                        cloned[ prop ] = new PHP.VM.Variable( this[ prop ][ COMPILER.VARIABLE_VALUE ] );
                    } else {
                        cloned[ prop ][ COMPILER.VARIABLE_VALUE ] = this[ prop ][ COMPILER.VARIABLE_VALUE ];
                    }
                }
            }

            if ( this[ methodPrefix + __clone ] !== undefined ) {


                if ( checkType( this[ methodTypePrefix + __clone ], PRIVATE ) && this[ PHP.VM.Class.METHOD_PROTOTYPE + __clone ][ COMPILER.CLASS_NAME ] !== ctx[ COMPILER.CLASS_NAME ] ) {

                    // targeted function is private and inaccessible from current context,
                    // but let's make sure current context doesn't have it's own private method that has been overwritten
                    if ( !ctx instanceof PHP.VM.ClassPrototype ||
                        ctx[ PHP.VM.Class.METHOD_PROTOTYPE + __clone ] === undefined ||
                        ctx[ PHP.VM.Class.METHOD_PROTOTYPE + __clone ][ COMPILER.CLASS_NAME ] !== ctx[ COMPILER.CLASS_NAME ] ) {
                        ENV[ PHP.Compiler.prototype.ERROR ]( "Call to private " + this[ PHP.VM.Class.METHOD_PROTOTYPE + __clone ][ COMPILER.CLASS_NAME ] + "::" + __clone + "() from context '" + ((ctx instanceof PHP.VM.ClassPrototype) ? ctx[ COMPILER.CLASS_NAME ] : '') + "'", PHP.Constants.E_ERROR, true );
                    }

                } else if ( checkType( this[ methodTypePrefix + __clone ], PROTECTED ) ) {
                    // we are calling a protected method, let's see if we are inside it
                    if ( !( ctx instanceof PHP.VM.ClassPrototype) ) { // todo check actually parents as well
                        ENV[ PHP.Compiler.prototype.ERROR ]( "Call to protected " + this[ PHP.VM.Class.METHOD_PROTOTYPE + __clone ][ COMPILER.CLASS_NAME ] + "::" + __clone + "() from context '" + ((ctx instanceof PHP.VM.ClassPrototype) ? ctx[ COMPILER.CLASS_NAME ] : '') + "'", PHP.Constants.E_ERROR, true );
                    }
                }




                var $ = buildVariableContext.call( this, __clone, [], className, __clone, cloned );



                this[ methodPrefix + __clone ].call( this, $, Object.getPrototypeOf(this) );


            // cloned.callMethod.call( cloned, __clone );
            }








            return new PHP.VM.Variable( cloned );
        };


        Class.prototype[ COMPILER.CLASS_DESTRUCT ] = function( ctx, shutdown ) {
            // check if this class has been destructed already



            if ( this[ PHP.VM.Class.KILLED ] === true ) {
                return;
            }

            // go through all assigned class props to see if we have closure classes to be killed
            // for...in, since we wanna go through the whole proto chain
            for (var prop in this) {
                if ( prop.substring(0, propertyPrefix.length) === propertyPrefix) {
                    this[ prop ][ PHP.VM.Class.KILLED ] = true;
                }
            }


            if ( checkType( this[ methodTypePrefix + __destruct ], PRIVATE ) && ( !(ctx instanceof PHP.VM.ClassPrototype) || this[ PHP.VM.Class.METHOD_PROTOTYPE + __destruct ][ COMPILER.CLASS_NAME ] !== ctx[ COMPILER.CLASS_NAME ]  )) {

                // targeted function is private and inaccessible from current context,
                // but let's make sure current context doesn't have it's own private method that has been overwritten
                if ( !(ctx instanceof PHP.VM.ClassPrototype) ||
                    ctx[ PHP.VM.Class.METHOD_PROTOTYPE + __destruct ] === undefined ||
                    ctx[ PHP.VM.Class.METHOD_PROTOTYPE + __destruct ][ COMPILER.CLASS_NAME ] !== ctx[ COMPILER.CLASS_NAME ] ) {

                    if ( shutdown === true ) {
                        ENV[ PHP.Compiler.prototype.ERROR ]( "Call to private " + className + "::" + __destruct + "() from context '" + ((ctx instanceof PHP.VM.ClassPrototype) ? ctx[ COMPILER.CLASS_NAME ] : '') + "' during shutdown ignored in Unknown on line 0", PHP.Constants.E_WARNING );
                        return;
                    } else {
                        ENV[ PHP.Compiler.prototype.ERROR ]( "Call to private " + className + "::" + __destruct + "() from context '" + ((ctx instanceof PHP.VM.ClassPrototype) ? ctx[ COMPILER.CLASS_NAME ] : '') + "'", PHP.Constants.E_ERROR, true );
                    }
                }

            }


            if ( checkType( this[ methodTypePrefix + __destruct ], PROTECTED) && (!( ctx instanceof PHP.VM.ClassPrototype) || !inherits( ctx, this[ COMPILER.CLASS_NAME ] ))) {

                if ( shutdown === true ) {
                    ENV[ PHP.Compiler.prototype.ERROR ]( "Call to protected " + className + "::" + __destruct + "() from context '" + ((ctx instanceof PHP.VM.ClassPrototype) ? ctx[ COMPILER.CLASS_NAME ] : '') + "' during shutdown ignored in Unknown on line 0", PHP.Constants.E_WARNING );
                    return;
                } else {
                    ENV[ PHP.Compiler.prototype.ERROR ]( "Call to protected " + className + "::" + __destruct + "() from context '" + ((ctx instanceof PHP.VM.ClassPrototype) ? ctx[ COMPILER.CLASS_NAME ] : '') + "'", PHP.Constants.E_ERROR, true );
                }

            }


            this[ PHP.VM.Class.KILLED ] = true;

            if ( this[  methodPrefix + __destruct  ] !== undefined ) {
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

        classDefinition.call( Class, methods, constant$, function( arg ) {
            var item = new PHP.VM.Variable( arg );
            item[ PHP.Compiler.prototype.NAV ] = true;
            item[ VARIABLE.INSTANCE ] = Class.prototype;

            return item;
        } );

        return methods;
    };



};
PHP.VM.Class.KILLED = "$Killed";

PHP.VM.ClassPrototype = function() {};

PHP.VM.Class.METHOD = "_";

PHP.VM.Class.METHOD_REALNAME = "€€";

PHP.VM.Class.CLASS_UNDEFINED_PROPERTY = "_£$";

PHP.VM.Class.CLASS_PROPERTY = "_£";

PHP.VM.Class.CLASS_STATIC_PROPERTY = "$_";

PHP.VM.Class.CLASS_STATIC_PROPERTY_REF = "Ö";

PHP.VM.Class.INTERFACES = "$Interfaces";

PHP.VM.Class.METHOD_PROTOTYPE = "$MP";

PHP.VM.Class.CONSTANT = "€";

PHP.VM.Class.PROPERTY = "$$";

PHP.VM.Class.PROPERTY_TYPE = "$£$";

PHP.VM.Class.CLASS_INDEX = "$CIndex";

PHP.VM.Class.Predefined = {};

PHP.VM.Class.PUBLIC = 1;
PHP.VM.Class.PROTECTED = 2;
PHP.VM.Class.PRIVATE = 4;
PHP.VM.Class.STATIC = 8;
PHP.VM.Class.ABSTRACT = 16;
PHP.VM.Class.FINAL = 32;
PHP.VM.Class.INTERFACE = 64;

