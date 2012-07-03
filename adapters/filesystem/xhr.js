/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 3.7.2012 
* @website http://hertzen.com
 */


PHP.Adapters.XHRFileSystem = function() {
    
    
    }; 

PHP.Adapters.XHRFileSystem.prototype.readFileSync = function( filename ) {
    var xhr = new XMLHttpRequest();
    
    xhr.open('GET', filename, false); // async set to false!
    
    var response; 
    xhr.onload = function() {
        response = this.response; 
   
    };

    xhr.send();
    
    return response;

    
};