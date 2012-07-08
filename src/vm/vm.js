
PHP.VM = function( src, opts ) {
    
    var $ = PHP.VM.VariableHandler( this );
    // console.log($('_POST'));
  
    var $$ = function( arg ) {
        
        
        return new PHP.VM.Variable( arg );
    },
    ENV = this;
    PHP.VM.Variable.prototype.ENV = ENV;
    
    ENV [ PHP.Compiler.prototype.FILESYSTEM ] = opts.filesystem;
    
    // bind global variablehandler to ENV
    ENV[ PHP.Compiler.prototype.GLOBAL ] = $;
 
    ENV[ PHP.Compiler.prototype.CONSTANTS ] = PHP.VM.Constants( PHP.Constants, ENV );
    
    ENV.$Class = (function() {
        var classRegistry = {},
        magicConstants = {},
        initiatedClasses = [],
        classHandler = new PHP.VM.Class( ENV, classRegistry, magicConstants, initiatedClasses );
        
        ENV[ PHP.Compiler.prototype.MAGIC_CONSTANTS ] = function( constantName ) {
            return new PHP.VM.Variable( magicConstants[ constantName ] );
        };
        
        return {
            INew: function( name, exts, func ) {
                return classHandler( name, PHP.VM.Class.INTERFACE, exts, func );
            },
            New: function() {
                return classHandler.apply( null, arguments );
            },
            Get: function( className, state ) {
               
                if ( !/(self|parent)/i.test( className ) ) {
                    if (state !== undefined) {
                        return classRegistry[ className.toLowerCase() ].prototype;
                    } else {
                        return classRegistry[ className.toLowerCase() ];
                    }
                } else if ( /self/i.test( className ) ) {
                    return state.prototype;
              //      return Object.getPrototypeOf( state );  
                } else if ( /parent/i.test( className ) ) {
                    return Object.getPrototypeOf( Object.getPrototypeOf( state ) );  
                }
                
                
                
            }
        }
    })();
    
    ENV[ PHP.Compiler.prototype.RESOURCES ] = PHP.VM.ResourceManager( ENV ); 
    
    ENV.$Array = new PHP.VM.Array( ENV );
    
    $('_POST').$ = PHP.VM.Array.fromObject.call( this, opts.POST ).$;
    $('_GET').$ = PHP.VM.Array.fromObject.call( this, opts.GET ).$;

    $('_SERVER').$ = PHP.VM.Array.fromObject.call( this, opts.SERVER ).$;
    
    
    Object.keys( PHP.VM.Class.Predefined ).forEach(function( className ){
        PHP.VM.Class.Predefined[ className]( ENV );
    });
    /*
    var exec = new Function( "$$", "$", "ENV", src  );
        exec.call(this, $$, $, ENV);

       */
    try {
        var exec = new Function( "$$", "$", "ENV", src  );
        exec.call(this, $$, $, ENV);
    } catch( e ) {
        console.log("Caught: ", e.message, e);
        console.log("Buffer: ", this.OUTPUT_BUFFER);
    }
          

   
};

PHP.VM.prototype = new PHP.Modules();

