/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 4.7.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.print = function( variable ) {
    this.echo( variable );
    return new PHP.VM.Variable(1);
};