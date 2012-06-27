
PHP.VM = function( src, opts ) {
    
    var $ = PHP.VM.VariableHandler();
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
    
    ENV.$Array = new PHP.VM.Array( ENV );
    
    var $_POST = [],
    obj = {};
    
    obj[ PHP.Compiler.prototype.ARRAY_KEY ] = "a";
    obj[ PHP.Compiler.prototype.ARRAY_VALUE ] = $$("working!");
    
    $_POST.push( obj )
    
    $('_POST').$ = ENV.array( $_POST ).$;
    $('_SERVER').$ = ENV.array().$;
    
    var exec = new Function( "$$", "$", "ENV", src  );
    exec.call(this, $$, $, ENV);
    
};

PHP.VM.prototype = new PHP.Modules();

