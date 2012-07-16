PHP.Compiler.prototype.Node_Scalar_String = function( action ) {

    return this.CREATE_VARIABLE + '(' + this.fixString(action.value) + ')';
       
};

PHP.Compiler.prototype.Node_Scalar_Encapsed = function( action ) {

    var parts = [],
    VARIABLE = PHP.VM.Variable.prototype;
    
    action.parts.forEach(function( part ){
        if ( typeof part === "string" ) {
            parts.push( this.fixString( part ) )
        } else {
            
            
            
            parts.push( this.source( (part[ 0 ] === undefined) ? part : part[ 0 ] ) + "." + VARIABLE.CAST_STRING + "." + this.VARIABLE_VALUE );
        }
    }, this);
    
    var src = this.CREATE_VARIABLE + "(" + parts.join(" + ") + ")";
    return src;

    
};

PHP.Compiler.prototype.Node_Scalar_LNumber = function( action ) {

    return this.CREATE_VARIABLE + '(' + action.value + ')';
    
};


PHP.Compiler.prototype.Node_Scalar_DNumber = function( action ) {

    return this.CREATE_VARIABLE + '(' + action.value + ')';
    
};


PHP.Compiler.prototype.Node_Scalar_LNumber = function( action ) {

    return this.CREATE_VARIABLE + '(' + action.value + ')';
    
};

PHP.Compiler.prototype.Node_Scalar_MethodConst = function( action ) {

    return this.VARIABLE + '("$__METHOD__")';  
};

PHP.Compiler.prototype.Node_Scalar_FuncConst = function( action ) {

    return this.VARIABLE + '("$__FUNCTION__")';  
};

PHP.Compiler.prototype.Node_Scalar_ClassConst = function( action ) {

    return this.VARIABLE + '("$__CLASS__")';  
};

PHP.Compiler.prototype.Node_Scalar_FileConst = function( action ) {

    return this.VARIABLE + '("$__FILE__")';  
//   return this.CTX + PHP.Compiler.prototype.MAGIC_CONSTANTS + '("FILE")';
    
};

PHP.Compiler.prototype.Node_Scalar_LineConst = function( action ) {
    return this.VARIABLE + '("$__LINE__")';  
//    return this.CTX + PHP.Compiler.prototype.MAGIC_CONSTANTS + '("LINE")';
    
};

PHP.Compiler.prototype.Node_Scalar_DirConst = function( action ) {
    return this.VARIABLE + '("$__DIR__")';  
  
};