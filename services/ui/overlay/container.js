/*
 * Container widget
 * 
 * properties: slide_direction
 * 
 * events: slide
 */

//history, animated part, two and more work frame
/*
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
		   
		   if(typeof(move_animations['xr' + offset]) == 'undefined'){
		       move_animations['xr' + offset] = anim = ui.comp.anim_create(anim_proto);
		       move_animations['bxr' +  offset] = banim = ui.comp.anim_bind(container._parent_frame, anim);
//		       console.log('banim is', anim);
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
*/


exports.init = function(env, dsa){
    var ui = env.dsa.parts.ui.get(env);
    var containers = [];

    dsa.on("create",
	   function(sprout, stack, info){
	       var container = {
//		   on_slide : function(){},
//		   sliding : false,
//		   x : 0,
//		   prev_x : 0,
//		   animating : false,
		   childs : []
	       };

	       container._main_frame = ui.comp.frame_create(info);

	       container._frame1 = ui.comp.frame_create({
							    x : '0%',
							    y : '0%',
							    width : '100%',
							    height : '100%'
							});
	       ui.comp.frame_add(container._main_frame, container._frame1);
//	       ui.comp.frame_add(container._parent_frame, container._frame2);
	       if(stack['parent'] != undefined){
		   container.parent = stack.parent;
	       } else {
		   container.parent = { frame : 0 };
	       }
	       
	       ui.comp.frame_add(container.parent.frame, container._main_frame);

	       stack['parent'] = {
		   frame : container._main_frame
	       };
	       
	       containers[container._main_frame] = container;
	   });
    
    dsa.on('add_child', 
	   function(sprout, stack, type, id){
	       childs[id] = type;
	   });
    
    dsa.on('destroy', 
	   function(sprout, stack, id){
	       var container_frame = typeof(id) !== 'undefined' ? id.frame : stack.parent.frame;
	       var ui = env.dsa.parts.ui.get(env),
	           container = containers[container_frame],
	           adisappear = ui.comp.anim_create([
							{
							    duration : 700,
							    actions : {
								opacity : 100
							    }
							}
						    ]),
	           badisappear = ui.comp.anim_bind(container._main_frame, adisappear);
	       
	       ui.comp.event_register(badisappear, 'animation_stopped');
	       ui.comp.event_register(container._main_frame, 'animation_stopped', 
				      function(eventName, eventData){
					  ui.comp.frame_remove(container._main_frame);
					  
					  ui.comp.frame_destroy(container._main_frame);
					  //	       for(child_id in container.childs){
					  //		   dsa.send()
					  //	       }
					  stack.parent = container.parent;
					  dsa.sprout.run(sprout, stack);
				      });
	       ui.comp.anim_start(badisappear);
	       return true;
//	       alert('приветеге');
	   });
};