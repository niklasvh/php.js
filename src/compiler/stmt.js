PHP.Compiler.prototype.Node_Stmt_Interface = function( action ) {
    action.stmts.forEach(function( stmt ){
        if ( stmt.type === "Node_Stmt_ClassMethod" && stmt.stmts !== null) {
            this.FATAL_ERROR = "Interface function " + action.name + "::" + stmt.name + "() cannot contain body {} on line " + action.attributes.startLine;
        }
    }, this);

    var src = this.CTX + this.INTERFACE_NEW + '( "' + action.name + '", [';

    
    var ints = [];

    function addInterface( interf ) {

        interf.forEach( function( item ){
            if  (Array.isArray( item )) {
                addInterface( item );
            } else {

                ints.push( '"' + item.parts + '"' );
            }
        });
    }

    addInterface( action.Extends );
    /*
        src += (Array.isArray(action.Implements[ 0 ]) ? action.Implements[ 0 ] : action.Implements ).map(function( item ){

            return '"' + item.parts + '"';
        }).join(", ");
        */
    src += ints.join(", ");

    /*
    var exts = [];

    action.Extends.forEach(function( ext ){
        exts.push( '"' + ext.parts + '"' );
    }, this);

    src += exts.join(", ")
    */
    src += "], function( M, $, $$ ){\n M";

    this.currentClass = action.name;
    action.stmts.forEach(function( stmt ) {
        src += this.source( stmt );
    }, this);


    src += "." + this.CLASS_DECLARE + '()})'


    return src;
};

PHP.Compiler.prototype.Node_Stmt_Class = function( action ) {
    var src = this.CTX + this.CLASS_NEW + '( "' + action.name + '", ' + action.Type + ', {';

    if ( action.Extends !== null ) {
        src += 'Extends: "' + this.source(action.Extends) + '"';
    }

    if ( action.Implements.length > 0 ) {
        if ( action.Extends !== null ) {
            src += ", "
        }

        // properly borken somewhere in the parser
        src += 'Implements: [';

        var ints = [];

        function addInterface( interf ) {

            interf.forEach( function( item ){
                if  (Array.isArray( item )) {
                    addInterface( item );
                } else {

                    ints.push( '"' + item.parts + '"' );
                }
            });
        }

        addInterface( action.Implements );
        /*
        src += (Array.isArray(action.Implements[ 0 ]) ? action.Implements[ 0 ] : action.Implements ).map(function( item ){

            return '"' + item.parts + '"';
        }).join(", ");
        */
        src += ints.join(", ");
        src += "]";
    }

    src += "}, function( M, $, $$ ){\n M";

    this.currentClass = action.name;
    action.stmts.forEach(function( stmt ) {
        src += this.source( stmt );
    }, this);

    src += "." + this.CLASS_DECLARE + '()'

    src += "})"




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

    src += "for( ";

    if ( !Array.isArray(action.init) || action.init.length !== 0 ) {
        src += this.source( action.init );
    }

    src += "; ";

    if ( !Array.isArray(action.cond) || action.cond.length !== 0 ) {
        src += "(" + this.source( action.cond ) + ")." + PHP.VM.Variable.prototype.CAST_BOOL + "." + this.VARIABLE_VALUE;
    }

    src += "; "

    // if ( !Array.isArray(action.loop) || action.loop.length !== 1 ) { // change

    if ( action.loop.length > 0 ) {
        src += this.source( action.loop ) + "." + this.VARIABLE_VALUE;
    }
    // }
    src += " ) { ";

    src += this.CTX + this.TIMER + "();\n";

    src += this.stmts( action.stmts );

    src += "}";

    return src;
};

PHP.Compiler.prototype.Node_Stmt_While = function( action ) {

    var src = this.LABEL + this.LABEL_COUNT++ + ":\n";

    src += "while( " + this.source( action.cond ) + "." + PHP.VM.Variable.prototype.CAST_BOOL + "." + this.VARIABLE_VALUE + ") {";

    src += this.CTX + this.TIMER + "(); \n";

    src += this.stmts( action.stmts );

    src += "}";

    return src;
};

PHP.Compiler.prototype.Node_Stmt_Do = function( action ) {

    var src = this.LABEL + this.LABEL_COUNT++ + ":\n";
    src += "do {\n"
    src += this.stmts( action.stmts );
    src += "} while( " + this.source( action.cond ) + "." + PHP.VM.Variable.prototype.CAST_BOOL + "." + this.VARIABLE_VALUE + ")";

    return src;
};

