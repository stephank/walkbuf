## WalkBuf

Walk a buffer, as you read or write to it. Much like traditional file I/O in
C, where a handle keeps track of the current position.

    var WalkBuf = require('walkbuf');

    var buf = new Buffer(16);
    var walker = new WalkBuf(buf);

    walker.writeUInt32BE(0xcafebabe);
    walker.write('Hello!');
    walker.skip(4);
    walker.writeUInt16BE(9000);

    walker.rewind();

    walker.readUInt32BE();        // => 3405691582
    walker.toString('utf-8', 6);  // => 'Hello!'
    walker.skip(4);
    walker.readUInt16BE();        // => 9000

MIT licensed.
