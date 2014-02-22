function backends_read(){
    var backends = {
    }
    //читаем папку cloud_storage_backends и подгружаем бэкенды
    return backends;
}

//возможно проверку надо осуществлять на стороне клиента
function verify_object_info(){
    return null;
}

exports.init = function(dsa){
    var backends = backends_read();
    return {
	"in" : {
	    "storage_info" : function(client){
		dsa.send(client, 'storage_info', { "backends" : backends });	
	    },
	    "stat" : function(client, object_info){
		dsa.send(client, 'stat', backends[object_info.backend].info(object_info));
	    },
	    "href" : function(client, object_info){
		dsa.send(client, 'href', backends[object_info.backend].href(object_info));	
	    },
	    "read" : function(client, object_info, offset, length){
		dsa.send(client, 'reade', backends[object_info.backend].read(object_info, offset, length));
	    },
	    "write" : function(client, object_info, offset, length, data){
		dsa.send(client, 'write', backends[object_info.backend].write(object_info, offset, length));
            },
	    "clone" : function(client, object_info){
		//анализ поддержки бэкэндом клонирования, если нет, то просто идёт чтение и запись нового объекта
		dsa.send(client, 'clone', cloned_object_info);
	    },
	    "remove" : function(client, object_info){
		backends[object_info.backend].remove(object_info);
	    }
	},
	"out" : {
	    "storage_info" : function(storage_info) {},
	    "stat" : function(object_info){},
	    "href" : function(href){},
	    "read" : function(data){},
	    "write" : function(state){}, //state true or false
	    "clone" : function(object_info){}, //object_info of new created object
 	}
    }
}