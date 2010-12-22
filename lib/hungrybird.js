var sys = require('sys'),
  fs = require('fs'),
  Buffer = require('buffer').Buffer,
  io = require('socket.io'),
  arrays = require('deps/arrays'),
  querystring = require('querystring');

try {
  var configJSON = fs.readFileSync(__dirname + "/../config/app.json");
} catch(e) {
  sys.log("File config/app.json not found.  Try: `cp config/app.json.sample config/app.json`");
}
var config = JSON.parse(configJSON.toString());

var Hungrybird = function(db, callback) {
  var pixelData = fs.readFileSync(__dirname + "/../images/tracking.gif", 'binary');
  this.pixel = new Buffer(2);
  this.pixel.write("HB", 'binary', 0);
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
    var env = this.splitQuery(req.url.split('?')[1]);
    env.timestamp = new Date();
    env.ip = req.connection.remoteAddress;

    this.collection.insertAll([env]);
  },

  splitQuery: function(query) {
    var queryString = {};
    (query || "").replace(
      new RegExp("([^?=&]+)(=([^&]*))?", "g"),
      function($0, $1, $2, $3) { queryString[$1] = querystring.unescape($3.replace(/\+/g, ' ')); }
    );

    return queryString;
  },

  writePixel: function(res) {
    res.writeHead(200, { 'Content-Type'       : 'image/gif',
                         'Content-Disposition': 'inline',
                         'Pragma'             : 'no-cache',
                         'Cache-Control'      : 'private, no-cache, proxy-revalidate',
                         'Content-Length'     : '42' });
    res.end(this.pixel);
  },

  handleError: function(req, res, e) {
    res.writeHead(500, {});
    res.write("Server error");
    res.close();

    e.stack = e.stack.split('\n');
    e.url = req.url;
    sys.log(JSON.stringify(e, null, 2));
  }
};

exports.Hungrybird = Hungrybird;
