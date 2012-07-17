/* 
 * based on node-iniparser Copyright (c) 2009-2010 Jordy van Gelder <jordyvangelder@gmail.com>
 * The MIT License
 */


PHP.ini = function( contents ) {
    
    var regex = {
        section: /^\s*\[\s*([^\]]*)\s*\]\s*$/,
        param: /^\s*([\w\.\-\_]+)\s*=\s*"?(.*?)"?\s*$/,
        comment: /^\s*;.*$/
    },
    section = null,
    value = {};
    contents.toString().split(/\r\n|\r|\n/).forEach( function( line ) {
        var match;
        
        if ( regex.comment.test( line ) ){
            return;
            
        } else if ( regex.param.test( line ) ){
            
            match = line.match( regex.param );
            
            if ( section ) {
                value[ section ][ match[ 1 ] ] = match[ 2 ];
            }else{
                value[ match[ 1 ] ] = match[ 2 ];
            }
            
        } else if ( regex.section.test( line ) ){
            
            match = line.match( regex.section );
            value[ match[ 1 ] ] = {};
            section = match[ 1 ];
            
        } else if ( line.length === 0 && section ){
            section = null;
        }
        
    });
    
    return value;
    
};