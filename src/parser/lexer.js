PHP.Lexer = function( src, ini ) {


    var heredoc,
    lineBreaker = function( result ) {
        if (result.match(/\n/) !== null) {
            var quote = result.substring(0, 1);
            result = '[' + result.split(/\n/).join( quote + "," + quote ) + '].join("\\n")';

        }

        return result;
    },
    prev,

    openTag = (ini === undefined || (/^(on|true|1)$/i.test(ini.short_open_tag) ) ? /(\<\?php\s|\<\?|\<\%|\<script language\=('|")?php('|")?\>)/i : /(\<\?php\s|<\?=|\<script language\=('|")?php('|")?\>)/i),
        openTagStart = (ini === undefined || (/^(on|true|1)$/i.test(ini.short_open_tag)) ? /^(\<\?php\s|\<\?|\<\%|\<script language\=('|")?php('|")?\>)/i : /^(\<\?php\s|<\?=|\<script language\=('|")?php('|")?\>)/i),
            tokens = [
            {
                value: PHP.Constants.T_NAMESPACE,
                re: /^namespace(?=\s)/i
            },
            {
                value: PHP.Constants.T_USE,
                re: /^use(?=\s)/i
            },
            {
                value: PHP.Constants.T_ABSTRACT,
                re: /^abstract(?=\s)/i
            },
            {
                value: PHP.Constants.T_IMPLEMENTS,
                re: /^implements(?=\s)/i
            },
            {
                value: PHP.Constants.T_INTERFACE,
                re: /^interface(?=\s)/i
            },
            {
                value: PHP.Constants.T_CONST,
                re: /^const(?=\s)/i
            },
            {
                value: PHP.Constants.T_STATIC,
                re: /^static(?=\s)/i
            },
            {
                value: PHP.Constants.T_FINAL,
                re: /^final(?=\s)/i
            },
            {
                value: PHP.Constants.T_VAR,
                re: /^var(?=\s)/i
            },
            {
                value: PHP.Constants.T_GLOBAL,
                re: /^global(?=\s)/i
            },
            {
                value: PHP.Constants.T_CLONE,
                re: /^clone(?=\s)/i
            },
            {
                value: PHP.Constants.T_THROW,
                re: /^throw(?=\s)/i
            },
            {
                value: PHP.Constants.T_EXTENDS,
                re: /^extends(?=\s)/i
            },
            {
                value: PHP.Constants.T_AND_EQUAL,
                re: /^&=/
            },
            {
                value: PHP.Constants.T_AS,
                re: /^as(?=\s)/i
            },
            {
                value: PHP.Constants.T_ARRAY_CAST,
                re: /^\(array\)/i
            },
            {
                value: PHP.Constants.T_BOOL_CAST,
                re: /^\((bool|boolean)\)/i
            },
            {
                value: PHP.Constants.T_DOUBLE_CAST,
                re: /^\((real|float|double)\)/i
            },
            {
                value: PHP.Constants.T_INT_CAST,
                re: /^\((int|integer)\)/i
            },
            {
                value: PHP.Constants.T_OBJECT_CAST,
                re: /^\(object\)/i
            },
            {
                value: PHP.Constants.T_STRING_CAST,
                re: /^\(string\)/i
            },
            {
                value: PHP.Constants.T_UNSET_CAST,
                re: /^\(unset\)/i
            },
            {
                value: PHP.Constants.T_TRY,
                re: /^try(?=\s*{)/i
            },
            {
                value: PHP.Constants.T_CATCH,
                re: /^catch(?=\s*\()/i
            },
            {
                value: PHP.Constants.T_INSTANCEOF,
                re: /^instanceof(?=\s)/i
            },
            {
                value: PHP.Constants.T_LOGICAL_OR,
                re: /^or(?=\s)/i
            },
            {
                value: PHP.Constants.T_LOGICAL_AND,
                re: /^and(?=\s)/i
            },
            {
                value: PHP.Constants.T_LOGICAL_XOR,
                re: /^xor(?=\s)/i
            },
            {
                value: PHP.Constants.T_BOOLEAN_AND,
                re: /^&&/
            },
            {
                value: PHP.Constants.T_BOOLEAN_OR,
                re: /^\|\|/
            },
            {
                value: PHP.Constants.T_CONTINUE,
                re: /^continue(?=\s|;)/i
            },
            {
                value: PHP.Constants.T_BREAK,
                re: /^break(?=\s|;)/i
            },
            {
                value: PHP.Constants.T_ENDDECLARE,
                re: /^enddeclare(?=\s|;)/i
            },
            {
                value: PHP.Constants.T_ENDFOR,
                re: /^endfor(?=\s|;)/i
            },
            {
                value: PHP.Constants.T_ENDFOREACH,
                re: /^endforeach(?=\s|;)/i
            },
            {
                value: PHP.Constants.T_ENDIF,
                re: /^endif(?=\s|;)/i
            },
            {
                value: PHP.Constants.T_ENDSWITCH,
                re: /^endswitch(?=\s|;)/i
            },
            {
                value: PHP.Constants.T_ENDWHILE,
                re: /^endwhile(?=\s|;)/i
            },
            {
                value: PHP.Constants.T_CASE,
                re: /^case(?=\s)/i
            },
            {
                value: PHP.Constants.T_DEFAULT,
                re: /^default(?=\s|:)/i
            },
            {
                value: PHP.Constants.T_SWITCH,
                re: /^switch(?=[ (])/i
            },
            {
                value: PHP.Constants.T_EXIT,
                re: /^(exit|die)(?=[ \(;])/i
            },
            {
                value: PHP.Constants.T_CLOSE_TAG,
                re: /^(\?\>|\%\>|\<\/script\>)\s?\s?/i,
                func: function( result ) {
                    insidePHP = false;
                    return result;
                }
            },
            {
                value: PHP.Constants.T_DOUBLE_ARROW,
                re: /^\=\>/
            },
            {
                value: PHP.Constants.T_DOUBLE_COLON,
                re: /^\:\:/
            },
            {
                value: PHP.Constants.T_METHOD_C,
                re: /^__METHOD__/
            },
            {
                value: PHP.Constants.T_LINE,
                re: /^__LINE__/
            },
            {
                value: PHP.Constants.T_FILE,
                re: /^__FILE__/
            },
            {
                value: PHP.Constants.T_FUNC_C,
                re: /^__FUNCTION__/
            },
            {
                value: PHP.Constants.T_NS_C,
                re: /^__NAMESPACE__/
            },
            {
                value: PHP.Constants.T_TRAIT_C,
                re: /^__TRAIT__/
            },
            {
                value: PHP.Constants.T_DIR,
                re: /^__DIR__/
            },
            {
                value: PHP.Constants.T_CLASS_C,
                re: /^__CLASS__/
            },
            {
                value: PHP.Constants.T_INC,
                re: /^\+\+/
            },
            {
                value: PHP.Constants.T_DEC,
                re: /^\-\-/
            },
            {
                value: PHP.Constants.T_CONCAT_EQUAL,
                re: /^\.\=/
            },
            {
                value: PHP.Constants.T_DIV_EQUAL,
                re: /^\/\=/
            },
            {
                value: PHP.Constants.T_XOR_EQUAL,
                re: /^\^\=/
            },
            {
                value: PHP.Constants.T_MUL_EQUAL,
                re: /^\*\=/
            },
            {
                value: PHP.Constants.T_MOD_EQUAL,
                re: /^\%\=/
            },
            {
                value: PHP.Constants.T_SL_EQUAL,
                re: /^<<=/
            },
            {
                value: PHP.Constants.T_START_HEREDOC,
                re: /^<<<[A-Z_0-9]+\s/i,
                func: function( result ){
                    heredoc = result.substring(3, result.length - 1);
                    return result;
                }
            },
            {
                value: PHP.Constants.T_SL,
                re: /^<</
            },
            {
                value: PHP.Constants.T_IS_SMALLER_OR_EQUAL,
                re: /^<=/
            },
            {
                value: PHP.Constants.T_SR_EQUAL,
                re: /^>>=/
            },
            {
                value: PHP.Constants.T_SR,
                re: /^>>/
            },
            {
                value: PHP.Constants.T_IS_GREATER_OR_EQUAL,
                re: /^>=/
            },
            {
                value: PHP.Constants.T_OR_EQUAL,
                re: /^\|\=/
            },
            {
                value: PHP.Constants.T_PLUS_EQUAL,
                re: /^\+\=/
            },
            {
                value: PHP.Constants.T_MINUS_EQUAL,
                re: /^-\=/
            },
            {
                value: PHP.Constants.T_OBJECT_OPERATOR,
                re: /^\-\>/i
            },
            {
                value: PHP.Constants.T_CLASS,
                re: /^class(?=[\s\{])/i,
                afterWhitespace: true
            },
            {
                value: PHP.Constants.T_TRAIT,
                re: /^trait(?=[\s]+[A-Za-z])/i,
            },
            {
                value: PHP.Constants.T_PUBLIC,
                re: /^public(?=[\s])/i
            },
            {
                value: PHP.Constants.T_PRIVATE,
                re: /^private(?=[\s])/i
            },
            {
                value: PHP.Constants.T_PROTECTED,
                re: /^protected(?=[\s])/i
            },
            {
                value: PHP.Constants.T_ARRAY,
                re: /^array(?=\s*?\()/i
            },
            {
                value: PHP.Constants.T_EMPTY,
                re: /^empty(?=[ \(])/i
            },
            {
                value: PHP.Constants.T_ISSET,
                re: /^isset(?=[ \(])/i
            },
            {
                value: PHP.Constants.T_UNSET,
                re: /^unset(?=[ \(])/i
            },
            {
                value: PHP.Constants.T_RETURN,
                re: /^return(?=[ "'(;])/i
            },
            {
                value: PHP.Constants.T_FUNCTION,
                re: /^function(?=[ "'(;])/i
            },
            {
                value: PHP.Constants.T_ECHO,
                re: /^echo(?=[ "'(;])/i
            },
            {
                value: PHP.Constants.T_LIST,
                re: /^list(?=\s*?\()/i
            },
            {
                value: PHP.Constants.T_PRINT,
                re: /^print(?=[ "'(;])/i
            },
            {
                value: PHP.Constants.T_INCLUDE,
                re: /^include(?=[ "'(;])/i
            },
            {
                value: PHP.Constants.T_INCLUDE_ONCE,
                re: /^include_once(?=[ "'(;])/i
            },
            {
                value: PHP.Constants.T_REQUIRE,
                re: /^require(?=[ "'(;])/i
            },
            {
                value: PHP.Constants.T_REQUIRE_ONCE,
                re: /^require_once(?=[ "'(;])/i
            },
            {
                value: PHP.Constants.T_NEW,
                re: /^new(?=[ ])/i
            },
            {
                value: PHP.Constants.T_COMMENT,
                re: /^\/\*([\S\s]*?)(?:\*\/|$)/
            },
            {
                value: PHP.Constants.T_COMMENT,
                re: /^\/\/.*(\s)?/
            },
            {
                value: PHP.Constants.T_COMMENT,
                re: /^\#.*(\s)?/
            },
            {
                value: PHP.Constants.T_ELSEIF,
                re: /^elseif(?=[\s(])/i
            },
            {
                value: PHP.Constants.T_GOTO,
                re: /^goto(?=[\s(])/i
            },
            {
                value: PHP.Constants.T_ELSE,
                re: /^else(?=[\s{:])/i
            },
            {
                value: PHP.Constants.T_IF,
                re: /^if(?=[\s(])/i
            },
            {
                value: PHP.Constants.T_DO,
                re: /^do(?=[ {])/i
            },
            {
                value: PHP.Constants.T_WHILE,
                re: /^while(?=[ (])/i
            },
            {
                value: PHP.Constants.T_FOREACH,
                re: /^foreach(?=[ (])/i
            },
            {
                value: PHP.Constants.T_ISSET,
                re: /^isset(?=[ (])/i
            },
            {
                value: PHP.Constants.T_IS_IDENTICAL,
                re: /^===/
            },
            {
                value: PHP.Constants.T_IS_EQUAL,
                re: /^==/
            },
            {
                value: PHP.Constants.T_IS_NOT_IDENTICAL,
                re: /^\!==/
            },
            {
                value: PHP.Constants.T_IS_NOT_EQUAL,
                re: /^(\!=|\<\>)/
            },
            {
                value: PHP.Constants.T_FOR,
                re: /^for(?=[ (])/i
            },

            {
                value: PHP.Constants.T_DNUMBER,
                re: /^[0-9]*\.[0-9]+([eE][-]?[0-9]*)?/
            /*,
        func: function( result ) {

            // transform e to E - token_get_all_variation1.phpt
            return (result - 0).toString().toUpperCase();
        }*/

            },
            {
                value: PHP.Constants.T_LNUMBER,
                re: /^(0x[0-9A-F]+|[0-9]+)/i
            },
            {
                value: PHP.Constants.T_OPEN_TAG_WITH_ECHO,
                re: /^(\<\?=|\<\%=)/i
            },
            {
                value: PHP.Constants.T_OPEN_TAG,
                re: openTagStart
            },
            {
                value: PHP.Constants.T_VARIABLE,
                re: /^\$[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*/
            },
            {
                value: PHP.Constants.T_WHITESPACE,
                re: /^\s+/
            },
            {
                value: PHP.Constants.T_CONSTANT_ENCAPSED_STRING,
                re: /^("(?:[^"\\]|\\[\s\S])*"|'(?:[^'\\]|\\[\s\S])*')/,
                func: function( result, token ) {

                    var curlyOpen = 0,
                    len,
                    bracketOpen = 0;

                    if (result.substring( 0,1 ) === "'") {
                        return result;
                    }

                    var match = result.match( /(?:[^\\]|\\.)*[^\\]\$[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*/g );
                    if ( match !== null ) {
                        // string has a variable

                        while( result.length > 0 ) {
                            len = result.length;
                            match = result.match( /^[\[\]\;\:\?\(\)\!\.\,\>\<\=\+\-\/\*\|\&\@\^\%\"\'\{\}]/ );

                            if ( match !== null ) {

                                results.push( match[ 0 ] );
                                result = result.substring( 1 );

                                if ( curlyOpen > 0 && match[ 0 ] === "}") {
                                    curlyOpen--;
                                }

                                if ( match[ 0 ] === "[" ) {
                                    bracketOpen++;
                                }

                                if ( match[ 0 ] === "]" ) {
                                    bracketOpen--;
                                }

                            }

                            match = result.match(/^\$[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*/);



                            if ( match !== null ) {

                                results.push([
                                    parseInt(PHP.Constants.T_VARIABLE, 10),
                                    match[ 0 ],
                                    line
                                    ]);

                                result = result.substring( match[ 0 ].length );

                                match = result.match(/^(\-\>)\s*([a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*)\s*(\()/);

                                if ( match !== null ) {

                                    results.push([
                                        parseInt(PHP.Constants.T_OBJECT_OPERATOR, 10),
                                        match[ 1 ],
                                        line
                                        ]);
                                    results.push([
                                        parseInt(PHP.Constants.T_STRING, 10),
                                        match[ 2 ],
                                        line
                                        ]);
                                    if (match[3])
                                        results.push(match[3]);
                                    result = result.substring( match[ 0 ].length );
                                }


                                if ( result.match( /^\[/g ) !== null ) {
                                    continue;
                                }
                            }

                            var re;
                            if ( curlyOpen > 0) {
                                re = /^([^\\\$"{}\]\(\)\->]|\\.)+/g;
                            } else {
                                re = /^([^\\\$"{]|\\.|{[^\$]|\$(?=[^a-zA-Z_\x7f-\uffff]))+/g;
                            }

                            var type, match2;
                            while(( match = result.match( re )) !== null ) {
                                if (result.length === 1) {
                                    throw new Error(match);
                                }
                                
                                type = 0;

                                if( curlyOpen > 0 ){
                                    if( match2 = match[0].match(/^[\[\]\;\:\?\(\)\!\.\,\>\<\=\+\-\/\*\|\&\{\}\@\^\%\$\~]/) ){
                                        results.push(match2[0]);
                                    }else{
                                        type = PHP.Constants.T_STRING;
                                    }
                                }else{
                                    type = PHP.Constants.T_ENCAPSED_AND_WHITESPACE;
                                }
                                
                                if( type ){
                                    results.push([
                                        parseInt(type, 10),
                                        match[ 0 ].replace(/\n/g,"\\n").replace(/\r/g,""),
                                        line
                                        ]);
                                }

                                line += match[ 0 ].split('\n').length - 1;

                                result = result.substring( match[ 0 ].length );
                            }

                            if( curlyOpen > 0 && result.match(/^\->/) !== null ) {
								results.push([
									parseInt(PHP.Constants.T_OBJECT_OPERATOR, 10),
									'->',
									line
								    ]);
                                result = result.substring( 2 );
                            }

                            if( result.match(/^{\$/) !== null ) {
                                results.push([
                                    parseInt(PHP.Constants.T_CURLY_OPEN, 10),
                                    "{",
                                    line
                                    ]);
                                result = result.substring( 1 );
                                curlyOpen++;
                            }

                            if (len === result.length) {
                                //  nothing has been found yet
                                if ((match =  result.match( /^(([^\\]|\\.)*?[^\\]\$[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*)/g )) !== null) {
                                    return;
                                }
                            }

                        }

                        return undefined;

                    } else {
                        result = result.replace(/\n/g,"\\n").replace(/\r/g,"");
                    }

                    /*
            if (result.match(/\r\n/) !== null) {
                var quote = result.substring(0, 1);

                result = '[' + result.split(/\r\n/).join( quote + "," + quote ) + '].join("\\n")';

            }
             */
                    return result;
                }
            },
            {
                value: PHP.Constants.T_NS_SEPARATOR,
                re: /^\\(?=[a-zA-Z_])/
            },
            {
                value: PHP.Constants.T_STRING,
                re: /^[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*/
            },
            {
                value: -1,
                re: /^[\[\]\;\:\?\(\)\!\.\,\>\<\=\+\-\/\*\|\&\{\}\@\^\%\"\'\$\~]/
            }];





            var results = [],
            line = 1,
            insidePHP = false,
            cancel = true;

            if ( src === null ) {
                return results;
            }

            if ( typeof src !== "string" ) {
                src = src.toString();
            }



            while (src.length > 0 && cancel === true) {

                if ( insidePHP === true ) {

                    if ( heredoc !== undefined ) {
                        // we are in a heredoc

                        var regexp = new RegExp('([\\S\\s]*)(\\r\\n|\\n|\\r)(' + heredoc + ')(;|\\r\\n|\\n)',"i");



                        var result = src.match( regexp );
                        if ( result !== null ) {
                            // contents

                            results.push([
                                parseInt(PHP.Constants.T_ENCAPSED_AND_WHITESPACE, 10),
                                result[ 1 ].replace(/^\n/g,"").replace(/\\\$/g,"$") + "\n",
                                line
                                ]);


                            // note the no - 1 for length as regexp include one line as well
                            line += result[ 1 ].split('\n').length;

                            // heredoc end tag
                            results.push([
                                parseInt(PHP.Constants.T_END_HEREDOC, 10),
                                result[ 3 ],
                                line
                                ]);

                            src = src.substring( result[1].length + result[2].length + result[3].length );
                            heredoc = undefined;
                        }

                        if (result === null) {
                            throw Error("sup");
                        }


                    } else {
                        cancel =  tokens.some(function( token ){
                            if ( token.afterWhitespace === true ) {
                                // check last
                                var last = results[ results.length - 1 ];
                                if ( !Array.isArray( last ) || (last[ 0 ] !== PHP.Constants.T_WHITESPACE && last[ 0 ] !== PHP.Constants.T_OPEN_TAG  && last[ 0 ] !== PHP.Constants.T_COMMENT)) {
                                    return false;
                                }
                            }
                            var result = src.match( token.re );

                            if ( result !== null ) {
                                if ( token.value !== -1) {
                                    var resultString = result[ 0 ];



                                    if (token.func !== undefined ) {
                                        resultString = token.func( resultString, token );
                                    }
                                    if (resultString !== undefined ) {

                                        results.push([
                                            parseInt(token.value, 10),
                                            resultString,
                                            line
                                            ]);
                                        line += resultString.split('\n').length - 1;
                                    }

                                } else {
                                    // character token
                                    results.push( result[ 0 ] );
                                }

                                src = src.substring(result[ 0 ].length);

                                return true;
                            }
                            return false;


                        });
                    }

                } else {

                    var result = openTag.exec( src );


                    if ( result !== null ) {
                        if ( result.index > 0 ) {
                            var resultString = src.substring(0, result.index);
                            results.push ([
                                parseInt(PHP.Constants.T_INLINE_HTML, 10),
                                resultString,
                                line
                                ]);

                            line += resultString.split('\n').length - 1;

                            src = src.substring( result.index );
                        }

                        insidePHP = true;
                    } else {

                        results.push ([
                            parseInt(PHP.Constants.T_INLINE_HTML, 10),
                            src.replace(/^\n/, ""),
                            line
                            ]);
                        return results;
                    }

                //    src = src.substring(result[ 0 ].length);

                }



            }



            return results;



        };

