  /*
   shared objects for client and server implementations of dsa
   Copyright (C) 2011  Nikita Zaharov aka ix(email ix@2du.ru)
   
   This program is free software: you can redistribute it and/or modify
   it under the terms of the GNU Affero General Public License as
   published by the Free Software Foundation, either version 3 of the
   License, or (at your option) any later version.
   
   This program is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU Affero General Public License for more details.
   
   You should have received a copy of the GNU Affero General Public License
   along with this program.  If not, see <http://www.gnu.org/licenses/>.'
*/			       

var validator = require('../json-schema');

var fs = require('fs');
var url = require('url');
var util = require('util');


function dsa_addrs(addr_array){
    var _addrs = new Array;
    for (addr in addr_array){
//	console.log(addr_array[addr]);
	var _url = url.parse(addr_array[addr]);
	if (_url) _addrs.push(_url);
    }

    return _addrs;
}

function marshaller_cli(){
    this.signal_cbs = new Array;
    this.reply_cbs = new Array;

    this.marshall = function(message){
	
    }

    this.add_callback = function(type, msg, callback){
	switch (type){
	    case 'signal' :
	    return 0;
	    case 'call_reply' :
	    return 0;
	}
	return 1;
    }

    this.remove_callback = function(type, msg){
    }
}

function service_cli(connection, sm_id, auth_id, service_id, spec){
    this._connection = connection;
    this._context = {
	sm_id : sm_id,
	auth_id : auth_id,
	service_id : service_id
    };
    
    this._helper =  (function(parent){
			 return { 
			     call : function(method_name, args, ret_callback){
				 var request = {
				     "context" : parent._context,
				     "type" : "call",
				     "id" : 0,
				     "name" : method_name,
				     "args" : args
				 };
				 parent._connection.sock.send(JSON.stringify(request));
				 //marshaller.add_callback('call_reply', id, callback)
			     },
			     signal_connect : function(signal_name, callback){
				 //	marshaller.add_callback('signal', name, func);
			     },
			     signal_disconnect : function(signal_name){
				 //	marshaller.remove_callback('signal', name);
			     }
			 }
		     })(this)

    if(spec.methods)
	for(method in spec.methods){
	    var mobj = spec.methods[method];
	    var params = new Array;
	    
	    if(mobj.parameters)
		for(param in mobj.parameters)
		    params.push(param);
	    params.push('callback');
	    var method_args = params.join();
	    params.pop();
	    
	    var helper_args = '{';  
	    for(var param in params){
		helper_args += params[param] + ':' + params[param] + ',';
	    }
	    helper_args = helper_args.slice(0,-1);
	    helper_args += '}';
	    
//	    console.log(method);	    

	    eval('this[method] = function('+ method_args +'){this._helper.call(\'' + method + '\',' + helper_args + ', callback)}');
	}
    if(spec.signals){
	
 	var signals = new Array;
	
	for(var signal in spec.signals){
	    signals.push(signal);
	}
	
	this.on = function (signal_name, callback){
	    for (var signal in signals)
		if(signals[signal] == signal_name){
		    //this._helper.signal_connect(signal_name, callback);
		    console.log(1);
		    return 1;		    
		}
	    
	    return 0;	    
	}
    }

    this.release = function(){
	
    }    
}


function dlist(data){
    this.data = data;
    this.next = null;
    this.prev = null;

    this.push = function(list){
	list.next = this;
	this.prev = list;

	return list;
    }

    this.remove = function(){
	var head = undefined;
	if(this.prev){
	    this.prev.next = this.next;
	    if(this.next)
		this.next.prev = this.prev;
	}
	else if(this.next){
	    this.next.prev = null;
	    head = this.next;
	} else 
	    head = null;
	
	
	this.prev = null;
	this.next = null;

	return head;
    }
}

function object_collector(implementation){
    var _col = {
	impl : {
	    data : implementation.data,
	    create_object : implementation.create_object,
	    destroy_object : implementation.destroy_object
	    	    
	},

	free_objs : null,
	busy_objs : null,
	
	get_obj : function(){
	    var obj;
	    var list;
	    if (this.free_objs){
		list = this.free_objs;
		this.free_objs = list.remove();
	    } else {
		obj = this.impl.create_object();
		list = new dlist(obj);
	    }
	    
	    if(this.busy_objs)
		this.busy_objs.push(list);
	    this.busy_objs = list;

	    return list;
	},

	free_obj : function(list){
	    var head = list.remove();
//	    console.log(list.next);
//	    console.log(list.prev);
//	    if(null == undefined)
//		console.log('ravno');
	    if(typeof(head) != undefined){
		this.busy_objs = head;
	    }
	    if(this.free_objs)
		this.free_objs.push(list);
	    this.free_objs = list;
	    //console.log(list.prev);
	},

	collect : function(minimum_free){
	    
	}
    }

    return _col;
}

