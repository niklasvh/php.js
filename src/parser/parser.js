/*
 * @author Niklas von Hertzen <niklas at hertzen.com>
 * @created 15.6.2012
 * @website http://hertzen.com
 */

/*
 * The skeleton for this parser was written by Moriyoshi Koizumi and is based on
 * the work by Masato Bito and is in the PUBLIC DOMAIN.
 * Ported to JavaScript by Niklas von Hertzen
 */

PHP.Parser = function ( tokens ) {

    var yybase = this.yybase,
    yydefault = this.yydefault,
    yycheck = this.yycheck,
    yyaction = this.yyaction,
    yylen = this.yylen,
    yygbase = this.yygbase,
    yygcheck = this.yygcheck,
    yyp = this.yyp,
    yygoto = this.yygoto,
    yylhs = this.yylhs,
    translate = this.translate,
    yygdefault = this.yygdefault;
    
    this.tokens = tokens;
    this.pos = -1;
    this.line = 1;

    this.tokenMap = this.createTokenMap( );

    this.dropTokens = {};
    this.dropTokens[ T_WHITESPACE ] = 1;
    this.dropTokens[ T_OPEN_TAG ] = 1;


    // We start off with no lookahead-token
    var tokenId = this.TOKEN_NONE;

    // The attributes for a node are taken from the first and last token of the node.
    // From the first token only the startAttributes are taken and from the last only
    // the endAttributes. Both are merged using the array union operator (+).
    this.startAttributes = {
        'startLine': 1
    };

    this.endAttributes = {};

    // In order to figure out the attributes for the starting token, we have to keep
    // them in a stack
    var attributeStack = [ this.startAttributes ];

    // Start off in the initial state and keep a stack of previous states
    var state = 0;
    var stateStack = [ state ];

    // AST stack
    this.yyastk = [];

    // Current position in the stack(s)
    this.stackPos  = 0;

    var yyn;

    var origTokenId;


    for (;;) {

        if ( yybase[ state ] === 0 ) {
            yyn = yydefault[ state ];
        } else {
            if (tokenId === this.TOKEN_NONE ) {

                // fetch the next token id from the lexer and fetch additional info by-ref

                origTokenId = this.getNextToken( );

                // map the lexer token id to the internally used token id's
                tokenId = (origTokenId >= 0 && origTokenId < this.TOKEN_MAP_SIZE) ? translate[ origTokenId ] : this.TOKEN_INVALID;
                //    console.log(origTokenId,tokenId);
                if (tokenId === this.TOKEN_INVALID) {
                    console.log('The lexer returned an invalid token',
                        origTokenId, this.tokenValue);
                /*
                    throw new RangeException(sprintf(
                    'The lexer returned an invalid token (id=%d, value=%s)',
                    origTokenId, tokenValue
                ));*/
                }

                attributeStack[ this.stackPos ] = this.startAttributes;
            }

            if (((yyn = yybase[ state ] + tokenId) >= 0
                && yyn < this.YYLAST && yycheck[ yyn ] === tokenId
                || (state < this.YY2TBLSTATE
                    && (yyn = yybase[state + this.YYNLSTATES] + tokenId) >= 0
                    && yyn < this.YYLAST
                    && yycheck[ yyn ] === tokenId))
            && (yyn = yyaction[ yyn ]) !== YYDEFAULT ) {
                /*
                 * >= YYNLSTATE: shift and reduce
                 * > 0: shift
                 * = 0: accept
                 * < 0: reduce
                 * = -YYUNEXPECTED: error
                 */
                if (yyn > 0) {
                    /* shift */
                    ++this.stackPos;

                    stateStack[ this.stackPos ] = state = yyn;
                    this.yyastk[ this.stackPos ] = this.tokenValue;
                    attributeStack[ this.stackPos ] = this.startAttributes;
                    tokenId = this.TOKEN_NONE;

                    if (yyn < this.YYNLSTATES)
                        continue;

                    /* $yyn >= YYNLSTATES means shift-and-reduce */
                    yyn -= this.YYNLSTATES;
                } else {
                    yyn = -yyn;
                }
            } else {
                yyn = yydefault[ state ];
            }
        }

        for (;;) {
            /* reduce/error */

            if ( yyn === 0 ) {
                /* accept */
                //  console.log(this.yyastk);
                return this.yyval;
            } else if (yyn !== this.YYUNEXPECTED ) {
                /* reduce */
                try {
                    //    console.log('yyn' + yyn);
                    this['yyn' + yyn](
                        PHP.Utils.Merge(attributeStack[this.stackPos - yylen[ yyn ] ], this.endAttributes)
                        //      + endAttributes
                        );
                } catch (e) {
                    /*
                        if (-1 === $e->getRawLine()) {
                            $e->setRawLine($startAttributes['startLine']);
                        }
                     */
                    throw e;
                }

                /* Goto - shift nonterminal */
                this.stackPos -= yylen[ yyn ];
                yyn = yylhs[ yyn ];
                if ((yyp = yygbase[ yyn ] + stateStack[ this.stackPos ]) >= 0
                    && yyp < this.YYGLAST
                    && yygcheck[ yyp ] === yyn) {
                    state = yygoto[ yyp ];
                } else {
                    state = yygdefault[ yyn ];
                }

                ++this.stackPos;

                stateStack[ this.stackPos ] = state;
                this.yyastk[ this.stackPos ] = this.yyval;
                attributeStack[ this.stackPos ] = this.startAttributes;
            } else {
                /* error */

                console.log(this.yyastk);
                console.log( tokens );
                throw new Error('Unexpected token ' + terminals[ tokenId ] + ", tokenId " + tokenId + " line " + this.startAttributes['startLine']);


            }

            if (state < this.YYNLSTATES)
                break;
            /* >= YYNLSTATES means shift-and-reduce */
            yyn = state - this.YYNLSTATES;
        }
    }
    console.log(tokens);
};

