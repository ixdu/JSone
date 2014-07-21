/*
 * Initialize a dsa and main enter point to access to her own functionality(mq, service_load etc)
 *  
 */

var seq = exports.seq = require('../modules/sequence.js'),
sloader = require('service_loader.js'),
mq  = exports.mq = (require('mq.js')).create(),
uuid = require('../modules/uuid.js'),

cache = []; //cache of loaded services

exports.init = function(urls){
//    alert(mq.send);
    mq.activate({"transport" : "direct", "url": "blahe" },
		{"transport" : "direct", "url": "blahc" }
	       );
//    mqnode2.activate({"transport" : "direct", "url": "blaha" },
//		     {"transport" : "direct", "url": "blahh" }
//		    );
//    mqnode1.node_add({"transport" : "direct", "url": "blahh" });
//    mqnode2.node_add({"transport" : "direct", "url": "blahc" });
    seq.mq_send = mq.send;
};

exports.get = function(service_path){
    //saving service self in a ccache, but wrapper is created each time
    //здесь нужно предусмотреть возможность запуска удалённых сервисов
    var senv_and_id;
    if(typeof cache[service_path] != 'undefined')
	senv_and_id = cache[service_path];
    else
	senv_and_id = cache[service_path] = sloader.load(service_path, mq, true);

    var spec = senv_and_id[0].handlers.introspect(),
    object = { local_id : uuid.generate_str()};
    mq.on_msg(object.local_id, function(msg){
		  var env = msg.shift(),
		  name = msg.shift();
		  if(object.hasOwnProperty(name)){
		      msg.unshift(env.stack);
		      msg.unshift(env.next);
		      object[name].apply(null,msg);
		      //возможно нужно добавить дальнешую обработку sprout как service_loader dispatch
		      //или вообще синхронизировать этот код и service_loader dispatch
		  }
	      });
    for(key in spec){
	(function(key){
	     object[key] = function(){
		 var _arguments = Array.prototype.slice.call(arguments);
		 _arguments.unshift(key);
		 _arguments.unshift(senv_and_id[1]);
		 var sprout = seq.msg.apply(seq, _arguments); 
		 if(object.hasOwnProperty('on_' + key)){
		     sprout = sprout.sprout(seq.msg(object.local_id, 'on_' + key));
		 }
		 return sprout;
	     };
	 })(spec[key]);
    }
    object.id = senv_and_id[1];

    return object;
};

exports.release = function(service_id){
    //освобождение сервиса с учётом его нахождения в кеше или удалённости
};