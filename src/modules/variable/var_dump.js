PHP.Modules.prototype.var_dump = function() {

    var str = "",
    indent = 0,
    COMPILER = PHP.Compiler.prototype,
    VAR = PHP.VM.Variable.prototype;

    var $dump = function( argument, indent ) {

        var str = "",
        value = argument[ COMPILER.VARIABLE_VALUE ],
        ARG_TYPE = argument[ VAR.TYPE ]; // trigger get for undefined
        str += $INDENT( indent );

        if( ARG_TYPE === VAR.NULL || (argument[ VAR.DEFINED ] !== true && !(argument instanceof PHP.VM.ClassPrototype)) ) {

            str += "NULL\n";
        } else if ( ARG_TYPE === VAR.ARRAY ) {
            str += "array(";

            var values = value[ PHP.VM.Class.PROPERTY + PHP.VM.Array.prototype.VALUES ][ COMPILER.VARIABLE_VALUE ];
            var keys = value[ PHP.VM.Class.PROPERTY + PHP.VM.Array.prototype.KEYS ][ COMPILER.VARIABLE_VALUE ];

            str += values.length;

            str += ") {\n";

            keys.forEach(function( key, index ){

                if (key instanceof PHP.VM.Variable) {
                    key = key[ COMPILER.VARIABLE_VALUE ];
                }

                str += $INDENT( indent + 2 ) + "[";
                if ( typeof key === "string" ) {
                    str += '"' + key + '"';
                } else {
                    str += key;
                }
                str += "]=>\n";
                str += $dump( values[ index ], indent + 2 );

            }, this);

            str += $INDENT( indent ) + "}\n";
        } else if( ARG_TYPE === VAR.BOOL ) {
            str += "bool(" + value + ")\n";
        } else if( ARG_TYPE === VAR.STRING ) {

            str += "string(" + value.length + ') "' + value + '"\n';
        } else if( ARG_TYPE === VAR.INT ) {
            str += "int(" + value + ')\n';
        } else if( argument instanceof PHP.VM.ClassPrototype || ARG_TYPE === VAR.OBJECT ) {
            // todo, complete
            if( ARG_TYPE === VAR.OBJECT ) {
                argument = value;
            }

            str += "object(" + argument[ COMPILER.CLASS_NAME ] + ')#1 ';



            // search whole prototype chain

            var tmp = "",
            count = 0;

            for ( var item in argument ) {
                var ignore = false,
                parent;
                if (item.substring(0, PHP.VM.Class.PROPERTY.length) === PHP.VM.Class.PROPERTY) {

                    if (!((argument[ PHP.VM.Class.PROPERTY_TYPE + item.substring( PHP.VM.Class.PROPERTY.length ) ] & PHP.VM.Class.PRIVATE) === PHP.VM.Class.PRIVATE) && !((argument[ PHP.VM.Class.PROPERTY_TYPE + item.substring( PHP.VM.Class.PROPERTY.length ) ] & PHP.VM.Class.PROTECTED) === PHP.VM.Class.PROTECTED)) {

                        tmp += $INDENT( indent + 2 ) + '["' + item.substring( PHP.VM.Class.PROPERTY.length );
                        tmp += '"]=>\n';
                        tmp += $dump( argument[ item ], indent + 2 );
                        count++;
                    } else {
                        ignore = true;
                    }

                }

                parent = argument;
                // search for overwritten private members
                do {
                    if ( ( argument[ item ] !== parent[ item ] || ignore ) && parent[ item ] instanceof PHP.VM.Variable && parent.hasOwnProperty( item )) {


                        tmp += $INDENT( indent + 2 ) + '["' + item.substring( PHP.VM.Class.PROPERTY.length ) + '":';
                        if ((argument[ PHP.VM.Class.PROPERTY_TYPE + item.substring( PHP.VM.Class.PROPERTY.length ) ] & PHP.VM.Class.PRIVATE) === PHP.VM.Class.PRIVATE) {
                            tmp +=  '"' + Object.getPrototypeOf(parent)[ COMPILER.CLASS_NAME ] +'":' + "private";
                        } else {
                            tmp +=  "protected";
                        }

                        tmp += ']=>\n';
                        tmp += $dump( parent[ item ], indent + 2 );
                        count++;
                    }
                    parent = Object.getPrototypeOf( parent );
                } while( parent instanceof PHP.VM.ClassPrototype);

            }


            str += '(' + count + ') {\n' + tmp;





            str += $INDENT( indent ) + '}\n';
        } else if( ARG_TYPE === VAR.FLOAT ) {
            str += "float(" + value + ')\n';
        }

        return str;
    }.bind(this),
    $INDENT = function( num ) {
        var str = "", i ;
        for (i = 0; i < num; i++) {
            str += " ";
        }
        return str;
    };

    PHP.Utils.$A( arguments ).forEach( function( argument ) {
        str += $dump( argument, 0 );
    }, this );

    this.echo( str );

};