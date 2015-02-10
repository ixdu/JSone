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

var comp;

function ue(element_name){
    var args = Array.prototype.slice.call(arguments),
    element;
    args.shift();
    //отделяем элементы компосайтера старого типа(только id) от новых(объекты)
    if(/^frame$|^image$|^text$|^button$|^entry$/.exec(element_name)){
	element = {};
	element.id = comp[element_name + '_create'].apply(comp, args);
	element.destroy = function(){
	    comp[element_name + '_destroy'].apply(comp, this.id);
	};
    } else {
	element = comp[element_name + '_create'].apply(comp, args);
    }

    //тут должен быть код управления геометрией на основе размеров или миллиметров и любой другой код, 
    //уместный для элементов каравана
    return element;
}

var rorb = 1;
function tlelement(){
    var element;
    if(rorb == 1){
	rorb = 0;
	element = ue('image', {
			 x : '0%',
			 y : '0%',
			 width : '50%',
			 height : '100%',
			 source : require('shareg/images/red')
		     });
    }else{
	rorb = 1;
	element = ue('image', {
			 x : '50%',
			 y : '0%',
			 width : '50%',
			 height : '100%',
			 source : require('shareg/images/blue')
		     });
    }
    return element;
};

function tlist(info){
    var elements = [],
    element,
    counter = 0;
    element = ue('frame', info);

    element.insert = function(position, element){
	elements[position] = element;
	element.container = comp.frame_create({
						  x : '0%',
						  y : (counter++ * 10) + '%',
						  width : '100%',
						  height : '10%'
					      });
	comp.frame_add(element.container, element.id);
	comp.frame_add(this.id, element.container);
    };
    element.remove = function(position){
    };

    return element;
};

exports.init = function(_cn){
    _cn.on('state_start', function(sprout, stack, image){
	       var ui = (require('caravan/parts/ui')).get();
	       comp = ui.comp;

	       var list = tlist({
				    x : '10%',
				    y : '10%',
				    width : '40%',
				    height : '80%'		      
				});
	       list.insert(1, tlelement());
	       list.insert(2, tlelement());
	       list.insert(3, tlelement());
	       list.insert(4, tlelement());
	       list.insert(5, tlelement());
	       list.insert(6, tlelement());
	       comp.frame_add(0, list.id);

	       var list1 = tlist({
				    x : '51%',
				    y : '20%',
				    width : '40%',
				    height : '80%'		      
				});
	       list1.insert(1, tlelement());
	       list1.insert(2, tlelement());
	       list1.insert(3, tlelement());
	       list1.insert(4, tlelement());
	       list1.insert(5, tlelement());
	       list1.insert(6, tlelement());
	       comp.frame_add(0, list1.id);

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