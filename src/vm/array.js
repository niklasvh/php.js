/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 27.6.2012 
* @website http://hertzen.com
 */

PHP.VM.Array = function( ENV ) {
   
    var COMPILER = PHP.Compiler.prototype,
    $this = this;
    
    ENV.$Class.New( "ArrayObject", 0, {})
    
    // internal storage for keys/values
    [ COMPILER.CLASS_PROPERTY ]( $this.KEYS, PHP.VM.Class.PRIVATE, [] )
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
        
        var items = $('input').$;
        if ( Array.isArray( items ) ) {
           
            items.forEach( function( item ) {
               
               // this.$Prop( this, $this.VALUES ).$.push( item[ COMPILER.ARRAY_VALUE ] );
                this.$Prop( this, $this.VALUES ).$.push( new PHP.VM.Variable( item[ COMPILER.ARRAY_VALUE ][ COMPILER.VARIABLE_VALUE ] ) );
               
                if ( item[ COMPILER.ARRAY_KEY ] !== undefined ) {
                    
                    if ( /^\d+$/.test(item[ COMPILER.ARRAY_KEY ] )) {
                        // integer key
                        
                        this.$Prop( this, $this.KEYS ).$.push( item[ COMPILER.ARRAY_KEY ] );
                        
                        // todo complete
                        this.$Prop( this, $this.INTKEY ).$ = Math.max( this.$Prop( this, $this.INTKEY ).$, item[ COMPILER.ARRAY_KEY ] );
                    } else {
                        // custom text key
                        this.$Prop( this, $this.KEYS ).$.push( item[ COMPILER.ARRAY_KEY ] );
                    }
                } else {
                    this.$Prop( this, $this.KEYS ).$.push( ++this.$Prop( this, $this.INTKEY ).$ );
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
         
        var index = this.$Prop( this, $this.KEYS ).$.indexOf( $('index').$ );
        
        if ( index !== -1 ) {
            return this.$Prop( this, $this.VALUES ).$[ index ];
        }

        
    } )
    .Method( "__call", 4, [{
        "name":"m"
    },{
        "name":"a"
    }], function() {
        ENV.echo( $$("Method $m called:\n") );
        (ENV.var_dump($("a").$));
        return this.$Prop( this, "x" );

    } )
    .Create();
    
};

/*
 Convert JavaScript array/object into a PHP array 
 */


PHP.VM.Array.fromObject = function( items ) {

    var arr = [],
    obj,
   
    addItem = function( value, key ) {
        obj = {};
        obj[ PHP.Compiler.prototype.ARRAY_KEY ] = key;
        
        if ( typeof value === "object" && value !== null ) {
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

PHP.VM.Array.prototype.KEYS = "keys";
PHP.VM.Array.prototype.VALUES = "values";

PHP.VM.Array.prototype.INTKEY = "intkey";

PHP.VM.Array.prototype.POINTER = "pointer";

PHP.VM.Array.prototype.CLASS_NAME = "array";