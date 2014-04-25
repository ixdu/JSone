/*
 * Button widget
 * 
 * properties : state, label, activated
 * 
 * events: pressed, unpressed
 */

exports.init = function(env, dsa){
    var ui = env.dsa.parts.ui.get(env);
    var buttons = [];

    dsa.on("create", 
	   function(sprout, stack, info){
	       var button = {
		   pressed : false,
		   animating : false
	       };
	       
	       if(info.hasOwnProperty('on_pressed'))
		   button.on_pressed = info.on_pressed;
	       
	       button._frame = ui.comp.frame_create(info);
	       button.pressed_bg = ui.base_items.image.create( 
		   {
		       "x" : "0%",
		       "y" : "0%",
		       "width" : "100%",
		       "height" : "100%",
		       
		       "z_index" : 2,
		       "opacity" : 100,

		       "source" : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAMSURBVBhXY2Bg+A8AAQMBAKJTBdAAAAAASUVORK5CYII='
		   });
	       ui.comp.frame_add(button._frame, button.pressed_bg);

	       button.unpressed_bg = ui.base_items.image.create( 
		   {
		       "x" : "0%",
		       "y" : "0%",
		       "width" : "100%",
		       "height" : "100%",
		       
		       "z_index" : 2,
		       "opacity" : 100,

		       "source" : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAMSURBVBhXY3growIAAycBLhVrvukAAAAASUVORK5CYII='
		   });

	       ui.comp.frame_add(button._frame, button.unpressed_bg);

	       button.press_anim = ui.comp.anim_create([{
							    duration : 150,
							    actions : {
								opacity : -80
							    }
							},
							{
							    duration : 150,
							    actions : {
								opacity : 80
							    }
							}
						       ])

	       button.binded_press_anim = ui.comp.anim_bind(button.unpressed_bg, button.press_anim);

	       button.label = ui.base_items.text.create( {
							     "x" : "10%",
							     "y" : "10%",
							     "width" : "80%",
							     "height" : "80%",
							     "z_index" : 1,
							     
							     "text" : info.label
							 });
	       ui.comp.frame_add(button._frame, button.label);
	       
	       ui.comp.event_register(button.binded_press_anim, 'animation_stopped');
	       ui.comp.event_register(button.unpressed_bg, 'pointer_up', function(eventName, eventData){
					  if(eventName == 'animation_stopped') {			
					      button.animating = false;
					  }
				      });
	       ui.comp.event_register(button._frame, 'pointer_up');
	       ui.comp.event_register(button._frame, 'pointer_out');
	       ui.comp.event_register(button._frame, 'pointer_down', function(eventName, eventData){
					  switch(eventName){
					  case 'animation_stopped' :
//					      console.log('eehhhh');
					      button.animating = false;
					      break;
					  case 'pointer_down' : 
					      if(!button.pressed){
						  if(!button.animating){
						      button.pressed = true;	
						      button.animating = true;
						      ui.comp.anim_start(button.binded_press_anim);
						      if(button.hasOwnProperty('on_pressed')){
							  dsa.sprout.run(button.on_pressed);
						      }						  
						  }
					      }
					      break;

					  case 'pointer_out':
					  case 'pointer_up' :
					      if(button.pressed){
						  button.pressed = false;
					      }
					      break;
					  }
				      });
	       
	       
	       buttons[button._frame] = button;
	       
	       if(stack['parent'] != undefined)
		   ui.comp.frame_add(stack['parent'].frame, button._frame);
	       else {
		   console.log('eeeetoooot');
		   ui.comp.frame_add(0, button._frame);
	       }
	   });
    
    dsa.on("destroy",
	   function(sprout, stack, id){
	       comp.frame_remove(button.frame, button.label);
	       base_items.text.destroy(button.label);
	       comp.frame_remove(button.frame, button.unpressed_bg);
	       base_items.image.destroy(button.unpressed_bg);
	       comp.frame_remove(button.frame, button.pressed_bg);
	       base_items.image.destroy(button.pressed_bg);
	       comp.frame_destroy(button.frame);
	       comp.anim_unbing(button.binded_press_anim);
	       comp.anim_destroy(button.press_anim);
	       comp.anim_unbing(button.binded_unpress_anim);
	       comp.anim_destroy(button.unpress_anim);
	   });

    dsa.on("update",
	   function(sprout, stack, id, updating_info){
	       
	   });
}