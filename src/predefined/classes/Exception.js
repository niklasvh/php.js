/* automatically built from Exception.php*/
PHP.VM.Class.Predefined.Exception = function( ENV, $$ ) {
ENV.$Class.New( "Exception", 0, {}, function( M, $ ){
 M.Variable( "message", 2 )
.Variable( "code", 2 )
.Variable( "file", 2 )
.Variable( "line", 2 )
.Method( "__construct", 1, [{"name":"message","def":{"type":"Node_Scalar_String","value":"\"\"","attributes":{"startLine":10,"endLine":1}}},{"name":"code","def":{"type":"Node_Scalar_LNumber","value":"0","attributes":{"startLine":10,"endLine":1}}},{"name":"previous","def":{"type":"Node_Expr_ConstFetch","name":{"parts":"NULL","type":"Node_Name","attributes":{"startLine":10,"endLine":1}},"attributes":{"startLine":10,"endLine":1}}}], function( $, ctx ) {
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

};