/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 6.7.2012 
* @website http://hertzen.com
 */


         
function PHP_Tests( type, elem ) {
    this.elem = elem;
    this.type = type;
    this.cache = {};
                
    // this.buildTest( 'php/classes/__call_004.phpt' );
    this.loadTests( type );
}
            
PHP_Tests.prototype.loadTests = function( type ) {
                
    var ul  = document.createElement('ul'),
    $this = this;
                
    this.loadJSON('/?tests=' + type, function( tests ) {
        tests.forEach(function( testFile ){
            var li = document.createElement('li');
            li.appendChild( document.createTextNode( testFile ) )
            ul.appendChild(li  );
                        
        }, this);
                    
                    
        this.elem.appendChild( ul );
                    
    });
                
    ul.addEventListener( "click", function( event ){
        var li = event.target;
        if (!/li/i.test( li.nodeName )) {
            return;
        }
                    
        $this.runTest( li );
                    
    }, false );
};
            
PHP_Tests.prototype.runTest = function( li ) {
    var testFile = li.childNodes[ 0 ].nodeValue;
    this.buildTest( '/tests/php/' + this.type + '/' + testFile, function( test, engine ) {
                  
        li.setAttribute( 'title', test.TEST );
                    
        if (engine.error !== undefined) {
            li.style.color = "red";
            throw new Error( engine.error );
        }
                    
        var expect = ((test.EXPECT === undefined) ? test.EXPECTF : test.EXPECT ).trim(),
        output = engine.vm.OUTPUT_BUFFER.replace(/\n/g, "\r\n").trim(),
        expectResult;
                    
                    
        expect = expect.replace(/\%unicode\|string\%/g, "string");  // Matches the string 'unicode' in PHP6 test output and 'string' in PHP5 test output.
        expect = expect.replace(/\%string\|unicode\%/g, "string");  // Matches the string 'unicode' in PHP6 test output and 'string' in PHP5 test output.
        
        expect = expect.replace(/\%u\|b\%/g, "");  // Matches a single 'u' in PHP6 test output where the PHP5 output from the same test hs no character in that position.            

      
        // http://qa.php.net/phpt_details.php#expectf_section
        if (test.EXPECT === undefined ) {
            var shouldBef = expect;

            shouldBef = shouldBef.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
            shouldBef = shouldBef.replace(/\%d/g,"\\d+");
            shouldBef = shouldBef.replace(/\%s/g,".+");
            shouldBef = shouldBef.replace(/\%S/g,".*?");
               
             
            var re = new RegExp("^" + shouldBef + "$", "i");
                   
            expectResult = re.test( output );
                        
        } else {
            expectResult = (expect === output);
        }
                    
        if ( expectResult ) {
            // if ( expect === engine.vm.OUTPUT_BUFFER ) {
            li.style.color = "green";
            console.log( "-----OUTPUTTED-----", output );
        } else {
  
            //li.style.color = "red";
            console.log( test );
            console.log( "-----EXPECTING-----", expect );
            console.log( "-----OUTPUTTED-----", output );
            var div = document.createElement("div");
            var dmp = new diff_match_patch();
                        
            var d = dmp.diff_main( expect, output );
            dmp.diff_cleanupSemantic( d );
                      
            div.innerHTML = dmp.diff_prettyHtml( d );
            li.appendChild( div );
                        
        }
        console.log( engine );
                    
                    
    } );
    console.log( testFile );
};
            

            
PHP_Tests.prototype.buildTest = function( path, callback ) {
              
    this.loadJSON('/?file=' + path, function( json ){
        var engine = {},

        opts = {
            POST: json.POST,
            RAW_POST: json.POST_RAW,
            GET: json.GET,
            ini: (json.INI !== undefined ) ? PHP.ini( json.INI ) : {},
            SERVER: {
                SCRIPT_FILENAME: path.substring(0, path.length - 1)
            //    SCRIPT_FILENAME: "%s"
            }
        };
                    
        
                    
        if (json.ARGS !== undefined ) {
            var args = json.ARGS.trim().split(/\s/);
                       
            args.unshift( path ); // first argument is filename
                        
            opts.SERVER.argc = args.length;
            opts.SERVER.argv = args;
                        
        } else if (json.GET !== undefined) {
            var args = json.GET.replace(/\+/g," ").trim().split(/\s/);
            opts.SERVER.argc = args.length;
            opts.SERVER.argv = args;
        }
                    
        opts.filesystem = new PHP.Adapters.XHRFileSystem();
                    
        //      try {
        engine = new PHP( json.FILE || json.FILEEOF , opts );
        //    } catch( e ) {
        //      engine.error = e;
        //  }
                    
                    
        callback.call( this, json, engine );  
                    
    });
                
};
            
PHP_Tests.prototype.loadJSON = function( file, callback ) {
                
    var xhr = new XMLHttpRequest(),
    $this = this;
    xhr.open('GET', file, true);
    xhr.responseType = 'text';

    xhr.onload = function() {
        if (this.status == 200) {   
            callback.call( $this, JSON.parse(this.response) );
        }
    };

    xhr.send();
};
            
           