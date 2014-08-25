var express = require('express');
var fs = require('fs');
var app = express();

function parsePHPT(src) {
    var types = ["TEST","DESCRIPTION","CREDITS","SKIPIF","REQUEST","POST","PUT","POST_RAW","GZIP_POST","DEFLATE_POST","GET","COOKIE","STDIN",
        "INI","ARGS","ENV","FILE","FILEEOF","FILE_EXTERNAL","REDIRECTTEST","HEADERS","CGI","XFAIL","EXPECTHEADERS","EXPECT","EXPECTF","EXPECTREGEX","CLEAN","EXPECTTOKEN"];
    var re = new RegExp("--(" + types.join("|") + ")--\\s+");
    var results = src.toString().split(re).slice(1);
    var result = {};

    for (var i = 0, len = results.length; i < len; i+=2) {
        result[ results[ i ].trim() ] = results[ i + 1 ];
    }

    return  result;
}


app.use('/', express.static(__dirname));

app.use('/mocha', express.static(__dirname + '/../node_modules/mocha'));
app.use('/expect', express.static(__dirname + '/../node_modules/expect.js'));
app.use('/phantomjs', express.static(__dirname + '/../node_modules/grunt-mocha/phantomjs/'));
app.use('/dist', express.static(__dirname + '/../dist'));
app.use('/cfg', express.static(__dirname + '/../cfg'));
app.use('/adapters', express.static(__dirname + '/../adapters'));
app.use('/php', express.static(__dirname + '/php/'));

var testHandler = express.Router();
testHandler.get('*', function(req, res) {
    var path = __dirname + "/php" + req.path;
    fs.readdir(path, function(err, files) {
        res.send("buildTests('" + req.path + "'," + JSON.stringify(files.map(function(file) {
            return path + "/" + file;
        }).filter(function(filename) {
            return fs.statSync(filename).isFile()
        }).map(function(filename) {
            var test = parsePHPT(fs.readFileSync(filename));
            test.path = filename.substring(__dirname.length);
            return test;
        })) + ")");
    });
});

app.use('/tests', testHandler);

app.listen(3000);
console.log("Test server running on port 3000");