PHP.Parser.prototype.MODIFIER_PUBLIC    =  1;
PHP.Parser.prototype.MODIFIER_PROTECTED =  2;
PHP.Parser.prototype.MODIFIER_PRIVATE   =  4;
PHP.Parser.prototype.MODIFIER_STATIC    =  8;
PHP.Parser.prototype.MODIFIER_ABSTRACT  = 16;
PHP.Parser.prototype.MODIFIER_FINAL     = 32;

PHP.Parser.prototype.TOKEN_NONE    = -1;
PHP.Parser.prototype.TOKEN_INVALID = 149;

PHP.Parser.prototype.TOKEN_MAP_SIZE = 384;

PHP.Parser.prototype.YYLAST       = 913;
PHP.Parser.prototype.YY2TBLSTATE  = 328;
PHP.Parser.prototype.YYGLAST      = 415;
PHP.Parser.prototype.YYNLSTATES   = 544;
PHP.Parser.prototype.YYUNEXPECTED = 32767;
PHP.Parser.prototype.YYDEFAULT    = -32766;

// {{{ Tokens
PHP.Parser.prototype.YYERRTOK = 256;
PHP.Parser.prototype.T_INCLUDE = 257;
PHP.Parser.prototype.T_INCLUDE_ONCE = 258;
PHP.Parser.prototype.T_EVAL = 259;
PHP.Parser.prototype.T_REQUIRE = 260;
PHP.Parser.prototype.T_REQUIRE_ONCE = 261;
PHP.Parser.prototype.T_LOGICAL_OR = 262;
PHP.Parser.prototype.T_LOGICAL_XOR = 263;
PHP.Parser.prototype.T_LOGICAL_AND = 264;
PHP.Parser.prototype.T_PRINT = 265;
PHP.Parser.prototype.T_PLUS_EQUAL = 266;
PHP.Parser.prototype.T_MINUS_EQUAL = 267;
PHP.Parser.prototype.T_MUL_EQUAL = 268;
PHP.Parser.prototype.T_DIV_EQUAL = 269;
PHP.Parser.prototype.T_CONCAT_EQUAL = 270;
PHP.Parser.prototype.T_MOD_EQUAL = 271;
PHP.Parser.prototype.T_AND_EQUAL = 272;
PHP.Parser.prototype.T_OR_EQUAL = 273;
PHP.Parser.prototype.T_XOR_EQUAL = 274;
PHP.Parser.prototype.T_SL_EQUAL = 275;
PHP.Parser.prototype.T_SR_EQUAL = 276;
PHP.Parser.prototype.T_BOOLEAN_OR = 277;
PHP.Parser.prototype.T_BOOLEAN_AND = 278;
PHP.Parser.prototype.T_IS_EQUAL = 279;
PHP.Parser.prototype.T_IS_NOT_EQUAL = 280;
PHP.Parser.prototype.T_IS_IDENTICAL = 281;
PHP.Parser.prototype.T_IS_NOT_IDENTICAL = 282;
PHP.Parser.prototype.T_IS_SMALLER_OR_EQUAL = 283;
PHP.Parser.prototype.T_IS_GREATER_OR_EQUAL = 284;
PHP.Parser.prototype.T_SL = 285;
PHP.Parser.prototype.T_SR = 286;
PHP.Parser.prototype.T_INSTANCEOF = 287;
PHP.Parser.prototype.T_INC = 288;
PHP.Parser.prototype.T_DEC = 289;
PHP.Parser.prototype.T_INT_CAST = 290;
PHP.Parser.prototype.T_DOUBLE_CAST = 291;
PHP.Parser.prototype.T_STRING_CAST = 292;
PHP.Parser.prototype.T_ARRAY_CAST = 293;
PHP.Parser.prototype.T_OBJECT_CAST = 294;
PHP.Parser.prototype.T_BOOL_CAST = 295;
PHP.Parser.prototype.T_UNSET_CAST = 296;
PHP.Parser.prototype.T_NEW = 297;
PHP.Parser.prototype.T_CLONE = 298;
PHP.Parser.prototype.T_EXIT = 299;
PHP.Parser.prototype.T_IF = 300;
PHP.Parser.prototype.T_ELSEIF = 301;
PHP.Parser.prototype.T_ELSE = 302;
PHP.Parser.prototype.T_ENDIF = 303;
PHP.Parser.prototype.T_LNUMBER = 304;
PHP.Parser.prototype.T_DNUMBER = 305;
PHP.Parser.prototype.T_STRING = 306;
PHP.Parser.prototype.T_STRING_VARNAME = 307;
PHP.Parser.prototype.T_VARIABLE = 308;
PHP.Parser.prototype.T_NUM_STRING = 309;
PHP.Parser.prototype.T_INLINE_HTML = 310;
PHP.Parser.prototype.T_CHARACTER = 311;
PHP.Parser.prototype.T_BAD_CHARACTER = 312;
PHP.Parser.prototype.T_ENCAPSED_AND_WHITESPACE = 313;
PHP.Parser.prototype.T_CONSTANT_ENCAPSED_STRING = 314;
PHP.Parser.prototype.T_ECHO = 315;
PHP.Parser.prototype.T_DO = 316;
PHP.Parser.prototype.T_WHILE = 317;
PHP.Parser.prototype.T_ENDWHILE = 318;
PHP.Parser.prototype.T_FOR = 319;
PHP.Parser.prototype.T_ENDFOR = 320;
PHP.Parser.prototype.T_FOREACH = 321;
PHP.Parser.prototype.T_ENDFOREACH = 322;
PHP.Parser.prototype.T_DECLARE = 323;
PHP.Parser.prototype.T_ENDDECLARE = 324;
PHP.Parser.prototype.T_AS = 325;
PHP.Parser.prototype.T_SWITCH = 326;
PHP.Parser.prototype.T_ENDSWITCH = 327;
PHP.Parser.prototype.T_CASE = 328;
PHP.Parser.prototype.T_DEFAULT = 329;
PHP.Parser.prototype.T_BREAK = 330;
PHP.Parser.prototype.T_CONTINUE = 331;
PHP.Parser.prototype.T_GOTO = 332;
PHP.Parser.prototype.T_FUNCTION = 333;
PHP.Parser.prototype.T_CONST = 334;
PHP.Parser.prototype.T_RETURN = 335;
PHP.Parser.prototype.T_TRY = 336;
PHP.Parser.prototype.T_CATCH = 337;
PHP.Parser.prototype.T_THROW = 338;
PHP.Parser.prototype.T_USE = 339;
PHP.Parser.prototype.T_INSTEADOF = 340;
PHP.Parser.prototype.T_GLOBAL = 341;
PHP.Parser.prototype.T_STATIC = 342;
PHP.Parser.prototype.T_ABSTRACT = 343;
PHP.Parser.prototype.T_FINAL = 344;
PHP.Parser.prototype.T_PRIVATE = 345;
PHP.Parser.prototype.T_PROTECTED = 346;
PHP.Parser.prototype.T_PUBLIC = 347;
PHP.Parser.prototype.T_VAR = 348;
PHP.Parser.prototype.T_UNSET = 349;
PHP.Parser.prototype.T_ISSET = 350;
PHP.Parser.prototype.T_EMPTY = 351;
PHP.Parser.prototype.T_HALT_COMPILER = 352;
PHP.Parser.prototype.T_CLASS = 353;
PHP.Parser.prototype.T_TRAIT = 354;
PHP.Parser.prototype.T_INTERFACE = 355;
PHP.Parser.prototype.T_EXTENDS = 356;
PHP.Parser.prototype.T_IMPLEMENTS = 357;
PHP.Parser.prototype.T_OBJECT_OPERATOR = 358;
PHP.Parser.prototype.T_DOUBLE_ARROW = 359;
PHP.Parser.prototype.T_LIST = 360;
PHP.Parser.prototype.T_ARRAY = 361;
PHP.Parser.prototype.T_CALLABLE = 362;
PHP.Parser.prototype.T_CLASS_C = 363;
PHP.Parser.prototype.T_TRAIT_C = 364;
PHP.Parser.prototype.T_METHOD_C = 365;
PHP.Parser.prototype.T_FUNC_C = 366;
PHP.Parser.prototype.T_LINE = 367;
PHP.Parser.prototype.T_FILE = 368;
PHP.Parser.prototype.T_COMMENT = 369;
PHP.Parser.prototype.T_DOC_COMMENT = 370;
PHP.Parser.prototype.T_OPEN_TAG = 371;
PHP.Parser.prototype.T_OPEN_TAG_WITH_ECHO = 372;
PHP.Parser.prototype.T_CLOSE_TAG = 373;
PHP.Parser.prototype.T_WHITESPACE = 374;
PHP.Parser.prototype.T_START_HEREDOC = 375;
PHP.Parser.prototype.T_END_HEREDOC = 376;
PHP.Parser.prototype.T_DOLLAR_OPEN_CURLY_BRACES = 377;
PHP.Parser.prototype.T_CURLY_OPEN = 378;
PHP.Parser.prototype.T_PAAMAYIM_NEKUDOTAYIM = 379;
PHP.Parser.prototype.T_NAMESPACE = 380;
PHP.Parser.prototype.T_NS_C = 381;
PHP.Parser.prototype.T_DIR = 382;
PHP.Parser.prototype.T_NS_SEPARATOR = 383;










