/*
 * Container widget
 * 
 * properties: slide_direction
 * 
 * events: slide
 */

exports.init = function(env, dsa){
    var ui = env.dsa.parts.ui.get(env);
    var containers = [];

    dsa.on("create",
	   function(stack, info, parent){
	       var container = {
		   on_slide : function(){},
		   sliding : false,
		   x : 0,
		   prev_x : 0,
		   animating : false
	       };

	       container._parent_frame = ui.comp.frame_create(info);

	       container._frame1 = ui.comp.frame_create({
							    x : '0%',
							    y : '0%',
							    width : '100%',
							    height : '100%'
							});

	       container._frame2 = ui.comp.frame_create({
							    x : '50%',
							    y : '0%',
							    width : '50%',
							    height : '100%'
							});

	       var move_animations = {
		   
	       };

	       function create_anim_by_x(cur_x){
		   var anim_proto = [{
					 duration : 0,
					 actions : {
					     x : 0
					 }
				     }
				    ];
		   var anim,
		   banim,
		   offset;
		   
		   offset = cur_x - container.prev_x;
		   container.prev_x = cur_x;
		   
		   anim_proto[0].actions.x = offset;
		   container.x += offset;
		   
		   console.log(offset);
		   if(typeof(move_animations['xr' + offset]) == 'undefined'){
		       move_animations['xr' + offset] = anim = ui.comp.anim_create(anim_proto);
		       move_animations['bxr' +  offset] = banim = ui.comp.anim_bind(container._parent_frame, anim);
		       console.log('banim is', anim);
		       ui.comp.event_register(banim, 'animation_stopped');		      
		   } else
		       banim = move_animations['bxr' + offset];

		   ui.comp.anim_start(banim);		  
	       }

//	       ui.comp.event_register(container._parent_frame, 'pointer_motion');
	       ui.comp.event_register(container._parent_frame, 'pointer_up');
	       ui.comp.event_register(container._parent_frame, 'pointer_out');
	       ui.comp.event_register(container._parent_frame, 'pointer_down', function(eventName, eventData){
					  switch(eventName){
					  case 'animation_stopped' :
					      container.animating = false;
					      break;

					  case 'pointer_motion' : 
					      var cur_x = Math.round(eventData.pointer_obj[0].x);
					      if(!container.animating &&
						 container.sliding){
						  container.animating = true;
						  create_anim_by_x(cur_x);
					      }
					      break;

					  case 'pointer_down' :
					      container.prev_x = Math.round(eventData.pointer_obj[0].x);
					      container.sliding = true;
					      break;

					  case 'pointer_up' :
					  case 'pointer_out' :
					      container.sliding = false;
					      break;
					  }
				      });

	       ui.comp.frame_add(container._parent_frame, container._frame1);
//	       ui.comp.frame_add(container._parent_frame, container._frame2);
	       if(stack['parent'] != undefined)
		   ui.comp.frame_add(stack['parent'].frame, container._parent_frame);
	       else {
		   ui.comp.frame_add(0, container._parent_frame);
	       }

	       stack['parent'] = {
		   frame : container._parent_frame
	       }
	       //	      ui.comp.anim_start(bsliding_anim_left);
	       //	      ui.comp.anim_start(bsliding_anim_right);

	   });
}