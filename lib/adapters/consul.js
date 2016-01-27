
// Load modules
var ConsulLib = require('consul');

// Declare internals

var internals = {};


internals.defaults = {
    host: '192.168.99.100',
    port: 8500
};


exports.initialize = function initialize(service, options, callback) {
    var adapter = new Consul();
    callback(null, adapter);
};

function Consul() {
    this.name = 'consul';
    this.data = internals.defaults;
    internals.connection = ConsulLib(internals.defaults);
}


Consul.prototype.getRemoteValue = function getRemoteValue(name, callback) {
    internals.connection.kv.get(name, function(err, data){
        if(err){
            return callback(err);
        }
        if(!data){
            return callback('key not found');
        }

        callback(null, data.Value);
    });
};

Consul.prototype.getData = function getData(service, options, callback) {

    internals.connection.kv.keys(service+'/', function(err, keys){
        if(err){
            return callback(err);
        }

        if(!keys){
            return callback('key not found');
        }

        internals.getAllKeys(keys, 0, [], callback);

    });
};


internals.getAllKeys = function getAllKeys(keys,n, data, callback){
    if(n===keys.length){
        return callback(null, data);
    }

    internals.connection.kv.get(keys[n], function(err, key){
        if(err){
            return callback(err);
        }
        n = n + 1;
        data.push({
            key:key.Key,
            value:key.Value
        });
        internals.getAllKeys(keys, n, data, callback);
    });
};