/* automatically built from Exception.php*/
PHP.VM.Class.Predefined.Exception = function( ENV, $$ ) {
ENV.$Class.New( "Exception", 0, {}, function( M, $ ){
 M.Variable( "message", 2 )
.Variable( "code", 2 )
.Variable( "file", 2 )
.Variable( "line", 2 )
.Method( "__construct", 1, [{name:"message", d: $$("")}, {name:"code", d: $$(0)}, {name:"previous", d: $$(null)}], function( $, ctx ) {
this.$Prop( ctx, "message" )._($("message"));
})
.Method( "getMessage", 33, [], function( $, ctx ) {
return this.$Prop( ctx, "message" );
})
.Method( "getPrevious", 33, [], function( $, ctx ) {
})
.Method( "getCode", 33, [], function( $, ctx ) {
})
.Method( "getFile", 33, [], function( $, ctx ) {
})
.Method( "getLine", 33, [], function( $, ctx ) {
})
.Method( "getTrace", 33, [], function( $, ctx ) {
})
.Method( "getTraceAsString", 33, [], function( $, ctx ) {
})
.Method( "__toString", 1, [], function( $, ctx ) {
})
.Method( "__clone", 36, [], function( $, ctx ) {
})
.Create()});
ENV.$ob("");

};