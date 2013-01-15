PHP.Modules.prototype.$foreachInit = function( expr, ctx ) {

    var COMPILER = PHP.Compiler.prototype,
    VAR = PHP.VM.Variable.prototype,
    ARRAY = PHP.VM.Array.prototype;

    var itm = expr[ COMPILER.VARIABLE_VALUE ]; // trigger get

    if ( expr[ VAR.TYPE ] === VAR.ARRAY ) {
        var pointer = itm[ PHP.VM.Class.PROPERTY + ARRAY.POINTER];
        pointer[ COMPILER.VARIABLE_VALUE ] = 0;

        return {
            len: itm[ PHP.VM.Class.PROPERTY + ARRAY.VALUES ][ COMPILER.VARIABLE_VALUE ].length,
            expr: expr,
            clone: itm[ COMPILER.METHOD_CALL ]( this, COMPILER.ARRAY_CLONE )
        };

    } else if ( expr[ VAR.TYPE ] === VAR.OBJECT ) {
        var objectValue = itm;


        // iteratorAggregate implemented objects

        if ( objectValue[ PHP.VM.Class.INTERFACES ].indexOf("Traversable") !== -1 ) {

            var iterator = objectValue;

            try {
                while( (iterator instanceof PHP.VM.ClassPrototype) && iterator[ PHP.VM.Class.INTERFACES ].indexOf("Iterator") === -1  ) {
                    iterator = iterator[ COMPILER.METHOD_CALL ]( this, "getIterator" )[ COMPILER.VARIABLE_VALUE ];
                }
            }catch(e) {

            }
            if ( !(iterator instanceof PHP.VM.ClassPrototype) || iterator[ PHP.VM.Class.INTERFACES ].indexOf("Iterator") === -1) {
                this[ COMPILER.ERROR ]( "Objects returned by " + objectValue[ COMPILER.CLASS_NAME ] + "::getIterator() must be traversable or implement interface Iterator", PHP.Constants.E_ERROR, true );
                return;
            }

            iterator[ COMPILER.METHOD_CALL ]( this, "rewind" );

            return {
                expr: expr,
                Class:iterator
            };
        } else {
            //  members in object

            var classProperty = PHP.VM.Class.PROPERTY;

            return {
                expr: expr,
                pointer: 0,
                keys:  (function( objectValue ) {
                    var items = [],

                    needReorder = false;
                    for (var key in objectValue) {

                        if ( key.substring(0, classProperty.length ) === classProperty) {

                            var name = key.substring( classProperty.length );

                            if (PHP.Utils.Visible.call( this, name, objectValue, ctx )) {
                                items.push( name );
                            }

                        }

                        if (((objectValue[ PHP.VM.Class.PROPERTY_TYPE + name ] & PHP.VM.Class.PUBLIC) === PHP.VM.Class.PUBLIC) || objectValue[ PHP.VM.Class.PROPERTY_TYPE + name ] === undefined) {


                        } else {
                            needReorder = true;
                        }
                    }
                    if ( needReorder ) {
                        items.sort();
                    }

                    return items;
                }.bind(this))( objectValue )

            };

        }
    } else {
        this[ COMPILER.ERROR ]( "Invalid argument supplied for foreach()", PHP.Constants.E_CORE_WARNING, true );

    }

};

PHP.Modules.prototype.$foreachEnd = function( iterator ) {

    var COMPILER = PHP.Compiler.prototype;

    // destruct iterator
    if ( iterator !== undefined && iterator.Class !== undefined ) {
        iterator.Class[ COMPILER.CLASS_DESTRUCT ]();
    }

};

