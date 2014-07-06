/*
 * Initialize a dsa and main enter point to access to her own functionality(mq, service_load etc)
 * 
 */

var seq = require('../modules/sequence.js'),
sloader = require('service_loader.js'),
mq  = exports.mq = require('mq.js').create();

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
    //здесь должно быть запоминание сервиса в кеше и возможность запуска удалённых сервисов
   return sloader.load(service_path, mq);
};

exports.release = function(service_id){
    //освобождение сервиса с учётом его нахождения в кеше или удалённости
};