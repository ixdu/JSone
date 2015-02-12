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
	    comp[element_name + '_destroy'].call(comp, this.id);
	};
    } else {
	element = comp[element_name + '_create'].apply(comp, args);
    }

    //тут должен быть код управления геометрией на основе размеров или миллиметров и любой другой код, 
    //уместный для элементов каравана
    return element;
}

function modal(form_info){
    //тут ещё должна быть работа по скрытию перекрываемого содержимового и прочее
    var modal_f = ue('frame', {
			 x : '30%',
			 y : '30%',
			 width : '40%',
			 height : '40%'
		     }),
    content_f = ue('frame', {
		       x : '2%',
		       y : '2%',
		       width : '96%',
		       height : '96%'
		   }),
    bg_i = ue('image', {
		  x : '0%',
		  y : '0%',
		  width : '100%',
		  height : '100%',
		  source : require('shareg/images/brown_rect')
	      }),
    grey_i = ue('image', {
		    x : '0%',
		    y : '0%',
		    width : '100%',
		    height : '100%',
		    opacity : '5%',
		    source : require('shareg/images/grey')
		});
    
    comp.frame_add(0, grey_i.id);
    comp.frame_add(0, modal_f.id);
    comp.frame_add(modal_f.id, bg_i.id);
    comp.frame_add(modal_f.id, content_f.id);

    modal_f.content = content_f;
    modal_f.destroy = function(){
	comp.frame_remove(grey_i.id);
	grey_i.destroy();
	comp.frame_remove(bg_i.id);
	bg_i.destroy();
	comp.frame_remove(content_f.id);
	content_f.destroy();
	comp.frame_remove(this.id);
	comp.frame_destroy(this.id);
    };

    return modal_f;
}

function element_action_menu(element){
    var _modal = modal(),
    delete_b = ue('button', {
		      x : '0%',
		      y : '0%',
		      width : '100%',
		      height : '30%',
		      label : 'удалить',
		      on_press : function(){
			  element.container.obj.remove_by_obj(element);
			  _modal.destroy();
			  delete_b.destroy();
			  change_b.destroy();
		      }
		  }),			    
    change_b = ue('button', {
		      x : '0%',
		      y : '30%',
		      width : '100%',
		      height : '30%',
		      label : 'изменить',
		      on_press : function(){
			  _modal.destroy();
			  delete_b.destroy();
			  change_b.destroy();
		      }
		  });

    comp.frame_add(_modal.content.id, delete_b.id);
    comp.frame_add(_modal.content.id, change_b.id);
}

function element_build(element){
    comp.event_register(element.id, 'pointer_up', function(){
			    element_action_menu(element);
			});
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
    
    element_build(element);

    return element;
};

function telement(name, info){
    var element;

    element = ue(name, info);

    return element;
}

function eimage(info){
    var element;

    return element;
}

var icon = {
    form : function(on_create_cb){
	function element_image(image){
	    var element;
	    
	    element = ue('image', {
			     x : '0%',
			     y : '0%',
			     width : '100%',
			     height : '100%',
			     source : image 
			 });
	    element_build(element);

	    return element;    
	}
	var _modal = modal(),
	title_t = ue('text', {
			 x : '0%',
			 y : '0%',
			 width : '100%',
			 height : '30%',
			 text : 'выберите цвет'
		     }),
	red_i = ue('image', {
		       x : '0%',
		       y : '30%',
		       width : '100%',
		       height : '30%',
		       source : require('shareg/images/red')
		   }),
	blue_i = ue('image', {
			x : '0%',
			y : '60%',
			width : '100%',
			height : '30%',
			source : require('shareg/images/blue')
		    });

	function _choose_finalizer(image){
	    _modal.destroy();
	    title_t.destroy();
	    red_i.destroy();
	    blue_i.destroy();	    
	    on_create_cb(element_image(image));
	}
	comp.event_register(red_i.id, 'pointer_up', function(){
				_choose_finalizer(require('shareg/images/red'));
			    });
	comp.event_register(blue_i.id, 'pointer_up', function(){
				_choose_finalizer(require('shareg/images/blue'));
			    });

	comp.frame_add(_modal.content.id, title_t.id);
	comp.frame_add(_modal.content.id, red_i.id);
	comp.frame_add(_modal.content.id, blue_i.id); 		 
    }
};

