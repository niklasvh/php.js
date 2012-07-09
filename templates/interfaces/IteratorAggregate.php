<?php

interface IteratorAggregate extends Traversable {

    abstract public function getIterator();
}

?>