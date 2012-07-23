/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 23.7.2012 
* @website http://hertzen.com
 */



function writeFile( path, obj ) {
    Object.keys( obj ).forEach(function( file ) {
        if ( obj[ file ] === "js" ) {
            importScripts(path + file + '.js');
        } else {
            writeFile( path + file + "/", obj[ file ] );
        }
    });
}


var console = {
    log: function() {}
};


self.addEventListener('message', function(e) {
    
    
    switch( e.data.type ) {
        case "import":
            writeFile( "", e.data.content);
            
            break;
        case "run":
            var vm = new PHP.VM( e.data.content[ 0 ], e.data.content[ 1 ] );
            vm.Run();
            
            self.postMessage({
                type: "complete",
                content: {
                    OUTPUT_BUFFER:vm.OUTPUT_BUFFER
                }
            });
            
            break;
            
        case "stop":
            self.postMessage({
                type: "unknown",
                content: {
                    OUTPUT_BUFFER:vm.OUTPUT_BUFFER
                }
            });
            
            break;
    }
    
    
    
    
    
}, false);