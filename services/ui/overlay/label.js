/*
 * Label widget
 * 
 * properties : text, image
 * 
 * events: 
 */

exports.init = function(env, context, send, react, sprout){

    var ui = env.dsa.parts.ui.get(env);
    var labels = [];

    react("create", 
	  function(stack, info, add_to_obj, add_to_field){
	      var label = {
		  text : 'label',
		  image : null
	      };

	      if(info.hasOwnProperty('text'))
		  label.text = info.text;
	      if(info.hasOwnProperty('image'))
		  label.image = info.image;
	      
	      label._frame = ui.comp.frame_create(info);

	      if(label.image == null){
		  label.content = ui.base_items.text.create( 
		      {
			  "x" : "0%",
			  "y" : "0%",
			  "width" : "100%",
			  "height" : "100%",
			  
			  "z_index" : 2,
			  
			  "text" : label.text
		      });
	      } else
		  label.content = ui.base_items.image.create( 
		      {
			  "x" : "0%",
			  "y" : "0%",
			  "width" : "100%",
			  "height" : "100%",
			  
			  "z_index" : 2,
			  
			  "source" : label.image
		      });
	      

	      ui.comp.frame_add(label._frame, label.content);

	      if(typeof(add_to_obj) == 'string' &&
		 typeof(add_to_field) == 'string')
		  ui.comp.frame_add(stack[add_to_obj][add_to_field], label._frame);

	      return {
		  _frame : label._frame
	      };
	  });
    
    react("destroy",
	  function(stack, id){
	      var label = labels[id];
	      ui.comp.frame_remove(label.content);
	      ui.comp.frame_destroy(label._frame);
	      
	      if(label.image == null)
			    ui.base_items.text_destroy(label.content);
	      else
		  ui.base_items.image_destroy(label.content);
	  });
    
    react("update",
	  function(stack, id, updating_info){
	      //	      if(updating_info.hasOwnProperty('image')){
	  });
}