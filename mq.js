exports.create = function(capsule){
    var transport = capsule.modules.transport;
    var known_nodes = [];
    var callbacks = {};
    var connected = [];
    var listened = [];
    var addrs_to_listen = [];

    var self_uuid = capsule.modules.uuid.generate_str();
    
    function _node_add(context, type){
	var node = transport[context.transport].create(context, transport.features.client, capsule);
	node.on_msg(function(msg){
			_dispatch(transport, context, msg);
		    });
	node.connect();
	
	known_nodes.push({ "context" : context,
			   "transport" : node}); 	
	
	if(type)
	    node.send({ "type" : type,
			"id" : self_uuid,
			"address" : addrs_to_listen[0]});	
    }
    
    function _send(uuid, msg, uuid_from){
	if(uuid_from == self_uuid)
	    return;
	if(!uuid_from)
	    uuid_from = self_uuid;

	var transport = _find_closer(msg.id);
	if(transport)
	    transport.send({
			       "type" : 'msg',
			       "id" : uuid_from,
			       "body" : msg
			   })
	else {
	    for(id in known_nodes){
		known_nodes[id].transport.send({
						   "type" : 'msg',
						   "id" : uuid_from,
						   "body" : msg
					       })
	    }
	}
    }
    function _dispatch(transport_from, context_from, msg){
	switch(msg.type){
	    case 'ping' :
	    _node_add(context_from, null);
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
		_send(msg.id, msg.body, msg.id_from);
	    break;
	}
    }
    
    function _find_closer(uuid){
	return null;
    }

    /*method add urls_to_listen to history and starting accepting messages from them
     * 
     * @urls_to_listen -array of addresses to accept incoming messages
     */
    return {
	"activate" : function(){
	    addrs_to_listen = arguments;
	    for(ind in arguments){
		var context = arguments[ind];
		var _listened = transport[context.transport].create(context, transport.features.server, capsule);
		_listened.on_connect(function(socket){
					 connected.push(socket);
					 socket.on_msg(function(msg){
							   _dispatch(socket, context, msg);
						       })
				     });

		listened.push(_listened);
	    }	    
	},

	"deactivate" : function(){
	    connected = [];
	    for(ind in listened)
		listened[ind].destroy();
	    listened = [];
	},

	"node_add" : function(context){
	    _node_add(context, 'ping');
	},

	"on_msg" : function(uuid, callback){
	    if(callback)
		callbacks[uuid] = callback;
	    else
		delete callbacks[uuid];
	},
    
	"send" : function(uuid, msg){
	    _send(uuid, msg, null);
	}	
    }
}

