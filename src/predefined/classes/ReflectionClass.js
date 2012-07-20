/* automatically built from ReflectionClass.php*/
PHP.VM.Class.Predefined.ReflectionClass = function( ENV, $$ ) {
ENV.$Class.New( "ReflectionClass", 0, {}, function( M, $, $$ ){
 M.Constant("IS_IMPLICIT_ABSTRACT", $$(16))
.Constant("IS_EXPLICIT_ABSTRACT", $$(32))
.Constant("IS_FINAL", $$(64))
.Variable( "name", 1 )
.Variable( "class", 4 )
.Method( "__construct", 1, [{name:"argument"}], function( $, ctx, $Static ) {
if ( ((ENV.$F("is_string", arguments, $("argument")))).$Bool.$) {
if ( ((ENV.$F("class_exists", arguments, $("argument"))).$Not()).$Bool.$) {
throw $$(new (ENV.$Class.Get("ReflectionException"))( this, $$("Class ").$Concat($("argument")).$Concat($$(" does not exist ")) ));
} else {
$("this").$Prop( ctx, "name" )._($("argument"));
};
};
})
.Method( "getProperty", 1, [{name:"name"}], function( $, ctx, $Static ) {
$("parts")._((ENV.$F("explode", arguments, $$("::"), $("name"))));
if ( ((ENV.$F("count", arguments, $("parts"))).$Greater($$(1))).$Bool.$) {
$$(new (ENV.$Class.Get("ReflectionMethod"))( this, $("parts").$Dim( this, $$(0) ), $("parts").$Dim( this, $$(1) ) ));
};
})
.Method( "implementsInterface", 1, [{name:"interface"}], function( $, ctx, $Static ) {
if ( ((ENV.$F("interface_exists", arguments, $("interface"))).$Not()).$Bool.$) {
throw $$(new (ENV.$Class.Get("ReflectionException"))( this, $$("Interface ").$Concat($("interface")).$Concat($$(" does not exist ")) ));
};
})
.Method( "export", 9, [{name:"argument"}, {name:"return", d: $$(false)}], function( $, ctx, $Static ) {
})
.Method( "__toString", 1, [], function( $, ctx, $Static ) {
})
.Create()});

};