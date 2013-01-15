/*
 * @author Niklas von Hertzen <niklas at hertzen.com>
 * @created 22.7.2012
 * @website http://hertzen.com
 */
PHP.Modules.prototype.serialize = function( valueObj ) {

    var COMPILER = PHP.Compiler.prototype,
    serialize = "serialize",
    __sleep = "__sleep",
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

        }

        return str;

    }.bind( this ),
    value = valueObj[ COMPILER.VARIABLE_VALUE ];

    // serializable interface
    if( (value[ PHP.VM.Class.METHOD + serialize] ) !== undefined ) {
        item = value[ COMPILER.METHOD_CALL ]( this, serialize );

        if ( item[ VARIABLE.TYPE] !== VARIABLE.NULL && item[ VARIABLE.TYPE] !== VARIABLE.STRING  ) {
            this.ENV[ COMPILER.ERROR ](value[ COMPILER.CLASS_NAME ] + "::" + serialize + "() must return a string or NULL", PHP.Constants.E_ERROR, true );
            return new PHP.VM.Variable();
        }

    } else {

        item = value;

        if( (value[ PHP.VM.Class.METHOD + __sleep] ) !== undefined ) {
            item = value[ COMPILER.METHOD_CALL ]( this, __sleep );

            if ( item[ VARIABLE.TYPE] !== VARIABLE.ARRAY  ) {
                this.ENV[ COMPILER.ERROR ](value[ COMPILER.CLASS_NAME ] + "::" + serialize + "() must return a string or NULL", PHP.Constants.E_ERROR, true );
                return new PHP.VM.Variable();
            }

            item[ COMPILER.VARIABLE_VALUE ][ PHP.VM.Class.PROPERTY + PHP.VM.Array.prototype.VALUES ][ COMPILER.VARIABLE_VALUE ].forEach( function( member ){

                if ( value[ PHP.VM.Class.PROPERTY + member[ COMPILER.VARIABLE_VALUE ]] === undefined ) {
                    this.ENV[ COMPILER.ERROR ](serialize + '(): "' + member[ COMPILER.VARIABLE_VALUE ] + '" returned as member variable from ' + __sleep + "() but does not exist", PHP.Constants.E_NOTICE, true );
                }


            }, this);

            str += "O:" + value[ COMPILER.CLASS_NAME ].length + ':"' + value[ COMPILER.CLASS_NAME ] + '":';



        }

    }

    if ( item instanceof PHP.VM.Variable ) {
        if( item[ VARIABLE.TYPE ] === VARIABLE.ARRAY ) {
            var arr = item[ COMPILER.VARIABLE_VALUE ][ PHP.VM.Class.PROPERTY + PHP.VM.Array.prototype.VALUES ][ COMPILER.VARIABLE_VALUE ];
            str += arr.length + ":{";
            arr.forEach(function( arrItem ){

                if(( value[ PHP.VM.Class.PROPERTY_TYPE + arrItem[ COMPILER.VARIABLE_VALUE ]] & PHP.VM.Class.PRIVATE) === PHP.VM.Class.PRIVATE) {
                    str += "s:" + (2 + value[ COMPILER.CLASS_NAME ].length + arrItem[ COMPILER.VARIABLE_VALUE ].length) + ":";
                    str += '"\\0' + value[ COMPILER.CLASS_NAME ] + "\\0" + arrItem[ COMPILER.VARIABLE_VALUE ] +'";';
                } else if (( value[ PHP.VM.Class.PROPERTY_TYPE + arrItem[ COMPILER.VARIABLE_VALUE ]] & PHP.VM.Class.PROTECTED) === PHP.VM.Class.PROTECTED) {
                    str += "s:" + (3 + arrItem[ COMPILER.VARIABLE_VALUE ].length) + ":";
                    str += '"\\0*\\0'  + arrItem[ COMPILER.VARIABLE_VALUE ] +'";';
                } else {
                    str += "s:" + (arrItem[ COMPILER.VARIABLE_VALUE ].length) + ":";
                    str += '"'  + arrItem[ COMPILER.VARIABLE_VALUE ] +'";';
                }

                var tmp = value[ PHP.VM.Class.PROPERTY + arrItem[ COMPILER.VARIABLE_VALUE ]];

                if ( tmp !== undefined ) {
                    tmp = tmp[ COMPILER.VARIABLE_VALUE ];
                    str += "s:" + tmp.length + ':"' + tmp + '";';
                }else {
                    str += "N;";
                }


            });
            str += "}"
        } else if ( item[ VARIABLE.TYPE] !== VARIABLE.NULL ) {
            str += "C:" + value[ COMPILER.CLASS_NAME ].length + ':"' + value[ COMPILER.CLASS_NAME ] + '":' + func( item );
        } else {
            str += "N;"
        }

    }


    return new PHP.VM.Variable( str );



};