PHP.Compiler.prototype.Node_Stmt_Switch = function( action ) {
    var src = this.LABEL + this.LABEL_COUNT++ + ":\n";
    src += "switch(" + this.source( action.cond ) + "." + this.VARIABLE_VALUE+ ") {\n";

    action.cases.forEach(function( item ){
        src += this.source( item ) + ";\n";
    }, this);
    src += "}";


    return src;
};

PHP.Compiler.prototype.Node_Stmt_Case = function( action ) {

    var src = "";
    if (action.cond === null) {
        src += "default:\n";
    } else {
        src += "case (" + this.source( action.cond ) + "." + this.VARIABLE_VALUE+ "):\n";
    }


    action.stmts.forEach(function( item ){
        src += this.source( item ) + ";\n";
    }, this);



    return src;
};

PHP.Compiler.prototype.Node_Stmt_Foreach = function( action ) {

    if ( action.expr.type === "Node_Expr_Array" && action.byRef === true ) {

        if (action.keyVar === null) {
            this.FATAL_ERROR = "syntax error, unexpected '&' in " + this.file + " on line " + action.attributes.startLine;
            this.ERROR_TYPE = PHP.Constants.E_PARSE;
        } else {
            this.FATAL_ERROR = "Cannot create references to elements of a temporary array expression in " + this.file + " on line " + action.attributes.startLine;
        }
        return;
    }

    var count = ++this.FOREACH_COUNT;
    var src = "var iterator" + count + " = " + this.CTX + "$foreachInit(" + this.source( action.expr ) + ", " + ( (this.INSIDE_METHOD === true) ? "ctx" : "this") + ");\n";
    src += "while(" + this.CTX + 'foreach( iterator' + count + ', ' + action.byRef + ", " + this.source( action.valueVar );

    if (action.keyVar !== null) {
        src += ', ' + this.source( action.keyVar );
    }
    src += ')) {\n'

    src += this.stmts( action.stmts );

    src += '} '

    src += this.CTX + "$foreachEnd( iterator" + count + " )";
    return src;
};


PHP.Compiler.prototype.Node_Stmt_Continue = function( action ) {

    var src = "continue";
    return src;
};

PHP.Compiler.prototype.Node_Stmt_Break = function( action ) {

    var src = "break"

    if (action.num !== null) {
        src += " " + this.LABEL + (this.LABEL_COUNT - action.num.value );
    }
    return src;
};

PHP.Compiler.prototype.Node_Stmt_Function = function( action ) {

    var src = this.CTX +  action.name + " = Function.prototype.bind.apply( function( " + this.VARIABLE + ", " + this.FUNCTION_STATIC + ", " + this.FUNCTION_GLOBAL + "  ) {\n";

    src += this.VARIABLE + " = " + this.VARIABLE + "(["
    var params = [];
    ((action.params[ 0 ] === undefined || !Array.isArray( action.params[ 0 ] ) ) ? action.params : action.params[ 0 ]).forEach(function( param ){

        if ( param.type === "Node_Param" ) {
            var item = '{' + this.PARAM_NAME +':"' + param.name + '"';

            if ( param.byRef === true ) {
                item += "," + this.PARAM_BYREF + ':true'
            }

            if (param.def !== null) {
                item += ", " + this.PROPERTY_DEFAULT  + ": " + this.source( param.def )
            }

            if (param.Type !== null ) {
                item += ", " +  this.PROPERTY_TYPE + ': "' + this.source( param.Type ) + '"'
            }


            item += '}'
            params.push( item );
        }

    }, this);

    src += params.join(", ") + "], arguments);\n"

    src += this.stmts( action.stmts );



    src += "}, (" + this.CTX + this.FUNCTION_HANDLER + ')( ENV, "' + action.name + '", ' + action.byRef + '  ))';


    return src;
};

PHP.Compiler.prototype.Node_Stmt_Static = function( action ) {
    // todo fix
    var src = this.FUNCTION_STATIC;
    action.vars.forEach( function( variable ){
        src += this.source( variable );
    }, this);


    return src;
};


PHP.Compiler.prototype.Node_Stmt_Global = function( action ) {
    // todo fix
    var src = this.FUNCTION_STATIC + "." + this.FUNCTION_GLOBAL + "([",
    vars = [];

    action.vars.forEach( function( variable ){
        vars.push( '"' + variable.name + '"' );

    }, this);
    src += vars.join(", ") + "])";
    return src;
};

