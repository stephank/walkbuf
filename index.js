module.exports = WalkBuf;

function WalkBuf(buf, pos) {
  this.buf = buf;
  this.pos = (pos || 0);
};

WalkBuf.prototype = {

  // Rather than `(start, end)` or `(offset, length)` parameters, slice
  // methods take a length from the current position. This helper calculates
  // the end of the slice.
  _calcExtent: function(length) {
    if (length == null) {
      return this.buf.length;
    }
    else {
      return this.pos + length;
    }
  },


  // Methods to seek in the buffer.

  seek: function(pos) {
    this.pos = pos;
  },

  rewind: function() {
    this.pos = 0;
  },

  skip: function(count) {
    this.pos += count;
  },


  // Methods that operate on slice of data.

  write: function(string, length, encoding) {
    var written = this.buf.write(string, this.pos, length, encoding);
    this.pos += written;
    return written;
  },

  toString: function(encoding, length) {
    var start = this.pos;
    var end = this._calcExtent(length);
    this.pos = end;
    return this.buf.toString(encoding, start, end);
  },

  copy: function(targetBuffer, targetStart, length) {
    var start = this.pos;
    var end = this._calcExtent(length);
    this.pos = end;
    return this.buf.copy(targetBuffer, targetStart, start, end);
  },

  slice: function(length) {
    var start = this.pos;
    var end = this._calcExtent(length);
    this.pos = end;
    return this.buf.slice(start, end);
  },

  fill: function(value, length) {
    var start = this.pos;
    var end = this._calcExtent(length);
    this.pos = end;
    return this.buf.fill(value, start, end);
  },


  // Additional, non-Buffer methods.

  // Reverse copy, ie. copy from another buffer into this one.
  rcopy: function(sourceBuffer, start, end) {
    var written = sourceBuffer.copy(this.buf, this.pos, start, end);
    this.pos += written;
    return written;
  }

};


// Methods that read numeric data.

var readMethods = {
  readUInt8: 1,
  readUInt16LE: 2,
  readUInt16BE: 2,
  readUInt32LE: 4,
  readUInt32BE: 4,
  readInt8: 1,
  readInt16LE: 2,
  readInt16BE: 2,
  readInt32LE: 4,
  readInt32BE: 4,
  readFloatLE: 4,
  readFloatBE: 4,
  readDoubleLE: 8,
  readDoubleBE: 8,
};

Object.keys(readMethods).forEach(function(method) {
  var size = readMethods[method];
  WalkBuf.prototype[method] = function(noAssert) {
    var pos = this.pos;
    this.pos += size;
    return this.buf[method](pos, noAssert);
  };
});


// Methods that write numeric data.

var writeMethods = {
  writeUInt8: 1,
  writeUInt16LE: 2,
  writeUInt16BE: 2,
  writeUInt32LE: 4,
  writeUInt32BE: 4,
  writeInt8: 1,
  writeInt16LE: 2,
  writeInt16BE: 2,
  writeInt32LE: 4,
  writeInt32BE: 4,
  writeFloatLE: 4,
  writeFloatBE: 4,
  writeDoubleLE: 8,
  writeDoubleBE: 8
};

Object.keys(writeMethods).forEach(function(method) {
  var size = writeMethods[method];
  WalkBuf.prototype[method] = function(value, noAssert) {
    var pos = this.pos;
    this.pos += size;
    return this.buf[method](value, pos, noAssert);
  };
});
