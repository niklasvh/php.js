

PHP.Compiler.prototype.Node_Expr_ArrayDimFetch = function( action ) {

    return this.source( action.variable ) + "."  + this.DIM_FETCH + '( this, ' + this.source( action.dim ) + " )"; 
};

PHP.Compiler.prototype.Node_Expr_Assign = function( action ) {
    var src = this.source( action.variable ) + "." + this.VARIABLE_VALUE + " = " + this.source( action.expr );
    if (!/Node_Expr_(Plus|Mul|Div|Minus|BitwiseOr|BitwiseAnd)/.test(action.expr.type)) {
        src += "." + this.VARIABLE_VALUE;
    }
    return src; 
};

PHP.Compiler.prototype.Node_Expr_AssignConcat = function( action ) {
    var src = this.source( action.variable ) + "." + this.VARIABLE_VALUE + " += " + this.source( action.expr );
    if (!/Node_Expr_(Plus|Mul|Div|Minus|BitwiseOr|BitwiseAnd)/.test(action.expr.type)) {
        src += "." + this.VARIABLE_VALUE;
    }
    return src; 
};

PHP.Compiler.prototype.Node_Expr_AssignRef = function( action ) {
   
     
    console.log( action );
    return src; 
};

PHP.Compiler.prototype.Node_Expr_Ternary = function( action ) {
    var src = "(( " + this.source( action.cond ) + "." + this.VARIABLE_VALUE + " ) ? " + this.source( action.If ) + " : " + this.source( action.Else ) + ")"; 
     
    return src; 
};

PHP.Compiler.prototype.Node_Expr_ErrorSuppress = function( action ) {
    var src = this.CTX + this.SUPPRESS + "(function() { return " + this.source( action.expr ) + " })";
    return src; 
};

PHP.Compiler.prototype.Node_Expr_FuncCall = function( action ) {

    var src = "",
    args = [];
    if ( action.func.type === "Node_Expr_Variable") {
        src += "(" + this.CTX + "[ " + this.source( action.func ) + "." + this.VARIABLE_VALUE + " ](";
    } else {
        src += "(" + this.CTX + this.getName( action.func ) + "(";
        
        if (this.getName( action.func ) === "eval") {
            args.push("$");
        }
        
    }
   
    action.args.forEach(function( arg ){
        
        args.push( this.source( arg.value ) );
    }, this);
    
    src += args.join(", ") + "))";
   
    return src;
};

PHP.Compiler.prototype.Node_Expr_Isset = function( action ) {
    console.log( action );

    var src = this.CTX + "isset( ";
    
    var args = [];
    action.variables.forEach(function( arg ){
        
        args.push( this.source( arg) );
    }, this);
 
    src += args.join(", ") + " )";
    
    return src;
};

PHP.Compiler.prototype.Node_Expr_UnaryMinus = function( action ) {
    return this.source( action.expr ) + "." + this.NEG + "()";
};

PHP.Compiler.prototype.Node_Expr_BitwiseOr = function( action ) {
    return this.source( action.left ) + "." + this.VARIABLE_VALUE + " | " + this.source( action.right ) + "." + this.VARIABLE_VALUE;
};

PHP.Compiler.prototype.Node_Expr_BitwiseAnd = function( action ) {
    return this.source( action.left )  + "." + this.VARIABLE_VALUE + " & " + this.source( action.right ) + "." + this.VARIABLE_VALUE;
};

PHP.Compiler.prototype.Node_Expr_Div = function( action ) {
    return this.source( action.left ) + "." + this.DIV + "(" + this.source( action.right ) + ")";
};

PHP.Compiler.prototype.Node_Expr_Minus = function( action ) {
    return this.source( action.left ) + "." + this.MINUS + "(" + this.source( action.right ) + ")";
};

PHP.Compiler.prototype.Node_Expr_Mul = function( action ) {
    return this.source( action.left ) + "." + this.MUL + "(" + this.source( action.right ) + ")";
};

