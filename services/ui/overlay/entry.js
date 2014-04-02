/*
 * Entry widget
 * 
 * properties: text, selected_text, read_only, max_length, cursor_position
 * 
 * events: editing_finished, selection_changed, text_changed, cursor_position_changed
 */

exports.init = function(env, context, send, react, sequence){
    var ui = env.dsa.parts.ui;
    react("create",
	  function(next, info){
	      var entry = {
		  
	      }
	      
	      if(info.hasOwnProperty('on_text_changed'))
		  entry.on_text_changed = info.on_text_changed;
	      
	      entries.push(entry);
	      
	      return entry.frame;
	  });
    
    react("update",
	  function(next, updating_info){
	      
	  });

    react("destroy",
	  function(next, id){
	  });
}
