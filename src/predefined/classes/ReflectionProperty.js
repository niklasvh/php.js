/* automatically built from ReflectionProperty.php*/
PHP.VM.Class.Predefined.ReflectionProperty = function( ENV, $$ ) {
ENV.$Class.New( "ReflectionProperty", 0, {}, function( M, $ ){
 M.Constant("IS_STATIC", $$(1))
.Constant("IS_PUBLIC", $$(256))
.Constant("IS_PROTECTED", $$(512))
.Constant("IS_PRIVATE", $$(1024))
.Variable( "name", 1 )
.Variable( "class", 1 )
.Method( "__construct", 1, [{"name":"class"},{"name":"name","def":{"type":"Node_Expr_ConstFetch","name":{"parts":"null","type":"Node_Name","attributes":{"startLine":16,"endLine":1}},"attributes":{"startLine":16,"endLine":1}}}], function( $, ctx ) {
if ( ((ENV.class_exists($("class"))).$Not()).$Bool.$) {
throw $$(new (ENV.$Class.Get("ReflectionException"))( this, $$("Class ").$Concat($("class")).$Concat($$(" does not exist ")) ));
};
})
.Method( "export", 9, [{"name":"argument"},{"name":"return","def":{"type":"Node_Expr_ConstFetch","name":{"parts":"false","type":"Node_Name","attributes":{"startLine":26,"endLine":1}},"attributes":{"startLine":26,"endLine":1}}}], function( $, ctx ) {
})
.Method( "__toString", 1, [], function( $, ctx ) {
})
.Create()});

};