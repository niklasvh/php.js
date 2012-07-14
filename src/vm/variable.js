/* 
 * @author Niklas von Hertzen <niklas at hertzen.com>
 * @created 24.6.2012 
 * @website http://hertzen.com
 */

PHP.VM.VariableHandler = function( ENV ) {
    
    var variables = {},
    methods = function( variableName, setTo ) {
        
        if (setTo instanceof PHP.VM.Variable) {
            variables[ variableName ] = setTo;
            return methods;
        }
        
        if ( variables[ variableName ] === undefined ) { 
            
          
            variables[ variableName ] = new PHP.VM.Variable();
            variables[ variableName ][ PHP.VM.Variable.prototype.DEFINED ] = variableName;
            variables[ variableName ].ENV = ENV;
            variables[ variableName ][ PHP.VM.Variable.prototype.NAME ] = variableName;
           
        /*
            Object.defineProperty( variables, variableName, {
                value: new PHP.VM.Variable()
            });
            
           
           
           
            Object.defineProperty( variables, variableName, {
                value: Object.defineProperty( {}, PHP.Compiler.prototype.VARIABLE_VALUE, {
                        set: function( val ) {
                            // we are setting a val to a newly created variable
                           variables[ variableName ] = new PHP.VM.Variable( val );
                        },
                        get: function() {
                            // attempting to retrieve a value of undefined property
                            console.log( variables );
                            console.log( variableName + " not defined");
                        }
                    }
                
                )
            });
             */
            
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

    if ( combinedVariable[ VARIABLE.TYPE ] === VARIABLE.ARRAY ) {
        // Array assignment always involves value copying. Use the reference operator to copy an array by reference.
        console.log(combinedVariable, combinedVariable[ COMPILER.VARIABLE_VALUE ]);
    }
    this[ COMPILER.VARIABLE_VALUE ] = combinedVariable[ COMPILER.VARIABLE_VALUE ];
    
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
    }
    while( className !== undefined );
    return new PHP.VM.Variable( false );
    
};

PHP.VM.VariableProto.prototype[ PHP.Compiler.prototype.CONCAT ] = function( combinedVariable ) {
    
    var COMPILER = PHP.Compiler.prototype,
    VARIABLE = PHP.VM.Variable.prototype;

    return new PHP.VM.Variable( this[ VARIABLE.CAST_STRING ][ COMPILER.VARIABLE_VALUE ] + "" + combinedVariable[ VARIABLE.CAST_STRING ][ COMPILER.VARIABLE_VALUE ] );
};


PHP.VM.VariableProto.prototype[ PHP.Compiler.prototype.ADD ] = function( combinedVariable ) {
    
    var COMPILER = PHP.Compiler.prototype;
    return new PHP.VM.Variable( (this[ COMPILER.VARIABLE_VALUE ] - 0) + ( combinedVariable[ COMPILER.VARIABLE_VALUE ] - 0 ) );
};

PHP.VM.VariableProto.prototype[ PHP.Compiler.prototype.MUL ] = function( combinedVariable ) {
    
    var COMPILER = PHP.Compiler.prototype;
    return new PHP.VM.Variable( (this[ COMPILER.VARIABLE_VALUE ] - 0) * ( combinedVariable[ COMPILER.VARIABLE_VALUE ] - 0 ) );
};

PHP.VM.VariableProto.prototype[ PHP.Compiler.prototype.DIV ] = function( combinedVariable ) {
    
    var COMPILER = PHP.Compiler.prototype;
    return new PHP.VM.Variable( (this[ COMPILER.VARIABLE_VALUE ] - 0) / ( combinedVariable[ COMPILER.VARIABLE_VALUE ] - 0 ) );
};

PHP.VM.VariableProto.prototype[ PHP.Compiler.prototype.MOD ] = function( combinedVariable ) {
    
    var COMPILER = PHP.Compiler.prototype;
    return new PHP.VM.Variable( (this[ COMPILER.VARIABLE_VALUE ]) % ( combinedVariable[ COMPILER.VARIABLE_VALUE ]) );
};

PHP.VM.VariableProto.prototype[ PHP.Compiler.prototype.MINUS ] = function( combinedVariable ) {
    
    var COMPILER = PHP.Compiler.prototype;
    return new PHP.VM.Variable( (this[ COMPILER.VARIABLE_VALUE ] - 0) - ( combinedVariable[ COMPILER.VARIABLE_VALUE ] - 0 ) );
};

PHP.VM.VariableProto.prototype[ PHP.Compiler.prototype.METHOD_CALL ] = function() {
    
    var COMPILER = PHP.Compiler.prototype;
    
    return this[ COMPILER.VARIABLE_VALUE ][ PHP.Compiler.prototype.METHOD_CALL ].apply( this[ COMPILER.VARIABLE_VALUE ], arguments );
};

PHP.VM.VariableProto.prototype[ PHP.Compiler.prototype.BOOLEAN_NOT ] = function() {
    
    var COMPILER = PHP.Compiler.prototype;
    return new PHP.VM.Variable( !(this[ COMPILER.VARIABLE_VALUE ]) );
};

PHP.VM.VariableProto.prototype[ PHP.Compiler.prototype.NOT_IDENTICAL ] = function( compareTo ) {
    
    var COMPILER = PHP.Compiler.prototype;
    return new PHP.VM.Variable( (this[ COMPILER.VARIABLE_VALUE ]) !== ( compareTo[ COMPILER.VARIABLE_VALUE ]) );
};

PHP.VM.VariableProto.prototype[ PHP.Compiler.prototype.EQUAL ] = function( compareTo ) {
    
    var COMPILER = PHP.Compiler.prototype;
    return new PHP.VM.Variable( (this[ COMPILER.VARIABLE_VALUE ]) == ( compareTo[ COMPILER.VARIABLE_VALUE ]) );
};
 
PHP.VM.VariableProto.prototype[ PHP.Compiler.prototype.SMALLER_OR_EQUAL ] = function( compareTo ) {
    
    var COMPILER = PHP.Compiler.prototype;
    return new PHP.VM.Variable( (this[ COMPILER.VARIABLE_VALUE ]) <= ( compareTo[ COMPILER.VARIABLE_VALUE ]) );
}; 

PHP.VM.VariableProto.prototype[ PHP.Compiler.prototype.SMALLER ] = function( compareTo ) {
    
    var COMPILER = PHP.Compiler.prototype;
    return new PHP.VM.Variable( (this[ COMPILER.VARIABLE_VALUE ]) < ( compareTo[ COMPILER.VARIABLE_VALUE ]) );
}; 

PHP.VM.VariableProto.prototype[ PHP.Compiler.prototype.GREATER ] = function( compareTo ) {
    
    var COMPILER = PHP.Compiler.prototype;
    return new PHP.VM.Variable( (this[ COMPILER.VARIABLE_VALUE ]) > ( compareTo[ COMPILER.VARIABLE_VALUE ]) );
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
             
       

        if ( newValue === undefined ) {
            newValue = null;
        }
       
        if ( newValue instanceof PHP.VM.Variable ) {
            newValue = newValue[ COMPILER.VARIABLE_VALUE ];
        }
     
        if ( typeof newValue === "string" ) {
            this[ this.TYPE ] = this.STRING;
        } else if ( typeof newValue === "number" ) {
            if ( newValue % 1 === 0 ) {
                this[ this.TYPE ] = this.INT;
            } else {
                this[ this.TYPE ] = this.FLOAT;
            }
        } else if ( newValue === null ) {   
            if ( this[ this.TYPE ] === this.OBJECT && value instanceof PHP.VM.ClassPrototype ) {
                value[ COMPILER.CLASS_DESTRUCT ]();
            }
            
            this[ this.TYPE ] = this.NULL;

        } else if ( typeof newValue === "boolean" ) {
            this[ this.TYPE ] = this.BOOL;
        } else if ( newValue instanceof PHP.VM.ClassPrototype ) {
            if ( newValue[ COMPILER.CLASS_NAME ] === PHP.VM.Array.prototype.CLASS_NAME ) {
                this[ this.TYPE ] = this.ARRAY;
                
                if ( newValue[ this.DEFINED ] === true ) {
                    // Array assignment always involves value copying. Use the reference operator to copy an array by reference.
                    value = newValue[ COMPILER.METHOD_CALL ]( {}, COMPILER.ARRAY_CLONE  );
                }
                
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
        
        
        if ( typeof this[this.REGISTER_SETTER ] === "function" ) {
            this[ this.REGISTER_SETTER ]( value );
        }
        
    }.bind( this ); // something strange going on with context in node.js?? iterators_2.phpt
    
    
    setValue.call( this, arg );
    
    this[ COMPILER.VARIABLE_CLONE ] = function() {
        switch( this[ this.TYPE ] ) {
            case this.NULL:
            case this.BOOL:
            case this.INT:
            case this.FLOAT:
            case this.STRING:
                return new PHP.VM.Variable( value );               
                break;
            case this.OBJECT:
            case this.RESOURCE:
                return this;
            case this.ARRAY:
                return new PHP.VM.Variable( value[ COMPILER.METHOD_CALL ]( {}, COMPILER.ARRAY_CLONE  ) )
                break;
            default:
                console.log("Unknown variable type cloned");
                return this;
        }
        
    };
    
    this [ this.REF ] = function( variable ) {
        this[ this.REFERRING ] = variable;
        this[ this.DEFINED ] = true;
        
        variable[ this.IS_REF ] = true;
        
        return this;
    };
    
    this[ COMPILER.NEG ] = function() {
        this[ COMPILER.VARIABLE_VALUE ] = -this[ COMPILER.VARIABLE_VALUE ];
        return this;
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
        var tmp = this[ COMPILER.VARIABLE_VALUE ]; // trigger get, incase there is POST_MOD
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
        this.DEFINED = false;
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
                this[ this.REGISTER_GETTER ]();
            }
            
            if ( $this[ this.DEFINED ] !== true && $this[ COMPILER.SUPPRESS ] !== true ) {
                
                if ( $this[ this.CONSTANT ] === true ) {
                    this.ENV[ COMPILER.ERROR ]("Use of undefined constant " + $this[ this.DEFINED ] + " - assumed '" + $this[ this.DEFINED ] + "'", PHP.Constants.E_CORE_NOTICE, true );
                    $this[ this.TYPE ] = this.STRING;
                    
                    returning = $this[ this.DEFINED ];
                    $this[ this.DEFINED ] = true;
                    return returning;
                } else {
                    this.ENV[ COMPILER.ERROR ]("Undefined " + ($this[ this.PROPERTY ] === true ? "property" : "variable") + ": " + $this[ this.DEFINED ], PHP.Constants.E_CORE_NOTICE, true );    
                }
            }
            if ( this[ this.REFERRING ] === undefined ) {
                returning = value;
            } else { 
                this[ this.TYPE ] = $this[ this.TYPE ];
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
            
            if ( this[ this.TYPE ] === this.INT ) {
                if ( value === 0 ) {
                    return new PHP.VM.Variable( false );
                } else {
                    return new PHP.VM.Variable( true );
                }
            } else if ( this[ this.TYPE ] === this.STRING ) {
                if ( value.length === 0 || value === "0") {
                    return new PHP.VM.Variable( false );
                } else {
                    return new PHP.VM.Variable( true );
                }
            } else if ( this[ this.TYPE ] === this.NULL ) {
                return new PHP.VM.Variable( false );
            }
            
            return this;
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
                
                if ( typeof value[PHP.VM.Class.METHOD + __toString ] === "function" ) {
                    return new PHP.VM.Variable( value[PHP.VM.Class.METHOD + __toString ]() );
                }
                     
            } else if (this[ this.TYPE ] === this.BOOL) {
                return new PHP.VM.Variable( ( value ) ? "1" : "0" );
            } else if (this[ this.TYPE ] === this.INT) {
                return new PHP.VM.Variable(  value + "" );
            } else if (this[ this.TYPE ] === this.NULL) {
                return new PHP.VM.Variable( "" );
            }
            return this;
        }
    }
    );
        
    this[ COMPILER.DIM_ISSET ] = function( ctx, variable  ) {
        if ( this[ this.TYPE ] !== this.ARRAY ) {
            if ( this[ this.TYPE ] === this.OBJECT && value[ PHP.VM.Class.INTERFACES ].indexOf("ArrayAccess") !== -1) {
                       
                var exists = value[ COMPILER.METHOD_CALL ]( ctx, "offsetExists", variable )[ COMPILER.VARIABLE_VALUE ]; // trigger offsetExists
                return exists;
      
                        
            } else {
                        
                return false;
            }
        } 
        
        var returning = value[ COMPILER.METHOD_CALL ]( ctx, COMPILER.ARRAY_GET, variable );
                
        return (returning[ this.DEFINED ] === true );

    };
    
    this[ COMPILER.DIM_EMPTY ] = function( ctx, variable  ) {
        
        if ( this[ this.TYPE ] !== this.ARRAY ) {
           
            if ( this[ this.TYPE ] === this.OBJECT && value[ PHP.VM.Class.INTERFACES ].indexOf("ArrayAccess") !== -1) {
                       
                var exists = value[ COMPILER.METHOD_CALL ]( ctx, "offsetExists", variable )[ COMPILER.VARIABLE_VALUE ]; // trigger offsetExists
                
             
                if ( exists === true ) {
                    var val = value[ COMPILER.METHOD_CALL ]( ctx, COMPILER.ARRAY_GET, variable ); // trigger offsetGet
                    var tmp = val[ COMPILER.VARIABLE_VALUE ]; 
                } else {
                    return true;
                }
           
                 
                return (val[ this.TYPE ] === this.NULL);
                                        
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
                
                if ( this[ this.REFERRING ] !== undefined ) {
                    $this = this[this.REFERRING];
                }
                

               
                
                if ( this[ this.TYPE ] !== this.ARRAY ) {
                    if ( this[ this.TYPE ] === this.OBJECT && value[ PHP.VM.Class.INTERFACES ].indexOf("ArrayAccess") !== -1) {
                       
                        //      var exists = value[ COMPILER.METHOD_CALL ]( ctx, "offsetExists", variable )[ COMPILER.VARIABLE_VALUE ]; // trigger offsetExists
          
                        return  value[ COMPILER.METHOD_CALL ]( ctx, COMPILER.ARRAY_GET, variable );
                      
                        
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
  
                //  console.log(value[ COMPILER.METHOD_CALL ]( ctx, COMPILER.ARRAY_GET, variable ));
               
                
                var returning = value[ COMPILER.METHOD_CALL ]( ctx, COMPILER.ARRAY_GET, variable );
                
                if (returning[ this.DEFINED ] !== true ) {
                    
                    var saveFunc = returning[ this.REGISTER_SETTER ],
                    arrThis = this;
                    
                    
                    returning[ this.REGISTER_SETTER ] = function( val ) {
                        arrThis[ this.DEFINED ] = true;
                        if (saveFunc !== undefined ) {
                            saveFunc( val );
                        }
                    };
                    returning[ this.DEFINED ] = this[ this.DEFINED ];
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
PHP.VM.Variable.prototype.TYPE = "type";

PHP.VM.Variable.prototype.PROPERTY = "$Property";

PHP.VM.Variable.prototype.CONSTANT = "$Constant";

PHP.VM.Variable.prototype.CLASS_CONSTANT = "$ClassConstant";

PHP.VM.Variable.prototype.REF = "$Ref";

PHP.VM.Variable.prototype.IS_REF = "$IsRef";

PHP.VM.Variable.prototype.REFERRING = "$Referring";

PHP.VM.Variable.prototype.REGISTER_SETTER = "$Setter";

PHP.VM.Variable.prototype.REGISTER_GETTER = "$Getter";
