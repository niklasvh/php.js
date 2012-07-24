<?php

class Exception {

    protected $message;
    protected $code;
    protected $file;
    protected $line;

    public function __construct($message = "", $code = 0, $previous = NULL) {
        $this->message = $message;
        $this->line = 1;
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
        return $this->line;
    }

    final public function getTrace() {

        return array(
            array("function" => "Error2Exception"),
            array("function" => "fopen")
        );
    }

    final public function getTraceAsString() {
        
    }

    public function __toString() {
        
    }

    final private function __clone() {
        
    }

}

?>
