/*
 * Panel widget
 * 
 * properties: orientation, percent_maximize
 * 
 * events: maximized, minimized
 */

exports.init = function(env, dsa){
    var ui = env.dsa.parts.ui.get(env);
    var panels = [];

    dsa.on("create",
	   function(sprout, stack, info, add_to_obj, add_to_field){
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
	       panel._maximized_parent_frame = ui.comp.frame_create({
									x : "0%",
									y : panel.position == 'top' ? '-40%' : '40%',
									width : "100%",
									height : "100%",
									z_index : 3
								    });

	       panel._maximized_frame = ui.comp.frame_create({
								 x : "0%",
								 y : panel.position == 'top' ? '0%' : '30%',
								 width : "100%",
								 height : "70%",
								 z_index : 2
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
	       
	       panel._minimize_button_frame = ui.comp.frame_create(
		   {
		       x : panel.position == 'top' ? '80%' : '0%',
		       y : panel.position == 'top' ? '70%' : '0%',
		       width : '20%',
		       height : '30%'
		   }
	       );

	       panel.minimize_button_bg = ui.base_items.image.create( 
		   {
		       "x" : "0%",
		       "y" : "0%",
		       "width" : "100%",
		       "height" : "100%",
		       
		       "z_index" : 2,

		       "source" : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAMSURBVBhXY2Bg+A8AAQMBAKJTBdAAAAAASUVORK5CYII='
		   });

	       ui.comp.frame_add(panel._minimize_button_frame, panel.minimize_button_bg);

	       panel.minimize_button_text = ui.base_items.text.create(
		   {
		       "x" : "10%",
		       "y" : "0%",
		       "width" : "80%",
		       "height" : "100%",

		       text : 'свернуть'
		   });

	       ui.comp.frame_add(panel._minimize_button_frame, panel.minimize_button_text);

	       ui.comp.frame_add(panel._frame, panel.bg_image);
	       ui.comp.frame_add(panel._frame, panel._minimized_frame);
	       ui.comp.frame_add(panel._frame, panel._maximized_parent_frame);
	       ui.comp.frame_add(panel._maximized_parent_frame, panel._maximized_frame);
	       ui.comp.frame_add(panel._maximized_parent_frame, panel._minimize_button_frame);
	       //offset is hardcoded, but must be calculated from height
	       
	       var maximized_down = ui.comp.anim_create([{
							     duration : 50,
							     actions : {
								 y : panel.position == 'top' ?  70: -70
							     }
							 }
							]);

	       var bmaximized_down = ui.comp.anim_bind(panel._maximized_parent_frame, maximized_down);

	       var maximized_up = ui.comp.anim_create([{
							   duration : 50,
							   actions : {
							       y : panel.position == 'top' ? -70 : 70
							   }
						       }
						      ]);
	       var bmaximized_up = ui.comp.anim_bind(panel._maximized_parent_frame, maximized_up);

	       var aslide_down = ui.comp.anim_create([
							 {
							     duration : 80,
							     actions : {
								 y : panel.position == 'top' ? 8 : -8
							     }
							 }
						     ]);
	       var baslide_down = ui.comp.anim_bind(panel._frame, aslide_down);

	       var aslide_up = ui.comp.anim_create([
						       {
							   duration : 80,
							   actions : {
							       y : panel.position == 'top' ? -8 : 8
							   }
						       }
						   ]);

	       var baslide_up = ui.comp.anim_bind(panel._frame, aslide_up);
	       

	       ui.comp.event_register(baslide_down, 'animation_stopped');
	       ui.comp.event_register(baslide_up, 'animation_stopped');
	       ui.comp.event_register(panel._frame, 'pointer_down', function(eventName, eventData){
					  switch(eventName){
					  case 'animation_stopped':
					      //					     console.log('eeeeg');
					      panel.animating = false;
					      break;

					  case 'pointer_down' : 
					      if(!panel.animating){
						  if(!panel.maximized){
						      ui.comp.anim_start(baslide_down);
						      ui.comp.anim_start(bmaximized_down);
						      panel.maximized = true;
						      panel.animating = true;
						  }
					      }
					      break;
					  }
				      });

	       ui.comp.event_register(panel._minimize_button_frame, 'pointer_down', function(eventName, eventData){
					  if(!panel.animating){
					      if(panel.maximized){
						  ui.comp.anim_start(baslide_up);
						  ui.comp.anim_start(bmaximized_up);
						  panel.maximized = false;
						  panel.animating = true;
					      }
					  }
				      });

	       if(stack['parent'] != undefined)
		   ui.comp.frame_add(stack['parent'].frame, panel._frame);
	       else {
		   ui.comp.frame_add(0, panel._frame);
	       }

	       stack['parent'] = {
		   frame : panel._frame,
		   maximimized : panel._maximized_frame,
		   minimized : panel._minimized_frame
	       };

	   });

    dsa.on("add",
	   function(sprout, stack, id, child){
	       ui.comp.frame_add(id, child); 
	   });

    dsa.on("update",
	   function(sprout, stack, id, updating_info){
	       
	   });

    dsa.on("destroy",
	   function(stack, id){
	   });
}