PHP.Parser.prototype.getNextToken = function( ) {

    this.startAttributes = {};
    this.endAttributes = {};

    var token,
    tmp;

    while (this.tokens[++this.pos] !== undefined) {
        token = this.tokens[this.pos];

        if (typeof token === "string") {
            this.startAttributes['startLine'] = this.line;
            this.endAttributes['endLine'] = this.line;

            // bug in token_get_all
            if ('b"' === token) {
                this.tokenValue = 'b"';
                return '"'.charCodeAt(0);
            } else {
                this.tokenValue = token;
                return token.charCodeAt(0);
            }
        } else {



            this.line += ((tmp = token[ 1 ].match(/\\n/g)) === null) ? 0 : tmp.length;

            if (T_COMMENT === token[0]) {

                if (!Array.isArray(this.startAttributes['comments'])) {
                    this.startAttributes['comments'] = [];
                }

                this.startAttributes['comments'].push( {
                    type: "comment",
                    comment: token[1],
                    line: token[2]
                });

            } else if (T_DOC_COMMENT === token[0]) {
                this.startAttributes['comments'].push( new PHPParser_Comment_Doc(token[1], token[2]) );
            } else if (this.dropTokens[token[0]] === undefined) {
                //      console.log(this.pos, token);
                //     console.log(this.tokenMap);
                this.tokenValue = token[1];
                this.startAttributes['startLine'] = token[2];
                this.endAttributes['endLine'] = this.line;

                return this.tokenMap[token[0]];
            }
        }
    }

    this.startAttributes['startLine'] = this.line;

    // 0 is the EOF token
    return 0;
};


