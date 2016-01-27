var ServiceCloudConfig = require('../lib/index');


var config = new ServiceCloudConfig({
    service:'my-service',
    adapter:'consul'
});


config.start({}, function(err, data){

    config.getRemoteValue('my-service/config1',  function(err, data){
        console.log(err, data);
    });

    config.getData(function(err, data){
        console.log(err, data);
    });

});




setTimeout(null, 5000);