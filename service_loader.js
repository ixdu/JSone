//uuid of all dsa instance equal to
var dsa_uuid = '000000000000002';

function context_constructor(service){
    var values = {};

    this.service = service;

    this.set = function(key, value){
	values[key] = value;
    }

    this.get = function(key){
	return values[key];
    }
}

function service_env(uuid, context, mq, env){
    var msg_handlers = {
	"set" : function(next, key, value){
//	    console.log(value);
	    context.set(key, value);
	},
	"get" : function(next, key){
	    next(context.get(key));
	}
    }

    this.dispatch = function(msg){
	var msg_env = msg.shift();
	var name = msg.shift();
	if(msg_handlers.hasOwnProperty(name)){	    
	    if(msg_env != null){
		msg.unshift(msg_env.stack);
		var value_to_push = msg_handlers[name].apply(null, msg);
		if(msg_env.name)
		    msg_env.stack[msg_env.name] = value_to_push;
		else msg_env.stack.push(value_to_push);

		var seq = env.capsule.modules.sequence;
		//console.log(typeof(msg_env), msg_env, 'dd');
		seq.mq_send = mq.send;
//		console.log(JSON.stringify(msg_env.next));
		seq.run(msg_env.next, msg_env.stack);
	    } else
		msg_handlers[name].apply(null, msg);
	} else
	    console.log('this service have no such method: ', name);
    }

    this.react = function(msg_name, callback){
	msg_handlers[msg_name] = callback;
    }
    
    this.send = function(){
	var _arguments = Array.prototype.slice.call(arguments);
	var service_name = _arguments.shift();
	_arguments.unshift(null); //setting sprout and stack data to null
	mq.send(service_name, _arguments);
    }

    this.sprout = function(sprout, stack){
	var seq = env.capsule.modules.sequence;
	seq.mq_send = mq.send;	
	seq.run(sprout, stack);
    }

}

exports.load = function(path, mq, env){
    var uuid = env.capsule.modules.uuid.generate_str();
    var context = new context_constructor(uuid);
    var senv = new service_env(uuid, context, mq, env); 
    var service = require('../' + path + '.js');
    service.init(env, context, senv.send, senv.react, senv.sprout);
    mq.on_msg(uuid, senv.dispatch);
    return uuid;
}