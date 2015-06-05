var Proxy  = require("../proxy"),
    ReadableProxy;

/**
 * @class ReadableProxy
 * @extends Proxy
 */
ReadableProxy = Proxy.extend(
    /**
     * @lends ReadableProxy.prototype
     */
    {
        constructor: function() {
            Proxy.prototype.constructor.apply(this, arguments);
            this.readable = true;
            this.writable = false;
        }
    }
);

module.exports = ReadableProxy;