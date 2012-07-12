
PHP.VM = function( src, opts ) {
    
    var $ = PHP.VM.VariableHandler( this );
    // console.log($('_POST'));
  
    var $$ = function( arg ) {
        
        var item = new PHP.VM.Variable( arg );
        
        item[ PHP.Compiler.prototype.NAV ] = true;
        
        return item;
    },
    ENV = this;
    
    this.ENV = ENV;
    
    PHP.VM.Variable.prototype.ENV = ENV;
    
    ENV [ PHP.Compiler.prototype.FILESYSTEM ] = (opts.filesystem === undefined ) ? {} : opts.filesystem;
    
    // bind global variablehandler to ENV
    ENV[ PHP.Compiler.prototype.GLOBAL ] = $;
 
    ENV[ PHP.Compiler.prototype.CONSTANTS ] = PHP.VM.Constants( PHP.Constants, ENV );
    
 
    ENV.$Class = (function() {
        var classRegistry = {},
        COMPILER = PHP.Compiler.prototype,
        VARIABLE = PHP.VM.Variable.prototype,
        magicConstants = {},
        initiatedClasses = [],
        undefinedConstants = {},
        autoloadedClasses = [],
        classHandler = new PHP.VM.Class( ENV, classRegistry, magicConstants, initiatedClasses, undefinedConstants );
        
        ENV[ COMPILER.MAGIC_CONSTANTS ] = function( constantName ) {
            return new PHP.VM.Variable( magicConstants[ constantName ] );
        };
        
        var methods =  {
            __autoload: function( name ) {
                
                if ( typeof ENV.__autoload === "function" && autoloadedClasses.indexOf( name.toLowerCase() ) === -1) {
                    autoloadedClasses.push( name.toLowerCase() )
                    ENV.__autoload( new PHP.VM.Variable( name ) );
                }
                
                return methods.Exists( name );
            },
            INew: function( name, exts, func ) {
                return classHandler( name, PHP.VM.Class.INTERFACE, exts, func );
            },
            New: function() {
                return classHandler.apply( null, arguments );
            },
            Exists: function( name ) {
                return (classRegistry[ name.toLowerCase() ] !== undefined);  
            },
            ConstantGet: function( className, state, constantName ) {
                
                if ( !/(self|parent)/i.test( className ) && classRegistry[ className.toLowerCase() ] === undefined ) {
                    if ( undefinedConstants[ className + "::" + constantName] === undefined ) {
                        var variable = new PHP.VM.Variable();
                        variable[ VARIABLE.CLASS_CONSTANT ] = true;
                        variable[ VARIABLE.REGISTER_GETTER ] = function() {
                            if (classRegistry[ className.toLowerCase() ] === undefined ) {
                                ENV[ COMPILER.ERROR ]( "Class '" + className + "' not found", PHP.Constants.E_ERROR, true );
                            } 
                        }
                        variable[ VARIABLE.DEFINED ] = className + "::$" + constantName;
                        undefinedConstants[ className + "::" + constantName] = variable;
                    
                    }
                
                    return undefinedConstants[ className + "::" + constantName];
                    
                } else {
                    return methods.Get(  className, state )[ COMPILER.CLASS_CONSTANT_FETCH ]( state, constantName );
                    
                }
                
            },
            Get: function( className, state, isInterface ) {
               
                if ( !/(self|parent)/i.test( className ) ) {
                    
                    if (classRegistry[ className.toLowerCase() ] === undefined && methods.__autoload( className ) === false ) {
                        
                        ENV[ COMPILER.ERROR ]( (( isInterface === true) ? "Interface" :  "Class") + " '" + className + "' not found", PHP.Constants.E_ERROR, true );
                    }
                    
                    if (state !== undefined) {
                        return classRegistry[ className.toLowerCase() ].prototype;
                    } else {
                        return classRegistry[ className.toLowerCase() ];
                    }
                } else if ( /self/i.test( className ) ) {
                    return state.prototype;
                //      return Object.getPrototypeOf( state );  
                } else if ( /parent/i.test( className ) ) {
                    return Object.getPrototypeOf( state.prototype  ); 
                //   return Object.getPrototypeOf( Object.getPrototypeOf( state ) );  
                } else {
                   
            }
                
                
                
            }
        };
        
        return methods;
    })();
    
    ENV[ PHP.Compiler.prototype.RESOURCES ] = PHP.VM.ResourceManager( ENV ); 
    
    ENV.$Array = new PHP.VM.Array( ENV );
    
    $('_POST').$ = PHP.VM.Array.fromObject.call( this, opts.POST ).$;
    $('_GET').$ = PHP.VM.Array.fromObject.call( this, opts.GET ).$;

    $('_SERVER').$ = PHP.VM.Array.fromObject.call( this, opts.SERVER ).$;
    
     
        
    ENV[ PHP.Compiler.prototype.FILE_PATH ] = PHP.Utils.Path( this[ PHP.Compiler.prototype.GLOBAL ]('_SERVER')[ PHP.Compiler.prototype.VARIABLE_VALUE ][ PHP.Compiler.prototype.METHOD_CALL ]( this, PHP.Compiler.prototype.ARRAY_GET, 'SCRIPT_FILENAME' )[ PHP.Compiler.prototype.VARIABLE_VALUE ]);
     
    this.OUTPUT_BUFFERS = [""];
    this.$obreset();
    
    Object.keys( PHP.VM.Class.Predefined ).forEach(function( className ){
        PHP.VM.Class.Predefined[ className ]( ENV, $$ );
    });
    
    
    /*
        var exec = new Function( "$$", "$", "ENV", src  );
        exec.call(this, $$, $, ENV);
    
      */
    try {
        var exec = new Function( "$$", "$", "ENV",  src  );
        exec.call(this, $$, $, ENV);
        this.$obflush.call( ENV );  
        
    } catch( e ) {
        
        console.log("Caught: ", e.message, e);
        console.log("Buffer: ", this.OUTPUT_BUFFERS.join(""));
        
    }
       

    this.OUTPUT_BUFFER = this.OUTPUT_BUFFERS.join("");
};

PHP.VM.prototype = new PHP.Modules();

