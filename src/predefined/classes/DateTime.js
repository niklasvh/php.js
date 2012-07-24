/* automatically built from DateTime.php*/
PHP.VM.Class.Predefined.DateTime = function( ENV, $$ ) {
ENV.$Class.New( "DateTime", 0, {}, function( M, $, $$ ){
 M.Constant("ATOM", $$("Y-m-d\\TH:i:sP"))
.Constant("COOKIE", $$("l, d-M-y H:i:s T"))
.Constant("ISO8601", $$("Y-m-d\\TH:i:sO"))
.Constant("RFC822", $$("D, d M y H:i:s O"))
.Constant("RFC850", $$("l, d-M-y H:i:s T"))
.Constant("RFC1036", $$("D, d M y H:i:s O"))
.Constant("RFC1123", $$("D, d M Y H:i:s O"))
.Constant("RFC2822", $$("D, d M Y H:i:s O"))
.Constant("RFC3339", $$("Y-m-d\\TH:i:sP"))
.Constant("RSS", $$("D, d M Y H:i:s O"))
.Constant("W3C", $$("Y-m-d\\TH:i:sP"))
.Method( "__construct", 1, [{name:"time", d: $$("now")}, {name:"timezone", d: $$(null), p: "DateTimeZone"}], false, function( $, ctx, $Static ) {
})
.Method( "add", 1, [{name:"interval", p: "DateInterval"}], false, function( $, ctx, $Static ) {
})
.Method( "createFromFormat", 9, [{name:"format", p: "string"}, {name:"time", p: "string"}, {name:"timezone", p: "DateTimeZone"}], false, function( $, ctx, $Static ) {
})
.Method( "diff", 1, [{name:"datetime2", p: "DateTime"}, {name:"absolute", d: $$(false)}], false, function( $, ctx, $Static ) {
})
.Method( "format", 1, [{name:"format"}], false, function( $, ctx, $Static ) {
})
.Method( "getLastErrors", 9, [], false, function( $, ctx, $Static ) {
})
.Method( "getOffset", 1, [], false, function( $, ctx, $Static ) {
})
.Method( "getTimestamp", 1, [], false, function( $, ctx, $Static ) {
})
.Method( "getTimezone", 1, [], false, function( $, ctx, $Static ) {
})
.Method( "modify", 1, [{name:"modify"}], false, function( $, ctx, $Static ) {
})
.Method( "__set_state", 9, [{name:"array", p: "array"}], false, function( $, ctx, $Static ) {
})
.Method( "setDate", 1, [{name:"year"}, {name:"month"}, {name:"day"}], false, function( $, ctx, $Static ) {
})
.Method( "setISODate", 1, [{name:"year"}, {name:"week"}, {name:"day", d: $$(1)}], false, function( $, ctx, $Static ) {
})
.Method( "setTime", 1, [{name:"hour"}, {name:"minute"}, {name:"second", d: $$(0)}], false, function( $, ctx, $Static ) {
})
.Method( "setTimestamp", 1, [{name:"unixtimestamp"}], false, function( $, ctx, $Static ) {
})
.Method( "setTimezone", 1, [{name:"timezone", p: "DateTimeZone"}], false, function( $, ctx, $Static ) {
})
.Method( "sub", 1, [{name:"interval", p: "DateInterval"}], false, function( $, ctx, $Static ) {
})
.Method( "__wakeup", 1, [], false, function( $, ctx, $Static ) {
})
.Create()});

ENV.$Class.Get( "DateTime").prototype.Native = true;
};