var etext = {
    form : function(on_create_cb){
	function element_text(text){
	    var element;
	    
	    element = ue('text', {
			     x : '0%',
			     y : '0%',
			     width : '100%',
			     height : '100%',
			     text : text 
			 });
	    element_build(element);

	    return element;    
	}
	var _modal = modal(),
	title_t = ue('text', {
			 x : '0%',
			 y : '0%',
			 width : '100%',
			 height : '30%',
			 text : 'создание текста'
		     }),
	content_e = ue('entry', {
			   x : '0%',
			   y : '30%',
			   width : '100%',
			   height : '30%'
		       }),
	finish_b = ue('button', {
			  x : '0%',
			  y : '60%',
			  width : '100%',
			  height : '30%',
			  label : 'закончить',
			  on_press : function(){
			      _modal.destroy();
			      title_t.destroy();
			      finish_b.destroy();
			      on_create_cb(element_text((comp.entry_get_control(content_e.id)).get_value()));
			      content_e.destroy();
			  }
		      });
	comp.frame_add(_modal.content.id, title_t.id);
	comp.frame_add(_modal.content.id, content_e.id);
	comp.frame_add(_modal.content.id, finish_b.id); 		 
    }
};

function evideo(info){
    var element;

    //description
    //icon    

    return element;    
}

function elist(info){
    var element;

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

    element.insert = function(position, _element){
	if(position >= elements.length+1)
	    return null;
	if(geometry.height + 10 > 100)
	    return null;
	else
	    geometry.height += 10;

	var container = {
	    element : _element,
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
	_element.container = {
	    frame : comp.frame_create({
					  x : container.geometry.x + '%',
					  y :  container.geometry.y + '%',
					  width : container.geometry.width + '%',
					  height : container.geometry.height + '%'
				      }),
	    obj : element
	};
	comp.frame_add(_element.container.frame, _element.id);
	comp.frame_add(this.id, _element.container.frame);

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
	comp.frame_remove(element.id);
	comp.frame_destroy(element.container.frame);
	element.container = undefined;

	//slide follow elements up to one
	slide_elements(position, { y : -container.geometry.height});
	
	return container.element;
    };

    element.remove_by_obj = function(element){
	for(ind in elements){
	    if(elements[ind].element == element){
		this.remove(ind);
	    }
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
				    x : '30%',
				    y : '20%',
				    width : '40%',
				    height : '70%'		      
				});

	       list.insert(0, tlelement());
	       list.insert(1, tlelement());
	       list.insert(2, tlelement());
	       list.remove(2);
	       list.insert(2, tlelement());
//	       list.insert(3, evideo());
//	       list.remove(3);
//	       list.remove(2);
//	       list.remove(3);

	       comp.frame_add(0, list.id);

	       list.insert(3, telement('button', {
					   x : '0%',
					   y : '0%',
					   width : '100%',
					   height : '100%',
					   label : 'добавить',
					   on_press : function(){
					       var _modal = modal(),
					       text_b = ue('button', {
							       x : '0%',
							       y : '0%',
							       width : '100%',
							       height : '30%',
							       label : 'текст',
							       on_press : function(){
								   _modal.destroy();
								   text_b.destroy();
								   list_b.destroy();
								   etext.form(function(element){
										  list.insert(0, element);
									      });		
							       }
							     }),			    
					       icon_b = ue('button', {
								 x : '0%',
								 y : '30%',
								 width : '100%',
								 height : '30%',
								 label : 'иконку',
								 on_press : function(){
								     _modal.destroy();
								     text_b.destroy();
								     list_b.destroy();
								     icon.form(function(element){
										  list.insert(0, element);
									      });
								 }
							     }),
					       list_b = ue('button', {
								 x : '0%',
								 y : '60%',
								 width : '100%',
								 height : '30%',
								 label : 'список',
								 on_press : function(){
								     _modal.destroy();
								     text_b.destroy();
								     list_b.destroy();
								     elist.form();
								 }
							     });
					       
					       comp.frame_add(_modal.content.id, text_b.id);
					       comp.frame_add(_modal.content.id, icon_b.id);
					       comp.frame_add(_modal.content.id, list_b.id); 								} 
				       }));
	       list.insert(4, telement('button', {
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