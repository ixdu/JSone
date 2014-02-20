//uuid of all dsa instance equal to
var dsa_uuid = '000000000000002';
function sender(uuid, service_name, message_name, body){
    if(uuid)
	mq.send(uuid, { "msg" : message_name, "body" : body});
    else
	mq.send(dsa_uuid, { "type" : 'msg', "service" : service_name, "msg" : message_name, "body" : body})
}

function starter(service_name){
    var service = require('services/' + service_name);
    if(!service)
	return null;
    mq.on(service.uuid, function(msg){
	      //тут обрабатываем входящие сообщения и направляем их на service.in.*	      
	  });
}

function dsa(mq, modules){
    var services = [];
    function service_find(name){
	return null;
    }
    //main dsa logic method. Used for message passing, service init and service shutdown
    //service is started if message going to service but its offline
    this.send = function(service_name, message_name){
	//FIX initialize message_name using arguments
	//тут фигня какая-то, искать то не надо, есть же uuid
	var service = service_find(service_name);
	if(service){
	    service = starter('services/' + service_name);
	} 
	//пытаемся подгрузить сервис, если не выходит, то посылаем сообщение другим dsa
	//совершенно правда не обязательно, что они будут принимать такие сообщения.
	//надо ещё учитывать client!
	sender(service, service_name, message_name, body);
    }
    
    //setting callback on imcoming message from particular
    //MAYBE not need. du to the presence in service structure 'in' objects with callbacks.
    this.on = function(service_name, message_name, callback){
    }

    //разные экземпляры одного сервиса имеют разные uuid, это надо учитывать
    //также нужно продумать на какие сообщения сам dsa отвечает
   // mq.on
}