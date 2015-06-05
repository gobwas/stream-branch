var Proxy  = require("../proxy"),
    WritableProxy;

/**
 * @class WritableProxy
 * @extends Proxy
 */
WritableProxy = Proxy.extend(
    /**
     * @lends WritableProxy.prototype
     */
    {
        constructor: function() {
            Proxy.prototype.constructor.apply(this, arguments);
            this.readable = false;
            this.writable = true;
        }
    }
);

module.exports = WritableProxy;