function _connection_to_sm(zmq, addr){
    this.sock = zmq.createSocket('dealer');
    this.sock.connect(addr.protocol + '//' + addr.host);	  
    this.load = 0;
    this.destroy = function(){
	this.sock.close();
    }
}

function dsa(addrs){
    this._private = {
	addrs : addrs,
	zmq : require('zeromq'),
	connections : new Array,
	sm_cli : null,	    
	
	connections_init : function(addr){
	    for (addr in addrs){
		this.connections.push(new _connection_to_sm(this.zmq, addrs[addr]));
	    }
	},
	
	connections_finalize : function(){
	    if (this.connections)
		for (var con; con; con = this.connections.pop()){
		    con.destroy();
		}   
	},
	
	connection_get : function(){
	    var min_load = this.connections[0].load;
	    var con_temp = this.connections[0];
	    for (con in this.connections){
		if(min_load > con.load){
		    min_load = con.load;
		    con_temp = con;
		}		    
	    }
	    con_temp.load++;
	    return con_temp;
	},
	
	ids : new object_collector({
				       data : 1,
				       create_object : function(){
					   return this.data++;
				       },
				       destroy_object : function(){}
				   }),
	
    }
    
    this.get_service = function(service_name, callback){
	sm = this._private.sm_cli;
	sm._connection = this._private.connection_get();
	sm.get_service(service_name);
//	sm_service._helper.call('get_service', ['test_service'], callback);
	//qvar ctx = new dsa_context(this,sock,0,0,'sm');
	    //var method = ctx.create_call(this, sock,'get_service', { service_id : "blin" });
	    //method.call();
//	    console.log(ctx.service_id);
    },
    
    this.implement_service = function(service_name){
	
    },   
	
    this.disconnect = function(){
	
    }	
    

    this._private.connections_init();

    var sm_spec = fs.readFileSync('../services/service_manager.json');
    this._private.sm_cli = new service_cli(0, 0, 0, 0, JSON.parse(sm_spec));
}

function service_manager(services){
    this.get_service = function (dsa, reply, object, service_uuid){
//	console.log(service_uuid);
    }

    this.release_service = function(dsa,reply, object, service_uuid){
    }
    
    //и другие методы:)
}

function service_impl(name, data){
    this.spec = _spec(name + '.json');
    /*
     * объект реализации имеет методы сервиса, следующего вида:
     * function(dsa, reply, object, [arg, [arg]])
     */
    var impl;

    switch(name){
	case 'service_manager' : 
	impl = new service_manager(data);	
	break;

	default :
	fs.readFileSync('../services/impl/' + name + '.js');
    }

    this.impl = impl;
    this.call = function(msg){
	//проверить есть ли такой метод, его параметры и тд
	var params_str = '';
	for(var arg in msg.args){
	    params_str += 'msg.args.' + arg; 
	}
	
	//вызываем метод
	eval('this.impl.' + msg.name + '(0, 0, 0, ' + params_str + ')');
//	console.log(msg.name);
//	switch(msg.name);	
    }
    
    this.destroy = function(){
    }
}

function dsa_sm(addrs){
    var sm = this;
    this.services = new Object;
    this.services._0 = new service_impl('service_manager', this.services);

    this.marshall = function(msg){
	var msg = JSON.parse(msg.toString());
	try{
	    var service = sm.services['_' + msg.context.service_id];
	    switch(msg.type){
	    case 'call' :
		if(service)
		    service.call(msg);
		//	    if(msg.args.service_uuid == 150000)
		//	    console.log(msg);
		break;
	    case 'signal_reply' :
		break;
	    }	    
	} 
	catch (e2) {
	    //попытка обратиться к несуществующему сервису, гильда!
	    console.log(e2.type);
	}
    }

    var zmq = this.zmq = require('zeromq');
    this.gates = new Array;

    function _gate(addr, parent){
	var gate = new Object;
	gate.addr = addr;
	var gsock = gate.sock = zmq.createSocket('dealer');
	console.log('Binding to ' + addr.protocol + '//' + addr.host);
	gsock.bindSync(addr.protocol + '//' +  addr.host);
	gsock.on("message", parent.marshall );
	    
	return gate;
    }

    for (addr in addrs){
//	console.log(addrs[addr].host);
	this.gates.push(new _gate(addrs[addr], this));
    }
}


