/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 17.7.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.setlocale = function( category ) {
    var COMPILER = PHP.Compiler.prototype,
    VARIABLE = PHP.VM.Variable.prototype;
    
    var cat = category[ COMPILER.VARIABLE_VALUE ],
    localeObj,
    localeName;
    
    Array.prototype.slice.call( arguments, 1).some( function( localeVar ) {
        
        var locale = localeVar[ COMPILER.VARIABLE_VALUE ]
        
        return Object.keys( PHP.Locales ).some( function( key ){
        
            if ( key === locale) {
                localeName = key;
                localeObj = PHP.Locales[ key ];
                return true;
            }
            return false;
        
        });
    
    });
    
    if ( localeObj === undefined ) {
        return new PHP.VM.Variable( false );
    }
    
   // console.log( cat );
    
    Object.keys( this.$locale ).forEach( function( key ){
        
        if ( localeObj [ key ] !== undefined ) {
            this.$locale[ key ] = localeObj [ key ];
        }
        
    }, this);
    
    return new PHP.VM.Variable( localeName );
    
};