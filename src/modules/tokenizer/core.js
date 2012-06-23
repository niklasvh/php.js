PHP.Tokenizer = function( src ) {
    
    
    
    var keywords = [
        "abstract",
        "class",
        "constant",
        "die",
        "echo",
        "exit",
        "final",
        "function",
        "interface",
        "namespace",
        "new",
        "print",
        "private",
        "protected",
        "public",
        "static"
    ];
    
    
    var tags = [
        "<\\?php ",
        "<\\?= ",
        "<\\? ",        
        "\\?>",
        "\\s"
    ];
    
    var strings = [
        
        
    ];
    
    var characters = [
       "(",
       ")",
       "&",
       ",",
       ";",
       "="
    ]; 
    
    var re = new RegExp("^(" + keywords.join("|") + "|" + tags.join("|") + ")"),
    result = re.exec(src);
    
    while(result !== null) {
        src = src.substring( result[ 0 ].length );
        console.log(result.input);
        console.log(result);
        result = re.exec(src);
    }
    
    
    console.log(src);
    
};

