function find_free_block_keepers(number_of_keepers){
    
}

function block_keeper(dsa){
    var blocks_info = [];
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
		    }, 5000, true);
	    },
	    "finalize" : function(client){
		
	    },
	    "take" : function(client, block, replicate){
		write_block(block);
		var keepers = find_free_block_keepers(max_block_replications);
		var block_info = {
		    "id" : block.id,
		    "keepers" : []
		}
		for(ind in keepers){
		    keepers[ind].take(block);
		    block_info.keepers.push(keepers[ind].id);
		}
		//отлавливаем все сообщения от держателей, если кто-то не отвечает, находим ему замену
		//и шлём блок ему
	    },
	    "alive" : function(client, block){
		if(!try_block(block.id))
		    dsa.send(client, 'dead', [block]);
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
function storage(dsa){
    return {
	"in" : {
	    "write" : function(data){
		if(BIG){
		    var keepers = find_free_block_keepers(BIG / max_block_size);
		    var blocks = make_blocks(data);
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