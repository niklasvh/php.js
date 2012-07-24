/* 
 * @author Niklas von Hertzen <niklas at hertzen.com>
 * @created 27.6.2012 
 * @website http://hertzen.com
 */

PHP.VM.Array = function( ENV ) {
   
    var COMPILER = PHP.Compiler.prototype,
    VARIABLE = PHP.VM.Variable.prototype,
    ARRAY = PHP.VM.Array.prototype,
    CLASS = PHP.VM.Class,
    $this = this;
    
    ENV.$Class.New( "ArrayObject", 0, {}, function( M ) {
    
        // internal storage for keys/values
        M[ COMPILER.CLASS_PROPERTY ]( $this.KEYS, PHP.VM.Class.PRIVATE, [] )
        [ COMPILER.CLASS_PROPERTY ]( $this.VALUES, PHP.VM.Class.PRIVATE, [] )
    
        // internal key of largest previously used (int) key
        [ COMPILER.CLASS_PROPERTY ]( $this.INTKEY, PHP.VM.Class.PRIVATE, -1 )
    
    
        // internal pointer
        [ COMPILER.CLASS_PROPERTY ]( $this.POINTER, PHP.VM.Class.PRIVATE, 0 )
    
        /*
         * __construct method
         */ 
        [ COMPILER.CLASS_METHOD ]( "__construct", PHP.VM.Class.PUBLIC, [{
            "name":"input"
        }], false, function( $ ) {
            this[ COMPILER.CLASS_NAME ] = $this.CLASS_NAME;
                  
            var items = $('input')[ COMPILER.VARIABLE_VALUE ];
            
            
            if ( Array.isArray( items ) ) {
       
                items.forEach( function( item ) {
                 
                    // this.$Prop( this, $this.VALUES ).$.push( item[ COMPILER.ARRAY_VALUE ] );
                    if (item[ COMPILER.ARRAY_VALUE ][ VARIABLE.CLASS_CONSTANT ] !== true && item[ COMPILER.ARRAY_VALUE ][ VARIABLE.CONSTANT ] !== true) {
                        this.$Prop( this, $this.VALUES )[ COMPILER.VARIABLE_VALUE ].push( new PHP.VM.Variable( item[ COMPILER.ARRAY_VALUE ][ COMPILER.VARIABLE_VALUE ] ) );
                    } else {
                        this.$Prop( this, $this.VALUES )[ COMPILER.VARIABLE_VALUE ].push( item[ COMPILER.ARRAY_VALUE ] );
                    }
                    
                
                    if ( item[ COMPILER.ARRAY_KEY ] !== undefined ) {
                        if ( !item[ COMPILER.ARRAY_KEY ] instanceof PHP.VM.Variable || (item[ COMPILER.ARRAY_KEY ][ VARIABLE.CLASS_CONSTANT ] !== true && item[ COMPILER.ARRAY_KEY ][ VARIABLE.CONSTANT ] !== true )) {
                            var key = ( item[ COMPILER.ARRAY_KEY ] instanceof PHP.VM.Variable ) ? item[ COMPILER.ARRAY_KEY ][ COMPILER.VARIABLE_VALUE ] : item[ COMPILER.ARRAY_KEY ];
                            if ( key === true || key === false ) {
                                key = ( key === true ) ? 1 : 0;
                            }
                            if ( /^\d+$/.test( key )) {
                                // integer key
                        
                                this.$Prop( this, $this.KEYS )[ COMPILER.VARIABLE_VALUE ].push( key );
                        
                                // todo complete
                                this.$Prop( this, $this.INTKEY )[ COMPILER.VARIABLE_VALUE ] = Math.max( this.$Prop( this, $this.INTKEY )[ COMPILER.VARIABLE_VALUE ], key );
                            } else {
                                // custom text key
                                this.$Prop( this, $this.KEYS )[ COMPILER.VARIABLE_VALUE ].push( key );
                            }
                        } else {
                            // class constant as key
                                                         
                            this.$Prop( this, $this.KEYS )[ COMPILER.VARIABLE_VALUE ].push( item[ COMPILER.ARRAY_KEY ] );
                      
                        }
                    } else {
                        this.$Prop( this, $this.KEYS )[ COMPILER.VARIABLE_VALUE ].push( ++this.$Prop( this, $this.INTKEY )[ COMPILER.VARIABLE_VALUE ] );
                    }
                
                

                }, this);
            }
    
       
        
        } )
        /*
         * append
         */
        [ COMPILER.CLASS_METHOD ]( "append", PHP.VM.Class.PUBLIC, [{
            "name":"value"
        }], false, function( $ ) {


            var append = function( item ) {
      
                if (item[ VARIABLE.CLASS_CONSTANT ] !== true && item[ VARIABLE.CONSTANT ] !== true) {
                    this.$Prop( this, $this.VALUES )[ COMPILER.VARIABLE_VALUE ].push( new PHP.VM.Variable( item[ COMPILER.VARIABLE_VALUE ] ) );
                } else {
                    this.$Prop( this, $this.VALUES )[ COMPILER.VARIABLE_VALUE ].push( item[ COMPILER.ARRAY_VALUE ] );
                }
            
           
                this.$Prop( this, $this.KEYS )[ COMPILER.VARIABLE_VALUE ].push( ++this.$Prop( this, $this.INTKEY )[ COMPILER.VARIABLE_VALUE ] );
            
            }.bind( this );
            
            var value = $("value");
            
            if ( value[ VARIABLE.TYPE ] === VARIABLE.STRING ) {
                append( $("value") );
            }
        

            
        
        })
        
        /*
         * Custom $clone method, shouldn't be triggerable by php manually
         */
        [ COMPILER.CLASS_METHOD ]( COMPILER.ARRAY_CLONE, PHP.VM.Class.PUBLIC, [{
            "name":"index"
        }], false, function( $ ) {
            var newArr = new (ENV.$Class.Get("ArrayObject"))( ENV );
        

            // copy keys, can do direct copy ( probably? ) 
            var keys = newArr[ PHP.VM.Class.PROPERTY + PHP.VM.Array.prototype.KEYS ][ COMPILER.VARIABLE_VALUE ];
            this[ PHP.VM.Class.PROPERTY + PHP.VM.Array.prototype.KEYS ][ COMPILER.VARIABLE_VALUE ].forEach( function( key ){
                keys.push( key );
            });
            
            // copy values, need to do deep clone
            var values = newArr[ PHP.VM.Class.PROPERTY + PHP.VM.Array.prototype.VALUES ][ COMPILER.VARIABLE_VALUE ];
            this[ PHP.VM.Class.PROPERTY + PHP.VM.Array.prototype.VALUES ][ COMPILER.VARIABLE_VALUE ].forEach( function( valueObj ) {
                
                values.push( valueObj[ COMPILER.VARIABLE_CLONE ]() );
                
            });
        
            // reset pointers
            this [ PHP.VM.Class.PROPERTY +  PHP.VM.Array.prototype.POINTER ][ COMPILER.VARIABLE_VALUE ] = 0;
            
            // copy key index
            newArr[ PHP.VM.Class.PROPERTY + PHP.VM.Array.prototype.INTKEY][ COMPILER.VARIABLE_VALUE ] = this[ PHP.VM.Class.PROPERTY + PHP.VM.Array.prototype.INTKEY][ COMPILER.VARIABLE_VALUE ];
            return newArr;
            
        
        })
        
        /*
         * offsetUnset method
         */ 
        [ COMPILER.CLASS_METHOD ]( "offsetUnset", PHP.VM.Class.PUBLIC, [{
            "name":"index"
        }], false, function( $ ) {
        
            var value = $('index')[ COMPILER.VARIABLE_VALUE ];
            var keys = this.$Prop( this, $this.KEYS )[ COMPILER.VARIABLE_VALUE ],
            removeIndex = keys.indexOf( value );
            
            if ( removeIndex !== -1 ) {
                keys.splice( removeIndex, 1);
                this.$Prop( this, $this.VALUES )[ COMPILER.VARIABLE_VALUE ].splice( removeIndex, 1);
            }
            
            if (removeIndex <= this [ CLASS.PROPERTY + ARRAY.POINTER ][ COMPILER.VARIABLE_VALUE ]) {
                this [ CLASS.PROPERTY +  ARRAY.POINTER ][ COMPILER.VARIABLE_VALUE ]--;
            }
          

            
            
        })
        // remap keys
        [ COMPILER.CLASS_METHOD ]( "remap", PHP.VM.Class.PRIVATE, [], false, function( $ ) {
                     
            this[ CLASS.PROPERTY + ARRAY.KEYS ][ COMPILER.VARIABLE_VALUE ].forEach(function( key, index ){
                // todo take into account other type of keys
                if ( typeof key === "number" && key % 1 === 0) {
                  
                    this[ CLASS.PROPERTY + ARRAY.KEYS ][ COMPILER.VARIABLE_VALUE ][ index ]--;
                }
            }, this);
            
        })
        
        /*
         * offsetGet method
         */ 
        [ COMPILER.CLASS_METHOD ]( COMPILER.ARRAY_GET, PHP.VM.Class.PUBLIC, [{
            "name":"index"
        }], false, function( $ ) {
         
            var index = -1,
            value = $('index')[ COMPILER.VARIABLE_VALUE ];
            
            this.$Prop( this, $this.KEYS )[ COMPILER.VARIABLE_VALUE ].some(function( item, i ){
                
                if ( item instanceof PHP.VM.Variable ) {
                    item = item[ COMPILER.VARIABLE_VALUE ];
                } 
                
          
                
                if ( item === value) {
                    index = i;
                    return true;
                }
                
                return false;
            });

            if ( index !== -1 ) {
                var item = this.$Prop( this, $this.VALUES )[ COMPILER.VARIABLE_VALUE ][ index ];
                if (this[ VARIABLE.REGISTER_ARRAY_SETTER ] !== undefined) {
                    var func = this[ VARIABLE.REGISTER_ARRAY_SETTER ];
                    item[ VARIABLE.REGISTER_SETTER ] = function( val ) {
                        return func( val );
                    };
                }
                return item;
            } else {
                // no such key found in array, let's create one
                //    
             
                var variable = new PHP.VM.Variable();
               
                variable[ VARIABLE.REGISTER_SETTER ] = function() {
                    // the value was actually defined, let's register item into array
            
                    var key = ++this.$Prop( this, $this.INTKEY )[ COMPILER.VARIABLE_VALUE ];
                    
                    this.$Prop( this, $this.KEYS )[ COMPILER.VARIABLE_VALUE ].push( ($('index')[ COMPILER.VARIABLE_VALUE ] !== null) ? $('index')[ COMPILER.VARIABLE_VALUE ] : key );
                    this.$Prop( this, $this.VALUES )[ COMPILER.VARIABLE_VALUE ].push( variable );
                    delete variable[ VARIABLE.REGISTER_SETTER ];
                }.bind(this);
                variable[ VARIABLE.DEFINED  ] = false;
                return variable;
            
            }

        
        } )
    
        .Create();
    
    });

    /*
 Convert JavaScript array/object into a PHP array 
     */

    PHP.VM.Array.arrayItem = function( key, value ) {
        var obj = {};
        
        obj[ COMPILER.ARRAY_KEY ] = ( key instanceof PHP.VM.Variable ) ? key : new PHP.VM.Variable( key );
        obj[ COMPILER.ARRAY_VALUE ] = ( value instanceof PHP.VM.Variable ) ? value : new PHP.VM.Variable( value );
        return obj;
    };


    PHP.VM.Array.fromObject = function( items, depth ) {
        var COMPILER = PHP.Compiler.prototype,
        arr = [],
        obj,
        depth = (depth === undefined) ? 0 : depth,
   
        addItem = function( value, key ) {
            obj = {};
            
            obj[ PHP.Compiler.prototype.ARRAY_KEY ] = ( /^\d+$/.test( key )) ? key - 0 : key; // use int for int
        
            if ( value instanceof PHP.VM.Variable ) {
                obj[ PHP.Compiler.prototype.ARRAY_VALUE ] = value;
            } else if ( typeof value === "object" && value !== null ) {
                if ( depth >= this.$ini.max_input_nesting_level ) {
                    throw Error;
                } else {
                    obj[ PHP.Compiler.prototype.ARRAY_VALUE ] = PHP.VM.Array.fromObject.call( this, value, depth + 1 );
                }
            } else {
                obj[ PHP.Compiler.prototype.ARRAY_VALUE ] = new PHP.VM.Variable( value );
            }
            arr.push( obj );
        
        }.bind(this);
     
     
        var $this = this;
        if (Array.isArray( items ) ) {
            items.forEach( addItem );
        } else {
            Object.keys( items ).forEach( function( key ) {
                try {
                    addItem( items[ key ], key );   
                } catch( e ) {
                    // error all the way down the array
                    if ( depth !== 0 ) {
                        throw Error;
                    } else if( $this.$ini.track_errors == 1 ) {
                        $this[ COMPILER.GLOBAL ]("php_errormsg")[ COMPILER.VARIABLE_VALUE ] = "Unknown: Input variable nesting level exceeded " + $this.$ini.max_input_nesting_level + ". To increase the limit change max_input_nesting_level in php.ini.";
                    }
                
                    
                }
            }), this;
        }
    
   
        var arr = this.array( arr );
      

        return arr;


    };
};

PHP.VM.Array.prototype.KEYS = "keys";
PHP.VM.Array.prototype.VALUES = "values";

PHP.VM.Array.prototype.INTKEY = "intkey";

PHP.VM.Array.prototype.POINTER = "pointer";

PHP.VM.Array.prototype.CLASS_NAME = "array";