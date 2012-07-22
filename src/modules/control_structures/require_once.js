PHP.Modules.prototype.require_once = function( $, $Static, file ) {
    
    var COMPILER = PHP.Compiler.prototype,
    filename = file[ COMPILER.VARIABLE_VALUE ];
    
    
    var path = this[ COMPILER.FILE_PATH ];
    
    
    var loaded_file = (/^(.:|\/)/.test( filename ) ) ? filename : path + "/" + filename;
    
    if (!this.$Included.Included( loaded_file )) {
        this.$include.apply(this, arguments);
    }
    
};