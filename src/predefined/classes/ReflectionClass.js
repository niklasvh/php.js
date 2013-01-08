/* automatically built from ReflectionClass.php*/
PHP.VM.Class.Predefined.ReflectionClass = function( ENV, $$ ) {
ENV.$Class.New( "ReflectionClass", 0, {}, function( M, $, $$ ){
 M.Constant("IS_IMPLICIT_ABSTRACT", $$(16))
.Constant("IS_EXPLICIT_ABSTRACT", $$(32))
.Constant("IS_FINAL", $$(64))
.Variable( "name", 1 )
.Variable( "class", 4 )
.Method( "__construct", 1, [{name:"argument"}], false, function( $, ctx, $Static ) {
if ( ((ENV.$F("is_string", arguments, $("argument")))).$Bool.$) {
if ( ($$(!(ENV.$F("class_exists", arguments, $("argument"))).$Bool.$)).$Bool.$) {
throw $$(new (ENV.$Class.Get("ReflectionException"))( this, $$("Class ").$Concat($("argument")).$Concat($$(" does not exist ")) ));
} else {
$("this").$Prop( ctx, "name" )._($("argument"));
};
};
})
.Method( "getMethods", 1, [], false, function( $, ctx, $Static ) {
$("methods")._((ENV.$F("get_class_methods", arguments, $("this").$Prop( ctx, "name", true ))));
$("arr")._(ENV.array([]));
var iterator1 = ENV.$foreachInit($("methods"), ctx);
while(ENV.foreach( iterator1, false, $("methodName"))) {
$("parent")._((ENV.$F("get_parent_class", arguments, $("this").$Prop( ctx, "name", true ))));
if ( ((ENV.$F("method_exists", arguments, $("parent"), $("methodName")))).$Bool.$) {
$("arr").$Dim( this, undefined )._($$(new (ENV.$Class.Get("ReflectionMethod"))( this, $("parent"), $("methodName") )));
} else {
$("arr").$Dim( this, undefined )._($$(new (ENV.$Class.Get("ReflectionMethod"))( this, $("this").$Prop( ctx, "name", true ), $("methodName") )));
};
} ENV.$foreachEnd( iterator1 );
return $("arr");
})
.Method( "getProperty", 1, [{name:"name"}], false, function( $, ctx, $Static ) {
$("parts")._((ENV.$F("explode", arguments, $$("::"), $("name"))));
if ( ((ENV.$F("count", arguments, $("parts"))).$Greater($$(1))).$Bool.$) {
$$(new (ENV.$Class.Get("ReflectionMethod"))( this, $("parts").$Dim( this, $$(0) ), $("parts").$Dim( this, $$(1) ) ));
};
})
.Method( "implementsInterface", 1, [{name:"interface"}], false, function( $, ctx, $Static ) {
if ( ($$(!(ENV.$F("interface_exists", arguments, $("interface"))).$Bool.$)).$Bool.$) {
throw $$(new (ENV.$Class.Get("ReflectionException"))( this, $$("Interface ").$Concat($("interface")).$Concat($$(" does not exist ")) ));
};
})
.Method( "export", 9, [{name:"argument"}, {name:"return", d: $$(false)}], false, function( $, ctx, $Static ) {
})
.Method( "__toString", 1, [], false, function( $, ctx, $Static ) {
})
.Create()});

ENV.$Class.Get( "DateTime").prototype.Native = true;
};