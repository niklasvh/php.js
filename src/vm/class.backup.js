PHP.VM.Class = function( $globalself ) {

    var $CLASSNAMES = {};

    return function( args ) {
     
        var className = args[ 0 ], classType = args[ 1 ], opts = args[ 2 ];
     
        var parent, implementArr;
    
        if (opts.Extends  !== undefined) {
            parent = opts.Extends;
        }
    
        if (opts.Implements !== undefined ) {
            implementArr = opts.Implements
        }
    
        var classStructure = {
            $scope: {},
            $from: {},
        },
        $precallCheck = function( contextTypeHinting, func, argCheck ) {
            if (contextTypeHinting !== undefined) {

            
            
                var mustBe = function(argIndex, msg) {
                
                    var intro = "Argument " + (argIndex + 1) + " passed to " + className + "::" + func + "() " + msg + ", ",
                    outro,
                    valObj = argCheck[ argIndex ],
                    val;
                    if (valObj  !== undefined) {
                        val = valObj.$value;
                    } 
                        
                    if (val !== undefined && val !== null) {
                        if (val.$name !== undefined) {
                            outro = "instance of " + argCheck[ argIndex ].$value.$name + " given";
                        } else {
                            switch(argCheck[ argIndex ].$type ) {
                                case "int":
                                    outro =  "integer given";
                                    break;
                                default:
                                    outro = argCheck[ argIndex ].$type + "given"; 
                            }
                       
                        }
                    
                    } else {
                        outro = "none given";
                    }
                
                    $ERROR(intro + outro, 4096);
                
               
                }
            
                contextTypeHinting.forEach(function(typeHint, argIndex){
            
                    if (typeHint !== undefined) {
                   
                        if (argCheck[ argIndex ] !== undefined && argCheck[ argIndex ].$value !== undefined) {
                            var val = argCheck[ argIndex ].$value;
                            if (typeof typeHint === "object") {
                         
                                typeHint = typeHint[0];
                            }
                        
                            if (['array','string','int','bool'].indexOf(typeHint.toLowerCase()) !== -1) {
                                if (argCheck[ argIndex ].$type !== typeHint.toLowerCase()) {
                                    if (argCheck[ argIndex ].$type !== "null") { // TODO check typeHint is object?
                                        mustBe(argIndex, "must be an " + typeHint.toLowerCase());
                                    }
                                
                                }
                            } else  if ($globalself[$CLASSNAMES[ typeHint.toLowerCase() ]] !== undefined) {
                                var classObj = $globalself[$CLASSNAMES[ typeHint.toLowerCase() ]];
                                if (val.$name !== undefined && val.$name.toLowerCase() !== typeHint.toLowerCase()) {
                                    mustBe(argIndex,"must implement interface " + $CLASSNAMES[ typeHint.toLowerCase() ]);
                                } 

                            } else if(val.$name !== undefined ) {
                                mustBe(argIndex, "must be an instance of " + typeHint);
                           

                            }
                        } else if (typeof typeHint !== "object") {
                        
                            mustBe(argIndex, "must be an instance of " + typeHint);
                        }



                    }
                });
            }
        },
        $call = function(context, func) {

            // this = target
            // context = calling from
            var contextFunc,
            contextTypeHinting;
            console.log(this.$currentScope + "::" + func + " from " + context.$currentScope);



            if (this.$staticCall === true) {

                // static call


                if (context.$scope !== undefined && context.$scope[ this.$from[func] ] !== undefined) {
                    // we are inside the class, scope resolution
                    storage = context.$getStorage(func, this.$from[func]);




                    if (checkType(storage.type, "PRIVATE") && context.$currentScope !== this.$from[ func ]) {

                        $ERROR("Call to private method " + this.$from[ func ] + "::" + func + "() from context '" + ((context.$currentScope === undefined) ? "" : context.$currentScope) + "'");
                    }

                    contextFunc = storage.item;
                    contextTypeHinting = storage.typeHinting;


                } else {

                    // outside of the class

                    storage  = this.$getStorage(func);



                    contextFunc = storage.boundItem;
                    contextTypeHinting = storage.typeHinting;
                    if (checkType(storage.type, "PROTECTED")) {

                        $ERROR("Call to protected method " + className + "::" + func + "() from context '" + ((context.$currentScope === undefined) ? "" : context.$currentScope) + "'");
                    } else if (checkType(storage.type, "PRIVATE")) {
                        $ERROR("Call to private method " + className + "::" + func + "() from context '" + ((context.$currentScope === undefined) ? "" : context.$currentScope) + "'");
                    }
                }

                if (storage.method === true && checkType(storage.type, "ABSTRACT")) {
                    $ERROR("Cannot call abstract method " + className + "::" + func + "()");
                }

            } else {
                // non-static call

                var contextFunc,
                storage,
                useName,
                scopeName = func.split("::");



                func = (scopeName.length === 1) ? scopeName[0] : scopeName[1];
                useName = (scopeName.length === 1) ? context.$currentScope  : scopeName[0];

                if (scopeName.length > 1) {
                    storage = this.$getStorage(func, useName);

                    if (storage.method === true && checkType(storage.type, "ABSTRACT")) {
                        $ERROR("Cannot call abstract method " + useName + "::" + func + "()");
                    }
                } else {


                    if (context.$scope !== undefined && context.$scope[ this.$currentScope ] !== undefined) {
                        // within scope

                        storage = this.$getStorage(func);

                        var newStorage = this.$getStorage(func, useName);




                        if (newStorage.method === true && checkType(newStorage.type, "PRIVATE")) {
                            // A derived class does not know about privates of ancestors
                            contextFunc = newStorage.item;
                            contextTypeHinting = newStorage.typeHinting;
                        } else {
                            contextFunc = storage.item;
                            contextTypeHinting = storage.typeHinting;
                            if (checkType(storage.type, "PRIVATE") && context.$currentScope !== this.$from[ func ]) {
                                // maybe this class DOES have it, it could have just been redefined later

                                if (newStorage.method !== true) {
                                    $ERROR("Call to private method " + this.$from[ func ] + "::" + func + "() from context '" + ((context.$currentScope === undefined) ? "" : context.$currentScope) + "'");
                                }

                                contextFunc = newStorage.item;
                                contextTypeHinting = newStorage.typeHinting;
                            }
                        }



                    } else {
                        // outside of scope

                        storage = this.$getStorage(func);

                        if (checkType(storage.type, "PUBLIC")) {
                            contextFunc = storage.item;
                            contextTypeHinting = storage.typeHinting;
                        }


                        if (checkType(storage.type, "PROTECTED")) {
                            $ERROR("Call to protected method " + className + "::" + func + "() from context '" + ((context.$name === undefined) ? "" : context.$name) + "'");
                        }




                    }
                }

            //   $$$.__CLASS__ = new PHP.VM.Variable(this.$from[ func ]);
            //   $$$.__METHOD__ = new PHP.VM.Variable(this.$from[ func ] + "::" + func);

            }
            storage = this.$getStorage("__call");



            // perform type hint check on called function
            $precallCheck( contextTypeHinting, func, Array.prototype.slice.call(arguments, 2) );



            if (typeof contextFunc === "function") {
                this.$currentScope = this.$from[ func ];
                return contextFunc.apply(this, Array.prototype.slice.call(arguments, 2));

            } else if(storage.method === true) {

                if (this.$staticCall === true) {
                    // find top-most __call
                    storage = context.$getStorage("__call");
                }

                return storage.item(new PHP.VM.Variable(func), __$VARARR__( Array.prototype.slice.call(arguments, 2) ));
            }
        },
        methods,
        types = {
            PUBLIC: 1,
            PROTECTED: 2,
            PRIVATE: 4,
            STATIC: 8,
            ABSTRACT: 16,
            FINAL: 32
        };

        $CLASSNAMES[className.toLowerCase()] = className;
        // define these for constants
      //  $globalself.$_.__METHOD__ = $globalself.$_.__CLASS__ =  new PHP.VM.Variable(className);

        var getStorageFunc = function(item, name) {

            if ( name === undefined ) {

                if (this.$scope[ this.$from[ item ] ] === undefined || this.$scope[ this.$from[ item ] ][ item ] === undefined ) {
                    return {};
                }

                return this.$scope[ this.$from[ item ] ][ item ];
            } else {

                if (this.$scope[ name ] === undefined || this.$scope[ name ][ item ] === undefined ) {
                    return {};
                }

                return this.$scope[ name ][ item ];
            }


        },
        getStorage = getStorageFunc.bind( classStructure );

        // create current scope in structure
        classStructure.$scope[ className ] = {};

        // inherit parent structures into scope
        if ( parent !== undefined ) {

            if (parent.$final === true) {
                $ERROR("Class derived may not inherit from final class (" + parent.$name + ")");
            }

            if (parent.$interface === true) {
                $ERROR("Class Tester cannot extend from interface " + parent.$name);
            }


            $INHERITANCE.childOf(className, parent.$name);


            parent.inheritTo( classStructure );
        }



        // apply interfaces
        if (implementArr !== undefined) {
            implementArr.forEach(function(implementName){
                var implement = $getClass(implementName, "interface");
                if (implement.$interface !== true) {
                    $ERROR(className + " cannot implement " + implement.$name + " - it is not an interface");
                }



                implement.implement( classStructure.$scope );

            });

        }




        // helper function for checking whether variable/method is of type
        function checkType( value, type) {
            return ((value & types[ type ]) === types[ type ]);
        }


        // class methods used for creation of class
        methods = {
            $abstract: checkType(classType, "ABSTRACT"),
            $final: checkType(classType, "FINAL"),
            $name: className,
            $scope: classStructure.$scope, // leaking it outside, get_class_methods needs it at least
            $declare: function() {
                // declaring function, i.e. no new methods etc getting added now

                delete methods.addMethod;
                delete methods.addVar;
                delete methods.constant;

                if (methods.$abstract === false) {

                    if (implementArr !== undefined) {
                        implementArr.forEach(function(implementName){
                            var implement = $getClass(implementName, "interface");
                            implement.checkImplement( className, classStructure.$scope );

                        });

                    }

                }

                var scope,
                $$$ = {
                    $from: {},
                    $scope: {}
                },
                content,
                item;



                // clone $from info
                for ( item in classStructure.$from ) {
                    $$$.$from[ item ] = classStructure.$from[ item ];
                }

                for ( scope in classStructure.$scope ) {

                    $$$.$scope[ scope ] = {};

                    for ( item in classStructure.$scope[ scope ] ) {

                        // item to clone
                        content = classStructure.$scope[ scope ][ item ];

                        // check if its a variable or method
                        if (content.method === true) {

                            // bind stuff to 'this' for declared functions
                            $$$.$scope[ scope ][ item ] = {
                                item: content.item.bind({
                                    $name: className, // add a reference to the creator of the instance
                                    $currentScope: scope, // reference to where it is situated
                                    $scope: $$$.$scope,  // reference to the full scope
                                    $from: $$$.$from, // reference to $from data
                                    $call: $call.bind({
                                        $scope: $$$.$scope,
                                        $from: $$$.$from,
                                        $currentScope: className,
                                        $getStorage: getStorage
                                    }), // reference to $call function
                                    $self: methods,
                                    $parent: parent,
                                    $getStorage: getStorage
                                }),
                                typeHinting: content.typeHinting,
                                method: content.method,
                                type: content.type
                            };

                        }else {
                    // its a variable, check if static
                    /*
                        if ( !checkType(content.type, "STATIC") ) {
                            // not static, clone it

                            $$$.$scope[ scope ][ item ] = {
                                item: content.item.$clone(),
                                method: content.method,
                                type: content.type
                            };

                        } else {

                            // static, so use reference
                            $$$.$scope[ scope ][ item ] = content;
                        }*/
                    }



                    }

                }



                methods.$call = $call.bind({
                    $name: className,
                    $currentScope: className,
                    $scope: $$$.$scope,
                    $from: $$$.$from, // reference to $from data
                    $getStorage: getStorage,
                    $staticCall: true
                });

            },




            inheritTo: function ( toClassStructure ) {
                var i,
                scope;

                // clone from info
                for ( i in classStructure.$from ) {
                    toClassStructure.$from[ i ] = classStructure.$from[ i ];
                }

                // get references to all members in all scopes, not doing any cloning yet
                for ( scope in classStructure.$scope ) {
                    toClassStructure.$scope[ scope ] = {};
                    for ( i in classStructure.$scope[ scope ] ) {
                        toClassStructure.$scope[ scope ][ i ] = classStructure.$scope[ scope ][ i ];
                    }
                }

            },
            addMethod: function(  name, type, func, varTypes, $ ) {

                if (type === 8) {
                    // static -> public static
                    type = 9;
                }

                if (type === 32) {
                    // final -> public final
                    type = 33;
                }


                if (name === "__call") {
                    if (func.length !== 2) {
                        $ERROR("Method " + className + "::__call() must take exactly 2 arguments");
                    }

                    if (type === 4 || type === 8) {
                        $ERROR("The magic method __call() must have public visibility and cannot be static", 2);
                        type = 1;
                    }

                } else if (name === "__get") {
                    if (func.length !== 1) {
                        $ERROR("Method " + className + "::__get() must take exactly 1 argument");
                    }
                }else if (name === "__set") {
                    if (func.length !== 2) {
                        $ERROR("Method " + className + "::__set() must take exactly 2 arguments");
                    }
                } else if (name === "__construct" || name === className) {
                    // it is a constructor

                    // is there a previous constructor inherited
                    var storage,
                    searchParents = true,
                    loopParent = className;


                    while (searchParents) {
                        // PHP 5 style
                        storage = getStorage("__construct", loopParent);
                        if (storage.method === true && checkType(storage.type, "PUBLIC")) {
                            searchParents = false;

                            if (storage.method === true && checkType(storage.type, "FINAL")) {
                                $ERROR("Cannot override final " + classStructure.$from.__construct + "::__construct() with " + className +"::" + name + "()");
                            }

                        } else {
                            // PHP 4 style
                            storage = getStorage(loopParent, loopParent);
                            if (storage.method === true && checkType(storage.type, "PUBLIC")) {
                                searchParents = false;

                                if (storage.method === true && checkType(storage.type, "FINAL")) {
                                    $ERROR("Cannot override final " + classStructure.$from[loopParent] + "::" + classStructure.$from[loopParent] + "() with " + className +"::" + name + "()");
                                }
                            }
                        }

                        loopParent = $INHERITANCE.getParent(loopParent);

                        if (loopParent === undefined) {
                            break;
                        }

                    }



                }

                // is there a previous value with same name inherited?
                var storage = getStorage( name );

                /*
            if (storage.method === true && storage.item.length !== func.length) {
                $ERROR("Declaration of " + className + "::"+ name +"() should be compatible with that of "+ classStructure.$from[ name ] +"::"+ name +"()", 2048);
            }*/

                if (storage.method === true && !$compareArrays(storage.typeHinting,varTypes)) {
                    $ERROR("Declaration of " + className + "::"+ name +"() should be compatible with that of "+ classStructure.$from[ name ] +"::"+ name +"()", 2048);
                }
                if (checkType(type, "ABSTRACT") && !checkType(classType, "ABSTRACT")) {
                    $ERROR("Class " + className + " contains 1 abstract method and must therefore be declared abstract or implement the remaining methods (" + className + "::"+name+")");
                }

                if (storage.method === true && checkType(storage.type, "FINAL")) {
                    $ERROR("Cannot override final method " + classStructure.$from[ name ] + "::" + name + "()");
                }




                if ( !checkType(type, "STATIC")) {
                    // we are assigning a non-static

                    if (storage.type !== undefined && checkType(storage.type, "STATIC") && !checkType(storage.type, "PRIVATE")) {
                        $ERROR("Cannot make static method "+ classStructure.$from[ name ] +"::" + name  + "() non static in class " + className);

                    }

                } else {
                    // assigning a static
                    if (storage.type !== undefined && !checkType(storage.type, "STATIC") && !checkType(storage.type, "PRIVATE")) {
                        $ERROR("Cannot make non static method "+ classStructure.$from[ name ] +"::" + name  + "() static in class " + className);
                    }
                }


                // check that we aren't altering the permissions in an illegal way
                if (storage.type !== undefined  && checkType(storage.type, "PROTECTED") && checkType(type, "PRIVATE")  ) {
                    $ERROR("Access level to " + className + "::" + name  + "() must be protected (as in class "+ classStructure.$from[ name ] +") or weaker");
                }

                if (storage.type !== undefined  && checkType(storage.type, "PUBLIC") && ( checkType(type, "PRIVATE") || checkType(type, "PROTECTED") ) ) {
                    $ERROR("Access level to " + className + "::" + name  + "() must be public (as in class "+ classStructure.$from[ name ] +")");
                }


                classStructure.$scope[ className ][ name ] = {
                    type: type,
                    method: true,
                    item: func,
                    typeHinting: varTypes,
                    boundItem: func
                };

                $.$self = methods;
                $.__FUNCTION__ = new PHP.VM.Variable( name );
                $.__CLASS__ = new PHP.VM.Variable( className );
                $.__METHOD__ = new PHP.VM.Variable( className + "::" + name );



                classStructure.$from[ name ] = className;

            },

            addVar: function(name, type, func) {
                var storage;

                if (func === undefined){
                    func = new PHP.VM.Variable(null);
                }

                if (type === 8) {
                    // static -> public static
                    type = 9;
                }



                // is there a previous value with same name inherited?
                storage = getStorage( name );

                if ( !checkType(type, "STATIC")) {
                    // we are assigning a non-static

                    if (storage.type !== undefined && checkType(storage.type, "STATIC") && !checkType(storage.type, "PRIVATE")) {
                        $ERROR("Cannot redeclare static "+ classStructure.$from[ name ] +"::$" + name  + " as non static " + className + "::$" + name);

                    }

                } else {
                    // assigning a static
                    if (storage.type !== undefined && !checkType(storage.type, "STATIC") && !checkType(storage.type, "PRIVATE")) {
                        $ERROR("Cannot redeclare non static "+ classStructure.$from[ name ] +"::$" + name  + " as static " + className + "::$" + name);
                    }
                }


                // check that we aren't altering the permissions in an illegal way
                if (storage.type !== undefined  && checkType(storage.type, "PROTECTED") && checkType(type, "PRIVATE")  ) {
                    $ERROR("Access level to " + className + "::$" + name  + " must be protected (as in class "+ classStructure.$from[ name ] +") or weaker");
                }

                if (storage.type !== undefined  && checkType(storage.type, "PUBLIC") && ( checkType(type, "PRIVATE") || checkType(type, "PROTECTED") ) ) {
                    $ERROR("Access level to " + className + "::$" + name  + " must be public (as in class "+ classStructure.$from[ name ] +")");
                }



                classStructure.$scope[ className ][ name ] = {
                    type: type,
                    method: false,
                    item: func
                };

                classStructure.$from[ name ] = className;



            },
            constant: function( item, val) {

                if (val !== undefined) {
                    // set class constant
                
                    if (val.$type === "array") {
                        $ERROR("Arrays are not allowed in class constants");
                    }
                
                    $CLASSCONSTANTS.set(className, item, val);
                }


            },

            $static: function ( context, item ) {


                var storage = classStructure.$scope[ className ][ item ];

                if (storage === undefined) {
                    // inherit through reference
                    classStructure.$scope[ className ][ item ] = {
                        method: classStructure.$scope[ classStructure.$from[ item ] ][ item ].method,
                        type:  classStructure.$scope[ classStructure.$from[ item ] ][ item ].type,
                        item: new PHP.VM.Variable()
                    }

                    // set the reference

                    classStructure.$scope[ className ][ item ].item.$ref( classStructure.$scope[ classStructure.$from[ item ] ][ item ].item );
                    classStructure.$scope[ classStructure.$from[ item ] ][ item ].item.$STATIC = true;


                }
                // return the value
                if (classStructure.$scope[ className ][ item ].method === false) {
                    return classStructure.$scope[ className ][ item ].item;
                }


            },
            $create: function(context) {
                var scope,
                item,
                content,
                returnObj,
                $$$ = {
                    $from: {},
                    $scope: {}
                },
                getStorage = getStorageFunc.bind( $$$ ),
                callBind = {

                    $scope: $$$.$scope,
                    $from: $$$.$from, // reference to $from data
                    $getStorage: getStorage
                },
                propBind = {
                    $scope: $$$.$scope,
                    $from: $$$.$from, // reference to $from data
                    $getStorage: getStorage
                },
                $callable = function( context, func ) {
                    var storage = this.$getStorage( func );

                    if (context.$name === className) {
                        // within scope

                        if (storage.method ===  true) {
                            // todo check private vals
                            return true;
                        }

                    } else {
                        // outside of scope
                        if (storage.type ===  types.PUBLIC) {
                            return true;
                        }

                    }
                    return false;


                },
                $prop = function( context, item, value ) {
                    // property getter/setter
                    var storage,
                    contextFunc;


                    if (this.$scope[ context.$name ] !== undefined) {
                        // within scope


                        storage = this.$getStorage(item);

                        var newStorage = this.$getStorage(item, this.$currentScope);

                        if (newStorage.method === false && checkType(newStorage.type, "PRIVATE")) {
                            // A derived class does not know about privates of ancestors
                            contextFunc = newStorage;
                        } else {
                            contextFunc = storage;
                            if (checkType(storage.type, "PRIVATE") && className !== this.$from[ item ]) {
                                // maybe this class DOES have it, it could have just been redefined later

                                if (newStorage.method !== false) {
                                // $ERROR("Call to private method " + $$.$from[ func ] + "::" + func + "() from context '" + ((context.$name === undefined) ? "" : context.$name) + "'");
                                }
                                contextFunc = newStorage.item;



                            }
                        }


                    } else {
                        // outside of scope

                        storage = this.$getStorage(item);


                        if ( checkType(storage.type, "STATIC") ) {
                            $ERROR("Cannot access protected property " + className + "::$" + item);
                        }

                        if ( checkType(storage.type, "PUBLIC") ) {
                            contextFunc = storage;
                        }


                        if (checkType(storage.type, "PROTECTED")) {
                    //         $ERROR("Call to protected method " + className + "::" + func + "() from context '" + ((context.$name === undefined) ? "" : context.$name) + "'");
                    }

                    }



                    if (value === undefined) {
                        // getter



                        var obj;

                        if ( contextFunc !== undefined && contextFunc.method === false) {

                            //   obj = storage.item;
                            obj = contextFunc.item;
                        } else if ((this.$getStorage("__get")).type) {

                            obj = (this.$getStorage("__get")).item( new PHP.VM.Variable(item) );
                        }

                        if (obj === undefined) {
                            return new PHP.VM.Variable(null);
                        } else {
                            return obj;
                        }

                    } else {
                        // setter

                        if (value instanceof PHP.VM.Variable === false) {
                            value = new PHP.VM.Variable(value);
                        }

                        if ( contextFunc !== undefined && contextFunc.method === false ) {

                            contextFunc.item = value;
                            return contextFunc.item;
                        } else if ( checkType((this.$getStorage("__set")).type, "PUBLIC") ) {
                            var ret = (this.$getStorage("__set")).item( new PHP.VM.Variable(item), value );

                            if (ret === undefined) {
                                ret = value;
                            }

                            return ret;
                        } else {
                        
                            this.$scope[ this.$currentScope ][ item ] = {
                                method: false,
                                item: value,
                                type: 1 // public
                            };

                            return this.$scope[ this.$currentScope ][ item ].item

                        }





                    }
                };

                if (methods.$abstract === true) {
                    $ERROR("Cannot instantiate abstract class " + className);
                }


                function cloneStructure( classStructure, $$$, getStorage) {

                    var item, scope;


                    // clone $from info
                    for ( item in classStructure.$from ) {
                        $$$.$from[ item ] = classStructure.$from[ item ];
                    }



                    // clone structure into $scope

                    for ( scope in classStructure.$scope ) {

                        $$$.$scope[ scope ] = {};

                        for ( item in classStructure.$scope[ scope ] ) {

                            // item to clone
                            content = classStructure.$scope[ scope ][ item ];

                            // check if its a variable or method
                            if (content.method === true) {
                                // bind stuff to 'this' for declared functions
                                $$$.$scope[ scope ][ item ] = {
                                    item: (item === "__clone") ? content.item : content.item.bind({
                                        $name: className, // add a reference to the creator of the instance
                                        $currentScope: scope, // reference to where it is situated
                                        $scope: $$$.$scope,  // reference to the full scope
                                        $from: $$$.$from, // reference to $from data
                                        $prop: $prop, // reference to $prop function
                                        $call: $call.bind( {

                                            $scope: $$$.$scope,
                                            $from: $$$.$from, // reference to $from data
                                            $getStorage: getStorage,
                                            $currentScope: scope
                                        } ), // reference to $call function
                                        $self: methods,
                                        $parent: parent,
                                        $getStorage: getStorage
                                    }),
                                    typeHinting: content.typeHinting,
                                    method: content.method,
                                    type: content.type
                                };

                            }else {
                                // its a variable, check if static

                                if ( !checkType(content.type, "STATIC") ) {
                                    // not static, clone it

                                    $$$.$scope[ scope ][ item ] = {
                                        item: content.item.$clone(),
                                        method: content.method,
                                        type: content.type
                                    };

                                } else {

                                    // static, so use reference
                                    $$$.$scope[ scope ][ item ] = content;
                                }
                            }



                        }

                    }

                }


                cloneStructure( classStructure, $$$, getStorage);


                returnObj = {
                    $destruct: function(context) {



                        // destruct
                        var storage = getStorage("__destruct");
                        $OBJECTS.remove( returnObj.$id );



                        if (storage.method === true) {
                            if(checkType(storage.type, "PUBLIC")
                                ||
                                (checkType(storage.type, "PRIVATE") &&
                                    context !== undefined && context.$currentScope === className)
                                ||
                                (checkType(storage.type, "PROTECTED") &&
                                    context !== undefined && this.$scope[context.$currentScope] !== undefined)
                                )
                                {
                                storage.item();
                            } else  {
                                // still an issue here? Does it use correct context to see whether to throw error regarding destruct?

                                if (context !== undefined && context.$CLEANUP === true) {
                                    if (checkType(storage.type, "PROTECTED")) {
                                        $ERROR("Call to protected "+ className +"::__destruct() from context '" + ((context.$currentScope === undefined) ? "" : context.$currentScope) + "' during shutdown ignored", 2);
                                    } else if (checkType(storage.type, "PRIVATE")) {
                                        $ERROR("Call to private "+ className +"::__destruct() from context '" + ((context.$currentScope === undefined) ? "" : context.$currentScope) + "' during shutdown ignored", 2);
                                    }
                                } else {

                                    if (returnObj.$creationContext.$currentScope !== className) {
                                        if (checkType(storage.type, "PROTECTED")) {
                                            $ERROR("Call to protected "+ className +"::__destruct() from context '" + ((context === undefined || context.$currentScope === undefined) ? "" : context.$currentScope) + "'");
                                        } else if (checkType(storage.type, "PRIVATE")) {
                                            $ERROR("Call to private "+ className +"::__destruct() from context '" + ((context === undefined || context.$currentScope === undefined) ? "" : context.$currentScope) + "'");
                                        }
                                    }
                                }

                            }
                        }



                    },
                    $callable: $callable.bind(callBind),
                    $creationContext: context,
                    $scope: $$$.$scope, // leaking it outside for now, needed by var_dump etc.
                    $name: className,
                    $clone: function(context) {

                        var clone$$$ = {
                            $from: {},
                            $scope: {}
                        },
                        getStorage = getStorageFunc.bind( clone$$$ );
                        callBind = {

                            $scope: clone$$$.$scope,
                            $from: clone$$$.$from, // reference to $from data
                            $getStorage: getStorage
                        },
                        propBind = {
                            $scope: clone$$$.$scope,
                            $from: clone$$$.$from, // reference to $from data
                            $getStorage: getStorage
                        };

                        cloneStructure( $$$, clone$$$, getStorage);


                        var returnObj = {
                            $scope: clone$$$.$scope, // leaking it outside for now, needed by var_dump etc.
                            $call: $call.bind(callBind),
                            $prop: $prop.bind(propBind),
                            $name: className,
                            $currentScope: className
                        };



                        // destruct
                        var storage = getStorage("__clone");




                        if (storage.method === true) {
                            if(checkType(storage.type, "PUBLIC")
                                ||
                                (checkType(storage.type, "PRIVATE") &&
                                    context.$currentScope === className)
                                ||
                                (checkType(storage.type, "PROTECTED") &&
                                    clone$$$.$scope[context.$currentScope] !== undefined)
                                )
                                {
                                storage.item.call(returnObj);
                            } else  {
                                // still an issue here? Does it use correct context to see whether to throw error regarding destruct?
                                //  if (returnObj.$creationContext.$currentScope !== className) {
                                if (checkType(storage.type, "PROTECTED")) {
                                    $ERROR("Call to protected "+ className +"::__clone() from context '" + ((context.$currentScope === undefined) ? "" : context.$currentScope) + "'");
                                } else if (checkType(storage.type, "PRIVATE")) {
                                    $ERROR("Call to private "+ className +"::__clone() from context '" + ((context.$currentScope === undefined) ? "" : context.$currentScope) + "'");
                                }
                            // }
                            }
                        }



                        return new PHP.VM.Variable(returnObj);

                    },
                    $call: $call.bind(callBind),
                    $prop: $prop.bind(propBind)
                };


                returnObj.$id = $OBJECTS.add ( returnObj );





                // construct


                var searchParents = true,
                loopParent = className;

                while (searchParents) {
                    // PHP 5 style
                    storage = getStorage("__construct", loopParent);

                    if (storage.method === true) {
                        if(checkType(storage.type, "PUBLIC")
                            ||
                            (checkType(storage.type, "PRIVATE") &&
                                context.$currentScope === loopParent)
                            ||
                            (checkType(storage.type, "PROTECTED") &&
                                this.$scope[context.$currentScope] !== undefined)
                            )
                            {
                            searchParents = false;
                            /*
                        var argsArr = Array.prototype.slice.call(arguments, 1);
                        argsArr.unshift(context, "__construct");
                        returnObj.$call.apply(null, argsArr);*/
                       
                            $precallCheck( storage.typeHinting, "__construct", Array.prototype.slice.call(arguments) );
                        
                            storage.item.apply(null, Array.prototype.slice.call(arguments, 1));
                        
                        } else  {
                            if (checkType(storage.type, "PROTECTED")) {
                                $ERROR("Call to protected "+ loopParent +"::__construct() from invalid context");
                            } else if (checkType(storage.type, "PRIVATE")) {
                                $ERROR("Call to private "+ loopParent +"::__construct() from invalid context");
                            }
                        }
                    } else {
                        // PHP 4 style
                        storage = getStorage(loopParent, loopParent);
                        if (storage.method === true) {
                            if(checkType(storage.type, "PUBLIC")
                                ||
                                (checkType(storage.type, "PRIVATE") &&
                                    context.$currentScope === loopParent)
                                ||
                                (checkType(storage.type, "PROTECTED") &&
                                    this.$scope[context.$currentScope] !== undefined)
                                )
                                {
                                searchParents = false;
                           
                                $precallCheck( storage.typeHinting, loopParent, Array.prototype.slice.call(arguments) );
                            
                                storage.item.apply(null, Array.prototype.slice.call(arguments, 1));
                            /*
                            var argsArr = Array.prototype.slice.call(arguments, 1);
                            argsArr.unshift(context, loopParent);
                         
                            returnObj.$call.apply(null, argsArr);*/
                            } else  {
                                if (checkType(storage.type, "PROTECTED")) {
                                    $ERROR("Call to protected "+ loopParent +"::__construct() from invalid context");
                                } else if (checkType(storage.type, "PRIVATE")) {
                                    $ERROR("Call to private "+ loopParent +"::__construct() from invalid context");
                                }
                            }
                        }
                    }

                    loopParent = $INHERITANCE.getParent(loopParent);

                    if (loopParent === undefined) {
                        break;
                    }

                }

                return returnObj

            }

        };




        return methods;
    }

}