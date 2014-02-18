function mq(capsule){
    var known_nodes = {};
    var callbacks = {};
    var listened = [];

    this.uuid = modules.uuid.generate_str();

    function _send(uuid, msg){
	var transport = find_closer(msg.id);
	//тут надо задуматься о гарантиях доставки и всяких транспортных неурядицах
	if(transport)
	    transport.send({
			       "type" : 'msg',
			       "id" : uuid,
			       "body" : msg
			   })
	else {
	    for(id in known_nodes){
		known_nodes[id].transport.send({
						   "type" : 'msg',
						   "id" : uuid,
						   "body" : msg
					       })
	    }
	}
    }
    function dispatch(transport_from, msg){
	switch(msg.type){
	    case 'ping' :
	    break;
	    
	    case 'left' :
	    break;
	    
	    case 'handler' : 
	    //передаёт информацию другим узлам о том, что здесь установлен обработчик такого-то uuid
	    //Вопрос маршрутизации вообще надо обдумать, но удерживать его _простым_
	    break;

	    case 'msg' :
	    if(callbacks.hasOwnProperty(msg.id))
		callbacks[msg.id](msg.body);
	    else 
		_send(msg.id, msg.body);
	    break;
	}
    }
    
    function find_closer(uuid){
	return null;
    }

    /*method add urls_to_listen to history and starting accepting messages from them
     * 
     * @urls_to_listen -array of addresses to accept incoming messages
     */
    this.activate = function(urls_to_listen){
	//тут мы проверяем наличие транспортов, способных переварить адресы
	//если такие транспорты есть, то создаём их и подключаем себя к ним чтобы слушать
	var to_listen_1 = capsule.transport.direct.create(to_listen[1], capsule.transport.direct.features.client);
    }

    //stopping a sending and a receiving msgs, destroing all associated transports
    this.deactivate = function(){
	
    }

    this.nodes_add = function(urls){
	//сравниваем с теми, что уже занесены для новых:
	//находим подходящие транспорты для urls, создаём их

	for(node in transports){
	    transports[node].on_msg(function(msg){
					dispatch(transports[node], msg);
				    })
	    //посылаем всем информацию о себе
	    transports[node].send({
				      "type" : "ping",
				      "id" : this.uuid,
				      "addr" : to_listen[0]
				  })	    
	}
	known_nodes = known_nodes.join(new_nodes); 	
    }

    this.on_msg = function(uuid, callback){
	if(callback)
	    callbacks[uuid] = callback;
	else
	    delete callbacks[uuid];
    }
    
    this.send = function(uuid, msg){
	_send(uuid, msg);
    }
}

