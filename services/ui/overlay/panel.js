/*
 * Panel widget
 * 
 * properties: orientation, percent_slide, click_to_slide
 * 
 * events: slide, unslide
 */

exports.init = function(env, context, send, react, sequence){
    var ui = env.dsa.parts.ui.get(env);
    var panels = [];
    react("create",
	  function(next, info){
	      var panel = {
		  "orientation" : "bottom"
	      };
	      
	      if(info.hasOwnProperty('on_slide'))
		  panel.on_slide = info.on_slide;
	      
	      panel._frame = ui.comp.frame_create(info);
	      panels[panel._frame] = panel;
	      
	      ui.comp.frame_add(0, panel._frame);
	      console.log('panel is ', panel._frame);
	      next(panel._frame);
	  });

    react("add",
	 function(next, id, child){
	     ui.comp.frame_add(id, child); 
	 });

    react("update",
	  function(next, id, updating_info){
	      
	  });

    react("destroy",
	  function(next, id){
	  });
}
