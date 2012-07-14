PHP.Modules.prototype.$isset = function() {

    var len = arguments.length, i = -1, arg,
    VARIABLE = PHP.VM.Variable.prototype;

    while( ++i < len ) {
        arg = arguments[ i ];
        
        // http://www.php.net/manual/en/types.comparisons.php
        
        if ( arg instanceof PHP.VM.Variable ) {
            if ( arg[ VARIABLE.TYPE ] === VARIABLE.NULL ) {
                return new PHP.VM.Variable( false );
            }
        } else if ( arg === false) {
            return new PHP.VM.Variable( false );
        }


        
    }

    return new PHP.VM.Variable( true );

};

