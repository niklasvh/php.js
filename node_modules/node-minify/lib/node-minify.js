var minify = (function(undefined) {

	var exec = require('child_process').exec,
			_fs = require('fs');

	var minify = function(options) {
		this.type = options.type;
		this.tempFile = (options.tempPath || '') + new Date().getTime().toString();

		if(options.type == 'gcc' && typeof options.fileIn === 'string') {
			this.fileIn = [options.fileIn];
		}
		else if(typeof options.fileIn === 'string') {
			this.fileIn = options.fileIn;
		}

		if(typeof options.fileIn === 'object' && options.fileIn instanceof Array && options.type != 'gcc') {
			var out = options.fileIn.map(function(path) {
				return _fs.readFileSync(path, 'utf8');
			});

			_fs.writeFileSync(this.tempFile, out.join('\n'), 'utf8');

			this.fileIn = this.tempFile;
		}
		else if(typeof options.fileIn === 'object' && options.fileIn instanceof Array && options.type == 'gcc') {
			this.fileIn = options.fileIn;
		}


		this.fileOut = options.fileOut;
		this.options = options.options || [];
		this.buffer = options.buffer || 1000 * 1024;
		if (typeof options.callback !== 'undefined') {
			this.callback = options.callback;
		}

		this.compress();
	};

	minify.prototype = minify.fn = {
		type: null,
		fileIn: null,
		fileOut: null,
		callback: null,
		buffer: null, // with larger files you will need a bigger buffer for closure compiler
		compress: function() {
			var self = this, command;


			switch (this.type) {
				case 'yui':
				case 'yui-css':
					command = 'java -jar -Xss2048k "' + __dirname + '/yuicompressor-2.4.7.jar" "' + this.fileIn + '" -o "' + this.fileOut + '" --type css ' + this.options.join(' ');
					break;
				case 'yui-js':
					command = 'java -jar -Xss2048k "' + __dirname + '/yuicompressor-2.4.7.jar" "' + this.fileIn + '" -o "' + this.fileOut + '" --type js ' + this.options.join(' ');
					break;
				case 'gcc':
					var fileInCommand = this.fileIn.map(function(file) {
						return '--js="' + file + '"';
					});
					command = 'java -jar "' + __dirname + '/google_closure_compiler-r1918.jar" ' + fileInCommand.join(' ') + ' --js_output_file="' + this.fileOut + '" ' + this.options.join(' ');
					break;
				case 'uglifyjs':
					command = '"' + __dirname  + '/../node_modules/uglify-js/bin/uglifyjs" --output "' + this.fileOut + '" --no-copyright "' + this.fileIn + '" ' + this.options.join(' ');
					break;
				// Useful when wanting only to concatenate the files and not to compress them
				case 'no-compress':
					command = 'cp ' + this.fileIn + ' ' + this.fileOut;
					break;
			}

			exec(command, { maxBuffer: this.buffer }, function (err, stdout, stderr) {
				//console.log(err);
				//console.log(stdout);
				//console.log(stderr);

				if(self.fileIn === self.tempFile) {
					// remove the temp concat file here
					_fs.unlinkSync(self.tempFile);
				}

				if(self.callback){
					if (err) {
						self.callback(err);
					} else {
						self.callback(null);
					}
				}
			});
		}
	};

	return minify;

})();

exports.version = '0.4.2';
exports.minify = minify;