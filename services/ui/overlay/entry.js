/*
 * Entry widget
 * 
 * properties: text, selected_text, read_only, max_length, cursor_position
 * 
 * events: editing_finished, selection_changed, text_changed, cursor_position_changed
 */

exports.init = function(env, context, send, react, sequence){
    var ui = env.dsa.parts.ui.get(env);
    var entries = [];

    react("create",
	  function(next, info){
	      var entry = {
		  text : ''  
	      };
	      
	      if(info.hasOwnProperty('on_text_changed'))
		  entry.on_text_changed = info.on_text_changed;

	      entry._frame = ui.comp.frame_create(info);	      

	      entries[entry._frame] = entry;
	      console.log('entry is ', entry._frame);

	      next(entry._frame);
	  });
    
    react("update",
	  function(next, updating_info){
	      
	  });

    react("destroy",
	  function(next, id){
	  });
}
