function create_tree(comp, frame, ui_tree){
    var obj_tree = {
    }
    for(element in ui_tree){
	switch(ui_tree){
	    case 'image' :
	    break;
	    case 'button' : 
	    break;
	    case 'entry' :
	    break;
	}
    }
    return obj_tree;
}

exports.init = function(send, react){
    var frame = null,
    elements = {};

    return { 
	"in" :{
	    "show" : function(client){
		if(frame)
		    frame = Compositer.frame_create();
	    },
	    "hide" : function(client){
		for(elem in elements)
		    send(elements[elem].client, 'visible_changed', 'hidden');
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
		elements[element.id](element);
		send(client, 'new_element', element.id);
	    },
	    //ui_tree - this is json definition of nested simple ui elements like buttons, entry, labels
	    "fill_element" : function(client, element_id, ui_tree){
		elements[element_id].tree = create_tree(comp, elements[element_id].frame, ui_tree);	
		//парсим тут дерево и реализуем разные элементы:)
	    },
	    //ui_modificator is like ui_tree, but consist delete element for deleting exists elements. New
	    // elements added to exists tree, exists elements changed
	    "change_element" : function(client, element, ui_modificator){
		
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
}
