/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 1.7.2012 
* @website http://hertzen.com
 */

PHP.VM.ResourceManager = function() {
    
    
    var resources = [],
    RESOURCE = PHP.VM.ResourceManager.prototype,
    id = 0,
    methods = {};
    
    methods[ RESOURCE.REGISTER ] = function() {

        var resource = new PHP.VM.Resource( id++ );
        resources.push( resource );
        

        return resource;
        
    };
    
    
    return methods;
       
    
};

PHP.VM.ResourceManager.prototype.ID = "$Id";

PHP.VM.ResourceManager.prototype.REGISTER = "$Register";

PHP.VM.Resource = function( id ) {
    this[ PHP.VM.ResourceManager.prototype.ID ] = id;
    
};