
PHP.VM = function( src, opts ) {
    
    var $ = PHP.VM.VariableHandler();
    // console.log($('_POST'));
  
    var $$ = function( arg ) {
        return new PHP.VM.Variable( arg );
    },
    ENV = this;
    

    // bind global variablehandler to ENV
    ENV[ PHP.Compiler.prototype.GLOBAL ] = $;
 
    ENV[ PHP.Compiler.prototype.CONSTANTS ] = PHP.VM.Constants( PHP.Constants );
    
    ENV.$Class = (function() {
        var classRegistry = {},
        magicConstants = {},
        classHandler = new PHP.VM.Class( ENV, classRegistry, magicConstants );
        
        ENV[ PHP.Compiler.prototype.MAGIC_CONSTANTS ] = function( constantName ) {
            return new PHP.VM.Variable( magicConstants[ constantName ] );
        };
        
        return {
            New: function() {
                return classHandler.apply( null, arguments );
            },
            Get: function( className, state ) {
               
                if ( !/(self|parent)/i.test( className ) ) {
                    if (state !== undefined) {
                        return classRegistry[ className ].prototype;
                    } else {
                        return classRegistry[ className ];
                    }
                } else if ( /self/i.test( className ) ) {
                    return Object.getPrototypeOf( state );  
                } else if ( /parent/i.test( className ) ) {
                    return Object.getPrototypeOf( Object.getPrototypeOf( state ) );  
                }
                
                
                
            }
        }
    })();
    
    ENV.$Array = new PHP.VM.Array( ENV );
    
    $('_POST').$ = PHP.VM.Array.fromObject.call( this, opts.POST ).$;
    $('_GET').$ = PHP.VM.Array.fromObject.call( this, opts.GET ).$;

    //$('_POST').$ = ENV.array( $_POST ).$;
    $('_SERVER').$ = PHP.VM.Array.fromObject.call( this, opts.SERVER ).$;
    
    
    Object.keys( PHP.VM.Class.Predefined ).forEach(function( className ){
        PHP.VM.Class.Predefined[ className]( ENV );
    });
    
    var exec = new Function( "$$", "$", "ENV", src  );
    exec.call(this, $$, $, ENV);
    
};

PHP.VM.prototype = new PHP.Modules();

