# Node-minify

  A very light minifier NodeJS module.

  Support:

  - YUI Compressor --version 2.4.7

  - Google Closure Compiler --version 1918

  - UglifyJS

  It allow you to compress JavaScript and CSS files.

  I recommend to execute it at boot time for production use.

  See `server.js` in `examples/`.

## Installation

```bash
npm install node-minify
```

## Quick Start

```js
var compressor = require('node-minify');

// Using Google Closure
new compressor.minify({
	type: 'gcc',
	fileIn: 'public/js/base.js',
	fileOut: 'public/js/base-min-gcc.js',
	callback: function(err){
		console.log(err);
	}
});

// Array
new compressor.minify({
	type: 'gcc',
	fileIn: ['public/js/base.js', 'public/js/base2.js'],
	fileOut: 'public/js/base-onefile-gcc.js',
	callback: function(err){
		console.log(err);
	}
});

// Only concatenation of files (no compression)
new compressor.minify({
    type: 'no-compress',
    fileIn: ['public/js/base.js', 'public/js/base2.js'],
    fileOut: 'public/js/base-onefile-gcc.js',
    callback: function(err){
        console.log(err);
    }
});

// Using YUI Compressor for CSS
new compressor.minify({
	type: 'yui-css',
	fileIn: 'public/css/base.css',
	fileOut: 'public/css/base-min-yui.css',
	callback: function(err){
		console.log(err);
	}
});

// Using YUI Compressor for JS
new compressor.minify({
	type: 'yui-js',
	fileIn: 'public/js/base.js',
	fileOut: 'public/js/base-min-yui.js',
	callback: function(err){
		console.log(err);
	}
});

// Using UglifyJS
new compressor.minify({
	type: 'uglifyjs',
	fileIn: 'public/js/base.js',
	fileOut: 'public/js/base-onefile-uglify.js',
	callback: function(err){
		console.log(err);
	}
});
```

## Concatenate Files

In order to concatenate files, simply pass in an array with the file paths to `fileIn`.

```js
fileIn: ['public/js/base.js', 'public/js/base2.js', ...]
```

## Max Buffer Size

In some cases you might need a bigger max buffer size (for example when minifying really large files).
By default the buffer is `1000 * 1024` which should be enough. If you however need more buffer, you can simply pass in the desired buffer size as an argument to `compressor.minify` like so:

```js
new compressor.minify({
	type: 'uglifyjs',
	fileIn: './public/css/base.css',
	fileOut: './public/css/base-min-uglifyjs.css',
	buffer: 1000 * 1024,
	callback: function(err){
		console.log(err);
	}
});
```

## Temp Path

You can define a temporary folder where temporary files will be generated :

```js
new compressor.minify({
	type: 'yui-js',
	fileIn: 'public/js/base.js',
	fileOut: 'public/js/base-min-yui.js',
	tempPath: '/tmp',
	callback: function(err){
		console.log(err);
	}
});
```

## YUI Compressor

  Yahoo Compressor can compress both JavaScript and CSS files.

  http://developer.yahoo.com/yui/compressor/

## Google Closure Compiler

  Google Closure Compiler can compress only JavaScript files.

  It will throw an error if you try with CSS files.

  http://code.google.com/closure/compiler

## UglifyJS

  UglifyJS can compress only JavaScript files.

  It will throw an error if you try with CSS files.

  https://github.com/mishoo/UglifyJS

## Warning

  It assumes you have Java installed on your environment for both GCC and YUI Compressor. To check, run:

```bash
java -version
```