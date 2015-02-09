var trecord = require('types/record'),
    ui = require('caravan/parts/ui');
//    tconstructor = require('types/constructor');

function list_item(){
//реализация оболочки для capsule types, чтобы визуально их представлять, каждый и совершать визуальные
//действия(встраивать в card, перетаскивать и тд)    
}

//простой проверщик допустимых элементов для списка, нужен для отделения специальных полей от элементов
function list_item_check(){
 
}

function tlists(image){
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
//	    current._card.add(new list_item(new tconstructor(current[item])));
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

exports.init = function(_cn){
    _cn.on('state_start', function(sprout, stack, image){
	       var ui = (require('caravan/parts/ui')).get(),
	       comp = ui.comp;
	       var red = comp.image_create({
				     x : '%10',
				     y : '%10',
				     width : '%30',
				     height : '%20',
				     source : require('shareg/images/red')
				 }),
	       blue = comp.image_create({
				     x : '%40',
				     y : '%30',
				     width : '%30',
				     height : '%20',
				     source : require('shareg/images/blue')
				 });
	       comp.frame_add(0, red);
	       comp.frame_add(0, blue);
	       var anim = comp.anim_create([
					       {
						   duration : 3000,
						   actions : {
						       x : 20,
						       y : 20,
//						       width : -10,
//						       height : 30
						   }
					       },
					       {
						   duration : 3000,
						   actions : {
						       x : -20,
						       y : -20,
//						       width : 10,
//						       height : -30
						   }						  
					       }
					   ]);
	       comp.anim_start(comp.anim_bind(red, anim));
	       comp.anim_start(comp.anim_bind(blue, anim));
//	      lists = new tlists(image);
	  });
    _cn.on('state_stop', function(sprout, stack){
	  });
    _cn.on('state_save', function(sprout, stack, image){
	  });  
};

/*
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
*/