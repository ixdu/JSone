/*
 * Panel widget
 * 
 * properties: orientation, percent_slide, click_to_slide
 * 
 * events: slide, unslide
 */

exports.init = function(env, context, send, react, sequence){
    var ui = env.dsa.parts.ui;
    react("create",
	  function(next, info){
	      var panels = context.get('panels');
	      var panel = {
		  "orientation" : "bottom"
	      }
	      
	      if(info.hasOwnProperty('on_slide'))
		  panel.on_slide = info.on_slide;
	      
	      var panel_id = env.capsule.modules.uuid.generate_str();
	      panels[panel_id] = panel;

	      return panel_id;
	  });
    
    react("update",
	  function(next, id, updating_info){
	      
	  });

    react("destroy",
	  function(next, id){
	  });
}
