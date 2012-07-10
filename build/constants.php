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

            $str .= (is_string($value)) ? '"' . $value . '"' : $value;
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


createFile('src/modules/output/constants.js', "Core", "PHP_OUTPUT_");

createFile('src/modules/error/constants.js', "Core", "E_");



?>