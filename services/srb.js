function find_free_keeper(number_of_keepers){
//наверное то, что должно быть здесь, должно слиться с событиями block_keeper. То есть каждый блокодержатель бы
//переодически отправлял запросы другим блокодержателям о возможности ими разместить блоки или невозможности. Ну и удерживал у себя скажем 50-60 адресов блокодержателей на всякой пожарный  
}

function objects_keeper(send, react){
    var objects = [];
    var keepers = [];
    
    //this operations with block is working direct on capsule.storage
    function create_object(object_info){
	
    }
    
    function update_object(object_info){
	
    }

    function read_object(object_info){
	//чтение объекта включает поиск нужных фрагментов объекта, их слияние с использованием кода поддержки
	//том pack_type, которого объект
    }
    function read_block_head(object_info){
	return {
	    "keepers" : "",
	    "pack_type" : "json"
	}
    }
    function try_object(object_info){
	
    }
    function delete_object(object_info){
	
    }

    function defragmentor(blocks){
	//каждый из реплицирующих оъект держателей дефрагментирует то, что хранит по своему
	//то есть у одного объект может состоять из 50 частей, а другого, этот же объект, из 20
	//по этой причине дефрагметация почти не связана с репликацией. Единственная связь, это
	//необходимость сохранения истории изменения объекта, но это не мешает хранить объект по
	//разному и с разным количеством частей	
    }

    function framentator(blocks){
	//следить за тем, что фрагменты не становились слишком большими, что делает сложным их репликацию
	//и невозможным параллельное чтение. Когда они становятся слишком большими, фрагметатор делит
	//их на по меньше, при этом делает это с использованием packer для каждого pack_type, то есть с 
	//учётом внетренней структуры фрагментов, крайне важно для последущего чтения этих объектов
    }

    function replicator(blocks){
	//репликация включает и проверку жизни реплицированных объектах на держателях и
	//передачу всех изменений объекта, для поддержация одинаковых знаний
	for(ind in objects){
	    for(keeper in objects[ind][keepers]){
		objects[ind][keepers][keeper].alive(objects[ind][keepers].id);
	    }   
	}	
    }
    return {
	"in" : {
	    "init" : function(client){
		//проверяем все ли хранители блоков на месте, если нет, то находим новых и даём им копии блоков
		modules.timer.js.create(
		    function(){
			replicator(objects);			
			defragmentor(objects);
			fragmetator(objects);
		    }, 5000, true);
	    },
	    "finalize" : function(client){
		
	    },
	    "create" : function(client, data_tree, pack_type,replicate, replicated_to){
		write_block(data_tree);
		var keepers = find_free_keepers(max_block_replications);
		var block_info = {
		    "id" : block.id,
		    "pack_type" : pack_type,
		    "keepers" : []
		}
		for(ind in keepers){
		    //ошибки какие-то
		    send(keepers[ind], 'create', data_block, true, keepers.join(THIS));
		    keepers.push(keepers[ind].id);
		}
		//отлавливаем все сообщения от держателей, если кто-то не отвечает, находим ему замену
		//и шлём блок ему
	    },
	    "update" : function(client, object_info, update_tree){
		//существенно то, что репликация обновления блока происходит на немедленно, а в 
		//_своё время_. Но с учётом этого вызова.
		update_object(object_info, update_block);
	    },
	    "extract" : function(client, object_info, pattern_tree){
		//как и в случае записи, которой нет, в том виде, в котором это обычно предполагается
		//srb не предполагает и обычного чтения, вместо этого предлагается механизм извлечения
		//данных используя pattern для объекта
		//конечно, это не отменяет возможности полного чтения объекта, но даёт возможность прочитать
		//всего несколько частей большого объекта эффективно
		//эта функциональность полагается на реализацию packer's конкретных pack_type

		//экстракция также взаимодействует с разными держателями реплицированного объекта, и может
		//извлекать данные параллельно из них и даже совместно с ними использовать packer's для
		//ускорения pattern
	    },
	    "delete" : function(client, object_info){
		var object_head = read_block_head(object_info);
		if(object_head){
		    delete_object(object_info);
		    for(ind in keepers){
			send(keepes[keeper], 'delete', object_info);
		    }
		}
	    },
	    "alive" : function(client, object_info){
		if(!try_block(object_info))
		    send(client, 'dead', [object_info]);
	    },
	    
	    "dead" : function(client, blocks){
		for(block in blocks){		    
		    var keeper = find_free_keeper(blocks[block].data.length());
		    send(keeper, 'create', blocks[block])
		}
	    },
	    "services_unreached" : function(client, message){
		//тут проверяем не по душу ли это живых блоков проверка была, если по их, то ищём новых киперов
	    }
	},
	"out" : {
	    "dead" : function(block){}
	}
    }
}

var max_block_replications = 10;
var max_block_size = 5000;

/*
 * Необходимо объединение блочного и инкрементально-объектного уровней, не обязательно в один уровень, потому
 * что вопрос сжатия, разбиения и эффективного распределения мелкими блоками важен. Но нужно обдумать интеграцию
 */