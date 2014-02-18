function dispatch(id, body){
    if(service = this.services[id]){
	//пробросить внутрь контекст и доступ до mq
	service[body.msg](body.data);
    }
}
function mq(capsule){
    this.peers = new Array();
    this.to_listen;
    /*method add urls_to_listen to history and starting accepting messages from them
     * 
     * @urls_to_listen -array of addresses to accept incoming messages
     */
    this.activate = function(urls_to_listen){
	//тут мы проверяем наличие транспортов, способных переварить адресы
	//если такие транспорты есть, то создаём их и подключаем себя к ним чтобы слушать
	var to_listen_1 = capsule.transport.direct.create(to_listen[1], capsule.transport.direct.features.dealer);
	//    tdr.on_msg(1,function(id, body){
	//		   dispatch(id, body);
	//	       });    
    }

    //stopping a sending and a receiving msgs, destroing all associated transports
    this.deactivate = function(){
	
    }

    this.nodes_add = function(urls){
	
    }

    this.on_msg = function(uuid, callback){
    }
    
    this.send = function(uuid, msg){
    }
}

