var ui = {
    "frame" : null,
    "elements" : [],
    "in" : {
//	""
	"show" : function(client){
	    if(frame)
		frame = Compositer.frame_create();
	},
	"hide" : function(client){
	    for(elem in elements)
		dsa.send(elements[elem].client, 'visible_changed', 'hidden');
	    if(frame)
		Compositer.change_prop(frame, { "opacity" : "100%" })
	},
	//elements messages
	"give_element" : function(client){
	    var element = {
		"id" : uuid.generate_str(),
		"client" : client,
		"frame" : Compositer.frame_create()
	    }
	    elements.push(element);
	    dsa.send(client, 'new_element', element.id);
	},
	"fill_element" : function(client, element, ui_item){
	    //парсим тут дерево и реализуем разные элементы:)
	},
	"hide_element" : function(cleint, element){
	}
    },
    "out" : {
	//state is shown or hided
	"visible_changed" : function(state){},
	//for all visual elements
	"new_element" : function(element){},
	//for entry
	"typed" : function(item, typed){},
	//for button
	"pressed" : function(item, state){}
    }
}

var address_panel = {
    "_element" : '',
    "address" : '',
    "in" : {
	"init" : function(){
	    //просим выделения элемента у канваса
	    dsa.send('ui', 'give_element');
	},
	"visible_changed" : function(client, state){
	    //важно что поверхности, они же element, отключаются ui рекурсивно, так что может и не надо будет ничего делать
	    //тут приостанавливаем или возобновляем свою визуальную или иную активность
	},
	"new_element" : function(client, element){
	    //получаем запрошенный элемент. Примичательно, что можем получить новый в результате удаления
	    //старого и создания нового без нашего ведома:)
	    _element = element;
	    var ui_item = {
		"type" : 'image',
		"color" : 'white',
		"childs" : {
		    "address" :{
			"type" : 'entry',
			"color" : 'grey',
				"x" : "3%",
				"y" : "1%",
				"width" : "75%",
				"heigth" : "10%"
		    },
		    "gobutton" : {
			"type" : 'button',
			"color" : 'red',
			"x" : "78%",
			"y" : "1%",
			"width" : "20%",
			"heigth" : "10%"
		    }
		}
	    }
	    dsa.send('ui', 'fill_element', element, ui_item);
	},
	"typed" : function(client, item, typed){
	    //когда набирают в entry, люди приходят сообщения с тем, что уже набрано. В дальнейшем можно
	    //запросить всё, что было набрано
	    address = typed;	    
	},
	"pressed" : function(client, item, state){
	    if(state == 'pressed')
		dsa.send('sphere.ui.area_primary', 'open', address)
	}
    }
}

var area = {
    "_name" : null,
    "object" : null,
    "_address" : null,
    "_element" : null,
    "in" : {
	"init" : function(name){
	    _name = name;
	    //нужно регистрировать себя в соответствии с именем
	    dsa.send('ui', 'give_element');
	},
	"visible_changed" : function(client, state){
	    //важно что поверхности, они же element, отключаются ui рекурсивно, так что может и не надо будет ничего делать
	    //тут приостанавливаем или возобновляем свою визуальную или иную активность
	},
	"new_element" : function(client, element){
	    _element = element;
	    object = 'sphere.object.welcome';
	    dsa.send('sphere.objects.welcome', 'take', element);
	},
	"resize" : function(client){
	  //изменяем размер либо до максимального либо до нормального, но только для primary  
	},
	"open" : function(client, address){
	    dsa.send(object, 'release');
	    _address = object = address;
	    dsa.send(address, 'take', element);
	}
    }    
}

var action_panel = {
    "_element" : null,
    "in" : {
	"init" : function(){
	    dsa.send('ui', 'give_element');
	},
	"visible_changed" : function(client, state){
	    //важно что поверхности, они же element, отключаются ui рекурсивно, так что может и не надо будет ничего делать
	    //тут приостанавливаем или возобновляем свою визуальную или иную активность
	},
	"new_element" : function(client, element){
	    _element = element;
	    var ui_item = {
		"type" : 'image',
		"color" : 'red',
		"childs" : {
		    "resize" :{
			"type" : 'button',
			"color" : 'blue',
			"x" : "3%",
			"y" : "1%",
			"width" : "28%",
			"heigth" : "10%"
		    },
		    "edit" : {
			"type" : 'button',
			"color" : 'blue',
			"x" : "78%",
			"y" : "1%",
			"width" : "28%",
			"heigth" : "10%"
		    },
		    "create" : {
			"type" : 'button',
			"color" : 'blue',
			"x" : "3%",
			"y" : "1%",
			"width" : "28%",
			"heigth" : "10%"
		    }
		}
	    }
	    dsa.send('ui', 'fill_element', element, ui_item);	    
	},
	"pressed" : function(client, item, state){
	    if(state == 'pressed')
		switch(item){
		    case 'resize' :
		    dsa.send('sphere.ui.area_primary', 'resize');
		    break;
		    case 'edit' : 
		    dsa.send('sphere.ui.area_primary', 'open', 'sphere.ui.editor');
		    break;
		    case 'create' :
		    dsa.send('sphere.ui.area_primary', 'open', 'sphere.ui.editor_new');
		    break;
		}
	}
    }    
}

var editor = {
}

var editor_new = {
    
}

var sphere_ui = {
    "in" : {
	"show" : function(){
	    dsa.send('ui', 'show');
	    dsa.send('sphere.ui.address_panel', 'init');
	    dsa.send('sphere.ui.area', 'init', '_primary');
	    dsa.send('sphere.ui.area', 'init', '_slave');
	    dsa.send('sphere.ui.action_panel', 'init');
	},
	"hide" : function(){
	    dsa.send('ui', 'hide');
	}	    
    }
}

