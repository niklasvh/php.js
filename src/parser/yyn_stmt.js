/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 20.7.2012 
* @website http://hertzen.com
 */


PHP.Parser.prototype.Stmt_Namespace_postprocess = function( a ) {
  return a;  
};


PHP.Parser.prototype.Node_Stmt_Echo = function() {
    return {
        type: "Node_Stmt_Echo",
        exprs: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };  

};


PHP.Parser.prototype.Node_Stmt_If = function() {
    return {
        type: "Node_Stmt_If",
        cond: arguments[ 0 ],
        stmts: arguments[ 1 ].stmts,
        elseifs: arguments[ 1 ].elseifs,
        Else: arguments[ 1 ].Else || null,
        attributes: arguments[ 2 ]
    };  

};


PHP.Parser.prototype.Node_Stmt_For = function() {
    
    return {
        type: "Node_Stmt_For",
        init: arguments[ 0 ].init,
        cond: arguments[ 0 ].cond,
        loop: arguments[ 0 ].loop,
        stmts: arguments[ 0 ].stmts,
        attributes: arguments[ 1 ]
    };   

};

PHP.Parser.prototype.Node_Stmt_Function = function() {
    return {
        type: "Node_Stmt_Function",
        name: arguments[ 0 ],
        byRef: arguments[ 1 ].byRef,
        params: arguments[ 1 ].params,
        stmts: arguments[ 1 ].stmts,
        attributes: arguments[ 2 ]
    };  

};

PHP.Parser.prototype.Stmt_Class_verifyModifier = function() {
  

};

PHP.Parser.prototype.Node_Stmt_Namespace = function() {
    return {
        type: "Node_Stmt_Namespace",
        name: arguments[ 0 ],
        attributes: arguments[ 2 ]
    };  
};

PHP.Parser.prototype.Node_Stmt_Use = function() {
    return {
        type: "Node_Stmt_Use",
        name: arguments[ 0 ],
        attributes: arguments[ 2 ]
    };  
};

PHP.Parser.prototype.Node_Stmt_UseUse = function() {
    return {
        type: "Node_Stmt_UseUse",
        name: arguments[ 0 ],
        as: arguments[1],
        attributes: arguments[ 2 ]
    };  
};

PHP.Parser.prototype.Node_Stmt_TraitUseAdaptation_Precedence = function() {
    return {
        type: "Node_Stmt_TraitUseAdaptation_Precedence",
        name: arguments[ 0 ],
        attributes: arguments[ 2 ]
    };  
};

PHP.Parser.prototype.Node_Stmt_TraitUseAdaptation_Alias = function() {
    return {
        type: "Node_Stmt_TraitUseAdaptation_Alias",
        name: arguments[ 0 ],
        attributes: arguments[ 2 ]
    };  
};

PHP.Parser.prototype.Node_Stmt_Trait = function() {
    return {
        type: "Node_Stmt_Trait",
        name: arguments[ 0 ],
        attributes: arguments[ 2 ]
    };  
};

PHP.Parser.prototype.Node_Stmt_TraitUse = function() {
    return {
        type: "Node_Stmt_TraitUse",
        name: arguments[ 0 ],
        attributes: arguments[ 2 ]
    };  
};

PHP.Parser.prototype.Node_Stmt_Class = function() {
    return {
        type: "Node_Stmt_Class",
        name: arguments[ 0 ],
        Type: arguments[ 1 ].type,
        Extends: arguments[ 1 ].Extends,
        Implements: arguments[ 1 ].Implements,
        stmts: arguments[ 1 ].stmts,
        attributes: arguments[ 2 ]
    };  

};

PHP.Parser.prototype.Node_Stmt_ClassMethod = function() {
    return {
        type: "Node_Stmt_ClassMethod",
        name: arguments[ 0 ],
        Type: arguments[ 1 ].type,
        byRef: arguments[ 1 ].byRef,
        params: arguments[ 1 ].params,
        stmts: arguments[ 1 ].stmts,
        attributes: arguments[ 2 ]
    };  

};


PHP.Parser.prototype.Node_Stmt_ClassConst = function() {
    return {
        type: "Node_Stmt_ClassConst",
        consts: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };  

};

