<?php

class ReflectionMethod {
    /* Constants */

    const IS_IMPLICIT_ABSTRACT = 16;
    const IS_EXPLICIT_ABSTRACT = 32;
    const IS_FINAL = 64;

    /* Properties */

    public $name;
    public $class;

    public function __construct($class, $name = null) {

        //   if ( !is_string($name)) {

        $parts = explode("::", $class);
        if (count($parts) > 1) {
            $class = $parts[0];
            $name = $parts[1];
      
        }

        if (!class_exists($class)) {
            throw new ReflectionException("Class " . $class . " does not exist ");
        }
        
        $this->name = $name;
        
        $this->class = $class;

        //   }
    }

    public static function export($argument, $return = false) {
        
    }

    public function __toString() {
        
    }

}

?>