/**
 * Creates the token map.
 *
 * The token map maps the PHP internal token identifiers
 * to the identifiers used by the PHP.Parser. Additionally it
 * maps T_OPEN_TAG_WITH_ECHO to T_ECHO and T_CLOSE_TAG to ';'.
 *
 * @return array The token map
 */

PHP.Parser.prototype.createTokenMap = function() {
    var tokenMap = {},
    name,
    i;

    // 256 is the minimum possible token number, as everything below
    // it is an ASCII value
    for ( i = 256; i < 1000; ++i ) {
        // T_DOUBLE_COLON is equivalent to T_PAAMAYIM_NEKUDOTAYIM
        if ( T_DOUBLE_COLON === i ) {
            tokenMap[ i ] = this.T_PAAMAYIM_NEKUDOTAYIM;
        // T_OPEN_TAG_WITH_ECHO with dropped T_OPEN_TAG results in T_ECHO
        } else if( T_OPEN_TAG_WITH_ECHO === i ) {
            tokenMap[ i ] = T_ECHO;
        // T_CLOSE_TAG is equivalent to ';'
        } else if( T_CLOSE_TAG === i ) {
            tokenMap[ i ] = 59;
        // and the others can be mapped directly
        } else if ( 'UNKNOWN' !== (name = PHP.Utils.TokenName( i ) ) ) {
            tokenMap[ i ] =  this[name];
        }
    }
    return tokenMap;
};

