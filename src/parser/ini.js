/* 
 * based on node-iniparser Copyright (c) 2009-2010 Jordy van Gelder <jordyvangelder@gmail.com>
 * The MIT License
 */


PHP.ini = function( contents ) {
    var re = {
        section: /^\s*\[\s*([^\]]*)\s*\]\s*$/,
        property: /^\s*([\w\.\-\_]+)\s*=\s*(.*?)\s*$/,
        comment: /^\s*;.*$/
    },
    opts = {},
    lines = contents.split(/\r\n|\r|\n/)
    
};