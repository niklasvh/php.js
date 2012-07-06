
PHP.Compiler = function( AST ) {
    
    
    this.src = "";
    
    AST.forEach( function( action ){
        this.src += this[ action.type ]( action ) + ";\n";     
    }, this );

    this.INSIDE_METHOD = false;

};


PHP.Compiler.prototype.getName = function( item ) {
    var parts = item.parts;
    if (Array.isArray( parts )) {
        return parts[ 0 ];
    } else {
        return parts;
    }

};

PHP.Compiler.prototype.stmts = function( stmts ) {
    var src = "";
    
    stmts.forEach(function( stmt ){
        src += this.source( stmt );
        
        if ( /^Node_Expr_Post(Inc|Dec)$/.test( stmt.type ) ) {
            // trigger POST_MOD
            src += "." + this.VARIABLE_VALUE;
        }
        
        src += ";\n";
    }, this);
  
    return src;
};

PHP.Compiler.prototype.source = function( action ) {
    if ( action === null ) {
        return "undefined";
    }
    
    if (typeof action === "string") {
        return action;
    } else if ( action === undefined ) {
        
        return undefined;
    } else if ( action.type === "Node_Name" ) {
        return this.getName( action );
    }
    
    return this[ action.type ]( action );
};

PHP.Compiler.prototype.FILESYSTEM = "$FS";

PHP.Compiler.prototype.RESOURCES = "\π";

PHP.Compiler.prototype.ENV = "ENV";

PHP.Compiler.prototype.OUTPUT_BUFFER = "OUTPUT_BUFFER";

PHP.Compiler.prototype.CTX = PHP.Compiler.prototype.ENV + ".";

PHP.Compiler.prototype.PARAM_NAME = "n";

PHP.Compiler.prototype.CATCH = "$Catch";

PHP.Compiler.prototype.EXCEPTION = "$Exception";

PHP.Compiler.prototype.SUPPRESS = "$Suppress";

PHP.Compiler.prototype.CONSTANTS = "$Constants";

PHP.Compiler.prototype.CONSTANT_GET = "get";

PHP.Compiler.prototype.MAGIC_CONSTANTS = "$MConstants";

PHP.Compiler.prototype.ASSIGN = "_";

PHP.Compiler.prototype.NEG = "$Neg";

PHP.Compiler.prototype.ADD = "$Add";

PHP.Compiler.prototype.MUL = "$Mul";

PHP.Compiler.prototype.MOD = "$Mod";

PHP.Compiler.prototype.DIV = "$Div";

PHP.Compiler.prototype.FUNCTION_HANDLER = "$FHandler";

PHP.Compiler.prototype.FUNCTION_STATIC = "$Static";

PHP.Compiler.prototype.FUNCTION_STATIC_SET = "$Set";

PHP.Compiler.prototype.BOOLEAN_OR = "$Or";

PHP.Compiler.prototype.PRE_INC = "$PreInc";

PHP.Compiler.prototype.PRE_DEC = "$PreDec";

PHP.Compiler.prototype.POST_INC = "$PostInc";

PHP.Compiler.prototype.POST_DEC = "$PostDec";

PHP.Compiler.prototype.MINUS = "$Minus";

PHP.Compiler.prototype.CONCAT = "$Concat";

PHP.Compiler.prototype.UNSET = "$Unset";

PHP.Compiler.prototype.EQUAL = "$Equal";

PHP.Compiler.prototype.SMALLER = "$Smaller";

PHP.Compiler.prototype.SMALLER_OR_EQUAL = "$S_Equal";

PHP.Compiler.prototype.GREATER = "$Greater";

PHP.Compiler.prototype.GREATER_OR_EQUAL = "$G_Equal";

PHP.Compiler.prototype.LABEL = "LABEL";

PHP.Compiler.prototype.LABEL_COUNT = 0;

PHP.Compiler.prototype.VARIABLE = "$";

PHP.Compiler.prototype.VARIABLE_VALUE = "$";

PHP.Compiler.prototype.CREATE_VARIABLE = "$$";

PHP.Compiler.prototype.ARRAY_GET = "offsetGet";

PHP.Compiler.prototype.METHOD_CALL = "$Call";

PHP.Compiler.prototype.DIM_FETCH = "$Dim";

PHP.Compiler.prototype.STATIC_CALL = "$StaticCall";

PHP.Compiler.prototype.CLASS_NAME = "$Name";

PHP.Compiler.prototype.CLASS_NEW = "$Class.New";

PHP.Compiler.prototype.CLASS_GET = "$Class.Get";

PHP.Compiler.prototype.CLASS_PROPERTY_GET = "$Prop";

PHP.Compiler.prototype.STATIC_PROPERTY_GET = "$SProp";

PHP.Compiler.prototype.CLASS_METHOD = "Method";

PHP.Compiler.prototype.CLASS_PROPERTY = "Variable";

PHP.Compiler.prototype.CLASS_DECLARE = "Create";

PHP.Compiler.prototype.CLASS_NAMES = "$CLASSNAMES";

PHP.Compiler.prototype.ARRAY_VALUE = "v";

PHP.Compiler.prototype.ARRAY_KEY = "k";

PHP.Compiler.prototype.ERROR  = "$ERROR";

PHP.Compiler.prototype.GLOBAL  = "$Global";

PHP.Compiler.prototype.SIGNATURE  = "$SIGNATURE";

PHP.Compiler.prototype.fixString =  function( result ) {
    
    

    
    if ( result.match(/^("|')/) === null) {
        result = '"' + result.replace(/([^"\\]*(?:\\.[^"\\]*)*)"/g, '$1\\"') + '"';
    }
    
    if (result.match(/\r\n/) !== null) {
        var quote = result.substring(0, 1);
        

        
        // this might have unexpected consequenses
        result = result.replace(/\r\n"$/,'"');
        
        result = '[' + result.split(/\r\n/).map(function( item ){
            var a = item.replace(/\r/g,"").replace(/\n/,"\\n");
            return a;
        }).join( quote + "," + quote ) + '].join("\\n")';
                
    }
    

        
    return result;
    
/*
    $val = str_replace("\\", "\\\\", $val);
    //$val = str_replace("\n", "\\n", $val);
    //$val = str_replace("\t", "\\t", $val);
    $val = str_replace('"', '\\"', $val);
    //$val = str_replace('\\\\', '\\\\\\\\', $val);

    $val = str_replace("\n", "\\n", $val);
    $val = str_replace("\t", "\\t", $val);
*/


}