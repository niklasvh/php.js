/*
 * @author Niklas von Hertzen <niklas at hertzen.com>
 * @created 24.6.2012
 * @website http://hertzen.com
 */

PHP.VM.VariableHandler = function( ENV ) {

    var variables = {},
    methods = function( variableName, setTo ) {

        if ( setTo !== undefined ) {
            variables[ variableName ] = setTo;
            return methods;
        }

        if ( variables[ variableName ] === undefined ) {
            variables[ variableName ] = new PHP.VM.Variable();
            variables[ variableName ][ PHP.VM.Variable.prototype.DEFINED ] = variableName;
            variables[ variableName ].ENV = ENV;
            variables[ variableName ][ PHP.VM.Variable.prototype.NAME ] = variableName;
        }
        return variables[ variableName ];
    };

    return methods;
};

PHP.VM.VariableProto = function() {

    }

PHP.VM.VariableProto.prototype[ PHP.Compiler.prototype.ASSIGN ] = function( combinedVariable ) {

    var COMPILER = PHP.Compiler.prototype,
    VARIABLE = PHP.VM.Variable.prototype;

    this[ VARIABLE.VARIABLE_TYPE ] = undefined;

    if ( arguments.length > 1 ) {
        // chaining, todo make it work for unlimited vars
        this[ COMPILER.VARIABLE_VALUE ] = arguments[ 0 ][ COMPILER.VARIABLE_VALUE ] = arguments[ 1 ][ COMPILER.VARIABLE_VALUE ];
    } else {
        var val = combinedVariable[ COMPILER.VARIABLE_VALUE ]; // trigger get
        if ( combinedVariable[ VARIABLE.TYPE ] === VARIABLE.ARRAY ) {
            // Array assignment always involves value copying. Use the reference operator to copy an array by reference.
            this[ COMPILER.VARIABLE_VALUE ] = val[ COMPILER.METHOD_CALL ]( {}, COMPILER.ARRAY_CLONE  );

        } else {
            if (combinedVariable[ VARIABLE.TYPE ] === VARIABLE.NULL && this[ VARIABLE.TYPE ] === VARIABLE.OBJECT) {
                this.TMPCTX =   combinedVariable[ VARIABLE.INSTANCE ];
            }

            this[ COMPILER.VARIABLE_VALUE ] = val;
        }

        if ( combinedVariable[ VARIABLE.TYPE ] === VARIABLE.ARRAY || combinedVariable[ VARIABLE.TYPE ] === VARIABLE.OBJECT ) {
            this[ COMPILER.VARIABLE_VALUE ][ COMPILER.CLASS_STORED ].push( this );
        }


    }

    return this;

};

PHP.VM.VariableProto.prototype[ PHP.Compiler.prototype.INSTANCEOF ] = function( instanceName ) {

    var COMPILER = PHP.Compiler.prototype;

    var className,
    classObj = this[ COMPILER.VARIABLE_VALUE ];

    // search interfaces
    if ( classObj[ PHP.VM.Class.INTERFACES ].indexOf( instanceName ) !== -1 ) {

        return new PHP.VM.Variable( true );
    }

    // search parents
    do {
        className = classObj[ COMPILER.CLASS_NAME ];
        if (className === instanceName) {
            return new PHP.VM.Variable( true );
        }
        classObj = Object.getPrototypeOf( classObj );
    } while( className !== undefined );
    return new PHP.VM.Variable( false );

};

PHP.VM.VariableProto.prototype[ PHP.Compiler.prototype.CONCAT ] = function( combinedVariable ) {

    var COMPILER = PHP.Compiler.prototype,
    VARIABLE = PHP.VM.Variable.prototype;

    return new PHP.VM.Variable( this[ VARIABLE.CAST_STRING ][ COMPILER.VARIABLE_VALUE ] + "" + combinedVariable[ VARIABLE.CAST_STRING ][ COMPILER.VARIABLE_VALUE ] );
};

PHP.VM.VariableProto.prototype[ PHP.Compiler.prototype.ASSIGN_CONCAT ] = function( combinedVariable ) {

    var COMPILER = PHP.Compiler.prototype,
    VARIABLE = PHP.VM.Variable.prototype;
    this.NO_ERROR = true;

    var val = this[ COMPILER.VARIABLE_VALUE ]; // trigger get

    if ( this[ this.TYPE ] === this.NULL ) {
        this[ COMPILER.VARIABLE_VALUE ] = "" + combinedVariable[ COMPILER.VARIABLE_VALUE ];
    } else {
        this[ COMPILER.VARIABLE_VALUE ] = val + "" + combinedVariable[ COMPILER.VARIABLE_VALUE ];
    }
    this.NO_ERROR = false;
    return this;
};

PHP.VM.VariableProto.prototype[ PHP.Compiler.prototype.ASSIGN_PLUS ] = function( combinedVariable ) {

    var COMPILER = PHP.Compiler.prototype,
    VARIABLE = PHP.VM.Variable.prototype;
    this[ COMPILER.VARIABLE_VALUE ] = (this[ COMPILER.VARIABLE_VALUE ] - 0) + (combinedVariable[ COMPILER.VARIABLE_VALUE ] - 0);
    return this;
};

