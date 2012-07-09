<?php

interface ArrayAccess {
    
    /* Methods */

    public function offsetExists($offset);

    public function offsetGet($offset);

    public function offsetSet($offset, $value);

    public function offsetUnset($offset);
}

?>