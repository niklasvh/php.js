/* automatically built from ArrayAccess.php*/
PHP.VM.Class.Predefined.ArrayAccess = function( ENV, $$ ) {
ENV.$Class.INew( "ArrayAccess", [], function( M, $, $$ ){
 M.Method( "offsetExists", 1, [{name:"offset"}], false, function( $, ctx, $Static ) {
})
.Method( "offsetGet", 1, [{name:"offset"}], false, function( $, ctx, $Static ) {
})
.Method( "offsetSet", 1, [{name:"offset"}, {name:"value"}], false, function( $, ctx, $Static ) {
})
.Method( "offsetUnset", 1, [{name:"offset"}], false, function( $, ctx, $Static ) {
})
.Create()});

ENV.$Class.Get( "DateTime").prototype.Native = true;
};