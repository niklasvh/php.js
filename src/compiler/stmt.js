
PHP.Compiler.prototype.Node_Stmt_Class = function( action ) {
    

    
    /*
     * CLASS.Class("Male", Person).Public({
                visible: "sup"
            }).Create();
    
    
          if ($item->extends !== null) {
                $source .= "var " . $item->name . " = " . NEWCLASS . '("' . $item->name . "\", " . $item->type . ", \$getClass(\"" . $this->source($item->extends) . "\")";
                $this->parent = $this->source($item->extends);
            } else {
                $source .= "var " . $item->name . " = " . NEWCLASS . '("' . $item->name . "\", " . $item->type;
                if (count($item->implements) > 0) {
                    $source .= ",undefined";
                }
            }

            if (count($item->implements) > 0) {
                $source .= ",[";
                foreach ($item->implements as $i => $implement) {
                    if ($i > 0) {
                        $source .= ",";
                    }
                    $source .= '"' . $implement->parts[0] . '"';
                }
                $source .= "]";
            }

            $source .= ");\n";
    
     */
    
    var src = this.CTX + this.CLASS_NEW + '( "' + action.name + '", ' + action.Type + ', {';
    
    if ( action.Extends !== null ) {
        src += 'Extends: "' + this.source(action.Extends) + '"';
    }
    
    if ( action.Implements.length > 0 ) {
        src += 'Implements: ' + action.Implements;
    }
    
    src += "})\n";
    
    this.currentClass = action.name;
    action.stmts.forEach(function( stmt ) {
        src += this.source( stmt );
    }, this);
    
    
    src += "." + this.CLASS_DECLARE + '();\n;'
    
    
    return src;
};


PHP.Compiler.prototype.Node_Stmt_Echo = function( action ) {
    
    var src = this.CTX + 'echo( ',
    args = [];
    if ( Array.isArray(action.exprs) ) {
        action.exprs.forEach(function( arg ){
            args.push( this.source( arg ) );
        }, this);
        src += args.join(", ");
    } else {
        src += this.source(action.exprs);
    }

    src += ' )';
    return src;
};

PHP.Compiler.prototype.Node_Stmt_For = function( action ) {
    
    var src = this.LABEL + this.LABEL_COUNT++ + ":\n";
    
    src += "for( " + this.source( action.init ) + "; ";
    
    src += "(" + this.source( action.cond ) + ")." + PHP.VM.Variable.prototype.CAST_BOOL + "." + this.VARIABLE_VALUE + "; ";
    
    src += this.source( action.loop ) + " ) {\n";
    
    action.stmts.forEach(function( stmt ){
        src += this.source( stmt ) + ";\n";
    }, this);
    
    src += "}";

    return src;
};

PHP.Compiler.prototype.Node_Stmt_While = function( action ) {

    var src = this.LABEL + this.LABEL_COUNT++ + ":\n";
    
    src += "while( " + this.source( action.cond ) + "." + PHP.VM.Variable.prototype.CAST_BOOL + "." + this.VARIABLE_VALUE + ") {\n";
    
    action.stmts.forEach(function( stmt ){
        src += this.source( stmt ) + ";\n";
    }, this);
    
    src += "}";

    return src;
};

PHP.Compiler.prototype.Node_Stmt_Foreach = function( action ) {
   
    var src = this.CTX + 'foreach( ' + this.VARIABLE + ', ' + this.source( action.expr ) + ', function() {\n'; 
    //( $, expr, func, value, key )

    action.stmts.forEach(function( stmt ){
        src += this.source( stmt )  + ";\n";
    }, this);

    src += '}, ' + this.source( action.valueVar );

    //  src += '}, "' + action.valueVar.name + '"';

    if (action.keyVar !== null) {
        src += ', ' + this.source( action.expr );
    }
    src += ')'
    
        

    return src;
};


PHP.Compiler.prototype.Node_Stmt_Continue = function( action ) {
    // todo fix
    var src = "return";
    console.log( action );
    return src;  
};

PHP.Compiler.prototype.Node_Stmt_Break = function( action ) {
    return "break";
};

PHP.Compiler.prototype.Node_Stmt_Function = function( action ) {
    // todo fix
    var src = this.CTX +  action.name + " = Function.prototype.bind.apply( function( " + this.VARIABLE + ", " + this.FUNCTION_STATIC + "  ) {\n";
    
    src += this.VARIABLE + " = " + this.VARIABLE + "();\n"
    
    action.stmts.forEach(function( stmt ){
        src += this.source( stmt ) + ";\n";
    }, this);
    
    src += "}, (" + this.CTX + this.FUNCTION_HANDLER + ")( this ))";

    console.log( action );
    return src;  
};

PHP.Compiler.prototype.Node_Stmt_Static = function( action ) {
    // todo fix
    var src = this.FUNCTION_STATIC;
    action.vars.forEach( function( variable ){
        src += this.source( variable );
    }, this);

    console.log( action );
    return src;  
};

PHP.Compiler.prototype.Node_Stmt_StaticVar = function( action ) {
    // todo fix
    var src = "." + this.FUNCTION_STATIC_SET + '("' + action.name + '", ' + this.source( action.def ) + ")";

    console.log( action );
    return src;  
};

PHP.Compiler.prototype.Node_Stmt_Property = function( action ) {
    var src = "";
    action.props.forEach(function( prop ){
       
        src += "." + this.CLASS_PROPERTY + '( "' + prop.name + '", ' + action.Type;
        if ( prop.def !== null ) {
            src += ', ' + this.source( prop.def );
        }
        
        src += " )\n";
        
    }, this);
   
    return src;
};

PHP.Compiler.prototype.Node_Stmt_Unset = function( action ) {
    var src = this.CTX + "unset( ",
    vars = [];

    action.variables.forEach(function( variable ){
        vars.push( this.source( variable ) );
    }, this);
    
    src += vars.join(", ") + " )";
    
    return src;
};

PHP.Compiler.prototype.Node_Stmt_InlineHTML = function( action ) {
    var src = this.CTX + this.OUTPUT_BUFFER + ' += "' + action.value + '"';
    
    return src;
};

PHP.Compiler.prototype.Node_Stmt_If = function( action ) {
    var src = "if ( (" + this.source( action.cond ) + ")." + PHP.VM.Variable.prototype.CAST_BOOL + "." + this.VARIABLE_VALUE + ") {\n"; 
    
    action.stmts.forEach(function( stmt ){
        src += this.source( stmt) + ";\n";
    }, this);
    console.log(action);
    
    if ( action.Else !== null ) {
        src += "} else {\n";
        
        action.Else.stmts.forEach(function( stmt ){
            src += this.source( stmt) + ";\n";
        }, this);
    }
    
    src += "}"
    

    
    return src;
};

PHP.Compiler.prototype.Node_Stmt_ClassMethod = function( action ) {

    
    var src = "." + this.CLASS_METHOD + '( "' + action.name + '", ' + action.Type + ', ';
    var props = [];
    
    
    
    ((Array.isArray(action.params[ 0 ])) ? action.params[ 0 ] : action.params).forEach(function( prop ){
        
        var obj = {
            name: prop.name
        };
        
        if (prop.def !== null) {
            obj.def = prop.def;
        }
        
        props.push( obj );
        
    }, this)   
        
    src += JSON.stringify( props ) + ', function() {\n';
    
    action.stmts.forEach(function( stmt ){
        src += this.source( stmt ) + ";\n";
    }, this);
    
    src += '\n} )\n';
    
    return src;
};


PHP.Compiler.prototype.Node_Stmt_Return = function( action ) {
    return "return " + this.source( action.expr );

};