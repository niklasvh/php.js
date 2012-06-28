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
        <?php $code = "<?php

$strings = array(
	'<? echo 1; if (isset($a)) print $a+1; $a++; $a--; $a == 2; $a === 2; endif; ?>',
	'<?php switch($a) { case 1: break; default: break; } while($a) { exit; } ?>',
	'<? /* comment */ if (1 || 2) { } $a = 2 | 1; $b = 3^2; $c = 4&2; ?>',
	/* feel free to add more yourself */
	'wrong syntax here'
);

foreach ($strings as $s) {
	var_dump(token_get_all($s));
}

echo 'Done\n';
";

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
