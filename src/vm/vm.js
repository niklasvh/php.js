
PHP.VM = function( src ) {
    
    var $ = PHP.VM.VariableHandler();
    $('_POST').$ = "a";
    // console.log($('_POST'));
  
    var $$ = function( arg ) {
        return new PHP.VM.Variable( arg );
    },
    ENV = this;
    
    ENV[ PHP.Compiler.prototype.ERROR ] = function( msg, level ) {
        ENV.trigger_error( $$( msg ), $$( level ) );
    };

 
    
    ENV.$Class = (function() {
        var classRegistry = {},
        magicConstants = {},
        classHandler = new PHP.VM.Class( ENV, classRegistry, magicConstants );
        
        ENV.$Constant = function( constantName ) {
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
    
    var exec = new Function( "$$", "$", "ENV", src  );
    exec.call(this, $$, $, ENV);
    
};

PHP.VM.prototype = new PHP.Modules();

