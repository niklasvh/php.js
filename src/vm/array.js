/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 27.6.2012 
* @website http://hertzen.com
 */

PHP.VM.Array = function( ENV ) {
   
    var COMPILER = PHP.Compiler.prototype,
    VARIABLE = PHP.VM.Variable.prototype,
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
        }], function( $ ) {
            this[ COMPILER.CLASS_NAME ] = $this.CLASS_NAME;
        
            var items = $('input')[ COMPILER.VARIABLE_VALUE ];
            if ( Array.isArray( items ) ) {
           
                items.forEach( function( item ) {
               
                    // this.$Prop( this, $this.VALUES ).$.push( item[ COMPILER.ARRAY_VALUE ] );
                    if (item[ COMPILER.ARRAY_VALUE ][ VARIABLE.CLASS_CONSTANT ] !== true && item[ COMPILER.ARRAY_VALUE ][ VARIABLE.CONSTANT ] !== true) {
                        this.$Prop( this, $this.VALUES )[ COMPILER.VARIABLE_VALUE ].push( new PHP.VM.Variable( item[ COMPILER.ARRAY_VALUE ][ COMPILER.VARIABLE_VALUE ] ) );
                    } else {
                        console.log(item[ COMPILER.ARRAY_VALUE ]);
                        this.$Prop( this, $this.VALUES )[ COMPILER.VARIABLE_VALUE ].push( item[ COMPILER.ARRAY_VALUE ] );
                    }
                    
                
                    if ( item[ COMPILER.ARRAY_KEY ] !== undefined ) {
                        if ( !item[ COMPILER.ARRAY_KEY ] instanceof PHP.VM.Variable || (item[ COMPILER.ARRAY_KEY ][ VARIABLE.CLASS_CONSTANT ] !== true && item[ COMPILER.ARRAY_KEY ][ VARIABLE.CONSTANT ] !== true )) {
                            var key = ( item[ COMPILER.ARRAY_KEY ] instanceof PHP.VM.Variable ) ? item[ COMPILER.ARRAY_KEY ][ COMPILER.VARIABLE_VALUE ] : item[ COMPILER.ARRAY_KEY ];
                   
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
     * offsetGet method
     */ 
        [ COMPILER.CLASS_METHOD ]( COMPILER.ARRAY_GET, PHP.VM.Class.PUBLIC, [{
            "name":"index"
        }], function( $ ) {
         
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
                return this.$Prop( this, $this.VALUES )[ COMPILER.VARIABLE_VALUE ][ index ];
            } else {
                // no such key found in array, let's create one
                //    
                var variable = new PHP.VM.Variable();
                //    
                variable[ VARIABLE.DEFINED  ] = false;
                variable[ VARIABLE.REGISTER_SETTER ] = function() {
                    // the value was actually defined, let's register item into array
                    this.$Prop( this, $this.KEYS )[ COMPILER.VARIABLE_VALUE ].push( ($('index')[ COMPILER.VARIABLE_VALUE ] !== null) ? $('index')[ COMPILER.VARIABLE_VALUE ] : ++this.$Prop( this, $this.INTKEY )[ COMPILER.VARIABLE_VALUE ] );
                    this.$Prop( this, $this.VALUES )[ COMPILER.VARIABLE_VALUE ].push( variable );
                    delete variable[ VARIABLE.REGISTER_SETTER ];
                }.bind(this);
            
                return variable;
            
            }

        
        } )
    
        .Create();
    
    });

    /*
 Convert JavaScript array/object into a PHP array 
 */


    PHP.VM.Array.fromObject = function( items ) {

        var arr = [],
        obj,
   
        addItem = function( value, key ) {
            obj = {};
            obj[ PHP.Compiler.prototype.ARRAY_KEY ] = key;
        
            if ( value instanceof PHP.VM.Variable ) {
                obj[ PHP.Compiler.prototype.ARRAY_VALUE ] = value;
            } else if ( typeof value === "object" && value !== null ) {
                obj[ PHP.Compiler.prototype.ARRAY_VALUE ] = PHP.VM.Array.fromObject.call( this, value );
            } else {
                obj[ PHP.Compiler.prototype.ARRAY_VALUE ] = new PHP.VM.Variable( value );
            }
            arr.push( obj );
        
        }.bind(this);
     
     
     
        if (Array.isArray( items ) ) {
            items.forEach( addItem );
        } else {
            Object.keys( items ).forEach( function( key ) {
                addItem( items[ key ], key );   
            });
        }
    
   
 

    
    

        return this.array( arr );


    };
};

PHP.VM.Array.prototype.KEYS = "keys";
PHP.VM.Array.prototype.VALUES = "values";

PHP.VM.Array.prototype.INTKEY = "intkey";

PHP.VM.Array.prototype.POINTER = "pointer";

PHP.VM.Array.prototype.CLASS_NAME = "array";