PHP.Modules.prototype.foreach = function( iterator, byRef, value, key ) {

    var COMPILER = PHP.Compiler.prototype,
    VAR = PHP.VM.Variable.prototype,
    ARRAY = PHP.VM.Array.prototype,
    expr;

    if ( iterator === undefined  || iterator.expr === undefined ) {
        return false;
    }
    expr = iterator.expr;

    if ( iterator.count === undefined ) {
        iterator.count = 0;
    }

    if ( expr[ VAR.TYPE ] === VAR.ARRAY ) {
        var clonedValues = iterator.clone[ PHP.VM.Class.PROPERTY + ARRAY.VALUES ][ COMPILER.VARIABLE_VALUE ],
        clonedKeys =  iterator.clone[ PHP.VM.Class.PROPERTY + ARRAY.KEYS ][ COMPILER.VARIABLE_VALUE ],
        origValues = expr[ COMPILER.VARIABLE_VALUE ][ PHP.VM.Class.PROPERTY + ARRAY.VALUES ][ COMPILER.VARIABLE_VALUE ],
        origKeys = expr[ COMPILER.VARIABLE_VALUE ][ PHP.VM.Class.PROPERTY + ARRAY.KEYS ][ COMPILER.VARIABLE_VALUE ],
        len = ( byRef === true || iterator.expr[ VAR.IS_REF ] === true ) ? origValues.length : iterator.len,
        pointer = (( byRef === true || iterator.expr[ VAR.IS_REF ] === true) ? expr[ COMPILER.VARIABLE_VALUE ] : iterator.clone )[ PHP.VM.Class.PROPERTY + ARRAY.POINTER];

        var compareTo = (byRef === true || iterator.expr[ VAR.IS_REF ] === true)  ? origValues : clonedValues,
        result;

        var index, lowerLoop = function( index ) {
            while( compareTo [ --index ] === undefined && index > 0 ) {}
            return index;
        }

        if (  iterator.breakNext ===  true) {
            return false;
        }

        if ( pointer[ COMPILER.VARIABLE_VALUE ] !== iterator.count ) {
            if ( iterator.last !== undefined && iterator.last !== compareTo [ pointer[ COMPILER.VARIABLE_VALUE ] ] ) {
                index = pointer[ COMPILER.VARIABLE_VALUE ];
            } else if ( compareTo [ iterator.count ] !== undefined ) {
                index = iterator.count;
            } else if ( compareTo [ pointer[ COMPILER.VARIABLE_VALUE ] ] !== undefined ) {
                index = pointer[ COMPILER.VARIABLE_VALUE ];
            } else {
                index =  lowerLoop( pointer[ COMPILER.VARIABLE_VALUE ] );
            }

        } else if ( compareTo [ iterator.count ] !== undefined ){
            index = iterator.count;
        } else {
            index =  lowerLoop( pointer[ COMPILER.VARIABLE_VALUE ] );
        }


        if ( byRef === true || iterator.expr[ VAR.IS_REF ] === true) {
            result = ( origValues[ pointer[ COMPILER.VARIABLE_VALUE ] ] !== undefined && (iterator.count <= origValues.length || iterator.diff || iterator.first !== origValues[ 0 ]) );

        } else {
            result = ( clonedValues[ iterator.count ] !== undefined );
        }



        iterator.first = origValues[ 0 ];
        iterator.last = compareTo[ index ];
        iterator.diff = (iterator.count === origValues.length);


        if ( result === true ) {




            if ( byRef === true || iterator.expr[ VAR.IS_REF ] === true ) {
                value[ VAR.REF ]( origValues[ index ] );
            } else {
                value[ COMPILER.VARIABLE_VALUE ] = clonedValues[ iterator.count ][ COMPILER.VARIABLE_VALUE ];
            }
            if ( key instanceof PHP.VM.Variable ) {
                if (byRef === true || iterator.expr[ VAR.IS_REF ] === true ) {
                    key[ COMPILER.VARIABLE_VALUE ] = origKeys[ index ];
                } else {
                    key[ COMPILER.VARIABLE_VALUE ] = clonedKeys[ index ];
                }

            }
            /*
            if (!byRef && iterator.expr[ VAR.IS_REF ] !== true ) {
                iterator.expr[ COMPILER.VARIABLE_VALUE ][ PHP.VM.Class.PROPERTY + ARRAY.POINTER][ COMPILER.VARIABLE_VALUE ]++;
            }*/
            iterator.prev = origValues[ index ];
            iterator.count++;

            expr[ COMPILER.VARIABLE_VALUE ][ PHP.VM.Class.PROPERTY + ARRAY.POINTER][ COMPILER.VARIABLE_VALUE ]++;
            iterator.clone[ PHP.VM.Class.PROPERTY + ARRAY.POINTER][ COMPILER.VARIABLE_VALUE ]++;
            if (( byRef === true || iterator.expr[ VAR.IS_REF ] === true ) && expr[ COMPILER.VARIABLE_VALUE ][ PHP.VM.Class.PROPERTY + ARRAY.POINTER][ COMPILER.VARIABLE_VALUE ] >= origValues.length ) {

                iterator.breakNext = true;
            }

        // pointer[ COMPILER.VARIABLE_VALUE ]++;

        }

        return result;




    } else if ( expr[ VAR.TYPE ] === VAR.OBJECT ) {
        var objectValue = expr[ COMPILER.VARIABLE_VALUE ]


        // iteratorAggregate implemented objects
        if ( objectValue[ PHP.VM.Class.INTERFACES ].indexOf("Traversable") !== -1 ) {

            if ( byRef === true ) {
                this.ENV[ PHP.Compiler.prototype.ERROR ]( "An iterator cannot be used with foreach by reference", PHP.Constants.E_ERROR, true );
            }


            if ( iterator.first === undefined ) {
                iterator.first = true;
            } else {
                if ( iterator.Class[ COMPILER.METHOD_CALL ]( this, "next" )[ VAR.DEFINED ]  !== true ) {
                    this.ENV[ PHP.Compiler.prototype.ERROR ]( "Undefined offset: 3", PHP.Constants.E_NOTICE, true );
                }
            }

            var result = iterator.Class[ COMPILER.METHOD_CALL ]( this, "valid" )[ VAR.CAST_BOOL ][ COMPILER.VARIABLE_VALUE ];

            if ( result === true ) {

                value[ COMPILER.VARIABLE_VALUE ] = iterator.Class[ COMPILER.METHOD_CALL ]( this, "current" )[ COMPILER.VARIABLE_VALUE ];

                if ( key instanceof PHP.VM.Variable ) {
                    key[ COMPILER.VARIABLE_VALUE ] = iterator.Class[ COMPILER.METHOD_CALL ]( this, "key" )[ COMPILER.VARIABLE_VALUE ];
                }
            }

            return result;

        } else {
            // loop through public members



            if ( iterator.pointer < iterator.keys.length) {

                value[ COMPILER.VARIABLE_VALUE ] = objectValue[ PHP.VM.Class.PROPERTY + iterator.keys[ iterator.pointer ]];

                if ( key instanceof PHP.VM.Variable ) {
                    key[ COMPILER.VARIABLE_VALUE ] =  iterator.keys[ iterator.pointer ];
                }
                iterator.pointer++;
                return true;
            }
            return false;
        }
    } else {
        this[ COMPILER.ERROR ]( "Invalid argument supplied for foreach()", PHP.Constants.E_CORE_WARNING, true );
        return false;
    }
};