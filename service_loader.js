/*
 * lowlevel service loader from files
 */

var sequence = require('../modules/sequence.js');
//uuid of all dsa instance equal to
var dsa_uuid = '000000000000002';

function context_constructor(service){
    var values = {};

    this.service = service;

    this.set = function(key, value){
	values[key] = value;
    };

    this.get = function(key){
	return values[key];
    };
}

function service_env(uuid, context, mq, env){
    var msg_handlers = {
	"set" : function(sprout, stack, key, value){
//	    console.log(value);
	    context.set(key, value);
	},
	"get" : function(sprout, stack, key){
	    stack[key] = context.get(key);
	}
    };

    this.dispatch = function(msg){
	var msg_env = msg.shift();
	var name = msg.shift();
	if(msg_handlers.hasOwnProperty(name)){
	    if(msg_env != null){
		msg.unshift(msg_env.stack);
		msg.unshift(msg_env.next);
		if(!msg_handlers[name].apply(null, msg)){
		    var seq = sequence;
//		    console.log(typeof(msg_env), msg_env, 'dd');
		    seq.mq_send = mq.send;
		    //		console.log(JSON.stringify(msg_env.next));
		    seq.run(msg_env.next, msg_env.stack);		    
		}
	    } else {
		msg.unshift(null);
		msg_handlers[name].apply(null, msg);		    
	    }
	} else
	    console.log('this service have no such method: ', name);
    };

    this.on = function(msg_name, callback){
	msg_handlers[msg_name] = callback;
    };
    
    this.send = function(){
	var _arguments = Array.prototype.slice.call(arguments);
	var service_name = _arguments.shift();
	_arguments.unshift(null); //setting sprout and stack data to null
	mq.send(service_name, _arguments);
    };

    var seq = sequence;
    seq.mq_send = mq.send;

    this.sprout = seq;
}

exports.load = function(path, mq){
    var uuid = require('../modules/uuid.js').generate_str();
    var context = new context_constructor(uuid);
    var senv = new service_env(uuid, context, mq); 
    var service = require('../' + path + '.js');
    service.init({ context : context, 
		   mq : mq,
		   send : senv.send, 
		   on : senv.on,
		   sprout : senv.sprout});
    mq.on_msg(uuid, senv.dispatch);
    return uuid;
};