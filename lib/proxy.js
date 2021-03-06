var inherits = require("inherits-js"),
    Transform = require("stream").Transform,
    Proxy;

/**
 * @class Proxy
 * @extends Transform
 */
Proxy = inherits( Transform,
    /**
     * @lends Proxy.prototype
     */
    {
        constructor: function(options) {
            Transform.prototype.constructor.call(this, options);
        },

        _transform: function(chunk, encoding, callback) {
            callback(null, chunk);
        }
    },
    /**
     * @lends Proxy
     */
    {
        extend: function(proto, statics) {
            return inherits(this, proto, statics);
        }
    }
);

module.exports = Proxy;