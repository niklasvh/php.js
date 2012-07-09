/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 9.7.2012 
* @website http://hertzen.com
 */


var fs = require('fs'),
url = require("url");

function parsePHPT( src ) {



    var types = ["TEST","DESCRIPTION","CREDITS","SKIPIF","REQUEST","POST","PUT","POST_RAW","GZIP_POST","DEFLATE_POST","GET","COOKIE","STDIN","INI","ARGS","ENV","FILE","FILEEOF","FILE_EXTERNAL","REDIRECTTEST","HEADERS","CGI","XFAIL","EXPECTHEADERS","EXPECT","EXPECTF","EXPECTREGEX","CLEAN","EXPECTTOKEN"];

    var re = new RegExp("--(" + types.join("|") + ")--\\s+");

    var results = src.toString().split( re ).slice(1);

    var result = {};

    for (var i = 0, len = results.length; i < len; i+=2) {
        result[ results[ i ].trim() ] = results[ i + 1 ];
    }


    return  result;


}

var failed = [],
total = 0,
len,
items,
i,
globalPath,
success = 0;


var logger = console.log;

console.log=function(){};

function runTest ( file, complete ) {




    fs.readFile(file, function (err, data) {
        if (err) throw err;
        var test = parsePHPT( data );
        
         var content = fs.readFileSync( 'PHP.js', 'utf8') ;

            eval( content );
        
        var engine = {},
        opts = {
            POST: ( test.POST !== undefined ) ? PHP.Utils.QueryString( test.POST ) : {},
            GET: ( test.GET !== undefined ) ? PHP.Utils.QueryString( test.GET ) : {},
            SERVER: {
                SCRIPT_FILENAME: file.substring(0, file.length - 1)
            }
        };
                    
                   
                    
        if (test.ARGS !== undefined ) {
            var args = test.ARGS.trim().split(/\s/);
                       
            args.unshift( file ); // first argument is filename
                        
            opts.SERVER.argc = args.length;
            opts.SERVER.argv = args;
                        
        } else if (test.GET !== undefined) {
            var args = test.GET.replace(/\+/g," ").trim().split(/\s/);
            opts.SERVER.argc = args.length;
            opts.SERVER.argv = args;
        }
                    
        opts.filesystem = fs;
                    
        try {
           
            engine = new PHP( PHP.Lexer(test.FILE), opts );
              
            var expect = ((test.EXPECT === undefined) ? test.EXPECTF : test.EXPECT ).trim(),
            output = engine.vm.OUTPUT_BUFFER.replace(/\n/g, "\r\n").trim(),
            expectResult;
                    
            if (test.EXPECT === undefined ) {
                var shouldBef = expect.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
                shouldBef = shouldBef.replace(/\%d/g,"\\d+");
                shouldBef = shouldBef.replace(/\%s/g,"\\S+");
                shouldBef = shouldBef.replace(/\%S/g,".*?");
                        
                var re = new RegExp("^" + shouldBef + "$", "i");
                         
                expectResult = re.test( output );
                        
            } else {
                expectResult = (expect === output);
            }
            
                                
            if ( expectResult ) {
                logger( "SUCCESS " + items[ i ] );
                success++;
            } else {
                logger( "FAILED " + items[ i ] );
                failed.push( file );        
            }
        
        
        }
        catch(e) {
            logger( "FAILED " + items[ i ] );
            failed.push( file );
        }
        total++;
        
        if ( ++i < len ) {
            
            runTest( globalPath + "/" + items[ i ], complete );
        } else {
            complete();
          
            
        }
        
        
        
    }); 
            
}




var p = 0;

function runTests( paths, complete ) {

    globalPath = paths[ p++ ];
       
    fs.readdir( globalPath, function( err, files ) {
        if (err) throw err;
        items = files.filter(function( file ) {
            return (file.substr(-5) === ".phpt");
        });
        len = items.length;
        i = 0;
        
        runTest( globalPath + "/" + items[ i++ ], function() {
            if ( p < paths.length ) {
                runTests( paths, complete);
            } else {
                complete();
            }  
        } );
    
    });

}

runTests( [ "tests/php/basic", "tests/php/classes", "tests/php/func", "tests/php/lang", "tests/php/output", "tests/php/run-test", "tests/php/strings", "tests/php/ext/tokenizer" ], function() {
    var content = "### Test results ###\n\nPassed " + success + " out of " + total + " (" + Math.round( (success/total) * 1000 ) / 10 + "%)\n\nFailed tests:\n\n - " + failed.join("\n - ");
            
            
    fs.writeFile('tests/readme.md', content, function (err) {
        if (err) throw err;
        logger('status updated');
    });   
} );