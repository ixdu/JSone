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

function modal(form_info){
    var list = tlist({ 
			 x : '20%',
			 y : '20%',
			 width : '60%',
			 height : '60%'
		     });
    for(ind in arguments){
	list.insert(ind);
    }

    list.insert(arguments.length, telement('button', {
					   }))
}

var rorb = 0;
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
    comp.event_register(element.id, 'pointer_up', function(){
			    modal({
				      ok : 'удалить'
			    });
//			    element.container.obj.remove_by_obj(element);
			});

    return element;
};

function telement(name, info){
    var element;

    element = ue(name, info);

    return element;
}

function tlist(info){
    var elements = [],
    element,
    geometry = {
	height : 0	
    };
    function slide_elements(what_position, actions){
	var slide_a = comp.anim_create([{
					    duration : 300,
					    actions : actions
					}
				       ]),
	slide_elems_c = what_position, banim;
	while(slide_elems_c != elements.length){
	    banim = comp.anim_bind(elements[slide_elems_c].element.container.frame, slide_a);
	    comp.anim_start(banim);
	    comp.event_register(banim, 'animation_stopped', function(){
				    comp.anim_unbind(banim);
				    comp.anim_destroy(slide_a);
				});
	    slide_elems_c++;
	}		
    }
    
    element = ue('frame', info);

    element.insert = function(position, element){
	if(position >= elements.length+1)
	    return null;
	if(geometry.height + 10 > 100)
	    return null;
	else
	    geometry.height += 10;

	var container = {
	    element : element,
	    geometry : {
		x : 0,
		y : (position * 10),
		width : 100,
		height : 10
	    }
	};

	if(elements[position] == undefined)
	    elements[position] = container;	    
	else{
	    //slide follow elements down to one
	    slide_elements(position, { y : container.geometry.height});	    
	    elements.splice(position, 0, container);
	}
	element.container = {
	    frame : comp.frame_create({
					  x : container.geometry.x + '%',
					  y :  container.geometry.y + '%',
					  width : container.geometry.width + '%',
					  height : container.geometry.height + '%'
				      })
	};
	comp.frame_add(element.container.frame, element.id);
	comp.frame_add(this.id, element.container.frame);

	return container;
    };

    element.remove = function(position){
	if(position >= elements.length)
	    return null; 
	
	var container = elements[position],
	element = container.element;

	geometry.height -= 10;
	elements.splice(position, 1);
	comp.frame_remove(element.id);
	comp.frame_remove(element.container.frame);
	comp.frame_remove(this.id);
	comp.frame_destroy(element.container.frame);
	element.container = undefined;

	//slide follow elements up to one
	slide_elements(position, { y : -container.geometry.height});
	
	return container.element;
    };

    element.remove_by_obj = function(element){
	for(ind in elements){
//	    if(elements[ind].element == element)
//		this.remove(ind);
	}
    };

    element.destroy = function(){
	
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

	       list.insert(0, tlelement());
	       list.insert(1, tlelement());
	       list.insert(2, tlelement());
	       list.remove(2);
	       list.insert(2, tlelement());
	       list.insert(3, tlelement());
	       list.remove(3);
	       list.remove(2);
//	       list.remove(3);

	       comp.frame_add(0, list.id);

	       list.insert(2, telement('button', {
					   x : '0%',
					   y : '0%',
					   width : '100%',
					   height : '100%',
					   label : 'добавить',
					   on_press : function(){
					       list.insert(1, tlelement());
					   }
				       }));
	       list.insert(3, telement('button', {
					   x : '0%',
					   y : '0%',
					   width : '100%',
					   height : '100%',
					   label : 'выгрузить'					   
				       }));
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

    save : function(sprout, stack, image){
	var pimage = new trecord();
	pimage.data = lists.get_state();
	pimage.update();
	image.services['lists'] = pimage;
    }
};
*/