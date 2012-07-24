
PHP.Compiler = function( AST, file, opts ) {
    
    this.file = file;
    this.src = "";
    this.FOREACH_COUNT = 0;
    opts = opts || {};
 
    this.FUNC_NUM = 0;
    this.dimVars = "";
    this.tmpDimVars = "";
    this.DEPRECATED = [];
    this.dimPrev = "";
    
    this.INSIDE_METHOD = (opts.INSIDE_METHOD !== undefined ) ? opts.INSIDE_METHOD  : false;
        
    this.src += this.stmts( AST, true );
    
    /*
    AST.forEach( function( action ){
        if ( this.FATAL_ERROR !== undefined ) {
            return;
        }
        this.src += this[ action.type ]( action ) + ";\n";     
    }, this );*/

    if ( this.FATAL_ERROR !== undefined ) {
        this.src = 'this[ PHP.Compiler.prototype.ERROR ]("' + this.FATAL_ERROR + '", ' +((  this.ERROR_TYPE === undefined ) ? "PHP.Constants.E_ERROR" : this.ERROR_TYPE ) + ');';
    }
    var tmp = "";
    this.DEPRECATED.forEach(function( error ){
        
        tmp +=   'this[ PHP.Compiler.prototype.ERROR ]("' + error[ 0 ] + ' in ' + this.file + ' on line ' + error[ 1 ] + '", PHP.Constants.E_DEPRECATED);';
    
    }, this);
    
    this.src = tmp + this.src;
    


};

var COMPILER = PHP.Compiler.prototype;

COMPILER.getName = function( item ) {
    var parts = item.parts;
    if (Array.isArray( parts )) {
        return parts[ 0 ];
    } else {
        return parts;
    }

};

COMPILER.stmts = function( stmts, main ) {
    var src = "";
    
    stmts.forEach(function( stmt ){
        if ( this.FATAL_ERROR !== undefined ) {
            return;
        }
        
        var tmp = this.source( stmt );
        
        if ( this.dimVars.length > 0 || this.tmpDimVars.length > 0 ) {
            src +=  this.dimVars + this.tmpDimVars;
            this.dimVars = this.tmpDimVars = "";
        }   
        
        src += tmp;
        
        if ( stmt.type === "Node_Expr_New") {
            // init class without assign, call destruct ( this might not be valid in all cases )
            src += "." + this.UNSET + "()";
            
        }
        
        if (  /^Node_Expr_Post(Inc|Dec)$/.test( stmt.type ) ) {
            // trigger POST_MOD
            src += "." + this.VARIABLE_VALUE;
        }
        
        src += ";\n";
    }, this);
  
    return src;
};

COMPILER.source = function( action ) {
    
   
    
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
     
    if ( Array.isArray( action )) {
        return this[ action[0].type ]( action[0] );
    }
  
    return this[ action.type ]( action );
};

COMPILER.FILE_PATH = "$FILE_PATH"; 

COMPILER.NAV = "$NaV"; // not a variable;

COMPILER.FILESYSTEM = "$FS";

COMPILER.RESOURCES = "\π";

COMPILER.TIMER = "$Timer";

COMPILER.ENV = "ENV";

COMPILER.OUTPUT_BUFFER = "OUTPUT_BUFFER";

COMPILER.OUTPUT_BUFFERS = "OUTPUT_BUFFERS";

COMPILER.CTX = COMPILER.ENV + ".";

COMPILER.PARAM_NAME = "n";

COMPILER.PARAM_BYREF = "r";

COMPILER.CATCH = "$Catch";

COMPILER.EXCEPTION = "$Exception";

COMPILER.SUPPRESS = "$Suppress";

COMPILER.CONSTANTS = "$Constants";

COMPILER.CONSTANT_GET = "get";

COMPILER.CLASS_CONSTANT_GET = "$Class.ConstantGet";

COMPILER.CONSTANT_SET = "set";

COMPILER.CONSTANT_DEFINED = "defined";

COMPILER.MAGIC_CONSTANTS = "$MConstants";

COMPILER.ASSIGN = "_";

COMPILER.ASSIGN_PLUS = "_Plus";

COMPILER.ASSIGN_MINUS = "_Minus";

COMPILER.ASSIGN_CONCAT = "_Concat";

COMPILER.NEG = "$Neg";

COMPILER.ADD = "$Add";

