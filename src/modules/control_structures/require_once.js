PHP.Modules.prototype.require_once = function() {
    this.$include.apply(this, arguments);
};