/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 3.7.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.mktime = function( hour, minute, second, month, day, year, is_dst ) {
    
    var date = new Date(),
    COMPILER = PHP.Compiler.prototype;
    
    hour = ( hour === undefined ) ?  date.getHours()  : hour[ COMPILER.VARIABLE_VALUE ];
    minute = ( minute === undefined ) ?  date.getMinutes() : minute[ COMPILER.VARIABLE_VALUE ]; 
    second = ( second === undefined ) ? date.getSeconds()  : second[ COMPILER.VARIABLE_VALUE ];
    month = ( month === undefined ) ?  date.getMonth() : month[ COMPILER.VARIABLE_VALUE ];
    day = ( day === undefined ) ?  date.getDay() : day[ COMPILER.VARIABLE_VALUE ];
    year = ( year === undefined ) ?  date.getFullYear() : year[ COMPILER.VARIABLE_VALUE ];
    
    
    var createDate = new Date(year, month, day, hour, minute, second);
    
    
    return new PHP.VM.Variable( Math.round( createDate.getTime() / 1000 ) );
};