var http = require('http'),
	compressor = require('../lib/node-minify');

http.createServer(function (req, res) {
	res.writeHead(200, {'Content-Type': 'text/plain'});
	res.end('Hello World\n');
}).listen(1337, "127.0.0.1");

new compressor.minify({
	type: 'gcc',
	fileIn: 'public/js/base.js',
	fileOut: 'public/js/base-onefile-gcc.js',
	callback: function(err){
		console.log('GCC one file');
		console.log(err);
	}
});

new compressor.minify({
	type: 'gcc',
	fileIn: ['public/js/base.js', 'public/js/base2.js'],
	fileOut: 'public/js/base-concat-gcc.js',
	callback: function(err){
		console.log('GCC multi files');
		console.log(err);
	}
});

// Using YUI Compressor
new compressor.minify({
    type: 'yui',
    fileIn: 'public/css/base.css',
    fileOut: 'public/css/base-min-yui.css',
    callback: function(err){
		console.log('YUI CSS');
        console.log(err);
    }
});

new compressor.minify({
    type: 'yui-js',
    fileIn: 'public/js/base.js',
    fileOut: 'public/js/base-min-yui.js',
    callback: function(err){
		console.log('YUI JS');
        console.log(err);
    }
});

// Using UglifyJS
new compressor.minify({
    type: 'uglifyjs',
	fileIn: 'public/js/base.js',
	fileOut: 'public/js/base-onefile-uglify.js',
    callback: function(err){
		console.log('Uglifyjs');
        console.log(err);
    }
});

new compressor.minify({
	type: 'no-compress',
	fileIn: ['public/js/base.js', 'public/js/base2.js'],
	fileOut: 'public/js/base-concat-no-compress.js',
	callback: function(err){
		console.log('No compress');
		console.log(err);
	}
});

console.log('Server running at http://127.0.0.1:1337/');