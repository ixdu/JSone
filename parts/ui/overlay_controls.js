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
		var button = {}
		button.frame = comp.frame_create(info);
		button.background = base_items.image.create( {
						      "x" : "0%",
						      "y" : "0%",
						      "width" : "100%",
						      "height" : "100%",

						      "z_index" : 2,
						      "source" : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAMSURBVBhXY3growIAAycBLhVrvukAAAAASUVORK5CYII='
						  });
		comp.frame_add(button.frame, button.background);
		button.label = base_items.text.create( {
						"x" : "10%",
						"y" : "10%",
						"width" : "80%",
						"height" : "80%",
						"z_index" : 1,
						
						"text" : info.label
					    });
		comp.frame_add(button.frame, button.label);
		
		comp.event_register(button.frame, 'pointer_down');
		
		comp.events_callback_set(function (elementId, eventName, eventData) {
					     console.log(elementId, button.frame);
					     if (elementId === button.frame && eventName === 'pointer_down') {
						 //					     console.log('hoi', comp, button);
						 comp.frame_remove(button.background);
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
			comp.frame_remove(button.frame, button.background);
			base_items.image.destroy(button.background);
			comp.frame_destroy(button.frame);
			
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
