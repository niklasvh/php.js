

PHP.Compiler.prototype.Node_Expr_ArrayDimFetch = function( action ) {
    return this.source( action.variable ) + "." + this.ARRAY_GET + "( " + this.source( action.dim ) + " )"; 
};

PHP.Compiler.prototype.Node_Expr_Assign = function( action ) {
    var src = this.source( action.variable ) + " = " + this.source( action.expr );
    if (!/Node_Expr_(Plus|Mul|Div|Minus|BitwiseOr|BitwiseAnd)/.test(action.expr.type)) {
        src += "." + this.VARIABLE_VALUE;
    }
    return src; 
};

PHP.Compiler.prototype.Node_Expr_AssignRef = function( action ) {
    console.log( action );
    return src; 
};


PHP.Compiler.prototype.Node_Expr_FuncCall = function( action ) {
    /*
    console.log(action);
    
                if ($item->name instanceof PHPParser_Node_Expr_Variable) {
                $source .= str_repeat("\t", $tabs) . "(self[ " . $this->source($item->name) . VARIABLE_VALUE . " ](";
            } else {
                $source .= str_repeat("\t", $tabs) . "(" . getName($item->name) . "(";
            }

            if (count($item->args) > 0) {
                $source .= " ";
                $first = true;
                foreach ($item->args as $param) {

                    if ($first === false) {
                        $source .= ", ";
                    }
                    $first = false;
                    $source .= $this->source($param->value);
                }
                $source .= " ";
            }
            $source .= "))";
    
    */
   
    var src = "";
    if ( action.func.type === "Node_Expr_Variable") {
        src += "(" + this.CTX + "[ " + this.source( action.func ) + "." + this.VARIABLE_VALUE + " ](";
    } else {
        src += "(" + this.CTX + this.getName( action.func ) + "(";
    }
    var args = [];
    action.args.forEach(function( arg ){
        args.push( this.source( arg.value ) );
    }, this);
    
    src += args.join(", ") + "))";
   
    return src;
};

PHP.Compiler.prototype.Node_Expr_BitwiseOr = function( action ) {
    return this.source( action.left ) + " | " + this.source( action.right );
};

PHP.Compiler.prototype.Node_Expr_BitwiseAnd = function( action ) {
    return this.source( action.left ) + " & " + this.source( action.right );
};

PHP.Compiler.prototype.Node_Expr_Div = function( action ) {
    return this.source( action.left ) + " / " + this.source( action.right );
};

PHP.Compiler.prototype.Node_Expr_Minus = function( action ) {
    return this.source( action.left ) + " - " + this.source( action.right );
};

PHP.Compiler.prototype.Node_Expr_Mul = function( action ) {
    return this.source( action.left ) + " * " + this.source( action.right );
};

PHP.Compiler.prototype.Node_Expr_Plus = function( action ) {
    return this.source( action.left ) + " + " + this.source( action.right );
};

PHP.Compiler.prototype.Node_Expr_Smaller = function( action ) {
    return this.source( action.left ) + " < " + this.source( action.right );
};

PHP.Compiler.prototype.Node_Expr_PostInc = function( action ) {
    return this.source( action.variable ) + "++";
};

PHP.Compiler.prototype.Node_Expr_Concat = function( action ) {
    return this.source( action.left ) + "." + this.CONCAT + "(" + this.source( action.right ) + ")";
};

PHP.Compiler.prototype.Node_Expr_Variable = function( action ) {

    if ( action.name === "this" ) {
        return action.name;
    } else {
        return this.VARIABLE + '("' + this.source( action.name ) + '").' + this.VARIABLE_VALUE;       
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
        return action.name.parts;
    } else {
        return this.CONSTANTS + '.get("' + this.source( action.name ) + '")';
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
   
    var src = this.CTX + "array(",
    items = [];

    ((Array.isArray(action.items)) ? action.items : [ action.items ]).forEach(function( item ){
        items.push("{" + this.ARRAY_VALUE + ":" + this.source( item.value ) + ( ( item.key !== undefined) ? ", " + this.ARRAY_KEY + ":" + this.source( item.key ) : "") +  "}");
    }, this);
      
    src += items.join(", ") + ")";
    return src;

};

  