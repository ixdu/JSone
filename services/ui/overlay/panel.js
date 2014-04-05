/*
 * Panel widget
 * 
 * properties: orientation, percent_slide, click_to_slide
 * 
 * events: slide, unslide
 */

exports.init = function(env, context, send, react, sprout){
    var ui = env.dsa.parts.ui.get(env);
    var panels = [];
    react("create",
	  function(stack, info){
	      var panel = {
		  "orientation" : "bottom"
	      };
	      
	      if(info.hasOwnProperty('on_slide'))
		  panel.on_slide = info.on_slide;
	      
	      panel._frame = ui.comp.frame_create(info);
	      panels[panel._frame] = panel;
              
	      panel.bg_image = ui.comp.image_create({
						      width : '100%',
						      height : '100%',

						      x : '0%',
						      y : '0%',

						      z_index : 1,
						      source : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAMSURBVBhXY2D4zwAAAgIBANHTRkQAAAAASUVORK5CYII='	
						  });
	      ui.comp.frame_add(panel._frame, panel.bg_image);

	      ui.comp.frame_add(0, panel._frame);
	      console.log('panel is ', panel._frame);

	      return panel._frame;
	  });

    react("add",
	 function(stack, id, child){
	     ui.comp.frame_add(id, child); 
	 });

    react("update",
	  function(stack, id, updating_info){
	      
	  });

    react("destroy",
	  function(stack, id){
	  });
}
