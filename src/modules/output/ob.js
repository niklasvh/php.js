/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 10.7.2012 
* @website http://hertzen.com
 */

(function( MODULES ) {
    
    var DEFAULT = "default output handler",
    COMPILER = PHP.Compiler.prototype,
    OUTPUT_BUFFERS = COMPILER.OUTPUT_BUFFERS,
    CONSTANTS = PHP.Constants,
    flags = [],
    types = [],
    handlers = [];
    
    function pop() {
        handlers.pop();
        flags.pop();
        types.pop();
    }
    
    MODULES.$ob = function() {
        flags = [];
        types = [];
        handlers = [];
    };
    
    MODULES.ob_start = function( output_callback, chunk_size, erase ) {
        
        var handler = DEFAULT, type;
        
        if ( output_callback !== undefined ) {
            handler = output_callback[ COMPILER.VARIABLE_VALUE ];
            type = CONSTANTS.PHP_OUTPUT_HANDLER_START;
        } else {
            type = CONSTANTS.PHP_OUTPUT_HANDLER_WRITE;
        }
        
        this[ OUTPUT_BUFFERS ].push("");
        types.push( type )
        flags.push( CONSTANTS.PHP_OUTPUT_HANDLER_STDFLAGS | type );
        handlers.push( handler );
        
        return new PHP.VM.Variable( true );
    };
    
    MODULES.ob_end_clean = function() {
        this[ OUTPUT_BUFFERS ].pop();
        pop();
        return new PHP.VM.Variable();
    };


    MODULES.ob_end_flush = function() {
        var flush = this[ OUTPUT_BUFFERS ].pop();
        pop();
        this[ OUTPUT_BUFFERS ][ this[ OUTPUT_BUFFERS ].length - 1 ] += flush;
        return new PHP.VM.Variable();
    };

    MODULES.ob_get_flush = function() {
        var flush = this[ OUTPUT_BUFFERS ].pop();
        pop();
        this[ OUTPUT_BUFFERS ][ this[ OUTPUT_BUFFERS ].length - 1 ] += flush;
        return new PHP.VM.Variable( flush );
    };


    MODULES.ob_get_clean = function() {
        pop();
        return new PHP.VM.Variable( this[ OUTPUT_BUFFERS ].pop() );
    };

    MODULES.ob_list_handlers = function() {
        return PHP.VM.Array.fromObject.call( this, handlers );
    };
    
    MODULES.ob_get_status = function( full_status ) {

        var item = PHP.VM.Array.arrayItem,
       
        get_status = function( index ) { 
            return [ 
            item("name", handlers[ index ]), 
            item("type", types[ index ]), 
            item("flags", flags[ index ]),
            item("level", index), 
            item("chunk_size", 0),
            item("buffer_size", 16384),
            item("buffer_used", this[ OUTPUT_BUFFERS ][ index + 1 ].length )
               
            ];
          
        }.bind(this);
       
       
                  
        if (this[ OUTPUT_BUFFERS ].length === 1 ) {
            return this.array([]);
        }
        
        if ( full_status !== undefined && full_status[COMPILER.VARIABLE_VALUE] === true ) {
            var arr = [];
            handlers.forEach(function( handler, index ){
                arr.push( item( index, this.array( get_status( index) ) ) )
            }, this);
            return this.array( arr );
        } else{
            return this.array( get_status( handlers.length - 1 ) );
        }
        
        
       
    };
    
    
    
})( PHP.Modules.prototype );
