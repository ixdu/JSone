var trecord = require('types/record'),
    ui;
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

function ui_menu(){
    
}

function modal(form_info){
    //тут ещё должна быть работа по скрытию перекрываемого содержимового и прочее
    var modal_f = new ui.frame({
			     x : '0%',
			     y : '0%',
			     width : '100%',
			     height : '100%'
			 }),
    content_f =  new ui.frame({
			    x : '31%',
			    y : '31%',
			    width : '38%',
			    height : '38%'
			}),
    bg_i = new ui.image({
		      x : '30%',
		      y : '30%',
		      width : '40%',
		      height : '40%',
		      source : require('shareg/images/brown_rect')
		  }),
    grey_i = new ui.image({
		       x : '0%',
		       y : '0%',
		       width : '100%',
		       height : '100%',
		       opacity : '5%',
		       source : require('shareg/images/grey')
		   });
    
    ui.root_f.add(modal_f);
    modal_f.add(grey_i);
    modal_f.add(bg_i);
    modal_f.add(content_f);

    modal_f.content = content_f;
  
    return modal_f; 
}

function element_action_menu(element){
    var modal_f = modal();
    modal_f.content.add(new ui.button({
				       x : '0%',
				       y : '0%',
				       width : '100%',
				       height : '30%',
				       label : 'удалить',
				       on_press : function(){
					   element.container.obj.remove_by_obj(element);
					   modal_f.destroy();
				       }
				   }));			    
    modal_f.content.add(new ui.button({
				       x : '0%',
				       y : '30%',
				       width : '100%',
				       height : '30%',
				       label : 'изменить',
				       on_press : function(){
					   modal_f.destroy();
				       }
				   }));
}

function element_build(element){
    element.on('pointer_up', function(){
		   element_action_menu(element);
	       });
}

var rorb = 0;
function tlelement(){
    var element;
    if(rorb == 1){
	rorb = 0;
	element = new ui.image({
				   x : '0%',
				   y : '0%',
				   width : '50%',
				   height : '100%',
				   source : require('shareg/images/red')
			       });
    }else{
	rorb = 1;
	element = new ui.image({
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

function telement(element){
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
	    
	    element = new ui.image({
				    x : '0%',
				    y : '0%',
				    width : '100%',
				    height : '100%',
				    source : image 
				});
	    element_build(element);

	    return element;    
	}
	var modal_f = modal(),
	title_t = new ui.text({
				  x : '0%',
				  y : '0%',
				  width : '100%',
				  height : '30%',
				  text : 'выберите цвет'
			   }),
	red_i = new ui.image({
			      x : '0%',
			      y : '30%',
			      width : '100%',
			      height : '30%',
			      source : require('shareg/images/red')
			  }),
	blue_i = new ui.image({
				  x : '0%',
				  y : '60%',
				  width : '100%',
				  height : '30%',
				  source : require('shareg/images/blue')
			      });

	function _choose_finalizer(image){
	    on_create_cb(element_image(image));
	    modal_f.destroy();
	}

	red_i.on('pointer_up', function(){
		     _choose_finalizer(require('shareg/images/red'));
		 });
	blue_i.on('pointer_up', function(){
		      _choose_finalizer(require('shareg/images/blue'));
		  });
	
	modal_f.content.add(title_t);
	modal_f.content.add(red_i);
	modal_f.content.add(blue_i); 		 
    }
};

var etext = {
    form : function(on_create_cb){
	function element_text(text){
	    var element;
	    
	    element = new ui.text({
				      x : '0%',
				      y : '0%',
				      width : '100%',
				      height : '100%',
				      text : text 
				  });
	    element_build(element);
	    
	    return element;    
	}
	var modal_f = modal(),
	title_t = new ui.text({
				  x : '0%',
				  y : '0%',
				  width : '100%',
				  height : '30%',
				  text : 'создание текста'
			      }),
	content_e = new ui.entry({
				     x : '0%',
				     y : '30%',
				     width : '100%',
				     height : '30%'
				 }),
	finish_b = new ui.button({
				     x : '0%',
				     y : '60%',
				     width : '100%',
				     height : '30%',
				     label : 'закончить',
				     on_press : function(){
					 on_create_cb(element_text(content_e.control.get_value()));
					 modal_f.destroy();
				     }
				 });
	modal_f.content.add(title_t);
	modal_f.content.add(content_e);
	modal_f.content.add(finish_b); 		 
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
	var slide_a = ui.comp.anim_create([{
					       duration : 300,
					       actions : actions
					   }
					  ]),
	slide_elems_c = what_position, banim;
	while(slide_elems_c != elements.length){
	    banim = ui.comp.anim_bind(elements[slide_elems_c].element.container.frame.id, slide_a);
	    ui.comp.anim_start(banim);
	    ui.comp.event_register(banim, 'animation_stopped', function(){
				       ui.comp.anim_unbind(banim);
				       ui.comp.anim_destroy(slide_a);
				   });
	    slide_elems_c++;
	}		
    }
    
    element = new ui.frame(info);

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
	    frame : new ui.frame({
				     x : container.geometry.x + '%',
				     y :  container.geometry.y + '%',
				     width : container.geometry.width + '%',
				     height : container.geometry.height + '%'
				 }),
	    obj : element
	};

	_element.container.frame.add(_element);
	this.add(_element.container.frame);

	return container;
    };

    element.remove = function(position){
	if(position >= elements.length)
	    return null; 
	
	var container = elements[position],
	element = container.element;

	geometry.height -= 10;
	elements.splice(position, 1);
	element.remove();
	element.container.frame.remove();
	element.container.frame.destroy();
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
	       ui = require('shareg/shared').get('ui');

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

	       ui.comp.frame_add(0, list.id);

	       list.insert(3, telement(new ui.button({
					   x : '0%',
					   y : '0%',
					   width : '100%',
					   height : '100%',
					   label : 'добавить',
					   on_press : function(){
					       var _modal = modal(),
					       text_b = new ui.button({
									  x : '0%',
									  y : '0%',
									  width : '100%',
									  height : '30%',
									  label : 'текст',
									  on_press : function(){
									      _modal.destroy();
									      etext.form(function(element){
											     list.insert(0, element);
											 });		
									  }
								      }),			    
					       icon_b = new ui.button({
								 x : '0%',
								 y : '30%',
								 width : '100%',
								 height : '30%',
								 label : 'иконку',
								 on_press : function(){
								     _modal.destroy();
								     icon.form(function(element){
										  list.insert(0, element);
									      });
								 }
							     }),
					       list_b = new ui.button({
								 x : '0%',
								 y : '60%',
								 width : '100%',
								 height : '30%',
								 label : 'список',
								 on_press : function(){
								     _modal.destroy();
								     elist.form();
								 }
							     });
					       
					       _modal.content.add(text_b);
					       _modal.content.add(icon_b);
					       _modal.content.add(list_b); 								} 
				       })));
	       list.insert(4, telement(new ui.button({
							 x : '0%',
							 y : '0%',
							 width : '100%',
							 height : '100%',
							 label : 'выгрузить'					   
						     })));
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