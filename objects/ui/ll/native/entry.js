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
	   function(sprout, stack, info){
	       var entry = {
		   text : ''  
	       };
	       
	       if(info.hasOwnProperty('on_text_change'))
		   entry.on_text_changed = info.on_text_changed;

	       entry._frame = ui.comp.frame_create(info);	      


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

	       entries[entry._frame] = entry;

	       if(stack['parent'] != undefined)
		   ui.comp.frame_add(stack['parent'].frame, entry._frame);
	       else {
		   ui.comp.frame_add(0, entry._frame);
	       }
	   });

    dsa.on("update",
	   function(sprout, stack, updating_info){
	       
	   });

    dsa.on("destroy",
	   function(sprout, stack, id){
	   });
}
