exports.mq function(capsule,to_listen){
    this.peers = new Array();
    this.to_listen = to_listen;
    function dispatch(id, body){
	if(service = this.services[id]){
	    //пробросить внутрь контекст и доступ до mq
	    service[body.msg](body.data);
	}
    }
    //тут мы проверяем наличие транспортов, способных переварить адресы
    //если такие транспорты есть, то создаём их и подключаем себя к ним чтобы слушать
    var to_listen_1 = capsule.transport.direct.create(to_listen[1], capsule.transport.direct.features.dealer);
//    tdr.on_msg(1,function(id, body){
//		   dispatch(id, body);
//	       });    

    this.listen = function(urls){
	
    }

    this.unlisten = function(urls){
	
    }

    this.peer_add = function(urls){
	this.peers.join(this.peers,urls);
	console.log(this.peers);
    }
    
    this.peer_remove = function(urls){
    }

    this.service_register = function(service_obj){
	//проверяем service_obj на верность
	this.services[service_obj.uuid] = service_obj;
	service_obj.mq = this;
    }
    
    this.service_unregister = function(uuid){
    }
}

