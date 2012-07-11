/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 15.6.2012 
* @website http://hertzen.com
 */


var PHP = function( tokens, opts ) {
    
    //console.log( tokens );
    this.AST = new PHP.Parser( tokens );
  
    //console.log( this.AST );
    //console.log( opts );
    
    this.compiler = new PHP.Compiler( this.AST, opts.SERVER.SCRIPT_FILENAME );
    console.log(this.compiler.src);
    this.vm = new PHP.VM( this.compiler.src, opts );
    

    
};

PHP.Constants = {};

PHP.Modules = function() {
    this.OUTPUT_BUFFER = "";
    

};

PHP.Adapters = {};

PHP.Utils = {};


PHP.Utils.$A = function( arr) {
    return Array.prototype.slice.call( arr ); 
};

PHP.Utils.ClassName = function( classVar ) {
    var COMPILER = PHP.Compiler.prototype,
    VARIABLE = PHP.VM.Variable.prototype;
    if ( classVar instanceof PHP.VM.Variable ) {
        if ( classVar[ VARIABLE.TYPE ] === VARIABLE.STRING ) {
            return classVar[ COMPILER.VARIABLE_VALUE ]
        } else {
            return classVar[ COMPILER.VARIABLE_VALUE ][ COMPILER.CLASS_NAME ];
        } 
    }
    
};

PHP.Utils.Merge = function(obj1, obj2) {
    
    Object.keys( obj2 ).forEach(function( key ){
        obj1[ key ] = obj2 [ key ]; 
    });
    
    return obj1;
};

PHP.Utils.Path = function( path ) {
    
    path = path.substring(0, path.lastIndexOf("/"));
    
    return path;
};

PHP.Utils.TokenName = function( token ) {
    var constants = ["T_INCLUDE","T_INCLUDE_ONCE","T_EVAL","T_REQUIRE","T_REQUIRE_ONCE","T_LOGICAL_OR","T_LOGICAL_XOR","T_LOGICAL_AND","T_PRINT","T_PLUS_EQUAL","T_MINUS_EQUAL","T_MUL_EQUAL","T_DIV_EQUAL","T_CONCAT_EQUAL","T_MOD_EQUAL","T_AND_EQUAL","T_OR_EQUAL","T_XOR_EQUAL","T_SL_EQUAL","T_SR_EQUAL","T_BOOLEAN_OR","T_BOOLEAN_AND","T_IS_EQUAL","T_IS_NOT_EQUAL","T_IS_IDENTICAL","T_IS_NOT_IDENTICAL","T_IS_SMALLER_OR_EQUAL","T_IS_GREATER_OR_EQUAL","T_SL","T_SR","T_INSTANCEOF","T_INC","T_DEC","T_INT_CAST","T_DOUBLE_CAST","T_STRING_CAST","T_ARRAY_CAST","T_OBJECT_CAST","T_BOOL_CAST","T_UNSET_CAST","T_NEW","T_CLONE","T_EXIT","T_IF","T_ELSEIF","T_ELSE","T_ENDIF","T_LNUMBER","T_DNUMBER","T_STRING","T_STRING_VARNAME","T_VARIABLE","T_NUM_STRING","T_INLINE_HTML","T_CHARACTER","T_BAD_CHARACTER","T_ENCAPSED_AND_WHITESPACE","T_CONSTANT_ENCAPSED_STRING","T_ECHO","T_DO","T_WHILE","T_ENDWHILE","T_FOR","T_ENDFOR","T_FOREACH","T_ENDFOREACH","T_DECLARE","T_ENDDECLARE","T_AS","T_SWITCH","T_ENDSWITCH","T_CASE","T_DEFAULT","T_BREAK","T_CONTINUE","T_GOTO","T_FUNCTION","T_CONST","T_RETURN","T_TRY","T_CATCH","T_THROW","T_USE","T_INSTEADOF","T_GLOBAL","T_STATIC","T_ABSTRACT","T_FINAL","T_PRIVATE","T_PROTECTED","T_PUBLIC","T_VAR","T_UNSET","T_ISSET","T_EMPTY","T_HALT_COMPILER","T_CLASS","T_TRAIT","T_INTERFACE","T_EXTENDS","T_IMPLEMENTS","T_OBJECT_OPERATOR","T_DOUBLE_ARROW","T_LIST","T_ARRAY","T_CALLABLE","T_CLASS_C","T_TRAIT_C","T_METHOD_C","T_FUNC_C","T_LINE","T_FILE","T_COMMENT","T_DOC_COMMENT","T_OPEN_TAG","T_OPEN_TAG_WITH_ECHO","T_CLOSE_TAG","T_WHITESPACE","T_START_HEREDOC","T_END_HEREDOC","T_DOLLAR_OPEN_CURLY_BRACES","T_CURLY_OPEN","T_PAAMAYIM_NEKUDOTAYIM","T_DOUBLE_COLON","T_NAMESPACE","T_NS_C","T_DIR","T_NS_SEPARATOR"];
    var current = "UNKNOWN";
    constants.some(function( constant ) {
        if (PHP.Constants[ constant ] === token) {
            current = constant;
            return true;
        } else {
            return false;
        }
    });
    
    return current;
};

PHP.Utils.QueryString = function( str ) {
    str = str.trim();
    var variables = str.split(/&/);
    
    var items = {};
    
    variables.forEach( function( variable ) {
        
        var parts = variable.split(/=/),
            key = decodeURIComponent( parts[ 0 ] ),
            value = (parts.length > 1 ) ? decodeURIComponent( parts[ 1 ] ) : null,
            
            arrayManager = function( item, parse, value ) {
               
                
                var arraySearch = parse.match(/^\[([a-z+0-9_\-])*\]/i);
                
                if ( arraySearch !== null ) {
                    var key = ( arraySearch[ 1 ] === undefined ) ? Object.keys( item ).length : arraySearch[ 1 ];

                    
                    parse = parse.substring( arraySearch[ 0 ].length );
                    
                    if ( parse.length > 0 ) {
                        if ( typeof item[ key ] !== "object" && item[ key ] !== null ) {
                            item[ key ] = {};
                        }
                        
                        arrayManager( item[ key ], parse, value );
                    } else {
                        item[ key ] = ( value !== null) ? value.replace(/\+/g," ") : null;
                    }
                    
                }
                
                
            };
            
            // 
        
        
            var arraySearch = key.match(/^(.*?)((\[[a-z+0-9_\-]*\])+)$/i);

            if ( arraySearch !== null ) {
                key =  arraySearch[ 1 ];
                
                
                
                if ( typeof items[ key ] !== "object" ) {
                    items[ key ] = {};

                }
                
                arrayManager( items[ key ], arraySearch[ 2 ], value );
                

            }
            else  {
                items[ key ] = ( value !== null) ? value.replace(/\+/g," ") : null;
            }
        
        }, this);
   
    return items;
    
    };
    
    