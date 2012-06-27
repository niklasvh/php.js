<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title></title>
        <script src="src/core.js"></script>
        <script src="src/modules/tokenizer/constants.js"></script>
        <script src="src/modules/tokenizer/lexer.js"></script>
        <script src="src/modules/tokenizer/token_name.js"></script>
        <script src="src/parser/parser.js"></script>

    </head>
    <body>
        <?php $code = '<?php
class A {
	function __call($strMethod, $arrArgs) {
		echo "In " . __METHOD__ . "($strMethod, array(" . implode(\',\',$arrArgs) . "))\n";
		var_dump($this);
	}
}

class B extends A {
	function __call($strMethod, $arrArgs) {
		echo "In " . __METHOD__ . "($strMethod, array(" . implode(\',\',$arrArgs) . "))\n";
		var_dump($this);
	}
	
	function test() {
		A::test1(1,\'a\');
		B::test2(1,\'a\');
		self::test3(1,\'a\');
		parent::test4(1,\'a\');
	}
}

$b = new B();
$b->test();
';

echo "<pre>";
        var_dump(token_get_all($code));
        require_once("tmp/bootstrap.php");

        $parser = new PHPParser_Parser(new PHPParser_Lexer);

        try {
            $stmts = $parser->parse($code);
        } catch (PHPParser_Error $e) {
            echo 'Parse Error: ', $e->getMessage();
        }

        print_r($stmts);
        
        $tokens = token_get_all($code);

        echo "<script> var tokens = " . json_encode($tokens) . ";</script>";
        ?>

        <script>
            var engine = new PHP( tokens );
        </script>
    </body>
</html>