PHP.VM.VariableProto.prototype[ PHP.Compiler.prototype.ASSIGN_MINUS ] = function( combinedVariable ) {

    var COMPILER = PHP.Compiler.prototype,
    VARIABLE = PHP.VM.Variable.prototype;
    this[ COMPILER.VARIABLE_VALUE ] = this[ COMPILER.VARIABLE_VALUE ] - combinedVariable[ COMPILER.VARIABLE_VALUE ];
    return this;
};

PHP.VM.VariableProto.prototype[ PHP.Compiler.prototype.ADD ] = function( combinedVariable ) {

    var COMPILER = PHP.Compiler.prototype,
    val1 = this[ COMPILER.VARIABLE_VALUE ],
    val2 = combinedVariable[ COMPILER.VARIABLE_VALUE ];

    if ( isNaN(val1 - 0) ) {
        val1 = 0;
    }

    if ( isNaN(val2 - 0) ) {
        val2 = 0;
    }

    return new PHP.VM.Variable( (val1 - 0) + (val2 - 0) );
};

PHP.VM.VariableProto.prototype[ PHP.Compiler.prototype.MUL ] = function( combinedVariable ) {

    var COMPILER = PHP.Compiler.prototype;
    return new PHP.VM.Variable( (this[ COMPILER.VARIABLE_VALUE ] - 0) * ( combinedVariable[ COMPILER.VARIABLE_VALUE ] - 0 ) );
};

PHP.VM.VariableProto.prototype[ PHP.Compiler.prototype.DIV ] = function( combinedVariable ) {

    var COMPILER = PHP.Compiler.prototype;

    var val = (this[ COMPILER.VARIABLE_VALUE ] - 0) / ( combinedVariable[ COMPILER.VARIABLE_VALUE ] - 0 );
    if ( val === Number.POSITIVE_INFINITY ) {
        this.ENV[ COMPILER.ERROR ]("Division by zero", PHP.Constants.E_WARNING, true );
        return new PHP.VM.Variable( );
    }
    return new PHP.VM.Variable( val );
};

PHP.VM.VariableProto.prototype[ PHP.Compiler.prototype.MOD ] = function( combinedVariable ) {

    var COMPILER = PHP.Compiler.prototype;
    return new PHP.VM.Variable( (this[ COMPILER.VARIABLE_VALUE ]) % ( combinedVariable[ COMPILER.VARIABLE_VALUE ]) );
};

PHP.VM.VariableProto.prototype[ PHP.Compiler.prototype.MINUS ] = function( combinedVariable, post ) {

    var COMPILER = PHP.Compiler.prototype;

    if ( post === true ) {
        var after = combinedVariable[ COMPILER.VARIABLE_VALUE ] - 0,
        before = this[ COMPILER.VARIABLE_VALUE ] - 0;
        return new PHP.VM.Variable( before - after );

    } else {
        return new PHP.VM.Variable( (this[ COMPILER.VARIABLE_VALUE ] - 0) - ( combinedVariable[ COMPILER.VARIABLE_VALUE ] - 0 ) );
    }
};

PHP.VM.VariableProto.prototype[ PHP.Compiler.prototype.METHOD_CALL ] = function() {

    var COMPILER = PHP.Compiler.prototype;

    return this[ COMPILER.VARIABLE_VALUE ][ PHP.Compiler.prototype.METHOD_CALL ].apply( this[ COMPILER.VARIABLE_VALUE ], arguments );
};

PHP.VM.VariableProto.prototype[ PHP.Compiler.prototype.BOOLEAN_NOT ] = function() {

    var COMPILER = PHP.Compiler.prototype;
    return new PHP.VM.Variable( !(this[ COMPILER.VARIABLE_VALUE ]) );
};

PHP.VM.VariableProto.prototype[ PHP.Compiler.prototype.IDENTICAL ] = function( compareTo ) {

    var COMPILER = PHP.Compiler.prototype;
    return new PHP.VM.Variable( (this[ COMPILER.VARIABLE_VALUE ]) === ( compareTo[ COMPILER.VARIABLE_VALUE ]) );
};

PHP.VM.VariableProto.prototype[ PHP.Compiler.prototype.NOT_IDENTICAL ] = function( compareTo ) {

    var COMPILER = PHP.Compiler.prototype;
    return new PHP.VM.Variable( (this[ COMPILER.VARIABLE_VALUE ]) !== ( compareTo[ COMPILER.VARIABLE_VALUE ]) );
};

