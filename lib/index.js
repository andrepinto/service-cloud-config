// Load modules

var path = require('path');
var events = require('events');
var fs = require('fs');
var existsSync = fs.existsSync || path.existsSync;
var _ = require('lodash');
var path = require('doc-path');
// Declare internals

var internals = {
    options:{
        store: true,
        envServiceName: 'environment',
        mergeWithConfigEnv:true
    },
    config:{}
};


exports = module.exports = internals.ServiceConfig = function (options) {

    var adapter;
    var serviceConfig = this;

    _.extend(internals.options, options);

    if (!options.service) {
        throw new Error('Options.service is required');
    }

    if (!options.adapter) {
        throw new Error('Options.adapter is required');
    }

    serviceConfig.name = internals.options.adapter.name;
    serviceConfig.service = internals.options.service;

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

internals.ServiceConfig.prototype.start = function start( callback){
    var self = this;
    this.adapter.initialize(this.service, internals.options.adapter, function startAdapter(err, data){
        if(err){
            return callback(err);
        }

        self.adapter=data;

        callback(null, self);

    });
};

internals.ServiceConfig.prototype.get = function get(key){
    return path.evaluatePath(internals.config, key);
};

internals.ServiceConfig.prototype.getConfig = function getConfig(){
    return internals.config;
};

internals.ServiceConfig.prototype.getData = function getData(options, callback){
    var self = this;
    if(typeof options === 'function'){
        callback = options;
        options = internals.options;
    }

    if(options.mergeWithConfigEnv){
        self.adapter.getData(this.service, options, function resultGetData(err, data) {
            if(err){
                return callback(err);
            }
            var serviceData = data;

            self.adapter.getData(options.envServiceName, options, function resultGetData(err, data) {

                if(err){
                    return callback(err);
                }

                serviceData = _.defaultsDeep(JSON.parse(serviceData.data), JSON.parse(data.data));

                if(internals.options.store){
                    internals.config = serviceData
                }

                return callback(null, serviceData);
            });
        });

    }else{
        this.adapter.getData(this.service, options, function resultGetData(err, data) {
            if(err){
                return callback(err);
            }

            if(internals.options.store){
                internals.config = data;
            }

            return callback(null, data);
        });
    }



};

internals.ServiceConfig.prototype.getRemoteValue = function getRemoteValue(key, callback){
    this.adapter.getRemoteValue(key, callback);
};
