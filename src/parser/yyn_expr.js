/*
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 20.7.2012
* @website http://hertzen.com
 */


PHP.Parser.prototype.Node_Expr_Variable = function( a ) {
    return {
        type: "Node_Expr_Variable",
        name: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };
};

PHP.Parser.prototype.Node_Expr_FuncCall = function() {

    return {
        type: "Node_Expr_FuncCall",
        func: arguments[ 0 ],
        args: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};

PHP.Parser.prototype.Node_Expr_MethodCall = function() {

    return {
        type: "Node_Expr_MethodCall",
        variable: arguments[ 0 ],
        name: arguments[ 1 ],
        args: arguments[ 2 ],
        attributes: arguments[ 3 ]
    };

};

PHP.Parser.prototype.Node_Expr_StaticCall = function() {

    return {
        type: "Node_Expr_StaticCall",
        Class: arguments[ 0 ],
        func: arguments[ 1 ],
        args: arguments[ 2 ],
        attributes: arguments[ 3 ]
    };

};


PHP.Parser.prototype.Node_Expr_Ternary = function() {

    return {
        type: "Node_Expr_Ternary",
        cond: arguments[ 0 ],
        If: arguments[ 1 ],
        Else: arguments[ 2 ],
        attributes: arguments[ 3 ]
    };

};

PHP.Parser.prototype.Node_Expr_AssignList = function() {

    return {
        type: "Node_Expr_AssignList",
        assignList: arguments[ 0 ],
        expr: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};


PHP.Parser.prototype.Node_Expr_Assign = function() {

    return {
        type: "Node_Expr_Assign",
        variable: arguments[ 0 ],
        expr: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};

PHP.Parser.prototype.Node_Expr_AssignConcat = function() {

    return {
        type: "Node_Expr_AssignConcat",
        variable: arguments[ 0 ],
        expr: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};

PHP.Parser.prototype.Node_Expr_AssignMinus = function() {

    return {
        type: "Node_Expr_AssignMinus",
        variable: arguments[ 0 ],
        expr: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};

PHP.Parser.prototype.Node_Expr_AssignPlus = function() {

    return {
        type: "Node_Expr_AssignPlus",
        variable: arguments[ 0 ],
        expr: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};

PHP.Parser.prototype.Node_Expr_AssignDiv = function() {

    return {
        type: "Node_Expr_AssignDiv",
        variable: arguments[ 0 ],
        expr: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};

PHP.Parser.prototype.Node_Expr_AssignRef = function() {

    return {
        type: "Node_Expr_AssignRef",
        variable: arguments[ 0 ],
        refVar: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};

PHP.Parser.prototype.Node_Expr_AssignMul = function() {

    return {
        type: "Node_Expr_AssignMul",
        variable: arguments[ 0 ],
        expr: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};

PHP.Parser.prototype.Node_Expr_AssignMod = function() {

    return {
        type: "Node_Expr_AssignMod",
        variable: arguments[ 0 ],
        expr: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};

PHP.Parser.prototype.Node_Expr_AssignBitwiseAnd = function() {

    return {
        type: "Node_Expr_AssignBitwiseAnd",
        variable: arguments[ 0 ],
        expr: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};

PHP.Parser.prototype.Node_Expr_AssignBitwiseOr = function() {

    return {
        type: "Node_Expr_AssignBitwiseOr",
        variable: arguments[ 0 ],
        expr: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};

PHP.Parser.prototype.Node_Expr_Plus = function() {

    return {
        type: "Node_Expr_Plus",
        left: arguments[ 0 ],
        right: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};

PHP.Parser.prototype.Node_Expr_Minus = function() {

    return {
        type: "Node_Expr_Minus",
        left: arguments[ 0 ],
        right: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};


PHP.Parser.prototype.Node_Expr_Mul = function() {

    return {
        type: "Node_Expr_Mul",
        left: arguments[ 0 ],
        right: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};


PHP.Parser.prototype.Node_Expr_Div = function() {

    return {
        type: "Node_Expr_Div",
        left: arguments[ 0 ],
        right: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};


PHP.Parser.prototype.Node_Expr_Mod = function() {

    return {
        type: "Node_Expr_Mod",
        left: arguments[ 0 ],
        right: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};

PHP.Parser.prototype.Node_Expr_Greater = function() {

    return {
        type: "Node_Expr_Greater",
        left: arguments[ 0 ],
        right: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};

PHP.Parser.prototype.Node_Expr_Equal = function() {

    return {
        type: "Node_Expr_Equal",
        left: arguments[ 0 ],
        right: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};

PHP.Parser.prototype.Node_Expr_NotEqual = function() {

    return {
        type: "Node_Expr_NotEqual",
        left: arguments[ 0 ],
        right: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};


PHP.Parser.prototype.Node_Expr_Identical = function() {

    return {
        type: "Node_Expr_Identical",
        left: arguments[ 0 ],
        right: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};


PHP.Parser.prototype.Node_Expr_NotIdentical = function() {

    return {
        type: "Node_Expr_NotIdentical",
        left: arguments[ 0 ],
        right: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};

PHP.Parser.prototype.Node_Expr_GreaterOrEqual = function() {

    return {
        type: "Node_Expr_GreaterOrEqual",
        left: arguments[ 0 ],
        right: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};

PHP.Parser.prototype.Node_Expr_SmallerOrEqual = function() {

    return {
        type: "Node_Expr_SmallerOrEqual",
        left: arguments[ 0 ],
        right: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};

PHP.Parser.prototype.Node_Expr_Concat = function() {

    return {
        type: "Node_Expr_Concat",
        left: arguments[ 0 ],
        right: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};

PHP.Parser.prototype.Node_Expr_Smaller = function() {

    return {
        type: "Node_Expr_Smaller",
        left: arguments[ 0 ],
        right: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};

PHP.Parser.prototype.Node_Expr_PostInc = function() {

    return {
        type: "Node_Expr_PostInc",
        variable: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };

};

PHP.Parser.prototype.Node_Expr_PostDec = function() {

    return {
        type: "Node_Expr_PostDec",
        variable: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };

};

PHP.Parser.prototype.Node_Expr_PreInc = function() {

    return {
        type: "Node_Expr_PreInc",
        variable: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };

};

PHP.Parser.prototype.Node_Expr_PreDec = function() {

    return {
        type: "Node_Expr_PreDec",
        variable: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };

};

PHP.Parser.prototype.Node_Expr_Include = function() {
    return {
        expr: arguments[ 0 ],
        type: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };
};

PHP.Parser.prototype.Node_Expr_ArrayDimFetch = function() {

    return {
        type: "Node_Expr_ArrayDimFetch",
        variable: arguments[ 0 ],
        dim: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};

PHP.Parser.prototype.Node_Expr_StaticPropertyFetch = function() {

    return {
        type: "Node_Expr_StaticPropertyFetch",
        Class: arguments[ 0 ],
        name: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};

PHP.Parser.prototype.Node_Expr_ClassConstFetch = function() {

    return {
        type: "Node_Expr_ClassConstFetch",
        Class: arguments[ 0 ],
        name: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};


PHP.Parser.prototype.Node_Expr_StaticPropertyFetch = function() {

    return {
        type: "Node_Expr_StaticPropertyFetch",
        Class: arguments[ 0 ],
        name: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};

PHP.Parser.prototype.Node_Expr_ConstFetch = function() {

    return {
        type: "Node_Expr_ConstFetch",
        name: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };

};

PHP.Parser.prototype.Node_Expr_ArrayItem = function() {

    return {
        type: "Node_Expr_ArrayItem",
        value: arguments[ 0 ],
        key: arguments[ 1 ],
        byRef: arguments[ 2 ],
        attributes: arguments[ 3 ]
    };

};

PHP.Parser.prototype.Node_Expr_Array = function() {

    return {
        type: "Node_Expr_Array",
        items: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };

};

PHP.Parser.prototype.Node_Expr_PropertyFetch = function() {

    return {
        type: "Node_Expr_PropertyFetch",
        variable: arguments[ 0 ],
        name: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};

PHP.Parser.prototype.Node_Expr_New = function() {

    return {
        type: "Node_Expr_New",
        Class: arguments[ 0 ],
        args: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};


PHP.Parser.prototype.Node_Expr_Print = function() {
    return {
        type: "Node_Expr_Print",
        expr: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };

};


PHP.Parser.prototype.Node_Expr_Exit = function() {
    return {
        type: "Node_Expr_Exit",
        expr: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };

};


PHP.Parser.prototype.Node_Expr_Cast_Bool = function() {
    return {
        type: "Node_Expr_Cast_Bool",
        expr: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };

};

PHP.Parser.prototype.Node_Expr_Cast_Int = function() {
    return {
        type: "Node_Expr_Cast_Int",
        expr: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };

};

PHP.Parser.prototype.Node_Expr_Cast_String = function() {
    return {
        type: "Node_Expr_Cast_String",
        expr: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };

};

PHP.Parser.prototype.Node_Expr_Cast_Double = function() {
    return {
        type: "Node_Expr_Cast_Double",
        expr: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };

};

PHP.Parser.prototype.Node_Expr_Cast_Array = function() {
    return {
        type: "Node_Expr_Cast_Array",
        expr: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };

};

PHP.Parser.prototype.Node_Expr_Cast_Object = function() {
    return {
        type: "Node_Expr_Cast_Object",
        expr: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };

};


PHP.Parser.prototype.Node_Expr_ErrorSuppress = function() {
    return {
        type: "Node_Expr_ErrorSuppress",
        expr: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };

};


PHP.Parser.prototype.Node_Expr_Isset = function() {
    return {
        type: "Node_Expr_Isset",
        variables: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };

};




PHP.Parser.prototype.Node_Expr_UnaryMinus = function() {
    return {
        type: "Node_Expr_UnaryMinus",
        expr: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };

};


PHP.Parser.prototype.Node_Expr_UnaryPlus = function() {
    return {
        type: "Node_Expr_UnaryPlus",
        expr: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };

};

PHP.Parser.prototype.Node_Expr_Empty = function() {
    return {
        type: "Node_Expr_Empty",
        variable: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };

};

PHP.Parser.prototype.Node_Expr_BooleanOr = function() {
    return {
        type: "Node_Expr_BooleanOr",
        left: arguments[ 0 ],
        right: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};

PHP.Parser.prototype.Node_Expr_LogicalOr = function() {
    return {
        type: "Node_Expr_LogicalOr",
        left: arguments[ 0 ],
        right: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};

PHP.Parser.prototype.Node_Expr_LogicalAnd = function() {
    return {
        type: "Node_Expr_LogicalAnd",
        left: arguments[ 0 ],
        right: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};


PHP.Parser.prototype.Node_Expr_LogicalXor = function() {
    return {
        type: "Node_Expr_LogicalXor",
        left: arguments[ 0 ],
        right: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};

PHP.Parser.prototype.Node_Expr_BitwiseAnd = function() {
    return {
        type: "Node_Expr_BitwiseAnd",
        left: arguments[ 0 ],
        right: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};

PHP.Parser.prototype.Node_Expr_BitwiseOr = function() {
    return {
        type: "Node_Expr_BitwiseOr",
        left: arguments[ 0 ],
        right: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};

PHP.Parser.prototype.Node_Expr_BitwiseXor = function() {
    return {
        type: "Node_Expr_BitwiseXor",
        left: arguments[ 0 ],
        right: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};

PHP.Parser.prototype.Node_Expr_BitwiseNot = function() {
    return {
        type: "Node_Expr_BitwiseNot",
        expr: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };

};

PHP.Parser.prototype.Node_Expr_BooleanNot = function() {
    return {
        type: "Node_Expr_BooleanNot",
        expr: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };

};

PHP.Parser.prototype.Node_Expr_BooleanAnd = function() {
    return {
        type: "Node_Expr_BooleanAnd",
        left: arguments[ 0 ],
        right: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};

PHP.Parser.prototype.Node_Expr_Instanceof = function() {

    return {
        type: "Node_Expr_Instanceof",
        left: arguments[ 0 ],
        right: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};

PHP.Parser.prototype.Node_Expr_Clone = function() {

    return {
        type: "Node_Expr_Clone",
        expr: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };

};
