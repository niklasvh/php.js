<?php

interface Serializable {
    /* Methods */

    abstract public function serialize();

    abstract public function unserialize($serialized);
}

?>