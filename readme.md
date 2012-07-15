php.js
======

### PHP VM in JavaScript ###

This library reads PHP code and transforms it into JavaScript code which can be run in the PHP VM in this library, resulting in same results as native PHP.


### Usage ###

`new PHP( code, options );`

#### Example ####

`var engine = new PHP ('<?php echo "Hello world!"; ?>');`

The output can be ready from `engine.vm.OUTPUT_BUFFER`