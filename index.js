var Branch = require("./lib/branch"),
    debug = util.debuglog('stream-branch');

module.exports = function(streams, options) {
    var branch;

    if (Array.isArray(options)) {
        streams = options;
        options = {};
    }

    branch = new Branch(options);

    streams.forEach(function(stream) {
        branch.addStream(stream);
    });

    return branch;
};