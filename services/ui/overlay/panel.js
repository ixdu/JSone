/*
 * Panel widget
 * 
 * properties: orientation, percent_maximize
 * 
 * events: maximized, minimized
 */

exports.init = function(env, context, send, react, sprout){
    var ui = env.dsa.parts.ui.get(env);
    var panels = [];

    react("create",
	  function(stack, info, add_to_obj, add_to_field){
	      var panel = {
		  position : "top",
		  on_slide : function(){},
		  maximized : false,
		  animating : false
	      };
	      
	      if(info.hasOwnProperty('on_slide'))
		  panel.on_slide = info.on_slide;

	      if(info.hasOwnProperty('position'))
		  panel.position = info.position;

	      if(info.hasOwnProperty('maximized'))
		  panel.maximized = info.maximized;
	      
	      if(!panel.maximized&&
		 panel.position == 'top'){
		  info.y = '-20%';
	      }

	      if(!panel.maximized&&
		 panel.position == 'bottom')
		  info.y = '90%';

	      panel._frame = ui.comp.frame_create(info);
	      panel._maximized_frame = ui.comp.frame_create({
								x : "0%",
								y : panel.position == 'top' ? '0%' : '60%',
								width : "100%",
								height : "60%",
								z_index : 4
							    });
	      panel._minimized_frame = ui.comp.frame_create({
								x : "0%",
								y : panel.position == 'top' ? '60%' : '0%',
								width : "100%",
								height : "40%",
								z_index : 3
							    });
	      panels[panel._frame] = panel;
              
	      panel.bg_image = ui.comp.image_create({
						      width : '100%',
						      height : '100%',

						      x : '0%',
						      y : '0%',

						      z_index : 6,
						      source : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAMSURBVBhXY2D4zwAAAgIBANHTRkQAAAAASUVORK5CYII='	
 						  });
	      ui.comp.frame_add(panel._frame, panel.bg_image);
	      ui.comp.frame_add(panel._frame, panel._maximized_frame);
	      ui.comp.frame_add(panel._frame, panel._minimized_frame);
	      //offset is hardcoded, but must be calculated from height
	      var aslide_down = ui.comp.anim_create([
						      {
							  duration : 100,
							  actions : {
							      y : panel.position == 'top' ? 15 : -15
							  }
						      },
						      {
							  duration : 300,
							  actions : {
							      y : panel.position == 'top' ? 5 : -5
							  }
						      }
						  ]);
	      var baslide_down = ui.comp.anim_bind(panel._frame, aslide_down);

	      var aslide_up = ui.comp.anim_create([
						      {
							  duration : 100,
							  actions : {
							      y : panel.position == 'top' ? -15 : 15
							  }
						      },
						      {
							  duration : 300,
							  actions : {
							      y : panel.position == 'top' ? -5 : 5
							  }
						      }
						  ]);

	      var baslide_up = ui.comp.anim_bind(panel._frame, aslide_up);
	      
	      ui.comp.event_register(baslide_down, 'animation_stopped');
	      ui.comp.event_register(baslide_up, 'animation_stopped');
	      ui.comp.event_register(panel._frame, 'pointer_down');
	      ui.comp.event_register(panel._frame, 'pointer_in', function(eventName, eventData){
					 switch(eventName){
					     case 'animation_stopped':
					     console.log('eeeeg');
					     panel.animating = false;
					     break;

					     case 'pointer_in' : 
					     if(!panel.animating){
						 if(!panel.maximized){
						     ui.comp.anim_start(baslide_down);			
						     panel.maximized = true;
						     panel.animating = true;
						 }
					     }
					     break;
					     case 'pointer_down' :
					     if(!panel.animating){
						 if(panel.maximized){
						     ui.comp.anim_start(baslide_up);			
						     panel.maximized = false;
						     panel.animating = true;
						 }
					     }
					     break;
					 }
				     })

	      if(typeof(add_to_obj) == 'string' &&
		 typeof(add_to_field) == 'string'){
		  ui.comp.frame_add(stack[add_to_obj][add_to_field], panel._frame);
	      }

	      return {
		  "_frame" : panel._frame,
		  "maximized" : panel._maximized_frame,
		  "minimized" : panel._minimized_frame
	      };
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