COMPILER.MUL = "$Mul";

COMPILER.MOD = "$Mod";

COMPILER.DIV = "$Div";

COMPILER.FUNCTION = "$F";

COMPILER.FUNCTION_HANDLER = "$FHandler";

COMPILER.FUNCTION_STATIC = "$Static";

COMPILER.FUNCTION_GLOBAL = "$Global";

COMPILER.FUNCTION_STATIC_SET = "$Set";

COMPILER.BOOLEAN_OR = "$Or";

COMPILER.PRE_INC = "$PreInc";

COMPILER.PRE_DEC = "$PreDec";

COMPILER.POST_INC = "$PostInc";

COMPILER.POST_DEC = "$PostDec";

COMPILER.MINUS = "$Minus";

COMPILER.CONCAT = "$Concat";

COMPILER.UNSET = "$Unset";

COMPILER.NOT_IDENTICAL = "$NIdentical";

COMPILER.IDENTICAL = "$Identical";

COMPILER.BOOLEAN_NOT = "$Not";

COMPILER.BOOLEAN_AND = "$And";

COMPILER.EQUAL = "$Equal";

COMPILER.NOT_EQUAL = "$Equal";

COMPILER.SMALLER = "$Smaller";

COMPILER.SMALLER_OR_EQUAL = "$S_Equal";

COMPILER.GREATER = "$Greater";

COMPILER.GREATER_OR_EQUAL = "$G_Equal";

COMPILER.LABEL = "LABEL";

COMPILER.LABEL_COUNT = 0;

COMPILER.VARIABLE = "$";

COMPILER.VARIABLE_VALUE = "$";

COMPILER.CREATE_VARIABLE = "$$";

COMPILER.ARRAY_CLONE = "$AClone";

COMPILER.VARIABLE_CLONE = "$VClone";

COMPILER.ARRAY_GET = "offsetGet";

COMPILER.ARRAY_SET = "offsetSet";

COMPILER.METHOD_CALL = "$Call";

COMPILER.DIM_FETCH = "$Dim";

COMPILER.DIM_ISSET = "$DimIsset";

COMPILER.DIM_UNSET = "$DimUnset";

COMPILER.DIM_EMPTY = "$DimEmpty";

COMPILER.STATIC_CALL = "$StaticCall";

COMPILER.CLASS_NAME = "$Name";

COMPILER.INTERFACE_NEW = "$Class.INew";

COMPILER.CLASS_NEW = "$Class.New";

COMPILER.CLASS_GET = "$Class.Get";

COMPILER.CLASS_STORED = "$StoredIn";

COMPILER.CLASS_CLONE = "$CClone";

COMPILER.CLASS_PROPERTY_GET = "$Prop";

COMPILER.CLASS_PROPERTY_ISSET = "$PropIsset";

COMPILER.CLASS_STATIC_PROPERTY_ISSET = "$SPropIsset";

COMPILER.STATIC_PROPERTY_GET = "$SProp";

COMPILER.CLASS_METHOD = "Method";

COMPILER.CLASS_CONSTANT = "Constant";

COMPILER.CLASS_CONSTANT_FETCH = "$Constant";

COMPILER.PROPERTY_TYPE = "p";

COMPILER.PROPERTY_DEFAULT = "d";

COMPILER.CLASS_PROPERTY = "Variable";

COMPILER.CLASS_DECLARE = "Create";

COMPILER.CLASS_NAMES = "$CLASSNAMES";

COMPILER.CLASS_DESTRUCT = "$Destruct";

COMPILER.CLASS_TYPE = "$CType";

COMPILER.ARRAY_VALUE = "v";

COMPILER.ARRAY_KEY = "k";

COMPILER.ERROR  = "$ERROR";

COMPILER.GLOBAL  = "$Global";

COMPILER.SIGNATURE  = "$SIGNATURE";

COMPILER.DISPLAY_HANDLER  = "$DisplayHandler";

COMPILER.TYPE_CHECK  = "$TypeCheck";

COMPILER.INSTANCEOF  = "$InstanceOf";

COMPILER.fixString =  function( result ) {
    
    

    
    if ( result.match(/^("|')/) === null) {
        result = '"' + result + '"';
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
    
    result = result.replace(/([^\\])\\([^\\nrt\$'"])/g, "$1\\\\$2");
        
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