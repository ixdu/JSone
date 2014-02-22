function find_free_block_keepers(number_of_keepers){
//наверное то, что должно быть здесь, должно слиться с событиями block_keeper. То есть каждый блокодержатель бы
//переодически отправлял запросы другим блокодержателям о возможности ими разместить блоки или невозможности. Ну и удерживал у себя скажем 50-60 адресов блокодержателей на всякой пожарный  
}

function block_keeper(send, react){
    var blocks_info = [];
    var keepers = [];
    function write_block(block){
	
    }
    function read_block(id){
	
    }
    function try_block(id){
	
    }
    return {
	"in" : {
	    "init" : function(client){
		//проверяем все ли хранители блоков на месте, если нет, то находим новых и даём им копии блоков
		modules.timer.js.create(
		    function(){
			for(block in blocks_info){
			    for(keeper in blocks_info[block][keepers]){
				blocks_info[block][keepers][keeper].alive(blocks_info[block][keepers].id);
			    }   
			}
			for(ind in keepers){
//			    send(keepers[ind].can_take
			}	
		    }, 5000, true);
	    },
	    "finalize" : function(client){
		
	    },
	    //если блок маленький, он может упаковываться в какой-то кусок, куда влазит.
	    "take" : function(client, block, replicate, replicated_to){
		write_block(block);
		var keepers = find_free_block_keepers(max_block_replications);
		var block_info = {
		    "id" : block.id,
		    "keepers" : []
		}
		for(ind in keepers){
		    keepers[ind].take(block, true, keepers.join(THIS));
		    block_info.keepers.push(keepers[ind].id);
		}
		//отлавливаем все сообщения от держателей, если кто-то не отвечает, находим ему замену
		//и шлём блок ему
	    },
	    //при удалении блока из более большого блока, всем кипера большого блока отслывается сообщение об удалении для синхронизации
	    "delete" : function(client, block_id){
//		if(try_block(block_id))
		    ///удалить у себя и другим послать уведомление
	    },
	    "alive" : function(client, block_id){
		if(!try_block(block.id))
		    send(client, 'dead', [block]);
	    },
	    
	    "dead" : function(client, blocks){
		var keepers = find_free_block_keepers(blocks.length());
		for(ind in keepers){
		    keepes[keeper].take(blocks[ind]);
		}
	    },
	    "services_unreached" : function(client, message){
		//тут проверяем не по душу ли это живых блоков проверка была, если по их, то ищём новых киперов
	    }
	},
	"out" : {
	    "dead" : function(block){
		
	    }
	}
    }
}

function make_blocks(data){

}
var max_block_replications = 10;
var max_block_size = 5000;
function storage(send, react){
    return {
	"in" : {
	    "write" : function(data){
		if(BIG){
		    var keepers = find_free_block_keepers(BIG / max_block_size);
		    var blocks = make_blocks(data); //block.id уникален для каждого блока, а значит можно по нему блок найти
		    for (ind in keepers){
			keepers[ind].take(blocks[ind]);
			
		    }		    
		}
	    }
	},
	"out" : {
	}
    }
}

function data_object(send, react){
    return {
	"in" : {
	    "create" :function(data_tree){
		var data = JSON.stringify(data_tree);
		var id = modules.uuid.generate_str();
		var keeper = find_free_block_keeper(data.length);
		keeper.take({"data" : data, "id" : id}, true);
	    },
	    "update" : function(id,update_tree){
		var data = JSON.stringify(update_tree);
		var keeper = block_keeper.find_free(id,data.length);
		keeper.take({"data" : data, "id" : id});
	    },
	    "destroy" : function(id){
		var keeper = block_keeper.find_by_id(id);
		keeper.delete(id);
	    }
	},
	"out" : {
	    "new_object" : function(id){}
	}
    }
}

/*
 * Необходимо объединение блочного и инкрементально-объектного уровней, не обязательно в один уровень, потому
 * что вопрос сжатия, разбиения и эффективного распределения мелкими блоками важен. Но нужно обдумать интеграцию
 */