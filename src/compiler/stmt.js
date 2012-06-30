
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
    
    src += this.source( action.cond ) + "; ";
    
    src += this.source( action.loop ) + " ) {\n";
    
    action.stmts.forEach(function( stmt ){
        src += this.source( stmt ) + ";\n";
    }, this);
    
    src += "}";

    return src;
};

PHP.Compiler.prototype.Node_Stmt_Foreach = function( action ) {
    console.log( action );
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
    src += ');\n'
    
        

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
    var src = "";

    action.variables.forEach(function( variable ){
        this.source( variable ) + "." + this.UNSET + "()";
    }, this);
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