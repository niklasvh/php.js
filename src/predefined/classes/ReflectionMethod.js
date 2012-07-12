/* automatically built from ReflectionMethod.php*/
PHP.VM.Class.Predefined.ReflectionMethod = function( ENV, $$ ) {
ENV.$Class.New( "ReflectionMethod", 0, {}, function( M, $ ){
 M.Constant("IS_IMPLICIT_ABSTRACT", $$(16))
.Constant("IS_EXPLICIT_ABSTRACT", $$(32))
.Constant("IS_FINAL", $$(64))
.Variable( "name", 1 )
.Variable( "class", 1 )
.Method( "__construct", 1, [{"name":"class"},{"name":"name","def":{"type":"Node_Expr_ConstFetch","name":{"parts":"null","type":"Node_Name","attributes":{"startLine":16,"endLine":1}},"attributes":{"startLine":16,"endLine":1}}}], function( $, ctx ) {
$("parts")._((ENV.explode($$("::"), $("class"))));
$("class")._($("parts").$Dim( this, $$(0) ));
$("name")._($("parts").$Dim( this, $$(1) ));
if ( ((ENV.class_exists($("class"))).$Not()).$Bool.$) {
throw $$(new (ENV.$Class.Get("ReflectionException"))( this, $$("Class ").$Concat($("class")).$Concat($$(" does not exist ")) ));
};
})
.Method( "export", 9, [{"name":"argument"},{"name":"return","def":{"type":"Node_Expr_ConstFetch","name":{"parts":"false","type":"Node_Name","attributes":{"startLine":32,"endLine":1}},"attributes":{"startLine":32,"endLine":1}}}], function( $, ctx ) {
})
.Method( "__toString", 1, [], function( $, ctx ) {
})
.Create()});

};