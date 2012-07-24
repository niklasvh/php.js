<?php

class __Globals implements ArrayAccess {

    public function offsetExists($offset) {
        global ${$offset};

        return isset(${$offset});
    }

    public function offsetGet($offset) {
        global ${$offset};

        return ${$offset};
    }

    public function offsetSet($offset, $value) {
        global ${$offset};

        ${$offset} = $value;
    }

    public function offsetUnset($offset) {
        global ${$offset};

        unset(${$offset});
    }

}

?>