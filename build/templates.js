/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 9.7.2012 
* @website http://hertzen.com
 */


var fs = require('fs');
var PHP = {};
var files = {
        
    core: "js",
        
                
    compiler: {
        compiler: "js",
        expr: "js",
        stmt: "js",
        scalar: "js"
    }
};

function includeFiles( path, obj ) {
    

    Object.keys( obj ).forEach(function( file ) {
        if ( obj[ file ] === "js" ) {
            require( path + file + '.js');
        } else {
            includeFiles( path + file + "/", obj[ file ] );
        }
    });

}

includeFiles("../src/", files);

console.log( files );