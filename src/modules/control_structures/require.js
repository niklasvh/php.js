PHP.Modules.prototype.require = function() {
    this.$include.apply(this, arguments);
};