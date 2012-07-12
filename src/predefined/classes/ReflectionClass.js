/* automatically built from ReflectionClass.php*/
PHP.VM.Class.Predefined.ReflectionClass = function( ENV, $$ ) {
ENV.$Class.New( "ReflectionClass", 0, {}, function( M, $ ){
 M.Constant("IS_IMPLICIT_ABSTRACT", $$(16))
.Constant("IS_EXPLICIT_ABSTRACT", $$(32))
.Constant("IS_FINAL", $$(64))
.Variable( "name", 1 )
.Variable( "class", 4 )
.Method( "__construct", 1, [{"name":"argument"}], function( $, ctx ) {
if ( ((ENV.is_string($("argument")))).$Bool.$) {
if ( ((ENV.class_exists($("argument"))).$Not()).$Bool.$) {
throw $$(new (ENV.$Class.Get("ReflectionException"))( this, $$("Class ").$Concat($("argument")).$Concat($$(" does not exist ")) ));
} else {
this.$Prop( ctx, "name" )._($("argument"));
};
};
})
.Method( "export", 9, [{"name":"argument"},{"name":"return","def":{"type":"Node_Expr_ConstFetch","name":{"parts":"false","type":"Node_Name","attributes":{"startLine":27,"endLine":1}},"attributes":{"startLine":27,"endLine":1}}}], function( $, ctx ) {
})
.Method( "__toString", 1, [], function( $, ctx ) {
})
.Create()});

};