PHP.VM.VariableProto.prototype[ PHP.Compiler.prototype.EQUAL ] = function( compareTo ) {

    var COMPILER = PHP.Compiler.prototype,
    ARRAY = PHP.VM.Array.prototype,
    first = this,
    second = compareTo,
    cast;

    if ( first[ this.TYPE ] === this.OBJECT && second[ this.TYPE ] === this.OBJECT ) {
        cast = (first[ COMPILER.VARIABLE_VALUE ].Native === true || second[ COMPILER.VARIABLE_VALUE ].Native === true);
        if ( cast ) {
            first = first[ this.CAST_INT ];
            second = second[ this.CAST_INT ];
        }
    } else if ( first[ this.TYPE ] === this.ARRAY && second[ this.TYPE ] === this.ARRAY ) {
        var firstVals = first[ COMPILER.VARIABLE_VALUE ][ PHP.VM.Class.PROPERTY + ARRAY.VALUES ][ COMPILER.VARIABLE_VALUE ],
        secondVals = second[ COMPILER.VARIABLE_VALUE ][ PHP.VM.Class.PROPERTY + ARRAY.VALUES ][ COMPILER.VARIABLE_VALUE ];

        if (firstVals.length !== secondVals.length) {
            return new PHP.VM.Variable( false );
        }

        var result = firstVals.every(function( val,index ){
            return (val[ COMPILER.VARIABLE_VALUE ] == secondVals[ index ][ COMPILER.VARIABLE_VALUE ]);
        });

        return new PHP.VM.Variable( result );

    }



    return new PHP.VM.Variable( (first[ COMPILER.VARIABLE_VALUE ]) == ( second[ COMPILER.VARIABLE_VALUE ]) );
};

PHP.VM.VariableProto.prototype[ PHP.Compiler.prototype.SMALLER_OR_EQUAL ] = function( compareTo ) {

    var COMPILER = PHP.Compiler.prototype;
    return new PHP.VM.Variable( (this[ COMPILER.VARIABLE_VALUE ]) <= ( compareTo[ COMPILER.VARIABLE_VALUE ]) );
};

PHP.VM.VariableProto.prototype[ PHP.Compiler.prototype.GREATER_OR_EQUAL ] = function( compareTo ) {

    var COMPILER = PHP.Compiler.prototype;
    return new PHP.VM.Variable( (this[ COMPILER.VARIABLE_VALUE ]) >= ( compareTo[ COMPILER.VARIABLE_VALUE ]) );
};

PHP.VM.VariableProto.prototype[ PHP.Compiler.prototype.SMALLER ] = function( compareTo ) {

    var COMPILER = PHP.Compiler.prototype;
    return new PHP.VM.Variable( (this[ COMPILER.VARIABLE_VALUE ]) < ( compareTo[ COMPILER.VARIABLE_VALUE ]) );
};

PHP.VM.VariableProto.prototype[ PHP.Compiler.prototype.GREATER ] = function( compareTo ) {

    var COMPILER = PHP.Compiler.prototype;
    return new PHP.VM.Variable( (this[ this.CAST_DOUBLE ][ COMPILER.VARIABLE_VALUE ]) > ( compareTo[ this.CAST_DOUBLE ][ COMPILER.VARIABLE_VALUE ]) );
};

PHP.VM.VariableProto.prototype[ PHP.Compiler.prototype.BOOLEAN_OR ] = function( compareTo ) {
    var COMPILER = PHP.Compiler.prototype;
    return new PHP.VM.Variable( (this[ this.CAST_STRING ][ COMPILER.VARIABLE_VALUE ]) | ( compareTo[ this.CAST_STRING ][ COMPILER.VARIABLE_VALUE ]) );
};