PHP.Compiler.prototype.Node_Expr_Plus = function( action ) {
    return this.source( action.left ) + "." + this.ADD + "(" + this.source( action.right ) + ")";
};

PHP.Compiler.prototype.Node_Expr_Equal = function( action ) {
    return this.source( action.left ) + "." + this.EQUAL + "(" + this.source( action.right ) + ")";
};

PHP.Compiler.prototype.Node_Expr_Smaller = function( action ) {
    return this.source( action.left ) + "." + this.VARIABLE_VALUE + " < " + this.source( action.right ) + "." + this.VARIABLE_VALUE;
};

PHP.Compiler.prototype.Node_Expr_PostInc = function( action ) {
    return this.source( action.variable ) + "." + this.POST_INC;
};

PHP.Compiler.prototype.Node_Expr_PostDec = function( action ) {
    return this.source( action.variable ) + "." + this.POST_DEC;
};

PHP.Compiler.prototype.Node_Expr_Concat = function( action ) {
    return this.source( action.left ) + "." + this.CONCAT + "(" + this.source( action.right ) + ")";
};

PHP.Compiler.prototype.Node_Expr_BooleanOr = function( action ) {
    console.log( action );
    return  this.source( action.left ) + " | " + this.source( action.right );
};

PHP.Compiler.prototype.Node_Expr_Variable = function( action ) {

    if ( action.name === "this" ) {
        return action.name;
    } else {
        return this.VARIABLE + '("' + this.source( action.name ) + '")';       
    }
    

};

PHP.Compiler.prototype.Node_Expr_New = function( action ) {

    var src = this.CREATE_VARIABLE + '(new (' + this.CTX + this.CLASS_GET + '("' + this.getName( action.Class ) + '"))( this';
    
    action.args.forEach(function( arg ) {
        
        src += ", "  + this.source( arg.value );
    }, this);
    
    src += " ))";

    return src; 
};


PHP.Compiler.prototype.Node_Expr_ConstFetch = function( action ) {

    if (/true|false|null/i.test(action.name.parts)) {
        return this.CREATE_VARIABLE + '(' + action.name.parts.toLowerCase() + ')';
    } else {
        return this.CTX + this.CONSTANTS + '.' + this.CONSTANT_GET + '("' + this.source( action.name ) + '")';
    }
    
};

PHP.Compiler.prototype.Node_Expr_PropertyFetch = function( action ) {

    if ( action.variable.name !== "this" ) {
        return this.source( action.variable ) + this.CLASS_PROPERTY_GET + '.( this, "' + this.source( action.name ) + '" )';
    } else {
        return "this." + this.CLASS_PROPERTY_GET + '( this, "' + this.source( action.name ) + '" )';
    }
    
};

PHP.Compiler.prototype.Node_Expr_MethodCall = function( action ) {

    var src = this.source( action.variable ) + "." + this.METHOD_CALL + '( this, "' + action.name + '"';

    action.args.forEach(function( arg ) {
        src += ", " + this.source( arg.value );
    }, this);
  
    src += ")";
  
    return src;

};

PHP.Compiler.prototype.Node_Expr_StaticCall = function( action ) {
    console.log(action);
    var src = this.CTX + this.CLASS_GET + '("' + this.source( action.Class ) + '", this).' + this.STATIC_CALL + '( this, "' + action.func + '"';

    action.args.forEach(function( arg ) {
        src += ", " + this.source( arg.value );
    }, this);
  
    src += ")";
  
    return src;

};


PHP.Compiler.prototype.Node_Expr_Array = function( action ) {
    console.log(action.items);
    var src = this.CTX + "array([",
    items = [];

    ((Array.isArray(action.items)) ? action.items : []).forEach(function( item ){
        
        items.push("{" + this.ARRAY_VALUE + ":" + this.source( item.value ) + ( ( item.key !== undefined) ? ", " + this.ARRAY_KEY + ":" + this.source( item.key ) : "") +  "}");
    }, this);
      
    src += items.join(", ") + "])";
    return src;

};

  