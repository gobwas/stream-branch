var Duplex = require("stream").Duplex,
    Stream = require("stream").Stream,
    Readable = require("stream").Readable,
    Writable = require("stream").Writable,
    Transform = require("stream").Transform,
    ProxyWritable = require("./proxy/writable"),
    inherits = require("inherits-js"),
    debug = require("util").debuglog('stream-branch'),
    async = require("async"),
    assert = require("assert"),
    Branch;

/**
 * @class Branch
 * @extends Duplex
 */
Branch = inherits( Duplex,
    /**
     * @lends Branch.prototype
     */
    {
        constructor: function(options) {
            Duplex.prototype.constructor.call(this, options);

            this.streams = [];

            this.countReadable = 0;
            this.countWritable = 0;

            this.actualReadable = 0;
            this.actualWritable = 0;
        },

        addStream: function(stream) {
            var self = this,
                isReadable, isWritable,
                writable, readable;

            assert(stream instanceof Stream, "Stream is expected");

            isReadable = stream instanceof Readable;
            isWritable = stream instanceof Writable;

            if (!isReadable && !isWritable) {
                writable = new ProxyWritable({
                    readableObjectMode: this._readableState.objectMode,
                    writableObjectMode: this._writableState.objectMode
                });

                writable.pipe(stream);
                readable = (new Readable({ objectMode: this._readableState.objectMode })).wrap(stream);

                this.addStream(writable);
                this.addStream(readable);

                return;
            }

            if (isReadable) {
                this.countReadable++;
                this.actualReadable++;

                if (stream._readableState.objectMode !== this._readableState.objectMode) {
                    throw new TypeError("Adding stream with different readable objectMode");
                }

                stream.on("readable", function() {
                    //debug('readable');
                    self.emit("readable");
                    self._read();
                });

                stream.on('end', function() {
                    //debug('end');
                    if ((--self.actualReadable) == 0) {
                        self.push(null);
                    }
                });
            }

            if (isWritable) {
                this.countWritable++;
                this.actualWritable++;

                if (stream._writableState.objectMode !== this._writableState.objectMode) {
                    throw new TypeError("Adding stream with different readable objectMode");
                }
            }

            stream.on("error", function(err) {
                self.emit("error", err);
            });

            this.streams.push(stream);
        },

        _write: function(chunk, encoding, callback) {
            //debug('_write', chunk);
            async.each(
                this.streams,
                function(stream, next) {

                    if (!stream.writable) {
                        //debug('stream not writable');
                        return next();
                    }

                    stream.write(chunk.clone(), encoding, next);
                    //debug('wrote', chunk);
                },
                callback
            );
        },

        _read: function(size) {
            var chunk, i, len, stream;

            len = this.streams.length;

            for (i = 0; i < len; i++) {
                stream = this.streams[i];

                if (!stream.readable) {
                    //debug('stream not readable');
                    continue;
                }

                if ((chunk = stream.read(size)) !== null) {
                    //debug('read', chunk);
                    if (!this.push(chunk)) {
                        break;
                    }
                }
            }
        },

        end: function(chunk, encoding, callback) {
            var self = this;

            async.each(
                this.streams,
                function(stream, next) {

                    if (!stream.writable) {
                        return next();
                    }

                    stream.end(chunk, encoding, next);
                },
                function(err) {
                    if (err) {
                        return callback(err);
                    }

                    Duplex.prototype.end.call(self, chunk, encoding, callback);

                    if (self.actualReadable == 0) {
                        self.emit('end');
                    }
                }
            );
        }
    },
    /**
     * @lends Branch
     */
    {
        extend: function(proto, statics) {
            return inherits(this, proto, statics);
        }
    }
);

module.exports = Branch;