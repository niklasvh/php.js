PHP.Lexer = function( src ) {
    
    
    var tokens = [
    {
        value: PHP.Constants.T_ABSTRACT,
        re: /^abstract\s/i
    },
    {
        value: PHP.Constants.T_EXTENDS,
        re: /^extends\s/i
    },
    {
        value: PHP.Constants.T_AND_EQUAL,
        re: /^&=/
    },
    {
        value: PHP.Constants.T_AS,
        re: /^as\s/i
    },
    {
        value: PHP.Constants.T_CLOSE_TAG,
        re: /^(\?\>|\%\>)/
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
        value: PHP.Constants.T_CONCAT_EQUAL,
        re: /^\.\=/
    },  
    {
        value: PHP.Constants.T_OBJECT_OPERATOR,
        re: /^\-\>/i
    }, 
    {
        value: PHP.Constants.T_CLASS,
        re: /^class(?=[\s\{])/i
    },
    {
        value: PHP.Constants.T_PUBLIC,
        re: /^public(?=[\s])/i
    },
    {
        value: PHP.Constants.T_ARRAY,
        re: /^array(?=[ \(])/i
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
        value: PHP.Constants.T_NEW,
        re: /^new(?=[ ])/i
    },
    {
        value: PHP.Constants.T_COMMENT,
        re: /^\/\*(.|\s)*?\*\//
    }, 
    {
        value: PHP.Constants.T_COMMENT,
        re: /^\/\/.*/
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
        value: PHP.Constants.T_FOR,
        re: /^for(?=[ (])/i
    },
    {
        value: PHP.Constants.T_DNUMBER,
        re: /^[-]?[0-9]*\.[0-9]+([eE][-]?[0-9]*)?/
        
    },
    {
        value: PHP.Constants.T_LNUMBER,
        re: /^(0x[0-9A-F]+|[-]?[0-9]+)/i
    },
    {
        value: PHP.Constants.T_OPEN_TAG,
        re: /^(\<\?php\s|\<\?\s|\<%\s)/i
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
        re: /^("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/
    },
    {
        value: PHP.Constants.T_STRING,
        re: /^[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*/
    },
    {
        value: -1,
        re: /^[\[\]\;\:\?\(\)\!\.\,\>\<\=\+\-\/\*\|\&\{\}\@]/
    }];

    
    var results = [],
    line = 1,
    insidePHP = false,
    cancel = true;
    
    
    
    while (src.length >= 0 && cancel === true) {
        
        if ( insidePHP === true ) {
        
            cancel =  tokens.some(function( token ){
        
                var result = src.match( token.re );
        
                if ( result !== null ) {
                    if ( token.value !== -1) {
                        results.push([
                            parseInt(token.value, 10), 
                            result[ 0 ],
                            line
                            ]);
                        
                    } else {
                        results.push( result[ 0 ] );
                    }
                
                    src = src.substring(result[ 0 ].length);
                    //  console.log(result);
                    return true;
                }
                return false;
        
        
            });
        
        } else {
   
            var result = src.match(/(\s\S)*?(?=\<\?php\s|\<\?\s|\<%\s)/i);
           
            if ( result !== null ) {
                if (result[0].length > 0 ) {
                    console.log('add inline');
                }
                insidePHP = true;
            } else {
                results.push ([
                    parseInt(PHP.Constants.T_INLINE_HTML, 10), 
                    src,
                    line
                    ]);
                return results;
            }
            
            src = src.substring(result[ 0 ].length);
        //throw Error('sup')
        }

        
        
    }
    
    
    
    return results;
        
    

};

