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
    [ COMPILER.CLASS_PROPERTY ]( $this.INTKEY, PHP.VM.Class.PRIVATE, 0 )
    
    /*
     * __construct method
     */ 
    [ COMPILER.CLASS_METHOD ]( "__construct", PHP.VM.Class.PUBLIC, [{
        "name":"input"
    }], function( $ ) {
    
        var items = $('input').$;
        if ( Array.isArray( items ) ) {
            

            items.forEach( function( item ) {
                
                this.$Prop( this, $this.VALUES ).$.push( item[ COMPILER.ARRAY_VALUE ] );
                
                if ( item[ COMPILER.ARRAY_KEY ] !== undefined ) {
                    if ( /^\d+$/.test(item[ COMPILER.ARRAY_KEY ] )) {
                        // integer key
                        
                        
                        // todo complete
                        this.$Prop( this, $this.INTKEY )
                    } else {
                        // custom text key
                        this.$Prop( this, $this.KEYS ).$.push( item[ COMPILER.ARRAY_KEY ] );
                    }
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

PHP.VM.Array.fromObject = function( obj ) {


};

PHP.VM.Array.prototype.KEYS = "keys";
PHP.VM.Array.prototype.VALUES = "values";

PHP.VM.Array.prototype.INTKEY = "intkey";