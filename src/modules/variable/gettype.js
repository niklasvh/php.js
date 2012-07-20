/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 20.7.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.gettype = function( arg ) {

    var COMPILER = PHP.Compiler.prototype,
    VARIABLE = PHP.VM.Variable.prototype;



    var tmp = arg[ COMPILER.VARIABLE_VALUE ], // trigger get
    type = "unknown type";
    
    switch ( arg[ VARIABLE.TYPE ]) {
        
        case VARIABLE.BOOL:
            type = "boolean";
            break;
        case VARIABLE.INT:
            type = "integer";
            break;
        case VARIABLE.FLOAT:
            type = "double";
            break;
        case VARIABLE.STRING:
            type =  "string";
            break;
        case VARIABLE.ARRAY:
            type = "array";
            break;
        case VARIABLE.OBJECT:
            type = "object";
            break;
        case VARIABLE.RESOURCE:
            type = "resource";
            break;
        case VARIABLE.NULL:
            type = "NULL";
            break;
                   
               
        
    }
        
    return new PHP.VM.Variable( type );


};
