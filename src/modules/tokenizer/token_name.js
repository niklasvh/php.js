/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 15.6.2012 
* @website http://hertzen.com
 */

/* token_name — Get the symbolic name of a given PHP token
 * string token_name ( int $token )
 */

PHP.Modules.prototype.token_name = function( token ) {
    
    if ( !this[ PHP.Compiler.prototype.SIGNATURE ]( arguments, "token_name", 1, [ PHP.VM.Variable.prototype.INT ] ) ) {
        return new PHP.VM.Variable( null );
    }
    
    // TODO invert this for faster performance
    var constants = {};
    constants.T_INCLUDE = 262;
    constants.T_INCLUDE_ONCE = 261;
    constants.T_EVAL = 260;
    constants.T_REQUIRE = 259;
    constants.T_REQUIRE_ONCE = 258;
    constants.T_LOGICAL_OR = 263;
    constants.T_LOGICAL_XOR = 264;
    constants.T_LOGICAL_AND = 265;
    constants.T_PRINT = 266;
    constants.T_PLUS_EQUAL = 277;
    constants.T_MINUS_EQUAL = 276;
    constants.T_MUL_EQUAL = 275;
    constants.T_DIV_EQUAL = 274;
    constants.T_CONCAT_EQUAL = 273;
    constants.T_MOD_EQUAL = 272;
    constants.T_AND_EQUAL = 271;
    constants.T_OR_EQUAL = 270;
    constants.T_XOR_EQUAL = 269;
    constants.T_SL_EQUAL = 268;
    constants.T_SR_EQUAL = 267;
    constants.T_BOOLEAN_OR = 278;
    constants.T_BOOLEAN_AND = 279;
    constants.T_IS_EQUAL = 283;
    constants.T_IS_NOT_EQUAL = 282;
    constants.T_IS_IDENTICAL = 281;
    constants.T_IS_NOT_IDENTICAL = 280;
    constants.T_IS_SMALLER_OR_EQUAL = 285;
    constants.T_IS_GREATER_OR_EQUAL = 284;
    constants.T_SL = 287;
    constants.T_SR = 286;
    constants.T_INSTANCEOF = 288;
    constants.T_INC = 297;
    constants.T_DEC = 296;
    constants.T_INT_CAST = 295;
    constants.T_DOUBLE_CAST = 294;
    constants.T_STRING_CAST = 293;
    constants.T_ARRAY_CAST = 292;
    constants.T_OBJECT_CAST = 291;
    constants.T_BOOL_CAST = 290;
    constants.T_UNSET_CAST = 289;
    constants.T_NEW = 299;
    constants.T_CLONE = 298;
    constants.T_EXIT = 300;
    constants.T_IF = 301;
    constants.T_ELSEIF = 302;
    constants.T_ELSE = 303;
    constants.T_ENDIF = 304;
    constants.T_LNUMBER = 305;
    constants.T_DNUMBER = 306;
    constants.T_STRING = 307;
    constants.T_STRING_VARNAME = 308;
    constants.T_VARIABLE = 309;
    constants.T_NUM_STRING = 310;
    constants.T_INLINE_HTML = 311;
    constants.T_CHARACTER = 312;
    constants.T_BAD_CHARACTER = 313;
    constants.T_ENCAPSED_AND_WHITESPACE = 314;
    constants.T_CONSTANT_ENCAPSED_STRING = 315;
    constants.T_ECHO = 316;
    constants.T_DO = 317;
    constants.T_WHILE = 318;
    constants.T_ENDWHILE = 319;
    constants.T_FOR = 320;
    constants.T_ENDFOR = 321;
    constants.T_FOREACH = 322;
    constants.T_ENDFOREACH = 323;
    constants.T_DECLARE = 324;
    constants.T_ENDDECLARE = 325;
    constants.T_AS = 326;
    constants.T_SWITCH = 327;
    constants.T_ENDSWITCH = 328;
    constants.T_CASE = 329;
    constants.T_DEFAULT = 330;
    constants.T_BREAK = 331;
    constants.T_CONTINUE = 332;
    constants.T_GOTO = 333;
    constants.T_FUNCTION = 334;
    constants.T_CONST = 335;
    constants.T_RETURN = 336;
    constants.T_TRY = 337;
    constants.T_CATCH = 338;
    constants.T_THROW = 339;
    constants.T_USE = 340;
    //constants.T_INSTEADOF = ;
    constants.T_GLOBAL = 341;
    constants.T_STATIC = 347;
    constants.T_ABSTRACT = 346;
    constants.T_FINAL = 345;
    constants.T_PRIVATE = 344;
    constants.T_PROTECTED = 343;
    constants.T_PUBLIC = 342;
    constants.T_VAR = 348;
    constants.T_UNSET = 349;
    constants.T_ISSET = 350;
    constants.T_EMPTY = 351;
    constants.T_HALT_COMPILER = 352;
    constants.T_CLASS = 353;
    //constants.T_TRAIT = ;
    constants.T_INTERFACE = 354;
    constants.T_EXTENDS = 355;
    constants.T_IMPLEMENTS = 356;
    constants.T_OBJECT_OPERATOR = 357;
    constants.T_DOUBLE_ARROW = 358;
    constants.T_LIST = 359;
    constants.T_ARRAY = 360;
    //constants.T_CALLABLE = ;
    constants.T_CLASS_C = 361;
    //constants.T_TRAIT_C = ;
    constants.T_METHOD_C = 362;
    constants.T_FUNC_C = 363;
    constants.T_LINE = 364;
    constants.T_FILE = 365;
    constants.T_COMMENT = 366;
    constants.T_DOC_COMMENT = 367;
    constants.T_OPEN_TAG = 368;
    constants.T_OPEN_TAG_WITH_ECHO = 369;
    constants.T_CLOSE_TAG = 370;
    constants.T_WHITESPACE = 371;
    constants.T_START_HEREDOC = 372;
    constants.T_END_HEREDOC = 373;
    constants.T_DOLLAR_OPEN_CURLY_BRACES = 374;
    constants.T_CURLY_OPEN = 375;
    constants.T_DOUBLE_COLON = 376;
    constants.T_PAAMAYIM_NEKUDOTAYIM = 376;
    constants.T_NAMESPACE = 377;
    constants.T_NS_C = 378;
    constants.T_DIR = 379;
    constants.T_NS_SEPARATOR = 380;
    
    
 
    for (var key in constants) {
        if (constants[ key ] === token[ PHP.Compiler.prototype.VARIABLE_VALUE ]) {
            return new PHP.VM.Variable( key );
        }
    }
    
    return new PHP.VM.Variable( "UNKNOWN" );
    
 
    
    

};