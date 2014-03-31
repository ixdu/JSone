//image and text based ui controls

exports.create = function(comp, base_items, sequence){
    var buttons = [],
    entries = [];

    return {
	"button" : {
	    /*
	     * Button widget
	     * 
	     * properties : state, label, activated
	     * 
	     * events: pressed, unpressed
	     */
	    "create" : function(info){
		var button = {
		    pressed : false
		}
		if(info.hasOwnProperty('on_pressed'))
		    button.on_pressed = info.on_pressed;
		info.color = '#ffffff';
		button.frame = comp.frame_create(info);
		button.pressed_bg = base_items.image.create( 
		    {
			"x" : "1%",
			"y" : "1%",
			"width" : "98%",
			"height" : "98%",
			
			"z_index" : 2,
			"opacity" : 100,

			"source" : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAMSURBVBhXY2Bg+A8AAQMBAKJTBdAAAAAASUVORK5CYII='
		    });
		comp.frame_add(button.frame, button.pressed_bg);

		button.unpressed_bg = base_items.image.create( 
		    {
			"x" : "1%",
			"y" : "1%",
			"width" : "98%",
			"height" : "98%",
			
			"z_index" : 2,
			"opacity" : 100,

			"source" : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAMSURBVBhXY3growIAAycBLhVrvukAAAAASUVORK5CYII='
		    });

		comp.frame_add(button.frame, button.unpressed_bg);

		button.pressed_anim = comp.anim_create([{
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

		button.binded_pressed_anim = comp.anim_bind(button.unpressed_bg, button.pressed_anim);

		button.label = base_items.text.create( {
						"x" : "10%",
						"y" : "10%",
						"width" : "80%",
						"height" : "80%",
						"z_index" : 1,
						
						"text" : info.label
					    });
		comp.frame_add(button.frame, button.label);
		
		comp.event_register(button.binded_pressed_anim, 'animation_stopped');
		comp.event_register(button.unpressed_bg, 'pointer_down', function(eventName, eventData){
					if(eventName == 'animation_stopped')
					    button.pressed = false;
				    });

		comp.event_register(button.frame, 'pointer_down', function(eventName, eventData){
					if(eventName == 'pointer_down'){
					    if(!button.pressed){
						button.pressed = true;					    
						comp.anim_start(button.binded_pressed_anim);
						if(button.hasOwnProperty('on_pressed')){
						    sequence(button.on_pressed);
						}
					    }
					}
				    });
		
		
		buttons.push(button.frame, button);	    
		
		return button.frame;
	    },
	    "update" : function(updating_info){
		
	    },
	    "destroy" : function(id){
		var buttons_length = buttons.length - 1;
		while(buttons_length >= 0){
		    if(buttons[ind] == id){
			var button = buttons[id];
			buttons.splice(id, 0);
			comp.frame_remove(button.frame, button.label);
			base_items.text.destroy(button.label);
			comp.frame_remove(button.frame, button.unpressed_bg);
			base_items.image.destroy(button.unpressed_bg);
			comp.frame_remove(button.frame, button.pressed_bg);
			base_items.image.destroy(button.pressed_bg);
			comp.frame_destroy(button.frame);
			comp.anim_unbing(button.binded_pressed_anim);
			comp.anim_destroy(button.pressed_anim);
			return;
		    }
		}   
	    }
	},
	
	/*
	 * Entry widget
	 * 
	 * properties: text, selected_text, read_only, max_length, cursor_position
	 * 
	 * events: editing_finished, selection_changed, text_changed, cursor_position_changed
	 */

	"entry" : {
	    "create" : function(info){
		return 0;
	    },
	    "update" : function(updating_info){
		
	    },
	    "destroy" : function(){
	    }
	}
    }
}
