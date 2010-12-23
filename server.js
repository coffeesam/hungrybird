require.paths.unshift(__dirname + '/lib');
require.paths.unshift(__dirname);

var Server = function() {
  var fs = require('fs');

  try {
    var configJSON = fs.readFileSync(__dirname + "/config/app.json");
  } catch(e) {
    console.log("File config/app.json not found.  Try: `cp config/app.json.sample config/app.json`");
  }
  this.config =  JSON.parse(configJSON.toString());
};

Server.prototype = {

  run: function() {

    var http = require('http'),
        static = require('node-static'),
        io = require('socket.io'),
        mongo = require('mongodb'),
        Hungrybird = require('hungrybird').Hungrybird;

    var config = this.config;

    db = new mongo.Db(config.mongoDBName, new mongo.Server(config.mongoHost, config.mongoPort, {}), {});

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

        server.maxConnections = config.maxConnections;
        var nodes = require("multi-node").listen({
                port         : config.trackingPort,
                nodes        : config.workerPoolSize,
                masterListen : false
        }, server);

        if(nodes.isMaster) {
          console.log("Hungrybird server started.");
        }else {
          process.setuid(config.workerUser);
        }
      });
    });
  }
};

var server = new Server();
server.run();