PHP.VM.Variable = function( arg ) {

    var value,
    POST_MOD = 0,
    __toString = "__toString",
    COMPILER = PHP.Compiler.prototype,

    setValue = function( newValue ) {

        var prev = value;
        var setType = function( newValue ) {
            if (this[ this.OVERLOADED ] === undefined) {



                if ( newValue === undefined ) {
                    newValue = null;
                }

                if ( newValue instanceof PHP.VM.Variable ) {
                    newValue = newValue[ COMPILER.VARIABLE_VALUE ];
                }

                if ( typeof newValue === "string" ) {
                    this[ this.TYPE ] = this.STRING;
                } else if ( typeof newValue === "function" ) {
                    this[ this.TYPE ] = this.LAMBDA;
                } else if ( typeof newValue === "number" ) {
                    if ( newValue % 1 === 0 ) {
                        this[ this.TYPE ] = this.INT;
                    } else {
                        this[ this.TYPE ] = this.FLOAT;
                    }
                } else if ( newValue === null ) {
                    if ( this[ this.TYPE ] === this.OBJECT && value instanceof PHP.VM.ClassPrototype ) {

                        this[ PHP.VM.Class.KILLED ] = true;
                        if (value[ COMPILER.CLASS_STORED ].every(function( variable ){

                            return ( variable[ PHP.VM.Class.KILLED ] === true );
                        })) {
                            // all variable instances have been killed, can safely destruct

                            value[ COMPILER.CLASS_DESTRUCT ]( this.TMPCTX );
                        }

                    }

                    this[ this.TYPE ] = this.NULL;

                } else if ( typeof newValue === "boolean" ) {
                    this[ this.TYPE ] = this.BOOL;
                } else if ( newValue instanceof PHP.VM.ClassPrototype ) {
                    if ( newValue[ COMPILER.CLASS_NAME ] === PHP.VM.Array.prototype.CLASS_NAME ) {
                        this[ this.TYPE ] = this.ARRAY;

                    } else {

                        this[ this.TYPE ] = this.OBJECT;
                    }
                } else if ( newValue instanceof PHP.VM.Resource ) {
                    this[ this.TYPE ] = this.RESOURCE;
                } else {

                }
                this[ this.DEFINED ] = true;

                // is variable a reference
                if ( this[ this.REFERRING ] !== undefined ) {

                    this[ this.REFERRING ][ COMPILER.VARIABLE_VALUE ] = newValue;
                } else {

                    value = newValue;

                    // remove this later, debugging only
                    this.val = newValue;

                }
            }

        }.bind(this);
        setType( newValue );
        if ( typeof this[this.REGISTER_SETTER ] === "function" ) {
            var ret =  this[ this.REGISTER_SETTER ]( value );
            if ( ret === false ) {
                setType( prev );
                value = prev;
            }
        }

    }.bind( this ); // something strange going on with context in node.js?? iterators_2.phpt

    this.rand = Math.random();
    this.NO_ERROR = false;
    setValue.call( this, arg );


    if (this[ this.TYPE ] === this.INT) {
        this[ this.VARIABLE_TYPE ] = this.NEW_VARIABLE;
    }

    this[ COMPILER.VARIABLE_CLONE ] = function() {
        var variable;

        if ( this[ this.IS_REF ]) {
            return this;
        }

        switch( this[ this.TYPE ] ) {
            case this.NULL:
            case this.BOOL:
            case this.INT:
            case this.FLOAT:
            case this.STRING:
                variable = new PHP.VM.Variable( this[ COMPILER.VARIABLE_VALUE ] );
                break;
            case this.OBJECT:
            case this.RESOURCE:
                return this;
            case this.ARRAY:
                variable = new PHP.VM.Variable( this[ COMPILER.VARIABLE_VALUE ][ COMPILER.METHOD_CALL ]( {}, COMPILER.ARRAY_CLONE  ) )
                break;
            default:
                return this;
        }

        variable[ this.REFERRING ] = this[ this.REFERRING ];




        return variable;

    };

    this [ this.REF ] = function( variable ) {

        if (this === variable) {
            /// hehehehehe referring yourself... results in thread lock
            return this;
        }
        if ( variable [ this.VARIABLE_TYPE ] === this.FUNCTION  ) {
            this.ENV[ COMPILER.ERROR ]("Only variables should be assigned by reference", PHP.Constants.E_STRICT, true );
            this[ COMPILER.ASSIGN ]( variable );
            return this;
        }

        var tmp = variable[ COMPILER.VARIABLE_VALUE ]; // trigger get

        // call setter incase we need to complete array push transaction
        if ( typeof this[this.REGISTER_SETTER ] === "function" ) {
            this[this.REGISTER_SETTER ]();
        }

        this[ this.REFERRING ] = variable;
        this[ this.DEFINED ] = true;

        variable[ this.IS_REF ] = true;

        return this;
    };

    this[ COMPILER.NEG ] = function() {
        return new PHP.VM.Variable(-this[ COMPILER.VARIABLE_VALUE ]);
    };

    this[ COMPILER.PRE_INC ] = function() {
        this[ COMPILER.VARIABLE_VALUE ]++;
        return this;
    };

    this[ COMPILER.PRE_DEC ] = function() {
        this[ COMPILER.VARIABLE_VALUE ]--;
        return this;
    };

    this[ COMPILER.POST_INC ] = function() {
        this.NO_ERROR = true;
        var tmp = this[ COMPILER.VARIABLE_VALUE ]; // trigger get, incase there is POST_MOD

        if (this[ this.DEFINED ] !== true) {
            this[ COMPILER.VARIABLE_VALUE ] = 0;
        }

        this.NO_ERROR = false;
        POST_MOD++;
        this.POST_MOD = POST_MOD;
        return this;

    };


    this[ COMPILER.POST_DEC ] = function() {
        var tmp = this[ COMPILER.VARIABLE_VALUE ]; // trigger get, incase there is POST_MOD
        POST_MOD--;
        this.POST_MOD = POST_MOD;
        return this;
    };




    this[ PHP.Compiler.prototype.UNSET ] = function() {

        setValue( null );
        this[ this.DEFINED ] = this[ this.NAME ];

        if ( this[ this.REFERRING ] !== undefined ) {
            this [ this.REFERRING ][ PHP.Compiler.prototype.UNSET ]();
        }
    };
    // property get proxy
    this[ COMPILER.CLASS_PROPERTY_GET ] = function( ctx, propertyName, funcCall ) {
        var val, $this = this;

        if ( this[ this.REFERRING ] !== undefined ) {
            $this = this [ this.REFERRING ];
        }

        if ($this[ this.TYPE ] !== this.OBJECT){

            val = new (this.ENV.$Class.Get("stdClass"))( this );

            if ($this[ this.TYPE ] === this.NULL ||
                ($this[ this.TYPE ] === this.BOOL && $this[ COMPILER.VARIABLE_VALUE ] === false) ||
                ($this[ this.TYPE ] === this.STRING && $this[ COMPILER.VARIABLE_VALUE ].length === 0)
                ) {
                if ( funcCall !== true ) {
                    if ( $this[ this.PROPERTY ] !== true ) {
                        this.ENV[ COMPILER.ERROR ]("Creating default object from empty value", PHP.Constants.E_WARNING, true );
                    }
                }
                $this[ COMPILER.VARIABLE_VALUE ] = val;
            } else {
                this.ENV[ COMPILER.ERROR ]("Attempt to assign property of non-object", PHP.Constants.E_WARNING, true );


            }

        } else {
            val =  $this[ COMPILER.VARIABLE_VALUE ];
        }
        return val[ COMPILER.CLASS_PROPERTY_GET ].apply( val, arguments );
    };

    Object.defineProperty( this, COMPILER.VARIABLE_VALUE,
    {
        get : function(){
            var $this = this,
            returning;
            if ( this[ this.REFERRING ] !== undefined ) {
                $this = this[this.REFERRING];
            }

            if ( typeof this[this.REGISTER_GETTER ] === "function" ) {
                var returned = this[ this.REGISTER_GETTER ]();
                if ( returned instanceof PHP.VM.Variable ) {
                    this[ this.TYPE ] = returned[ this.TYPE ];
                    this[ this.DEFINED ] = returned[ this.DEFINED ];
                    return returned[ COMPILER.VARIABLE_VALUE ];
                }

            }

            if ( $this[ this.DEFINED ] !== true && $this[ COMPILER.SUPPRESS ] !== true ) {

                if ( $this[ this.CONSTANT ] === true ) {
                    this.ENV[ COMPILER.ERROR ]("Use of undefined constant " + $this[ this.DEFINED ] + " - assumed '" + $this[ this.DEFINED ] + "'", PHP.Constants.E_CORE_NOTICE, true );
                    $this[ this.TYPE ] = this.STRING;

                    returning = $this[ this.DEFINED ];
                    $this[ COMPILER.VARIABLE_VALUE ] = $this[ this.DEFINED ];
                    $this[ this.DEFINED ] = true;

                    return returning;
                } else {
                    if (this.NO_ERROR !==  true ) {
                        this.ENV[ COMPILER.ERROR ]("Undefined " + ($this[ this.PROPERTY ] === true ? "property" : "variable") + ": " + $this[ this.DEFINED ], PHP.Constants.E_NOTICE, true );
                    }
                }
            }
            if ( this[ this.REFERRING ] === undefined ) {
                returning = value;
            } else {
                var referLoop = $this;

                while( referLoop[ this.REFERRING ] !== undefined ) {
                    referLoop = referLoop[ this.REFERRING ];
                }

                this[ this.TYPE ] = referLoop[ this.TYPE ];
                returning = $this[ COMPILER.VARIABLE_VALUE ];
            }

            // perform POST_MOD change

            if ( POST_MOD !== 0 ) {
                var setPOST_MOD = POST_MOD;
                POST_MOD = 0; // reset counter
                $this[ COMPILER.VARIABLE_VALUE ] += setPOST_MOD - 0;
            //     value = POST_MOD + (value - 0);

            }


            return returning;
        },
        set : setValue
    }
    );

    Object.defineProperty( this, this.CAST_BOOL,
    {
        get : function(){
            // http://www.php.net/manual/en/language.types.boolean.php#language.types.boolean.casting

            var value = this[ COMPILER.VARIABLE_VALUE ]; // trigger get, incase there is POST_MOD

            switch( this[ this.TYPE ]) {
                case this.INT:
                case this.FLOAT:
                    if ( value === 0 ) {
                        return new PHP.VM.Variable( false );
                    } else {
                        return new PHP.VM.Variable( true );
                    }
                    break;

                case this.STRING:
                    if ( value.length === 0 || value === "0" ) {
                        return new PHP.VM.Variable( false );
                    } else {
                        return new PHP.VM.Variable( true );
                    }
                    break;

                case this.ARRAY:
                    if ( value[ PHP.VM.Class.PROPERTY + PHP.VM.Array.prototype.VALUES ][ COMPILER.VARIABLE_VALUE ].length === 0 ) {
                        return new PHP.VM.Variable( false );
                    } else {
                        return new PHP.VM.Variable( true );
                    }
                    break;

                case this.OBJECT:
                    // TODO
                    return new PHP.VM.Variable( true );

                case this.NULL:
                    return new PHP.VM.Variable( false );
                    break;
            }


            return this;
        }
    }
    );

    Object.defineProperty( this, this.CAST_INT,
    {
        get : function(){
            // http://www.php.net/manual/en/language.types.integer.php

            var value = this[ COMPILER.VARIABLE_VALUE ]; // trigger get, incase there is POST_MOD


            switch ( this[ this.TYPE ] ) {

                case this.BOOL:
                    return new PHP.VM.Variable( ( value === true ) ? 1 : 0 );
                    break;

                case this.FLOAT:
                    return new PHP.VM.Variable( Math.floor( value ) );
                    break;
                case this.STRING:
                    if (isNaN( parseInt(value, 10))) {
                        return new PHP.VM.Variable( 0 );
                    } else {
                        return new PHP.VM.Variable( parseInt(value, 10) );
                    }
                    break;
                case this.OBJECT:
                    this.ENV[ COMPILER.ERROR ]("Object of class " + value[ COMPILER.CLASS_NAME ] + " could not be converted to int", PHP.Constants.E_NOTICE, true );
                    return new PHP.VM.Variable();
                    break;

                default:
                    return this;
            }

        }
    }
    );


    Object.defineProperty( this, this.CAST_DOUBLE,
    {
        get : function(){
            // http://www.php.net/manual/en/language.types.integer.php

            var value = this[ COMPILER.VARIABLE_VALUE ], // trigger get, incase there is POST_MOD
            ret;


            switch ( this[ this.TYPE ] ) {

                case this.BOOL:
                    return new PHP.VM.Variable( ( value === true ) ? 1.0 : 0.0 );
                    break;

                case this.INT:

                    ret =  new PHP.VM.Variable( parseFloat(value) );
                    ret[ this.TYPE ] = this.FLOAT;
                    return ret;
                    break;
                case this.STRING:
                    if (isNaN( parseFloat(value) ) ) {
                        ret = new PHP.VM.Variable( 0.0 );

                    } else {
                        ret =  new PHP.VM.Variable( parseFloat(value) );
                    }
                    ret[ this.TYPE ] = this.FLOAT;
                    return ret;
                    break;

                default:
                    return this;
            }

        }
    }
    );

    Object.defineProperty( this, this.CAST_STRING,
    {
        get : function() {
            //   http://www.php.net/manual/en/language.types.string.php#language.types.string.casting

            var value = this[ COMPILER.VARIABLE_VALUE ]; // trigger get, incase there is POST_MOD

            if ( value instanceof PHP.VM.ClassPrototype && value[ COMPILER.CLASS_NAME ] !== PHP.VM.Array.prototype.CLASS_NAME  ) {
                // class
                // check for __toString();



                if ( typeof value[PHP.VM.Class.METHOD + __toString.toLowerCase() ] === "function" ) {
                    try {
                        var val = value[ COMPILER.METHOD_CALL ]( this, __toString );
                    } catch( e ) {
                        this.ENV[ COMPILER.ERROR ]("Method " + value[ COMPILER.CLASS_NAME ] + "::" + __toString + "() must not throw an exception", PHP.Constants.E_ERROR, true, false, true );
                        return new PHP.VM.Variable("");
                    }
                    if (val[ this.TYPE ] !==  this.STRING) {
                        this.ENV[ COMPILER.ERROR ]("Method " + value[ COMPILER.CLASS_NAME ] + "::" + __toString + "() must return a string value", PHP.Constants.E_RECOVERABLE_ERROR, true );
                        return new PHP.VM.Variable("");
                    }
                    val[ this.VARIABLE_TYPE ] = this.FUNCTION;
                    return val;
                //  return new PHP.VM.Variable( value[PHP.VM.Class.METHOD + __toString ]() );
                } else {
                    this.ENV[ COMPILER.ERROR ]("Object of class " + value[ COMPILER.CLASS_NAME ] + " could not be converted to string", PHP.Constants.E_RECOVERABLE_ERROR, true );



                    return new PHP.VM.Variable("");
                }

            }
            else if (this[ this.TYPE ] === this.BOOL) {
                return new PHP.VM.Variable( ( value ) ? "1" : "" );
            } else if (this[ this.TYPE ] === this.INT) {
                return new PHP.VM.Variable(  value + "" );
            } else if (this[ this.TYPE ] === this.NULL) {
                return new PHP.VM.Variable( "" );
            }
            return this;
        }
    }
    );

    this[ COMPILER.DIM_UNSET ] = function( ctx, variable  ) {

        var value = this[ COMPILER.VARIABLE_VALUE ]; // trigger get

        if ( this[ this.TYPE ] !== this.ARRAY ) {
            if ( this[ this.TYPE ] === this.OBJECT && value[ PHP.VM.Class.INTERFACES ].indexOf("ArrayAccess") !== -1) {

                value[ COMPILER.METHOD_CALL ]( ctx, "offsetUnset", variable )[ COMPILER.VARIABLE_VALUE ]; // trigger offsetUnset
            }
        } else {

            value[ COMPILER.METHOD_CALL ]( ctx, "offsetUnset", variable );
        }



    };

    this[ COMPILER.DIM_ISSET ] = function( ctx, variable  ) {

        var $this = this;

        if ( this[ this.REFERRING ] !== undefined ) {

            var referLoop = $this;

            while( referLoop[ this.REFERRING ] !== undefined ) {
                referLoop = referLoop[ this.REFERRING ];
            }

            $this = referLoop;

        }

        if ( $this[ this.TYPE ] !== this.ARRAY ) {
            if ( $this[ this.TYPE ] === this.OBJECT && $this.val[ PHP.VM.Class.INTERFACES ].indexOf("ArrayAccess") !== -1) {

                var exists = $this.val[ COMPILER.METHOD_CALL ]( ctx, "offsetExists", variable )[ COMPILER.VARIABLE_VALUE ]; // trigger offsetExists
                return exists;


            } else {

                return false;
            }
        }

        var returning = $this.val[ COMPILER.METHOD_CALL ]( ctx, COMPILER.ARRAY_GET, variable );

        return (returning[ this.DEFINED ] === true );

    };

    this[ COMPILER.DIM_EMPTY ] = function( ctx, variable  ) {

        if ( this[ this.TYPE ] !== this.ARRAY ) {

            if ( this[ this.TYPE ] === this.OBJECT && value[ PHP.VM.Class.INTERFACES ].indexOf("ArrayAccess") !== -1) {

                var exists = value[ COMPILER.METHOD_CALL ]( ctx, "offsetExists", variable )[ COMPILER.VARIABLE_VALUE ]; // trigger offsetExists


                if ( exists === true ) {
                    var val = value[ COMPILER.METHOD_CALL ]( ctx, COMPILER.ARRAY_GET, variable ); // trigger offsetGet
                    return val;

                } else {
                    return true;
                }


            } else {
                // looking in a non-existant array, so obviously its empty
                return true;
            }
        } else {
            return this[ COMPILER.DIM_FETCH ]( ctx, variable);
        }



    };

    Object.defineProperty( this, COMPILER.DIM_FETCH,
    {
        get : function(){

            return function( ctx, variable ) {

                var $this = this;

                if ( variable instanceof PHP.VM.Variable && variable[ this.TYPE ] === this.OBJECT ) {
                    this.ENV[ COMPILER.ERROR ]("Illegal offset type", PHP.Constants.E_WARNING, true );
                    return new PHP.VM.Variable();
                }

                if ( typeof this[this.REGISTER_GETTER ] === "function" ) {
                    var returned = this[ this.REGISTER_GETTER ]();
                    if ( returned instanceof PHP.VM.Variable ) {

                        this[ this.TYPE ] = returned[ this.TYPE ];
                        this[ this.DEFINED ] = returned[ this.DEFINED ];
                        var item = returned[ COMPILER.DIM_FETCH ]( ctx, variable );
                        /*
                        if (returned[ this.OVERLOADING ] !== undefined) {
                            item[ this.OVERLOADED ] = returned[ this.OVERLOADING ];

                        }

                        item[ this.REGISTER_SETTER ] = function() {

                            if (item[ this.OVERLOADING ] !== undefined) {
                                this.ENV[ COMPILER.ERROR ]("Indirect modification of overloaded element of " + item[ this.OVERLOADING ] + " has no effect", PHP.Constants.E_CORE_NOTICE, true );
                                item[ this.OVERLOADED ] = item[ this.OVERLOADING ];
                            //   item[ this.OVERLOADED ] = returned[ this.OVERLOADING ];
                            }
                        }
                     */
                        return item;
                    }

                }

                if ( this[ this.TYPE ] === this.INT ) {
                    this.ENV[ COMPILER.ERROR ]("Cannot use a scalar value as an array", PHP.Constants.E_WARNING, true );
                    return new PHP.VM.Variable();
                } else if (this[ this.TYPE ] === this.STRING) {
                    if ( variable[ this.TYPE ] !== this.INT ) {
                        this.ENV[ COMPILER.ERROR ]("Illegal string offset '" + variable[ COMPILER.VARIABLE_VALUE ] + "'", PHP.Constants.E_WARNING, true );
                        return new PHP.VM.Variable( this[ COMPILER.VARIABLE_VALUE ] );
                    } else {
                        var ret = new PHP.VM.Variable( this[ COMPILER.VARIABLE_VALUE ].substr( variable[ COMPILER.VARIABLE_VALUE ], 1 ));

                        ret[ this.REGISTER_SETTER ] = function( value ) {
                            this[ COMPILER.VARIABLE_VALUE ] = this[ COMPILER.VARIABLE_VALUE ].substr( 0, variable[ COMPILER.VARIABLE_VALUE ] ) + value + this[ COMPILER.VARIABLE_VALUE ].substr( 1 + variable[ COMPILER.VARIABLE_VALUE ]);
                        }.bind( this );

                        return ret;
                    }
                }


                if ( this[ this.REFERRING ] !== undefined ) {
                    $this = this[this.REFERRING];
                }



                if ( $this[ this.TYPE ] !== this.ARRAY ) {
                    if ( $this[ this.TYPE ] === this.OBJECT && value[ PHP.VM.Class.INTERFACES ].indexOf("ArrayAccess") !== -1) {

                        var dimHandler = new PHP.VM.Variable();
                        dimHandler[ this.REGISTER_GETTER ] = function() {
                            var val = value[ COMPILER.METHOD_CALL ]( ctx, COMPILER.ARRAY_GET, variable );
                            val [ $this.OVERLOADING ] = value[ COMPILER.CLASS_NAME ];
                            if ( val[ this.DEFINED ] !== true ) {
                                this.ENV[ COMPILER.ERROR ]("Undefined " + (variable[ this.TYPE ] === this.INT ? "offset" : "index") + ": " + variable[ COMPILER.VARIABLE_VALUE ], PHP.Constants.E_CORE_NOTICE, true );
                                return new PHP.VM.Variable();
                            }

                            if ( val[ this.TYPE ] === this.ARRAY ) {

                                val[ COMPILER.VARIABLE_VALUE ][ this.REGISTER_ARRAY_SETTER ] = function() {

                                    this.ENV[ COMPILER.ERROR ]("Indirect modification of overloaded element of " + value[ COMPILER.CLASS_NAME ] + " has no effect", PHP.Constants.E_CORE_NOTICE, true );
                                    return false;
                                }.bind( val );
                            }

                            return val;
                        };

                        dimHandler[ this.REGISTER_SETTER ] = function( val ) {

                            if ( val === null ) {
                                this.ENV[ COMPILER.ERROR ]("Indirect modification of overloaded element of " + value[ COMPILER.CLASS_NAME ] + " has no effect", PHP.Constants.E_CORE_NOTICE, true );
                            }


                            var val = value[ COMPILER.METHOD_CALL ]( ctx, COMPILER.ARRAY_SET, variable, val );

                            if ( val[ this.DEFINED ] !== true ) {
                                this.ENV[ COMPILER.ERROR ]("Undefined " + (variable[ this.TYPE ] === this.INT ? "offset" : "index") + ": " + variable[ COMPILER.VARIABLE_VALUE ], PHP.Constants.E_CORE_NOTICE, true );
                                return new PHP.VM.Variable();
                            }
                            return val;
                        };

                        dimHandler[ COMPILER.POST_INC ] = function() {
                            var val = value[ COMPILER.METHOD_CALL ]( ctx, COMPILER.ARRAY_GET, variable ); // trigger get
                            this.ENV[ COMPILER.ERROR ]("Indirect modification of overloaded element of " + value[ COMPILER.CLASS_NAME ] + " has no effect", PHP.Constants.E_CORE_NOTICE, true );
                            return val;
                        };

                        dimHandler[ this.REF ] = function() {
                            this.ENV[ PHP.Compiler.prototype.ERROR ]( "Cannot assign by reference to overloaded object", PHP.Constants.E_ERROR, true );
                        };

                        return dimHandler;
                    } else {

                        var notdefined = false;

                        // cache DEFINED value
                        if ( $this[ this.DEFINED ] !== true && $this[ COMPILER.SUPPRESS ] !== true ) {
                            notdefined = $this[ this.DEFINED ];
                        }

                        $this[ COMPILER.VARIABLE_VALUE ] = this.ENV.array([]);
                        if ( notdefined !== false ) {
                            $this[ this.DEFINED ] = notdefined;
                        }
                    }
                }

                var returning;
                if ( value === null ) {
                    returning = this[ COMPILER.VARIABLE_VALUE ][ COMPILER.METHOD_CALL ]( ctx, COMPILER.ARRAY_GET, variable );
                } else {
                    returning = value[ COMPILER.METHOD_CALL ]( ctx, COMPILER.ARRAY_GET, variable );
                }

                if (returning[ this.DEFINED ] !== true ) {
                    var saveFunc = returning[ this.REGISTER_SETTER ],
                    arrThis = this;


                    returning[ this.REGISTER_SETTER ] = function( val ) {
                        arrThis[ this.DEFINED ] = true;
                        if (saveFunc !== undefined ) {
                            saveFunc( val );
                        }
                    };

                    if ( this[ this.DEFINED ] !== true ) {
                        returning[ this.DEFINED ] = this[ this.DEFINED ];
                    }

                //
                }

                return  returning

            };
        },
        set : setValue
    }
    );


    return this;

};

