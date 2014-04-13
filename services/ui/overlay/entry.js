/*
 * Entry widget
 * 
 * properties: text, selected_text, read_only, max_length, cursor_position
 * 
 * events: editing_finished, selection_changed, text_changed, cursor_position_changed
 */

exports.init = function(env, dsa){
    var ui = env.dsa.parts.ui.get(env);
    var entries = [];

    dsa.on("create",
	   function(stack, info, add_to_obj, add_to_field){
	       var entry = {
		   text : ''  
	       };
	       
	       if(info.hasOwnProperty('on_text_change'))
		   entry.on_text_changed = info.on_text_changed;

	       entry._frame = ui.comp.frame_create(info);	      

	       entry.bg_image = ui.base_items.image.create( 
		   {
		       "x" : "0%",
		       "y" : "0%",
		       "width" : "100%",
		       "height" : "100%",
		       
		       "z_index" : 1,
		       "opacity" : 100,
		       
		       "source" : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAMSURBVBhXY2Bg+A8AAQMBAKJTBdAAAAAASUVORK5CYII='
		   });
	       ui.comp.frame_add(entry._frame, entry.bg_image);

	       entry._entry = ui.comp.entry_create({
						       width : '100%',
						       height: '100%',
						       x : '0%',
						       y : '0%',
						       z_index : 3,
						       opacity : 100,
						       
						       placeholder : info.hasOwnProperty('placeholder') ? info.placeholder : 'please type a text'
						   });

	       ui.comp.frame_add(entry._frame, entry._entry);
	       ui.comp.entry_get_control(entry._entry).on_text_change(function(text){
									  console.log('text is ', text);
								      });

	       /*	      ui.comp.event_register(0, 'key_down');
		ui.comp.event_register(0, 'key_up', function(eventName, eventData){
		entry.text += String.fromCharCode(eventData.key_obj.keynum);
		if(entry.hasOwnProperty('on_text_changed')){
		var stack = [];
		stack['text'] = entry.text;
		console.log(JSON.stringify(entry.on_text_changed));
		dsa.sprout(entry.on_text_changed, { text : entry.text });	     
		}

		if(entry.hasOwnProperty('text_item')){
		ui.comp.frame_remove(entry.text_item);
		ui.comp.text_destroy(entry.text_item);
		}
		
		entry.text_item = ui.comp.text_create({
		width : '90%',
		height: '90%',
		x : '5%',
		y : '5%',
		z_index : 3,
		opacity : 100,
		
		text : entry.text
		});
		ui.comp.frame_add(entry._frame, entry.text_item);
		});
		*/
	       

	       entries[entry._frame] = entry;
	       console.log('entry is ', entry._frame);

	       if(typeof(add_to_obj) == 'string' &&
		  typeof(add_to_field) == 'string'){
		   ui.comp.frame_add(stack[add_to_obj][add_to_field], entry._frame);
	       }

	       return {
		   _frame : entry._frame  
	       };
	   });

    //    dsa.on("be_added",
    //	  function(stack, )

    dsa.on("update",
	   function(stack, updating_info){
	       
	   });

    dsa.on("destroy",
	   function(stack, id){
	   });
}
