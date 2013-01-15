php.js
======

### PHP VM in JavaScript ###

This library reads PHP code and transforms it into JavaScript code which can be run in the PHP VM in this library, resulting in same results as with PHP. It starts by tokenizing the PHP code into tokens, which it then uses to build an AST tree. Once the tree has been constructed, the script compiles it into JavaScript that can be interpreted by the VM and then executes it. Any additional unconverted code that gets executed within the VM, such as eval or lambda functions will go through the same process before being executed.

The code can be directly run in your browser, meaning you can execute php code straight out of your browser! It can also be run on node.js, but strongly recommend not to, due to potential security issues.

## Some examples ##

 - <a href="http://phpjs.hertzen.com/console.html?gist=3171278">Magic methods</a> (<a href="http://phpjs.hertzen.com/console.html?gist=3171344">2</a>, <a href="http://phpjs.hertzen.com/console.html?gist=3171349">3</a>)
 - <a href="http://phpjs.hertzen.com/console.html?gist=3171392">ArrayAccess</a>
 - <a href="http://phpjs.hertzen.com/console.html?gist=3171359">Lamba functions</a>
 - <a href="http://phpjs.hertzen.com/console.html?gist=3171402">Engine execution orders</a> (<a href="http://phpjs.hertzen.com/console.html?gist=3171408">2</a>,<a href="http://phpjs.hertzen.com/console.html?gist=3171413">3</a>)
 - <a href="http://phpjs.hertzen.com/console.html?gist=3171432">foreach with references</a>
 - <a href="http://phpjs.hertzen.com/console.html?gist=3171462">tokenizer</a>

## Usage ##
    var engine = new PHP ('<?php echo "Hello world!"; ?>');
    console.log( engine.vm.OUTPUT_BUFFER); // the outputted buffer from the script

The code is by default run synchronously so the output will be immidiately readable upon the engine finishing execution. Alternatively, the VM can be set to run under a web worker as well, in which case a callback function will need to be provided.

## Status ##

I took a test driven approach to developing this library, which means that I have been mostly focusing on getting the php unit tests (which PHP uses itself) to work correctly. If a certain functionality hasn't been a part of the base unit tests (around 670 in total), it most likely won't work or only works partially. Additionally, only a fraction of module functions have been implemented, and even for the ones that have been, many of them are only partially implemented (i.e. signature checks haven't really been implemented to any functions, although user created functions support them). However, additional functions can easily be added, as they can be written in PHP and have them compiled into JavaScript.

The current status of the passing tests can be seen here. I'll be the first admit that there are still a lot of bugs, but considering the complexity of the language, it is well on its way.

## License ##
JavaScript code licensed under MIT license
PHP Files and tests under The PHP License, version 3.01

## Credits ##
 - Test cases from <a href="https://github.com/php/php-src/">php-src</a> -  The PHP License, version 3.01
 - Grammar parser adapted from <a href="https://github.com/nikic/PHP-Parser">PHP-Parser</a> - by Nikita Popov

## Questions & Comments ##

If you encounter a bug, please feel free to post it on GitHub. For questions or comments, you can contact me at Twitter <a href="https://twitter.com/niklasvh">@niklasvh</a> or <a href="https://plus.google.com/115030581977322198102/posts">Google Plus</a>