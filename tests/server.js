var http = require('http'),
fs = require('fs'),
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

// JSON.stringify(results) +
//return  JSON.stringify(re.exec(src)) + JSON.stringify(re.exec(src)) + JSON.stringify(re.exec(src));

}

http.createServer(function (req, res) {


    var urlParse = url.parse(req.url, true);


    if (urlParse.path.substring(0,5) === "/src/") {
        res.writeHead(200, {
            'Content-Type': 'application/javascript'
        });

        fs.readFile( urlParse.path.substring(1), function (err, data) {
            if (err) throw err;
            res.end( data );
        });
    } else {


        if (urlParse.query.file === undefined && urlParse.query.tests === undefined) {

            res.writeHead(200, {
                'Content-Type': 'text/html'
            });

            fs.readFile('tests/index.html', function (err, data) {
                if (err) throw err;
                res.end( data );
            });

        } else if ( urlParse.query.tests !== undefined  ) {
            res.writeHead(200, {
                'Content-Type': 'application/json'
            });
            fs.readdir("tests/php/" + urlParse.query.tests, function( err, files ) {
                if (err) throw err;
                res.end( JSON.stringify( files ));
            });
        } else  {

            res.writeHead(200, {
                'Content-Type': 'application/json'
            });
            
            fs.readFile('tests/' + urlParse.query.file, function (err, data) {
                if (err) throw err;
                res.end( JSON.stringify( parsePHPT( data ) ));
            }); 
            
            
        }
    }

}).listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');