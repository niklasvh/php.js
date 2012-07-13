<?php

class ReflectionProperty {
    /* Constants */

    const IS_STATIC = 1;
    const IS_PUBLIC = 256;
    const IS_PROTECTED = 512;
    const IS_PRIVATE = 1024;

    /* Properties */

    public $name;
    public $class;

    function __construct($class, $name = null) {



        if (!class_exists($class)) {
            throw new ReflectionException("Class " . $class . " does not exist ");
        }

    }

    public static function export($argument, $return = false) {
        
    }

    public function __toString() {
        
    }

}

?>