/*for(teg in result.errors) {
    console.log(result.errors[teg]);
}
*/

// end protocol

function example(){
    ips = new dsa_addresses(['127.0.0.1:27000, 127.0.0.1:27001']);
    serv = new dsa_sm(ips);
    
    cli = dsa(ips);
    /*
     * Проверяет работоспособность всех возможных sm и подключается к 3-4м, в случае невозможности подсоединиться как минимум к 2м, возвращает ошибку.
     * connect, disconnect.
     * connect  
     */
    eserv = cli.get_service(example_service);
    /*
     * Отсылает запрос (sm, auth:0, s: sm) get_service(servicename)
     * 
     * simpl = sm->create_simpl(servicename)
     * simpl->client_add(client)
     * simpl->start
     * client->reply(simpl->id) 
     */


    eserv.get_number(10,function(result){
			 //console.log(result);
		     });
    /*
     * (sm,auth, s:sm) get_number(10)
     * 
     * sm->marshal{
     * simpl = sm->get_simpl(id, client)
     * simpl->get_number(10){
     * client->reply(number) 
     * }
     * }
     */
    eserv.set_number(20, function(result){
//			 console.log(result);
		     });
    eserv.release();
     /* 
      * (sm, auth, s:sm) release_service(service_id)
      * simpl = sm->get_simpl(service_id)
      * simpl->client_remove(client){
      * simpl->emit_released() 
      * }
      */
}

exports.tt = 15;

exports.spec = function _spec(spec_file, spec_string, ref_inline){
//    function _ref_inline(spec_obj)
//    console.log('../services/' + spec_file);
    var spec_str = fs.readFileSync(spec_file);
    console.log(spec_str.toString())
    var spec_obj = JSON.parse(spec_str.toString());

    (function _ref_inliner(spec_obj){
	 for(var sfield in spec_obj){
	    if(sfield == '$ref' && ref_inline){
		var reg = new RegExp(/^dsa-headers:\/\/(.*)$/);
		var include;
		if(include = reg.exec(spec_obj[sfield]))
		    return new _spec('../services/' + include[1]);
		//реализовать подгрузку спеков и из текущей директории и из директории services/data
	    }else 
		if (typeof spec_obj[sfield] == 'object'){
//		    console.log(key);
		    var ret = _ref_inliner(spec_obj[sfield]);
//		    console.log(ret);
		    if (ret){
//			console.log(ret.obj);			
			for(var ret_field in ret){
//			    console.log(spec_obj[sfield])
			    spec_obj[sfield][ret_field] = ret[ret_field];						    
			}
		    }
		    //console.log(ret);
		    //console.log(spec_obj[key]);
		}
	}
	 return null;
    })(spec_obj)
    return spec_obj;
//    console.log(spec_str.toString());
}



//var speco = _spec('service_manager.json',0,1);
//console.log(util.inspect(speco, 0, 10));
//console.log(util.inspect(service,0,10));
//service.on('service_released', function(){})
//var addrs = dsa_addrs(['ipc://sm1.ipc', 'ipc://sm2.ipc']);

//var sm = new dsa_sm(addrs);/
//var cli = new dsa(addrs);
//cli._private.connections_finalize();

//for (var i = 0; i != 15000; i++){
//    cli.get_service(i);
//}

/*
var col = new object_collector({
				   data : 0,
				   create_object : function(){
				       return this.data++;
				   },
				   destroy_object : function(){}
			       });

var ids = new Array;

for (var i = 0; i != 20; i++){
    ids.push(col.get_obj());
}

for (id in ids){
//    console.log(1);
    col.free_obj(ids[id]);
}

for (var i = 0; i != 10; i++){
//    console.log(col.get_obj().data);
}
var id = col.busy_objs;
*/
//console.log(id);
//while (id){
  //  console.log(id.data);
  //  id = id.next;
//}

/*
var zmq = require('zeromq');

var server = zmq.createSocket('dealer');

server.bindSync('ipc://serv');
server.identity = '15';
server.on("message", function(data){
//	      console.log('privet');
	      console.log(data.toString());
	      server.send('privet drug');
	      server._flush();
	  });

var client = zmq.createSocket('dealer');

client.connect('ipc://serv');
client.identity = '16';
client.on("message", function(data){
				  console.log(data.toString());
			      });
for(var i = 0; i != 10;i++){
//    console.log('privet');
//    client.send("incognito");
    client.send("terro");    
}

//client.close();
//server.close();
*/