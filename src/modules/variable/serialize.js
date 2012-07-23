/* 
 * @author Niklas von Hertzen <niklas at hertzen.com>
 * @created 22.7.2012 
 * @website http://hertzen.com
 */
PHP.Modules.prototype.serialize = function( valueObj ) {

    var COMPILER = PHP.Compiler.prototype,
    serialize = "serialize",
    VARIABLE = PHP.VM.Variable.prototype;

    var item,
    str = "",
    func = function( item ) {
        var val  = item[ COMPILER.VARIABLE_VALUE ],
        str = "";

        switch( item[ VARIABLE.TYPE ] ) {
            
            case VARIABLE.NULL:
                str += "N;";
                break;
            
            case VARIABLE.STRING:
                
                str += val.length + ":{" + val + "}";
                
                
                break;
            default:
                console.log( val );
        }
        
        return str;
        
    }.bind( this ),
    value = valueObj[ COMPILER.VARIABLE_VALUE ];

    // serializable interface
    if( (value[ PHP.VM.Class.METHOD + serialize] ) !== undefined ) {
        item = value[ COMPILER.METHOD_CALL ]( this, serialize );
        
    }
    
    if ( item[ VARIABLE.TYPE] !== VARIABLE.NULL && item[ VARIABLE.TYPE] !== VARIABLE.STRING  ) {
           this.ENV[ COMPILER.ERROR ](value[ COMPILER.CLASS_NAME ] + "::" + serialize + "() must return a string or NULL", PHP.Constants.E_ERROR, true );   
           return new PHP.VM.Variable();
    }
    
    
    if ( item[ VARIABLE.TYPE] !== VARIABLE.NULL ) {
        str += "C:" + value[ COMPILER.CLASS_NAME ].length + ':"' + value[ COMPILER.CLASS_NAME ] + '":' + func( item );
    } else {
        str += "N;"
    }

   
    return new PHP.VM.Variable( str );
        


};


