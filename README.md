
About service-cloud-config
===================

**service-cloud-config** is a nodejs module that provides client-side support for externalized configuration in a distributed system.

---------------

Adpters
-------------
currently only supports:
 **Consul** 
 
![enter image description here](http://tfitch.com/automation-tools-bootcamp/images/consul-mini-logo.png)

Installation
-------------

    $ npm install service-cloud-config


Overview
-------------
service-cloud-configr used the service name to discovery the settings


**service-cloud-config Options**
----------

 - **service** - Module name. Default **null**
 - **adapter** - Used adpter. Default **null**
 - **store** - save service config local. Default **true**
 - **mergeWithConfigEnv** - If this option is enabled then the module settings will inherit the module *envServiceName*. Default **true**
 - **envServiceName** - The parent module name: Default **environment**


Inheritance
-----------
If **mergeWithConfigEnv = true** then

example:

    environment config = {
		database:{
			ip:"127.0.0.1",
			port:8091
		},
		elasticsearch:{
			ip:"127.0.0.1",
			port:9200
		}
	}

	my-module config = {
		elasticsearch:{
			ip:"192.168.99.100",
			port:9202
		},
		amqp:{
			host:"127.0.0.1"
		}
	}

	result config = {
		database:{
			ip:"127.0.0.1",
			port:8091
		},
		elasticsearch:{
			ip:"192.168.99.100",
			port:9202
		},
		amqp:{
			host:"127.0.0.1"
		}
	}

API
-------------

 - **start(callback)** - start adpater connection
 - **getData(options, callback)** - get all configurations remotely
 -  **get(key)** - get config value locally. Only works if **store = true**
 - **getRemoteValue(key, callback)** - get single config key remotely


**Consul**
------
> **Note:**

> - The consul adapter uses kv to store configurations

    adapter:{
        name:'consul',
        connection:{
            host: '192.168.99.100',
            port: 8500
        }
    },

Usage
-------------

**Consul kv**

my-service/database/ip

```javascript
    var ServiceCloudConfig = require('service-cloud-config');
    
    
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
        });
    });

```

 - **get configurations (locally)**
		
	 - take paths in documents which can include nested paths specified by '.'s and can evaluate the path to a value


 ```javascript
    config.get('database.ip');
  ```