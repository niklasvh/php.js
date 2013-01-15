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

    eval( content + "GLOBAL.PHP = PHP; " );

    var engine = {},
    /*
        opts = {
            POST: ( test.POST !== undefined ) ? PHP.Utils.QueryString( test.POST ) : {},
            GET: ( test.GET !== undefined ) ? PHP.Utils.QueryString( test.GET ) : {},
            SERVER: {
                SCRIPT_FILENAME: __dirname.replace(/\\/g,"/") + "/" + file.substring(5, file.length - 1)
            }
        },
          */

    opts = {
      POST: test.POST,
      RAW_POST: test.POST_RAW,
      GET: test.GET,
      //        POST: ( test.POST !== undefined ) ? PHP.Utils.QueryString( test.POST ) : (test.POST_RAW !== undefined ) ? RAW.Post() : {},
      //      GET: ( test.GET !== undefined ) ? PHP.Utils.QueryString( test.GET ) : {},
      //    RAW_POST: ( test.POST !== undefined ) ?  test.POST.trim()  : (test.POST_RAW !== undefined ) ? RAW.Raw() : "",
      SERVER: {
        SCRIPT_FILENAME: __dirname.replace(/\\/g,"/") + "/" + file.substring(5, file.length - 1)
      },
      ini: (test.INI !== undefined ) ? PHP.ini( test.INI ) : {},
    //       FILES: (test.POST_RAW !== undefined ) ? RAW.Files() : {}
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

      engine = new PHP( test.FILE || test.FILEEOF, opts );

      var expect = ((test.EXPECT === undefined) ? (( test.EXPECTF ===  undefined ) ? test.EXPECTREGEX  : test.EXPECTF) : test.EXPECT ).trim(),
      output = engine.vm.OUTPUT_BUFFER.replace(/\n/g, "\r\n").trim(),
      expectResult;


      expect = expect.replace(/\%unicode\|string\%/g, "string");  // Matches the string 'unicode' in PHP6 test output and 'string' in PHP5 test output.
      expect = expect.replace(/\%string\|unicode\%/g, "string");  // Matches the string 'unicode' in PHP6 test output and 'string' in PHP5 test output.

      expect = expect.replace(/\%u\|b\%/g, "");  // Matches a single 'u' in PHP6 test output where the PHP5 output from the same test hs no character in that position.

      var re;

      if ( test.EXPECTREGEX !== undefined ) {
        re = new RegExp("^" + expect + "$", "i");

        expectResult = re.test( output );

      } else if (test.EXPECT === undefined ) {

        var shouldBef = expect;

        shouldBef = shouldBef.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
        shouldBef = shouldBef.replace(/\%d/g,"\\d+");
        shouldBef = shouldBef.replace(/\%i/g,"(\\+|\\-)?\\d+");
        shouldBef = shouldBef.replace(/\%s/g,".+");
        shouldBef = shouldBef.replace(/\%c/g,".");
        shouldBef = shouldBef.replace(/\%S/g,".*?");
        shouldBef = shouldBef.replace(/\%x/g,"[0-9a-fA-F]+");
        shouldBef = shouldBef.replace(/\%f/g,"[-+]?[0-9]*\\.?[0-9]*");



        re = new RegExp("^" + shouldBef + "$", "i");

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