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
> **Note:**

> - The consul adapter uses kv to store configurations

**service-cloud-config Options**
----------
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



Usage
-------------