var yynStandard = function () {
    this.yyval =  this.yyastk[ this.stackPos-(1-1) ];
};
// todo fix

PHP.Parser.prototype.MakeArray = function( arr ) {
    return Array.isArray( arr ) ? arr : [ arr ];
}


PHP.Parser.prototype.parseString = function( str ) {
    var bLength = 0;
    if ('b' === str[0]) {
        bLength = 1;
    }

    if ('\'' === str[ bLength ]) {
        str = str.replace(
            ['\\\\', '\\\''],
            [  '\\',   '\'']);
    } else {
     
        str = this.parseEscapeSequences( str, '"');

    }

    return str;
  
};

PHP.Parser.prototype.parseEscapeSequences = function( str, quote ) {
    
  

    if (undefined !== quote) {
        str = str.replace(new RegExp('\\' + quote, "g"), quote);
    }

    var replacements = {
        '\\': '\\',
        '$':  '$',
        'n': "\n",
        'r': "\r",
        't': "\t",
        'f': "\f",
        'v': "\v",
        'e': "\x1B",
    };

    return str.replace(
        /~\\\\([\\\\$nrtfve]|[xX][0-9a-fA-F]{1,2}|[0-7]{1,3})~/g,
        function ( matches ){
            var str = matches[1];

            if ( replacements[ str ] !== undefined ) {
                return replacements[ str ];
            } else if ('x' === str[ 0 ] || 'X' === str[ 0 ]) {
                return chr(hexdec(str));
            } else {
                return chr(octdec(str));
            }
        }
        );
    
    return str;
};
