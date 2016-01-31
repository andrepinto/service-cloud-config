
// Load modules
var ConsulLib = require('consul');
var _ = require('lodash');
var path = require('doc-path');
// Declare internals

var internals = {};


internals.defaults = {
    connection:{
        host: '127.0.0.1',
        port: 8500
    }
};


exports.initialize = function initialize(service, options, callback) {
    var adapter = new Consul(options);
    callback(null, adapter);
};

function Consul(options) {
    this.name = 'consul';
    _.extend(internals.defaults, options);
    internals.connection = ConsulLib(internals.defaults.connection);
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

        internals.getAllKeys(keys, 0, {}, service, callback);

    });
};


internals.getAllKeys = function getAllKeys(keys,n, data, service, callback){
    if(n===keys.length){
        return callback(null, data);
    }

    internals.connection.kv.get(keys[n], function(err, key){
        if(err){
            return callback(err);
        }
        n = n + 1;

        var x = key.Key.replace(service+'/','');
        x = x.split("/").join(".");


        path.setPath(data, x, key.Value);


        internals.getAllKeys(keys, n, data, service, callback);
    });
};