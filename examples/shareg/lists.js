var trecord = require('types/record'),
    ui = require('parts/ui'),
    tconstructor = require('types/constructor');

function list_item(){
//реализация оболочки для capsule types, чтобы визуально их представлять, каждый и совершать визуальные
//действия(встраивать в card, перетаскивать и тд)    
}

//простой проверщик допустимых элементов для списка, нужен для отделения специальных полей от элементов
function list_item_check(){
 
}

function tlists(state){
    var lists, current;
    if(typeof state == 'undefined'){
	current = {};
	lists = [current];
	current._card = new ui.card({ name : 'current', 
				      geometry : {
					  x : '50%',
					  y : '0%',
					  width : '50%',
					  height : '50%'					  
				      }
				    });
    } else {
	lists = state.lists;
	current = state.current;
	current._card = new ui.card({ name : state.current.name, 
				      geometry : {
					  x : '50%',
					  y : '0%',
					  width : '50%',
					  height : '50%'					  
				      }
				    });
	for(item in current){
	    if(!lists_item_check(current[item]))
		continue;
	    current._card.add(new list_item(new tconstructor(current[item])));
	}
    }
    ui.root.add(current._card);	

    this.get_state = function(){
	return {
	    lists : lists,
	    current : current
	};
    };

    this.destroy = function(){
	current._card.destroy();
	for(list in lists){
	    lists[list]._card.destroy();
	}
    };
}

var lists;

exports.serivce['media_source'] = {
    //возвращает media объект одного из поддерживаемых capsule типов
    get_media : function(id){
    },
    //возвращает следующий объект. lists сам решает что значит следующий(это может быть реально следующий
    //объект, а может быть следующий media объект, если следующий не media. А может быть произвольный объект(shuffle)
    get_next_media : function(){
    },
    //как предыдущий, но возвращает предшествующий
    get_prev_media : function(){
    }
};

exports.service['state'] = {
    start : function(sprout, stack, image){
	lists = new tlists(state);
    },
    stop : function(){
	lists.destroy();
    },
    save : function(sprout, stack, image){
	var pimage = new trecord();
	pimage.data = lists.get_state();
	pimage.update();
	image.services['lists'] = pimage;
    }
};
