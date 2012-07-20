/* automatically built from ArrayObject.php*/
PHP.VM.Class.Predefined.ArrayObject = function( ENV, $$ ) {
ENV.$Class.New( "ArrayObject", 0, {Implements: ["IteratorAggregate", "Traversable", "ArrayAccess", "Serializable", "Countable"]}, function( M, $, $$ ){
 M.Constant("STD_PROP_LIST", $$(1))
.Constant("ARRAY_AS_PROPS", $$(2))
.Variable( "pointer", 4, $$(0) )
.Create()});

ENV.$Class.Get( "DateTime").prototype.Native = true;
};