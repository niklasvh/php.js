/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 20.7.2012 
* @website http://hertzen.com
 */



PHP.Parser.prototype.Scalar_LNumber_parse = function( a ) {
   
    return a;  
};

PHP.Parser.prototype.Scalar_DNumber_parse = function( a ) {
   
    return a;  
};

PHP.Parser.prototype.Scalar_String_parseDocString = function() {
    
    return '"' + arguments[ 1 ].replace(/([^"\\]*(?:\\.[^"\\]*)*)"/g, '$1\\"') + '"';
};


PHP.Parser.prototype.Node_Scalar_String = function( ) {
   
    return {
        type: "Node_Scalar_String",
        value: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };  

};

PHP.Parser.prototype.Scalar_String_create = function( ) {
    return {
        type: "Node_Scalar_String",
        value: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };  

};

PHP.Parser.prototype.Node_Scalar_LNumber = function() {
   
    return {
        type: "Node_Scalar_LNumber",
        value: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };  
  
};


PHP.Parser.prototype.Node_Scalar_DNumber = function() {
   
    return {
        type: "Node_Scalar_DNumber",
        value: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };  
  
};


PHP.Parser.prototype.Node_Scalar_Encapsed = function() {
   
    return {
        type: "Node_Scalar_Encapsed",
        parts: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };  
  
};

PHP.Parser.prototype.Node_Name = function() {
   
    return {
        type: "Node_Name",
        parts: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };  
  
};

PHP.Parser.prototype.Node_Name_FullyQualified = function() {
   
    return {
        type: "Node_Name_FullyQualified",
        parts: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };  
  
};

PHP.Parser.prototype.Node_Name_Relative = function() {
   
    return {
        type: "Node_Name_Relative",
        parts: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };  
  
};

PHP.Parser.prototype.Node_Param = function() {
   
    return {
        type: "Node_Param",
        name: arguments[ 0 ],
        def: arguments[ 1 ],
        Type: arguments[ 2 ],
        byRef: arguments[ 3 ],
        attributes: arguments[ 4 ]
    };  
  
};

PHP.Parser.prototype.Node_Arg = function() {
   
    return {
        type: "Node_Name",
        value: arguments[ 0 ],
        byRef: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };  
  
};

PHP.Parser.prototype.Node_Const = function() {
   
    return {
        type: "Node_Const",
        name: arguments[ 0 ],
        value: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };  
  
};
