<?php

/*
 * @author Niklas von Hertzen <niklas at hertzen.com>
 * @created 10.7.2012 
 * @website http://hertzen.com
 */

function getItems($constants, &$str, $start) {
    foreach ($constants as $key => $value) {
        if (substr($key, 0, strlen($start)) === $start) {

            $str .= "PHP.Constants." . $key . " = ";
            
            if (is_string($value)  || $value == INF || (string)$value == "NAN") {
                $str .= '"' . str_replace("\\","\\\\",$value) . '"';
            } else {
                $str .=  $value;
            }
           
            $str .= ";\n";
        }
    }
}

function createFile($file, $submodule, $start) {
    $str = "/* Automatically built from PHP version: " . phpversion() . " */\n";
    $constants = get_defined_constants(true);
    getItems($constants[$submodule], $str, $start);

    $fp = fopen($file, 'w');
    fwrite($fp, $str);
    fclose($fp);
}

createFile('src/modules/filesystem/constants.js', "Core", "UPLOAD_");

createFile('src/modules/output/constants.js', "Core", "PHP_OUTPUT_");

createFile('src/modules/error/constants.js', "Core", "E_");

//createFile('src/modules/tokenizer/constants.js', "tokenizer", "");

createFile('src/modules/date/constants.js', "date", "");

createFile('src/modules/variable/constants.js', "standard", "");

?>