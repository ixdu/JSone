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

exports.init = function(send, react){
    var backends = backends_read();
    return {
	"in" : {
	    "storage_info" : function(client){
		send(client, 'storage_info', { "backends" : backends });	
	    },
	    ///вероятно сообщения нужно просто перенаправлять backend'у, так как отвечать же он сам будет
	    //но пока оставлю, просто чтобы визуально ориентироваться
	    "stat" : function(client, object_info){
		send(client, 'stat', backends[object_info.backend].info(object_info));
	    },
	    "href" : function(client, object_info){},
	    "create" : function(client, object_info, offset, length){},
	    "update" : function(client, object_info, offset, length, data){},
	    "destroy" : function(client, object_info){}

//пока оставляю закоментированным, но возможно клонирование не понадобится. В свете объединение data_object
// и cloud_object уровней в один, нужно пересмотреть как делаться будут ранее предполагаемые легко пораждаемые
// отслаиваемые копии деревьев
//	    "clone" : function(client, object_info){
//		//анализ поддержки бэкэндом клонирования, если нет, то просто идёт чтение и запись нового объекта
//		dsa.send(client, 'clone', cloned_object_info);
//	    }
	},
	"out" : {
	    "storage_info" : function(storage_info) {},
	    //фактически эти сообщения отправляются backend'ом, но есть ещё вопросы вложенного посыла
	    //сообщений сервисами и оформления сервисов и их работы в dsa, после решения которых может быть
	    //и не нужно будет дублировать
	    "stat" : function(object_info, stat){},
	    "new_object" : function(object_info){},
	    "href" : function(object_info, href){},
	    "readed_data" : function(object_info, data){},
//	    "clone" : function(object_info){} //object_info of new created object
 	}
    }
}

