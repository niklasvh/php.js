/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 17.7.2012 
* @website http://hertzen.com
 */


PHP.RAWPost = function( content ) {
    
    var lines = content.split(/\r\n|\r|\n/),
    CONTENT_TYPE = "Content-Type:",
    CONTENT_DISPOSITION = "Content-Disposition:",
    BOUNDARY = "boundary=",
    contentType,
    item,
    items = [],
    startCapture,
    itemValue,
    boundary;
    
    function is( part, item ) {
        return ( part !== undefined && part.substring(0, item.length ) === item );
    }
 
    lines.forEach(function( line ){


        var parts = line.split(";")
        if ( boundary === line.replace(/-/g,"").trim()) {
            if ( item !== undefined ) {
                item.value = itemValue;
                items.push( item );
            }
            startCapture = false;
            itemValue = "";
            item = {};
        } else if ( is( parts[ 0 ], CONTENT_TYPE ) ) {
            
            if ( item !== undefined ) {
                item.contentType = parts[ 0 ].substring( CONTENT_TYPE.length ).trim();
            }
            
          
            
            parts[ 1 ] = ( parts[ 1 ] !== undefined ) ? parts[ 1 ].trim() : undefined;
            if ( is( parts[ 1 ], BOUNDARY) ) {

                  
                var part = parts[ 1 ].split(",");
                part = part[ 0 ];
               
                boundary = part.substring( BOUNDARY.length ).replace(/[-"]/g,"").trim(); 
                
             

            }
        } else if ( is( parts[ 0 ], CONTENT_DISPOSITION ) ) {
            if ( item !== undefined ) {
                item.contentDisposition = parts[ 0 ].substring( CONTENT_DISPOSITION.length ).trim();
                parts.shift();
                parts.forEach(function( part ){
                    var vals = part.split("=");
                
                    if ( vals.length === 2 ) {
                        var val = vals[ 1 ].trim();
                        val = val.replace( /\\\\/g,"\\"); 
                        if (/^('|").*('|")$/.test(val)) {
                            var quote = val.substring( 0, 1);
                            val = val.substring( 1, val.length - 1 ); 
                            val = val.replace( new RegExp("\\\\" + quote, "g"), quote);
                           
                        } 
                        
                        item[ vals[ 0 ].trim() ] = val;
                    }
                });
            }
        } else if ( startCapture ) {    
            if (line.length === 0 ) {
                line =  "\n";
            }
            itemValue += line;
        } else {
            startCapture = true;
        }
        
       
        
        
    });
    
    console.log( items );

    return {
        Post: function() {
            var arr = {};
            items.forEach(function( item ){
                if ( item.filename === undefined ) {
                    arr[ item.name ] = item.value;
                }
            });
          
            return arr;
        },  
        Files: function() {
            var arr = {};
            items.forEach(function( item, index ){
               
                if ( item.filename !== undefined ) {
                    if ( !/^[a-z0-9]+\[.+\]/i.test(item.name) ) {
                        if ( /^[a-z0-9]+\[\]/i.test(item.name) ) {
                            var name = item.name.replace(/\[\]/g,"");
                            
                            if ( arr[ name ] === undefined ) {
                                arr[ name ] = {
                                    name: [],
                                    type: [],
                                    tmp_name: [],
                                    error: [],
                                    size: []
                                }
                            } 
                            
                            arr[ name ].name.push( item.filename );
                            arr[ name ].type.push( item.contentType );
                            arr[ name ].tmp_name.push( item.filename );
                            arr[ name ].error.push( 0 );
                            arr[ name ].size.push( item.value.length );
                            
                        } else {
                            arr[ (item.name === undefined ) ? index : item.name ] = {
                                name: item.filename,
                                type: item.contentType,
                                tmp_name: item.filename,
                                error: 0,
                                size: item.value.length
                            }
                        }
                    }
                }
            });
          
            return arr;
        },
        Raw: function() {
            lines = content.split(/\r\n|\r|\n/);
            lines.shift();
            lines.pop();
            return lines.join("\n");
        }
    };
    
 
    
};

