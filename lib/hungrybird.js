var sys = require('sys'),
  fs = require('fs'),
  Buffer = require('buffer').Buffer,
  io = require('socket.io'),
	url = require('url');

try {
  var configJSON = fs.readFileSync(__dirname + "/../config/app.json");
} catch(e) {
  sys.log("File config/app.json not found.  Try: `cp config/app.json.sample config/app.json`");
}
var config = JSON.parse(configJSON.toString());

var Hungrybird = function(db, callback) {
  // var pixelData = fs.readFileSync(__dirname + "/../images/tracking.gif", 'binary');
  // this.pixel = new Buffer(42);
  // this.pixel.write(pixelData, 'binary', 0);
};

Hungrybird.prototype = {
  init: function(db, callback) {
    this.setupDb(db, function() {
      callback();
    });
  },

  setupDb: function(db, callback) {
    var self = this;
    db.createCollection('visits', function(err, collection) {
      db.collection('visits', function(err, collection) {
        self.collection = collection;
        callback();
      });
    });
  },

  serveRequest: function(req, res) {
    this.writePixel(res);
		url = require('url');
    var env = url.parse(req.url, true).query;
    env.timestamp = new Date();
    env.ip = req.connection.remoteAddress;

    this.collection.insertAll([env]);
  },

  writePixel: function(res) {
    res.writeHead(200, { 'Content-Type'       : 'application/json',
                         'Content-Disposition': 'inline',
                         'Pragma'             : 'no-cache',
                         'Connection'         : 'close',
                         'Cache-Control'      : 'private, no-cache, proxy-revalidate',
                         'Content-Length'     : '2' });
    res.end("{}");
  },

  handleError: function(req, res, e) {
    res.writeHead(500, {});
    res.write("Server error");
    res.end	();

    e.stack = e.stack.split('\n');
    e.url = req.url;
    sys.log(JSON.stringify(e, null, 2));
  }
};

exports.Hungrybird = Hungrybird;
