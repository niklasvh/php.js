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
    item,
    items = [],
    startCapture,
    itemValue,
    boundary,
    storedFiles = [],
    emptyFiles = [],
    totalFiles = 0,
    errors = [],
    post;
    
    
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
            
            
            if (parts[ 0 ].substring( CONTENT_TYPE.length ).trim() === "multipart/form-data") {
                if ( is( parts[ 1 ], BOUNDARY) ) {

                  
                    var part = parts[ 1 ].split(",");
                    part = part[ 0 ];
               
                    boundary = part.substring( BOUNDARY.length ).replace(/[-]/g,"").trim(); 
              
                    // starts OR finishes with quotes
                    if (boundary.substring(0,1) === '"' || boundary.substr(-1,1) === '"') {
                        // starts AND finishes with quotes
                        if (boundary.substring(0,1) === '"' && boundary.substr(-1,1) === '"') {
                            boundary = boundary.substring(1, boundary.length - 1);
                        } else {
                            errors.push(["Invalid boundary in multipart/form-data POST data", PHP.Constants.E_WARNING, true]);
                        }
                    }
                
                } else {
                    errors.push(["Missing boundary in multipart/form-data POST data", PHP.Constants.E_WARNING, true]);
                }
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
            
            if ( parts.length === 0 && item !== undefined ) {
                item.garbled = true;
            }
            
        } else if ( startCapture ) {    
            if (line.length === 0 && itemValue !== undefined && itemValue.length > 0) {
                line =  "\n";
            }
            itemValue += line;
        } else {
            startCapture = true;
        }
        
       
        
        
    });
    
    if ( item !== undefined && Object.keys( item ).length > 0 ) {
        item.value = itemValue;
        item.contentType  = "";
        items.push( item );
    }
    


    
    return {
        Post: function() {
            var arr = {};
            items.forEach(function( item ){
                if ( item.filename === undefined ) {
                    
                    if ( item.garbled === true )  {
                        errors.push(["File Upload Mime headers garbled", PHP.Constants.E_WARNING, true]);
                        return;
                    } 
                    
                    arr[ item.name ] = item.value;
                }
            });
            post = arr;
            return arr;
        },  
        Files: function( max_filesize, max_files, path ) {
            var arr = {};
            items.forEach(function( item, index ){
  
                
                if ( item.filename !== undefined ) {
                    
                                  
                    
                    
                    if ( !/^[a-z0-9]+\[.*[a-z]+.*\]/i.test(item.name) ) {
                       
                        var error = 0;
                        if ( item.filename.length === 0 ) {
                            error = PHP.Constants.UPLOAD_ERR_NO_FILE;
                            
                        } else if (post.MAX_FILE_SIZE !== undefined && post.MAX_FILE_SIZE < item.value.length) {
                            error = PHP.Constants.UPLOAD_ERR_FORM_SIZE;
                            
                        } else if (item.value.length > max_filesize) {  
                            error = PHP.Constants.UPLOAD_ERR_INI_SIZE;
                            
                        } else if (item.contentType.length === 0) {
                            error = PHP.Constants.UPLOAD_ERR_PARTIAL;
                            
                        }
                        
                 
                        item.filename = item.filename.substring(item.filename.lastIndexOf("/") + 1); 
                        item.filename = item.filename.substring(item.filename.lastIndexOf("\\") + 1);
                         
                       
                        if ( /^[a-z0-9]+\[\d*\]/i.test(item.name) ) {
                          
                            if (!/^[a-z0-9]+\[\d*\]$/i.test(item.name)) {
                                // malicious input
                                return;
                            }
                            
                            var name = item.name.substring(0, item.name.indexOf("["));
                            //replace(/\[\]/g,"");
                            
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
                            arr[ name ].type.push( ( error ) ? "" :item.contentType );
                            arr[ name ].tmp_name.push( ( error ) ? "" : path + item.filename );
                            arr[ name ].error.push(  error );
                            arr[ name ].size.push( ( error ) ? 0 : item.value.length );
                            

                            
                        } else {
                            arr[ (item.name === undefined ) ? index : item.name ] = {
                                name: item.filename,
                                type: ( error ) ? "" : item.contentType,
                                tmp_name: ( error ) ? "" : path + item.filename,
                                error: error,
                                size: ( error ) ? 0 : item.value.length
                            }
                            
                           
                        }
                        
                        // store file
                        if ( !error ) {
                            if (item.value.length === 0) {
                                emptyFiles.push({
                                    real: (item.name === undefined ) ? index : item.name,
                                    name: path + item.filename, 
                                    content: item.value
                                });
                            } else {
                                storedFiles.push({
                                    name: path + item.filename, 
                                    content: item.value
                                });  
                                totalFiles++;
                            }
                            
                           
                        }
                    }
                }
            });
          
            while( totalFiles <  max_files && emptyFiles.length > 0) {
                var item = emptyFiles.shift();
                storedFiles.push( item );
                totalFiles++;
            }
            
            // no room
            emptyFiles.forEach(function( file ){

                var item = arr[ file.real ];
                item.error = 5;
                item.tmp_name = "";
                item.type = "";
                errors.push(["No file uploaded in Unknown on line 0", PHP.Constants.E_NOTICE ]);
                errors.push(["No file uploaded in Unknown on line 0", PHP.Constants.E_NOTICE ]);
                errors.push(["Uploaded file size 0 - file [" + file.real + "=" + item.name + "] not saved in Unknown on line 0", PHP.Constants.E_WARNING ]);

            });
          
            return arr;
        },
        WriteFiles: function( func ) {
            storedFiles.forEach( function( item ){
                              
                func( item.name, item.content );
            });
        },
        Error: function( func, file ) {
            errors.forEach(function( err ){
                func( err[ 0 ] + (( err[2] === true ) ? " in " + file : ""), err[1] );
            });
            
        },
        Raw: function() {
            lines = content.split(/\r\n|\r|\n/);
            lines.shift();
            lines.pop();
            return lines.join("\n");
        }
    };
    
 
    
};

