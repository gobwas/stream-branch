var Branch = require("./lib/branch"),
    debug = require("util").debuglog('stream-branch');

module.exports = function(options, streams) {
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