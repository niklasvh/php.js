

(function( d ){

    // files to include
    var files = {
        core: "js",
        modules: {
            tokenizer: {
                constants: "js",
                core: "js",
                token_name: "js"
            }
            
        },
        parser: {
            parser: "js"
        }
    };
    
    
    function writeFile( path, obj ) {
        Object.keys( obj ).forEach(function( file ) {
            if ( obj[ file ] === "js" ) {
                d.write('<script src="' + path + file + '.js"></script>');
            } else {
                writeFile( path + file + "/", obj[ file ] );
            }
        });
    }
    
    writeFile( "../src/", files);
    

    
})( document )