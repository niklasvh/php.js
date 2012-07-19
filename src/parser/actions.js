


PHP.Parser.prototype.yyn1 = function () {
    this.yyval =  this.yyastk[ this.stackPos-(1-1) ];
};


PHP.Parser.prototype.yyn2 = function () {

    if (Array.isArray(this.yyastk[this.stackPos-(2-2)])) {
      //  console.log(this.yyastk[this.stackPos-(2-1)], this.yyastk[this.stackPos-(2-2)]);
      //   throw a;
         this.yyval = this.yyastk[this.stackPos-(2-1)].concat(this.yyastk[this.stackPos-(2-2)]); 
        //this.yyval = PHP.Utils.Merge( this.yyastk[this.stackPos-(2-1)], this.yyastk[this.stackPos-(2-2)] );
       
    } else {
        this.yyastk[this.stackPos-(2-1)].push( this.yyastk[this.stackPos-(2-2)] );
        //  this.yyastk[this.stackPos-(2-1)] = PHP.Utils.Merge( this.yyastk[this.stackPos-(2-1)], this.yyastk[this.stackPos-(2-2)]);
        this.yyval = this.yyastk[this.stackPos-(2-1)];
    }

};

PHP.Parser.prototype.yyn3 = function () {
    this.yyval = [];
};

PHP.Parser.prototype.yyn4 = function () {
    this.yyval =  this.yyastk[ this.stackPos-(1-1) ];
};

PHP.Parser.prototype.yyn5 = function () {
    if (!Array.isArray(this.yyastk[ this.stackPos-(3-1) ])) {
        this.yyastk[ this.stackPos-(3-1) ] = [ this.yyastk[ this.stackPos-(3-1) ] ];
    }
    this.yyastk[ this.stackPos-(3-1) ].push( this.yyastk[ this.stackPos-(3-3) ]);
    this.yyval =  this.yyastk[ this.stackPos-(3-1) ];
};

PHP.Parser.prototype.yyn6 = function () {
    this.yyval =  this.yyastk[ this.stackPos-(1-1) ];
};

PHP.Parser.prototype.yyn7 = function () {
    this.yyval =  this.yyastk[ this.stackPos-(1-1) ];
};

PHP.Parser.prototype.yyn8 = function () {
    this.yyval =  this.yyastk[ this.stackPos-(1-1) ];
};

PHP.Parser.prototype.yyn9 = function ( attributes ) {

    // todo add halting code
    this.yyval =  {
        type: "Node_Stmt_HaltCompiler",
        attributes: attributes
    };
    
    this.pos = this.tokens.length;
};


