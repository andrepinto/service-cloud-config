// Load modules

var path = require('path');
var events = require('events');
var fs = require('fs');
var existsSync = fs.existsSync || path.existsSync;

// Declare internals

var internals = {
    data:{
        memory: true
    },
    config:{}
};


exports = module.exports = internals.ServiceConfig = function (options) {

    var adapter;
    var serviceConfig = this;

    if (!options.service) {
        throw new Error('Options.service is required');
    }

    if (!options.adapter) {
        throw new Error('Options.adapter is required');
    }

    serviceConfig.name = options.adapter;
    serviceConfig.service = options.service;

    if (typeof serviceConfig.name === 'object') {
        serviceConfig.adapter = serviceConfig.name;
    } else if (serviceConfig.name.match(/^\//)) {
        serviceConfig.adapter = require(_name);
    } else if (existsSync(__dirname + '/adapters/' + serviceConfig.name + '.js')) {
        serviceConfig.adapter = require('./adapters/' + serviceConfig.name);
    } else {
        throw new Error('Adapter ' + serviceConfig.name + ' is not defined');
    }

    return serviceConfig;

};

internals.ServiceConfig.prototype.start = function start(options, callback){
    var self = this;
    this.adapter.initialize(this.service, options, function startAdapter(err, data){
        if(err){
            return callback(err);
        }

        self.adapter=data;

        callback(null, self);

    });
};

internals.ServiceConfig.prototype.info = function info(){
    return this;
};

internals.ServiceConfig.prototype.getData = function getData(options, callback){
    if(typeof options === 'function'){
        callback = options;
        options = internals.data;
    }

    this.adapter.getData(this.service, options, function resultGetData(err, data) {
        if(err){
            return callback(err);
        }

        if(internals.data.memory){
            internals.config = data;
        }

        return callback(null, data);
    });

};

internals.ServiceConfig.prototype.getRemoteValue = function getRemoteValue(key, callback){
    this.adapter.getRemoteValue(key, callback);
};



