/*
 * self replicated blocks - it s only draft name
 */


exports.create = function(send, react){    
    var url = '';
    return {
	"stat" : function(object_info){
	    //находим всех киперов, содержащих фрагменты, считываем информацию о последнем доступе, фрагметации и размере	
	},
	"create" :function(data_tree, pack_type){
	    var data = JSON.stringify(data_tree);
	    var id = modules.uuid.generate_str();
	    var keeper = find_free_keeper(data.length/max_block_size);
	    send(keeper, 'create', {"pack_type" : pack_type, "data" : data, "id" : id}, true);
	    return {
		"backend" : 'srb',
		"url" : url,
		"id" : id
	    };
	},
	"update" : function(object_info, update_tree){
	    var data = JSON.stringify(update_tree);
	    var keeper = block_keeper.find(object_info.id);
	    send(keeper, 'update', object_info, update_tree);
	},
	//reading object by id but only that data which match tree_pattern. If tree_pattern is null, readed whole object
	"extract" : function(object_info, pattern_tree){
	    //находим всех хранителей содержащих объект, находим те фрагменты объекта, которые нам нужны
	    // в соответсвии с tree_pattern и извлекаем их
	    var keeper = block_keeper.find(object_info);
	    send(keeper, 'extract', object_info, pattern_tree);
	},
	"href" : function(object_info){
	    //всё почти как read, но вместо извлечения данных, нужно запустить http_responder и извлекать
	    //уже в каллбэке, который отрабатывает на нужный адрес
	},
	"delete" : function(object_info){
	    var keeper = block_keeper.find(object_info);
	    send(keeper, 'delete', object_info);
	}
    }
}
