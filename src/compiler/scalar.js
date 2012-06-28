PHP.Compiler.prototype.Node_Scalar_String = function( action ) {

    return this.CREATE_VARIABLE + '(' + this.fixString(action.value) + ')';
    
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

    return this.CTX + PHP.Compiler.prototype.MAGIC_CONSTANTS + '("METHOD")';
    
};

PHP.Compiler.prototype.Node_Scalar_FileConst = function( action ) {

    return this.CTX + PHP.Compiler.prototype.MAGIC_CONSTANTS + '("FILE")';
    
};