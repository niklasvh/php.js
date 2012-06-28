/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 26.6.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.array = function( ) {
    
    var arr;
   
    if ( Array.isArray( arguments[ 0 ]) ) {
        arr = new (this.$Class.Get("ArrayObject"))( this, arguments[ 0 ] );
    } else {
        arr = new (this.$Class.Get("ArrayObject"))( this );
    }
   
    return new PHP.VM.Variable( arr );
    
};