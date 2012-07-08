/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 4.7.2012 
* @website http://hertzen.com
 */


PHP.VM.Class.Predefined.Exception = function( ENV) {
    
    // var COMPILER = PHP.Compiler.prototype,
    //  $this = this;
    
    ENV.$Class.New( "Exception", 0, {}, function( M ) {
        M.Create();
    });
    
    
};