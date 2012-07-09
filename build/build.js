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
  console.log('php.js compiled');
});
 
