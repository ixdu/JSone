var address_panel = {
    "_element" : '',
    "address" : '',
    "in" : {
	"init" : function(){
	    //просим выделения элемента у канваса
	    send('ui', 'give_element');
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
		"image" : {
		    "color" : 'white',
		    "childs" : {
			"entry" : {
			    "name" : 'address',
			    "color" : 'grey',
			    "x" : "3%",
			    "y" : "1%",
			    "width" : "75%",
			    "heigth" : "10%"			    
			},
			"button" : {
			    "name" : 'gobutton',
			    "color" : 'red',
			    "x" : "78%",
			    "y" : "1%",
			    "width" : "20%",
			    "heigth" : "10%"
			}		    
		    }
		}
	    }
	    send('ui', 'fill_element', element, ui_item);
	},
	"typed" : function(client, item, typed){
	    //когда набирают в entry, люди приходят сообщения с тем, что уже набрано. В дальнейшем можно
	    //запросить всё, что было набрано
	    address = typed;	    
	},
	"pressed" : function(client, item, state){
	    if(state == 'pressed')
		send('sphere.ui.area_primary', 'open', address)
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
	    send('ui', 'give_element');
	},
	"visible_changed" : function(client, state){
	    //важно что поверхности, они же element, отключаются ui рекурсивно, так что может и не надо будет ничего делать
	    //тут приостанавливаем или возобновляем свою визуальную или иную активность
	},
	"new_element" : function(client, element){
	    _element = element;
	    object = 'sphere.object.welcome';
	    send('sphere.objects.welcome', 'take', element);
	},
	"resize" : function(client){
	  //изменяем размер либо до максимального либо до нормального, но только для primary  
	},
	"open" : function(client, address){
	    send(object, 'release');
	    _address = object = address;
	    send(address, 'take', element);
	}
    }    
}

var action_panel = {
    "_element" : null,
    "in" : {
	"init" : function(){
	    send('ui', 'give_element');
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
	    send('ui', 'fill_element', element, ui_item);	    
	},
	"pressed" : function(client, item, state){
	    if(state == 'pressed')
		switch(item){
		    case 'resize' :
		    send('sphere.ui.area_primary', 'resize');
		    break;
		    case 'edit' : 
		    send('sphere.ui.area_primary', 'open', 'sphere.ui.editor');
		    break;
		    case 'create' :
		    send('sphere.ui.area_primary', 'open', 'sphere.ui.editor_new');
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
	    send('ui', 'show');
	    send('sphere.ui.address_panel', 'init');
	    send('sphere.ui.area', 'init', '_primary');
	    send('sphere.ui.area', 'init', '_slave');
	    send('sphere.ui.action_panel', 'init');
	},
	"hide" : function(){
	    send('ui', 'hide');
	}	    
    }
}

