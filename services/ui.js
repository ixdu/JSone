var comp = require('modules/Compositer.js');

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

exports.ui = function(context, send, react, sequence){
    react("init",
	  function(next){
	      context.set("elems", []);
	  });
    react("show_hide",
	  function(next){
	      var elems = context.get("elems");

	      if(context.get('visible') == true){
		  context.set('visible', false);
		  comp.change_prop(0, { "opacity" : "100%" });
		  for(elem in elems)
		      send(elems[elem].client, 'visible', 'true');
	      }else{
		  context.set('visible', true);
		  comp.change_prop(0, {"opacity" : "0%"});		  
		  for(elem in elems)
		      send(elems[elem].client, 'visible', 'false');
	      }
	      
	  });
    
    //elements messages
    react("give_element",
	  function(next, client){
	      var elems = context.get("elems");
	      var element = {
		  "id" : uuid.generate_str(),
		  "client" : back,
		  "frame" : Compositer.frame_create()
	      }
	      elems[element.id] = element;
	      context.set("elems", elems);
	      next(element.id);
	  });
 
   //ui_tree - this is json definition of nested simple ui elements like buttons, entry, labels
    react("fill_element",
	  function(next, element_id, ui_tree){
	      var elems = context.get("elems");
	      elems[element_id].tree = create_tree(comp, elems[element_id].frame, ui_tree);
	      context.set("elems", elems);
	      //парсим тут дерево и реализуем разные элементы:)
	  });
	   
    //ui_modificator is like ui_tree, but consist delete element for deleting exists elements. New
    // elements added to exists tree, exists elements changed
    react("change_element",
	  function(next, element_id, ui_modificator){
	      
	  });
    
    react("hide_element",
	  function(next, element_id){
	  });

/*	"out" : {
	    //for all visual elements
	    //state is shown or hided
	    "visible" : function(state){},
	    //for entry
	    "typed" : function(item, typed){},
	    //for button
	    "pressed" : function(item, state){}
	}
    }
*/
}
