/*
 
 */

var validator = require('./json-schema');

var spec = new Object;

//type(method, signal)
spec.find = function(type, name){
    
}

var url = require('url');

function dsa_addrs(addr_array){
    var _addrs = new Array;
    for (addr in addr_array){
//	console.log(addr_array[addr]);
	var _url = url.parse(addr_array[addr]);
	if (_url) _addrs.push(_url);
    }

    return _addrs;
}


function service_cli(connection, sm_id, auth_id, service_id){
    this._connection = connection;
    this._context = {
	sm_id : sm_id,
	auth_id : auth_id,
	service_id : service_id
    };
    
    this._helper =  (function(parent){
			 return { 
			     call : function(method_name, args, ret_callback){
				 parent._connection.sock.send("privet ot helpera");
			     },
			     signal_connect : function(signal_name, callback){
			     }
			 }
		     })(this)

    this.release = function(){
	
    }
    
    this.signal_connect = function(callback){
	
    }
    
    this.signal_disconnect = function(callback){
	
    }
}


function service_impl(service_name){

    var impl = new Object;
    
    impl.start = function(){
    }

    impl.stop = function(){
	
    }

    impl.started = function(){
	
    }

    impl.suspended = function(){
	
    }

    impl.resumed = function(){
	
    }

    impl.stopped = function(){
	
    }
    
    return impl;
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

    var _obj = { 
	_private : {
	    addrs : addrs,
	    zmq : require('zeromq'),
	    connections : new Array,

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

	},

	get_service : function(service_name, callback){
	    var con = this._private.connection_get();
	    var sm_service = new service_cli(con,0,0,0); 
//	    con.sock.send('privet ot cli');
	    sm_service._helper.call('get_service', ['test_service'], callback);
	    //qvar ctx = new dsa_context(this,sock,0,0,'sm');
	    //var method = ctx.create_call(this, sock,'get_service', { service_id : "blin" });
	    //method.call();
//	    console.log(ctx.service_id);
	},
    
	implement_service : function(service_name){
	
	},   
	
	disconnect : function(){

	}	
    }    

    _obj._private.connections_init();
    
    return _obj;
}

function sm_impl(type, service_name){
    var srv_impl = new Object;
}


function dsa_sm(addrs){
    var sm = new Object;

    sm.marshal = function(msg){
	console.log(msg.toString());
    }

    var zmq = sm.zmq = require('zeromq');
    sm.gates = new Array;

    function _gate(addr){
	var gate = new Object;
	gate.addr = addr;
	var gsock = gate.sock = zmq.createSocket('dealer');
	console.log('Binding to ' + addr.protocol + '//' + addr.host);
	gsock.bindSync(addr.protocol + '//' +  addr.host);
	gsock.on("message", sm.marshal );
	    
	return gate;
    }

    for (addr in addrs){
//	console.log(addrs[addr].host);
	sm.gates.push(new _gate(addrs[addr]));
    }

    return sm;
}

var te = {
    "gg" : "dabu",
    "hh" : "heru"
}

var schema = {
    "properties" : {
	"gg" : {
	    "type" : "string"
	},
	"hh" : {
	    "type" : "string",
	    "pattern" : "heru"
	},
	"yy" : {
	    "type" : "number",
	}
    }
}

var result = validator.validate(te, schema);

/*for(teg in result.errors) {
    console.log(result.errors[teg]);
}
*/

// start protocol

function _service_helper(){
    
}

function dsa_context(dsa, sock, auth_id, sm_id, service_id){
    var context = {
	dsa : dsa,
	sock : sock,
	header : {
	    auth_id : auth_id,
	    sm_id : sm_id,
	    service_id : service_id,
	},

	create_call : function(method_name, args){
	    var method = {
		context : context,
		call : function(){
		    var msg = {
			header : context.header,
			type : 'method',
//			id : id,
			method : {
			    name : method_name,
			    args : args
			}
		    }
		   console.log('hoi');
		}
	    }
	    return method;
	}
    }

    return context;
}

function dsa_message(type, id){
    if (type == 1){
	//method
    } else if (type == 2){
	//signal
	msg.signal = new Object;
    } else if (type == 3){
	msg.reply = new Object;
	//reply
    } 
    else return NULL;

    return msg;
}

function dsa_frame(context, message){
    var frame = new Object;
    frame.context = new Object(context);
    frame.message = new Object(message);
    frame.read = function(){
	
    }

    frame.write = function(){
	
    }

    return frame;
}

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

var addrs = dsa_addrs(['ipc://sm1.ipc', 'ipc://sm2.ipc']);

var sm = dsa_sm(addrs);
var cli = dsa(addrs);
//cli._private.connections_finalize();

for (var i = 0; i != 15; i++){
    cli.get_service();
}


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