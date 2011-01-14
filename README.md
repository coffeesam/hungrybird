HUNGRY BIRD (Based on Hummingbird)
==================================

Site tracking collector module (no data mining)



Description
---------------

Hungrybird is a web site tracker server inspired by Hummingbird and serves as a "data collector" component of a much larger analytics server.
Hungrybird scales massively by leveraging operating system's multi-core support. Multi-threaded support coming soon!


Requirements
-------------------

 * node.js v0.3.2pre
 * npm v0.2.14-6
 * mongodb
 * multi-node (included in source, will use npm to manage as a package later)


Installation
--------------

    git clone git://github.com/coffeesam/hungrybird.git
    cd hungrybird

    # Update submodules
    git submodule update --init --recursive
    
    # Use npm to install the dependencies
    npm link .

    # Copy the default configuration file
    cp config/app.json.sample config/app.json


Running Hungrybird
------------------------------

To start the analytics server, run the following:

    mongod &   (or start mongo some other way)
    sudo node server.js


Architecture Overview
---------------------

Hungrybird is a web site tracker server and serves as a "data collector" component of a
much larger analytics server. The main feature of Hungrybird is scalability and live feed.


Upcoming
--------------------
The Hungrybird.WebSocket will provide a means to send live data to any "dashboard" component of
an analytics server. Hungrybird spawns a separate process to manage live feeds.


Specs
--------

    ( to include jasmine specs )


Contributors
------------

 * Sam Hon (coffeesam) <coffeedaemon@gmail.com>



