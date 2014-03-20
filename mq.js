exports.create = function(capsule){
    var transport = capsule.modules.transport;
    var known_nodes = [];
    var callbacks = {};
    var sockets = [];
    var listened = [];
    var addrs_to_listen = [];

    var self_uuid = capsule.modules.uuid.generate_str();
    
    function _node_add(context, type){
	var socket = transport[context.transport].create(context, transport.features.client, capsule);
	socket.on_msg(function(msg){
			_dispatch(transport, context, msg);
		    });
	socket.connect();
	sockets.push(socket);	

	known_nodes.push({ "context" : context,
			   "socket" : socket}); 	
	
	if(type)
	    socket.send({ "type" : type,
			"id" : self_uuid,
			"depth" : 1,
			"address" : addrs_to_listen[0]
		      });	
    }
    
    function _send(id, body, uuid_from, depth){
	//trying calling locally
	if(callbacks.hasOwnProperty(id)){
	    callbacks[id](body);
	    return;	    
	}

	if(uuid_from == self_uuid)
	    return;
	if(!uuid_from)
	    uuid_from = self_uuid;

	var msg = {
	    "type" : 'msg',
	    "id" : id,
	    "depth" : ++depth,
	    "body" : body
	};

	var transport = _find_closer(msg.id);
	if(transport)
	    transport.send(msg)
	else {
	    for(ind in sockets){
		sockets[ind].send(msg);
	    }
	}
    }
    function _dispatch(transport_from, context_from, msg){
	switch(msg.type){
	    case 'ping' :
///	    _node_add(context_from, null);
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
		if(msg.depth < 3)
		    _send(msg.id, msg.body, msg.id_from, msg.depth);
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
					 sockets.push(socket);
					 //на отключение и ошибки надо поставить обработчик, чтобы убирать за собой
					 //					 socket.on_disconected()
					 socket.on_msg(function(msg){
							   _dispatch(socket, context, msg);
						       })
				     });

		listened.push(_listened);
	    }	    
	},

	"deactivate" : function(){
	    sockets = [];
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
	    _send(uuid, msg, null, 1);
	}	
    }
}

