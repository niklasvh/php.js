/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 9.7.2012 
* @website http://hertzen.com
 */


var fs = require('fs');

var files = require("../src/include.js");

var content = "";

function includeFiles( path, obj ) {
    

    Object.keys( obj ).forEach(function( file ) {
        if ( obj[ file ] === "js" ) {
            
            content += fs.readFileSync( path + file + '.js', 'utf8') ;
        
           
        } else {
            includeFiles( path + file + "/", obj[ file ] );
        }
    });

}

includeFiles("src/", files.files );


fs.writeFile('PHP.js', content, function (err) {
    if (err) throw err;
    console.log('PHP.js compiled');
  
    var args = process.argv.splice(2);
    if ( args[ 0 ] === "all") {
        
        fs.writeFile('build/tmp.js', "var PHP = (function( undefined ) { " + content + "})();", function (err) {
            if (err) throw err;
       
            var compressor = require('node-minify');

            // Using Google Closure
            new compressor.minify({
                type: 'gcc',
                fileIn: 'build/tmp.js',
                fileOut: 'PHP.min.js',
                callback: function(err){
            
                    if (err) throw err;
                    
                    fs.unlink('build/tmp.js', function (err) {
                        if (err) throw err;
                    });
                    
                    console.log("PHP-min.js compiled");
                }
              
            
            });
        });
    }
    
  
});
 
