/*
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 26.6.2012
* @website http://hertzen.com
 */


PHP.Modules.prototype.print_r = function() {

    var str = "",
    indent = 0,
    COMPILER = PHP.Compiler.prototype,
    PRIVATE = PHP.VM.Class.PRIVATE,
    PROTECTED = PHP.VM.Class.PROTECTED,
    PROPERTY = PHP.VM.Class.PROPERTY,
    VAR = PHP.VM.Variable.prototype;

    if (this[ COMPILER.DISPLAY_HANDLER ] === true) {
        this[ COMPILER.ERROR ]( "print_r(): Cannot use output buffering in output buffering display handlers", PHP.Constants.E_ERROR, true );
    }

    var $dump = function( argument, indent ) {
        var str = "",
        value = argument[ COMPILER.VARIABLE_VALUE ],
        ARG_TYPE = argument[ VAR.TYPE ]; // trigger get for undefined

        if ( ARG_TYPE === VAR.ARRAY ) {
            str += "Array\n";
            str += $INDENT( indent ) + "(";
            var values = value[ PROPERTY + PHP.VM.Array.prototype.VALUES ][ COMPILER.VARIABLE_VALUE ];
            var keys = value[ PROPERTY + PHP.VM.Array.prototype.KEYS ][ COMPILER.VARIABLE_VALUE ];

            str += "\n";

            keys.forEach(function( key, index ){
                str += $INDENT( indent + 4 ) + "[";
                if ( key instanceof PHP.VM.Variable) {
                    str += key[ COMPILER.VARIABLE_VALUE ]; // constants
                } else {
                    str += key;
                }
                str += "] => ";

                str += $dump( values[ index ], indent + 8 ) + "\n";



            }, this);

            str += $INDENT( indent ) + ")\n";
        } else if( ARG_TYPE === VAR.OBJECT || argument instanceof PHP.VM.ClassPrototype) {
            var classObj;
            if (argument instanceof PHP.VM.Variable ){
                classObj = value;
            } else {
                classObj = argument;
            }
            str += classObj[ COMPILER.CLASS_NAME ] + " Object\n";
            str += $INDENT( indent ) + "(\n";


            var added = false,
            definedItems = [],
            tmp = "";

            // search whole prototype chain
            for ( var item in classObj ) {
                if (item.substring(0, PROPERTY.length) === PROPERTY) {


                    if ( classObj.hasOwnProperty( item )) {
                        definedItems.push( item );
                        str += $INDENT( indent + 4 ) + '[' + item.substring( PROPERTY.length );
                        str += '] => ';
                        str += $dump( classObj[ item ], indent + 8 );
                        str += "\n";
                    }
                    //  props.push( item );

                    var parent = classObj;
                    // search for overwritten private members
                    do {

                        if ( parent.hasOwnProperty(item) ) {

                            if ((Object.getPrototypeOf( parent )[ PHP.VM.Class.PROPERTY_TYPE + item.substring( PROPERTY.length ) ] & PRIVATE) === PRIVATE) {
                                str += $INDENT( indent + 4 ) + '[' + item.substring( PROPERTY.length ) + ':' + Object.getPrototypeOf(parent)[ COMPILER.CLASS_NAME ] +':private] => ';
                                str += $dump( parent[ item ], indent + 8 );
                                str += "\n";
                            } else if ((Object.getPrototypeOf( parent )[ PHP.VM.Class.PROPERTY_TYPE + item.substring( PROPERTY.length ) ] & PROTECTED) === PROTECTED && definedItems.indexOf( item ) === -1) {
                                str += $INDENT( indent + 4 ) + '[' + item.substring( PROPERTY.length ) + ':' + Object.getPrototypeOf(parent)[ COMPILER.CLASS_NAME ] +':protected] => ';
                                str += $dump( parent[ item ], indent + 8 );
                                str += "\n";
                                definedItems.push( item );
                            } else if ( definedItems.indexOf( item ) === -1 ) {
                                str += $INDENT( indent + 4 ) + '[' + item.substring( PROPERTY.length ) + '] => ';
                                str += $dump( parent[ item ], indent + 8 );
                                str += "\n";
                                definedItems.push( item );
                            }
                        }
                        parent = Object.getPrototypeOf( parent );
                    } while( parent instanceof PHP.VM.ClassPrototype);




                }
            }
            str += tmp;




            str += $INDENT( indent ) + ")\n";

        } else if( ARG_TYPE === VAR.NULL ) {
            str += $INDENT( indent ) + "NULL";
        } else if( ARG_TYPE === VAR.STRING ) {


            str += value;
        } else if( ARG_TYPE === VAR.INT ) {


            str += value;

        }
        return str;
    },
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