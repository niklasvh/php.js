<?php

class Exception {

    protected $message;
    protected $code;
    protected $file;
    protected $line;

    public function __construct($message = "", $code = 0, $previous = NULL) {
        $this->message = $message;
    }

    final public function getMessage() {
        return $this->message;
    }

    final public function getPrevious() {
        
    }

    final public function getCode() {
        
    }

    final public function getFile() {
        
    }

    final public function getLine() {
        
    }

    final public function getTrace() {
        
    }

    final public function getTraceAsString() {
        
    }

    public function __toString() {
        
    }

    final private function __clone() {
        
    }

}

?>
