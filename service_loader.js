var path = require('path');

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
	var return_value = null;
	function next(){
	    return_value = Array.prototype.slice.call(arguments);
	}
	msg.unshift(next);
	if(msg_handlers.hasOwnProperty(name)){	    
	    msg_handlers[name].apply(null, msg);
	    if(msg_env){
		var seq = env.capsule.modules.sequence;
		//console.log(typeof(msg_env), msg_env, 'dd');
		seq.mq_send = mq.send;

		if(!msg_env.stack.first)
		    msg_env.stack.first = return_value;
		msg_env.stack.push(msg_env.stack.last = return_value);
		
		seq.sequence_continue(msg_env.args, msg_env.stack);
	    }
	} else
	    console.log('this service have no method: ', name);
    }

    this.react = function(msg_name, callback){
	msg_handlers[msg_name] = callback;
    }
    
    this.send = function(){
	var _arguments = Array.prototype.slice.call(arguments);
	var service_name = _arguments.shift();
	_arguments.unshift(null); //setting sequence and stack data to null
	mq.send(service_name, _arguments);
    }

    this.sequence = function(){
    }

}

exports.load = function(service, mq, env){
    var uuid = env.capsule.modules.uuid.generate_str();
    var context = new context_constructor(uuid);
    var senv = new service_env(uuid, context, mq, env); 
    require('./' + service + '.js')[path.basename(service)](context, senv.send, senv.react, senv.sequence);
    mq.on_msg(uuid, senv.dispatch);
    return uuid;
}