/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 5.7.2012 
* @website http://hertzen.com
 */


PHP.Halt = function( msg, level, lineAppend, catchable  ) {
    
    this.msg = msg;
    this.level = level;
    this.lineAppend = lineAppend;
    this.catchable = catchable;
    
};