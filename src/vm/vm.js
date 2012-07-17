
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
    
    ENV.$ini = opts.ini;
    
    ENV.$locale = {
        decimal_point: ".",
        thousands_sep: ","
    };
    
    ENV.$Included = (function(){
        
        var files = [];
        
        return {
            Include: function( file ) {
                files.push( file.toLowerCase() );
            },
            Included: function( file ) {
                return (files.indexOf( file.toLowerCase() ) !== -1) 
            } 
        }
        
    })();
    
    ENV.$Class = (function( declaredClasses ) {
        var classRegistry = {},
        COMPILER = PHP.Compiler.prototype,
        VARIABLE = PHP.VM.Variable.prototype,
        magicConstants = {},
        initiatedClasses = [],
        undefinedConstants = {},
        declaredClasses = [],
        autoloadedClasses = [],
        classHandler = new PHP.VM.Class( ENV, classRegistry, magicConstants, initiatedClasses, undefinedConstants, declaredClasses );
        
        ENV[ COMPILER.MAGIC_CONSTANTS ] = function( constantName ) {
            return new PHP.VM.Variable( magicConstants[ constantName ] );
        };
        
        var methods =  {
            Shutdown: function() {
                
                initiatedClasses.forEach( function( classObj ) {
                    classObj[  COMPILER.CLASS_DESTRUCT ]( ENV, true );
                });
                
            },
            __autoload: function( name ) {
                
                if ( typeof ENV.__autoload === "function" && autoloadedClasses.indexOf( name.toLowerCase() ) === -1) {
                    autoloadedClasses.push( name.toLowerCase() )
                    ENV.__autoload( new PHP.VM.Variable( name ) );
                }
                
                return methods.Exists( name );
            },
            Inherits: function(  obj, name ) {       
                do {
                    if ( obj[ COMPILER.CLASS_NAME ] === name) {
                        return true;
                    }

                    obj = Object.getPrototypeOf( obj );
                }
        
                while( obj !== undefined && obj instanceof PHP.VM.ClassPrototype );
                return false; 
            },
            INew: function( name, exts, func ) {
                return classHandler( name, PHP.VM.Class.INTERFACE, exts, func );
            },
            DeclaredClasses: function() {
                return declaredClasses;
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
    var variables_order = this.$ini.variables_order;
    
       
    
        
    ENV[ PHP.Compiler.prototype.FILE_PATH ] = PHP.Utils.Path( opts.SERVER.SCRIPT_FILENAME );
     
    this.OUTPUT_BUFFERS = [""];
    this.$obreset();
    this.$ErrorReset();
    this.$strict = "";
    this.INPUT_BUFFER = opts.RAW_POST;
    
    $('$__FILE__').$ = opts.SERVER.SCRIPT_FILENAME;
    
    var post_max_size;
    
    if (  (post_max_size = PHP.Utils.Filesize(this.$ini.post_max_size)) > opts.RAW_POST.length || post_max_size == 0 ) {
        if (this.$ini.enable_post_data_reading != 0) {
            $('_POST').$ = PHP.VM.Array.fromObject.call( this, ( variables_order.indexOf("P") !== -1 ) ? opts.POST : {} ).$;
            $('HTTP_RAW_POST_DATA').$ = opts.RAW_POST; 
        } else {
            $('_POST').$ = PHP.VM.Array.fromObject.call( this, {} ).$;
        }
    } else {
        $('_POST').$ = PHP.VM.Array.fromObject.call( this, {} ).$;
        if (this.$ini.always_populate_raw_post_data == 1 ) {
            ENV[ PHP.Compiler.prototype.ERROR ]( "Unknown: POST Content-Length of " + opts.RAW_POST.length + " bytes exceeds the limit of " + post_max_size + " bytes in Unknown on line 0", PHP.Constants.E_WARNING ); 
            ENV[ PHP.Compiler.prototype.ERROR ]( "Cannot modify header information - headers already sent in Unknown on line 0", PHP.Constants.E_WARNING ); 
        } else {
            ENV[ PHP.Compiler.prototype.ERROR ]( "POST Content-Length of " + opts.RAW_POST.length + " bytes exceeds the limit of " + post_max_size + " bytes in Unknown on line 0", PHP.Constants.E_WARNING ); 
        }
    }
    
    $('_GET').$ = PHP.VM.Array.fromObject.call( this, ( variables_order.indexOf("G") !== -1 ) ? opts.GET : {} ).$;


    $('_SERVER').$ = PHP.VM.Array.fromObject.call( this, ( variables_order.indexOf("S") !== -1 ) ? opts.SERVER : {} ).$;
    $('_FILES').$ = PHP.VM.Array.fromObject.call( this, ( variables_order.indexOf("P") !== -1 && this.$ini.enable_post_data_reading != 0 && this.$ini.file_uploads == 1 ) ? opts.FILES : {} ).$;
    
    $('_ENV').$ = PHP.VM.Array.fromObject.call( this, ( variables_order.indexOf("E") !== -1 ) ? {} : {} ).$;
    


    
    Object.keys( PHP.VM.Class.Predefined ).forEach(function( className ){
        PHP.VM.Class.Predefined[ className ]( ENV, $$ );
    });
    
    
    if ( false ) {
    
  
        var exec = new Function( "$$", "$", "ENV", src  );
        exec.call(this, $$, $, ENV);
    
     
    } else {
        try {
            var exec = new Function( "$$", "$", "ENV",  src  );
            exec.call(this, $$, $, ENV);
            this.$obflush.call( ENV );  
            this.$shutdown.call( ENV );
          
        } catch( e ) {
        
            console.log("Caught: ", e.message, e);
            console.log("Buffer: ", this.$strict + this.OUTPUT_BUFFERS.join(""));
        
        }
    }

    this.OUTPUT_BUFFER = this.$strict + this.OUTPUT_BUFFERS.join("");
};

PHP.VM.prototype = new PHP.Modules();