PHP.VM.Variable.prototype = new PHP.VM.VariableProto();

PHP.VM.Variable.prototype.NAME = "$Name";

PHP.VM.Variable.prototype.DEFINED = "$Defined";

PHP.VM.Variable.prototype.CAST_INT = "$Int";

PHP.VM.Variable.prototype.CAST_DOUBLE = "$Double";

PHP.VM.Variable.prototype.CAST_BOOL = "$Bool";

PHP.VM.Variable.prototype.CAST_STRING = "$String";

PHP.VM.Variable.prototype.NULL = 0;
PHP.VM.Variable.prototype.BOOL = 1;
PHP.VM.Variable.prototype.INT = 2;
PHP.VM.Variable.prototype.FLOAT = 3;
PHP.VM.Variable.prototype.STRING = 4;
PHP.VM.Variable.prototype.ARRAY = 5;
PHP.VM.Variable.prototype.OBJECT = 6;
PHP.VM.Variable.prototype.RESOURCE = 7;
PHP.VM.Variable.prototype.LAMBDA = 8;

// variable types
PHP.VM.Variable.prototype.FUNCTION = 0;

PHP.VM.Variable.prototype.NEW_VARIABLE = 1;

PHP.VM.Variable.prototype.OVERLOADING = "$Overloading";

PHP.VM.Variable.prototype.OVERLOADED = "$Overloaded";

PHP.VM.Variable.prototype.TYPE = "type";

PHP.VM.Variable.prototype.VARIABLE_TYPE = "vtype";

PHP.VM.Variable.prototype.PROPERTY = "$Property";

PHP.VM.Variable.prototype.CONSTANT = "$Constant";

PHP.VM.Variable.prototype.CLASS_CONSTANT = "$ClassConstant";

PHP.VM.Variable.prototype.REF = "$Ref";

PHP.VM.Variable.prototype.IS_REF = "$IsRef";

PHP.VM.Variable.prototype.REFERRING = "$Referring";

PHP.VM.Variable.prototype.REGISTER_SETTER = "$Setter";

PHP.VM.Variable.prototype.REGISTER_ARRAY_SETTER = "$ASetter";

PHP.VM.Variable.prototype.REGISTER_GETTER = "$Getter";

PHP.VM.Variable.prototype.INSTANCE = "$Instance";