PHP.Parser.prototype.Node_Stmt_Interface = function() {
    return {
        type: "Node_Stmt_Interface",
        name: arguments[ 0 ],
        Extends: arguments[ 1 ].Extends,
        stmts: arguments[ 1 ].stmts,
        attributes: arguments[ 2 ]
    };  

};

PHP.Parser.prototype.Node_Stmt_Throw = function() {
    return {
        type: "Node_Stmt_Throw",
        expr: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };  

};

PHP.Parser.prototype.Node_Stmt_Catch = function() {
    return {
        type: "Node_Stmt_Catch",
        Type: arguments[ 0 ],
        variable: arguments[ 1 ],
        stmts: arguments[ 2 ],
        attributes: arguments[ 3 ]
    };  

};


PHP.Parser.prototype.Node_Stmt_TryCatch = function() {
    return {
        type: "Node_Stmt_TryCatch",
        stmts: arguments[ 0 ],
        catches: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };  

};


PHP.Parser.prototype.Node_Stmt_Foreach = function() {
    return {
        type: "Node_Stmt_Foreach",
        expr: arguments[ 0 ],
        valueVar: arguments[ 1 ],
        keyVar: arguments[ 2 ].keyVar,
        byRef: arguments[ 2 ].byRef,
        stmts: arguments[ 2 ].stmts,
        attributes: arguments[ 3 ]
    };  

};

PHP.Parser.prototype.Node_Stmt_While = function() {
    return {
        type: "Node_Stmt_While",
        cond: arguments[ 0 ],
        stmts: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };  

};

PHP.Parser.prototype.Node_Stmt_Do = function() {
    return {
        type: "Node_Stmt_Do",
        cond: arguments[ 0 ],
        stmts: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };  

};

PHP.Parser.prototype.Node_Stmt_Break = function() {
    return {
        type: "Node_Stmt_Break",
        num: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };  

};

PHP.Parser.prototype.Node_Stmt_Continue = function() {
    return {
        type: "Node_Stmt_Continue",
        num: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };  

};

PHP.Parser.prototype.Node_Stmt_Return = function() {
    return {
        type: "Node_Stmt_Return",
        expr: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };  

};

PHP.Parser.prototype.Node_Stmt_Case = function() {
    return {
        type: "Node_Stmt_Case",
        cond: arguments[ 0 ],
        stmts: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };  

};

PHP.Parser.prototype.Node_Stmt_Switch = function() {
    return {
        type: "Node_Stmt_Switch",
        cond: arguments[ 0 ],
        cases: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };  

};

PHP.Parser.prototype.Node_Stmt_Else = function() {
   
    return {
        type: "Node_Stmt_Else",
        stmts: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };  

};

PHP.Parser.prototype.Node_Stmt_ElseIf = function() {
    return {
        type: "Node_Stmt_ElseIf",
        cond: arguments[ 0 ],
        stmts: arguments[ 1 ],
        attributes: arguments[ 1 ]
    };  

};

PHP.Parser.prototype.Node_Stmt_InlineHTML = function() {
    return {
        type: "Node_Stmt_InlineHTML",
        value: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };  

};


PHP.Parser.prototype.Node_Stmt_StaticVar = function() {
    return {
        type: "Node_Stmt_StaticVar",
        name: arguments[ 0 ],
        def: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };  

};


PHP.Parser.prototype.Node_Stmt_Static = function() {
    return {
        type: "Node_Stmt_Static",
        vars: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };  

};

PHP.Parser.prototype.Node_Stmt_Global = function() {
    return {
        type: "Node_Stmt_Global",
        vars: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };  

};


PHP.Parser.prototype.Node_Stmt_PropertyProperty = function() {
    return {
        type: "Node_Stmt_PropertyProperty",
        name: arguments[ 0 ],
        def: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };  

};


PHP.Parser.prototype.Node_Stmt_Property = function() {
    return {
        type: "Node_Stmt_Property",
        Type: arguments[ 0 ],
        props: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };  

};

PHP.Parser.prototype.Node_Stmt_Unset = function() {
    return {
        type: "Node_Stmt_Unset",
        variables: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };  

};
