var php_js = require('../php.js'),

fs = require('fs'),
url = require("url");

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

function parsePHPT(src) {
  var types = ["TEST","DESCRIPTION","CREDITS","SKIPIF","REQUEST","POST","PUT","POST_RAW","GZIP_POST",
  "DEFLATE_POST","GET","COOKIE","STDIN","INI","ARGS","ENV","FILE","FILEEOF","FILE_EXTERNAL",
  "REDIRECTTEST","HEADERS","CGI","XFAIL","EXPECTHEADERS","EXPECT","EXPECTF","EXPECTREGEX","CLEAN","EXPECTTOKEN"];
  var re = new RegExp("--(" + types.join("|") + ")--\\s+");

  var results = src.toString().split(re).slice(1);
  var result = {};

  for (var i = 0, len = results.length; i < len; i+=2) {
    result[ results[ i ].trim() ] = results[ i + 1 ];
  }

  return result;
}


var content = fs.readFileSync('PHP.js', 'utf8');

function runTest(file, test, unit) {
  unit.expect(1);

  eval( content + "GLOBAL.PHP = PHP; " );

  //var PHP = require('../PHP.js').PHP;

  var engine = {},
  opts = {
    POST: test.POST,
    RAW_POST: test.POST_RAW,
    GET: test.GET,
    SERVER: {
      SCRIPT_FILENAME: __dirname.replace(/\\/g,"/") + "/" + file.substring(5, file.length - 1)
    },
    ini: (test.INI !== undefined ) ? PHP.ini( test.INI ) : {},
  }, args;

  if (test.ARGS !== undefined ) {
    args = test.ARGS.trim().split(/\s/);
    args.unshift( file ); // first argument is filename
    opts.SERVER.argc = args.length;
    opts.SERVER.argv = args;
  } else if (test.GET !== undefined) {
    args = test.GET.replace(/\+/g," ").trim().split(/\s/);
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
    unit.equal(expectResult, true, file);
  }
  catch(e) {
    unit.equal(false, true, file);
  }

  unit.done();
}



["tests/php/basic", "tests/php/classes", "tests/php/func", "tests/php/lang",
  "tests/php/output", "tests/php/run-test", "tests/php/strings", "tests/php/ext/tokenizer"].forEach(function(name) {
    exports[name] = {};

    fs.readdirSync(name).filter(function(file) {
      return (file.substr(-5) === ".phpt");
    }).forEach(function(file) {
      exports[name][file] = runTest.bind(null, file, parsePHPT(fs.readFileSync(name + "/" + file)))
    });

  });
/*
 *

exports['awesome'] = {
  setUp: function(done) {
    // setup here
    done();
  },
  'no args': function(test) {
    test.expect(1);
    // tests here
    test.equal(php_js.awesome(), 'awesome', 'should be awesome.');
    test.done();
  }
};

runTests( [ "tests/php/basic", "tests/php/classes", "tests/php/func", "tests/php/lang", "tests/php/output", "tests/php/run-test", "tests/php/strings", "tests/php/ext/tokenizer" ], function() {
  var content = "### Test results ###\n\nPassed " + success + " out of " + total + " (" + Math.round( (success/total) * 1000 ) / 10 + "%)\n\nFailed tests:\n\n - " + failed.join("\n - ");


  fs.writeFile('tests/readme.md', content, function (err) {
    if (err) throw err;
    logger('status updated');
  });
} );*/
