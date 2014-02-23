/*
 * self replicated blocks - it s only draft name
 */


exports.init = function(send, react){    
    var url = '';
    return {
	"in" : {
	    "stat" : function(client, object_info){
		//находим всех киперов, содержащих фрагменты, считываем информацию о последнем доступе, фрагметации и размере	
	    },
	    "create" :function(client, data_tree){
		var data = JSON.stringify(data_tree);
		var id = modules.uuid.generate_str();
		var keeper = find_free_block_keepers(data.length/max_block_size);
		keeper.take({"data" : data, "id" : id}, true);
		send(client, 'new_object', {
		    "backend" : 'srb',
		    "url" : url,
		    "id" : id
		});
	    },
	    "update" : function(client, object_info, update_tree){
		var data = JSON.stringify(update_tree);
		var keeper = block_keeper.find_free(id,data.length);
		keeper.take({"data" : data, "id" : id});
	    },
	    //reading object by id but only that data which match tree_pattern. If tree_pattern is null, readed whole object
	    "read" : function(client, object_info, tree_pattern){
		//находим всех хранителей содержащих объект, находим те фрагменты объекта, которые нам нужны
		// в соответсвии с tree_pattern и извлекаем их
		//var keeper = block_keeper.find(id);
		var readed_data;
		send(client, "readed_data");
	    },
	    "href" : function(client, object_info){
		//всё почти как read, но вместо извлечения данных, нужно запустить http_responder и извлекать
		//уже в каллбэке, который отрабатывает на нужный адрес
	    },
	    "destroy" : function(client, object_info){
		var keeper = block_keeper.find_by_id(id);
		keeper.delete(id);
	    }
	},
	"out" : {
	    "new_object" : function(object_info){},
	    "stat" : function(object_info, stat){},
	    "readed_data" : function(object_info, data){},
	    "href" : function(object_info,href){}
	}
    }
}
