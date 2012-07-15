/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 26.6.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.print_r = function() {
    
    var str = "",
    indent = 0,
    COMPILER = PHP.Compiler.prototype,
    VAR = PHP.VM.Variable.prototype;
    console.log('print_r');
    if (this[ COMPILER.DISPLAY_HANDLER ] === true) {
        this[ COMPILER.ERROR ]( "print_r(): Cannot use output buffering in output buffering display handlers", PHP.Constants.E_ERROR, true );  
    }
    
    var $dump = function( argument, indent ) {
        var str = "";
        if ( argument[ VAR.TYPE ] === VAR.ARRAY ) {
            str += "Array\n";
            str += $INDENT( indent ) + "(";
            var values = argument[ COMPILER.VARIABLE_VALUE ][ PHP.VM.Class.PROPERTY + PHP.VM.Array.prototype.VALUES ][ COMPILER.VARIABLE_VALUE ];
            var keys = argument[ COMPILER.VARIABLE_VALUE ][ PHP.VM.Class.PROPERTY + PHP.VM.Array.prototype.KEYS ][ COMPILER.VARIABLE_VALUE ];
            
           
       
            str += "\n";
            
            keys.forEach(function( key, index ){
                str += $INDENT( indent + 4 ) + "[";

                str += key;
                
                str += "] => ";
                
                str += $dump( values[ index ], indent + 8 );
                
                if ( values[ index ][ VAR.TYPE] === VAR.ARRAY ) {
                    str += "\n";
                }
                
            }, this);
            
            str += $INDENT( indent ) + ")\n";
        } else if( argument[ VAR.TYPE ] === VAR.OBJECT || argument instanceof PHP.VM.ClassPrototype) { 
            var classObj;
            if (argument instanceof PHP.VM.Variable ){
                classObj = argument[ COMPILER.VARIABLE_VALUE ];
            } else {
                classObj = argument;
            }
            str += classObj[ COMPILER.CLASS_NAME ] + " Object\n";
            str += $INDENT( indent ) + "(";
      
      
                  var added = false;
          
           
            // search whole prototype chain
            for ( var item in classObj ) {
                if (item.substring(0, PHP.VM.Class.PROPERTY.length) === PHP.VM.Class.PROPERTY) {
                    
                    added = true;
                    str += "\n" + $INDENT( indent + 4 ) + '[' + item.substring( PHP.VM.Class.PROPERTY.length ) + '] => ';
                    str += $dump( classObj[ item ], indent + 8 );
                    
                    //  props.push( item );
                  
                    var parent = classObj;
                    // search for overwritten private members
                    do {
                        if ( classObj[ item ] !== parent[ item ] && parent[ item ] instanceof PHP.VM.Variable) {
                        
                            
                            str += $INDENT( indent + 4 ) + '[' + item.substring( PHP.VM.Class.PROPERTY.length ) + ':' + Object.getPrototypeOf(parent)[ COMPILER.CLASS_NAME ] +':private] => ';
                            str += $dump( parent[ item ], indent + 8 );
                            
                        }
                        parent = Object.getPrototypeOf( parent );
                    } while( parent instanceof PHP.VM.ClassPrototype);
                    
                    if ( classObj[ item ][ VAR.TYPE ] === VAR.ARRAY ) {
                          str += "\n";
                    }
                }
            }
            
            if ( added === false ) {
                 str += "\n";
            }
          
            /*
 
            props.forEach(function( prop ){
                str += "\n" + $INDENT( indent + 4 ) + '[' + prop.substring( PHP.VM.Class.PROPERTY.length ) + '] => ';
                str += $dump( classObj[ prop ], indent + 8 );
            });
            */

            /*
            keys.forEach(function( key, index ){
                str += $INDENT( indent + 4 ) + "[";

                str += key;
                
                str += "] => ";
                
                str += $dump( values[ index ], indent + 8 );
                
                if ( values[ index ][ VAR.TYPE] === VAR.ARRAY ) {
                    str += "\n";
                }
                
            }, this);
            */
            str += $INDENT( indent ) + ")\n";
            
        } else if( argument[ VAR.TYPE ] === VAR.NULL ) {
            str += $INDENT( indent ) + "NULL\n";  
        } else if( argument[ VAR.TYPE ] === VAR.STRING ) {
            
            var value = argument[ COMPILER.VARIABLE_VALUE ];
            str += value + '\n';  
        } else if( argument[ VAR.TYPE ] === VAR.INT ) {
            
            var value = argument[ COMPILER.VARIABLE_VALUE ];
            str += value + '\n';  
            
        } else {
            console.log( argument );
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
    
    
  
// console.log(arguments);
/*
    console.log( arguments[0].type);
    console.log( arguments[0] instanceof PHP.VM.VariableProto);
    console.log( arguments );
    */
};