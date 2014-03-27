//var comp = window.Compositer;

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

exports.init = function(context, send, react, sequence){
    react("init",
	  function(next){
	      context.set("elems", []);
	  });
    react("paint",
	 function(next){
	     var comp = new Compositer();
	     var root = 0,

             frame = comp.frame_create(
                 {
                     width : '25%',
                     height : '25%',

                     x : '0%',
                     y : '0%',

                     z_index : '1'
                 }
             ),

             image_red = comp.image_create(
                 {
                     width : '100%',
                     height : '100%',

                     x : '0%',
                     y : '0%',

                     z_index : '1',

                     source : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAMSURBVBhXY3growIAAycBLhVrvukAAAAASUVORK5CYII='
                 }
             ),

             image_green = comp.image_create(
                 {
                     width : '80%',
                     height : '80%',

                     x : '10%',
                     y : '10%',

                     z_index : '2',

                     source : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAMSURBVBhXY2D4zwAAAgIBANHTRkQAAAAASUVORK5CYII='
                 }
             ),

             image_blue = comp.image_create(
                 {
                     width : '60%',
                     height : '60%',

                     x : '20%',
                     y : '20%',

                     z_index : '3',

                     source : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAMSURBVBhXY2Bg+A8AAQMBAKJTBdAAAAAASUVORK5CYII='
                 }
             ),

             anim_right = comp.anim_create([
					       {
						   duration : 0,

						   actions :
						   {
						       x : 25
						   }
					       }
					   ]),

             anim_down = comp.anim_create([
					      {
						  duration : 0,

						  actions :
						  {
						      y : 25
						  }
					      }
					  ]),

             anim_left = comp.anim_create([
					      {
						  duration : 0,

						  actions :
						  {
						      x : -25
						  }
					      }
					  ]),

             anim_up = comp.anim_create([
					    {
						duration : 0,

						actions :
						{
						    y : -25
						}
					    }
					]),

             bind_right = comp.anim_bind(frame, anim_right),
             bind_down  = comp.anim_bind(frame, anim_down),
             bind_left  = comp.anim_bind(frame, anim_left),
             bind_up    = comp.anim_bind(frame, anim_up),

             animation = {
                 counter : 0,
                 animation : 0,

                 animations :
                 [
                     bind_right,
                     bind_down,
                     bind_left,
                     bind_up
                 ],

                 get : (function () {
                            if (this.counter++ === 3) {
				this.counter = 1;

				if (this.animation++ === 3) {
                                    this.animation = 0;
				}
                            }

                            return this.animations[this.animation];
			})
             };

             comp.event_register(frame, 'pointer_down');

             comp.events_callback_set(function (elementId, eventName, eventData) {
					  if (elementId === frame && eventName === 'pointer_down') {
					      comp.anim_start(animation.get());
					  }
				      });

             comp.frame_add(frame, image_red);
             comp.frame_add(frame, image_green);
             comp.frame_add(frame, image_blue);

             comp.frame_add(root, frame);
	 })
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
