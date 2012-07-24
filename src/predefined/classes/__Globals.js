/* automatically built from __Globals.php*/
PHP.VM.Class.Predefined.__Globals = function( ENV, $$ ) {
ENV.$Class.New( "__Globals", 0, {Implements: ["ArrayAccess"]}, function( M, $, $$ ){
 M.Method( "offsetExists", 1, [{name:"offset"}], function( $, ctx, $Static ) {
$Static.$Global([$($("offset").$).$]);
return ENV.$isset( $($("offset").$) );
})
.Method( "offsetGet", 1, [{name:"offset"}], function( $, ctx, $Static ) {
$Static.$Global([$($("offset").$).$]);
return $($("offset").$);
})
.Method( "offsetSet", 1, [{name:"offset"}, {name:"value"}], function( $, ctx, $Static ) {
$Static.$Global([$($("offset").$).$]);
$($("offset").$)._($("value"));
})
.Method( "offsetUnset", 1, [{name:"offset"}], function( $, ctx, $Static ) {
$Static.$Global([$($("offset").$).$]);
ENV.unset( $($("offset").$) );
})
.Create()});

ENV.$Class.Get( "DateTime").prototype.Native = true;
};