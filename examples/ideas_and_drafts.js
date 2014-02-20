var canvas = {
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
	"fill" : function(client, element, ui_item){
	    //парсим тут дерево и реализуем разные элементы:)
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
    "in" : {
	"show" : function(){
	    //просим выделения элемента у канваса
	    dsa.send('sphere.ui.canvas', 'give_element');
	},
	"visible_changed" : function(client, state){
	    //тут приостанавливаем или возобновляем свою визуальную или иную активность
	},
	"new_element" : function(client, element){
	    //получаем запрошенный элемент. Примичательно, что можем получить новый в результате удаления
	    //старого и создания нового без нашего ведома:)
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
				"heigth" : "98%"
		    },
		    "gobutton" : {
			"type" : 'button',
			"color" : 'red',
			"x" : "78%",
			"y" : "1%",
			"width" : "20%",
			"heigth" : "98%"
		    }
		}
	    }
	    dsa.send('sphere.ui.canvas', 'fill', element, ui_item);
	},
	"typed" : function(client, item, typed){
	    //когда набирают в entry, люди приходят сообщения с тем, что уже набрано. В дальнейшем можно
	    //запросить всё, что было набрано
	},
	"pressed" : function(client, item, state){
	    //приходит при нажатии кнопки, сообщает о состоянии нажатой кнопки - pressed, unpressed
	}
    }
}

var sphere_ui = {
    "in" : {
	"show" : function(){
	    dsa.send('sphere.ui.canvas', 'show');
	    dsa.send('sphere.ui.address_panel', 'show');
	    dsa.send('sphere.ui.slave_area', 'show');
	    dsa.send('sphere.ui.primary_area', 'show');
	    dsa.send('sphere.ui.action_pane', 'show');
	    //	    action_panel(maximize<->normalize, edit, create)
	},
	"hide" : function(){
	    dsa.send('sphere.ui.canvas', 'hide');
	}	    
    }
}

var worker = {
    "in" : {
	"do" : function(){
	    var sui = dsa.find('sphere.ui');
	    dsa.send(sui, 'show');

	    var elem_id = 'some id';
	    var elements = dsa.find('sphere.elements');
	    dsa.on(elements, 'element', function(element){
		       
		   })
	    dsa.send(elements, 'query_by_id', elem_id);
	}
    }
}
\