PHP.Parser.prototype.yyn10 = function ( attributes ) {

    this.yyval =  {
        type: "Node_Stmt_Namespace",
        name: {
            parts: this.yyastk[ this.stackPos-(3-2) ],
            type: "Node_Name",
            attributes: attributes
        },
        stmts: [],
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn11 = function ( attributes ) {

    this.yyval =  {
        type: "Node_Stmt_Namespace",
        name: {
            parts: this.yyastk[ this.stackPos-(5-2) ],
            type: "Node_Name",
            attributes: attributes
        },
        stmts: this.yyastk[ this.stackPos-(5-4) ],
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn12 = function ( attributes ) {

    this.yyval =  {
        type: "Node_Stmt_Namespace",
        name: null,
        stmts: this.yyastk[ this.stackPos-(4-3) ],
        attributes: attributes
    };
};


PHP.Parser.prototype.yyn13 = function ( attributes ) {

    this.yyval =  {
        type: "Node_Stmt_Use",
        uses: this.yyastk[ this.stackPos-(3-2) ],
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn15 = function () {
    this.yyastk[ this.stackPos-(3-1) ].push( this.yyastk[ this.stackPos-(3-3) ] );
    this.yyval = this.yyastk[ this.stackPos-(3-1) ];
};

PHP.Parser.prototype.yyn16 = function () {
    this.yyval =  [ this.yyastk[ this.stackPos-(1-1) ] ];
};

PHP.Parser.prototype.yyn17 = function ( attributes ) {

    this.yyval =  {
        type: "Node_Stmt_UseUse",
        name: {
            parts: this.yyastk[ this.stackPos-(1-1) ],
            type: "Node_Name",
            attributes: attributes
        },
        alias: null,
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn18 = function ( attributes ) {

    this.yyval =  {
        type: "Node_Stmt_UseUse",
        name: {
            parts: this.yyastk[ this.stackPos-(3-1) ],
            type: "Node_Name",
            attributes: attributes
        },
        alias: this.yyastk[ this.stackPos-(3-3) ],
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn19 = function ( attributes ) {

    this.yyval =  {
        type: "Node_Stmt_UseUse",
        name: {
            parts: this.yyastk[ this.stackPos-(2-2) ],
            type: "Node_Name",
            attributes: attributes
        },
        alias: null,
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn20 = function ( attributes ) {

    this.yyval =  {
        type: "Node_Stmt_UseUse",
        name: {
            parts: this.yyastk[ this.stackPos-(4-2) ],
            type: "Node_Name",
            attributes: attributes
        },
        alias: this.yyastk[ this.stackPos-(4-4) ],
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn21 = function () {
    this.yyastk[ this.stackPos-(3-1) ].push( this.yyastk[ this.stackPos-(3-3) ] );
    this.yyval =  [ this.yyastk[ this.stackPos-(3-1) ] ];
};

PHP.Parser.prototype.yyn22 = function () {
    this.yyval =  [ this.yyastk[ this.stackPos-(1-1) ] ];
};

PHP.Parser.prototype.yyn23 = function ( attributes ) {

    this.yyval =  {
        type: "Node_Const",
        name: this.yyastk[ this.stackPos-(3-1) ],
        value: this.yyastk[ this.stackPos-(3-3) ],
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn24 = function () {
    if (Array.isArray(this.yyastk[this.stackPos-(2-2)])) {
        this.yyval = this.yyastk[this.stackPos-(2-1)].concat( this.yyastk[this.stackPos-(2-2)] );
    } else {
        this.yyastk[this.stackPos-(2-1)].push( this.yyastk[this.stackPos-(2-2)] );
        this.yyval = this.yyastk[this.stackPos-(2-1)];
    }

};

PHP.Parser.prototype.yyn25 = function () {
    this.yyval =  [];
};

PHP.Parser.prototype.yyn26 = function () {
    this.yyval =  this.yyastk[ this.stackPos-(1-1) ];
};

PHP.Parser.prototype.yyn27 = function () {
    this.yyval =  this.yyastk[ this.stackPos-(1-1) ];
};

PHP.Parser.prototype.yyn28 = function () {
    this.yyval =  this.yyastk[ this.stackPos-(1-1) ];
};

PHP.Parser.prototype.yyn29 = function () {
    throw new Error('__halt_compiler() can only be used from the outermost scope');
};

PHP.Parser.prototype.yyn30 = function () {
    this.yyval =  this.yyastk[ this.stackPos-(3-2) ];
};

PHP.Parser.prototype.yyn31 = function ( attributes ) {

    this.yyval =  {
        type: "Node_Stmt_If",
        cond: this.yyastk[ this.stackPos-(7-3) ],
        stmts: (Array.isArray(this.yyastk[ this.stackPos-(7-5)])) ? this.yyastk[ this.stackPos-(7-5) ] : [ this.yyastk[ this.stackPos-(7-5) ] ],
        elseifs: this.yyastk[ this.stackPos-(7-6) ],
        Else: this.yyastk[ this.stackPos-(7-7) ],
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn32 = function ( attributes ) {

    this.yyval =  {
        type: "Node_Stmt_If",
        cond: this.yyastk[ this.stackPos-(10-3) ],
        stmts: this.yyastk[ this.stackPos-(10-6) ],
        elseifs: this.yyastk[ this.stackPos-(10-7) ],
        Else: this.yyastk[ this.stackPos-(10-8) ],
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn33 = function ( attributes ) {

    this.yyval =  {
        type: "Node_Stmt_While",
        cond: this.yyastk[ this.stackPos-(5-3) ],
        stmts: this.yyastk[ this.stackPos-(5-5) ],
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn34 = function ( attributes ) {

    this.yyval =  {
        type: "Node_Stmt_Do",
        stmts: Array.isArray( this.yyastk[ this.stackPos-(7-2) ] ) ? this.yyastk[ this.stackPos-(7-2) ] : [ this.yyastk[ this.stackPos-(7-2) ] ],
        cond: this.yyastk[ this.stackPos-(7-5) ],
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn35 = function ( attributes ) {

    this.yyval =  {
        type: "Node_Stmt_For",
        init: this.yyastk[ this.stackPos-(9-3) ],
        cond: this.yyastk[ this.stackPos-(9-5) ],
        loop: this.yyastk[ this.stackPos-(9-7) ],
        stmts: this.yyastk[ this.stackPos-(9-9) ],
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn36 = function ( attributes ) {

    this.yyval =  {
        type: "Node_Stmt_Switch",
        cond: this.yyastk[ this.stackPos-(5-3) ],
        cases: this.yyastk[ this.stackPos-(5-5) ],
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn37 = function ( attributes ) {

    this.yyval =  {
        type: "Node_Stmt_Break",
        num: null,
        attributes: attributes
    };
};


PHP.Parser.prototype.yyn38 = function ( attributes ) {

    this.yyval =  {
        type: "Node_Stmt_Break",
        num: this.yyastk[ this.stackPos-(3-2) ],
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn39 = function ( attributes ) {

    this.yyval =  {
        type: "Node_Stmt_Continue",
        num: this.yyastk[ this.stackPos-(3-2) ],
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn40 = function ( attributes ) {

    this.yyval =  {
        type: "Node_Stmt_Continue",
        num: this.yyastk[ this.stackPos-(3-2) ],
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn41 = function ( attributes ) {

    this.yyval =  {
        type: "Node_Stmt_Return",
        expr: null,
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn42 = function ( attributes ) {

    this.yyval =  {
        type: "Node_Stmt_Return",
        expr: this.yyastk[ this.stackPos-(3-2) ],
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn43 = function ( attributes ) {

    this.yyval =  {
        type: "Node_Stmt_Global",
        vars: this.yyastk[ this.stackPos-(3-2) ],
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn44 = function ( attributes ) {

    this.yyval =  {
        type: "Node_Stmt_Static",
        vars: this.yyastk[ this.stackPos-(3-2) ],
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn45 = function ( attributes ) {

    this.yyval =  {
        type: "Node_Stmt_Echo",
        exprs: this.yyastk[ this.stackPos-(3-2) ],
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn46 = function ( attributes ) {

    this.yyval =  {
        type: "Node_Stmt_InlineHTML",
        value: this.yyastk[ this.stackPos-(1-1) ],
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn47 = function () {
    this.yyval = this.yyastk[this.stackPos-(2-1)];
};

PHP.Parser.prototype.yyn48 = function ( attributes ) {

    this.yyval =  {
        type: "Node_Stmt_Unset",
        variables: this.yyastk[ this.stackPos-(5-3) ],
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn49 = function ( attributes ) {

    this.yyval =  {
        type: "Node_Stmt_Foreach",
        expr: this.yyastk[ this.stackPos-(7-3) ],
        valueVar: this.yyastk[ this.stackPos-(7-5) ],
        keyVar: null,
        byRef: false,
        stmts: this.yyastk[ this.stackPos-(7-7) ],
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn50 = function ( attributes ) {

    this.yyval =  {
        type: "Node_Stmt_Foreach",
        expr: this.yyastk[ this.stackPos-(8-3) ],
        valueVar: this.yyastk[ this.stackPos-(8-6) ],
        keyVar: null,
        byRef: true,
        stmts: this.yyastk[ this.stackPos-(8-8) ],
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn51 = function ( attributes ) {

    this.yyval =  {
        type: "Node_Stmt_Foreach",
        expr: this.yyastk[ this.stackPos-(10-3) ],
        valueVar: this.yyastk[ this.stackPos-(10-8) ],
        keyVar: this.yyastk[ this.stackPos-(10-5) ],
        byRef: this.yyastk[ this.stackPos-(10-7) ],
        stmts: this.yyastk[ this.stackPos-(10-10) ],
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn52 = function ( attributes ) {

    this.yyval =  {
        type: "Node_Stmt_Declare",
        declares: this.yyastk[ this.stackPos-(5-3) ],
        stmts: this.yyastk[ this.stackPos-(5-5) ],
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn53 = function () {
    this.yyval = [];
};

PHP.Parser.prototype.yyn54 = function ( attributes ) {

    this.yyval =  {
        type: "Node_Stmt_TryCatch",
        stmts: this.yyastk[ this.stackPos-(5-3) ],
        catches: this.yyastk[ this.stackPos-(5-5) ],
        attributes: attributes
    };

};

PHP.Parser.prototype.yyn55 = function ( attributes ) {

    this.yyval =  {
        type: "Node_Stmt_Throw",
        expr: this.yyastk[ this.stackPos-(3-2) ],
        attributes: attributes
    };

};

PHP.Parser.prototype.yyn56 = function ( attributes ) {

    this.yyval =  {
        type: "Node_Stmt_Goto",
        name: this.yyastk[ this.stackPos-(3-2) ],
        attributes: attributes
    };

};

PHP.Parser.prototype.yyn57 = function ( attributes ) {

    this.yyval =  {
        type: "Node_Stmt_Label",
        name: this.yyastk[ this.stackPos-(2-1) ],
        attributes: attributes
    };

};

PHP.Parser.prototype.yyn58 = function () {
    this.yyval = [ this.yyastk[this.stackPos-(1-1)] ];
};

PHP.Parser.prototype.yyn59 = function () {
    this.yyastk[this.stackPos-(2-1)].push( this.yyastk[this.stackPos-(2-2)] );
    this.yyval = this.yyastk[this.stackPos-(2-1)];
};

PHP.Parser.prototype.yyn60 = function ( attributes ) {

    this.yyval =  {
        type: "Node_Stmt_Catch",
        Type: this.yyastk[ this.stackPos-(8-3) ],
        variable: this.yyastk[ this.stackPos-(8-4) ].substring(1),
        stmts: this.yyastk[ this.stackPos-(8-7) ],
        attributes: attributes
    };

};

PHP.Parser.prototype.yyn61 = function () {
    this.yyval = [ this.yyastk[this.stackPos-(1-1)] ];
};

PHP.Parser.prototype.yyn62 = function () {
    this.yyastk[this.stackPos-(3-1)].push( this.yyastk[this.stackPos-(3-3)] );
    this.yyval = this.yyastk[this.stackPos-(3-1)];
};

PHP.Parser.prototype.yyn63 = function () {
    this.yyval = false;
};

PHP.Parser.prototype.yyn64 = function () {
    this.yyval = true;
};

PHP.Parser.prototype.yyn65 = function ( attributes ) {

    this.yyval =  {
        type: "Node_Stmt_Function",
        byRef: this.yyastk[ this.stackPos-(9-2) ],
        name: this.yyastk[ this.stackPos-(9-3) ],
        params: this.yyastk[ this.stackPos-(9-5) ],
        stmts: this.yyastk[ this.stackPos-(9-8) ],
        attributes: attributes
    };

};

PHP.Parser.prototype.yyn66 = function ( attributes ) {

    this.yyval =  {
        type: "Node_Stmt_Class",
        Type: this.yyastk[ this.stackPos-(7-1) ],
        name: this.yyastk[ this.stackPos-(7-2) ],
        Extends: this.yyastk[ this.stackPos-(7-3) ],
        Implements: this.yyastk[ this.stackPos-(7-4) ],
        stmts: this.yyastk[ this.stackPos-(7-6) ],
        attributes: attributes
    };

};

PHP.Parser.prototype.yyn67 = function ( attributes ) {

    this.yyval =  {
        type: "Node_Stmt_Interface",
        name: this.yyastk[ this.stackPos-(6-2) ],
        Extends: this.yyastk[ this.stackPos-(6-3) ],
        stmts: this.yyastk[ this.stackPos-(6-5) ],
        attributes: attributes
    };

};

PHP.Parser.prototype.yyn69 = function () {
    this.yyval = 0;
};

PHP.Parser.prototype.yyn70 = function () {
    this.yyval = this.MODIFIER_ABSTRACT;
};

PHP.Parser.prototype.yyn71 = function () {
    this.yyval = this.MODIFIER_FINAL;
};

PHP.Parser.prototype.yyn72 = function () {
    this.yyval = null;
};

PHP.Parser.prototype.yyn73 = function () {
    this.yyval = this.yyastk[this.stackPos-(2-2)];
};

PHP.Parser.prototype.yyn74 = function () {
    this.yyval = [];
};

PHP.Parser.prototype.yyn75 = function () {
    this.yyval = this.yyastk[this.stackPos-(2-2)];
};

PHP.Parser.prototype.yyn76 = function () {
    this.yyval = [];
};

PHP.Parser.prototype.yyn77 = function () {
    this.yyval = this.yyastk[this.stackPos-(2-2)];
};

PHP.Parser.prototype.yyn78 = function () {
    this.yyval = [ this.yyastk[this.stackPos-(1-1)] ];
};

PHP.Parser.prototype.yyn79 = function () {
    this.yyastk[this.stackPos-(3-1)].push( this.yyastk[this.stackPos-(3-3)] );
    this.yyval = [ this.yyastk[this.stackPos-(3-1)] ];
};

PHP.Parser.prototype.yyn80 = function () {
    this.yyval = this.MakeArray( this.yyastk[this.stackPos-(1-1)] );
};

PHP.Parser.prototype.yyn81 = function () {
    this.yyval = this.yyastk[this.stackPos-(4-2)];
};

PHP.Parser.prototype.yyn82 = function () {
    this.yyval = this.MakeArray( this.yyastk[this.stackPos-(1-1)] );
};

PHP.Parser.prototype.yyn83 = function () {
    this.yyval = this.yyastk[this.stackPos-(4-2)];
};

PHP.Parser.prototype.yyn84 = function () {
    this.yyval = this.MakeArray( this.yyastk[this.stackPos-(1-1)] );
};

PHP.Parser.prototype.yyn85 = function () {
    this.yyval = this.yyastk[this.stackPos-(4-2)];
};

PHP.Parser.prototype.yyn86 = function () {
    this.yyval = [ this.yyastk[this.stackPos-(1-1)] ];
};

PHP.Parser.prototype.yyn88 = function ( attributes ) {

    this.yyval =  {
        type: "Node_Stmt_DeclareDeclare",
        key: this.yyastk[ this.stackPos-(3-1) ],
        value: this.yyastk[ this.stackPos-(3-3) ],
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn89 = function () {
    this.yyval = this.yyastk[this.stackPos-(3-2)];
};

PHP.Parser.prototype.yyn90 = function () {
    this.yyval = this.yyastk[this.stackPos-(4-3)];
};

PHP.Parser.prototype.yyn91 = function () {
    this.yyval = this.yyastk[this.stackPos-(4-2)];
};

PHP.Parser.prototype.yyn92 = function () {
    this.yyval = this.yyastk[this.stackPos-(5-3)];
};

PHP.Parser.prototype.yyn93 = function () {
    this.yyval = [];
};

PHP.Parser.prototype.yyn94 = function () {
    this.yyastk[this.stackPos-(2-1)].push( this.yyastk[this.stackPos-(2-2)] );
    this.yyval = this.yyastk[this.stackPos-(2-1)];
};

PHP.Parser.prototype.yyn95 = function ( attributes ) {

    this.yyval =  {
        type: "Node_Stmt_Case",
        cond: this.yyastk[ this.stackPos-(4-2) ],
        stmts: this.yyastk[ this.stackPos-(4-4) ],
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn96 = function ( attributes ) {

    this.yyval =  {
        type: "Node_Stmt_Case",
        cond: null,
        stmts: this.yyastk[ this.stackPos-(3-3) ],
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn97 = function () {
    this.yyval = this.yyastk[this.stackPos];
};

PHP.Parser.prototype.yyn98 = function () {
    this.yyval = this.yyastk[this.stackPos];
};

PHP.Parser.prototype.yyn99 = function () {
    this.yyval = Array.isArray( this.yyastk[this.stackPos-(1-1)] ) ? this.yyastk[this.stackPos-(1-1)] : [ this.yyastk[this.stackPos-(1-1)] ];
};

PHP.Parser.prototype.yyn100 = function () {
    this.yyval = this.yyastk[this.stackPos-(4-2)];
};

PHP.Parser.prototype.yyn101 = function () {
    this.yyval = [];
};

PHP.Parser.prototype.yyn102 = function () {
    this.yyastk[this.stackPos-(2-1)].push( this.yyastk[this.stackPos-(2-2)] );
    this.yyval = this.yyastk[this.stackPos-(2-1)];
};

PHP.Parser.prototype.yyn103 = function ( attributes ) {
    this.yyval =  {
        type: "Node_Stmt_ElseIf",
        cond: this.yyastk[this.stackPos-(5-3)],
        stmts: Array.isArray( this.yyastk[ this.stackPos-(5-5) ] ) ? this.yyastk[ this.stackPos-(5-5) ] : [ this.yyastk[ this.stackPos-(5-5) ] ],
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn104 = function () {
    this.yyval = [];
};

PHP.Parser.prototype.yyn106 = function ( attributes ) {
    this.yyval =  {
        type: "Node_Stmt_ElseIf",
        cond: this.yyastk[this.stackPos-(6-3)],
        stmts: this.yyastk[this.stackPos-(6-6)],
        attributes: attributes
    };
};


PHP.Parser.prototype.yyn107 = function () {
    this.yyval = null;
};

PHP.Parser.prototype.yyn108 = function ( attributes ) {
    this.yyval =  {
        type: "Node_Stmt_Else",
        stmts: Array.isArray( this.yyastk[ this.stackPos-(2-2) ] ) ? this.yyastk[ this.stackPos-(2-2) ] : [ this.yyastk[ this.stackPos-(2-2) ] ],
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn109 = function () {
    this.yyval = null;
};

PHP.Parser.prototype.yyn110 = function ( attributes ) {
    this.yyval =  {
        type: "Node_Stmt_Else",
        stmts: this.yyastk[ this.stackPos-(3-3) ],
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn109 = function () {
    this.yyval = null;
};

PHP.Parser.prototype.yyn111 = function () {
    this.yyval = this.yyastk[this.stackPos-(1-1)];
};

PHP.Parser.prototype.yyn112 = function () {
    this.yyval = [];
};

PHP.Parser.prototype.yyn113 = function () {
    this.yyval = [ this.yyastk[this.stackPos-(1-1)] ];
};

PHP.Parser.prototype.yyn114 = function () {

    if (Array.isArray(this.yyastk[this.stackPos-(3-1)][0])) {
        this.yyastk[this.stackPos-(3-1)][0].push( this.yyastk[this.stackPos-(3-3)] );
        this.yyval = [ this.yyastk[this.stackPos-(3-1)] ][0];
    } else {
        this.yyastk[this.stackPos-(3-1)].push( this.yyastk[this.stackPos-(3-3)] );
        this.yyval = [ this.yyastk[this.stackPos-(3-1)] ];
    }

};

PHP.Parser.prototype.yyn115 = function ( attributes ) {

    this.yyval =  {
        type: "Node_Param",
        def: null,
        Type: this.yyastk[ this.stackPos-(3-1) ],
        byRef: this.yyastk[ this.stackPos-(3-2) ],
        name: this.yyastk[ this.stackPos-(3-3) ].substring(1),
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn116 = function ( attributes ) {

    this.yyval =  {
        type: "Node_Param",
        def: this.yyastk[ this.stackPos-(5-5) ],
        Type: this.yyastk[ this.stackPos-(5-1) ],
        byRef: this.yyastk[ this.stackPos-(5-2) ],
        name: this.yyastk[ this.stackPos-(5-3) ].substring(1),
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn117 = function () {
    this.yyval = null;
};

PHP.Parser.prototype.yyn118 = function () {
    this.yyval = this.yyastk[this.stackPos-(1-1)];
};

PHP.Parser.prototype.yyn119 = function () {
    this.yyval = 'array';
};

PHP.Parser.prototype.yyn120 = function () {
    this.yyval = 'callable';
};

PHP.Parser.prototype.yyn121 = function () {
    this.yyval = this.yyastk[this.stackPos-(1-1)];
};

PHP.Parser.prototype.yyn122 = function () {
    this.yyval = [];
};

PHP.Parser.prototype.yyn123 = function () {
    this.yyval = [ this.yyastk[this.stackPos-(1-1)] ];
};

PHP.Parser.prototype.yyn124 = function () {
    this.yyastk[this.stackPos-(3-1)].push( this.yyastk[this.stackPos-(3-3)] );

    this.yyval =  this.yyastk[this.stackPos-(3-1)] ;
};

PHP.Parser.prototype.yyn125 = function ( attributes ) {

    this.yyval =  {
        type: "Node_Arg",
        byRef: false,
        value: this.yyastk[ this.stackPos-(1-1) ],
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn126 = function ( attributes ) {

    this.yyval =  {
        type: "Node_Arg",
        byRef: true,
        value: this.yyastk[ this.stackPos-(2-2) ],
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn127 = function () {
    this.yyastk[this.stackPos-(3-1)].push(this.yyastk[this.stackPos-(3-3)]);
    this.yyval = [ this.yyastk[this.stackPos-(3-1)] ];
};

PHP.Parser.prototype.yyn128 = function () {
    this.yyval = [ this.yyastk[this.stackPos-(1-1)] ];
};

PHP.Parser.prototype.yyn129 = function ( attributes ) {
    this.yyval =  {
        name: this.yyastk[this.stackPos-(1-1)].substring(1),
        type: "Node_Expr_Variable",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn130 = function ( attributes ) {
    this.yyval =  {
        name: this.yyastk[this.stackPos-(2-2)],
        type: "Node_Expr_Variable",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn131 = function ( attributes ) {
    this.yyval =  {
        name: this.yyastk[this.stackPos-(4-3)],
        type: "Node_Expr_Variable",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn132 = function () {
    this.yyastk[this.stackPos-(3-1)].push( this.yyastk[this.stackPos-(3-3)] );
    this.yyval = this.yyastk[this.stackPos-(3-1)];
};

PHP.Parser.prototype.yyn133 = function () {
    this.yyval = [ this.yyastk[this.stackPos-(1-1)] ];
};

PHP.Parser.prototype.yyn134 = function ( attributes ) {
    this.yyval =  {
        name: this.yyastk[this.stackPos-(1-1)].substring(1),
        def: null,
        type: "Node_Stmt_StaticVar",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn135 = function ( attributes ) {
    this.yyval =  {
        name: this.yyastk[this.stackPos-(3-1)].substring(1),
        def: this.yyastk[this.stackPos-(3-3)],
        type: "Node_Stmt_StaticVar",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn136 = function () {
    this.yyastk[ this.stackPos-(2-1) ].push( this.yyastk[ this.stackPos-(2-2) ] );
    this.yyval = this.yyastk[ this.stackPos-(2-1) ];
};

PHP.Parser.prototype.yyn137 = function () {
    this.yyval = [];
};

PHP.Parser.prototype.yyn138 = function ( attributes ) {

    this.yyval =  {
        type: "Node_Stmt_Property",
        Type: this.yyastk[ this.stackPos-(3-1) ],
        props: this.yyastk[ this.stackPos-(3-2) ],
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn139 = function ( attributes ) {

    this.yyval =  {
        type: "Node_Stmt_ClassConst",
        consts: this.yyastk[ this.stackPos-(3-2) ],
        attributes: attributes
    };
};


PHP.Parser.prototype.yyn140 = function ( attributes ) {

    this.yyval =  {
        type: "Node_Stmt_ClassMethod",
        Type: this.yyastk[ this.stackPos-(8-1) ],
        byRef: this.yyastk[ this.stackPos-(8-3) ],
        name: this.yyastk[ this.stackPos-(8-4) ],
        params: this.yyastk[ this.stackPos-(8-6) ],
        stmts: this.yyastk[ this.stackPos-(8-8) ],
        attributes: attributes
    };

};

PHP.Parser.prototype.yyn142 = function () {
    this.yyval = [];
};

PHP.Parser.prototype.yyn143 = function () {
    this.yyval =  this.yyastk[ this.stackPos-(3-2) ];
};

PHP.Parser.prototype.yyn144 = function () {
    this.yyval = [];
};

PHP.Parser.prototype.yyn150 = function () {
    this.yyval = [ this.yyastk[ this.stackPos-(3-1) ], this.yyastk[ this.stackPos-(3-3) ] ];
};

PHP.Parser.prototype.yyn151 = function () {
    this.yyval = this.yyastk[ this.stackPos-(1-1) ];
};

PHP.Parser.prototype.yyn152 = function () {
    this.yyval = [ null, this.yyastk[ this.stackPos-(1-1) ] ];
};

PHP.Parser.prototype.yyn153 = function () {
    this.yyval = null;
};

PHP.Parser.prototype.yyn154 = function () {
    this.yyval = this.yyastk[ this.stackPos-(3-2) ];
};

PHP.Parser.prototype.yyn155 = function () {
    this.yyval = this.yyastk[ this.stackPos-(1-1) ];
};

PHP.Parser.prototype.yyn156 = function () {
    this.yyval = this.MODIFIER_PUBLIC;
};

PHP.Parser.prototype.yyn157 = function () {
    this.yyval = this.MODIFIER_PUBLIC;
};

PHP.Parser.prototype.yyn158 = function () {
    this.yyval = [ this.yyastk[ this.stackPos-(1-1) ] ];
};

PHP.Parser.prototype.yyn159 = function () {
    this.yyval = [ this.yyastk[ this.stackPos-(1-1) ] ];
};

PHP.Parser.prototype.yyn160 = function () {

    var a = this.yyastk[ this.stackPos-(2-1) ],
    b = this.yyastk[ this.stackPos-(2-2) ];

    if (a & 7 && b & 7) {
        throw new Error('Multiple access type modifiers are not allowed');
    }

    if (a & this.MODIFIER_ABSTRACT && b & this.MODIFIER_ABSTRACT) {
        throw new Error('Multiple abstract modifiers are not allowed');
    }

    if (a & this.MODIFIER_STATIC && b & this.MODIFIER_STATIC) {
        throw new Error('Multiple static modifiers are not allowed');
    }

    if (a & this.MODIFIER_FINAL && b & this.MODIFIER_FINAL) {
        throw new Error('Multiple final modifiers are not allowed');
    }
/*
    if (a & 48 && b & 48) {
        throw new Error('Cannot use the final and abstract modifier at the same time');
    }
*/
    this.yyval =  a | b;
};

PHP.Parser.prototype.yyn161 = function () {
    this.yyval = this.MODIFIER_PUBLIC;
};

PHP.Parser.prototype.yyn162 = function () {
    this.yyval = this.MODIFIER_PROTECTED;
};

PHP.Parser.prototype.yyn163 = function () {
    this.yyval = this.MODIFIER_PRIVATE;
};

PHP.Parser.prototype.yyn164 = function () {
    this.yyval = this.MODIFIER_STATIC;
};

PHP.Parser.prototype.yyn165 = function () {
    this.yyval = this.MODIFIER_ABSTRACT;
};

PHP.Parser.prototype.yyn166 = function () {
    this.yyval = this.MODIFIER_FINAL;
};

PHP.Parser.prototype.yyn167 = function () {
    this.yyval = [ this.yyastk[ this.stackPos-(1-1) ] ];
};

PHP.Parser.prototype.yyn168 = function () {
    this.yyastk[ this.stackPos-(3-1) ].push(this.yyastk[ this.stackPos-(3-3) ]);
    this.yyval = this.yyastk[ this.stackPos-(3-1) ];
};

PHP.Parser.prototype.yyn169 = function ( attributes ) {
    this.yyval =  {
        name: this.yyastk[this.stackPos-(1-1)].substring(1),
        def: null,
        type: "Node_Stmt_PropertyProperty",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn170 = function ( attributes ) {
    this.yyval =  {
        name: this.yyastk[this.stackPos-(3-1)].substring(1),
        def: this.yyastk[this.stackPos-(3-3)],
        type: "Node_Stmt_PropertyProperty",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn171 = function () {
    if (!Array.isArray(this.yyastk[ this.stackPos-(3-1) ])) {
        this.yyastk[ this.stackPos-(3-1) ] = [ this.yyastk[ this.stackPos-(3-1) ] ];
    }

    this.yyastk[ this.stackPos-(3-1) ].push( this.yyastk[ this.stackPos-(3-3) ] );
    this.yyval =  this.yyastk[ this.stackPos-(3-1) ];
};

PHP.Parser.prototype.yyn172 = function () {
    this.yyval =  this.yyastk[ this.stackPos-(1-1) ];
};

PHP.Parser.prototype.yyn173 = function () {
    this.yyval =  [];
};

PHP.Parser.prototype.yyn174 = function () {
    this.yyval =  this.yyastk[ this.stackPos-(1-1) ];
};

PHP.Parser.prototype.yyn175 = function () {
    this.yyval =  this.yyastk[ this.stackPos-(1-1) ];
};

PHP.Parser.prototype.yyn176 = function ( attributes ) {
    this.yyval =  {
        assignList: this.yyastk[this.stackPos-(6-3)],
        expr: this.yyastk[this.stackPos-(6-6)],
        type: "Node_Expr_AssignList",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn177 = function ( attributes ) {
    this.yyval =  {
        variable: this.yyastk[this.stackPos-(3-1)],
        expr: this.yyastk[this.stackPos-(3-3)],
        type: "Node_Expr_Assign",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn178 = function ( attributes ) {
    this.yyval =  {
        variable: this.yyastk[this.stackPos-(4-1)],
        refVar: this.yyastk[this.stackPos-(4-4)],
        type: "Node_Expr_AssignRef",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn179 = function ( attributes ) {
    this.yyval =  {
        variable: this.yyastk[this.stackPos-(4-1)],
        refVar: this.yyastk[this.stackPos-(4-4)],
        type: "Node_Expr_Assign",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn180 = function () {
    this.yyval =  this.yyastk[ this.stackPos-(1-1) ];
};

PHP.Parser.prototype.yyn181 = function ( attributes ) {
    this.yyval =  {
        expr: this.yyastk[this.stackPos-(2-2)],
        type: "Node_Expr_Clone",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn182 = function ( attributes ) {
    this.yyval =  {
        variable: this.yyastk[this.stackPos-(3-1)],
        expr: this.yyastk[this.stackPos-(3-3)],
        type: "Node_Expr_AssignPlus",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn183 = function ( attributes ) {
    this.yyval =  {
        variable: this.yyastk[this.stackPos-(3-1)],
        expr: this.yyastk[this.stackPos-(3-3)],
        type: "Node_Expr_AssignMinus",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn184 = function ( attributes ) {
    this.yyval =  {
        variable: this.yyastk[this.stackPos-(3-1)],
        expr: this.yyastk[this.stackPos-(3-3)],
        type: "Node_Expr_AssignMul",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn185 = function ( attributes ) {
    this.yyval =  {
        variable: this.yyastk[this.stackPos-(3-1)],
        expr: this.yyastk[this.stackPos-(3-3)],
        type: "Node_Expr_AssignDiv",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn186 = function ( attributes ) {
    this.yyval =  {
        variable: this.yyastk[this.stackPos-(3-1)],
        expr: this.yyastk[this.stackPos-(3-3)],
        type: "Node_Expr_AssignConcat",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn187 = function ( attributes ) {
    this.yyval =  {
        variable: this.yyastk[this.stackPos-(3-1)],
        expr: this.yyastk[this.stackPos-(3-3)],
        type: "Node_Expr_AssignMod",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn188 = function ( attributes ) {
    this.yyval =  {
        variable: this.yyastk[this.stackPos-(3-1)],
        expr: this.yyastk[this.stackPos-(3-3)],
        type: "Node_Expr_AssignBitwiseAnd",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn189 = function ( attributes ) {
    this.yyval =  {
        variable: this.yyastk[this.stackPos-(3-1)],
        expr: this.yyastk[this.stackPos-(3-3)],
        type: "Node_Expr_AssignBitwiseOr",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn190 = function ( attributes ) {
    this.yyval =  {
        variable: this.yyastk[this.stackPos-(3-1)],
        expr: this.yyastk[this.stackPos-(3-3)],
        type: "Node_Expr_AssignBitwiseXor",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn191 = function ( attributes ) {
    this.yyval =  {
        variable: this.yyastk[this.stackPos-(3-1)],
        expr: this.yyastk[this.stackPos-(3-3)],
        type: "Node_Expr_AssignShiftLeft",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn192 = function ( attributes ) {
    this.yyval =  {
        variable: this.yyastk[this.stackPos-(3-1)],
        expr: this.yyastk[this.stackPos-(3-3)],
        type: "Node_Expr_AssignShiftRight",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn193 = function ( attributes ) {
    this.yyval =  {
        variable: this.yyastk[this.stackPos-(2-1)],
        type: "Node_Expr_PostInc",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn194 = function ( attributes ) {
    this.yyval =  {
        variable: this.yyastk[this.stackPos-(2-2)],
        type: "Node_Expr_PreInc",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn195 = function ( attributes ) {
    this.yyval =  {
        variable: this.yyastk[this.stackPos-(2-1)],
        type: "Node_Expr_PostDec",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn196 = function ( attributes ) {
    this.yyval =  {
        variable: this.yyastk[this.stackPos-(2-2)],
        type: "Node_Expr_PreDec",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn197 = function ( attributes ) {
    this.yyval =  {
        left: this.yyastk[this.stackPos-(3-1)],
        right: this.yyastk[this.stackPos-(3-3)],
        type: "Node_Expr_BooleanOr",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn198 = function ( attributes ) {
    this.yyval =  {
        left: this.yyastk[this.stackPos-(3-1)],
        right: this.yyastk[this.stackPos-(3-3)],
        type: "Node_Expr_BooleanAnd",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn199 = function ( attributes ) {
    this.yyval =  {
        left: this.yyastk[this.stackPos-(3-1)],
        right: this.yyastk[this.stackPos-(3-3)],
        type: "Node_Expr_LogicalOr",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn200 = function ( attributes ) {
    this.yyval =  {
        left: this.yyastk[this.stackPos-(3-1)],
        right: this.yyastk[this.stackPos-(3-3)],
        type: "Node_Expr_LogicalAnd",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn201 = function ( attributes ) {
    this.yyval =  {
        left: this.yyastk[this.stackPos-(3-1)],
        right: this.yyastk[this.stackPos-(3-3)],
        type: "Node_Expr_LogicalXor",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn202 = function ( attributes ) {
    this.yyval =  {
        left: this.yyastk[this.stackPos-(3-1)],
        right: this.yyastk[this.stackPos-(3-3)],
        type: "Node_Expr_BitwiseOr",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn203 = function ( attributes ) {
    this.yyval =  {
        left: this.yyastk[this.stackPos-(3-1)],
        right: this.yyastk[this.stackPos-(3-3)],
        type: "Node_Expr_BitwiseAnd",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn204 = function ( attributes ) {
    this.yyval =  {
        left: this.yyastk[this.stackPos-(3-1)],
        right: this.yyastk[this.stackPos-(3-3)],
        type: "Node_Expr_BitwiseXor",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn205 = function ( attributes ) {
    // todo add parse escape sequence
    this.yyval =  {
        left: this.yyastk[this.stackPos-(3-1)],
        right: this.yyastk[this.stackPos-(3-3)],
        type: "Node_Expr_Concat",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn206 = function ( attributes ) {
    this.yyval =  {
        left: this.yyastk[this.stackPos-(3-1)],
        right: this.yyastk[this.stackPos-(3-3)],
        type: "Node_Expr_Plus",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn207 = function ( attributes ) {
    this.yyval =  {
        left: this.yyastk[this.stackPos-(3-1)],
        right: this.yyastk[this.stackPos-(3-3)],
        type: "Node_Expr_Minus",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn208 = function ( attributes ) {
    this.yyval =  {
        left: this.yyastk[this.stackPos-(3-1)],
        right: this.yyastk[this.stackPos-(3-3)],
        type: "Node_Expr_Mul",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn209 = function ( attributes ) {
    this.yyval =  {
        left: this.yyastk[this.stackPos-(3-1)],
        right: this.yyastk[this.stackPos-(3-3)],
        type: "Node_Expr_Div",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn210 = function ( attributes ) {
    this.yyval =  {
        left: this.yyastk[this.stackPos-(3-1)],
        right: this.yyastk[this.stackPos-(3-3)],
        type: "Node_Expr_Mod",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn211 = function ( attributes ) {
    this.yyval =  {
        left: this.yyastk[this.stackPos-(3-1)],
        right: this.yyastk[this.stackPos-(3-3)],
        type: "Node_Expr_ShiftLeft",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn212 = function ( attributes ) {
    this.yyval =  {
        left: this.yyastk[this.stackPos-(3-1)],
        right: this.yyastk[this.stackPos-(3-3)],
        type: "Node_Expr_ShiftRight",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn213 = function ( attributes ) {
    this.yyval =  {
        expr: this.yyastk[this.stackPos-(2-2)],
        type: "Node_Expr_UnaryPlus",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn214 = function ( attributes ) {
    this.yyval =  {
        expr: this.yyastk[this.stackPos-(2-2)],
        type: "Node_Expr_UnaryMinus",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn215 = function ( attributes ) {
    this.yyval =  {
        expr: this.yyastk[this.stackPos-(2-2)],
        type: "Node_Expr_BooleanNot",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn216 = function ( attributes ) {
    this.yyval =  {
        expr: this.yyastk[this.stackPos-(2-2)],
        type: "Node_Expr_BitwiseNot",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn217 = function ( attributes ) {
    this.yyval =  {
        left: this.yyastk[this.stackPos-(3-1)],
        right: this.yyastk[this.stackPos-(3-3)],
        type: "Node_Expr_Identical",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn218 = function ( attributes ) {
    this.yyval =  {
        left: this.yyastk[this.stackPos-(3-1)],
        right: this.yyastk[this.stackPos-(3-3)],
        type: "Node_Expr_NotIdentical",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn219 = function ( attributes ) {
    this.yyval =  {
        left: this.yyastk[this.stackPos-(3-1)],
        right: this.yyastk[this.stackPos-(3-3)],
        type: "Node_Expr_Equal",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn220 = function ( attributes ) {
    this.yyval =  {
        left: this.yyastk[this.stackPos-(3-1)],
        right: this.yyastk[this.stackPos-(3-3)],
        type: "Node_Expr_NotEqual",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn221 = function ( attributes ) {
    this.yyval =  {
        left: this.yyastk[this.stackPos-(3-1)],
        right: this.yyastk[this.stackPos-(3-3)],
        type: "Node_Expr_Smaller",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn222 = function ( attributes ) {
    this.yyval =  {
        left: this.yyastk[this.stackPos-(3-1)],
        right: this.yyastk[this.stackPos-(3-3)],
        type: "Node_Expr_SmallerOrEqual",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn223 = function ( attributes ) {
    this.yyval =  {
        left: this.yyastk[this.stackPos-(3-1)],
        right: this.yyastk[this.stackPos-(3-3)],
        type: "Node_Expr_Greater",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn224 = function ( attributes ) {
    this.yyval =  {
        left: this.yyastk[this.stackPos-(3-1)],
        right: this.yyastk[this.stackPos-(3-3)],
        type: "Node_Expr_GreaterOrEqual",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn225 = function ( attributes ) {
    this.yyval =  {
        left: this.yyastk[this.stackPos-(3-1)],
        right: this.yyastk[this.stackPos-(3-3)],
        type: "Node_Expr_Instanceof",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn226 = function () {
    this.yyval =  this.yyastk[ this.stackPos-(3-2) ];
};

PHP.Parser.prototype.yyn227 = function () {
    this.yyval =  this.yyastk[ this.stackPos-(3-2) ];
};

PHP.Parser.prototype.yyn228 = function ( attributes ) {
    this.yyval =  {
        cond: this.yyastk[this.stackPos-(5-1)],
        If: this.yyastk[this.stackPos-(5-3)],
        Else: this.yyastk[this.stackPos-(5-5)],
        type: "Node_Expr_Ternary",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn229 = function ( attributes ) {
    this.yyval =  {
        cond: this.yyastk[this.stackPos-(4-1)],
        If: null,
        Else: this.yyastk[this.stackPos-(4-4)],
        type: "Node_Expr_Ternary",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn230 = function ( attributes ) {
    this.yyval =  {
        variables: this.yyastk[this.stackPos-(4-3)],
        type: "Node_Expr_Isset",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn231 = function ( attributes ) {
    this.yyval =  {
        variable: this.yyastk[this.stackPos-(4-3)],
        type: "Node_Expr_Empty",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn232 = function ( attributes ) {
    this.yyval =  {
        expr: this.yyastk[this.stackPos-(2-2)],
        type: "Node_Expr_Include",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn233 = function ( attributes ) {
    this.yyval =  {
        expr: this.yyastk[this.stackPos-(2-2)],
        type: "Node_Expr_IncludeOnce",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn234 = function ( attributes ) {
    this.yyval =  {
        expr: this.yyastk[this.stackPos-(4-3)],
        type: "Node_Expr_Eval",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn235 = function ( attributes ) {
    this.yyval =  {
        expr: this.yyastk[this.stackPos-(2-2)],
        type: "Node_Expr_Require",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn236 = function ( attributes ) {
    this.yyval =  {
        expr: this.yyastk[this.stackPos-(2-2)],
        type: "Node_Expr_RequireOnce",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn237 = function ( attributes ) {
    this.yyval =  {
        expr: this.yyastk[this.stackPos-(2-2)],
        type: "Node_Expr_Cast_Int",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn238 = function ( attributes ) {
    this.yyval =  {
        expr: this.yyastk[this.stackPos-(2-2)],
        type: "Node_Expr_Cast_Double",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn239 = function ( attributes ) {
    this.yyval =  {
        expr: this.yyastk[this.stackPos-(2-2)],
        type: "Node_Expr_Cast_String",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn240 = function ( attributes ) {
    this.yyval =  {
        expr: this.yyastk[this.stackPos-(2-2)],
        type: "Node_Expr_Cast_Array",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn241 = function ( attributes ) {
    this.yyval =  {
        expr: this.yyastk[this.stackPos-(2-2)],
        type: "Node_Expr_Cast_Object",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn242 = function ( attributes ) {
    this.yyval =  {
        expr: this.yyastk[this.stackPos-(2-2)],
        type: "Node_Expr_Cast_Bool",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn243 = function ( attributes ) {
    this.yyval =  {
        expr: this.yyastk[this.stackPos-(2-2)],
        type: "Node_Expr_Cast_Unset",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn244 = function ( attributes ) {
    this.yyval =  {
        expr: this.yyastk[this.stackPos-(2-2)],
        type: "Node_Expr_Exit",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn245 = function ( attributes ) {
    this.yyval =  {
        expr: this.yyastk[this.stackPos-(2-2)],
        type: "Node_Expr_ErrorSuppress",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn246 = function () {
    this.yyval =  this.yyastk[ this.stackPos-(1-1) ];
};

PHP.Parser.prototype.yyn247 = function ( attributes ) {
    this.yyval =  {
        items: this.yyastk[this.stackPos-(4-3)],
        type: "Node_Expr_Array",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn248 = function ( attributes ) {
    this.yyval =  {
        items: this.yyastk[this.stackPos-(3-2)],
        type: "Node_Expr_Array",
        attributes: attributes
    };
};


PHP.Parser.prototype.yyn249 = function ( attributes ) {
    this.yyval =  {
        expr: this.yyastk[this.stackPos-(3-2)],
        type: "Node_Expr_ShellExec",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn250 = function ( attributes ) {
    this.yyval =  {
        expr: this.yyastk[this.stackPos-(2-2)],
        type: "Node_Expr_Print",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn251 = function ( attributes ) {
    this.yyval =  {
        Static: false,
        byRef: this.yyastk[this.stackPos-(9-2)],
        params: this.yyastk[this.stackPos-(9-4)],
        uses: this.yyastk[this.stackPos-(9-6)],
        stmts: this.yyastk[this.stackPos-(9-8)],
        type: "Node_Expr_Closure",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn252 = function ( attributes ) {
    this.yyval =  {
        Static: true,
        byRef: this.yyastk[this.stackPos-(10-3)],
        params: this.yyastk[this.stackPos-(10-5)],
        uses: this.yyastk[this.stackPos-(10-7)],
        stmts: this.yyastk[this.stackPos-(10-9)],
        type: "Node_Expr_Closure",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn253 = function ( attributes ) {
    this.yyval =  {
        Class: this.yyastk[this.stackPos-(3-2)],
        args: this.yyastk[this.stackPos-(3-3)],
        type: "Node_Expr_New",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn254 = function () {
    this.yyval = [];
};

PHP.Parser.prototype.yyn255 = function () {
    this.yyval =  this.yyastk[ this.stackPos-(4-3) ];
};

PHP.Parser.prototype.yyn256 = function () {
    this.yyval =  [ this.yyastk[ this.stackPos-(1-1) ] ];
};

PHP.Parser.prototype.yyn257 = function () {
    this.yyastk[this.stackPos-(3-1)].push(this.yyastk[this.stackPos-(3-3)]);
    this.yyval = this.yyastk[this.stackPos-(3-1)];
};

PHP.Parser.prototype.yyn258 = function ( attributes ) {
    this.yyval =  {
        byRef: this.yyastk[this.stackPos-(2-1)],
        variable: this.yyastk[this.stackPos-(2-2)].substring(1),
        type: "Node_Expr_ClosureUse",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn259 = function ( attributes ) {
    this.yyval =  {
        func: this.yyastk[this.stackPos-(4-1)],
        args: this.yyastk[this.stackPos-(4-3)],
        type: "Node_Expr_FuncCall",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn260 = function ( attributes ) {
    this.yyval =  {
        Class: this.yyastk[this.stackPos-(6-1)],
        func: this.yyastk[this.stackPos-(6-3)],
        args: this.yyastk[this.stackPos-(6-5)],
        type: "Node_Expr_StaticCall",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn261 = function ( attributes ) {
    this.yyval =  {
        Class: this.yyastk[this.stackPos-(8-1)],
        func: this.yyastk[this.stackPos-(8-4)],
        args: this.yyastk[this.stackPos-(8-7)],
        type: "Node_Expr_StaticCall",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn262 = function ( attributes ) {
    var tmp;

    // TODO verify its correct

    if ( this.yyastk[this.stackPos-(4-1)].type === "Node_Expr_StaticPropertyFetch" ) {

        this.yyval = {
            Class: this.yyastk[this.stackPos-(4-1)].Class,
            func:   {
                name: this.yyastk[this.stackPos-(4-1)].name,
                type: "Node_Expr_Variable",
                attributes: attributes
            },
            args: this.yyastk[this.stackPos-(4-3)],
            type: "Node_Expr_StaticCall",
            attributes: attributes
        };
    } else if (this.yyastk[this.stackPos-(4-1)].type  === "Node_Expr_ArrayDimFetch") {
        tmp = this.yyastk[this.stackPos-(4-1)];
        while (tmp.variable.type === "Node_Expr_ArrayDimFetch") {
            tmp = tmp.variable;
        }

        this.yyval = {
            Class: tmp.variable.Class,
            func:   this.yyastk[this.stackPos-(4-1)],
            args: this.yyastk[this.stackPos-(4-3)],
            type: "Node_Expr_StaticCall",
            attributes: attributes
        };

        tmp.variable = {
            name: tmp.variable.name,
            type: "Node_Expr_Variable",
            attributes: attributes
        };

    } else {
        throw new Exception;
    }
};

PHP.Parser.prototype.yyn263 = function ( attributes ) {
    this.yyval =  {
        func: this.yyastk[this.stackPos-(4-1)],
        args: this.yyastk[this.stackPos-(4-3)],
        type: "Node_Expr_FuncCall",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn264 = function ( attributes ) {
    this.yyval =  {
        variable: this.yyastk[this.stackPos-(4-1)],
        dim: this.yyastk[this.stackPos-(4-3)],
        type: "Node_Expr_ArrayDimFetch",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn265 = function ( attributes ) {
    this.yyval =  {
        parts: "static",
        type: "Node_Name",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn266 = function () {
    this.yyval =  this.yyastk[ this.stackPos-(1-1) ];
};

PHP.Parser.prototype.yyn267 = function ( attributes ) {
    this.yyval =  {
        parts: this.yyastk[this.stackPos-(1-1)],
        type: "Node_Name",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn268 = function ( attributes ) {
    this.yyval =  {
        parts: this.yyastk[this.stackPos-(2-2)],
        type: "Node_Name_FullyQualified",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn269 = function ( attributes ) {
    this.yyval =  {
        parts: this.yyastk[this.stackPos-(3-3)],
        type: "Node_Name_Relative",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn270 = function () {
    this.yyval =  this.yyastk[ this.stackPos-(1-1) ];
};

PHP.Parser.prototype.yyn271 = function () {
    this.yyval =  this.yyastk[ this.stackPos-(1-1) ];
};

PHP.Parser.prototype.yyn272 = function () {
    this.yyval =  this.yyastk[ this.stackPos-(1-1) ];
};

PHP.Parser.prototype.yyn273 = function () {
    this.yyval =  this.yyastk[ this.stackPos-(1-1) ];
};

PHP.Parser.prototype.yyn274 = function () {
    this.yyval =  this.yyastk[ this.stackPos-(1-1) ];
};

PHP.Parser.prototype.yyn275 = function () {
    this.yyval =  this.yyastk[ this.stackPos-(1-1) ];
};

PHP.Parser.prototype.yyn276 = function () {
    this.yyval =  this.yyastk[ this.stackPos ];
};

PHP.Parser.prototype.yyn277 = function ( attributes ) {
    this.yyval =  {
        variable: this.yyastk[this.stackPos-(3-1)],
        name: this.yyastk[this.stackPos-(3-3)],
        type: "Node_Expr_PropertyFetch",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn278 = function ( attributes ) {
    this.yyval =  {
        variable: this.yyastk[this.stackPos-(3-1)],
        name: this.yyastk[this.stackPos-(3-3)],
        type: "Node_Expr_PropertyFetch",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn279 = function ( attributes ) {
    this.yyval =  {
        variable: this.yyastk[this.stackPos-(4-1)],
        dim: this.yyastk[this.stackPos-(4-3)],
        type: "Node_Expr_ArrayDimFetch",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn280 = function ( attributes ) {
    this.yyval =  {
        variable: this.yyastk[this.stackPos-(4-1)],
        dim: this.yyastk[this.stackPos-(4-3)],
        type: "Node_Expr_ArrayDimFetch",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn281 = function () {
    this.yyval = null;
};

PHP.Parser.prototype.yyn282 = function () {
    this.yyval = null;
};

PHP.Parser.prototype.yyn283 = function () {
    this.yyval =  this.yyastk[ this.stackPos-(3-2) ];
};

PHP.Parser.prototype.yyn284 = function () {
    this.yyval = [];
};

PHP.Parser.prototype.yyn285 = function ( attributes ) {
    // todo add parse escape sequence
    this.yyval =  {
        type: "Node_Scalar_String",
        value: this.yyastk[this.stackPos-(1-1)],
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn286 = function ( attributes ) {

    this.yyastk[this.stackPos-(1-1)].forEach(function( s ){
        if (typeof s === "string") {
    // todo add parse escape sequense
    }

    });
    /*
    foreach ($this->yyastk[$this->stackPos-(1-1)] as &$s) {
        if (is_string($s)) {
            $s = PHPParser_Node_Scalar_String::parseEscapeSequences($s, '`');
        }
    };
    */
    this.yyval = this.yyastk[this.stackPos-(1-1)];
};

PHP.Parser.prototype.yyn287 = function () {
    this.yyval = [];
};

PHP.Parser.prototype.yyn288 = function () {
    this.yyval =  this.yyastk[ this.stackPos-(3-2) ];
};

PHP.Parser.prototype.yyn289 = function ( attributes ) {
    // todo add parse sequence
    this.yyval =  {
        type: "Node_Scalar_LNumber",
        value: this.yyastk[this.stackPos-(1-1)],
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn290 = function ( attributes ) {
    // todo add parse sequence
    this.yyval =  {
        type: "Node_Scalar_DNumber",
        value: this.yyastk[this.stackPos-(1-1)],
        attributes: attributes
    };
};


// string
PHP.Parser.prototype.yyn291 = function ( attributes ) {
    // todo add parse escape sequence
    this.yyval =  {
        type: "Node_Scalar_String",
        value: this.parseString( this.yyastk[this.stackPos-(1-1)] ),
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn292 = function ( attributes ) {
    this.yyval =  {
        type: "Node_Scalar_LineConst",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn293 = function ( attributes ) {
    this.yyval =  {
        type: "Node_Scalar_FileConst",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn294 = function ( attributes ) {
    this.yyval =  {
        type: "Node_Scalar_DirConst",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn295 = function ( attributes ) {
    this.yyval =  {
        type: "Node_Scalar_ClassConst",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn296 = function ( attributes ) {
    this.yyval =  {
        type: "Node_Scalar_TraitConst",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn297 = function ( attributes ) {
    this.yyval =  {
        type: "Node_Scalar_MethodConst",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn298 = function ( attributes ) {
    this.yyval =  {
        type: "Node_Scalar_FuncConst",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn299 = function ( attributes ) {
    this.yyval =  {
        type: "Node_Scalar_NSConst",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn300 = function ( attributes ) {
    // todo add parse DOC escape sequence
    this.yyval =  {
        type: "Node_Scalar_String",
        value: this.yyastk[this.stackPos-(3-2)],
        attributes: attributes
    };
};


PHP.Parser.prototype.yyn301 = function ( attributes ) {
    this.yyval =  {
        type: "Node_Scalar_String",
        value: '',
        attributes: attributes
    };
};


PHP.Parser.prototype.yyn302 = function ( attributes ) {
    this.yyval =  {
        type: "Node_Expr_ConstFetch",
        name: this.yyastk[this.stackPos-(1-1)],
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn303 = function () {
    this.yyval =  this.yyastk[ this.stackPos-(1-1) ];
};

PHP.Parser.prototype.yyn304 = function ( attributes ) {
    this.yyval =  {
        type: "Node_Expr_ClassConstFetch",
        Class: this.yyastk[this.stackPos-(3-1)],
        name: this.yyastk[this.stackPos-(3-3)],
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn305 = function ( attributes ) {
    this.yyval =  {
        expr: this.yyastk[this.stackPos-(2-2)],
        type: "Node_Expr_UnaryPlus",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn306 = function ( attributes ) {
    this.yyval =  {
        expr: this.yyastk[this.stackPos-(2-2)],
        type: "Node_Expr_UnaryMinus",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn307 = function ( attributes ) {
    this.yyval =  {
        items: this.yyastk[this.stackPos-(4-3)],
        type: "Node_Expr_Array",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn308 = function ( attributes ) {
    this.yyval =  {
        items: this.yyastk[this.stackPos-(3-2)],
        type: "Node_Expr_Array",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn309 = function () {
    this.yyval =  this.yyastk[ this.stackPos-(1-1) ];
};

PHP.Parser.prototype.yyn310 = function ( attributes ) {
    this.yyval =  {
        type: "Node_Expr_ClassConstFetch",
        Class: this.yyastk[this.stackPos-(3-1)],
        name: this.yyastk[this.stackPos-(3-3)],
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn311 = function ( attributes ) {

    this.yyastk[this.stackPos-(3-2)].forEach(function( s ){
        if (typeof s === "string") {
    // todo add parse escape sequense
    }
    /* foreach ($this->yyastk[$this->stackPos-(3-2)] as &$s) {
        if (is_string($s)) {
            $s = PHPParser_Node_Scalar_String::parseEscapeSequences($s, null);
        }
    }


    $this->yyval = new PHPParser_Node_Scalar_Encapsed($this->yyastk[$this->stackPos-(3-2)], $attributes);

        */
    });
    this.yyval =  {
        parts: this.yyastk[this.stackPos-(3-2)],
        type: "Node_Scalar_Encapsed",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn312 = function ( attributes ) {

    this.yyastk[this.stackPos-(3-2)].forEach(function( s ){
        if (typeof s === "string") {
    // todo add parse escape sequense
    }
    /* foreach ($this->yyastk[$this->stackPos-(3-2)] as &$s) {
        if (is_string($s)) {
            $s = PHPParser_Node_Scalar_String::parseEscapeSequences($s, null);
        }
    }
    $s = preg_replace('~(\r\n|\n|\r)$~', '', $s);
    if ('' === $s) array_pop($this->yyastk[$this->stackPos-(3-2)]);;

    $this->yyval = new PHPParser_Node_Scalar_Encapsed($this->yyastk[$this->stackPos-(3-2)], $attributes);

        */
    });
    this.yyval =  {
        parts: this.yyastk[this.stackPos-(3-2)],
        type: "Node_Scalar_Encapsed",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn313 = function () {
    this.yyval = [];
};

PHP.Parser.prototype.yyn314 = function () {
    this.yyval = this.yyastk[this.stackPos-(2-1)];
};

PHP.Parser.prototype.yyn315 = function () {
    this.yyval = this.yyastk[ this.stackPos ];
};

PHP.Parser.prototype.yyn316 = function () {
    this.yyval = this.yyastk[ this.stackPos ];
};

PHP.Parser.prototype.yyn317 = function () {


    if (!Array.isArray(this.yyastk[ this.stackPos-(3-1) ])) {
        this.yyastk[ this.stackPos-(3-1) ] = [ this.yyastk[ this.stackPos-(3-1) ] ];
    }


    this.yyastk[ this.stackPos-(3-1) ].push( this.yyastk[this.stackPos-(3-3)] );
    this.yyval = this.yyastk[this.stackPos-(3-1)];
};

PHP.Parser.prototype.yyn318 = function () {
    this.yyval = this.yyastk[this.stackPos-(1-1)];
};

PHP.Parser.prototype.yyn319 = function ( attributes ) {
    this.yyval =  {
        byRef: false,
        value: this.yyastk[this.stackPos-(3-3)],
        key: this.yyastk[this.stackPos-(3-1)],
        type: "Node_Expr_ArrayItem",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn320 = function ( attributes ) {
    this.yyval =  {
        byRef: false,
        value: this.yyastk[this.stackPos-(1-1)],
        type: "Node_Expr_ArrayItem",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn321 = function () {
    this.yyval = this.yyastk[this.stackPos-(1-1)];
};

PHP.Parser.prototype.yyn322 = function () {
    this.yyval = this.yyastk[this.stackPos-(1-1)];
};

PHP.Parser.prototype.yyn323 = function () {
    this.yyval = this.yyastk[this.stackPos-(1-1)];
};

PHP.Parser.prototype.yyn324 = function () {
    this.yyval = this.yyastk[this.stackPos-(1-1)];
};

PHP.Parser.prototype.yyn325 = function ( attributes ) {
    this.yyval =  {
        variable: this.yyastk[this.stackPos-(6-2)],
        dim: this.yyastk[this.stackPos-(6-5)],
        type: "Node_Expr_ArrayDimFetch",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn326 = function ( attributes ) {
    this.yyval =  {
        variable: this.yyastk[this.stackPos-(4-1)],
        dim: this.yyastk[this.stackPos-(4-3)],
        type: "Node_Expr_ArrayDimFetch",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn327 = function ( attributes ) {
    this.yyval =  {
        variable: this.yyastk[this.stackPos-(3-1)],
        name: this.yyastk[this.stackPos-(3-3)],
        type: "Node_Expr_PropertyFetch",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn328 = function ( attributes ) {
    this.yyval =  {
        variable: this.yyastk[this.stackPos-(6-1)],
        name: this.yyastk[this.stackPos-(6-3)],
        args: this.yyastk[this.stackPos-(6-5)],
        type: "Node_Expr_MethodCall",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn329 = function ( attributes ) {
    this.yyval =  {
        func: this.yyastk[this.stackPos-(4-1)],
        args: this.yyastk[this.stackPos-(4-3)],
        type: "Node_Expr_FuncCall",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn330 = function ( attributes ) {
    this.yyval =  {
        variable: this.yyastk[this.stackPos-(4-1)],
        dim: this.yyastk[this.stackPos-(4-3)],
        type: "Node_Expr_ArrayDimFetch",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn331 = function ( attributes ) {
    this.yyval =  {
        variable: this.yyastk[this.stackPos-(4-1)],
        dim: this.yyastk[this.stackPos-(4-3)],
        type: "Node_Expr_ArrayDimFetch",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn332 = function () {
    this.yyval = this.yyastk[this.stackPos-(1-1)];
};

PHP.Parser.prototype.yyn333 = function () {
    this.yyval = this.yyastk[this.stackPos-(3-2)];
};

PHP.Parser.prototype.yyn334 = function () {
    this.yyval = this.yyastk[this.stackPos-(1-1)];
};

PHP.Parser.prototype.yyn335 = function ( attributes ) {
    this.yyval =  {
        name: this.yyastk[this.stackPos-(2-2)],
        type: "Node_Expr_Variable",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn336 = function () {
    this.yyval = this.yyastk[this.stackPos-(1-1)];
};

PHP.Parser.prototype.yyn337 = function () {
    this.yyval = this.yyastk[this.stackPos-(1-1)];
};

PHP.Parser.prototype.yyn338 = function ( attributes ) {
    this.yyval =  {
        Class: this.yyastk[this.stackPos-(4-1)],
        name: this.yyastk[this.stackPos-(4-4)],
        type: "Node_Expr_StaticPropertyFetch",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn339 = function () {
    this.yyval = this.yyastk[this.stackPos-(1-1)];
};

PHP.Parser.prototype.yyn340 = function ( attributes ) {
    this.yyval =  {
        Class: this.yyastk[this.stackPos-(3-1)],
        name: this.yyastk[this.stackPos-(3-3)].substring(1),
        type: "Node_Expr_StaticPropertyFetch",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn341 = function ( attributes ) {
    this.yyval =  {
        Class: this.yyastk[this.stackPos-(6-1)],
        name: this.yyastk[this.stackPos-(6-5)],
        type: "Node_Expr_StaticPropertyFetch",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn342 = function ( attributes ) {
    this.yyval =  {
        variable: this.yyastk[this.stackPos-(4-1)],
        dim: this.yyastk[this.stackPos-(4-3)],
        type: "Node_Expr_ArrayDimFetch",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn343 = function ( attributes ) {
    this.yyval =  {
        variable: this.yyastk[this.stackPos-(4-1)],
        dim: this.yyastk[this.stackPos-(4-3)],
        type: "Node_Expr_ArrayDimFetch",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn344 = function ( attributes ) {
    this.yyval =  {
        variable: this.yyastk[this.stackPos-(4-1)],
        dim: this.yyastk[this.stackPos-(4-3)],
        type: "Node_Expr_ArrayDimFetch",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn345 = function ( attributes ) {
    this.yyval =  {
        variable: this.yyastk[this.stackPos-(4-1)],
        dim: this.yyastk[this.stackPos-(4-3)],
        type: "Node_Expr_ArrayDimFetch",
        attributes: attributes
    };
};


PHP.Parser.prototype.yyn346 = function ( attributes ) {
    this.yyval =  {
        name: this.yyastk[this.stackPos-(1-1)].substring(1),
        type: "Node_Expr_Variable",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn347 = function ( attributes ) {
    this.yyval =  {
        name: this.yyastk[this.stackPos-(4-3)],
        type: "Node_Expr_Variable",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn348 = function () {
    this.yyval = null;
};

PHP.Parser.prototype.yyn349 = function () {
    this.yyval = this.yyastk[this.stackPos-(1-1)];
};

PHP.Parser.prototype.yyn350 = function () {
    this.yyval = this.yyastk[this.stackPos-(1-1)];
};

PHP.Parser.prototype.yyn351 = function () {
    this.yyval = this.yyastk[this.stackPos-(3-2)];
};

PHP.Parser.prototype.yyn352 = function () {
    this.yyval = this.yyastk[this.stackPos-(1-1)];
};

PHP.Parser.prototype.yyn353 = function () {
    this.yyastk[this.stackPos-(3-1)].push(this.yyastk[this.stackPos-(3-3)]);
    this.yyval = this.yyastk[this.stackPos-(3-1)];

};

PHP.Parser.prototype.yyn354 = function () {
    this.yyval = [ this.yyastk[this.stackPos-(1-1)] ];
};

PHP.Parser.prototype.yyn355 = function () {
    this.yyval = this.yyastk[this.stackPos-(1-1)];
};

PHP.Parser.prototype.yyn356 = function () {
    this.yyval = this.yyastk[this.stackPos-(4-3)];
};

PHP.Parser.prototype.yyn357 = function () {
    this.yyval = null;
};

PHP.Parser.prototype.yyn358 = function () {
    this.yyval = {};
};

PHP.Parser.prototype.yyn359 = function () {
    this.yyval = this.yyastk[this.stackPos-(2-1)];
};

PHP.Parser.prototype.yyn360 = function () {

    if (!Array.isArray(this.yyastk[this.stackPos-(3-1)])) {
        this.yyastk[this.stackPos-(3-1)] = [this.yyastk[this.stackPos-(3-1)]];
    }

    this.yyastk[this.stackPos-(3-1)].push(this.yyastk[this.stackPos-(3-3)]);

    this.yyval = this.yyastk[this.stackPos-(3-1)];


};

PHP.Parser.prototype.yyn361 = function () {
    this.yyval = this.yyastk[this.stackPos-(1-1)];
};

PHP.Parser.prototype.yyn362 = function ( attributes ) {
    this.yyval =  {
        byRef: false,
        value: this.yyastk[this.stackPos-(3-3)],
        key: this.yyastk[this.stackPos-(3-1)],
        type: "Node_Expr_ArrayItem",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn363 = function ( attributes ) {
    this.yyval =  {
        byRef: false,
        value: this.yyastk[this.stackPos-(1-1)],
        type: "Node_Expr_ArrayItem",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn364 = function ( attributes ) {
    this.yyval =  {
        byRef: true,
        value: this.yyastk[this.stackPos-(4-4)],
        key: this.yyastk[this.stackPos-(4-1)],
        type: "Node_Expr_ArrayItem",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn365 = function ( attributes ) {
    this.yyval =  {
        byRef: true,
        value: this.yyastk[this.stackPos-(2-2)],
        type: "Node_Expr_ArrayItem",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn366 = function () {
    this.yyastk[this.stackPos-(2-1)].push(this.yyastk[this.stackPos-(2-2)]);
    this.yyval = this.yyastk[this.stackPos-(2-1)];
};

PHP.Parser.prototype.yyn367 = function () {
    this.yyastk[this.stackPos-(2-1)].push(this.yyastk[this.stackPos-(2-2)]);
    this.yyval = this.yyastk[this.stackPos-(2-1)];
};

PHP.Parser.prototype.yyn368 = function () {
    this.yyval = [ this.yyastk[this.stackPos-(1-1)] ];
};

PHP.Parser.prototype.yyn369 = function () {
    this.yyval = [ this.yyastk[this.stackPos-(2-1)], this.yyastk[this.stackPos-(2-2)] ];
};

PHP.Parser.prototype.yyn370 = function ( attributes ) {
    this.yyval =  {
        name: this.yyastk[this.stackPos-(1-1)].substring(1),
        type: "Node_Expr_Variable",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn371 = function ( attributes ) {
    this.yyval =  {
        variable: {
            name: this.yyastk[this.stackPos-(4-1)].substring(1),
            type: "Node_Expr_Variable",
            attributes: attributes
        },
        dim: this.yyastk[this.stackPos-(4-3)],
        type: "Node_Expr_ArrayDimFetch",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn372 = function ( attributes ) {
    this.yyval =  {
        variable: {
            name: this.yyastk[this.stackPos-(3-1)].substring(1),
            type: "Node_Expr_Variable",
            attributes: attributes
        },
        name: this.yyastk[this.stackPos-(3-3)],
        type: "Node_Expr_PropertyFetch",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn373 = function ( attributes ) {
    this.yyval =  {
        name: this.yyastk[this.stackPos-(3-2)],
        type: "Node_Expr_Variable",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn374 = function ( attributes ) {
    this.yyval =  {
        name: this.yyastk[this.stackPos-(3-2)],
        type: "Node_Expr_Variable",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn375 = function ( attributes ) {
    this.yyval =  {
        variable: {
            name: this.yyastk[this.stackPos-(6-2)],
            type: "Node_Expr_Variable",
            attributes: attributes
        },
        dim: this.yyastk[this.stackPos-(6-4)],
        type: "Node_Expr_ArrayDimFetch",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn376 = function () {
    this.yyval = [ this.yyastk[this.stackPos-(3-2)] ];
};

PHP.Parser.prototype.yyn377 = function ( attributes ) {
    this.yyval =  {
        value: this.yyastk[this.stackPos-(1-1)],
        type: "Node_Scalar_String",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn378 = function ( attributes ) {
    this.yyval =  {
        value: this.yyastk[this.stackPos-(1-1)],
        type: "Node_Scalar_String",
        attributes: attributes
    };
};

PHP.Parser.prototype.yyn379 = function ( attributes ) {
    this.yyval =  {
        name: this.yyastk[this.stackPos-(1-1)].substring(1),
        type: "Node_Expr_Variable",
        attributes: attributes
    };
};