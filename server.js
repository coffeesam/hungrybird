require.paths.unshift(__dirname + '/lib');
require.paths.unshift(__dirname);


(function main() {

  var http = require('http'),
      fs = require('fs'),
      static = require('node-static'),
      io = require('socket.io'),
      mongo = require('mongodb'),
      Hungrybird = require('hungrybird').Hungrybird;

  try {
    var configJSON = fs.readFileSync(__dirname + "/config/app.json");
  } catch(e) {
    console.log("File config/app.json not found.  Try: `cp config/app.json.sample config/app.json`");
  }
  var config = JSON.parse(configJSON.toString());

  db = new mongo.Db('hummingbird', new mongo.Server(config.mongo_host, config.mongo_port, {}), {});

  db.addListener("error", function(error) {
    console.log("Error connecting to mongo -- perhaps it isn't running?");
  });

  db.open(function(p_db) {
    var hungrybird = new Hungrybird();
    hungrybird.init(db, function() {
      var server = http.createServer(function(req, res) {
        try {
          hungrybird.serveRequest(req, res);
        } catch(e) {
          hungrybird.handleError(req, res, e);
        }
      });
      server.maxConnections = 3000;
      server.once('connection', function (stream) {
        process.setuid(config.node_worker_id);
      });
      
      var nodes = require("multi-node").listen({
              port         : config.tracking_port, 
              nodes        : config.node_workers,
              masterListen : false
          }, server);
    });

  });

})();


