var ServiceCloudConfig = require('../lib/index');


var config = new ServiceCloudConfig({
    service:'my-service',
    adapter:{
        name:'consul',
        connection:{
            host: '192.168.99.100',
            port: 8500
        }
    },
    mergeWithConfigEnv:true
});


config.start( function(err, data){

    config.getData(function(err, data){
       console.log(data);
        console.log(config.get('database.ip'));
    });

    config.getRemoteValue('my-service/database/ip',  function(err, data){
        console.log(err, data);
    });

});

