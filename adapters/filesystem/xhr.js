/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 3.7.2012 
* @website http://hertzen.com
 */


PHP.Adapters.XHRFileSystem = function() {
    /*
    var indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB,
    request = indexedDB.open("filesystem"),
    $this = this;

    request.onsuccess = function(e) {

        $this.db = e.target.result;
  
    };
    
    request.onupgradeneeded = function( e ) {
      
        $this.db.createObjectStore( $this.FILES,
        {
            keyPath: "filename"
        });
        
    };

    request.onfailure = this.error;
    */
    
    
    }; 

PHP.Adapters.XHRFileSystem.prototype.lstatSync = function( filename ) {
    
    if (localStorage[ filename ] === undefined ) {
        throw Error; 
    } else {
        return true;
    }
    
}

PHP.Adapters.XHRFileSystem.prototype.error = function( e ) {
    this.db = false;
    console.log( e );
    throw e; 
}

PHP.Adapters.XHRFileSystem.prototype.writeFileSync = function( filename, data ) {
    
    
    localStorage[ filename ] = data;
    
/*
    if ( this.db === false ) {
        return;
    }
    console.log( this.db );
    var db = this.db,
    trans = db.transaction([ this.files ], IDBTransaction.READ_WRITE, 0),
    store = trans.objectStore( this.files );
    
    var request = store.put({
        "filename": filename,
        "content" : data
    });
    
    var processing = true;

    request.onsuccess = function(e) {
        processing = false;
    };

    request.onerror = function(e) {
        processing = false;
        console.log(e.value);
    };
    
    while ( processing ) {}
    
    */

    
};

PHP.Adapters.XHRFileSystem.prototype.readFileSync = function( filename, xhr ) {
    
    if ( xhr === undefined ) {
    
        var xhr = new XMLHttpRequest();
    
        xhr.open('GET', filename, false); // async set to false!
    
        var response; 
        xhr.onload = function() {
            response = this.responseText;
   
        };

        xhr.send();
    
        return response;
    } else {
        if (localStorage[ filename ] === undefined ) {
            throw Error; 
        } else {
            return localStorage[ filename ];
        }
    }

    
};
PHP.Adapters.XHRFileSystem.prototype.xhr = true;
 
PHP.Adapters.XHRFileSystem.prototype.version = "1.2";

PHP.Adapters.XHRFileSystem.prototype.FILES = "files";