
PHP.Compiler = function( AST ) {
    
    
    this.src = "";
    
    AST.forEach( function( action ){
        this.src += this[ action.type ]( action ) + ";\n";     
    }, this );


};


PHP.Compiler.prototype.getName = function( item ) {
    var parts = item.parts;
    if (Array.isArray( parts )) {
        return parts[ 0 ];
    } else {
        return parts;
    }

};

PHP.Compiler.prototype.source = function( action ) {
    
    if (typeof action === "string") {
        return action;
    } else if ( action === undefined ) {
        
        return undefined;
    } else if ( action.type === "Node_Name" ) {
        return this.getName( action );
    }
    
    return this[ action.type ]( action );
};

PHP.Compiler.prototype.RESOURCES = "\π";

PHP.Compiler.prototype.ENV = "ENV";

PHP.Compiler.prototype.OUTPUT_BUFFER = "OUTPUT_BUFFER";

PHP.Compiler.prototype.CTX = PHP.Compiler.prototype.ENV + ".";

PHP.Compiler.prototype.SUPPRESS = "$Suppress";

PHP.Compiler.prototype.CONSTANTS = "$Constants";

PHP.Compiler.prototype.CONSTANT_GET = "get";

PHP.Compiler.prototype.MAGIC_CONSTANTS = "$MConstants";

PHP.Compiler.prototype.ADD = "$Add";

PHP.Compiler.prototype.CONCAT = "$Concat";

PHP.Compiler.prototype.UNSET = "$Unset";

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
        result = '[' + result.split(/\r\n/).map(function( result ){
            return result.replace(/\r/g,"");
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