PHP.Compiler.prototype.Node_Stmt_StaticVar = function( action ) {
    // todo fix
    var src = "." + this.FUNCTION_STATIC_SET + '("' + action.name + '", ' + (( action.def === null) ? "new PHP.VM.Variable()" : this.source( action.def )) + ")";

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
        switch (variable.type) {

            case "Node_Expr_ArrayDimFetch":
                vars.push( this.source( variable.variable ) + "."  + this.DIM_UNSET + '( this, ' + this.source( variable.dim ) + " )" );
                break;
            default:
                vars.push( this.source( variable ) );
        }


    }, this);

    src += vars.join(", ") + " )";

    return src;
};

PHP.Compiler.prototype.Node_Stmt_InlineHTML = function( action ) {
    var src = this.CTX + '$ob("' + action.value.replace(/[\\"]/g, '\\$&').replace(/\n/g,"\\n").replace(/\r/g,"") + '")';

    return src;
};

PHP.Compiler.prototype.Node_Stmt_If = function( action ) {
    var src = "if ( (" + this.source( action.cond ) + ")." + PHP.VM.Variable.prototype.CAST_BOOL + "." + this.VARIABLE_VALUE + ") {\n";

    action.stmts.forEach(function( stmt ){
        src += this.source( stmt) + ";\n";
    }, this);

    action.elseifs.forEach(function( Elseif ){
        src += this.source( Elseif) + "\n";
    }, this);


    if ( action.Else !== null ) {
        src += "} else {\n";

        action.Else.stmts.forEach(function( stmt ){
            src += this.source( stmt) + ";\n";
        }, this);
    }

    src += "}"



    return src;
};

PHP.Compiler.prototype.Node_Stmt_ElseIf = function( action ) {
    var src = "} else if ( (" + this.source( action.cond ) + ")." + PHP.VM.Variable.prototype.CAST_BOOL + "." + this.VARIABLE_VALUE + ") {\n";

    action.stmts.forEach(function( stmt ){
        src += this.source( stmt) + ";\n";
    }, this);

    return src;
};


PHP.Compiler.prototype.Node_Stmt_Throw = function( action ) {
    var src = "throw " + this.source( action.expr );
    return src;
};

PHP.Compiler.prototype.Node_Stmt_TryCatch = function( action ) {
    var src = "try {\n";
    src += this.stmts( action.stmts ) + "} catch( emAll ) {\n";
    src += this.CTX + this.EXCEPTION + '( emAll )';

    action.catches.forEach(function( Catch ){
        src += this.source( Catch );
    }, this);

    src += ";\n }"


    this.source( action.expr );
    return src;
};

PHP.Compiler.prototype.Node_Stmt_Catch = function( action ) {
    var src = "." + this.CATCH + '( "' + action.variable + '", "' + action.Type.parts + '", ' + this.VARIABLE + ', function() {\n';
    src += this.stmts( action.stmts );
    src += "})"
    return src;

};

PHP.Compiler.prototype.Node_Stmt_ClassMethod = function( action ) {



    this.INSIDE_METHOD = true;
    var src = "." + this.CLASS_METHOD + '( "' + action.name + '", ' + action.Type + ', [';
    var props = [];



    ((Array.isArray(action.params[ 0 ])) ? action.params[ 0 ] : action.params).forEach(function( prop ){


        var obj = '{name:"' + prop.name +'"';



        if (prop.def !== null) {
            obj += ", " + this.PROPERTY_DEFAULT  + ": " + this.source( prop.def )
        }

        if (prop.Type !== null ) {
            obj += ", " +  this.PROPERTY_TYPE + ': "' + this.source( prop.Type ) + '"'
        }

        if (prop.byRef === true) {
            obj += ", " +  this.PARAM_BYREF + ': true'
        }

        obj += "}";

        props.push( obj );

    }, this)

    src +=  props.join(", ")  + '], ' + action.byRef + ', function( ' + this.VARIABLE + ', ctx, $Static ) {\n';

    if (action.stmts !== null ) {
        src += this.stmts( action.stmts );
    }

    src += '})\n';
    this.INSIDE_METHOD = false;
    return src;
};

PHP.Compiler.prototype.Node_Stmt_ClassConst = function( action ) {
    var src = "";

    ((Array.isArray( action.consts[ 0 ] )) ?  action.consts[ 0 ] : action.consts ).forEach(function( constant ){
        src += "." + this.CLASS_CONSTANT + '("' + constant.name + '", ' + this.source( constant.value ) + ")\n"
    }, this);
    return src;

};

PHP.Compiler.prototype.Node_Stmt_Return = function( action ) {
    return "return " + this.source( action.expr );

};