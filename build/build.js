/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 9.7.2012 
* @website http://hertzen.com
 */


var fs = require('fs');

var files = require("../src/include.js");

var content = "", toAdd = {};

function includeFiles( path, obj ) {
    
    
    Object.keys( obj ).forEach(function( file ) {
        if ( obj[ file ] === "js" ) {
            
            content += fs.readFileSync( path + file + '.js', 'utf8') ;
        
            if (toAdd[ file ] !== undefined ) {
      
                toAdd[ file ].forEach(function( item ){
                   
                    content += fs.readFileSync( item + '.js', 'utf8') ;
                      
                })
            }
                               
        } else if ( Array.isArray( obj[ file ] ) ) {
            if (toAdd[ obj[ file ][ 0 ] ] === undefined) {
                toAdd[ obj[ file ][ 0 ] ] = [];
                        
            }
                
            toAdd[obj[ file ][ 0 ] ].push(path + file);
        } else {
            includeFiles( path + file + "/", obj[ file ] );
        }
    });

}

includeFiles("", files.files );


fs.writeFile('PHP.js', content, function (err) {
    if (err) throw err;
    console.log('PHP.js compiled');
  
    var args = process.argv.splice(2);
    if ( args[ 0 ] === "all") {
        
        fs.writeFile('build/tmp.js', "window.PHP = (function( undefined ) { " + content + "})();", function (err) {
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
 
