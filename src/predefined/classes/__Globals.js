/* automatically built from __Globals.php*/
PHP.VM.Class.Predefined.__Globals = function( ENV, $$ ) {
ENV.$Class.New( "__Globals", 0, {Implements: ["ArrayAccess"]}, function( M, $, $$ ){
 M.Method( "offsetExists", 1, [{name:"offset"}], false, function( $, ctx, $Static ) {
$Static.$Global(["[object Object]"]);
return ENV.$isset( $($("offset").$) );
})
.Method( "offsetGet", 1, [{name:"offset"}], false, function( $, ctx, $Static ) {
$Static.$Global(["[object Object]"]);
return $($("offset").$);
})
.Method( "offsetSet", 1, [{name:"offset"}, {name:"value"}], false, function( $, ctx, $Static ) {
$Static.$Global(["[object Object]"]);
$($("offset").$)._($("value"));
})
.Method( "offsetUnset", 1, [{name:"offset"}], false, function( $, ctx, $Static ) {
$Static.$Global(["[object Object]"]);
ENV.unset( $($("offset").$) );
})
.Create()});

ENV.$Class.Get( "DateTime").prototype.Native = true;
};